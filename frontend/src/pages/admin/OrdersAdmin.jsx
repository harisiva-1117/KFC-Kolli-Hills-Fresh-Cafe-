import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { ADMIN_ORDERS, ADMIN_DASH } from "@/constants/testIds";

const STATUS_META = {
  received: { label: "Received", tone: "bg-[#FAF3E0] text-[#4A2E15] border-[#D4AF37]/40" },
  confirmed: { label: "Confirmed", tone: "bg-[#EDF3EE] text-[#1E3F20] border-[#1E3F20]/30" },
  ready: { label: "Ready", tone: "bg-[#1E3F20] text-[#D4AF37] border-[#1E3F20]" },
  collected: { label: "Collected", tone: "bg-[#F0EBE3] text-[#5C5C5C] border-[#E8E2D9]" },
  cancelled: { label: "Cancelled", tone: "bg-[#FDECEC] text-[#B4451D] border-[#B4451D]/40" },
};

const STATUS_KEYS = ["received", "confirmed", "ready", "collected", "cancelled"];

const timeAgo = (iso) => {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return d.toLocaleDateString();
};

export default function OrdersAdmin({ onStatsChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rows, stats] = await Promise.all([
        api.adminListOrders(filter === "all" ? undefined : filter),
        api.adminOrderStats(),
      ]);
      setOrders(rows || []);
      onStatsChange?.(stats);
    } catch (e) {
      toast.error("Failed to load orders", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, [filter, onStatsChange]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingId(order.id);
    try {
      await api.adminUpdateOrderStatus(order.id, newStatus);
      toast.success(`Order ${order.order_number} → ${newStatus}`);
      load();
    } catch (e) {
      toast.error("Update failed", { description: e.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => orders, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#4A2E15]">
            — Live orders
          </p>
          <h2 className="font-display text-2xl text-[#1E3F20] mt-1">
            Pickup queue
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              data-testid={ADMIN_ORDERS.filter}
              className="w-[180px] rounded-none border-[#1E3F20] focus:ring-0 focus:ring-offset-0"
            >
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_KEYS.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={load}
            className="rounded-none border-[#1E3F20] text-[#1E3F20] hover:bg-[#1E3F20] hover:text-white h-10"
            data-testid="admin-orders-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="border border-[#E8E2D9] bg-white">
        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-[#5C5C5C]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3 text-[#1E3F20]" />
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center" data-testid={ADMIN_ORDERS.emptyState}>
            <p className="font-display text-xl text-[#1E3F20]">No orders yet</p>
            <p className="text-sm text-[#5C5C5C] mt-2">
              Incoming pickup orders will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E2D9]">
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Order
                </TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Customer
                </TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Items
                </TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Total
                </TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Placed
                </TableHead>
                <TableHead className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => {
                const meta = STATUS_META[o.status] || STATUS_META.received;
                return (
                  <motion.tr
                    key={o.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-testid={`${ADMIN_ORDERS.row}-${o.id}`}
                    className="border-b border-[#E8E2D9] align-top"
                  >
                    <TableCell className="py-4">
                      <p className="font-display text-lg text-[#1E3F20]">
                        {o.order_number}
                      </p>
                      {o.notes && (
                        <p className="text-xs text-[#5C5C5C] mt-1 italic max-w-xs">
                          &ldquo;{o.notes}&rdquo;
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm text-[#1F1F1F]">{o.customer_name}</p>
                      <a
                        href={`tel:${o.customer_phone}`}
                        className="text-xs text-[#4A2E15] inline-flex items-center gap-1 hover:text-[#1E3F20]"
                      >
                        <Phone className="w-3 h-3" /> {o.customer_phone}
                      </a>
                    </TableCell>
                    <TableCell className="py-4">
                      <ul className="text-xs text-[#1F1F1F] space-y-1">
                        {o.items.slice(0, 3).map((it, i) => (
                          <li key={i}>
                            <span className="text-[#1E3F20]">{it.qty}×</span>{" "}
                            {it.name}{" "}
                            <span className="text-[#5C5C5C]">({it.variant_label})</span>
                          </li>
                        ))}
                        {o.items.length > 3 && (
                          <li className="text-[#5C5C5C]">
                            +{o.items.length - 3} more
                          </li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-display text-lg text-[#1E3F20]">
                        ₹{o.subtotal}
                      </p>
                      {o.has_pickup_pricing && (
                        <p className="text-[10px] uppercase tracking-widest text-[#B4451D]">
                          + pickup pricing
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#5C5C5C]">
                      {timeAgo(o.created_at)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant="outline"
                          className={`rounded-none w-fit text-[10px] tracking-widest uppercase px-2 py-1 border ${meta.tone}`}
                        >
                          {meta.label}
                        </Badge>
                        <Select
                          value={o.status}
                          onValueChange={(v) => handleStatusChange(o, v)}
                          disabled={updatingId === o.id}
                        >
                          <SelectTrigger
                            data-testid={`${ADMIN_ORDERS.statusSelect}-${o.id}`}
                            className="rounded-none border-[#1E3F20] h-8 w-[140px] text-xs"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            {STATUS_KEYS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_META[s].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
