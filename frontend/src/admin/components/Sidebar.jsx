import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUtensils,
  FaList,
  FaImages,
  FaShoppingBag,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
  { name: "Menu", path: "/admin/menu", icon: <FaUtensils /> },
  { name: "Categories", path: "/admin/categories", icon: <FaList /> },
  { name: "Gallery", path: "/admin/gallery", icon: <FaImages /> },
  { name: "Orders", path: "/admin/orders", icon: <FaShoppingBag /> },
  { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
  { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#2E1B18] text-white flex flex-col">
      <div className="text-center py-6 border-b border-[#4B2E2A]">
        <h1 className="text-2xl font-bold tracking-wide">
          KOHLLI HILLS
        </h1>
        <p className="text-sm text-gray-300">Fresh Café Admin</p>
      </div>

      <nav className="flex-1 px-3 py-5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-[#C89B3C] text-black font-semibold"
                  : "hover:bg-[#4B2E2A]"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#4B2E2A]">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;