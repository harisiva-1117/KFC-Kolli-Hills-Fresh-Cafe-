import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogOut, Coffee, ShoppingBag, Layers, ClipboardList, ExternalLink } from "lucide-react";
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_DASH } from "@/constants/testIds";
import OrdersAdmin from "@/pages/admin/OrdersAdmin";
import ProductsAdmin from "@/pages/admin/ProductsAdmin";
import CategoriesAdmin from "@/pages/admin/CategoriesAdmin";

const StatCard = ({ label, value, hint, testId }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border border-[#E8E2D9] bg-white p-5"
    data-testid={testId}
  >
    <p className="text-[10px] tracking-[0.35em] uppercase text-[#4A2E15]">{label}</p>
    <p className="font-display text-3xl text-[#1E3F20] mt-2">{value}</p>
    {hint && <p className="text-[11px] text-[#5C5C5C] mt-1">{hint}</p>}
  </motion.div>
);

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, by_status: {}, revenue: 0 });
  const [tab, setTab] = useState("orders");

  const pending = (stats.by_status?.received || 0) + (stats.by_status?.confirmed || 0);

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] text-[#1F1F1F] font-body"
      data-testid={ADMIN_DASH.root}
    >
      <div className="grain-overlay" aria-hidden="true" />

      {/* Header */}
      <header className="bg-[#1E3F20] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#D4AF37]">
                Kolli Hills · Admin
              </p>
              <p className="font-display text-lg leading-none">Fresh Cafe</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/80 hover:text-[#D4AF37]"
              data-testid="admin-view-store"
            >
              View store <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="hidden sm:inline text-xs text-white/60">{user?.email}</span>
            <Button
              variant="outline"
              onClick={logout}
              data-testid={ADMIN_DASH.logoutButton}
              className="rounded-none border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1E3F20] h-9"
            >
              <LogOut className="w-3 h-3 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10">
        {/* Hero band */}
        <section>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#4A2E15]">
            — Phase 4 · MVP Admin Console
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1E3F20] mt-3 leading-[1.05]">
            Good {timeOfDay()},{" "}
            <em className="text-[#D4AF37] not-italic">{user?.name || "Admin"}</em>.
          </h1>
          <p className="text-sm text-[#5C5C5C] mt-3 max-w-xl">
            Track live pickup orders, curate the menu, and keep the shelves fresh.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total orders"
            value={stats.total}
            hint="Lifetime"
            testId={ADMIN_DASH.statTotal}
          />
          <StatCard
            label="Revenue"
            value={`₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`}
            hint="Subtotal sum"
            testId={ADMIN_DASH.statRevenue}
          />
          <StatCard
            label="In queue"
            value={pending}
            hint="Received + Confirmed"
            testId={ADMIN_DASH.statPending}
          />
          <StatCard
            label="Ready for pickup"
            value={stats.by_status?.ready || 0}
            hint="Awaiting collection"
            testId={ADMIN_DASH.statReady}
          />
        </section>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="rounded-none bg-transparent h-auto p-0 border-b border-[#E8E2D9] w-full justify-start gap-0">
            <TabsTrigger
              value="orders"
              data-testid={ADMIN_DASH.tabOrders}
              className="rounded-none px-6 py-4 text-[11px] tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1E3F20] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[#5C5C5C]"
            >
              <ClipboardList className="w-3.5 h-3.5 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger
              value="products"
              data-testid={ADMIN_DASH.tabProducts}
              className="rounded-none px-6 py-4 text-[11px] tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1E3F20] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[#5C5C5C]"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              data-testid={ADMIN_DASH.tabCategories}
              className="rounded-none px-6 py-4 text-[11px] tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1E3F20] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[#5C5C5C]"
            >
              <Layers className="w-3.5 h-3.5 mr-2" /> Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-8">
            <OrdersAdmin onStatsChange={setStats} />
          </TabsContent>
          <TabsContent value="products" className="mt-8">
            <ProductsAdmin />
          </TabsContent>
          <TabsContent value="categories" className="mt-8">
            <CategoriesAdmin />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#FDFBF7",
            color: "#1F1F1F",
            border: "1px solid #E8E2D9",
            borderRadius: 0,
          },
        }}
      />
    </div>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
