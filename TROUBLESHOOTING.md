# Troubleshooting: "Failed to fetch" Error - SOLVED

## Problems Identified
1. **CORS misconfiguration**: Backend was only configured to accept requests from `http://localhost:5173`, but Next.js runs on `http://localhost:3000`
2. **Table name mismatch**: Models were looking for "movieDetails" and "seriesDetails" but actual tables are "moviedetails" and "seriesdetails" (all lowercase)

## Solutions Applied
1. Updated `backend/.env` to include both ports in CORS_ORIGINS:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

2. Updated `backend/app/models.py` table names to match actual database:
```python
class Movie(Base):
    __tablename__ = "moviedetails"  # Changed from "movieDetails"

class WebSeries(Base):
    __tablename__ = "seriesdetails"  # Changed from "seriesDetails"
```

## Steps to Fix

### 1. Stop the Backend Server
If your backend is currently running, stop it by pressing `Ctrl+C` in the terminal where it's running.

### 2. Restart the Backend Server
Navigate to the backend directory and restart:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or if using a different command:
```bash
cd backend
python app/main.py
```

### 3. Verify Backend is Running
You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### 4. Restart Frontend (if needed)
If your Next.js frontend is not running:
```bash
cd nextFrontend
npm run dev
```

### 5. Test the Application
1. Open browser to `http://localhost:3000`
2. Navigate to Movies page - movies should now load
3. Navigate to Web Series page - series should now load

## Why This Happened
- **CORS** is a security feature that prevents websites from making requests to different domains/ports
- Your backend only allowed requests from port 5173 (Vite default)
- Next.js uses port 3000 by default
- The browser blocked the requests causing "Failed to fetch" errors

## Additional Checks
If you still experience issues after restarting:

1. **Check if database has data**: Ensure your PostgreSQL database has movie and web series data in the tables
2. **Verify database connection**: Check that PostgreSQL is running and the connection string in `.env` is correct
3. **Check browser console**: Press F12 and look for CORS or network errors
4. **Verify API endpoints**: Open `http://localhost:8000/docs` to see the FastAPI interactive documentation

## Database Population
If your database tables are empty, you'll need to populate them with data from your CSV files:
- `IMDB-Movie-Data.csv` → movieDetails table
- `Web Series.csv` → seriesDetails table
