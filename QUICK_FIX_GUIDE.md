# Quick Fix Guide for 500 Error

## Fix Steps

### 1. Create .env File

Navigate to the `backend` folder and create a `.env` file:

**Windows PowerShell:**
```powershell
cd backend
Copy-Item .env.example .env
```

**Or manually create** `backend/.env` with this content:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=itailor_db
DB_PORT=3306
PORT=3000
```

### 2. Verify Database Connection

Make sure MySQL is running and the database exists:

```sql
CREATE DATABASE IF NOT EXISTS itailor_db;
USE itailor_db;
```

### 3. Import Schema (if not done already)

```bash
cd backend
mysql -u root -p itailor_db < database/schema.sql
```

### 4. Seed Database with 200+ Records

```bash
cd backend
npm run seed
```

This will populate:
- 200 customers
- 250 measurements  
- 200 orders
- 400+ order items
- 300+ payments

### 5. Restart Backend Server

```bash
cd backend
npm start
```

### 6. Test the API

Open browser: `http://localhost:3000/api/health`

Should return:
```json
{"success":true,"message":"iTailor API is running"}
```

### 7. Test Frontend

Open browser: `http://localhost:4200`

The dashboard should now load with statistics!

## Common Issues

### Issue: "Cannot connect to database"
**Solution:** 
- Check MySQL is running: `mysql -u root -p`
- Verify password in `.env` matches your MySQL password

### Issue: "Table doesn't exist"
**Solution:**
- Run schema: `mysql -u root -p itailor_db < backend/database/schema.sql`

### Issue: Still getting 500 error
**Solution:**
- Check backend console for detailed error message
- The error message now includes more details
- Look for database connection errors or query errors

### Issue: Frontend shows "Failed to load"
**Solution:**
- Ensure backend is running on port 3000
- Check browser console (F12) for CORS or network errors
- Verify API URL in `frontend/src/app/services/api.service.ts`

## Verify Everything Works

1. **Dashboard** - Should show statistics with 200 customers, 200 orders
2. **Customers** - Should list 200 customers with search
3. **Orders** - Should show 200 orders with different statuses
4. **Measurements** - Click on any customer to see their measurements

## Next Steps

Once everything is working:
1. The application is fully functional with realistic data
2. You can test all features (add, edit, delete)
3. The seeder can be run again anytime to reset data: `npm run seed`

---

**Need Help?** Check the backend console logs for detailed error messages.
