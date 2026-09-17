import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { IoArrowBackSharp } from "react-icons/io5";

const ProductTable = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="bg-white p-5 rounded-xl shadow-xl border">
        <p className="font-semibold mb-4">
          Are you sure you want to delete this product?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              toast.remove(t.id);
              fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }).then(() => {
                setProducts((oldData) =>
                  oldData.filter((item) => item.id !== id),
                );

                toast.success("Product deleted successfully!");
              });
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Yes
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/product")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:bg-gray-100 hover:shadow-md transition"
          >
            <IoArrowBackSharp size={20} />
            Back
          </button>
        </div>
        {/* Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Table</h1>
            <p className="text-gray-500 mt-1">Manage your products</p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Responsive */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* Header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Type
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Available
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Image
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-gray-200">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.product}
                    </td>

                    <td className="px-6 py-4 text-gray-700">₹{item.price}</td>

                    <td className="px-6 py-4 text-gray-700">{item.category}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.available ? "Available" : "Not Available"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.product}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate("/product", { state: item })}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          Edit
                        </button>

                        <button
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default ProductTable;
