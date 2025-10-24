import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getDashboardData
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);
router.get('/dashboard', getDashboardData);

export default router;