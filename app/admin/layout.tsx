import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <aside className="w-full sm:w-56 flex-shrink-0 bg-neutral-900 text-white p-5">
        <h2 className="text-lg font-semibold mb-5">Admin Panel</h2>
        <nav className="flex flex-row sm:flex-col gap-4 sm:gap-3 flex-wrap text-sm">
          <Link href="/admin" className="hover:opacity-70">Dashboard</Link>
          <Link href="/admin/products" className="hover:opacity-70">Məhsullar</Link>
          <Link href="/admin/users" className="hover:opacity-70">İstifadəçilər</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-neutral-50 p-4 sm:p-8">{children}</main>
    </div>
  );
}