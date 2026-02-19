"""
Run database migration to add profile_picture column
"""
from sqlalchemy import create_engine, text
from app.routes.config import settings

print("="*60)
print("Running Database Migration: Add profile_picture column")
print("="*60)

try:
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Add the column
        conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS profile_picture TEXT;
        """))
        conn.commit()
        
        print("✅ Successfully added profile_picture column to users table")
        
        # Verify
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'profile_picture';
        """))
        
        row = result.fetchone()
        if row:
            print(f"\n✅ Verification: Column exists")
            print(f"   - Name: {row[0]}")
            print(f"   - Type: {row[1]}")
            print(f"   - Nullable: {row[2]}")
        else:
            print("\n⚠️  Warning: Could not verify column (but migration may have succeeded)")
            
except Exception as e:
    print(f"\n❌ Migration failed: {e}")
    print("\nYou can also run this SQL manually in Supabase SQL Editor:")
    print("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;")

print("="*60)
