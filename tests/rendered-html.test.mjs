import assert from "node:assert/strict";
import test from "node:test";
import {register} from "node:module";
register("./cloudflare-loader.mjs",import.meta.url);

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});


test("board assistant rejects anonymous, cross-origin and malformed requests",async()=>{
  const {default:worker}=await import("../dist/server/index.js");
  const env={ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
  const ctx={waitUntil(){},passThroughOnException(){}};
  const call=(headers,body)=>worker.fetch(new Request("https://prototype.test/api/board-chat",{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(body)}),env,ctx);
  assert.equal((await call({},{})).status,401);
  assert.equal((await call({"oai-authenticated-user-email":"qa@example.test",origin:"https://other.test"},{})).status,403);
  const invalid=await call({"oai-authenticated-user-email":"qa@example.test"},{method:"Unknown"});
  assert.equal(invalid.status,400);
  assert.equal(invalid.headers.get("Cache-Control"),"no-store");
});
