import { useState } from "react";
import Product from "./Product";
import ProductTable from "./ProductTable";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./Register";
import Login from "./Login";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Category from "./Category";
import CategoryTable from "./CategoryTable";
function RequireAuth() {
  return localStorage.getItem("token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
      />

      <div className="flex">
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/register" />} />

        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/products" element={<ProductTable />} />
            <Route path="/product" element={<Product />} />
            <Route path="/categories" element={<CategoryTable />} />
            <Route path="/category" element={<Category />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
