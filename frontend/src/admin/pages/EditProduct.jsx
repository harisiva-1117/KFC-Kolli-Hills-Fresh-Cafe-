import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategories,
  getProduct,
  updateProduct,
} from "../services/productService";

const EditProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
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
    variants: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, product] = await Promise.all([
        getCategories(),
        getProduct(slug),
      ]);

      setCategories(categoryData);

      setForm({
        name: product.name || "",
        slug: product.slug || "",
        category_slug: product.category_slug || "",
        description: product.description || "",
        note: product.note || "",
        image: product.image || "",
        price: product.price ?? "",
        rating: product.rating ?? 5,
        is_best_seller: product.is_best_seller,
        is_available: product.is_available,
        order: product.order ?? 1,
        variants:
          product.variants || [
            {
              label: "Regular",
              price: product.price ?? 0,
            },
          ],
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(slug, {
        ...form,
        price:
          form.price === ""
            ? null
            : Number(form.price),
        rating: Number(form.rating),
        order: Number(form.order),
        variants: [
          {
            label: "Regular",
            price:
              form.price === ""
                ? null
                : Number(form.price),
          },
        ],
      });

      alert("Product Updated Successfully");

      navigate("/admin/menu");
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >        <input
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
            <option key={cat.slug} value={cat.slug}>
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
          name="rating"
          placeholder="Rating"
          min="1"
          max="5"
          step="0.1"
          value={form.rating}
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg hover:bg-[#4B2E2A]"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/menu")}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;