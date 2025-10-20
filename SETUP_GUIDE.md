# iTailor Setup Guide

## Quick Start Guide

Follow these steps to get your iTailor application up and running.

## Step 1: Database Configuration

### Create MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Run the following command:
```sql
CREATE DATABASE itailor_db;
```

3. Import the schema:
   - Navigate to `backend/database/schema.sql`
   - Execute the SQL file in your MySQL client
   - This will create all necessary tables and insert sample data

### Verify Database Setup

Run this query to verify tables were created:
```sql
USE itailor_db;
SHOW TABLES;
```

You should see: customers, measurements, orders, order_items, payments

## Step 2: Backend Configuration

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

1. Copy the example environment file:
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

2. Edit the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=itailor_db
DB_PORT=3306
PORT=3000
```

**Important**: Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password.

### Start the Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

You should see:
```
iTailor Backend Server is running on port 3000
API URL: http://localhost:3000/api
```

### Test the API

Open your browser and visit: `http://localhost:3000/api/health`

You should see:
```json
{"success":true,"message":"iTailor API is running"}
```

## Step 3: Frontend Configuration

### Install Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

This may take a few minutes as it installs Angular and all dependencies.

### Start the Frontend Server

```bash
npm start
```

The Angular development server will start. You should see:
```
** Angular Live Development Server is listening on localhost:4200 **
```

### Access the Application

Open your browser and navigate to: `http://localhost:4200`

You should see the iTailor dashboard!

## Step 4: Verify Everything Works

### Test Customer Management
1. Click on "Customers" in the navigation
2. Click "Add Customer"
3. Fill in the form and create a customer
4. Verify the customer appears in the list

### Test Measurements
1. Click "Measurements" for a customer
2. Add a new measurement
3. Verify it's saved correctly

### Test Orders
1. Go to "Orders"
2. Create a new order
3. Select a customer and add items
4. Verify the order is created

## Common Issues and Solutions

### Issue: Backend won't connect to database

**Solution**:
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database `itailor_db` exists
- Test MySQL connection: `mysql -u root -p`

### Issue: Port 3000 already in use

**Solution**:
- Change PORT in `.env` file to another port (e.g., 3001)
- Update API URL in frontend: `frontend/src/app/services/api.service.ts`

### Issue: Port 4200 already in use

**Solution**:
```bash
ng serve --port 4201
```

### Issue: npm install fails

**Solution**:
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

### Issue: Angular CLI not found

**Solution**:
```bash
npm install -g @angular/cli@16
```

## Default Login Credentials

This application does not have authentication by default. All features are accessible without login.

## Sample Data

The database schema includes sample data:
- 2 sample customers
- 1 sample measurement
- 1 sample order

You can delete this data or use it for testing.

## Next Steps

1. Customize the application for your needs
2. Add your branding and logo
3. Configure backup for your database
4. Consider adding authentication for production use

## Production Deployment

For production deployment:

1. **Backend**:
   - Use a process manager like PM2
   - Set up proper environment variables
   - Use a production MySQL server
   - Enable HTTPS

2. **Frontend**:
   - Build for production: `ng build --configuration production`
   - Serve the `dist/` folder with a web server (nginx, Apache)
   - Update API URL to production backend

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check the README.md for detailed documentation

---

**Happy Tailoring! 🧵✂️**
