'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="max-w-sm mx-auto px-4 pt-20 text-center">
        <h1 className="text-xl font-bold mb-2">Revisa tu email</h1>
        <p className="text-gray-500 text-sm">
          Te enviamos un enlace de acceso a <strong>{email}</strong>
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-sm mx-auto px-4 pt-20">
      <h1 className="text-xl font-bold mb-1">Acceder</h1>
      <p className="text-gray-500 text-sm mb-6">
        Ingresa tu email para recibir un enlace de acceso.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com" required
          className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button type="submit" disabled={loading}
          className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>
    </main>
  )
}
