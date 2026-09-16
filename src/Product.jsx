import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Product = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [Product, setProduct] = useState("");
  const [Price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [available, setAvailable] = useState(false);
  const [image, setImage] = useState(null);
  const location = useLocation();

  const handelChange = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!Product) {
      newErrors.Product = "Product name is required";
    }

    if (!Price) {
      newErrors.Price = "Price is required";
    }
    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!type) {
      newErrors.type = "Product type is required";
    }

    if (!image && editId === null) {
      newErrors.image = "Image is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (editId !== null) {
      const formData = new FormData();

      formData.append("product", Product);
      formData.append("price", Price);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("available", available);

      if (image) {
        formData.append("image", image);
      }
      fetch(`${API_URL}/products/${editId}`, {
        method: "PUT",
        body: formData,
      }).then(() => {
        navigate("/products");
        setEditId(null);
        setProduct("");

        setPrice("");
        setCategory("");
        setType("");
        setAvailable(false);
        setImage("");

        toast.success("Product updated successfully!");
      });
    } else {
      const formData = new FormData();
      formData.append("product", Product);

      formData.append("price", Price);
      formData.append("category", category);

      formData.append("type", type);
      formData.append("available", available);

      formData.append("image", image);

      fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((error) => {
              throw new Error(error.error);
            });
          }

          return res.json();
        })
        .then((newProduct) => {
          setProduct("");
          setPrice("");

          toast.success("Product added successfully! 🛒");
          navigate("/products");
        })
        .catch((error) => {
          toast.error(error.message, {
            id: "product-error",
          });
        });
    }
  };

  useEffect(() => {
    if (location.state) {
      setEditId(location.state.id);
      setProduct(location.state.product);
      setPrice(location.state.price);
      setCategory(location.state.category);
      setType(location.state.type);
      setAvailable(location.state.available);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Product Manager
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Add and manage your products with ease
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            Sign Out
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editId !== null ? "Update Product" : "Add New Product"}
            </h2>
          </div>

          <form onSubmit={handelChange} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={Product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  if (e.target.value) {
                    setErrors((oldErrors) => ({
                      ...oldErrors,
                      Product: "",
                    }));
                  }
                }}
                placeholder="Enter product name"
                className={`w-full rounded-2xl border-2 px-5 py-3.5 bg-gray-50/50 outline-none transition-all duration-300 ${
                  errors.Product
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                }`}
              />
              {errors.Product && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.Product}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price
              </label>
              <input
                type="text"
                value={Price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (e.target.value) {
                    setErrors((oldErrors) => ({
                      ...oldErrors,
                      Price: "",
                    }));
                  }
                }}
                placeholder="Enter price"
                className={`w-full rounded-2xl border-2 px-5 py-3.5 bg-gray-50/50 outline-none transition-all duration-300 ${
                  errors.Price
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                }`}
              />
              {errors.Price && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.Price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);

                  if (e.target.value) {
                    setErrors((oldErrors) => ({
                      ...oldErrors,
                      category: "",
                    }));
                  }
                }}
                className={`w-full rounded-2xl border-2 px-5 py-3.5 bg-gray-50/50 outline-none transition-all duration-300 ${
                  errors.category
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="New"
                    checked={type === "New"}
                    onChange={(e) => {
                      setType(e.target.value);
                      setErrors((oldErrors) => ({
                        ...oldErrors,
                        type: "",
                      }));
                    }}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    New
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="Used"
                    checked={type === "Used"}
                    onChange={(e) => {
                      setType(e.target.value);
                      setErrors((oldErrors) => ({
                        ...oldErrors,
                        type: "",
                      }));
                    }}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    Used
                  </span>
                </label>
              </div>
              {errors.type && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.type}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
                </div>
                <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">
                  Available
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                  errors.image
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
              >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    if (e.target.files[0]) {
                      setErrors((oldErrors) => ({
                        ...oldErrors,
                        image: "",
                      }));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg
                  className="w-10 h-10 mx-auto text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.image}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editId !== null ? "Update Product" : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                All Product History
              </button>
            </div>
          </form>
        </div>

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Product;
