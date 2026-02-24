Frontend (Vite + React + TypeScript)

Install and run:

```powershell
cd frontend
npm install
npm run dev
```

Requirements: Node 18+ is recommended.

If you hit dependency resolution errors on Windows (peer dependency conflicts), retry with:

```powershell
npm install --legacy-peer-deps
npm run dev
```

If `vite` is not recognized, make sure `node_modules/.bin` is on your PATH (npm install should create it). Alternatively use `npx vite` or `npm run dev` which runs the local binary.
