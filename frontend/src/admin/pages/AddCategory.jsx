import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../services/productService";

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    order: 1,
    is_active: true,
    tag: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCategory({
        ...form,
        order: Number(form.order),
      });

      alert("Category Added Successfully");

      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Category
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Category Name"
          required
        />

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Slug"
          required
        />

        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Tag"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Image URL"
        />

        <input
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Display Order"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <button
          type="submit"
          className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg hover:bg-[#4B2E2A]"
        >
          Save Category
        </button>

      </form>
    </div>
  );
};

export default AddCategory;