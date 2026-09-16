import Product from "./Product";
import ProductTable from "./ProductTable";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/product" element={<Product />} />
        <Route path="/products" element={<ProductTable />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
