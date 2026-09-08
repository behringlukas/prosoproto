import {spawnSync,spawn} from 'node:child_process';
process.env.WRANGLER_LOG_PATH ||= '.wrangler/wrangler.log';
process.env.WRANGLER_SEND_METRICS = 'false';
const migration=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','wrangler.dev.json'],{stdio:'inherit',env:process.env});
if(migration.status!==0)process.exit(migration.status||1);
const child=spawn(process.execPath,['node_modules/vite/bin/vite.js',...process.argv.slice(2)],{stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code||0));
