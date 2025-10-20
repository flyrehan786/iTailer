# User Management System - Setup Guide

## Overview
A complete user management system has been added to the iTailor application with profile management and password change functionality.

## Features Implemented

### 1. **User Profile Management**
   - View user profile information
   - Update username, email, full name, and phone
   - Avatar display with user initials
   - Role badge display

### 2. **Password Management**
   - Change password functionality
   - Current password verification
   - Password strength validation (minimum 6 characters)
   - Confirmation password matching

### 3. **Navigation**
   - Added "Profile" link to the main navbar
   - Accessible from any page in the application

## Setup Instructions

### Backend Setup

1. **Install bcryptjs** (if not already installed):
   ```bash
   cd backend
   npm install bcryptjs
   ```

2. **Create Users Table and Seed Default User**:
   ```bash
   node database/seed_users.js
   ```

   This will create:
   - Users table in the database
   - Default admin user with credentials:
     - **Username**: admin
     - **Password**: admin123
     - **Email**: admin@tsystem.com

### Frontend Setup

The frontend components are already created and integrated. No additional setup required.

## File Structure

### Frontend Files Created:
- `frontend/src/app/components/profile/profile.component.ts`
- `frontend/src/app/components/profile/profile.component.html`
- `frontend/src/app/components/profile/profile.component.css`

### Backend Files Created:
- `backend/controllers/userController.js`
- `backend/routes/userRoutes.js`
- `backend/database/create_users_table.sql`
- `backend/database/seed_users.js`

### Modified Files:
- `frontend/src/app/app.module.ts` - Added ProfileComponent
- `frontend/src/app/app-routing.module.ts` - Added /profile route
- `frontend/src/app/services/api.service.ts` - Added user API methods
- `frontend/src/app/components/navbar/navbar.component.html` - Added Profile link
- `backend/server.js` - Added user routes

## API Endpoints

### User Profile APIs:
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change user password

## Database Schema

### Users Table:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Usage

1. **Access Profile Page**:
   - Click on "Profile" in the navigation bar
   - Or navigate to `http://localhost:4200/profile`

2. **Update Profile**:
   - Edit username, email, full name, or phone
   - Click "Update Profile" button
   - Success message will appear

3. **Change Password**:
   - Click "Change Password" button
   - Enter current password
   - Enter new password (minimum 6 characters)
   - Confirm new password
   - Click "Change Password" button

## Security Notes

⚠️ **Important**: The current implementation uses a hardcoded user ID (userId = 1) for demonstration purposes. In a production environment, you should:

1. Implement proper authentication (JWT tokens, sessions, etc.)
2. Get the user ID from the authenticated session
3. Add authentication middleware to protect routes
4. Implement proper authorization checks

## Additional Improvements (Future)

### Filters in Single Line ✓
The order filters have been updated to display in a single horizontal line with:
- Search input (flexible width)
- Status filter dropdown
- Payment filter dropdown
- Date range filters (From/To)
- Clear filters button

### Responsive Design
- Mobile-friendly layout
- Filters stack on smaller screens
- Profile form adapts to screen size

## Testing

1. **Test Profile View**:
   - Navigate to profile page
   - Verify user information displays correctly

2. **Test Profile Update**:
   - Update any field
   - Submit form
   - Verify success message
   - Refresh page to confirm changes persisted

3. **Test Password Change**:
   - Click "Change Password"
   - Enter incorrect current password - should show error
   - Enter mismatched new passwords - should show error
   - Enter valid passwords - should succeed

## Troubleshooting

### Issue: "Failed to load profile"
- Ensure backend server is running
- Check database connection
- Verify users table exists
- Run seed_users.js script

### Issue: "Password change failed"
- Verify bcryptjs is installed
- Check current password is correct
- Ensure new password meets requirements

### Issue: Profile link not showing
- Clear browser cache
- Restart Angular dev server
- Check navbar component was updated

## Support

For issues or questions, refer to the main project documentation or contact the development team.
