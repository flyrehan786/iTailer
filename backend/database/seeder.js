const db = require('../config/database');

// Sample data arrays
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 
                    'James', 'Mary', 'Richard', 'Patricia', 'Thomas', 'Linda', 'Charles', 'Barbara', 'Daniel', 'Elizabeth',
                    'Matthew', 'Susan', 'Anthony', 'Jessica', 'Mark', 'Karen', 'Donald', 'Nancy', 'Steven', 'Betty',
                    'Paul', 'Margaret', 'Andrew', 'Sandra', 'Joshua', 'Ashley', 'Kenneth', 'Kimberly', 'Kevin', 'Emily',
                    'Brian', 'Donna', 'George', 'Michelle', 'Timothy', 'Carol', 'Ronald', 'Amanda', 'Edward', 'Melissa'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                   'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                   'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                   'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
                'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
                'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'Nashville', 'Baltimore', 'Oklahoma City',
                'Portland', 'Las Vegas', 'Louisville', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
                'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Miami', 'Long Beach'];

const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave',
                 'Lake Dr', 'Hill Rd', 'Forest Ln', 'River St', 'Sunset Blvd', 'Broadway', 'Market St', 'Church St',
                 'Spring St', 'Valley Rd', 'Highland Ave', 'Meadow Ln'];

const fabricTypes = ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Denim', 'Satin', 'Velvet', 'Chiffon', 'Rayon'];

const colors = ['Blue', 'Black', 'White', 'Grey', 'Navy', 'Brown', 'Beige', 'Green', 'Red', 'Purple', 
                'Maroon', 'Olive', 'Cream', 'Tan', 'Charcoal', 'Burgundy'];

const itemTypes = ['shirt', 'pant', 'suit', 'kurta'];

const statuses = ['pending', 'in_progress', 'ready', 'delivered', 'cancelled'];

const paymentMethods = ['cash', 'card', 'upi', 'bank_transfer'];

