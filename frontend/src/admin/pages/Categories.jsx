import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
} from "../services/productService";
const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (slug) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {
    await deleteCategory(slug);

    alert("Category deleted successfully");

    loadCategories();
  } catch (err) {
    console.error(err);
    alert("Failed to delete category");
  }
};

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-[#C89B3C] px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#2E1B18] text-white">
            <tr>
              <th className="p-4">Name</th>
              <th>Slug</th>
              <th>Active</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((cat) => (

              <tr
                key={cat.id}
                className="border-b"
              >

                <td className="p-4">
                  {cat.name}
                </td>

                <td>
                  {cat.slug}
                </td>

                <td>
                  {cat.is_active ? "✅" : "❌"}
                </td>

                <td>
                  {cat.order}
                </td>

                <td>

                  <div className="flex gap-4 justify-center">

                    <button
  onClick={() => navigate(`/admin/categories/edit/${cat.slug}`)}
  className="text-blue-600 hover:text-blue-800"
>
  <FaEdit />
</button>

                   <button
  onClick={() => handleDelete(cat.slug)}
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

export default Categories;