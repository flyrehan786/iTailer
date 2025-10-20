# Authentication System - Complete Setup Guide

## Overview
A complete JWT-based authentication system has been implemented with login/logout functionality, route protection, and token management.

## Features Implemented

### Backend Features
- **JWT Authentication** - Secure token-based authentication
- **Login API** - User authentication with username/email and password
- **Register API** - User registration (optional)
- **Token Verification** - Verify JWT tokens
- **Logout API** - Logout endpoint
- **Password Hashing** - Secure password storage with bcryptjs
- **Auth Middleware** - Protect routes with JWT verification
- **Role-based Authorization** - Optional role checking middleware

### Frontend Features
- **Login Page** - Clean, professional login interface
- **Auth Service** - Centralized authentication management
- **Auth Guard** - Protect routes from unauthorized access
- **HTTP Interceptor** - Automatically add JWT token to requests
- **Logout Functionality** - Logout button in navbar
- **User Display** - Show logged-in username in navbar
- **Token Storage** - Secure token storage in localStorage
- **Auto-redirect** - Redirect to login if unauthorized

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install jsonwebtoken
```

#### Run User Seeder (if not already done)
```bash
node database/seed_users.js
```

This creates the default admin user:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@tsystem.com

#### Environment Variables (Optional)
Add to `.env` file:
```
JWT_SECRET=your-super-secret-key-change-this-in-production
```

If not set, it will use a default secret (not recommended for production).

### 2. Frontend Setup

No additional installation needed. All dependencies are already included.

### 3. Start the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd frontend
ng serve
```

## File Structure

### Backend Files Created:
```
backend/
├── controllers/
│   └── authController.js          # Login, register, verify, logout
├── middleware/
│   └── authMiddleware.js          # JWT verification middleware
└── routes/
    └── authRoutes.js              # Auth endpoints
```

### Frontend Files Created:
```
frontend/src/app/
├── services/
│   └── auth.service.ts            # Authentication service
├── guards/
│   └── auth.guard.ts              # Route protection
├── interceptors/
│   └── auth.interceptor.ts        # HTTP interceptor for tokens
└── components/
    └── login/
        ├── login.component.ts     # Login logic
        ├── login.component.html   # Login UI
        └── login.component.css    # Login styles
```

### Modified Files:
- `backend/server.js` - Added auth routes
- `backend/package.json` - Added jsonwebtoken
- `backend/controllers/userController.js` - Use authenticated user ID
- `backend/routes/userRoutes.js` - Added auth middleware
- `frontend/src/app/app.module.ts` - Added LoginComponent and interceptor
- `frontend/src/app/app-routing.module.ts` - Added login route and guards
- `frontend/src/app/app.component.ts` - Conditional navbar display
- `frontend/src/app/components/navbar/*` - Added logout button

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login with username/email and password
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@tsystem.com",
      "full_name": "System Administrator",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/register
Register a new user
```json
Request:
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "New User",
  "phone": "1234567890"
}
```

#### GET /api/auth/verify
Verify JWT token (requires Authorization header)
```
Headers:
Authorization: Bearer <token>
```

#### POST /api/auth/logout
Logout (client-side removes token)

### Protected Endpoints
All other API endpoints now require authentication:
- `/api/users/*` - User profile endpoints
- `/api/customers/*` - Customer management
- `/api/orders/*` - Order management
- `/api/measurements/*` - Measurements
- `/api/payments/*` - Payments

## Usage Flow

### 1. Login Process
1. User navigates to `http://localhost:4200`
2. Automatically redirected to `/login` if not authenticated
3. Enter credentials (admin/admin123)
4. On success:
   - JWT token stored in localStorage
   - User data stored in memory
   - Redirected to dashboard
   - Navbar appears with username and logout button

### 2. Authenticated Requests
- All HTTP requests automatically include JWT token via interceptor
- Format: `Authorization: Bearer <token>`
- If token is invalid/expired, user is logged out automatically

### 3. Logout Process
1. Click "Logout" button in navbar
2. Confirm logout
3. Token removed from localStorage
4. User data cleared
5. Redirected to login page
6. Navbar hidden

### 4. Route Protection
- All routes except `/login` are protected
- Attempting to access protected route without login redirects to `/login`
- After login, user is redirected to originally requested page

## Security Features

### Backend Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Signed with secret key
- **Token Expiration**: 24 hours (configurable)
- **Middleware Protection**: All sensitive routes protected
- **SQL Injection Prevention**: Parameterized queries

### Frontend Security
- **Token Storage**: localStorage (consider httpOnly cookies for production)
- **Auto-logout**: On 401/403 responses
- **Route Guards**: Prevent unauthorized access
- **Token Interceptor**: Automatic token attachment

## Testing

### Test Login
1. Navigate to `http://localhost:4200`
2. Should redirect to login page
3. Enter: `admin` / `admin123`
4. Should login and redirect to dashboard

### Test Protected Routes
1. Logout
2. Try to access `http://localhost:4200/customers`
3. Should redirect to login
4. Login
5. Should redirect back to customers page

### Test Logout
1. Login
2. Click logout button
3. Confirm
4. Should redirect to login page
5. Try to access dashboard
6. Should stay on login page

### Test Token Expiration
1. Login
2. Wait 24 hours (or modify JWT_EXPIRES_IN for testing)
3. Try to access any page
4. Should auto-logout and redirect to login

## Production Considerations

### Backend
1. **Change JWT_SECRET**: Use a strong, random secret key
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Refresh**: Implement refresh token mechanism
4. **Rate Limiting**: Add rate limiting to login endpoint
5. **Logging**: Log authentication attempts
6. **Token Blacklist**: Consider implementing token blacklist for logout

### Frontend
1. **HttpOnly Cookies**: Consider using httpOnly cookies instead of localStorage
2. **CSRF Protection**: Implement CSRF tokens
3. **Token Refresh**: Auto-refresh tokens before expiration
4. **Secure Storage**: Consider more secure storage options
5. **Session Timeout**: Implement idle timeout

## Troubleshooting

### Issue: "Invalid or expired token"
- Token may have expired (24h default)
- Logout and login again
- Check JWT_SECRET matches between requests

### Issue: "Cannot access protected routes"
- Ensure you're logged in
- Check browser console for errors
- Verify token is in localStorage: `localStorage.getItem('currentUser')`

### Issue: "Login fails with correct credentials"
- Check backend is running
- Verify database connection
- Ensure users table exists and has data
- Check password hash in database

### Issue: "Navbar not showing after login"
- Check browser console for errors
- Verify AuthService is working
- Check app.component.ts subscription

### Issue: "Auto-logout not working"
- Check AuthInterceptor is registered
- Verify HTTP_INTERCEPTORS in app.module.ts
- Check network tab for 401/403 responses

## Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@tsystem.com`

## Next Steps

1. **Install jsonwebtoken**:
   ```bash
   cd backend
   npm install
   ```

2. **Run user seeder** (if not done):
   ```bash
   node database/seed_users.js
   ```

3. **Restart backend server**

4. **Test login** at `http://localhost:4200`

## Support

For issues or questions, refer to the main project documentation.

---

**Authentication System Status**: ✅ Complete and Ready to Use
