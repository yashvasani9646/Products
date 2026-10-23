import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  SquarePen,
  ImageUp,
  Eye,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
  Trash,
  Newspaper,
  FileText,
} from "lucide-react";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

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

  const previewHeading =
    content.find((item) => item.type === "heading" && item.value.trim())
      ?.value || "Your blog heading will appear here";

  const previewParagraph =
    content.find((item) => item.type === "paragraph" && item.value.trim())
      ?.value || "Your blog introduction will appear here.";

  return (
    <div className="admin-canvas min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* ==================== PAGE TITLE ==================== */}

        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Content</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">Blog management</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Blog Management
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                <Newspaper size={12} />
                Content studio
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage your blogs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <Newspaper size={14} className="text-blue-500" />
              {fetchLoading ? "Syncing..." : `${blogs.length} published`}
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <FileText size={14} className="text-violet-500" />
              {content.length} content blocks
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ==================== ADD BLOG FORM ==================== */}

          <div className="xl:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Plus size={18} />
                </span>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Add Blog
                  </h2>

                  <p className="text-xs text-slate-500">
                    Compose a story for your storefront audience
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="space-y-5">
                  {/* TITLE */}

                  <div>
                    <label className={labelClass}>Blog title</label>

                    <div className="relative">
                      <SquarePen
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* BLOG CONTENT */}

                  <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Blog content
                        </label>

                        <p className="mt-1 text-xs text-slate-500">
                          Build the article with headings and paragraphs
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addHeading}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                        >
                          <Plus size={14} />
                          Heading
                        </button>

                        <button
                          type="button"
                          onClick={addParagraph}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                        >
                          <Plus size={14} />
                          Paragraph
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {content.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                                item.type === "heading"
                                  ? "bg-violet-50 text-violet-700 ring-violet-600/20"
                                  : "bg-blue-50 text-blue-700 ring-blue-600/20"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.type === "heading"
                                    ? "bg-violet-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              {item.type === "heading"
                                ? "Heading"
                                : "Paragraph"}
                            </span>

                            {content.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteContent(index)}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash size={13} />
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
                              className={`${inputClass} font-semibold focus:border-violet-500 focus:ring-violet-100`}
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
                              className={`${inputClass} resize-none leading-relaxed`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IMAGE */}

                  <div>
                    <label className={labelClass}>Blog image</label>

                    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                      <input
                        id="blogImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />

                      {image ? (
                        <div className="flex flex-col items-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                            <ImageUp size={22} />
                          </span>

                          <p className="mt-3 max-w-full truncate text-sm font-semibold text-slate-700">
                            {image.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Click to choose a different image
                          </p>
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
                            PNG, JPG or GIF for your blog cover
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* BUTTON */}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}

                    {loading ? "Adding Blog..." : "Add Blog"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ==================== PREVIEW & TIPS ==================== */}

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
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-center">
                    <ImageUp size={26} className="mx-auto text-slate-300" />

                    <p className="mt-2 max-w-[12rem] truncate text-xs text-slate-400">
                      {image ? image.name : "Cover image preview"}
                    </p>
                  </div>
                </div>

                <h3 className="mt-4 line-clamp-2 text-base font-semibold text-slate-900">
                  {title || "Your blog title"}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {previewHeading}
                </p>

                <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-slate-500">
                  {previewParagraph}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    {content.length} blocks
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
                    {
                      content.filter(
                        (item) => item.value.trim() !== ""
                      ).length
                    }{" "}
                    filled
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
                  Add headings to break long articles into scannable sections.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  Paragraphs are saved in the same order you arrange them.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  A title, cover image and content are required to publish.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==================== BLOG LIST ==================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Newspaper size={16} />
              </span>

              <h2 className="text-sm font-semibold text-slate-800">
                Published blogs
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                {fetchLoading ? "..." : blogs.length}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Live content from your storefront
            </p>
          </div>

          <div className="p-5">
            {fetchLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="h-44 animate-pulse bg-slate-100" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                  <Newspaper size={24} />
                </span>

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                  No blogs available
                </h3>

                <p className="mt-1.5 text-sm text-slate-500">
                  Add your first blog using the form above.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    {/* IMAGE */}

                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur">
                        <Newspaper size={11} className="text-blue-600" />
                        Article
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">
                      <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                        {blog.title}
                      </h3>

                      <p className="mt-2.5 line-clamp-4 text-sm leading-relaxed text-slate-500">
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

                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <FileText size={12} />
                        </span>
                        Published story
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
