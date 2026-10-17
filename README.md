# MyKasho — Local Marketplace & Delivery Platform

**MyKasho** is a multi-vendor marketplace project designed to connect customers with local shops and sellers. The platform aims to make it easier for customers to discover products, place orders, make payments, and track deliveries through a single marketplace.

The project includes a customer-facing frontend, seller dashboard, admin panel, rider-related functionality, and a backend API.

> **Project status:** Under development. Features, integrations, and deployment configurations may change as development and testing continue.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Platform Modules](#platform-modules)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Order and Payment Flow](#order-and-payment-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Security](#security)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

MyKasho is being developed as a local commerce platform with support for multiple sellers and order fulfillment workflows.

The long-term goal is to support customers, shopkeepers, administrators, and delivery riders through connected interfaces and backend services.

### Target Marketplace Categories

- Grocery
- Pharmacy
- Electronics
- Fashion
- Local shops and other retail categories

Actual category availability depends on the current implementation and configuration.

## Key Features

### Customer Platform

- Customer authentication and profile management
- Product discovery and browsing
- Product categories and search
- Shopping cart and quantity management
- Saved delivery addresses
- Checkout and order placement
- Order history and order details
- Order cancellation workflows
- Online payment integration using Razorpay
- Cash on Delivery support where configured
- Checkout summary and payment verification
- Product reviews and notifications where implemented

### Seller Dashboard

- Seller shop profile management
- Product creation and management
- Product pricing and stock management
- Incoming order management
- Order acceptance and preparation workflows
- Order status updates
- Seller earnings and payout-history interface

Seller earnings and payout displays should be distinguished from actual settlements or payouts unless those financial workflows have been fully implemented and verified.

### Admin Panel

The planned administration functionality includes:

- Shop management
- Product management
- Order oversight
- Rider management
- Customer management
- Payment and commission oversight
- Marketplace analytics

The availability of each administrative operation depends on the implemented routes and permissions.

### Rider Functionality

The planned rider workflow includes:

- Rider profile management
- Availability status
- Delivery assignment
- Order acceptance
- Pickup and delivery status updates
- Delivery history and earnings information

Actual rider functionality depends on the current backend implementation.

---

## Platform Modules

| Module | Purpose |
|---|---|
| Customer frontend | Product browsing, cart, checkout, and orders |
| Seller dashboard | Shop, inventory, and order management |
| Admin panel | Marketplace administration |
| Rider functionality | Delivery assignment and fulfillment |
| Backend API | Business logic, authentication, and data access |
| PostgreSQL database | Persistent application data |
| Razorpay integration | Online payment processing |
| Cloudinary integration | Media and image management, where configured |
| Socket.IO | Real-time communication, where configured |

---

## Technology Stack

The project uses the following technologies in its current development setup. Exact versions should be checked in the relevant package files.

### Frontend
- React
- JavaScript
- CSS
- React Router, where configured

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Zod validation
- Socket.IO

### Integrations
- Razorpay for online payments
- Cloudinary for media storage
- OTP-based authentication and related services, where configured

### Development Tools
- Git and GitHub
- Visual Studio Code
- npm
- PostgreSQL tools, including pgAdmin and SQL Shell

---

## Project Structure

The repository contains separate application areas for the backend and frontend interfaces.

```text
anantnag-marketplace/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── services/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── config/
│   ├── package.json
│   └── server.js
│
├── seller/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
│
├── admin/
│   └── ...
│
└── README.md
```

**Note:** This is a high-level illustration of the project layout, not a guaranteed exhaustive file listing. Check the actual repository for the current locations and names of every folder.

---

## Backend Architecture

The backend follows a modular API structure.

### Routes

Routes define API endpoints and connect incoming requests to the appropriate controllers. Route modules cover areas such as authentication, products, shops, customers, carts, orders, riders, reviews, notifications, and administration.

### Controllers

Controllers handle incoming requests, validate or interpret request data, invoke the necessary business logic, and return API responses.

### Middleware

Middleware supports shared request-processing tasks such as authentication, authorization, and validation.

### Validators

Zod schemas and other validation logic help validate incoming request data before business operations are performed.

### Services

Service modules contain reusable business logic, including payment processing and delivery-related operations where implemented.

### Prisma and PostgreSQL

Prisma provides database access through the configured Prisma Client. Database schema changes are managed through Prisma migrations.

The exact responsibilities of each module should be confirmed against the current source code.

---

## Order and Payment Flow

The intended customer order flow is:

1. Browse products.
2. Add products to the cart.
3. Review the cart and checkout summary.
4. Select a delivery address.
5. Choose an available payment method.
6. Complete checkout.
7. Verify online payment when applicable.
8. Create or confirm the relevant order records.
9. Track the order through the supported status workflow.

### Multi-Seller Checkout

The backend has been extended to support a combined checkout payment workflow involving multiple shops. The checkout-payment model and associated order relationships have been added through database migrations.

The exact transaction boundaries, failure handling, refund behavior, and seller settlement process should be verified against the current implementation before being treated as production-ready.

### Razorpay

The backend includes payment-related functionality for operations such as:

- Creating a Razorpay order
- Verifying payment signatures
- Handling checkout payment records
- Supporting cancellation and refund workflows where implemented

**Important:** Payment verification must happen on the server. Client-side payment success alone must not be treated as proof of a verified payment.

Razorpay settlement and seller payout functionality must be configured and tested separately where required.

---

## Getting Started

### Prerequisites

Install the tools required by the relevant project modules:

- Node.js and npm
- PostgreSQL
- Git
- A code editor such as Visual Studio Code

You will also need valid credentials for any external services you intend to run, such as Razorpay or Cloudinary.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd anantnag-marketplace
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the actual repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a local `.env` file using the variables required by the backend configuration.

Do not copy real production secrets into the repository.

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure the database connection string.

Ensure that the database user has the permissions required by Prisma.

### 5. Generate Prisma Client

From the backend directory, run the command supported by the installed Prisma version and project configuration:

```bash
npx prisma generate
```

### 6. Apply Database Migrations

For an existing database and a deployed or shared environment, use the appropriate migration deployment workflow:

```bash
npx prisma migrate deploy
```

For local development, `npx prisma migrate dev` can be used when appropriate. Follow the project's current Prisma configuration and migration history.

**Do not reset or delete an existing database simply to make migrations run.** Back up important data before performing database changes.

### 7. Start the Backend

Check the scripts in `backend/package.json` to determine the configured start command. A common development command is:

```bash
npm run dev
```

If this script is not defined, use the actual script configured in the project.

---

## Environment Variables

The exact required variables depend on the current configuration files. Common examples may include:

```env
DATABASE_URL=
PORT=

JWT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Additional variables may be required for OTP delivery, frontend URLs, CORS, Socket.IO, or other integrations.

These names are illustrative. Confirm the actual variable names and requirements by inspecting the backend configuration before starting the application.

### Secret Management

- Never commit `.env` files containing credentials.
- Never expose payment secrets or authentication secrets in frontend code.
- Use separate credentials for development and production.
- Rotate credentials immediately if they are accidentally exposed.
- Keep database backups and production data outside public repositories.

---

## Database Setup

The project uses PostgreSQL with Prisma.

Database models and migration history are maintained in the backend's Prisma configuration.

The project has included migrations for checkout payment functionality and cancelled payment status. Before deploying, verify that every required migration has been applied successfully and that the generated Prisma Client matches the schema.

Useful commands include:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
```

Run these commands from the backend directory, using the project's installed Prisma version and configuration.

---

## Running the Application

Each frontend or backend module may have its own package configuration and development command.

To run a module:

1. Open its directory.
2. Install dependencies if needed.
3. Configure the required environment variables.
4. Start it using the scripts in that module's `package.json`.

The backend, seller dashboard, and admin panel may require separate development servers.

Frontend API base URLs, authentication configuration, and backend CORS settings must be aligned for local development.

Deployment instructions should be updated when the final hosting providers, production domains, and environment configuration are confirmed.

---

## Testing

Testing is being performed incrementally across the platform.

The planned test areas include:

- Shopkeeper profile creation and updates
- Shop status management
- Rider profile and vehicle information
- Customer profiles and addresses
- Cart operations
- Customer order workflows
- Admin shop and rider management
- Product creation, updates, deletion, search, and listing
- Order creation, updates, cancellation, and listing
- Payment creation, verification, refunds, and settlement-related workflows
- Other API and integration tests

### Testing Principles

- Run tests against the intended environment.
- Confirm authentication and authorization for protected routes.
- Test invalid inputs and error responses.
- Verify database changes after successful operations.
- Test payment failure, cancellation, and duplicate-request scenarios.
- Record results so previously passed tests do not need to be repeated unnecessarily.

Do not assume every listed test has passed. Maintain a separate record of completed, failed, and pending tests.

---

## Security

Security is an important requirement for a marketplace handling customer information and payments.

Development and production configurations should enforce:

- Authentication for protected endpoints
- Role-based authorization for customers, sellers, riders, and administrators
- Server-side validation of user input
- Secure handling of payment credentials
- Server-side payment-signature verification
- Appropriate access controls for customer and order data
- Safe handling of uploaded files
- Rate limiting and abuse protection where appropriate
- Secure production environment variables
- Appropriate logging without exposing sensitive data

A feature should be considered production-ready only after its relevant security and failure scenarios have been reviewed.

---

## Development Roadmap

The planned development and verification work includes:

- Complete and verify seller workflows
- Complete and verify rider workflows
- Validate customer profiles, addresses, carts, and orders
- Verify admin management operations
- Verify product CRUD and search functionality
- Test complete order lifecycle scenarios
- Verify payment verification, cancellations, and refunds
- Confirm settlement and payout requirements
- Complete integration and regression testing
- Prepare production deployment and monitoring

Roadmap items may change as implementation and testing progress.

---

## Contributing

Contributions and development improvements are welcome.

Before submitting changes:

1. Review the existing project structure.
2. Avoid committing secrets, backups, database dumps, or private data.
3. Keep changes focused and maintainable.
4. Test the affected functionality.
5. Document new environment variables and setup requirements.
6. Provide a clear commit message describing the change.

For larger changes, describe the intended behavior and any migration or deployment requirements before implementation.

---

## License

A license has not been specified in this README. Unless a license is added to the repository, reuse and redistribution permissions should not be assumed.

---

**MyKasho — Building a connected local marketplace experience.**
