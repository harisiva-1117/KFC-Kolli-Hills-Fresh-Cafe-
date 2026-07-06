import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getMessages,
  deleteMessage,
} from "../services/productService";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(email);
      loadMessages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Customer Messages
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#2E1B18] text-white">
            <tr>
              <th className="p-4">Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {messages.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  No messages found.
                </td>
              </tr>

            ) : (

              messages.map((msg) => (

                <tr
                  key={msg.email}
                  className="border-b"
                >
                  <td className="p-4">{msg.name}</td>
                  <td>{msg.phone}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(msg.email)}
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

export default Messages;