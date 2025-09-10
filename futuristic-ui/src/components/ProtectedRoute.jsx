import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, roles = ["user", "manager", "admin"] }) {
  const router = useRouter();
  const { user, loading, hasRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (!hasRole(roles)) router.replace("/");
    }
  }, [user, loading, roles, hasRole, router]);

  if (loading || !user) return null;
  if (!hasRole(roles)) return null;
  return children;
}