# Database Seeder Guide

## Quick Setup

### Step 1: Create .env file

Create a `.env` file in the `backend` folder with the following content:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=itailor_db
DB_PORT=3306
PORT=3000
```

**Important:** Update `DB_PASSWORD` with your actual MySQL password.

### Step 2: Ensure Database Exists

Make sure the database exists:

```sql
CREATE DATABASE IF NOT EXISTS itailor_db;
```

Run the schema first:
```bash
mysql -u root -p itailor_db < database/schema.sql
```

### Step 3: Run the Seeder

```bash
npm run seed
```

## What Gets Seeded

The seeder will populate your database with:

- **200 Customers** - Random names, emails, phones, addresses
- **250 Measurements** - Various measurement types (shirt, pant, suit, kurta)
- **200 Orders** - Orders with different statuses and dates
- **400+ Order Items** - Multiple items per order with fabric and color details
- **300+ Payments** - Payment history for orders

## Seeder Features

✅ **Realistic Data**: Uses common names, cities, and realistic measurements
✅ **Relationships**: Properly links customers → measurements → orders → items → payments
✅ **Variety**: Different statuses, payment methods, fabric types, colors
✅ **Date Ranges**: Orders from 2024-01-01 to present
✅ **Safe**: Clears existing data before seeding (backs up if needed first!)

## Output Example

```
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

## Troubleshooting

### Error: Cannot connect to database
- Check if MySQL is running
- Verify credentials in `.env` file
- Ensure database `itailor_db` exists

### Error: Table doesn't exist
- Run the schema first: `mysql -u root -p itailor_db < database/schema.sql`

### Want to re-seed?
Just run `npm run seed` again. It will clear all data and reseed fresh data.

## Customization

You can modify the seeder to add more or less data:

```javascript
await seedCustomers(500);  // Seed 500 customers instead of 200
await seedMeasurements(600); // Seed 600 measurements
await seedOrders(400);      // Seed 400 orders
```

Edit `database/seeder.js` and change the numbers in the `runSeeder()` function.
