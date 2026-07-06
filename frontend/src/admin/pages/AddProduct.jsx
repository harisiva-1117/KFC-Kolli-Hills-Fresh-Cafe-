import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, createProduct } from "../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_slug: "",
    description: "",
    note: "",
    image: "",
    price: "",
    rating: 5,
    is_best_seller: false,
    is_available: true,
    order: 1,
    variants: [
  {
    label: "Regular",
    price: 0,
  },
],
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct({
  ...form,
  price: Number(form.price),
  order: Number(form.order),
  variants: [
    {
      label: "Regular",
      price: Number(form.price),
    },
  ],
});

      alert("Product Added Successfully");

      navigate("/admin/menu");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="category_slug"
          value={form.category_slug}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option
              key={cat.slug}
              value={cat.slug}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="order"
          placeholder="Display Order"
          value={form.order}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_best_seller"
            checked={form.is_best_seller}
            onChange={handleChange}
          />
          Best Seller
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />
          Available
        </label>

        <button
          type="submit"
          className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg hover:bg-[#4B2E2A]"
        >
          Save Product
        </button>

      </form>

    </div>
  );
};

export default AddProduct;