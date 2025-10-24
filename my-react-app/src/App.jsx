import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const App = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-gray-800">

      {/* Left Section - Gradient Background */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden flex items-center justify-center p-4 lg:p-10">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400 rounded-full"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-white text-center">
          <FaLeaf className="text-cyan-400 text-6xl mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">FinanceManager</h1>
          <p className="text-xl text-cyan-200">Smart Finance Management</p>
        </div>
      </div>

      {/* Right Section - Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center p-8 md:p-16 lg:p-20">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Top navigation/logo */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-purple-600 text-2xl" />
              <span className="text-xl font-bold text-purple-700">FinanceManager</span>
            </div>
            <Link 
              to="/signin" 
              className="py-2 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition duration-300 font-semibold"
            >
              Sign In
            </Link>
          </div>

          {/* Main heading and description */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-purple-900 mb-4">
              MANAGE YOUR <span className="text-purple-600">FINANCES</span> WITH EASE!
            </h2>
            <p className="text-lg text-gray-600">
              Take control of your money with our intuitive finance manager. Track expenses, monitor income, and achieve your financial goals effortlessly.
            </p>
          </div>
          
          {/* Features */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave className="text-green-500 text-xl" />
              <span className="text-gray-700">Track Income & Expenses</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaChartLine className="text-blue-500 text-xl" />
              <span className="text-gray-700">Visual Financial Reports</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-purple-500 text-xl" />
              <span className="text-gray-700">Secure & Private</span>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Ready to Take Control?</h3>
            <p className="text-gray-600">
              Join thousands of users who are already managing their finances smarter with <span className="font-semibold text-purple-600">FinanceManager</span>.
            </p>
          </div>

          {/* Call-to-action button */}
          <Link 
            to="/signup" 
            className="inline-block py-3 px-8 bg-purple-600 text-white text-lg rounded-xl hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Get Started Free
          </Link>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-purple-600 hover:text-purple-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
