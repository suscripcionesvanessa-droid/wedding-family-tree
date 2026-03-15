'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, GitBranch, Search } from 'lucide-react'

export function NavBar() {
  const pathname = usePathname()
  const links = [
    { href: '/facesheet', label: 'Familias', icon: Users },
    { href: '/tree', label: 'Árbol', icon: GitBranch },
    { href: '/search', label: 'Buscar', icon: Search },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-1 text-xs ${
              active ? 'text-rose-600' : 'text-gray-500'
            }`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
