'use client'
import { useState } from 'react'
import { createRelationship, updateRelationship } from '@/lib/api/relationships'
import type { Person, Relationship, RelationshipType } from '@/types'

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  parent_of: 'es padre/madre de',
  sibling_of: 'es hermano/a de',
  married_to: 'está casado/a con',
  partner_of: 'es pareja de',
  uncle_aunt_of: 'es tío/a de',
  cousin_of: 'es primo/a de',
}

interface Props {
  people: Person[]
  relationship?: Relationship
  onSuccess: () => void
}

export function RelationshipForm({ people, relationship, onSuccess }: Props) {
  const [personA, setPersonA] = useState(relationship?.person_a_id ?? '')
  const [type, setType] = useState<RelationshipType>(relationship?.type ?? 'sibling_of')
  const [personB, setPersonB] = useState(relationship?.person_b_id ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (personA === personB) { setError('Elige personas diferentes'); return }
    setSaving(true)
    setError('')
    try {
      if (relationship) {
        await updateRelationship(relationship.id, personA, personB, type)
      } else {
        await createRelationship(personA, personB, type)
        setPersonA(''); setPersonB('')
      }
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const selectClass = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select value={personA} onChange={e => setPersonA(e.target.value)} required className={selectClass}>
        <option value="">Persona A...</option>
        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={type} onChange={e => setType(e.target.value as RelationshipType)} className={selectClass}>
        {Object.entries(RELATIONSHIP_LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <select value={personB} onChange={e => setPersonB(e.target.value)} required className={selectClass}>
        <option value="">Persona B...</option>
        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={saving} className="w-full bg-rose-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
        {saving ? 'Guardando...' : relationship ? 'Guardar cambios' : 'Agregar relación'}
      </button>
    </form>
  )
}
