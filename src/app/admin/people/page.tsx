'use client'
import { useEffect, useState } from 'react'
import { getAllPeople, deletePerson } from '@/lib/api/people'
import { PersonForm } from '@/components/admin/PersonForm'
import { Plus, Trash2, Pencil } from 'lucide-react'
import type { Person } from '@/types'

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [editingPerson, setEditingPerson] = useState<Person | 'new' | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => getAllPeople().then(setPeople).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta persona?')) return
    await deletePerson(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Personas ({people.length})</h1>
        <button onClick={() => setEditingPerson('new')}
          className="flex items-center gap-1 bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm">
          <Plus size={16} /> Agregar
        </button>
      </div>

      {editingPerson && (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
          <h2 className="font-semibold mb-3">
            {editingPerson === 'new' ? 'Nueva persona' : `Editar: ${editingPerson.name}`}
          </h2>
          <PersonForm
            person={editingPerson === 'new' ? undefined : editingPerson}
            onSuccess={() => { setEditingPerson(null); load() }}
          />
          <button onClick={() => setEditingPerson(null)} className="mt-2 text-sm text-gray-500 underline">
            Cancelar
          </button>
        </div>
      )}

      {loading ? <p className="text-gray-400">Cargando...</p> : (
        <ul className="space-y-2">
          {people.map(p => (
            <li key={p.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {p.nickname ? `"${p.nickname}" · ` : ''}{p.family_side === 'bride' ? 'Novia' : 'Novio'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPerson(p)} className="text-gray-400 hover:text-gray-700">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500">
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
