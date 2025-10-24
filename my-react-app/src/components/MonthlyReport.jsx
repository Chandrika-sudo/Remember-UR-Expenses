import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { transactionsAPI } from '../services/api.js';
import { FaArrowLeft, FaSignOutAlt, FaChartBar, FaHome, FaWallet } from 'react-icons/fa';

const MonthlyReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', { month: 'short' })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // past 10 years

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    generateMonthlyData();
  }, [transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getAll(selectedMonth, selectedYear);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = () => {
    const data = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString();

      const monthTransactions = transactions.filter(
        (t) => t.month === month && t.year === year
      );

      const deposits = monthTransactions
        .filter((t) => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({ month: `${month} '${year.slice(2)}`, deposits, expenses });
    }

    setMonthlyData(data);
  };

  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const maxValue = Math.max(...monthlyData.map((d) => Math.max(d.deposits, d.expenses)), 1);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-purple-900 text-white p-4 md:p-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard"
            className="bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <FaArrowLeft /> Back
          </Link>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-purple-700/40 hover:bg-purple-700/60 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <FaHome /> Dashboard
            </button>

            <button
              onClick={() => navigate('/expenses')}
              className="bg-purple-700/40 hover:bg-purple-700/60 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <FaWallet /> Expenses
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 flex items-center gap-2 transition-all"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl animate-slideUp">
          <div className="flex items-center gap-3 mb-8">
            <FaChartBar className="text-cyan-400 text-2xl" />
            <h2 className="text-3xl font-bold">Monthly Report</h2>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-purple-800 text-white px-4 py-3 rounded-xl border border-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {months.map((month) => (
                <option
                  key={month}
                  value={month}
                  className="bg-purple-900 text-white"
                >
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-purple-800 text-white px-4 py-3 rounded-xl border border-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-purple-900 text-white"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6">
              <div className="text-green-400 text-sm mb-1">Total Deposits</div>
              <div className="text-2xl font-bold">Rs {totalDeposits.toFixed(2)}</div>
            </div>

            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
              <div className="text-red-400 text-sm mb-1">Total Expenses</div>
              <div className="text-2xl font-bold">Rs {totalExpenses.toFixed(2)}</div>
            </div>

            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-2xl p-6">
              <div className="text-cyan-400 text-sm mb-1">Net Savings</div>
              <div className="text-2xl font-bold">Rs {(totalDeposits - totalExpenses).toFixed(2)}</div>
            </div>
          </div>

          {/* Visualization Chart */}
          <div className="bg-cyan-500/10 rounded-2xl p-6 mb-8 overflow-hidden">
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Expenses</span>
              </div>
            </div>

            <div className="relative h-80">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-white/70 text-sm pr-2">
                <span>Rs {maxValue.toFixed(0)}</span>
                <span>Rs {(maxValue * 0.8).toFixed(0)}</span>
                <span>Rs {(maxValue * 0.6).toFixed(0)}</span>
                <span>Rs {(maxValue * 0.4).toFixed(0)}</span>
                <span>Rs {(maxValue * 0.2).toFixed(0)}</span>
                <span>Rs 0</span>
              </div>

              <div className="ml-12 flex items-end justify-around gap-6 h-full">
                {monthlyData.map((data, idx) => {
                  const depositHeight = (data.deposits / maxValue) * 100;
                  const expenseHeight = (data.expenses / maxValue) * 100;

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end flex-1">
                      <div className="flex w-full gap-1 items-end h-full">
                        <div
                          className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 ease-out"
                          style={{ height: `${depositHeight}%` }}
                        ></div>
                        <div
                          className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-700 ease-out"
                          style={{ height: `${expenseHeight}%` }}
                        ></div>
                      </div>
                      <span className="text-white/80 text-sm mt-2">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4">
              Transactions ({selectedMonth} {selectedYear})
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/50">No transactions found</p>
                <p className="text-white/30 text-sm mt-2">
                  Try selecting a different month or year
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div>
                      <div className="text-white font-medium">{transaction.cause}</div>
                      <div className="text-white/50 text-sm">
                        {transaction.month} {transaction.year}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.type === 'deposit'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}Rs{' '}
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
