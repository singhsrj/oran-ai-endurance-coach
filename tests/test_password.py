"""
Generate a bcrypt hash for your password to store in Supabase.
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print("=== Oran AI Password Hash Generator ===\n")
print("This will generate a proper bcrypt hash for your password.")
print("Copy the generated hash and update it in Supabase.\n")

password = input("Enter the password you want to use: ")

# Generate bcrypt hash
hashed = pwd_context.hash(password)

print("\n" + "="*60)
print("✅ HASH GENERATED SUCCESSFULLY")
print("="*60)
print("\nCopy this hash to Supabase:")
print(f"\n{hashed}\n")
print("="*60)
print("\nSteps to update in Supabase:")
print("1. Go to Supabase > Table Editor > users table")
print("2. Find your user record")
print("3. Update the 'hashed_password' field with the hash above")
print("4. Save changes")
print("5. Try logging in again with your email and password")
print("="*60)
