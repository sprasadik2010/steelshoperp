Backend (FastAPI)

Run with local Python environment:

1. Create virtualenv and install deps:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Start Postgres (docker-compose) or provide `DATABASE_URL` in `.env`:

```bash
docker-compose up -d
```

Troubleshooting: if you see a startup error like "password authentication failed for user \"postgres\"",
there are two common fixes:

- Start the provided Postgres container so credentials match the default connection string:

```powershell
cd backend
docker-compose up -d
# wait a few seconds for Postgres to be ready
```

- Or point the app at your local Postgres by editing `.env` (or `DATABASE_URL`) with correct user/password/host/port.

You can also skip DB initialization during app startup (useful if you're not running Postgres locally):

```powershell
# Windows PowerShell
$env:SKIP_DB_INIT = '1'
uvicorn app.main:app --reload
```

Or set `SKIP_DB_INIT=1` in your `.env` file.

3. Run the app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
