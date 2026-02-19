-- Migration: Add profile_picture column to users table
-- Date: 2026-02-19
-- Description: Adds support for user profile pictures

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture';
