export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium">
          Admin
        </span>
        <nav className="flex gap-3 text-sm">
          <a href="/admin/people" className="text-rose-600 hover:underline">Personas</a>
          <a href="/admin/relationships" className="text-rose-600 hover:underline">Relaciones</a>
        </nav>
      </div>
      {children}
    </div>
  )
}
