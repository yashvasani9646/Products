import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  SquarePen,
  Tags,
  ImageUp,
  ArrowLeft,
  CircleAlert,
  Check,
  Layers,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import CustomSelect from "./components/CustomSelect";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const Subcategory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [parentId, setParentId] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [originalParentId, setOriginalParentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = editId !== null;

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        toast.error("Failed to load categories");
      });
  }, []);

  useEffect(() => {
    if (location.state) {
      setEditId(location.state.id);
      setSubcategory(location.state.subcategory || "");
      setParentId(
        location.state.parentId !== undefined
          ? String(location.state.parentId)
          : "",
      );
      setOriginalParentId(
        location.state.parentId !== undefined
          ? String(location.state.parentId)
          : null,
      );
      setAvailable(location.state.available !== false);
      setImagePreview(location.state.image ? location.state.image : null);
    }
  }, [location.state]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        image: "Only image files are allowed",
      }));

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        image: "Image must be 5MB or less",
      }));

      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((oldErrors) => ({ ...oldErrors, image: "" }));
  };

  const buildPayload = () => {
    const formData = new FormData();

    formData.append("subcategory", subcategory.trim());
    formData.append("available", available);

    if (image) {
      formData.append("image", image);
    }

    return formData;
  };

  const createSubcategory = (parent) => {
    return axios.post(
      `${API_URL}/categories/${parent}/subcategories`,
      buildPayload(),
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );
  };

  const updateSubcategory = (parent) => {
    return axios.put(
      `${API_URL}/categories/${parent}/subcategories/${editId}`,
      buildPayload(),
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );
  };

  const removeSubcategory = (parent) => {
    return axios.delete(
      `${API_URL}/categories/${parent}/subcategories/${editId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!subcategory.trim()) {
      newErrors.subcategory = "Subcategory name is required";
    }

    if (!parentId) {
      newErrors.parentId = "Parent category is required";
    }

    if (errors.image) {
      newErrors.image = errors.image;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    // Moving a subcategory to another parent category is done by creating
    // it under the new parent first and removing it from the old one after,
    // so a failure never removes the subcategory.
    const isMoved =
      isEditing && originalParentId !== null && originalParentId !== parentId;

    const request = isEditing
      ? isMoved
        ? createSubcategory(parentId).then(() =>
            removeSubcategory(originalParentId),
          )
        : updateSubcategory(parentId)
      : createSubcategory(parentId);

    request
      .then(() => {
        toast.success(
          isEditing
            ? "Subcategory updated successfully!"
            : "Subcategory added successfully!",
        );

        navigate("/subcategories");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Something went wrong");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setSubcategory("");
    setParentId("");
    setOriginalParentId(null);
    setAvailable(true);
    setImage(null);
    setImagePreview(null);
    setErrors({});
    navigate("/subcategory");
  };

  return (
    <div className="admin-canvas min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Catalog</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">
            {isEditing ? "Update subcategory" : "Add subcategory"}
          </span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {isEditing ? "Update Subcategory" : "Add New Subcategory"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update the details of this subcategory and save your changes."
                : "Fill in the details below to create a new subcategory."}
            </p>
          </div>

          <button
            onClick={() => navigate("/subcategories")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {isEditing ? <SquarePen size={18} /> : <Plus size={18} />}
              </span>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {isEditing
                    ? "Update subcategory details"
                    : "Subcategory details"}
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
              {isEditing ? "Editing" : "New subcategory"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Subcategory name</label>

                <div className="relative">
                  <Tags
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Enter subcategory name"
                    value={subcategory}
                    onChange={(e) => {
                      setSubcategory(e.target.value);

                      if (e.target.value.trim()) {
                        setErrors((oldErrors) => ({
                          ...oldErrors,
                          subcategory: "",
                        }));
                      }
                    }}
                    className={fieldClass(errors.subcategory)}
                  />
                </div>

                {errors.subcategory && <ErrorText>{errors.subcategory}</ErrorText>}
              </div>

              <div>
                <label className={labelClass}>Parent category</label>

                <CustomSelect
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);

                    if (e.target.value) {
                      setErrors((oldErrors) => ({
                        ...oldErrors,
                        parentId: "",
                      }));
                    }
                  }}
                  disabled={isEditing}
                  options={[
                    { value: "", label: "Select Category" },
                    ...Array.from(
                      new Map(
                        (categories || []).map((category) => [
                          String(category.id),
                          category,
                        ]),
                      ).values(),
                    ).map((category) => ({
                      value: String(category.id),
                      label: category.category,
                      image: category.image || "",
                    })),
                  ]}
                  placeholder="Select Category"
                  hasError={!!errors.parentId}
                  icon={Layers}
                  showImage
                />

                {errors.parentId && <ErrorText>{errors.parentId}</ErrorText>}
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
                <label className={labelClass}>Subcategory image</label>

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
                    onChange={handleImage}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />

                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Subcategory Preview"
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
                        PNG, JPG, GIF up to 5MB
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
                disabled={submitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEditing ? <SquarePen size={18} /> : <Check size={18} />}
                {isEditing ? "Update Subcategory" : "Add Subcategory"}
              </button>

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

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Subcategory;
