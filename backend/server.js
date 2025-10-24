import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only_change_in_production';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/finance_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  initialBalance: { type: Number, default: 0 },
}, { timestamps: true });

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  cause: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  month: { type: String, required: true },
  year: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ FIXED: Auth Routes with /api/auth prefix
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, initialBalance } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      initialBalance: initialBalance || 0,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, initialBalance: user.initialBalance },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, initialBalance: user.initialBalance },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ADD THIS: Get current user profile route
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: { 
        id: req.user._id, 
        name: req.user.name, 
        email: req.user.email, 
        initialBalance: req.user.initialBalance 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Transaction Routes
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, cause, amount } = req.body;
    
    // Get current month and year automatically
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear().toString();
    
    const transaction = new Transaction({
      userId: req.user._id,
      type,
      cause,
      amount,
      month,
      year,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user._id };
    
    if (month && year) {
      query.month = month;
      query.year = year;
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear().toString();

    const transactions = await Transaction.find({
      userId: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = req.user.initialBalance + totalDeposits - totalWithdrawals;

    res.json({
      balance,
      totalDeposits,
      totalWithdrawals,
      recentTransactions: transactions.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Finance Manager API is running!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JWT Secret: ${JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
});