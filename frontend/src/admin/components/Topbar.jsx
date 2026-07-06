import { FaBell, FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2E1B18]">
          Admin Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Welcome to Kohlli Hills Fresh Café
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-2xl text-gray-600 hover:text-[#C89B3C]">
          <FaBell />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <FaUserCircle className="text-4xl text-[#2E1B18]" />
          <div>
            <h4 className="font-semibold">Administrator</h4>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;