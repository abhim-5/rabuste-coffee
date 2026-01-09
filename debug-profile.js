// Debug script to check if profile data exists
console.log('Testing profile data loading...');

// This will help us see what's happening with the database query
const testProfileQuery = `
-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check if there's profile data
SELECT * FROM profiles LIMIT 5;
`;

console.log('Run this SQL in Supabase dashboard:', testProfileQuery);