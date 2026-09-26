import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, User, ChevronDown } from "lucide-react";

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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-gray-900 md:text-2xl">
            {title}
          </h1>

          <p className="hidden truncate text-xs text-gray-400 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[10rem] truncate font-semibold text-gray-800">
            {user?.name || "Guest"}
          </p>

          <p className="max-w-[10rem] truncate text-xs text-gray-500">
            {user?.email || "Not signed in"}
          </p>
        </div>

        <div className="h-9 border-l border-gray-200 max-sm:hidden" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMenuOpenState((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpenState}
            className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-gray-100"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-sm">
              {initial}
            </span>

            <ChevronDown
              size={16}
              className={`text-gray-500 transition ${
                menuOpenState ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpenState && (
            <div
              role="menu"
              className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate font-semibold text-gray-800">
                  {user?.name || "Guest"}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {user?.email || "Not signed in"}
                </p>
              </div>

              <div className="p-1.5">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600">
                  <User size={16} className="shrink-0" />
                  Profile
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} className="shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
