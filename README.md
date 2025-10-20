# iTailor - Tailor Management System

A comprehensive tailor management system built with Node.js, Angular 16, and MySQL.

## Features

- **Customer Management**: Add, edit, delete, and search customers
- **Measurements**: Store detailed measurements for shirts, pants, suits, and kurtas
- **Order Management**: Create and track orders with multiple items
- **Payment Tracking**: Record payments and track pending amounts
- **Dashboard**: View statistics and recent orders at a glance
- **Status Tracking**: Monitor order progress from pending to delivered

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **REST API** architecture

### Frontend
- **Angular 16**
- **TypeScript**
- **Responsive CSS**

## Project Structure

```
Rehan.iTailorV1/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── measurementController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── measurementRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── dashboard/
    │   │   │   ├── customers/
    │   │   │   ├── orders/
    │   │   │   ├── measurements/
    │   │   │   └── navbar/
    │   │   ├── services/
    │   │   │   └── api.service.ts
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE itailor_db;
```

2. Import the schema:
```bash
mysql -u root -p itailor_db < backend/database/schema.sql
```

Or run the SQL file directly in MySQL Workbench or phpMyAdmin.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
copy .env.example .env
```

4. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=itailor_db
DB_PORT=3306
PORT=3000
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/search?q=query` - Search customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Measurements
- `GET /api/measurements/customer/:customerId` - Get measurements by customer
- `GET /api/measurements/:id` - Get measurement by ID
- `POST /api/measurements` - Create new measurement
- `PUT /api/measurements/:id` - Update measurement
- `DELETE /api/measurements/:id` - Delete measurement

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/customer/:customerId` - Get orders by customer
- `GET /api/orders/stats` - Get dashboard statistics
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Payments
- `GET /api/payments/order/:orderId` - Get payments by order
- `POST /api/payments` - Create new payment
- `DELETE /api/payments/:id` - Delete payment

## Database Schema

### Tables
- **customers**: Store customer information
- **measurements**: Store customer measurements
- **orders**: Store order details
- **order_items**: Store individual items in orders
- **payments**: Track payment history

## Usage Guide

### Adding a Customer
1. Navigate to the Customers page
2. Click "Add Customer"
3. Fill in customer details (name and phone are required)
4. Click "Create"

### Adding Measurements
1. Go to Customers page
2. Click "Measurements" button for a customer
3. Click "Add Measurement"
4. Select measurement type and enter measurements
5. Click "Create"

### Creating an Order
1. Navigate to the Orders page
2. Click "Create Order"
3. Select customer and add order details
4. Add order items with measurements, fabric, and price
5. Enter advance payment if any
6. Click "Create Order"

### Recording Payments
1. Go to Orders page
2. Click "Add Payment" for an order with pending payment
3. Enter payment amount and details
4. Click "Record Payment"

### Tracking Orders
- Use the status dropdown in the orders table to update order status
- Available statuses: Pending, In Progress, Ready, Delivered, Cancelled

## Features in Detail

### Dashboard
- Total customers count
- Total orders count
- Orders by status (Pending, In Progress, Ready)
- Total revenue
- Pending payments
- Recent orders list

### Customer Management
- Full CRUD operations
- Search functionality
- View customer measurements
- View customer orders

### Measurement System
- Support for multiple garment types
- Detailed measurements for shirts, pants, suits, and kurtas
- Measurement history per customer
- Notes field for special instructions

### Order Management
- Multiple items per order
- Link measurements to order items
- Track fabric type, color, and design details
- Automatic total calculation
- Payment tracking
- Status management

### Payment System
- Multiple payment methods (Cash, Card, UPI, Bank Transfer)
- Payment history per order
- Automatic balance calculation
- Advance and remaining payment tracking

## Development

### Adding New Features
1. Backend: Add controller in `controllers/`, route in `routes/`
2. Frontend: Create component, add to `app.module.ts`, update routing

### Database Migrations
- Modify `backend/database/schema.sql` for schema changes
- Create backup before running migrations

## Security Notes

- This is a basic implementation without authentication
- For production use, implement:
  - User authentication and authorization
  - Input validation and sanitization
  - SQL injection prevention (using parameterized queries - already implemented)
  - HTTPS/SSL
  - Rate limiting
  - CORS configuration

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure port 3000 is not in use

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 4200 is available
- Verify Angular CLI is installed: `npm install -g @angular/cli@16`

### Database connection errors
- Verify MySQL service is running
- Check database name and credentials
- Ensure database exists and schema is imported

### CORS errors
- Backend already has CORS enabled
- If issues persist, check browser console for specific errors

## License

This project is open source and available for personal and commercial use.

## Support

For issues and questions, please create an issue in the project repository.

---

**Built with ❤️ for tailors and fashion businesses**
