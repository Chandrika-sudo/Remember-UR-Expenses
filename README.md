A full-stack personal finance management application built with React.js frontend and Node.js/Express backend with MongoDB.

**Features**

Frontend:
1.Beautiful Landing Page - Modern gradient design with clear call-to-action
2.User Authentication - Secure signup and login with JWT
3.Dashboard - Overview of current balance, deposits, and withdrawals
4.Transaction Management - Add, view, and delete deposits/withdrawals
5.Monthly Reports - Visual charts and analytics of financial data
6.Responsive Design - Works perfectly on desktop and mobile devices
7.Protected Routes - Secure access to authenticated pages

Backend
1.RESTful API - Clean and well-structured endpoints
2.JWT Authentication - Secure token-based authentication
3.MongoDB Integration - NoSQL database for efficient data storage
4.Password Hashing - BCrypt encryption for user security
5.CORS Enabled - Cross-origin resource sharing configured
6.Error Handling - Comprehensive error management

**Tech Stack**

Frontend
React.js - Frontend framework
Vite - Build tool and development server
React Router DOM - Client-side routing
Tailwind CSS - Utility-first CSS framework
React Icons - Beautiful icons
Axios - HTTP client for API calls

Backend
Node.js - Runtime environment
Express.js - Web application framework
MongoDB - NoSQL database
Mongoose - MongoDB object modeling
JWT - JSON Web Tokens for authentication
BCrypt.js - Password hashing
CORS - Cross-origin resource sharing
Dotenv - Environment variables

personal-finance-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── jwtUtils.js
│   ├── config/
│   │   └── jwtConfig.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SignIn.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MonthlyReport.jsx
    │   │   ├── ExpensesPage.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js

Prerequisites
Node.js (v14 or higher)
MongoDB (Compass or Atlas)
npm or yarn

Backend Setup
1.Navigate to backend directory
cd backend
2.Install dependencies
npm install
3.Create environment file
# Create .env file in backend directory
JWT_SECRET=your_jwt_secret_key_
MONGODB_URI=mongodb://Mongo_LocalHost_URI/Data_Base_name
PORT=XXXX
4.Start MongoDB
mongod
5.Start Server
npm start

Frontend Setup
1.Navigate to frontend directory
cd frontend
2.Install dependencies
npm install
3.Start the development server
npm run dev

**API Endpoints**

1.Authentication Routes
POST /api/auth/signup - User registration
POST /api/auth/signin - User login
GET /api/auth/me - Get current user profile

2.Transaction Routes
POST /api/transactions - Create new transaction
GET /api/transactions - Get user transactions
DELETE /api/transactions/:id - Delete transaction

3.Dashboard Routes
GET /api/dashboard - Get dashboard data

4.Health Check
GET /api/health - API status check

**Database Models**

User Model
{
  name: String,
  email: String (unique),
  password: String (hashed),
  initialBalance: Number,
  timestamps: true
}
Transaction Model
{
  userId: ObjectId (ref: User),
  type: String (enum: ['deposit', 'withdrawal']),
  cause: String,
  amount: Number,
  date: Date,
  month: String,
  year: String,
  timestamps: true
}

**Frontend Configuration**
Vite - Fast development build tool
Tailwind CSS - Utility-first CSS framework
React Router - Client-side routing



License
This project is licensed under the MIT License.

Author
Developed with ❤️ for personal finance management.
