import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { getProducts, deleteProduct } from "../services/productService";

const MenuList = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  loadProducts();
}, []);

const handleDelete = async (slug) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await deleteProduct(slug);
    alert("Product deleted successfully");
    loadProducts();
  } catch (error) {
    console.error(error);
    alert("Failed to delete product");
  }
};

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>

        <button
  onClick={() => navigate("/admin/menu/add")}
  className="bg-[#C89B3C] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600"
>
  <FaPlus />
  Add Product
</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#2E1B18] text-white">
            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Best Seller</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>

                <td>{product.name}</td>

                <td>{product.category_slug}</td>

                <td>
                  {product.price === null
                    ? "Variable"
                    : `₹${product.price}`}
                </td>

                <td>
                  {product.is_best_seller ? "⭐ Yes" : "No"}
                </td>

                <td>
                  {product.is_available ? "✅" : "❌"}
                </td>

                <td>
                  <div className="flex gap-4 justify-center">
                   <button
  onClick={() => navigate(`/admin/menu/edit/${product.slug}`)}
  className="text-blue-600 hover:text-blue-800"
>
  <FaEdit />
</button>

                    <button
  onClick={() => handleDelete(product.slug)}
  className="text-red-600 hover:text-red-800"
>
  <FaTrash />
</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuList;