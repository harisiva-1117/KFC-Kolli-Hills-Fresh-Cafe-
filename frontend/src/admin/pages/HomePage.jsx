import { useState } from "react";
import { createMessage } from "../services/productService";

const HomePage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createMessage(form);

      alert("Message Sent Successfully!");

      setForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-8">
        Contact Us
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="message"
          rows="5"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-[#2E1B18] text-white px-6 py-3 rounded-lg"
        >
          Send Message
        </button>

      </form>

    </div>
  );
};

export default HomePage;