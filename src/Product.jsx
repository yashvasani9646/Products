import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  SquarePen,
  Package,
  Wallet,
  Tags,
  ChevronDown,
  CircleAlert,
  ImageUp,
  ArrowLeft,
  Check,
  Sparkles,
  Eye,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

const CATEGORY_TONES = {
  Electronics: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Clothing: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Food: "bg-orange-50 text-orange-700 ring-orange-600/20",
  Furniture: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Books: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Beauty: "bg-pink-50 text-pink-700 ring-pink-600/20",
  Sports: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  Other: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const getCategoryTone = (category) =>
  CATEGORY_TONES[category] ?? "bg-slate-100 text-slate-600 ring-slate-500/20";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:ring-4 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
  }`;

const ErrorText = ({ children }) => (
  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
    <CircleAlert size={14} className="shrink-0" />
    {children}
  </p>
);

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
  const [imagePreview, setImagePreview] = useState(null);
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
      axios
        .put(`${API_URL}/products/${editId}`, formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(() => {
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

      axios
        .post(`${API_URL}/products`, formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          return response.data;
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

  const handleCancelEdit = () => {
    setEditId(null);
    setProduct("");
    setPrice("");
    setCategory("");
    setType("");
    setAvailable(false);
    setImage(null);
    setImagePreview(null);
    setErrors({});
    navigate("/product");
  };

  const isEditing = editId !== null;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Catalog</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">
            {isEditing ? "Update product" : "Add product"}
          </span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {isEditing ? "Update Product" : "Add New Product"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update the details of this product and save your changes."
                : "Fill in the details below to publish a new product."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>

            <span className="h-9 w-px bg-slate-200" />

            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {isEditing ? <SquarePen size={18} /> : <Plus size={18} />}
                  </span>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {isEditing ? "Update product details" : "Product details"}
                    </h2>

                    <p className="text-xs text-slate-500">
                      All fields marked with * are required
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                    isEditing
                      ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                      : "bg-blue-50 text-blue-700 ring-blue-600/20"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isEditing ? "bg-amber-500" : "bg-blue-500"
                    }`}
                  />
                  {isEditing ? "Editing" : "New product"}
                </span>
              </div>

              <form onSubmit={handelChange} className="p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Product name</label>

                    <div className="relative">
                      <Package
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

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
                        className={fieldClass(errors.Product)}
                      />
                    </div>

                    {errors.Product && <ErrorText>{errors.Product}</ErrorText>}
                  </div>

                  <div>
                    <label className={labelClass}>Price</label>

                    <div className="relative">
                      <Wallet
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="number"
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
                        className={fieldClass(errors.Price)}
                      />
                    </div>

                    {errors.Price && <ErrorText>{errors.Price}</ErrorText>}
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>

                    <div className="relative">
                      <Tags
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

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
                        className={`${fieldClass(errors.category)} cursor-pointer appearance-none pr-10`}
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

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>

                    {errors.category && <ErrorText>{errors.category}</ErrorText>}
                  </div>

                  <div>
                    <label className={labelClass}>Product type</label>

                    <div className="grid grid-cols-2 gap-3">
                      {["New", "Used"].map((option) => (
                        <label
                          key={option}
                          className={`group relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition ${
                            type === option
                              ? "border-blue-500 bg-blue-50/60 ring-4 ring-blue-100"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={option}
                            checked={type === option}
                            onChange={(e) => {
                              setType(e.target.value);
                              setErrors((oldErrors) => ({
                                ...oldErrors,
                                type: "",
                              }));
                            }}
                            className="peer sr-only"
                          />

                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                              type === option
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 bg-white text-transparent"
                            }`}
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>

                          <span
                            className={`text-sm font-semibold transition ${
                              type === option
                                ? "text-blue-700"
                                : "text-slate-600 group-hover:text-slate-900"
                            }`}
                          >
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {errors.type && <ErrorText>{errors.type}</ErrorText>}
                  </div>

                  <div>
                    <label className={labelClass}>Availability</label>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Available
                        </p>

                        <p className="text-xs text-slate-500">
                          {available
                            ? "Visible and purchasable"
                            : "Hidden from customers"}
                        </p>
                      </div>

                      <label className="flex shrink-0 cursor-pointer items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={available}
                            onChange={(e) => setAvailable(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-focus:ring-4 peer-focus:ring-blue-100 peer-checked:bg-blue-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Product image</label>

                    <div
                      className={`relative overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition ${
                        errors.image
                          ? "border-red-300 bg-red-50/60"
                          : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/40"
                      }`}
                    >
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setImage(file);
                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                            setErrors((oldErrors) => ({
                              ...oldErrors,
                              image: "",
                            }));
                          }
                        }}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />

                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-28 w-28 rounded-xl object-cover ring-1 ring-slate-200"
                          />

                          <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-white">
                            <ImageUp size={12} />
                            Click to change
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                            <ImageUp size={20} />
                          </span>

                          <p className="mt-3 text-sm text-slate-600">
                            <span className="font-semibold text-blue-600">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>

                    {errors.image && <ErrorText>{errors.image}</ErrorText>}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
                  >
                    {isEditing ? <SquarePen size={18} /> : <Plus size={18} />}
                    {isEditing ? "Update Product" : "Add Product"}
                  </button>

                  {/* <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    All Product History
                  </button> */}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Eye size={16} />
                </span>

                <h2 className="text-sm font-semibold text-slate-800">
                  Live preview
                </h2>
              </div>

              <div className="p-5">
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Package size={30} className="mx-auto text-slate-300" />

                      <p className="mt-2 text-xs text-slate-400">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 truncate text-base font-semibold text-slate-900">
                  {Product || "Product name"}
                </h3>

                <p className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                  ₹{Price || "0"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {category ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryTone(category)}`}
                    >
                      {category}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
                      No category
                    </span>
                  )}

                  {type && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                      {type}
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      available
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                        : "bg-rose-50 text-rose-700 ring-rose-600/20"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        available ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {available ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />

                <h2 className="text-sm font-semibold text-blue-900">
                  Good to know
                </h2>
              </div>

              <ul className="mt-3 space-y-2.5 text-sm text-blue-900/80">
                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  Price and category are used for filtering in the products
                  table.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  Mark a product as unavailable to keep it saved but hidden.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  In edit mode the image stays unchanged unless you upload a new
                  one.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Product;
