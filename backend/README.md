# Turf Booking System - Backend

RESTful API for the Turf Booking System built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Features

- 🔐 JWT Authentication (Client & Admin roles)
- 🏟️ Turf Management (CRUD operations)
- 📅 Slot Availability & Booking System
- 📧 Email Notifications (Booking confirmations)
- 🔒 Role-based Access Control
- ✅ Input Validation & Error Handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/turf_booking?schema=public"

# JWT Secret - Change this to a secure random string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=Turf Booking <your-email@gmail.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE turf_booking;
```

### 4. Run Database Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. (Optional) Seed Database

You can manually create an admin user or add sample turfs through the API.

## Running the Server

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Turfs

- `GET /api/turfs` - Get all active turfs (Public)
- `GET /api/turfs/:id` - Get turf by ID (Public)
- `POST /api/turfs` - Create turf (Admin only)
- `PUT /api/turfs/:id` - Update turf (Admin only)
- `DELETE /api/turfs/:id` - Delete turf (Admin only)

### Slots

- `GET /api/slots/available?turfId=&date=` - Get available slots (Public)
- `GET /api/slots` - Get all slots (Admin only)
- `POST /api/slots/generate` - Generate slots (Admin only)
- `PATCH /api/slots/:id` - Update slot status (Admin only)

### Bookings

- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/my-bookings` - Get user bookings (Protected)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)
- `GET /api/bookings` - Get all bookings (Admin only)
- `PATCH /api/bookings/:id` - Update booking status (Admin only)

## Database Schema

### User
- id, email, password, name, phone, role (CLIENT/ADMIN)

### Turf
- id, name, description, location, pricePerHour, images[], amenities[], isActive

### Slot
- id, turfId, date, startTime, endTime, isBooked

### Booking
- id, userId, slotId, turfId, totalAmount, status, paymentStatus

## Email Configuration (Gmail)

To use Gmail for sending emails:

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
3. Use this password in `EMAIL_PASS` environment variable

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── turfController.js
│   │   ├── slotController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── validation.js      # Input validation
│   ├── routes/
│   │   ├── auth.js
│   │   ├── turfs.js
│   │   ├── slots.js
│   │   └── bookings.js
│   ├── utils/
│   │   └── emailService.js    # Email notifications
│   └── server.js              # Main application
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Creating an Admin User

After starting the server, you can create an admin user by making a POST request to `/api/auth/register` with `role: "ADMIN"`:

```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "phone": "1234567890",
  "role": "ADMIN"
}
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

### Email Not Sending

- Verify Gmail credentials
- Check if App Password is generated correctly
- Ensure 2-Step Verification is enabled

### Port Already in Use

Change the PORT in .env file to a different port (e.g., 5001)

## License

ISC
