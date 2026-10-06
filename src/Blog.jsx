import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Blog = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const [content, setContent] = useState([
    {
      type: "heading",
      value: "",
    },
    {
      type: "paragraph",
      value: "",
    },
  ]);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ==================== GET BLOGS ====================

  const fetchBlogs = async () => {
    try {
      setFetchLoading(true);

      const res = await axios.get(`${API_URL}/public/blogs`);

      setBlogs(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Blogs load nahi ho rahe");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ==================== IMAGE CHANGE ====================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);
  };

  // ==================== CONTENT CHANGE ====================

  const handleContentChange = (index, value) => {
    setContent((oldContent) =>
      oldContent.map((item, i) =>
        i === index ? { ...item, value } : item
      )
    );
  };

  // ==================== ADD HEADING ====================

  const addHeading = () => {
    setContent((oldContent) => [
      ...oldContent,
      {
        type: "heading",
        value: "",
      },
    ]);
  };

  // ==================== ADD PARAGRAPH ====================

  const addParagraph = () => {
    setContent((oldContent) => [
      ...oldContent,
      {
        type: "paragraph",
        value: "",
      },
    ]);
  };

  // ==================== DELETE CONTENT ====================

  const deleteContent = (index) => {
    setContent((oldContent) =>
      oldContent.filter((_, i) => i !== index)
    );
  };

  // ==================== CREATE BLOG ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    if (!image) {
      toast.error("Blog image is required");
      return;
    }

    const validContent = content.filter(
      (item) => item.value.trim() !== ""
    );

    if (validContent.length === 0) {
      toast.error("Blog content is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      // Content ko JSON string ke form me save karenge
      formData.append("description", JSON.stringify(validContent));

      formData.append("image", image);

      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_URL}/blogs`, formData, {
        headers: {
          Authorization: token,
        },
      });

      toast.success("Blog added successfully");

      setBlogs((oldBlogs) => [res.data, ...oldBlogs]);

      // Reset
      setTitle("");

      setContent([
        {
          type: "heading",
          value: "",
        },
        {
          type: "paragraph",
          value: "",
        },
      ]);

      setImage(null);

      document.getElementById("blogImage").value = "";
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.error || "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================== PAGE TITLE ==================== */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Blog Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage your blogs
          </p>
        </div>

        {/* ==================== ADD BLOG FORM ==================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Add Blog
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Blog Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* BLOG CONTENT */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Blog Content
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addHeading}
                    className="rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-100"
                  >
                    + Heading
                  </button>

                  <button
                    type="button"
                    onClick={addParagraph}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    + Paragraph
                  </button>
                </div>
              </div>

              <div className="space-y-4">

                {content.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >

                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          item.type === "heading"
                            ? "text-purple-600"
                            : "text-blue-600"
                        }`}
                      >
                        {item.type === "heading"
                          ? "HEADING"
                          : "PARAGRAPH"}
                      </span>

                      {content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteContent(index)}
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {item.type === "heading" ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          handleContentChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter heading"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    ) : (
                      <textarea
                        value={item.value}
                        onChange={(e) =>
                          handleContentChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter paragraph"
                        rows={5}
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    )}
                  </div>
                ))}

              </div>
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Blog Image
              </label>

              <input
                id="blogImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-xl border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              />

              {image && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding Blog..." : "Add Blog"}
            </button>
          </form>
        </div>

        {/* ==================== BLOG LIST ==================== */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Blogs
            </h2>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              {blogs.length} Blogs
            </span>
          </div>

          {fetchLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-sm text-gray-500">
                No blogs available
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* IMAGE */}

                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={`${API_URL}/uploads/${blog.image}`}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                      {blog.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                      {(() => {
                        try {
                          const parsed = JSON.parse(
                            blog.description
                          );

                          return parsed
                            .map((item) => item.value)
                            .join(" ");
                        } catch {
                          return blog.description;
                        }
                      })()}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;