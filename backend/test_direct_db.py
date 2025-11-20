#!/usr/bin/env python3
import sys
import os

# Add current directory to Python path
sys.path.append('.')

try:
    from dotenv import load_dotenv
    load_dotenv()

    from app.database import get_db, engine, Base
    from app.models import User
    from app.auth import hash_password
    from sqlalchemy.orm import Session
    from datetime import datetime

    print("✓ Successfully imported all modules")

    # Test database connection
    db: Session = next(get_db())

    print("✓ Database connection successful")

    # Test user creation
    test_user = User(
        email="test_DIRECT@example.com",
        username="test_direct_user",
        name="Test Direct User",
        dob=datetime.strptime("1990-01-01", "%Y-%m-%d"),
        password_hash=hash_password("testpassword123")
    )

    try:
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print(f"✓ Successfully created user: {test_user.email} (ID: {test_user.id})")

        # Test fetching the user
        fetched_user = db.query(User).filter(User.email == "test_DIRECT@example.com").first()
        if fetched_user:
            print(f"✓ Successfully retrieved user: {fetched_user.email}")
        else:
            print("✗ Could not retrieve created user")

    except Exception as e:
        print(f"✗ Error creating user: {e}")
        db.rollback()

    finally:
        # Clean up test user
        try:
            existing_test = db.query(User).filter(User.email == "test_DIRECT@example.com").first()
            if existing_test:
                db.delete(existing_test)
                db.commit()
                print("✓ Cleaned up test user")
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")

    db.close()

except ImportError as e:
    print(f"✗ Import error: {e}")
except Exception as e:
    print(f"✗ General error: {e}")
    import traceback
    traceback.print_exc()
