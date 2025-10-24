import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: [true, 'Transaction type is required']
  },
  cause: {
    type: String,
    required: [true, 'Transaction cause is required'],
    trim: true,
    maxlength: [100, 'Cause cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  date: {
    type: Date,
    default: Date.now
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, month: 1, year: 1 });

export default mongoose.model('Transaction', transactionSchema);