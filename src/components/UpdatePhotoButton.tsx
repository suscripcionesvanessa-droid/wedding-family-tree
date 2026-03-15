'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera } from 'lucide-react'

interface Props {
  personId: string
}

export function UpdatePhotoButton({ personId }: Props) {
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to login
      window.location.href = `/auth/login`
      return
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${personId}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(path, file, { upsert: true })

    if (!uploadError) {
      const { data } = supabase.storage.from('photos').getPublicUrl(path)
      await supabase.from('people').update({ photo_url: data.publicUrl }).eq('id', personId)
      setDone(true)
      setTimeout(() => window.location.reload(), 1000)
    }

    setUploading(false)
  }

  return (
    <div className="mt-3">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading || done}
        className="flex items-center gap-2 text-sm text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50"
      >
        <Camera size={16} />
        {done ? '¡Foto actualizada!' : uploading ? 'Subiendo...' : 'Soy yo — actualizar mi foto'}
      </button>
    </div>
  )
}
