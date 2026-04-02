'use client'
import { useEffect, useState } from 'react'
import { getAllPeople } from '@/lib/api/people'
import { getAllRelationships, deleteRelationship } from '@/lib/api/relationships'
import { RelationshipForm } from '@/components/admin/RelationshipForm'
import { Trash2, Pencil } from 'lucide-react'
import type { Person, Relationship, RelationshipType } from '@/types'

const TYPE_LABELS: Record<RelationshipType, string> = {
  parent_of: 'padre/madre de',
  sibling_of: 'hermano/a de',
  married_to: 'casado/a con',
  partner_of: 'pareja de',
}

export default function AdminRelationshipsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null)

  const load = () => Promise.all([getAllPeople(), getAllRelationships()])
    .then(([p, r]) => { setPeople(p); setRelationships(r) })
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const peopleById = Object.fromEntries(people.map(p => [p.id, p]))

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
      )}
    </div>
  )
}
