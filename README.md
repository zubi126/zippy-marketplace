README.md
# Zippy — Hyperlocal Marketplace Backend

Zippy is a hyperlocal multi-vendor marketplace platform designed to connect customers with local shops and businesses, initially focused on Anantnag, Jammu & Kashmir.

The platform allows customers to discover products, place orders, track deliveries, and review products, while shopkeepers and riders manage their respective operations through role-based systems.

---

## 🚀 Project Status

**Backend:** In Active Development

### Completed

- Customer authentication with OTP
- JWT-based authentication
- Role-based authorization
- Shop management
- Category management
- Product management
- Inventory management
- Cart management
- Address management
- Order management
- Rider management
- Admin management
- Delivery management
- Real-time rider tracking with Socket.IO
- Product reviews and ratings
- Review update/delete protection
- JWT security hardening
- API rate limiting
- OTP rate limiting
- Input validation with Zod
- Security headers with Helmet

### In Progress

- Web Push Notifications
- Razorpay Payments
- Payment & Order Accounting
- Inventory Concurrency Hardening

---

## 🏗️ Architecture

Zippy uses a centralized backend architecture with role-based access control.

```text
                    ZIPPY BACKEND
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      CUSTOMER       SHOPKEEPER       RIDER
          │              │              │
          └──────────────┼──────────────┘
                         │
                    ADMIN SYSTEM
                         │
              ┌──────────┴──────────┐
              │                     │
          PostgreSQL            Socket.IO
              │                     │
            Prisma           Live Tracking
👥 User Roles
Customer
Customers can:
- Register/login using OTP
- Browse categories
- Browse products
- Add products to cart
- Manage addresses
- Place orders
- Track orders
- Track riders in real time
- Review purchased products
- Update/delete their own reviews
Shopkeeper
Shopkeepers can:
- Create/manage their shop
- Manage shop status
- Add products
- Update product information
- Manage inventory
- View/manage orders
- Update order preparation status
Rider
Riders can:
- Manage rider profile
- Manage availability/status
- View assigned deliveries
- Accept deliveries
- Update delivery status
- Share live location
- Join authorized order tracking rooms
Admin
Admins can manage:
- Customers
- Shopkeepers
- Shops
- Riders
- Products
- Orders
- Platform operations


🔐 Authentication & Security
Zippy uses JWT-based authentication combined with OTP verification.

Security features currently implemented:
- JWT authentication
- JWT expiration
- HS256 algorithm restriction
- JWT required-claim validation
- Role-based authorization
- Resource ownership checks
- OTP expiration
- OTP attempt limits
- OTP resend cooldown
- API rate limiting
- OTP-specific rate limiting
- Zod request validation
- Helmet security headers
- Socket.IO authentication
- Socket.IO order-room authorization
Sensitive configuration is stored in environment variables.


📱 Real-Time Tracking
Zippy uses Socket.IO for real-time rider tracking.
Rider Browser
      │
      │ Location Update
      ↓
   Socket.IO
      │
      ↓
 Order Room
      │
      ↓
Customer Browser
      │
      ↓
Live Rider Location
Customers and riders can only join order rooms they are authorized to access.


⭐ Reviews & Ratings
Customers can review products from delivered orders.
The review system includes:
- 1–5 star ratings
- Optional comments
- Delivered-order verification
- Product/order ownership verification
- Duplicate review prevention
- Average rating calculation
- Review listing
- Review updates
- Review deletion
- Customer ownership protection


🛠️ Tech Stack
Backend
- Node.js
- Express.js
- JavaScript
- PostgreSQL
- Prisma ORM
- JWT
- Socket.IO


Security & Validation
- Helmet
- express-rate-limit
- Zod
- bcryptjs
- JSON Web Tokens
Planned Integrations
- Razorpay
- Web Push Notifications
- Payment settlement / marketplace payments




📂 Backend Structure
backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── lib/
│
├── socket-test.js
├── socket-customer-test.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .env.example



⚙️ Installation
Clone the repository:
git clone YOUR_REPOSITORY_URL

Move into the backend:
cd anantnag-marketplace/backend

Install dependencies:
npm install

🔑 Environment Variables
Create a .env file in the backend directory.
Example:
PORT=5000

DATABASE_URL="your_database_url"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

TWOFACTOR_API_KEY="your_2factor_api_key"
Never commit the real .env file to GitHub.
Use .env.example as the configuration reference.

🗄️ Database Setup
After configuring the database:
npx prisma migrate dev
Generate Prisma Client if required:
npx prisma generate

▶️ Running the Backend
Development:
npm run dev
Production:
npm start

The API runs by default on:
http://localhost:5000

🧪 API Health Check
Open:

GET /
Expected response:

{
  "message": "Anantnag Marketplace API is running"
}


Database health check:
GET /db-test


🔌 Main API Modules
/api/auth
/api/shops
/api/shop
/api/admin
/api/categories
/api/products
/api/cart
/api/addresses
/api/orders
/api/riders
/api/reviews


🔔 Planned Web Push Notifications
Zippy will support browser-based push notifications for:
- New orders
- Order acceptance
- Order preparation
- Order ready for pickup
- Rider assignment
- Rider pickup
- Delivery updates
- Order completion
Notifications will work directly through supported web browsers, so a dedicated mobile application is not required for the initial implementation.


💳 Planned Payments
Razorpay will be integrated for online payments.

Planned payment flow:
Customer
    ↓
Create Order
    ↓
Razorpay Payment
    ↓
Payment Verification
    ↓
Order Confirmation
Marketplace settlement through Razorpay Route will be integrated after the required Razorpay activation/approval is available.


🗺️ Roadmap
[x] Authentication & OTP
[x] Role-based authorization
[x] Shops
[x] Categories
[x] Products
[x] Inventory
[x] Cart
[x] Addresses
[x] Orders
[x] Riders
[x] Admin operations
[x] Real-time tracking
[x] Reviews & Ratings
[x] Security hardening

[ ] Web Push Notifications
[ ] Razorpay Payments
[ ] Payment & Order Accounting
[ ] Inventory Concurrency Hardening
[ ] Final API Security Audit
[ ] Production Deployment
[ ] Customer Web Frontend
[ ] Shopkeeper Dashboard
[ ] Rider Dashboard
[ ] Admin Dashboard


📌 Development Approach
Zippy is being developed as a modular backend where:
- Authentication is centralized
- Authorization is role-based
- Business logic is separated into controllers/services
- Database access is handled through Prisma
- Real-time functionality uses Socket.IO
- Security is handled through dedicated middleware
- External payment and notification services are isolated from core business logic


📄 License
This project is currently under private development.
All rights reserved.

### Ek correction jo maine jaan-bujhkar README mein rakhi hai

**Razorpay Route ko "implemented" nahi likha**, kyunki abhi Razorpay se activation/approval pending hai. Payment module bhi abhi `Planned` hai.

Aur **Push Notifications ko Web Push** ke naam se rakha hai, kyunki tumhara product currently **website-based** hai; mobile app required nahi hai.

Ab isko `README.md` mein save kar do. **Uske baad hum directly Push Notifications ka Step 1 — Prisma `PushSubscription`
