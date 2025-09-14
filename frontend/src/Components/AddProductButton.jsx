import React from "react";
import { PlusCircle } from "lucide-react"; // Add icon
import { useNavigate } from "react-router-dom";

const AddProductButton = () => {

    const navigate = useNavigate()

  return (
    <button
      onClick={() =>  navigate('/marketplace/addproduct')}
      className="flex items-center gap-2 px-5 py-3 mt-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      <PlusCircle size={22} />
      <span>Add Product</span>
    </button>
  );
};

export default AddProductButton;
