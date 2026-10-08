import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  SearchX,
  Plus,
  SquarePen,
  Trash,
  X,
  ChevronDown,
  Package,
  PackageCheck,
  PackageX,
  Layers,
  SlidersHorizontal,
  RotateCcw,
  TriangleAlert,
  ImageOff,
  Boxes,
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

const TYPE_TONES = {
  New: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Used: "bg-teal-50 text-teal-700 ring-teal-600/20",
};

const getCategoryTone = (category) =>
  CATEGORY_TONES[category] ?? "bg-slate-100 text-slate-600 ring-slate-500/20";

const getTypeTone = (type) =>
  TYPE_TONES[type] ?? "bg-slate-100 text-slate-600 ring-slate-500/20";

const formatPrice = (value) => {
  const amount = Number(value);

  return Number.isNaN(amount)
    ? "—"
    : amount.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition cursor-pointer hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const StatCard = ({ icon: Icon, label, value, hint, tone }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div
      className={`absolute -right-8 -top-10 h-24 w-24 rounded-full ${tone.glow} opacity-0 blur-2xl transition group-hover:opacity-100`}
    />

    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
      </div>

      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconText}`}
      >
        <Icon size={20} strokeWidth={2} />
      </span>
    </div>

    <p className="mt-3 text-xs text-slate-500">{hint}</p>
  </div>
);

const ProductTable = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [datafilter, setDataFilter] = useState({
    category: "All Categories",
    type: "All Types",
    available: "All Availability",
  });
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/products`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setProducts(response.data);
      });
  }, []);
  const filteredProducts = products.filter((item) => {
    return (
      (datafilter.category === "All Categories" ||
        item.category === datafilter.category) &&
      (datafilter.type === "All Types" || item.type === datafilter.type) &&
      (datafilter.available === "All Availability" ||
        (datafilter.available === "Available" && item.available === true) ||
        (datafilter.available === "Not Available" &&
          item.available === false)) &&
      (search === "" ||
        item.product.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const deletingProduct = products.find((item) => item.id === deleteId);

  const stats = {
    total: products.length,
    inStock: products.filter((item) => item.available === true).length,
    outOfStock: products.filter((item) => item.available === false).length,
    categories: new Set(products.map((item) => item.category)).size,
  };

  const hasFilters =
    search !== "" ||
    datafilter.category !== "All Categories" ||
    datafilter.type !== "All Types" ||
    datafilter.available !== "All Availability";

  const resetFilters = () => {
    setSearch("");
    setDataFilter({
      category: "All Categories",
      type: "All Types",
      available: "All Availability",
    });
  };

  const selectField = (label, value, onChange, options, width) => (
    <div className={width}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={selectClass}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Catalog</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">Products</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, filter and manage every item in your catalogue.
            </p>
          </div>

          <button
            onClick={() => navigate("/product")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.98] sm:w-auto"
          >
            <Plus size={18} />
            Add product
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Boxes}
            label="Total products"
            value={stats.total}
            hint="All items in catalogue"
            tone={{
              iconBg: "bg-blue-50",
              iconText: "text-blue-600",
              glow: "bg-blue-400",
            }}
          />

          <StatCard
            icon={PackageCheck}
            label="In stock"
            value={stats.inStock}
            hint="Available for sale"
            tone={{
              iconBg: "bg-emerald-50",
              iconText: "text-emerald-600",
              glow: "bg-emerald-400",
            }}
          />

          <StatCard
            icon={PackageX}
            label="Out of stock"
            value={stats.outOfStock}
            hint="Currently unavailable"
            tone={{
              iconBg: "bg-rose-50",
              iconText: "text-rose-600",
              glow: "bg-rose-400",
            }}
          />

          <StatCard
            icon={Layers}
            label="Categories"
            value={stats.categories}
            hint="Distinct categories used"
            tone={{
              iconBg: "bg-violet-50",
              iconText: "text-violet-600",
              glow: "bg-violet-400",
            }}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="xl:max-w-md xl:flex-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Search
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search product by name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                {search !== "" && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:flex xl:items-end">
              {selectField(
                "Category",
                datafilter.category,
                (e) =>
                  setDataFilter({ ...datafilter, category: e.target.value }),
                [
                  "All Categories",
                  "Electronics",
                  "Clothing",
                  "Food",
                  "Furniture",
                  "Books",
                  "Beauty",
                  "Sports",
                  "Other",
                ],
                "xl:w-48",
              )}

              {selectField(
                "Type",
                datafilter.type,
                (e) => setDataFilter({ ...datafilter, type: e.target.value }),
                ["All Types", "New", "Used"],
                "xl:w-36",
              )}

              {selectField(
                "Availability",
                datafilter.available,
                (e) =>
                  setDataFilter({ ...datafilter, available: e.target.value }),
                ["All Availability", "Available", "Not Available"],
                "xl:w-48",
              )}
            </div>

            <div className="xl:pb-0 xl:ml-auto">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white xl:mt-[26px] xl:w-auto"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <SlidersHorizontal size={16} />
              </span>

              <h2 className="text-sm font-semibold text-slate-800">
                Product list
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                {filteredProducts.length}
              </span>
            </div>

            {hasFilters && (
              <p className="text-xs text-slate-500">
                Filtered view
                <span className="mx-2 h-3 w-px bg-slate-200 align-middle" />
                <span className="font-medium text-slate-700">
                  {filteredProducts.length}
                </span>{" "}
                of {products.length} products
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Availability
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Image
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200">
                          <SearchX size={30} className="text-slate-400" />
                        </div>

                        <h3 className="mt-5 text-base font-semibold text-slate-800">
                          No records found
                        </h3>

                        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                          We couldn't find any data matching your current filters
                          or search query.
                        </p>

                        {hasFilters && (
                          <button
                            onClick={resetFilters}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                          >
                            <RotateCcw size={16} />
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200 transition group-hover:bg-white">
                            <Package size={16} />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.product}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              SKU&nbsp;#{String(item.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900 tabular-nums">
                          ₹{formatPrice(item.price)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryTone(item.category)}`}
                        >
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getTypeTone(item.type)}`}
                        >
                          {item.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                            item.available
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              : "bg-rose-50 text-rose-700 ring-rose-600/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.available ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {item.available ? "Available" : "Not Available"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {item.image ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={item.image}
                              alt={item.product}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-300">
                            <ImageOff size={18} />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate("/product", { state: item })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                          >
                            <SquarePen size={14} />
                            Edit
                          </button>

                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3.5">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{products.length}</span>{" "}
              products
            </p>

            <p className="text-xs text-slate-400">
              Last synced just now
            </p>
          </div>
        </div>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
                <TriangleAlert size={22} />
              </span>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900">
                  Delete product
                </h2>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {deletingProduct?.product}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  axios
                    .delete(`${API_URL}/products/${deleteId}`, {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    })
                    .then(() => {
                      setProducts((oldData) =>
                        oldData.filter((item) => item.id !== deleteId),
                      );

                      setDeleteId(null);

                      toast.success("Product deleted successfully!");
                    });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
              >
                <Trash size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default ProductTable;
