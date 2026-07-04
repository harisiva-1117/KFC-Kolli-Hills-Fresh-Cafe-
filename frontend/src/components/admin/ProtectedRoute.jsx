import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-6 h-6 animate-spin text-[#1E3F20]" />
      </div>
    );
  }
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
