import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";

import Login from "@/admin/pages/Login";
import AdminLayout from "@/admin/AdminLayout";

import Dashboard from "@/admin/pages/Dashboard";
import MenuList from "@/admin/pages/MenuList";
import Categories from "@/admin/pages/Categories";
import Gallery from "@/admin/pages/Gallery";
import Orders from "@/admin/pages/Orders";
import Messages from "@/admin/pages/Messages";
import Settings from "@/admin/pages/Settings";

import { CartProvider } from "@/context/CartContext";
import AddProduct from "@/admin/pages/AddProduct";
import EditProduct from "@/admin/pages/EditProduct";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* Customer Website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderConfirmationPage />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />
            

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
            <Route path="menu/add" element={<AddProduct />} />
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuList />} />
              <Route path="menu/edit/:slug" element={<EditProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="orders" element={<Orders />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;