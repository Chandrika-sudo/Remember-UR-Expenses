import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

/**
 * @desc    Create new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
export const createTransaction = async (req, res) => {
  try {
    const { type, cause, amount } = req.body;
    
    // 1. Validate required fields
    if (!type || !cause || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, cause, and amount'
      });
    }

    // 2. Validate transaction type
    if (!['deposit', 'withdrawal'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Transaction type must be either deposit or withdrawal'
      });
    }

    // 3. Get current month and year
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear().toString();

    // 4. Create transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      cause,
      amount,
      month,
      year
    });

    // 5. Populate and send response
    await transaction.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction'
    });
  }
};

/**
 * @desc    Get user transactions
 * @route   GET /api/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // 1. Build query
    let query = { userId: req.user._id };
    
    if (month && year) {
      query.month = month;
      query.year = year;
    }

    // 2. Get transactions
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name email');

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
};

/**
 * @desc    Delete transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction'
    });
  }
};

/**
 * @desc    Get dashboard data
 * @route   GET /api/transactions/dashboard
 * @access  Private
 */
export const getDashboardData = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear().toString();

    // 1. Get current month transactions
    const transactions = await Transaction.find({
      userId: req.user._id,
      month: currentMonth,
      year: currentYear
    }).sort({ date: -1 });

    // 2. Calculate totals
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    // 3. Calculate current balance
    const balance = req.user.initialBalance + totalDeposits - totalWithdrawals;

    res.json({
      success: true,
      data: {
        balance,
        totalDeposits,
        totalWithdrawals,
        recentTransactions: transactions.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
};