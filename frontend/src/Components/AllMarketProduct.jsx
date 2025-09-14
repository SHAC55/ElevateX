import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MarketplaceContext } from "../context/MarketContext";
import { toast } from "react-hot-toast";
import MarketPlaceHeader from "./MarketPlaceHeader";
import { useNavigate } from "react-router-dom";

const AllMarketProduct = () => {
  const { backendURL, products, setProducts } = useContext(MarketplaceContext);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/marketplace/allproduct`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if needed
        },
      });

      setProducts(res.data.products || []);
    } catch (error) {
      console.error("❌ Fetch error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Apply search filter
  const filteredProducts = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with search */}
      <MarketPlaceHeader onSearch={setSearchQuery} />

      {filteredProducts.length === 0 ? (
        <p className="text-center mt-10">No matching products found.</p>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() =>navigate(`/marketplace/product/${product._id}`)}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.productImgs[0]}
                alt={product.productName}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.productName}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-gray-800 font-medium mt-2">
                  ₹{product.productPrice}
                </p>
                <p className="text-gray-500 text-sm mt-1">{product.location}</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    product.selled ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {product.selled ? "Sold" : "Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMarketProduct;
