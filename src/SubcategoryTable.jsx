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
  Tags,
  Layers,
  PackageCheck,
  PackageX,
  Image as ImageIcon,
  SlidersHorizontal,
  RotateCcw,
  TriangleAlert,
  ImageOff,
  Boxes,
  FolderTree,
} from "lucide-react";
import axios from "axios";
import { filterSelectClass } from "./utils/dropdownStyles";
import CustomSelect from "./components/CustomSelect";

const selectClass = filterSelectClass;

// A subcategory row of the admin table.
const toRow = (item, parentId, parentCategory, fallbackId) => ({
  id: item?.id ?? fallbackId,
  subcategory: item?.subcategory ?? item,
  image: item?.image || "",
  available: item?.available !== false,
  parentId: parentId,
  parentCategory: parentCategory,
});

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

const SubcategoryTable = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [datafilter, setDataFilter] = useState({
    category: "All Categories",
    available: "All Availability",
  });
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = { Authorization: localStorage.getItem("token") };

  // The subcategories are served as a flat list by the backend. When that
  // endpoint is not available the list is built from the categories, so the
  // page keeps working against an older backend as well.
  useEffect(() => {
    axios
      .get(`${API_URL}/subcategories`, { headers: authHeaders })
      .then((response) => {
        setSubcategories(
          (response.data || []).map((item) =>
            toRow(item, item.categoryId, item.category),
          ),
        );
      })
      .catch(() => {
        axios
          .get(`${API_URL}/categories`, { headers: authHeaders })
          .then((response) => {
            const list = response.data || [];

            setCategories(list);

            setSubcategories(
              list.flatMap((category) =>
                (category.subcategories || []).map((item, index) =>
                  toRow(
                    item,
                    category.id,
                    category.category,
                    `legacy-${category.id}-${index}`,
                  ),
                ),
              ),
            );
          })
          .catch(() => {
            toast.error("Failed to load subcategories");
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // The parent categories are used by the filter dropdown.
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`, { headers: authHeaders })
      .then((response) => {
        setCategories(response.data || []);
      })
      .catch(() => {
        toast.error("Failed to load categories");
      });
  }, []);

  const filteredSubcategories = subcategories.filter((item) => {
    return (
      (datafilter.category === "All Categories" ||
        item.parentCategory === datafilter.category) &&
      (datafilter.available === "All Availability" ||
        (datafilter.available === "Available" && item.available === true) ||
        (datafilter.available === "Not Available" && item.available === false)) &&
      (search === "" ||
        item.subcategory.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const stats = {
    total: subcategories.length,
    inStock: subcategories.filter((item) => item.available === true).length,
    outOfStock: subcategories.filter((item) => item.available === false).length,
    withImage: subcategories.filter((item) => item.image).length,
  };

  const hasFilters =
    search !== "" ||
    datafilter.category !== "All Categories" ||
    datafilter.available !== "All Availability";

  const resetFilters = () => {
    setSearch("");
    setDataFilter({
      category: "All Categories",
      available: "All Availability",
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    axios
      .delete(
        `${API_URL}/categories/${deleteTarget.parentId}/subcategories/${deleteTarget.id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        setSubcategories((oldData) =>
          oldData.filter(
            (item) =>
              !(
                item.id === deleteTarget.id &&
                item.parentId === deleteTarget.parentId
              ),
          ),
        );

        setDeleteTarget(null);

        toast.success("Subcategory deleted successfully!");
      })
      .catch((error) => {
        setDeleteTarget(null);

        toast.error(error.response?.data?.error || "Something went wrong");
      });
  };

  const selectField = (label, value, onChange, options, width) => (
    <div className={width}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <CustomSelect
        value={value}
        onChange={onChange}
        options={(options || []).map((option, index) => ({
          value: option,
          label: option,
        }))}
        placeholder={value}
        triggerClassName="py-2.5"
      />
    </div>
  );

  return (
    <div className="admin-canvas min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Catalog</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">Subcategories</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Subcategories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, filter and manage every subcategory in your catalogue.
            </p>
          </div>

          <button
            onClick={() => navigate("/subcategory")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.98] sm:w-auto"
          >
            <Plus size={18} />
            Add subcategory
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Layers}
            label="Total subcategories"
            value={stats.total}
            hint="All subcategories in catalogue"
            tone={{
              iconBg: "bg-blue-50",
              iconText: "text-blue-600",
              glow: "bg-blue-400",
            }}
          />

          <StatCard
            icon={PackageCheck}
            label="Available"
            value={stats.inStock}
            hint="Visible to customers"
            tone={{
              iconBg: "bg-emerald-50",
              iconText: "text-emerald-600",
              glow: "bg-emerald-400",
            }}
          />

          <StatCard
            icon={PackageX}
            label="Not available"
            value={stats.outOfStock}
            hint="Hidden from customers"
            tone={{
              iconBg: "bg-rose-50",
              iconText: "text-rose-600",
              glow: "bg-rose-400",
            }}
          />

          <StatCard
            icon={ImageIcon}
            label="With image"
            value={stats.withImage}
            hint="Subcategories having a cover image"
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
                  placeholder="Search subcategory by name..."
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:flex xl:items-end">
              {selectField(
                "Parent category",
                datafilter.category,
                (e) =>
                  setDataFilter({ ...datafilter, category: e.target.value }),
                [
                  "All Categories",
                  ...categories.map((category) => category.category),
                ],
                "xl:w-48",
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
                Subcategory list
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                {filteredSubcategories.length}
              </span>
            </div>

            {hasFilters && (
              <p className="text-xs text-slate-500">
                Filtered view
                <span className="mx-2 h-3 w-px bg-slate-200 align-middle" />
                <span className="font-medium text-slate-700">
                  {filteredSubcategories.length}
                </span>{" "}
                of {subcategories.length} subcategories
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Image
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subcategory
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Parent category
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Availability
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200">
                          <SearchX size={30} className="text-slate-400" />
                        </div>

                        <h3 className="mt-5 text-base font-semibold text-slate-800">
                          No records found
                        </h3>

                        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                          {loading
                            ? "Loading your subcategories..."
                            : "We couldn't find any data matching your current filters or search query."}
                        </p>

                        {hasFilters ? (
                          <button
                            onClick={resetFilters}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                          >
                            <RotateCcw size={16} />
                            Clear filters
                          </button>
                        ) : (
                          !loading && (
                            <button
                              onClick={() => navigate("/subcategory")}
                              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                              <Plus size={16} />
                              Add subcategory
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubcategories.map((item) => (
                    <tr
                      key={`${item.parentId}-${item.id}`}
                      className="group transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        {item.image ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={item.image}
                              alt={item.subcategory}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-300">
                            <ImageOff size={18} />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200 transition group-hover:bg-white">
                            <Tags size={16} />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.subcategory}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              SUB&nbsp;#{String(item.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
                          <FolderTree size={12} />
                          {item.parentCategory}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate("/subcategory", { state: item })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                          >
                            <SquarePen size={14} />
                            Edit
                          </button>

                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                            onClick={() => setDeleteTarget(item)}
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
                {filteredSubcategories.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {subcategories.length}
              </span>{" "}
              subcategories
            </p>

            <p className="text-xs text-slate-400">Last synced just now</p>
          </div>
        </div>
      </div>

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
                <TriangleAlert size={22} />
              </span>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900">
                  Delete subcategory
                </h2>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {deleteTarget.subcategory}
                  </span>{" "}
                  from{" "}
                  <span className="font-semibold text-slate-700">
                    {deleteTarget.parentCategory}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
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

export default SubcategoryTable;
