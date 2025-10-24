import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { dashboardAPI } from '../services/api.js';
import { 
  FaLeaf, 
  FaChartBar, 
  FaMoneyBillWave, 
  FaSignOutAlt, 
  FaPlus, 
  FaMinus 
} from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-4 md:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white/90">
            Hello, <span className="text-cyan-400">{user?.name || 'User'}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2 shadow-md"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-purple-800/60 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-purple-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-cyan-400 mb-2">
                <FaLeaf size={32} />
              </div>
              <div className="text-gray-200 text-lg mb-1">Current Balance</div>
              <div className="text-5xl font-extrabold text-white drop-shadow-md">
                ₹{dashboardData.balance.toFixed(2)}
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-green-400 flex items-center gap-2">
                <FaPlus /> ₹{dashboardData.totalDeposits.toFixed(2)}
              </div>
              <div className="text-red-400 flex items-center gap-2">
                <FaMinus /> ₹{dashboardData.totalWithdrawals.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-800/60 rounded-2xl p-6 border border-purple-700 shadow-lg hover:bg-purple-700/60 transition">
            <div className="text-green-400 mb-2">
              <FaPlus size={24} />
            </div>
            <div className="text-gray-300">Total Deposits</div>
            <div className="text-2xl font-bold text-white">₹{dashboardData.totalDeposits.toFixed(2)}</div>
          </div>
          
          <div className="bg-purple-800/60 rounded-2xl p-6 border border-purple-700 shadow-lg hover:bg-purple-700/60 transition">
            <div className="text-red-400 mb-2">
              <FaMinus size={24} />
            </div>
            <div className="text-gray-300">Total Withdrawals</div>
            <div className="text-2xl font-bold text-white">₹{dashboardData.totalWithdrawals.toFixed(2)}</div>
          </div>
          
          <div className="bg-purple-800/60 rounded-2xl p-6 border border-purple-700 shadow-lg hover:bg-purple-700/60 transition">
            <div className="text-cyan-400 mb-2">
              <FaLeaf size={24} />
            </div>
            <div className="text-gray-300">Net Flow</div>
            <div className="text-2xl font-bold text-white">
              ₹{(dashboardData.totalDeposits - dashboardData.totalWithdrawals).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/monthly-report"
            className="bg-purple-800/60 rounded-2xl p-6 border border-purple-700 hover:bg-purple-700/70 transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-cyan-400">
                  <FaChartBar size={32} />
                </div>
                <div>
                  <span className="text-white text-xl font-semibold">Monthly Report</span>
                  <p className="text-gray-400 mt-1 text-sm">View detailed analytics and charts</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </div>
          </Link>

          <Link
            to="/expenses"
            className="bg-purple-800/60 rounded-2xl p-6 border border-purple-700 hover:bg-purple-700/70 transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-cyan-400">
                  <FaMoneyBillWave size={32} />
                </div>
                <div>
                  <span className="text-white text-xl font-semibold">Manage Transactions</span>
                  <p className="text-gray-400 mt-1 text-sm">Add deposits and withdrawals</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        {dashboardData.recentTransactions.length > 0 && (
          <div className="bg-purple-800/60 rounded-2xl p-6 mt-8 border border-purple-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-purple-700/50 rounded-lg hover:bg-purple-700/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'deposit'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {transaction.type === 'deposit' ? <FaPlus size={16} /> : <FaMinus size={16} />}
                    </div>
                    <div>
                      <div className="text-white font-medium">{transaction.cause}</div>
                      <div className="text-gray-400 text-sm">
                        {transaction.month} {transaction.year}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
