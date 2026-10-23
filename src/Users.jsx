import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Users as UsersIcon,
  UserRound,
  Search,
  SearchX,
  Mail,
  Phone,
  CalendarDays,
  RotateCcw,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";

const Users = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        const message = "Please login to access registered users.";
        setError(message);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: token,
          },
        });

        const payload = response.data;

        if (Array.isArray(payload)) {
          setUsers(payload);
        } else if (payload && Array.isArray(payload.users)) {
          setUsers(payload.users);
        } else {
          throw new Error(
            "Unexpected response from the server while loading users."
          );
        }

        if (silent) {
          toast.success("User list refreshed");
        }
      } catch (err) {
        const status = err.response?.status;
        let message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load registered users.";

        if (status === 401) {
          message = "Your session has expired. Please login again.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else if (status === 403) {
          message = "Only the authorized admin can view registered users.";
        } else if (!err.response) {
          message =
            "Cannot reach the server. Please check your connection and try again.";
        }

        setError(message);
        toast.error(message);

        if (status === 401) {
          setTimeout(() => navigate("/login", { replace: true }), 1500);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_URL, navigate]
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.phoneNumber]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [users, search]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-canvas min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Management</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-600">Users</span>
        </nav>

        {/* Page heading */}
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Registered Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage users registered on your website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadUsers({ silent: true })}
            disabled={loading || refreshing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : undefined}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total registered users
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : users.length}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  All users registered on the website
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UsersIcon size={21} />
              </span>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Search results
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : filteredUsers.length}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Users matching your search
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Search size={21} />
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Search users
          </label>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name, email or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Users table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UsersIcon size={17} />
              </span>

              <h2 className="text-sm font-semibold text-slate-800">
                User list
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {loading ? "..." : filteredUsers.length}
              </span>
            </div>

            {!loading && search && (
              <p className="text-xs text-slate-500">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone number
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Registration date
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                          Loading registered users...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-semibold text-rose-600">
                          Unable to load users
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {error}
                        </p>

                        <button
                          type="button"
                          onClick={() => loadUsers()}
                          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <SearchX size={30} />
                        </div>

                        <h3 className="mt-5 text-base font-semibold text-slate-800">
                          {search ? "No users found" : "No registered users"}
                        </h3>

                        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                          {search
                            ? "Try searching with a different name, email or phone number."
                            : "Registered users will appear here when they sign up on your website."}
                        </p>

                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <RotateCcw size={15} />
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id || user.email}
                      className="group transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                            <UserRound size={18} />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {user.name || "—"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Registered user
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span>{user.email || "—"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span>{user.phoneNumber || "—"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
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
                {loading ? "—" : filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {loading ? "—" : users.length}
              </span>{" "}
              users
            </p>

            <p className="text-xs text-slate-400">
              Registration details from database
            </p>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <UserRound size={20} />
                </span>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-slate-900">
                    {selectedUser.name || "Unnamed user"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Customer details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close details"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="divide-y divide-slate-100 px-6 py-2">
              <div className="flex items-start gap-3 py-4">
                <UserRound
                  size={16}
                  className="mt-0.5 shrink-0 text-slate-400"
                />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">
                    {selectedUser.name || "—"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">
                    {selectedUser.email || "—"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone number
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">
                    {selectedUser.phoneNumber || "—"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <CalendarDays
                  size={16}
                  className="mt-0.5 shrink-0 text-slate-400"
                />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Registration date
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">
                    {formatDate(selectedUser.createdAt)}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Users;