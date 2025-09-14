import React, { useContext, useState } from "react";
import { Search } from "lucide-react";
import { MarketplaceContext } from "../context/MarketContext";

const MarketPlaceHeader = ({ onSearch }) => {
  const { products } = useContext(MarketplaceContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white mt-4 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        {/* Title + Count */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            All Products
          </h1>
          <p className="text-sm text-gray-500">
            {products?.length || 0} items available
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceHeader;
