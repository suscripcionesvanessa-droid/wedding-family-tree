'use client'
import { useState, useEffect, useRef } from 'react'
import { searchPeople } from '@/lib/api/people'
import { PersonCard } from '@/components/PersonCard'
import { Search } from 'lucide-react'
import type { Person } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(debounceRef.current!)
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      searchPeople(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(debounceRef.current!)
  }, [query])

  return (
    <main className="max-w-2xl mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar</h1>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Busca por nombre o apodo..."
          autoFocus
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
      {loading && <p className="text-gray-400 text-sm text-center">Buscando...</p>}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {results.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}
      {!loading && query.trim() && results.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No se encontró "{query}"</p>
      )}
    </main>
  )
}
