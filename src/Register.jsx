import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  UserRound,
  ArrowRight,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  PackageCheck,
  Users,
} from "lucide-react";
import axios from "axios";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:ring-4 ${
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(phoneNumber);
    const errors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    } else if (phoneNumber.length !== 10) {
      errors.phoneNumber = "Phone Number must be 10 digits";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    const userDate = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    };
    console.log(userDate);

    axios
      .post(
        `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/register`,
        userDate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        if (data.message) {
          setErrors({});
          toast.success("Registration Successful 🎉");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      })
      .catch((error) => {
        const backendErrors = error.response?.data?.errors;
        if (backendErrors) {
          setErrors(backendErrors);
          if (backendErrors.email) {
            toast.error(backendErrors.email);
          }
        } else {
          toast.error("Registration failed");
        }
      });
  };

  return (
    <div className="admin-canvas min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* BRAND PANEL */}

      <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%)]" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-black shadow-lg shadow-blue-900/40">
            U
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-200/70">
              Upleex
            </p>

            <p className="text-sm font-semibold text-white">Admin suite</p>
          </div>
        </div>

        <div className="relative my-auto max-w-lg py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
            <Sparkles size={14} className="text-blue-300" />
            Get started with your workspace
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
            Build a storefront
            <span className="block bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent">
              you are proud of.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
            Create your admin account to manage products, categories and
            customer content from a single premium workspace.
          </p>

          <div className="mt-10 grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <PackageCheck size={17} />
              </span>

              <div>
                <p className="text-sm font-semibold text-white">
                  Everything in one place
                </p>

                <p className="text-xs text-slate-400">
                  Catalogue, content and storefront users.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <Users size={17} />
              </span>

              <div>
                <p className="text-sm font-semibold text-white">
                  Customer focused
                </p>

                <p className="text-xs text-slate-400">
                  Keep your storefront experience consistent.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck size={17} />
              </span>

              <div>
                <p className="text-sm font-semibold text-white">
                  Secure by default
                </p>

                <p className="text-xs text-slate-400">
                  Your workspace is protected with secure sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>Upleex Commerce</span>
          <span>Admin workspace v1.0</span>
        </div>
      </aside>

      {/* FORM PANEL */}

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/25">
              U
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Upleex
              </p>

              <p className="text-sm font-semibold text-slate-900">
                Admin suite
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <div className="mb-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-600/20">
                <Sparkles size={12} />
                New workspace
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Create account
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Please fill in your details to create an account
              </p>
            </div>

            <form onSubmit={handelSubmit}>
              <div className="mb-4">
                <label className={labelClass}>Full name</label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    className={inputClass(errors.name)}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }}
                  />
                </div>

                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </div>

              <div className="mb-4">
                <label className={labelClass}>Email address</label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    className={inputClass(errors.email)}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }}
                  />
                </div>

                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </div>

              <div className="mb-4">
                <label className={labelClass}>Password</label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${inputClass(errors.password)} pr-12`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </div>

              <div className="mb-6">
                <label className={labelClass}>Phone number</label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    className={inputClass(errors.phoneNumber)}
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setPhoneNumber(value);
                      }
                      setErrors((prev) => ({
                        ...prev,
                        phoneNumber: "",
                      }));
                    }}
                  />
                </div>

                {errors.phoneNumber && (
                  <ErrorText>{errors.phoneNumber}</ErrorText>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
              >
                Create account
                <ArrowRight size={17} />
              </button>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
