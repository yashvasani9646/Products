import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, User, ChevronDown, ShieldCheck } from "lucide-react";

const pageMeta = {
  "/products": {
    title: "Products",
    subtitle: "Browse and manage your product catalog",
  },
  "/product": {
    title: "Add Product",
    subtitle: "Create a new product for your catalog",
  },
  "/categories": {
    title: "Categories",
    subtitle: "Organize your products into categories",
  },
  "/category": {
    title: "Add Category",
    subtitle: "Create a new product category",
  },
  "/subcategories": {
    title: "Subcategories",
    subtitle: "Manage the subcategories inside each category",
  },
  "/subcategory": {
    title: "Add Subcategory",
    subtitle: "Create a new subcategory for a category",
  },
  "/blogs": {
    title: "Blogs",
    subtitle: "Create and publish stories for your storefront",
  },
  "/faqs": {
    title: "FAQs",
    subtitle: "Publish answers to common customer questions",
  },
  "/users": {
    title: "Users",
    subtitle: "Everyone registered on your storefront",
  },
};

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const Header = ({ onMenuToggle, menuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(readUser);
  const [menuOpenState, setMenuOpenState] = useState(false);
  const dropdownRef = useRef(null);

  const { title, subtitle } = pageMeta[location.pathname] ?? {
    title: "Product Manager",
    subtitle: "Manage your products",
  };

  useEffect(() => {
    if (!menuOpenState) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpenState(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpenState(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpenState]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpenState(false);
    navigate("/register", { replace: true });
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/25">
              U
            </span>

            <div className="hidden xl:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Upleex
              </p>

              <p className="text-sm font-semibold leading-tight text-slate-900">
                Admin suite
              </p>
            </div>

            <span className="mx-1 hidden h-9 w-px bg-slate-200 xl:block" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-slate-900 md:text-lg">
              {title}
            </h1>

            <p className="hidden truncate text-xs text-slate-500 md:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />

            <span className="text-xs font-semibold text-emerald-700">
              Online
            </span>
          </div>

          <div className="hidden text-right sm:block">
            <p className="max-w-[10rem] truncate text-sm font-semibold text-slate-800">
              {user?.name || "Guest"}
            </p>

            <p className="max-w-[10rem] truncate text-[11px] text-slate-500">
              {user?.email || "Not signed in"}
            </p>
          </div>

          <div className="hidden h-9 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMenuOpenState((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpenState}
              className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/20 ring-2 ring-white">
                {initial}

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-500 transition ${
                  menuOpenState ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpenState && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                    {initial}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.name || "Guest"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "Not signed in"}
                    </p>
                  </div>
                </div>

                <div className="p-1.5">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <User size={15} />
                    </span>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-700">Profile</p>

                      <p className="text-[11px] text-slate-400">
                        Administrator
                      </p>
                    </div>
                  </div>

                  <div className="my-1.5 flex items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <ShieldCheck size={12} />
                    Secure session
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <LogOut size={15} />
                    </span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
