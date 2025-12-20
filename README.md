# 🏟️ TurfBook - Sports Turf Booking Platform

A modern, full-stack turf booking application built with Next.js, Express, and MongoDB. Book sports turfs in Bangalore with real-time slot availability, payment processing, and email notifications.

## 🌐 Live Demo

- **Frontend**: https://truf-book.vercel.app
- **Backend API**: https://truf-rose.vercel.app/api

## ✨ Features

### 🔐 User Authentication
- Secure registration and login with JWT
- Password hashing with bcrypt
- Protected routes and API endpoints
- Persistent authentication across sessions

### 🏟️ Turf Management
- Browse 4+ turfs in Bangalore
- Filter by sport (Cricket, Football, Basketball, etc.)
- View detailed turf information
- High-quality images and ratings
- Amenities and operating hours

### 📅 Smart Booking System
- **Interactive Calendar**: Select dates up to 30 days ahead
- **Real-Time Slot Availability**: Prevents double bookings
- **Multi-Slot Selection**: Book multiple consecutive slots
- **Auto-Refresh**: Slots update every 10 seconds
- **Sport Selection**: Choose from available sports
- **Player Count**: Specify number of players

### 💳 Payment Integration
- Mock payment gateway (ready for Razorpay/Stripe)
- Multiple payment methods (UPI, Card, Net Banking, Wallet)
- Secure payment confirmation
- Booking reference generation

### 📧 Email Notifications
- Beautiful HTML email templates
- Booking confirmation emails
- Cancellation notifications
- Refund status updates

### 📱 My Bookings
- View all bookings
- Filter by status (Upcoming, Past, Cancelled)
- Cancel bookings (2-hour refund policy)
- Booking details and history

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: Sonner (Toast)
- **Calendar**: Custom React Calendar

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer
- **Validation**: Custom middleware
- **Security**: bcrypt, CORS

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Truf
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URL and secrets

# Generate Prisma client
npx prisma generate

# Seed database with sample turfs
npm run seed

# Start backend
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
Truf/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.js                # Sample data seeder
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Prisma client
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── turfController.js
│   │   │   ├── bookingController.js
│   │   │   └── paymentConfirmController.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   └── validation.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── turfs.js
│   │   │   ├── bookings.js
│   │   │   └── payment.js
│   │   ├── utils/
│   │   │   └── emailService.js    # Email templates
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── register/              # Registration page
    │   ├── login/                 # Login page
    │   ├── turfs/                 # Browse turfs
    │   ├── book/[turfId]/         # Booking page
    │   ├── payment/               # Payment page
    │   ├── bookings/              # My bookings
    │   └── layout.tsx
    ├── components/
    │   ├── ui/                    # shadcn components
    │   ├── Navbar.tsx
    │   └── Footer.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── lib/
    │   └── api.ts
    └── package.json
```

## 🔄 User Flow

1. **Register/Login** → Create account or sign in
2. **Browse Turfs** → View available turfs in Bangalore
3. **Select Turf** → Click "Book Now" on desired turf
4. **Choose Slots** → Select date, sport, and time slots
5. **Payment** → Complete mock payment
6. **Confirmation** → Receive email and booking ID
7. **My Bookings** → View and manage bookings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Turfs
- `GET /api/turfs/list` - List all turfs (with filters)
- `GET /api/turfs/:id` - Get turf details
- `GET /api/turfs/:id/slots?date=YYYY-MM-DD` - Get available slots

### Bookings
- `POST /api/bookings/confirm-payment` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking

## 🎨 Design System

- **Theme**: Dark mode with black background
- **Font**: Poppins (Google Fonts)
- **Colors**: Black, White, Zinc grays
- **Effects**: Glassmorphism, smooth animations
- **Responsive**: Mobile-first design

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Protected API routes
- Environment variable management

## 📧 Email Templates

- **Booking Confirmation**: Beautiful gradient design with booking details
- **Cancellation Notice**: Refund information and booking details
- **SMTP Configuration**: Nodemailer with Gmail/custom SMTP

## 🐛 Troubleshooting

### Slots not updating for other users
**Solution**: Implemented auto-refresh (every 10 seconds) and cache-busting

### Frontend shows API errors
**Solution**: Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Database connection failed
**Solution**: Verify MongoDB Atlas IP whitelist and DATABASE_URL

### Email not sending
**Solution**: Check EMAIL_* environment variables in backend

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=TurfBook <noreply@turfbook.com>
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://truf-rose.vercel.app/api
```

## 🚀 Deployment

### Vercel Deployment

1. **Frontend**:
   - Connect GitHub repository to Vercel
   - Set `NEXT_PUBLIC_API_URL` environment variable
   - Deploy from `main` branch

2. **Backend**:
   - Create separate Vercel project
   - Set all backend environment variables
   - Deploy from `main` branch

3. **Database**:
   - Use MongoDB Atlas
   - Whitelist Vercel IPs (0.0.0.0/0 for serverless)

## ✅ Features Completed

- ✅ User authentication (register/login)
- ✅ Turf browsing with filters
- ✅ Real-time slot availability
- ✅ Multi-slot booking
- ✅ Payment flow (mock)
- ✅ Email notifications
- ✅ Booking management
- ✅ Cancellation with refund policy
- ✅ Responsive design
- ✅ Auto-refresh slots
- ✅ Double-booking prevention

## 🔜 Future Enhancements

- [ ] Real payment gateway (Razorpay/Stripe)
- [ ] Multi-city support (Mumbai, Delhi, Chennai)
- [ ] User reviews and ratings
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Recurring bookings
- [ ] Mobile app (React Native)

## 📊 Sample Data

4 turfs seeded in Bangalore:
- Sports Complex Bangalore
- Champions Field Bangalore
- Turf Zone Bangalore
- Play Ground Bangalore

Each with multiple sports, amenities, and pricing ₹500-₹1400/hour.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Status**: ✅ Production-ready and deployed!

**Live App**: https://truf-book.vercel.app 🚀
