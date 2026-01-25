// SelledProductButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SelledProductButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/marketplace/mysoldproduct')}
      className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-0.5"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon Container */}
      <div className="relative z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <CheckCircleIcon className="w-6 h-6" />
      </div>
      
      {/* Text */}
      <div className="relative z-10 text-left">
        <span className="text-lg font-bold block">Sold Products</span>
        <span className="text-sm font-normal opacity-90">View your sales</span>
      </div>
      
      {/* Counter Badge */}
      <div className="relative z-10 ml-auto">
        <span className="px-3 py-1 bg-white/30 text-xs font-bold rounded-full">
          8
        </span>
      </div>
      
      {/* Arrow Icon */}
      <div className="relative z-10 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default SelledProductButton;