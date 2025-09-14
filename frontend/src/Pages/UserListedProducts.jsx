// UserListedProducts.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MarketplaceContext } from "../context/MarketContext";
import { toast } from "react-hot-toast";
import { Loader2, PackageX } from "lucide-react";

const UserListedProducts = () => {
  const { backendURL } = useContext(MarketplaceContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch user's products
  const fetchUserProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/marketplace/alluserproduct`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("❌ Fetch error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${backendURL}/marketplace/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted successfully!");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product!");
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800">My Listed Products</h1>
        <p className="text-gray-500 mt-2">
          Manage, update, or delete the products you’ve listed in the marketplace.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading your products...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center mt-20 text-gray-500">
          <PackageX className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No products listed yet</p>
          <p className="text-sm">Start by adding a new product to the marketplace.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
  src={product.productImgs[0]}
  alt={product.productName}
  style={{ width: "100%", height: "200px", objectFit: "cover" }}
/>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.productName}
                </h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <p className="text-gray-900 font-bold mt-2 text-lg">
                  ₹{product.productPrice}
                </p>
                <p className="text-gray-500 text-sm mt-1">{product.location}</p>

                {/* Status */}
                <p
                  className={`mt-3 text-sm font-semibold ${
                    product.selled ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {product.selled ? "Sold" : "Available"}
                </p>

                {/* Actions */}
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListedProducts;
