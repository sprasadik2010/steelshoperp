from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
import sqlalchemy

load_dotenv()
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/erp_db"
)

engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    """Create database tables. If the database is unreachable or auth fails,
    log a warning and continue so the app can start for local development.
    Set `SKIP_DB_INIT=1` to explicitly skip initialization."""
    if os.getenv("SKIP_DB_INIT", "").lower() in ("1", "true", "yes"):
        print("SKIP_DB_INIT set — skipping DB initialization")
        return
    try:
        SQLModel.metadata.create_all(engine)
    except sqlalchemy.exc.OperationalError as e:
        print("Warning: could not connect to the database:", e)
        print("Start Postgres or set the correct DATABASE_URL. Continuing without DB.")
    except Exception as e:
        print("Warning: unexpected error during DB init:", e)

def get_session():
    with Session(engine) as session:
        yield session
