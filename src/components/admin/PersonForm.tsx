'use client'
import { useState } from 'react'
import { createPerson, updatePerson } from '@/lib/api/people'
import { createClient } from '@/lib/supabase/client'
import type { Person, FamilySide } from '@/types'

interface Props {
  person?: Person
  onSuccess: () => void
}

export function PersonForm({ person, onSuccess }: Props) {
  const [name, setName] = useState(person?.name ?? '')
  const [nickname, setNickname] = useState(person?.nickname ?? '')
  const [familySide, setFamilySide] = useState<FamilySide>(person?.family_side ?? 'bride')
  const [bio, setBio] = useState(person?.bio ?? '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      let photo_url = person?.photo_url ?? null

      if (photoFile) {
        const supabase = createClient()
        const ext = photoFile.name.split('.').pop()
        const path = `${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(path, photoFile)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('photos').getPublicUrl(path)
        photo_url = data.publicUrl
      }

      const payload = {
        name,
        nickname: nickname || null,
        family_side: familySide,
        bio: bio || null,
        photo_url,
      }

      if (person) {
        await updatePerson(person.id, payload)
      } else {
        await createPerson(payload)
      }
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Apodo</label>
        <input value={nickname} onChange={e => setNickname(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Familia</label>
        <select value={familySide} onChange={e => setFamilySide(e.target.value as FamilySide)} className={inputClass}>
          <option value="bride">Familia de la novia</option>
          <option value="groom">Familia del novio</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
        <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] ?? null)} className="text-sm text-gray-500" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={saving} className="w-full bg-rose-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
        {saving ? 'Guardando...' : person ? 'Guardar cambios' : 'Agregar persona'}
      </button>
    </form>
  )
}
