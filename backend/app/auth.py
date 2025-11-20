import os
from datetime import datetime, timedelta
from typing import Optional

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False

import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "dev")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def hash_password(plain: str) -> str:
    if HAS_BCRYPT:
        # Use py-bcrypt (not passlib) for better compatibility
        # bcrypt has a 72-byte limit on passwords
        truncated_password = plain.encode('utf-8')[:72]
        return bcrypt.hashpw(truncated_password, bcrypt.gensalt()).decode('utf-8')
    else:
        # Fallback to a simple hash if bcrypt is not available
        import hashlib
        return "fallback_" + hashlib.sha256(plain.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    try:
        if HAS_BCRYPT and not hashed.startswith("fallback_"):
            return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
        else:
            # Fallback verification
            import hashlib
            expected = "fallback_" + hashlib.sha256(plain.encode()).hexdigest()
            return expected == hashed
    except Exception:
        return False

def create_access_token(subject: str, expires_minutes: int = 60) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None
