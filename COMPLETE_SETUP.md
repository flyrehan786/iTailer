# Complete Setup - One Command Solution

## 🚀 Quick Setup (Recommended)

This will create the database, all tables, and seed 200+ records automatically!

### Step 1: Make sure MySQL is running

Verify MySQL is running and you can connect:
```bash
mysql -u root -p
# Enter your password: root
```

### Step 2: Run the complete setup

```bash
cd backend
npm run setup
```

**That's it!** This single command will:
1. ✅ Create the `itailor_db` database
2. ✅ Create all 5 tables (customers, measurements, orders, order_items, payments)
3. ✅ Seed 200 customers
4. ✅ Seed 250 measurements
5. ✅ Seed 200 orders
6. ✅ Seed 400+ order items
7. ✅ Seed 300+ payments

### Step 3: Start the backend

```bash
npm start
```

### Step 4: Start the frontend

Open a new terminal:
```bash
cd frontend
npm start
```

### Step 5: Open the application

Browser: `http://localhost:4200`

## ✅ Expected Output

```
=================================
Database Setup Started...
=================================

Step 1: Connecting to MySQL...
✓ Connected to MySQL successfully!

Step 2: Creating database...
✓ Database 'itailor_db' created successfully!

Step 3: Creating tables...
  ✓ Customers table created
  ✓ Measurements table created
  ✓ Orders table created
  ✓ Order Items table created
  ✓ Payments table created

=================================
✓ Database setup completed!
=================================

Now running seeder...

=================================
Starting Database Seeder...
=================================

Clearing existing data...
Database cleared successfully!
Seeding 200 customers...
✓ 200 customers seeded successfully!
Seeding 250 measurements...
✓ 250 measurements seeded successfully!
Seeding 200 orders...
✓ 200 orders seeded successfully!
Seeding order items...
✓ 412 order items seeded successfully!
Seeding payments...
✓ 327 payments seeded successfully!

=================================
✓ Database seeded successfully!
=================================

Summary:
- Customers: 200
- Measurements: 250
- Orders: 200
- Order Items: 412
- Payments: 327
```

## 🔧 Alternative: Manual Setup

If you prefer to do it step by step:

### 1. Create database manually
```sql
CREATE DATABASE itailor_db;
USE itailor_db;
SOURCE database/schema.sql;
```

### 2. Seed data only
```bash
npm run seed
```

## 🔄 Reset Everything

To clear all data and reseed:
```bash
npm run setup
```

This is safe to run multiple times!

## ❌ Troubleshooting

### Error: Access denied for user 'root'
**Solution:** Check your MySQL password in `.env` file or `config/database.js`

### Error: Cannot connect to MySQL
**Solution:** 
1. Make sure MySQL is running
2. Check MySQL service: `services.msc` (Windows) or `systemctl status mysql` (Linux)

### Error: Port 3000 already in use
**Solution:** Kill the process or change PORT in `.env`

### Still having issues?
Check the backend console for detailed error messages. The error logging has been enhanced to show exactly what's wrong.

## 📊 What You'll Get

After setup, your application will have:
- **200 Customers** with realistic names, emails, phones, and addresses
- **250 Measurements** across different garment types
- **200 Orders** with various statuses (pending, in_progress, ready, delivered)
- **400+ Order Items** with fabrics, colors, and prices
- **300+ Payments** with different payment methods

All data is properly linked with foreign keys and realistic relationships!

---

**Ready to start?** Run `npm run setup` in the backend folder! 🎉
