import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="navbar container">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Futuristic</Link>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
          {user ? (
            <button onClick={logout} className="btn btn-primary btn-sm">Logout</button>
          ) : (
            <Link className="btn btn-secondary btn-sm" href="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}