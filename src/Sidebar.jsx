import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, FolderTree, X, MessageCircleQuestion } from "lucide-react";

const menuItems = [
  {
    label: "Categories",
    path: "/categories",
    icon: FolderTree,
    match: ["/categories", "/category"],
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
    match: ["/products", "/product"],
  },
  {
    label: "Blogs",
    path: "/blogs",
    icon: Package,
    match: ["/blogs", "/blog"],
  },
  {
  label: "FAQs",
  path: "/faqs",
  icon: MessageCircleQuestion,
  match: ["/faqs"],
},
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-gray-200 bg-white transition-transform duration-200 lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-5rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col gap-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between px-4 pb-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Menu
            </p>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {menuItems.map(({ label, path, icon: Icon, match }) => {
            const isActive = match.includes(location.pathname);

            return (
              <button
                key={path}
                type="button"
                onClick={() => handleNavigate(path)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
