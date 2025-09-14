import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { MarketplaceContext } from "../context/MarketContext";
import { toast } from "react-hot-toast";

const AddProductForm = () => {
  const { backendURL } = useContext(MarketplaceContext);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]); // For image previews

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("token");

  // --- handle image previews & limit ---
 const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  // combine old + new
  const combined = [...previews, ...files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }))];

  if (combined.length > 4) {
    toast.error("You can upload up to 4 images only");
  }

  setPreviews(combined.slice(0, 4)); // keep max 4
};


  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- submit form ---
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // append form fields
      Object.keys(data).forEach((key) => {
        if (key === "productImgs") {
          previews.forEach((img) => formData.append("productImgs", img.file));
        } else {
          formData.append(key, data[key]);
        }
      });

      await axios.post(`${backendURL}/marketplace/addproduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully!");
      reset();
      setPreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            {...register("productName", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter product name"
          />
          {errors.productName && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            {...register("productPrice", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter price"
          />
          {errors.productPrice && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("productDesc", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter product description"
            rows={3}
          />
          {errors.productDesc && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            {...register("category", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter category"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block font-medium mb-1">Condition</label>
          <select
            {...register("condition", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          {errors.condition && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            {...register("quantity", { required: true })}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter quantity"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block font-medium mb-1">Product Images</label>
          <input
            type="file"
            {...register("productImgs", {
              required: "Upload at least one image",
            })}
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          <p className="text-gray-500 text-xs mt-1">
            You can upload up to 4 images
          </p>

          {errors.productImgs && (
            <p className="text-red-500 text-sm">{errors.productImgs.message}</p>
          )}

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.preview}
                    alt={`preview-${idx}`}
                    className="h-32 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
