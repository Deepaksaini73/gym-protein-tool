# Supabase Authentication & Database Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Configure Google OAuth

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret

## 5. Set Up Google OAuth (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set up OAuth consent screen
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

## 6. Database Setup

### Run the SQL Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `DATABASE_SCHEMA.sql`
4. Run the SQL to create all tables and functions

### Tables Created:

- **user_profiles**: Stores user health and fitness data
- **meals**: Stores food logging data
- **weight_logs**: Tracks weight changes over time
- **achievements**: User achievements and badges

### Features:

✅ **Automatic BMI Calculation**: BMI is calculated automatically when weight/height changes
✅ **Daily Calorie Goals**: Calculated using Mifflin-St Jeor Equation
✅ **Macronutrient Goals**: Protein, carbs, and fats calculated based on fitness goal
✅ **Row Level Security**: Users can only access their own data
✅ **Automatic Timestamps**: Created/updated timestamps managed automatically
✅ **Default Achievements**: New users get default achievement badges

## 7. Profile Setup Flow

When a user first signs in:

1. **Google Authentication**: User signs in with Google
2. **Profile Setup**: Multi-step form to collect health data
3. **Goal Calculation**: Automatic calculation of daily nutrition goals
4. **Data Storage**: All data saved to Supabase database
5. **Profile Display**: Beautiful profile page with health metrics

## 8. Health Data Collected

### Basic Information:
- Full Name
- Age
- Gender

### Body Measurements:
- Height (cm)
- Current Weight (kg)
- Target Weight (kg)

### Activity & Goals:
- Activity Level (Sedentary, Lightly Active, etc.)
- Fitness Goal (Muscle Gain, Fat Loss, etc.)

### Calculated Goals:
- BMI
- Daily Calorie Goal
- Daily Protein Goal
- Daily Carbs Goal
- Daily Fats Goal
- Daily Water Goal

## 9. Features Implemented

✅ **Google Sign-In Button**
✅ **User Authentication State Management**
✅ **User Profile Display (Name, Email, Avatar)**
✅ **Sign Out Functionality**
✅ **Protected Routes**
✅ **Loading States**
✅ **Error Handling**
✅ **Beautiful Profile Setup Flow**
✅ **Health Metrics Display**
✅ **Automatic Goal Calculation**
✅ **Database Integration**
✅ **Real-time Data Updates**
✅ **Toast Notifications**

## 10. User Data Available

When a user signs in with Google, you can access:

```typescript
user.id // Unique user ID
user.email // User's email address
user.user_metadata.full_name // User's full name
user.user_metadata.avatar_url // User's profile picture
user.email_confirmed_at // Email verification status
user.last_sign_in_at // Last sign-in timestamp
```

## 11. Profile Data Structure

```typescript
interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  current_weight: number // in kg
  target_weight: number // in kg
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  fitness_goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'endurance'
  bmi: number
  daily_calorie_goal: number
  daily_protein_goal: number
  daily_carbs_goal: number
  daily_fats_goal: number
  daily_water_goal: number // in ml
  created_at: string
  updated_at: string
}
```

## 12. Testing

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Complete the profile setup process
6. View your profile with calculated health metrics

## 13. Deployment

When deploying to production:

1. Update your Google OAuth redirect URIs to include your production domain
2. Set up environment variables in your hosting platform
3. Ensure your domain is added to Supabase's allowed origins
4. Run the database schema in your production Supabase project

## 14. Next Steps

After setting up authentication and profiles, you can:

1. **Food Logging**: Implement meal tracking functionality
2. **Weight Tracking**: Add weight logging features
3. **Progress Analytics**: Create progress charts and analytics
4. **Achievement System**: Implement achievement unlocking logic
5. **Social Features**: Add friend connections and sharing

## Troubleshooting

- **"Invalid redirect URI"**: Check your Google OAuth configuration
- **"Supabase URL not found"**: Verify your environment variables
- **"Authentication failed"**: Check your Supabase project settings
- **"Database errors"**: Ensure you've run the SQL schema
- **"Profile not loading"**: Check Row Level Security policies 