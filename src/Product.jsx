import { useEffect } from "react";
import { useState } from "react";

const Product = () => {
  const [Product, setProduct] = useState("");
  const [Price, setPrice] = useState("");
  const [Datas, setDatas] = useState([]);
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    fetch("https://product-backend-nfij.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        setDatas(data);
      });
  }, []);
  const data = {
    product: Product,
    price: Price,
  };

  const handelChange = (e) => {
    e.preventDefault();

    if (editId !== null) {
      fetch(`https://product-backend-nfij.onrender.com/products/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((updatedProduct) => {
          setDatas((oldData) =>
            oldData.map((item) =>
              item.id === updatedProduct.id ? updatedProduct : item,
            ),
          );

          setEditId(null);
          setProduct("");
          setPrice("");
        });
    } else {
      fetch("https://product-backend-nfij.onrender.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((newProduct) => {
          setDatas((oldData) => [...oldData, newProduct]);
          setProduct("");
          setPrice("");
        });
    }
  };

  const handelDelete = (id) => {
    fetch(`https://product-backend-nfij.onrender.com/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      setDatas((oldData) => oldData.filter((item) => item.id !== id));
    });
  };

  const handelEdit = (item) => {
    setEditId(item.id);
    setProduct(item.product);
    setPrice(item.price);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Manager</h1>
          <p className="text-gray-500 mt-1">Add and manage your products</p>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Add New Product
          </h2>

          <form onSubmit={handelChange} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={Product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <input
                type="text"
                value={Price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Datas.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Product
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      {item.product}
                    </h3>
                  </div>

                  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ID: {item.id}
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-5">
                  ₹{item.price}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handelEdit(item)}
                    className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2.5 rounded-xl transition"
                  >
                    Edit
                  </button>

                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition"
                    onClick={() => handelDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
