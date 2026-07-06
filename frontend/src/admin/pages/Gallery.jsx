import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getGallery,
  deleteGallery,
} from "../services/productService";

const Gallery = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await getGallery();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (title) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      await deleteGallery(title);
      alert("Image deleted successfully");
      loadGallery();
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gallery Management
        </h1>

        <button
          onClick={() => navigate("/admin/gallery/add")}
          className="bg-[#C89B3C] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600"
        >
          <FaPlus />
          Add Image
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#2E1B18] text-white">
            <tr>
              <th className="p-4">Image</th>
              <th>Title</th>
              <th>Order</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {images.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-8 text-gray-500"
                >
                  No images found.
                </td>
              </tr>
            ) : (
              images.map((img) => (
                <tr
                  key={img.title}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <img
                      src={img.image}
                      alt={img.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </td>

                  <td>{img.title}</td>

                  <td>{img.order}</td>

                  <td>
                    {img.is_active ? "✅" : "❌"}
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(img.title)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gallery;