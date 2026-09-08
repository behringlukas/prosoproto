// Node-only test shim. Production resolves this module in the Workers runtime.
export async function resolve(specifier,context,nextResolve){
  if(specifier==='cloudflare:workers')return {
    url:'data:text/javascript,export const env={};',shortCircuit:true,
  };
  return nextResolve(specifier,context);
}
