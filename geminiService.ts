15:28:20.321 Running build in Washington, D.C., USA (East) – iad1
15:28:20.321 Build machine configuration: 2 cores, 8 GB
15:28:20.441 Cloning github.com/fatininizam3-cloud/fatini3 (Branch: main, Commit: 06b78d5)
15:28:20.441 Previous build caches not available.
15:28:20.603 Cloning completed: 162.000ms
15:28:20.935 Running "vercel build"
15:28:21.850 Vercel CLI 50.10.2
15:28:22.357 Installing dependencies...
15:28:35.215 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
15:28:35.590 npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
15:28:37.053 
15:28:37.053 added 185 packages in 14s
15:28:37.054 
15:28:37.054 30 packages are looking for funding
15:28:37.054   run `npm fund` for details
15:28:37.102 Running "npm run build"
15:28:37.217 
15:28:37.217 > insightagent---ai-data-dashboard-analyst@0.0.0 build
15:28:37.217 > vite build
15:28:37.217 
15:28:37.456 [36mvite v6.4.1 [32mbuilding for production...[36m[39m
15:28:37.514 
15:28:37.514 /index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime
15:28:37.523 transforming...
15:28:37.750 [32m✓[39m 16 modules transformed.
15:28:37.753 [31m✗[39m Build failed in 270ms
15:28:37.754 [31merror during build:
15:28:37.754 [31mCould not resolve "./services/geminiService" from "App.tsx"[31m
15:28:37.754 file: [36m/vercel/path0/App.tsx[31m
15:28:37.754     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:402:41)
15:28:37.754     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:398:42)
15:28:37.754     at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21687:24)
15:28:37.754     at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21647:26[39m
15:28:37.772 Error: Command "npm run build" exited with 1
