# Supabase Integration Setup

Your reseller platform is now integrated with Supabase! Follow these steps to complete the setup.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Reseller SaaS Platform
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Wait for the project to be created (~2 minutes)

## 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 3. Add Environment Variables in Tempo

The environment variables are already configured in Tempo:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

Make sure these are set correctly in your project settings.

## 4. Run the Database Migration

The migration file has been created at `supabase/migrations/20240101000000_initial_schema.sql`

To apply it:

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## 5. Create Admin User

After running the migration, create an admin user:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Fill in:
   - **Email**: admin@yourdomain.com
   - **Password**: Choose a secure password
   - **Auto Confirm User**: ✓ (checked)
4. Click **Create User**
5. Go to **SQL Editor** and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'admin@yourdomain.com';
   ```

## 6. Verify Setup

1. Restart your dev server in Tempo
2. Try to register a new user
3. Login with the admin account
4. Check that orders are being saved to Supabase

## What's Been Integrated

### ✅ Authentication
- User registration with Supabase Auth
- Login/logout functionality
- Session management
- Role-based access (user/admin)

### ✅ Database Tables
- **profiles**: User profiles with roles
- **plans**: Product plans with pricing
- **orders**: Order management with status tracking

### ✅ Row Level Security (RLS)
- Users can only see their own data
- Admins can see all data
- Plans are publicly readable

### ✅ Real-time Updates
- Orders automatically sync across sessions
- Plans load from database
- Profile updates reflect immediately

## Database Schema

### Profiles Table
```sql
- id (UUID, references auth.users)
- email (TEXT)
- name (TEXT)
- role (TEXT: 'user' | 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Plans Table
```sql
- id (TEXT)
- name (TEXT)
- description (TEXT)
- product (TEXT)
- duration (TEXT: 'monthly' | 'yearly')
- price (DECIMAL)
- original_price (DECIMAL)
- features (JSONB)
- popular (BOOLEAN)
- active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Orders Table
```sql
- id (TEXT)
- user_id (UUID, references profiles)
- items (JSONB)
- total (DECIMAL)
- status (TEXT: 'pending' | 'approved' | 'rejected')
- license_key (TEXT, nullable)
- rejection_reason (TEXT, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Tempo project settings

### "relation does not exist"
- Run the migration SQL in Supabase dashboard
- Check that all tables were created successfully

### "row-level security policy violation"
- Make sure RLS policies were created by the migration
- Check user role is set correctly in profiles table

### Users can't register
- Verify email confirmation is disabled in Supabase Auth settings
- Go to **Authentication** → **Settings** → **Email Auth**
- Disable "Confirm email" if you want instant registration

## Next Steps

1. **Email Templates**: Customize auth emails in Supabase dashboard
2. **Storage**: Add file storage for invoices/receipts
3. **Webhooks**: Set up webhooks for order notifications
4. **Analytics**: Use Supabase's built-in analytics
5. **Backups**: Enable automatic backups in project settings

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
