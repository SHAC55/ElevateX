import React from "react";
import { CheckCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const SelledProductButton = ({  }) => {

    const  navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/marketplace/mysoldproduct')}
      
      
      className="flex items-center gap-2 px-5 py-3 mt-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      <CheckCircle size={20} />
      <span>Sold Products</span>
    </button>
  );
};

export default SelledProductButton;
