# Troubleshooting Guide

## Common Errors and Solutions

### 1. "Error fetching user profile: {}"

This error typically occurs when:
- Environment variables are not configured
- Database table doesn't exist
- Supabase connection issues

#### Solution:

**Step 1: Check Environment Variables**
1. Open your `.env.local` file
2. Ensure it contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Step 2: Get Your Supabase Credentials**
1. Go to [supabase.com](https://supabase.com)
2. Open your project dashboard
3. Go to Settings > API
4. Copy the Project URL and anon key
5. Update your `.env.local` file

**Step 3: Create Database Tables**
1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire content from `DATABASE_SCHEMA.sql`
3. Paste and run the SQL
4. This will create all necessary tables

**Step 4: Restart Development Server**
```bash
npm run dev
```

### 2. "Supabase configuration missing"

This means your environment variables are not set.

#### Solution:
1. Create or update `.env.local` file in your project root
2. Add your Supabase credentials
3. Restart your development server

### 3. "relation 'user_profiles' does not exist"

The database table hasn't been created yet.

#### Solution:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `DATABASE_SCHEMA.sql`

### 4. "Authentication failed"

Google OAuth is not properly configured.

#### Solution:
1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Configure Google Cloud Console OAuth settings

## Step-by-Step Setup

### Complete Setup Process:

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for it to be ready

2. **Get Credentials**
   - Go to Settings > API
   - Copy Project URL and anon key

3. **Set Environment Variables**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_SUPABASE_URL=your_url_here" > .env.local
   echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here" >> .env.local
   ```

4. **Create Database Tables**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste `DATABASE_SCHEMA.sql`
   - Run the SQL

5. **Configure Google OAuth**
   - Go to Authentication > Providers
   - Enable Google
   - Add Google OAuth credentials

6. **Test the Application**
   ```bash
   npm run dev
   ```

## Verification Steps

### Check Environment Variables:
```bash
# Check if .env.local exists
ls -la .env.local

# Check if variables are loaded (in your app)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### Check Database Tables:
1. Go to Supabase dashboard
2. Navigate to Table Editor
3. You should see: `user_profiles`, `meals`, `weight_logs`, `achievements`

### Check Authentication:
1. Go to Authentication > Users
2. You should see users after they sign in

## Debug Mode

To see detailed error messages, add this to your browser console:

```javascript
// Enable detailed Supabase logging
localStorage.setItem('supabase.debug', 'true')
```

## Common Issues

### Issue: "Cannot read property 'from' of undefined"
**Cause**: Supabase client not initialized
**Solution**: Check your `lib/supabase.ts` file

### Issue: "Network error"
**Cause**: Wrong Supabase URL or network issues
**Solution**: Verify your Supabase URL is correct

### Issue: "Permission denied"
**Cause**: Row Level Security (RLS) policies not set up
**Solution**: Run the SQL schema to create policies

### Issue: "Invalid JWT"
**Cause**: Wrong anon key or authentication issues
**Solution**: Check your anon key and authentication setup

## Getting Help

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Check the Supabase dashboard** for any errors
3. **Verify your environment variables** are correct
4. **Ensure the database tables exist** in your Supabase project
5. **Test with a simple query** in the Supabase SQL Editor

## Quick Test

To test if your setup is working:

1. Go to your Supabase SQL Editor
2. Run this query:
```sql
SELECT * FROM user_profiles LIMIT 1;
```
3. If it runs without error, your database is set up correctly

## Environment Variables Template

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual Supabase credentials. 