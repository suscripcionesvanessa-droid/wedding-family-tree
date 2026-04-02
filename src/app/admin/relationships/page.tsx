'use client'
import { useEffect, useState } from 'react'
import { getAllPeople } from '@/lib/api/people'
import { getAllRelationships, deleteRelationship, createRelationship } from '@/lib/api/relationships'
import { RelationshipForm } from '@/components/admin/RelationshipForm'
import { inferRelationships, type SuggestedRelationship } from '@/lib/utils/inferRelationships'
import { Trash2, Pencil } from 'lucide-react'
import type { Person, Relationship, RelationshipType } from '@/types'

const TYPE_LABELS: Record<RelationshipType, string> = {
  parent_of: 'padre/madre de',
  sibling_of: 'hermano/a de',
  married_to: 'casado/a con',
  partner_of: 'pareja de',
  uncle_aunt_of: 'tío/a de',
  cousin_of: 'primo/a de',
}

export default function AdminRelationshipsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestedRelationship[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const load = () => Promise.all([getAllPeople(), getAllRelationships()])
    .then(([p, r]) => {
      setPeople(p)
      setRelationships(r)
      setSuggestions(inferRelationships(r))
    })
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const peopleById = Object.fromEntries(people.map(p => [p.id, p]))

  const suggestionKey = (s: SuggestedRelationship) => `${s.person_a_id}-${s.person_b_id}-${s.type}`

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta relación?')) return
    try {
      await deleteRelationship(id)
      load()
    } catch {
      alert('Error al eliminar. Intenta de nuevo.')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Relaciones</h1>
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
        <h2 className="font-semibold mb-3">
          {editingRelationship ? 'Editar relación' : 'Nueva relación'}
        </h2>
        <RelationshipForm
          people={people}
          relationship={editingRelationship ?? undefined}
          onSuccess={() => { setEditingRelationship(null); load() }}
        />
        {editingRelationship && (
          <button onClick={() => setEditingRelationship(null)} className="mt-2 text-sm text-gray-500 underline">
            Cancelar
          </button>
        )}
      </div>
      {loading ? <p className="text-gray-400">Cargando...</p> : (
        <>
          <ul className="space-y-2">
            {relationships.map(r => (
              <li key={r.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">{peopleById[r.person_a_id]?.name ?? '?'}</span>
                  {' '}<span className="text-gray-500">{TYPE_LABELS[r.type]}</span>{' '}
                  <span className="font-medium">{peopleById[r.person_b_id]?.name ?? '?'}</span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setEditingRelationship(r)} className="text-gray-400 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {suggestions.filter(s => !dismissed.has(suggestionKey(s))).length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-sm text-gray-500 mb-2">Sugerencias</h2>
              <ul className="space-y-2">
                {suggestions
                  .filter(s => !dismissed.has(suggestionKey(s)))
                  .map(s => (
                    <li key={suggestionKey(s)} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 flex items-center justify-between">
                      <p className="text-sm">
                        <span className="font-medium">{peopleById[s.person_a_id]?.name ?? '?'}</span>
                        {' '}<span className="text-gray-500">{TYPE_LABELS[s.type]}</span>{' '}
                        <span className="font-medium">{peopleById[s.person_b_id]?.name ?? '?'}</span>
                      </p>
                      <div className="flex gap-2 ml-3 shrink-0">
                        <button
                          onClick={async () => {
                            try {
                              await createRelationship(s.person_a_id, s.person_b_id, s.type)
                              load()
                            } catch { alert('Error al agregar') }
                          }}
                          className="text-xs bg-rose-600 text-white px-2 py-1 rounded-lg"
                        >
                          Agregar
                        </button>
                        <button
                          onClick={() => setDismissed(prev => new Set([...prev, suggestionKey(s)]))}
                          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                        >
                          Ignorar
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
