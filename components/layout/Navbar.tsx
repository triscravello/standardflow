"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const navLinks = [
  { name: "Dashboard / Planner", href: "/planner/week" },
  { name: "Units", href: "/units" },
  { name: "Lessons", href: "/lessons" },
  { name: "Standards", href: "/standards" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-slate-200 bg-white/95 px-6 py-4 text-slate-900 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <ul className="flex flex-wrap items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? "font-semibold text-blue-700" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {user && (
            <p className="text-sm text-slate-600">
              {user.username} <span className="text-slate-400">({user.role})</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}