'use client'
import { useEffect, useState } from 'react'
import { getAllPeople } from '@/lib/api/people'
import { getAllRelationships } from '@/lib/api/relationships'
import { PersonCard } from '@/components/PersonCard'
import { FamilyFilter } from '@/components/FamilyFilter'
import { WEDDING_CONFIG } from '@/config/wedding'
import type { Person, FamilySide, Relationship } from '@/types'

const { brideName: BRIDE_NAME, groomName: GROOM_NAME } = WEDDING_CONFIG

function getRelationshipSummary(personId: string, relationships: Relationship[], allPeople: Person[]): string {
  const peopleById = Object.fromEntries(allPeople.map(p => [p.id, p]))
  const parts: string[] = []

  for (const rel of relationships) {
    if (rel.person_a_id === personId || rel.person_b_id === personId) {
      const otherId = rel.person_a_id === personId ? rel.person_b_id : rel.person_a_id
      const other = peopleById[otherId]
      if (!other) continue
      const otherName = other.nickname ?? other.name.split(' ')[0]

      if (rel.type === 'married_to' || rel.type === 'partner_of') {
        parts.push(`pareja de ${otherName}`)
      } else if (rel.type === 'parent_of' && rel.person_a_id === personId) {
        parts.push(`padre/madre de ${otherName}`)
      } else if (rel.type === 'parent_of' && rel.person_b_id === personId) {
        parts.push(`hijo/a de ${otherName}`)
      } else if (rel.type === 'sibling_of') {
        parts.push(`hermano/a de ${otherName}`)
      }
    }
  }

  // Show max 2 relationships to keep it short
  return parts.slice(0, 2).join(' · ')
}

export default function FacesheetPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [filter, setFilter] = useState<FamilySide | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([getAllPeople(), getAllRelationships()])
      .then(([peopleData, relationshipsData]) => {
        setPeople(peopleData)
        setRelationships(relationshipsData)
      })
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
            <PersonCard
              key={person.id}
              person={person}
              relationshipSummary={getRelationshipSummary(person.id, relationships, people)}
            />
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
