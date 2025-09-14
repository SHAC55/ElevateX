import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MarketplaceContext } from "../context/MarketContext";
import { toast } from "react-hot-toast";

const ProductDesc = () => {
  const { backendURL } = useContext(MarketplaceContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendURL}/marketplace/product/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduct(res.data.product);
      } catch (error) {
        console.error("❌ Fetch product error:", error.response || error);
        toast.error(error.response?.data?.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [backendURL, id]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ==== Image Section ==== */}
        <div>
          <div className="w-full h-80 rounded-xl overflow-hidden shadow">
            <img
              src={product.productImgs[activeImg]}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.productImgs.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImg(idx)}
                className={`h-20 w-24 object-cover rounded-lg cursor-pointer border-2 ${
                  activeImg === idx
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                alt={`thumb-${idx}`}
              />
            ))}
          </div>
        </div>

        {/* ==== Details Section ==== */}
        <div>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-gray-600 mt-1">{product.category}</p>

          <p className="text-2xl font-semibold mt-4">₹{product.productPrice}</p>
          <p className="text-gray-500 mt-1">{product.location}</p>

          <p
            className={`mt-2 text-lg font-medium ${
              product.selled ? "text-red-600" : "text-green-600"
            }`}
          >
            {product.selled ? "Sold" : "Available"}
          </p>

          <hr className="my-5" />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.productDesc || "No description provided."}
            </p>
          </div>

          {/* Seller Info */}
          {product.userId && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-lg">Seller Information</h3>
              <p className="text-gray-800 mt-1">
                {product.userId.username} ({product.userId.email})
              </p>
            </div>
          )}

          <button className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;
