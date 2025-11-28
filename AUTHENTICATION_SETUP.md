# Desktop Authentication System Setup

## Overview

This document outlines the complete authentication system for the desktop app, integrated with the web admin panel for user management.

## Architecture

### User Flow

1. **Web Users (Job Seekers)**
   - Self-register on `/applicant-register`
   - Stored in `Applicant` table
   - Can apply for jobs

2. **Desktop Users (Recruitment Staff)**
   - Created by admins via web admin panel
   - Credentials stored in `DesktopUser` table with hashed passwords
   - Login to desktop app at `/api/auth/login`
   - Assigned roles: `staff`, `manager`, `admin`

3. **Admin Control**
   - Web admins manage all desktop users
   - Can create, update, deactivate accounts
   - Can reset passwords
   - Full audit trail of all actions

## Database Schema

### DesktopUser Table
\`\`\`sql
CREATE TABLE DesktopUser (
  id STRING PRIMARY KEY
  email STRING UNIQUE
  name STRING
  password STRING -- bcryptjs hashed
  role STRING -- staff | manager | admin
  status STRING -- active | inactive
  assignedAt DATETIME
  createdAt DATETIME
  updatedAt DATETIME
)
\`\`\`

### Audit Logs Table
\`\`\`sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY
  user_id VARCHAR(255)
  action VARCHAR(50) -- LOGIN, LOGOUT, USER_CREATED, etc.
  details JSONB
  created_at TIMESTAMP
)
\`\`\`

## Setup Instructions

### 1. Install Dependencies

The following are already in `package.json`:
- `bcryptjs` - Password hashing
- `@prisma/client` - Database ORM

### 2. Run Database Migration

\`\`\`bash
# Create the audit_logs table
npx prisma migrate dev --name create_audit_logs

# Or manually run the SQL:
# See scripts/01-create-audit-logs.sql
\`\`\`

### 3. Create Desktop Users via Admin Panel

1. Go to `/admin` (web)
2. Click "Users" → "Desktop Users" tab
3. Click "Create Desktop User"
4. Fill in: Name, Email, Role, Status
5. System auto-generates secure temporary password
6. Share password with the new staff member

### 4. Desktop App Login

1. Run `npm run dev` in `/desktop` folder
2. Vite dev server starts on `http://localhost:5173`
3. Electron app opens and shows Login page
4. Enter credentials (email and password)
5. API validates against `DesktopUser` table
6. User logged in and gains access to dashboard

## API Endpoints

### Authentication

#### Login
\`\`\`
POST /api/auth/login
Body: { email: string, password: string }
Returns: { id, email, name, role }
\`\`\`

#### Password Reset (Request)
\`\`\`
POST /api/auth/password-reset
Body: { email: string, action: 'request' }
Returns: { resetToken, expiresIn }
\`\`\`

#### Password Reset (Execute)
\`\`\`
POST /api/auth/password-reset
Body: { email, resetToken, newPassword, action: 'reset' }
Returns: { message: 'Password reset successfully' }
\`\`\`

### User Management

#### Get All Desktop Users
\`\`\`
GET /api/desktop-users
Returns: DesktopUser[]
\`\`\`

#### Create Desktop User
\`\`\`
POST /api/desktop-users
Body: { name, email, password, role, status }
Returns: DesktopUser
\`\`\`

#### Update Desktop User
\`\`\`
PATCH /api/desktop-users/[id]
Body: { role?, status?, name?, password? }
Returns: DesktopUser
\`\`\`

#### Delete Desktop User
\`\`\`
DELETE /api/desktop-users/[id]
Returns: { success: true }
\`\`\`

#### Admin Reset User Password
\`\`\`
POST /api/desktop-users/[id]/reset-password
Body: { action: 'generate-token' }
Returns: { tempPassword, message }
\`\`\`

### Audit Logs

#### Get Audit Logs
\`\`\`
GET /api/audit-logs?limit=50&userId=optional
Returns: AuditLog[]
\`\`\`

## Security Features

### 1. Password Hashing
- Uses bcryptjs with salt rounds of 10
- Passwords never stored in plaintext
- Existing users updated with hashed passwords on next login

### 2. Audit Logging
- Every action logged with timestamp
- Tracks: LOGIN, LOGOUT, USER_CREATED, USER_UPDATED, PASSWORD_CHANGED, etc.
- Admin dashboard shows complete audit trail
- Helps with compliance and security monitoring

### 3. Status Management
- Users can be marked as `active` or `inactive`
- Inactive users cannot login
- Allows temporary account deactivation without deletion

### 4. Role-Based Access
- `staff` - Basic recruitment tasks
- `manager` - Team management capabilities
- `admin` - Full system access

### 5. Password Reset Flow
- Admin generates temporary password
- System hashes it before storing
- User must change password on first login (recommended)

## How It Works Together

\`\`\`
Web Admin Panel (Next.js)
    ↓
Admin creates desktop user via /admin
    ↓
API hashes password & stores in DesktopUser table
    ↓
Audit log created: USER_CREATED
    ↓
Desktop App (Electron + React)
    ↓
Staff enters credentials on LoginPage
    ↓
App calls POST /api/auth/login
    ↓
Backend validates email & hashes provided password
    ↓
Compares with stored hash
    ↓
If valid: Returns user data & logs LOGIN audit event
    ↓
If invalid: Logs LOGIN failure & returns 401
    ↓
Desktop app stores user in localStorage (encrypted in production)
    ↓
User navigates to Dashboard
\`\`\`

## Testing

### Test Login Credentials
Create a test user via admin panel:
- Email: `test@vikmac.com`
- Password: `TempPass123!` (shared by admin)
- Role: `staff`
- Status: `active`

Then login in desktop app with same credentials.

### Check Audit Logs
Go to admin panel → Audit Logs to see:
- Login attempts (successful and failed)
- User creation events
- Password changes
- All timestamps and details

## Troubleshooting

### Desktop App Says "Invalid credentials"
- Verify email is typed correctly
- Check user status is "active" in admin panel
- Verify password hasn't been changed since admin created it

### Cannot See Password Reset in Admin
- Make sure you have admin privileges in web app
- Check audit logs to see if user was created successfully

### API Returns 500 Error
- Check database connection
- Ensure audit_logs table was created
- Check server logs for detailed errors

### Password Not Being Hashed
- Run `npm install bcryptjs` if missing
- Restart dev server
- Clear browser cache

## Next Steps

1. Test the complete flow: Create user → Login → Verify audit log
2. Configure password requirements (min length, complexity)
3. Add email notifications when users are created
4. Implement 2FA for enhanced security
5. Set up automated password expiration policies
