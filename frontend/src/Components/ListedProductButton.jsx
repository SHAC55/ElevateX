import React from "react";
import { ShoppingBag } from "lucide-react"; // modern icon
import { useNavigate } from "react-router-dom";

const ListedProductButton = ({ onClick }) => {

    const navigate= useNavigate()

  return (
    <button
      onClick={() => navigate('/marketplace/mylistedproduct')}
      className="flex items-center gap-2 px-5 py-3 mt-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      <ShoppingBag size={20} />
      <span>Listed Products</span>
    </button>
  );
};

export default ListedProductButton;
