import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Plus,
  ArrowLeft,
  CircleAlert,
  MessageCircleQuestion,
  Sparkles,
  ShieldCheck,
  Eye,
  ChevronDown,
  Send,
  Eraser,
  LoaderCircle,
} from "lucide-react";

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

const Faq2 = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/faqs`,
        {
          question: question.trim(),
          answer: answer.trim(),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("FAQ added successfully!");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Support</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">Add FAQ</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Add New FAQ
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below to publish a new frequently asked
              question.
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
              onClick={() => navigate(-1)}
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
                    <Plus size={18} />
                  </span>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      FAQ details
                    </h2>

                    <p className="text-xs text-slate-500">
                      All fields marked with * are required
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  New FAQ
                </span>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="grid gap-5">
                  <div>
                    <label className={labelClass}>Question *</label>

                    <div className="relative">
                      <MessageCircleQuestion
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);

                          if (e.target.value.trim()) {
                            setErrors((oldErrors) => ({
                              ...oldErrors,
                              question: "",
                            }));
                          }
                        }}
                        placeholder="Enter question"
                        className={fieldClass(errors.question)}
                      />
                    </div>

                    {errors.question && (
                      <ErrorText>{errors.question}</ErrorText>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Answer *</label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400">
                        <MessageCircleQuestion size={18} />
                      </span>

                      <textarea
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);

                          if (e.target.value.trim()) {
                            setErrors((oldErrors) => ({
                              ...oldErrors,
                              answer: "",
                            }));
                          }
                        }}
                        placeholder="Enter answer"
                        rows="7"
                        className={`${fieldClass(
                          errors.answer
                        )} resize-none pl-10 leading-relaxed`}
                      />
                    </div>

                    {errors.answer && <ErrorText>{errors.answer}</ErrorText>}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}

                    {submitting ? "Adding..." : "Add FAQ"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Eraser size={16} />
                    Clear
                  </button>
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
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {question || "Your question will appear here"}
                    </p>

                    <ChevronDown
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                  </div>

                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-500">
                    {answer || "Your answer will appear here."}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    {question.trim().length || 0} characters in question
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                    {answer.trim().length || 0} characters in answer
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
                  Keep questions short and easy to scan for customers.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  Write answers in plain language and keep them concise.
                </li>

                <li className="flex gap-2">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  Both question and answer are required before publishing.
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

export default Faq2;
