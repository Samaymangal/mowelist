import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Parse DATABASE_URL
db_url = os.getenv("DATABASE_URL")
# postgresql+psycopg2://myappuser:mypassword@localhost:5432/myappdb

# Extract connection details
parts = db_url.replace("postgresql+psycopg2://", "").split("@")
user_pass = parts[0].split(":")
user = user_pass[0]
password = user_pass[1]
host_db = parts[1].split("/")
host_port = host_db[0].split(":")
host = host_port[0]
port = host_port[1]
database = host_db[1]

print(f"Connecting to database: {database}")
print(f"Host: {host}:{port}")
print(f"User: {user}")

try:
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password
    )
    
    cursor = conn.cursor()
    
    # Check what tables exist
    print("\n=== TABLES IN DATABASE ===")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    for table in tables:
        print(f"  - {table[0]}")
    
    # Check movieDetails table specifically (case-sensitive)
    print("\n=== CHECKING movieDetails TABLE ===")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'movieDetails';
    """)
    result = cursor.fetchone()
    if result:
        print(f"  ✓ Found table: {result[0]}")
        
        # Count rows
        cursor.execute('SELECT COUNT(*) FROM "movieDetails";')
        count = cursor.fetchone()[0]
        print(f"  ✓ Row count: {count}")
        
        # Show first row
        if count > 0:
            cursor.execute('SELECT * FROM "movieDetails" LIMIT 1;')
            row = cursor.fetchone()
            print(f"  ✓ Sample row: {row}")
    else:
        print("  ✗ Table 'movieDetails' not found!")
        
        # Check for lowercase version
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND LOWER(table_name) = 'moviedetails';
        """)
        result = cursor.fetchone()
        if result:
            print(f"  → Found table with different case: {result[0]}")
    
    # Check seriesDetails table
    print("\n=== CHECKING SERIES TABLE ===")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND LOWER(table_name) LIKE '%series%';
    """)
    series_tables = cursor.fetchall()
    if series_tables:
        for table in series_tables:
            print(f"  - Found: {table[0]}")
            cursor.execute(f'SELECT COUNT(*) FROM "{table[0]}";')
            count = cursor.fetchone()[0]
            print(f"    Row count: {count}")
    else:
        print("  ✗ No series tables found!")
    
    cursor.close()
    conn.close()
    print("\n✓ Database connection successful!")
    
except Exception as e:
    print(f"\n✗ Error: {e}")
