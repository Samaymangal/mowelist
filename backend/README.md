# Backend (FastAPI + PostgreSQL)

## Prereqs
- Python 3.10+
- PostgreSQL running locally or remotely (you can manage it with pgAdmin)
- Create a database and a user with password, and grant privileges.

Example SQL (run in psql/pgAdmin):
```sql
CREATE DATABASE myappdb;
CREATE USER myappuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE myappdb TO myappuser;
```

## Setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# edit .env to match your Postgres config
# then run the API
python -m uvicorn app.main:app --reload
```

The API will run at http://localhost:8000 with:
- POST /auth/register  (email, password) -> create user
- POST /auth/login     (email, password) -> returns JWT token
- GET  /me             (Authorization: Bearer <token>) -> current user