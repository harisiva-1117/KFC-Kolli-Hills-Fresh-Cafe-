import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createGallery,
  uploadImage,
} from "../services/productService";

const AddGallery = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    image: "",
    order: 1,
    is_active: true,
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      let imageUrl = form.image;

      if (file) {
        setUploading(true);

        const result = await uploadImage(file);

        imageUrl = result.url;

        setUploading(false);
      }

      await createGallery({
        ...form,
        image: imageUrl,
        order: Number(form.order),
      });

      alert("Gallery Image Added Successfully");

      navigate("/admin/gallery");
    } catch (err) {
      console.error(err);
      alert("Failed to add image");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Gallery Image
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Image Title"
          className="w-full border p-3 rounded"
          required
        />

        <div>
          <label className="font-semibold block mb-2">
            Choose Image
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
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          placeholder="Display Order"
          className="w-full border p-3 rounded"
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
          {uploading ? "Uploading..." : "Save Image"}
        </button>
      </form>
    </div>
  );
};

export default AddGallery;