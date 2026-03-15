'use client'
import { useEffect, useState } from 'react'
import { getAllPeople } from '@/lib/api/people'
import { getAllRelationships } from '@/lib/api/relationships'
import { TreeView } from '@/components/TreeView'
import { FamilyFilter } from '@/components/FamilyFilter'
import { WEDDING_CONFIG } from '@/config/wedding'
import type { Person, Relationship, FamilySide } from '@/types'

const { brideName: BRIDE_NAME, groomName: GROOM_NAME } = WEDDING_CONFIG

export default function TreePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [filter, setFilter] = useState<FamilySide | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([getAllPeople(), getAllRelationships()])
      .then(([p, r]) => { setPeople(p); setRelationships(r) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filteredPeople = filter === 'all' ? people : people.filter(p => p.family_side === filter)
  const filteredIds = new Set(filteredPeople.map(p => p.id))
  const filteredRelationships = relationships.filter(
    r => filteredIds.has(r.person_a_id) && filteredIds.has(r.person_b_id)
  )

  return (
    <main className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Árbol Familiar</h1>
      <div className="mb-3">
        <FamilyFilter
          selected={filter}
          onChange={setFilter}
          brideLabel={BRIDE_NAME}
          groomLabel={GROOM_NAME}
        />
      </div>
      {loading && (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Cargando árbol...
        </div>
      )}
      {!loading && error && (
        <p className="text-center text-red-500 mt-12">Error al cargar el árbol. Intenta de nuevo.</p>
      )}
      {!loading && !error && (
        <TreeView people={filteredPeople} relationships={filteredRelationships} />
      )}
    </main>
  )
}