// Helper functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomItem(array) {
    return array[randomInt(0, array.length - 1)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function clearDatabase() {
    try {
        console.log('Clearing existing data...');
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE payments');
        await db.query('TRUNCATE TABLE order_items');
        await db.query('TRUNCATE TABLE orders');
        await db.query('TRUNCATE TABLE measurements');
        await db.query('TRUNCATE TABLE customers');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Database cleared successfully!');
    } catch (error) {
        console.log('Note: Some tables may not exist yet, continuing...');
    }
}

async function seedCustomers(count = 200) {
    console.log(`Seeding ${count} customers...`);
    const customers = [];
    
    for (let i = 0; i < count; i++) {
        const firstName = randomItem(firstNames);
        const lastName = randomItem(lastNames);
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
        const phone = `${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
        const streetNumber = randomInt(100, 9999);
        const address = `${streetNumber} ${randomItem(streets)}`;
        const city = randomItem(cities);
        
        customers.push([name, email, phone, address, city]);
    }
    
    const query = 'INSERT INTO customers (name, email, phone, address, city) VALUES ?';
    await db.query(query, [customers]);
    console.log(`✓ ${count} customers seeded successfully!`);
}

async function seedMeasurements(count = 250) {
    console.log(`Seeding ${count} measurements...`);
    
    const [customerRows] = await db.query('SELECT id FROM customers');
    const customerIds = customerRows.map(row => row.id);
    
    const measurements = [];
    
    for (let i = 0; i < count; i++) {
        const customerId = randomItem(customerIds);
        const measurementType = randomItem(itemTypes);
        
        // Shirt/Kurta measurements
        const chest = measurementType === 'shirt' || measurementType === 'kurta' || measurementType === 'suit' 
            ? randomFloat(36, 48) : null;
        const waist = randomFloat(28, 42);
        const shoulder = measurementType === 'shirt' || measurementType === 'kurta' || measurementType === 'suit'
            ? randomFloat(15, 19) : null;
        const sleeveLength = measurementType === 'shirt' || measurementType === 'kurta' || measurementType === 'suit'
            ? randomFloat(22, 26) : null;
        const shirtLength = measurementType === 'shirt' || measurementType === 'kurta' || measurementType === 'suit'
            ? randomFloat(28, 32) : null;
        const neck = measurementType === 'shirt' || measurementType === 'suit'
            ? randomFloat(14, 17) : null;
        
        // Pant measurements
        const pantLength = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(38, 44) : null;
        const pantWaist = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(28, 42) : null;
        const hip = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(36, 46) : null;
        const thigh = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(20, 26) : null;
        const knee = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(16, 20) : null;
        const bottom = measurementType === 'pant' || measurementType === 'suit'
            ? randomFloat(14, 18) : null;
        
        const notes = Math.random() > 0.7 ? `Special instructions for ${measurementType}` : null;
        
        measurements.push([
            customerId, measurementType, chest, waist, shoulder, sleeveLength, shirtLength, neck,
            pantLength, pantWaist, hip, thigh, knee, bottom, notes
        ]);
    }
    
    const query = `INSERT INTO measurements (customer_id, measurement_type, chest, waist, shoulder, 
                   sleeve_length, shirt_length, neck, pant_length, pant_waist, hip, thigh, knee, bottom, notes) 
                   VALUES ?`;
    await db.query(query, [measurements]);
    console.log(`✓ ${count} measurements seeded successfully!`);
}

async function seedOrders(count = 200) {
    console.log(`Seeding ${count} orders...`);
    
    const [customerRows] = await db.query('SELECT id FROM customers');
    const customerIds = customerRows.map(row => row.id);
    
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2025-10-16');
    
    const orders = [];
    
    for (let i = 0; i < count; i++) {
        const customerId = randomItem(customerIds);
        const orderDate = formatDate(randomDate(startDate, endDate));
        const deliveryDate = formatDate(new Date(new Date(orderDate).getTime() + randomInt(7, 30) * 24 * 60 * 60 * 1000));
        const status = randomItem(statuses);
        const totalAmount = randomFloat(1000, 15000);
        const advancePayment = randomFloat(0, totalAmount * 0.8);
        const remainingPayment = totalAmount - advancePayment;
        const notes = Math.random() > 0.8 ? 'Special order requirements' : null;
        
        orders.push([customerId, orderDate, deliveryDate, status, totalAmount, advancePayment, remainingPayment, notes]);
    }
    
    const query = `INSERT INTO orders (customer_id, order_date, delivery_date, status, total_amount, 
                   advance_payment, remaining_payment, notes) VALUES ?`;
    await db.query(query, [orders]);
    console.log(`✓ ${count} orders seeded successfully!`);
}

async function seedOrderItems(avgItemsPerOrder = 2) {
    console.log('Seeding order items...');
    
    const [orderRows] = await db.query('SELECT id FROM orders');
    const [measurementRows] = await db.query('SELECT id, customer_id, measurement_type FROM measurements');
    
    let totalItems = 0;
    
    for (const order of orderRows) {
        const itemCount = randomInt(1, 4);
        const orderItems = [];
        
        // Get measurements for this order's customer
        const [customerOrder] = await db.query('SELECT customer_id FROM orders WHERE id = ?', [order.id]);
        const customerId = customerOrder[0].customer_id;
        const customerMeasurements = measurementRows.filter(m => m.customer_id === customerId);
        
        for (let i = 0; i < itemCount; i++) {
            const itemType = randomItem(itemTypes);
            const measurement = customerMeasurements.find(m => m.measurement_type === itemType);
            const measurementId = measurement ? measurement.id : null;
            const quantity = randomInt(1, 3);
            const fabricType = randomItem(fabricTypes);
            const color = randomItem(colors);
            const designDetails = Math.random() > 0.6 ? `Custom ${itemType} with special design` : null;
            const price = randomFloat(500, 5000);
            
            orderItems.push([order.id, measurementId, itemType, quantity, fabricType, color, designDetails, price]);
            totalItems++;
        }
        
        if (orderItems.length > 0) {
            const query = `INSERT INTO order_items (order_id, measurement_id, item_type, quantity, 
                          fabric_type, color, design_details, price) VALUES ?`;
            await db.query(query, [orderItems]);
        }
    }
    
    console.log(`✓ ${totalItems} order items seeded successfully!`);
}

async function seedPayments(avgPaymentsPerOrder = 1.5) {
    console.log('Seeding payments...');
    
    const [orderRows] = await db.query('SELECT id, order_date, advance_payment FROM orders WHERE status != "cancelled"');
    
    let totalPayments = 0;
    
    for (const order of orderRows) {
        // Always add the advance payment
        if (order.advance_payment > 0) {
            const paymentDate = order.order_date;
            const paymentMethod = randomItem(paymentMethods);
            
            await db.query(
                'INSERT INTO payments (order_id, amount, payment_date, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
                [order.id, order.advance_payment, paymentDate, paymentMethod, 'Advance payment']
            );
            totalPayments++;
        }
        
        // Randomly add additional payments
        if (Math.random() > 0.5) {
            const additionalPaymentCount = randomInt(1, 2);
            for (let i = 0; i < additionalPaymentCount; i++) {
                const amount = randomFloat(500, 3000);
                const paymentDate = formatDate(new Date(new Date(order.order_date).getTime() + randomInt(1, 20) * 24 * 60 * 60 * 1000));
                const paymentMethod = randomItem(paymentMethods);
                
                await db.query(
                    'INSERT INTO payments (order_id, amount, payment_date, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
                    [order.id, amount, paymentDate, paymentMethod, 'Additional payment']
                );
                totalPayments++;
            }
        }
    }
    
    console.log(`✓ ${totalPayments} payments seeded successfully!`);
}

async function runSeeder() {
    try {
        console.log('=================================');
        console.log('Starting Database Seeder...');
        console.log('=================================\n');
        
        await clearDatabase();
        await seedCustomers(200);
        await seedMeasurements(250);
        await seedOrders(200);
        await seedOrderItems();
        await seedPayments();
        
        console.log('\n=================================');
        console.log('✓ Database seeded successfully!');
        console.log('=================================');
        console.log('\nSummary:');
        
        const [customers] = await db.query('SELECT COUNT(*) as count FROM customers');
        const [measurements] = await db.query('SELECT COUNT(*) as count FROM measurements');
        const [orders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [orderItems] = await db.query('SELECT COUNT(*) as count FROM order_items');
        const [payments] = await db.query('SELECT COUNT(*) as count FROM payments');
        
        console.log(`- Customers: ${customers[0].count}`);
        console.log(`- Measurements: ${measurements[0].count}`);
        console.log(`- Orders: ${orders[0].count}`);
        console.log(`- Order Items: ${orderItems[0].count}`);
        console.log(`- Payments: ${payments[0].count}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

runSeeder();
