const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  const envContent = `# Supabase Configuration
# Get these values from your Supabase project dashboard
# Go to Settings > API in your Supabase dashboard

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Please update the values in .env.local with your Supabase credentials');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to Settings > API');
console.log('3. Copy your Project URL and anon key');
console.log('4. Update the values in .env.local');
console.log('5. Run the SQL schema from DATABASE_SCHEMA.sql in your Supabase SQL Editor');
console.log('6. Restart your development server: npm run dev'); 