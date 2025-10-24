import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { transactionsAPI, dashboardAPI } from '../services/api.js';
import { 
  FaArrowLeft, FaSignOutAlt, FaPlus, FaMinus, 
  FaTrash, FaMoneyBillWave, FaChartBar, FaHome 
} from 'react-icons/fa';

const ExpensesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [newTransaction, setNewTransaction] = useState({
    type: 'deposit',
    cause: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear().toString();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, dashboardRes] = await Promise.all([
        transactionsAPI.getAll(currentMonth, currentYear),
        dashboardAPI.getData()
      ]);
      
      setTransactions(transactionsRes.data);
      setBalance(dashboardRes.data.balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTransaction.cause || !newTransaction.amount) return;

    setSubmitting(true);
    try {
      const transactionData = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        month: currentMonth,
        year: currentYear,
      };

      await transactionsAPI.create(transactionData);
      await fetchData();
      
      setNewTransaction({
        type: 'deposit',
        cause: '',
        amount: '',
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionsAPI.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const deposits = transactions.filter(t => t.type === 'deposit');
  const withdrawals = transactions.filter(t => t.type === 'withdrawal');
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-purple-900 relative text-white p-4 md:p-8">
      {/* Optional soft gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-950 to-black opacity-90"></div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-500/20 border border-indigo-400 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-500/30 transition-all"
            >
              <FaHome /> Dashboard
            </button>
            <button
              onClick={() => navigate('/monthly-report')}
              className="bg-cyan-500/20 border border-cyan-400 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-500/30 transition-all"
            >
              <FaChartBar /> Monthly Report
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Balance and Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Balance Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <FaMoneyBillWave className="text-cyan-400 text-xl" />
                <h3 className="text-xl font-bold">Current Balance</h3>
              </div>
              <div className="text-3xl font-bold mb-2">Rs {balance.toFixed(2)}</div>
              <div className="text-white/70 text-sm">
                {currentMonth} {currentYear}
              </div>
            </div>

            {/* Add Transaction Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'deposit'})}
                      className={`p-3 rounded-xl border transition-all ${
                        newTransaction.type === 'deposit'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <FaPlus className="inline mr-2" /> Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'withdrawal'})}
                      className={`p-3 rounded-xl border transition-all ${
                        newTransaction.type === 'withdrawal'
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <FaMinus className="inline mr-2" /> Withdrawal
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={newTransaction.cause}
                    onChange={(e) => setNewTransaction({...newTransaction, cause: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Amount (Rs)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    `Add ${newTransaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}`
                  )}
                </button>
              </form>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Deposits:</span>
                  <span className="text-green-400 font-bold">+Rs {totalDeposits.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Withdrawals:</span>
                  <span className="text-red-400 font-bold">-Rs {totalWithdrawals.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Net Flow:</span>
                  <span className={`font-bold ${totalDeposits >= totalWithdrawals ? 'text-green-400' : 'text-red-400'}`}>
                    {totalDeposits >= totalWithdrawals ? '+' : '-'}Rs {Math.abs(totalDeposits - totalWithdrawals).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">
                Recent Transactions - {currentMonth} {currentYear}
              </h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FaMoneyBillWave className="text-white/30 text-4xl mx-auto mb-4" />
                  <p className="text-white/50">No transactions yet</p>
                  <p className="text-white/30 text-sm mt-2">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? <FaPlus /> : <FaMinus />}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{transaction.cause}</div>
                          <div className="text-white/50 text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-bold ${
                          transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}Rs {transaction.amount.toFixed(2)}
                        </div>
                        
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
