"""
Debug script to test login directly against the database.
"""
import sys
sys.path.insert(0, 'e:\\AI-Powered Endurance Coach')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.routes.config import settings
from app.models.user import User
from app.routes.auth_utils import verify_password

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

print("="*60)
print("Oran AI - Login Debug Tool")
print("="*60)

# Get credentials
email = input("\nEnter email: ").strip()
password = input("Enter password: ").strip()

print("\n" + "="*60)
print("Connecting to Supabase...")
print("="*60)

try:
    db = SessionLocal()
    
    # Find user
    print(f"\nSearching for user with email: {email}")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print("❌ USER NOT FOUND in database")
        print("\nLet me list all users in the database:")
        all_users = db.query(User).all()
        if all_users:
            print("\nFound users:")
            for u in all_users:
                print(f"  - ID: {u.id}, Email: {u.email}, Name: {u.name}")
        else:
            print("  No users found in database!")
    else:
        print(f"✅ User found: ID={user.id}, Name={user.name}")
        print(f"\nStored hash (first 50 chars): {user.hashed_password[:50]}...")
        
        # Test password
        print("\nTesting password verification...")
        if verify_password(password, user.hashed_password):
            print("✅ PASSWORD CORRECT - Login should work!")
        else:
            print("❌ PASSWORD INCORRECT")
            print("\nThe password doesn't match the hash in the database.")
            print("Run test_password.py to generate a new hash.")
    
    db.close()
    
except Exception as e:
    print(f"❌ DATABASE ERROR: {e}")
    print("\nCheck your .env file DATABASE_URL setting")

print("="*60)
