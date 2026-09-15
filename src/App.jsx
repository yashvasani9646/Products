import Product from "./Product";
import ProductTable from "./ProductTable";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
 return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Product />} />
      <Route path="/products" element={<ProductTable />} />
    </Routes>

    <ToastContainer />
  </BrowserRouter>
  );
}

export default App;
