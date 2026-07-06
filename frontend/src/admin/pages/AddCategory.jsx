import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCategory,
  uploadImage,
} from "../services/productService";

const AddCategory = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
const [uploading, setUploading] = useState(false);

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
    let imageUrl = form.image;

    if (file) {
      setUploading(true);

      const result = await uploadImage(file);

      imageUrl = result.url;

      setUploading(false);
    }

    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await createCategory({
      ...form,
      slug: slug,
      image: imageUrl,
      order: Number(form.order),
    });

    alert("Category Added Successfully");

    navigate("/admin/categories");

  } catch (err) {
    console.error(err);
    alert("Failed to add category");
    setUploading(false);
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

        <div>
  <label className="font-semibold block mb-2">
    Choose Category Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setFile(e.target.files[0])}
    className="w-full border p-3 rounded"
    required
  />
</div>

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
  disabled={uploading}
  className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg hover:bg-[#4B2E2A]"
>
  {uploading ? "Uploading..." : "Save Category"}
</button>

      </form>
    </div>
  );
};

export default AddCategory;