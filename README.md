# Problem Solving · Method Studio

React and TypeScript source for the Problem Solving prototype, exported from deployed version 12 on 8 September 2026.

## Run locally

Requires Node.js 22.13 or newer and npm. The existing build/test wrappers require Bash and GNU `timeout`; Linux or Windows WSL is the easiest match for the original development environment.

```bash
git clone https://github.com/behringlukas/prosoproto.git
cd prosoproto
npm ci
npm run dev -- --host 127.0.0.1
```

If using the ZIP, extract it and open a terminal in the folder containing `package.json`, then run the last two commands. Open the local URL printed by Vite. The development script applies D1 migrations to local storage before starting the app. Keep `package-lock.json` and use `npm ci` to install the exported dependency versions.

## Optional Gemini assistant

Copy `.dev.vars.example` to `.dev.vars` in the project root and fill in your server API key, then restart development:

```dotenv
GEMINI_API_KEY="your-own-key"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

The key is optional for editing methods. Assistant requests require a configured key and access to the selected Gemini model. The original hosted API key is not part of this repository. `.dev.vars` is ignored by Git. Use a server secret when deploying, never a browser-exposed environment variable. Local secret loading follows the [Cloudflare Workers environment-variable documentation](https://developers.cloudflare.com/workers/local-development/environment-variables/).

Sending a chat message sends the current board or case context and chat history to Gemini. New board elements are presented as proposals for the user to apply.

## Included functionality

- Step 2 workspace with all 23 methods in a dropdown.
- Clicking a method adds and opens it. Documents have a separate template-download action that does not add a method.
- React Flow method templates, configurable element palettes, drawing and text elements, and method-specific connector layouts.
- Editable Tiptap document templates and DOCX export.
- Saved method cards with previews derived from their contents.
- Side assistant for reading context and proposing whiteboard additions.
- Excalidraw experiment behind its own button.
- Guest editing and attachments held in memory until refresh; authenticated saved work uses D1 and R2.

Numeric charts and the prioritization matrix are represented as existing-UI placeholders in this prototype. The complete ChartJS functionality from the original product is not recreated here. Document templates are the prototype's editable adaptations, not the original Office files.

## Main source files

| Area | Files |
| --- | --- |
| Workspace and method dropdown | `app/case-workspace.tsx`, `app/case-workspace.css` |
| Method catalogue and example case | `lib/case-data.ts` |
| React Flow editor and elements | `app/studio/flow-board.tsx`, `app/studio/flow-nodes.tsx` |
| Board templates and proposal validation | `lib/board.ts` |
| Tiptap editor and document templates | `app/studio/docs.tsx`, `lib/doc-templates.ts` |
| DOCX downloads | `lib/export-docx.ts`, `lib/download-document.ts` |
| Assistant UI | `app/studio/case-chat.tsx`, `app/studio/board-chat.tsx` |
| Gemini requests | `lib/gemini.ts`, `app/api/board-chat/route.ts`, `app/api/case-chat/route.ts` |
| Persistence and uploads | `app/api/case/`, `app/api/files/`, `lib/case-server.ts` |
| Authentication integration | `app/chatgpt-auth.ts` |
| Database migrations | `drizzle/` |

## Build and checks

On Linux/WSL with Bash and GNU `timeout`:

```bash
npm run build
npm test
```

The exported application code matches source commit `db89e472d50f516cd72c8919b32c3bfb862093a8`, which was built and checked for the v12 deployment. This handoff adds documentation and an ignored local-secret example. A fresh installation on your machine has not been tested as part of the export.

## Hosting elsewhere

This is a full-stack Vinext/Vite application targeting Cloudflare Workers. React Flow, Tiptap and Excalidraw are the editor components. GitHub stores the source; uploading this repository does not deploy the application. The existing server routes and bindings require a server runtime, so the complete application cannot run as a static GitHub Pages site.

The current production sign-in relies on the original Sites hosting gateway and its trusted authentication headers. An independent production deployment needs its own verified authentication integration and must not trust identity headers supplied directly by visitors. Local development uses a development identity for its local database; that is not production authentication.

Provision a D1 database bound as `DB`, an R2 bucket bound as `FILES`, run the `drizzle/` migrations, and configure Gemini as a server secret. `wrangler.dev.json` uses local placeholder resource IDs. `.openai/hosting.json` retains metadata for the original Site; configure the intended target before publishing a separate deployment. The original template notes are retained in `STARTER-README.md`.

## Export contents

Application source, the dependency lockfile, migrations, tests, reference images, and bundled editor font assets are included. Live database contents, uploaded user files, API keys, Git history, dependencies, build outputs, historic QA screenshots, and the generated TypeScript cache are excluded. Third-party notices present in the source are retained.
