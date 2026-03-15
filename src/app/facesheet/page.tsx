'use client'
import { useEffect, useState } from 'react'
import { getAllPeople } from '@/lib/api/people'
import { PersonCard } from '@/components/PersonCard'
import { FamilyFilter } from '@/components/FamilyFilter'
import { WEDDING_CONFIG } from '@/config/wedding'
import type { Person, FamilySide } from '@/types'

const { brideName: BRIDE_NAME, groomName: GROOM_NAME } = WEDDING_CONFIG

export default function FacesheetPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [filter, setFilter] = useState<FamilySide | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getAllPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? people : people.filter(p => p.family_side === filter)

  return (
    <main className="max-w-2xl mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">La Familia</h1>
      <div className="mb-4">
        <FamilyFilter
          selected={filter}
          onChange={setFilter}
          brideLabel={BRIDE_NAME}
          groomLabel={GROOM_NAME}
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
      {!loading && error && (
        <p className="text-center text-red-500 mt-12">Error al cargar la familia. Intenta de nuevo.</p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No hay personas aún.</p>
      )}
    </main>
  )
}
