import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Package,
  FolderTree,
  Layers,
  X,
  MessageCircleQuestion,
  Users as UsersIcon,
  Newspaper,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const menuGroups = [
  {
    label: "Catalog",
    items: [
      {
        label: "Categories",
        path: "/categories",
        icon: FolderTree,
        match: ["/categories", "/category"],
      },
      {
        label: "Subcategories",
        path: "/subcategories",
        icon: Layers,
        match: ["/subcategories", "/subcategory"],
      },
      {
        label: "Products",
        path: "/products",
        icon: Package,
        match: ["/products", "/product"],
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Blogs",
        path: "/blogs",
        icon: Newspaper,
        match: ["/blogs", "/blog"],
      },
      {
        label: "FAQs",
        path: "/faqs",
        icon: MessageCircleQuestion,
        match: ["/faqs"],
      },
    ],
  },
  {
    label: "Management",
    items: [
      // Registered users page
      {
        label: "Users",
        path: "/users",
        icon: UsersIcon,
        match: ["/users"],
      },
    ],
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
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl shadow-slate-900/20" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 lg:hidden">
          <div className="flex items-center gap-2.5">
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

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5">
          <div className="mb-6 hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 lg:block">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              <ShieldCheck size={13} className="text-blue-500" />
              Admin workspace
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              Upleex Commerce
            </p>

            <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
              All systems operational
            </div>
          </div>

          <div className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {group.label}
                </p>

                <div className="space-y-1">
                  {group.items.map(({ label, path, icon: Icon, match }) => {
                    const isActive = match.includes(location.pathname);

                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() => handleNavigate(path)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm"
                          }`}
                        >
                          <Icon size={17} />
                        </span>

                        <span className="flex-1">{label}</span>

                        <ChevronRight
                          size={15}
                          className={`shrink-0 transition ${
                            isActive
                              ? "text-white/80"
                              : "text-slate-300 opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 px-3 text-[11px] font-medium text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
              <span className="ml-auto font-semibold text-slate-300">
                v1.0
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
