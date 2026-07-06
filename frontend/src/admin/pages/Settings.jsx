import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
} from "../services/productService";

const Settings = () => {
  const [settings, setSettings] = useState({
    cafe_name: "",
    phone: "",
    email: "",
    address: "",
    opening_hours: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSettings(settings);
      alert("Settings Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-8">
        Cafe Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          name="cafe_name"
          placeholder="Cafe Name"
          value={settings.cafe_name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={settings.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={settings.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="address"
          placeholder="Address"
          rows="3"
          value={settings.address}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="opening_hours"
          placeholder="Opening Hours"
          value={settings.opening_hours}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg"
        >
          Save Settings
        </button>

      </form>
    </div>
  );
};

export default Settings;