import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRelatedPeople } from '@/lib/utils/relationships'
import { RelationshipList } from '@/components/RelationshipList'
import { UpdatePhotoButton } from '@/components/UpdatePhotoButton'
import { User } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: person },
    { data: allPeople, error: peopleError },
    { data: allRelationships, error: relError },
  ] = await Promise.all([
    supabase.from('people').select('*').eq('id', id).single(),
    supabase.from('people').select('*'),
    supabase.from('relationships').select('*'),
  ])

  if (!person) notFound()
  if (peopleError) throw peopleError
  if (relError) throw relError

  const relationships = getRelatedPeople(id, allRelationships ?? [], allPeople ?? [])
  const familyLabel = person.family_side === 'bride' ? 'Familia de la novia' : 'Familia del novio'

  return (
    <main className="max-w-lg mx-auto px-4 pt-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="aspect-square bg-gray-100 relative w-full max-w-xs mx-auto mt-4 rounded-xl overflow-hidden">
          {person.photo_url ? (
            <Image src={person.photo_url} alt={person.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={80} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
          {person.nickname && (
            <p className="text-gray-500 text-sm mt-0.5">"{person.nickname}"</p>
          )}
          <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs rounded-full">
            {familyLabel}
          </span>
          <UpdatePhotoButton personId={person.id} />
          {person.bio && (
            <p className="mt-4 text-gray-600 text-sm">{person.bio}</p>
          )}
          <RelationshipList relationships={relationships} />
        </div>
      </div>
    </main>
  )
}
