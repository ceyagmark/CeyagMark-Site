"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="admin-header">
      <Link className="admin-brand" href="/">
        Ceyag<span>mark</span> Admin
      </Link>
      <div className="admin-nav">
        <Link className="admin-tab" href="/admin/bookings" data-active={pathname === "/admin/bookings"}>
          Bookings
        </Link>
        <Link className="admin-tab" href="/admin/leads" data-active={pathname === "/admin/leads"}>
          Leads
        </Link>
        <button type="button" className="admin-signout" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
