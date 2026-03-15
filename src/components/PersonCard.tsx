import Image from 'next/image'
import Link from 'next/link'
import { User } from 'lucide-react'
import type { Person } from '@/types'

interface Props {
  person: Person
}

export function PersonCard({ person }: Props) {
  return (
    <Link href={`/person/${person.id}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 relative">
          {person.photo_url ? (
            <Image
              src={person.photo_url}
              alt={person.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={48} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-2 text-center">
          <p className="font-semibold text-sm text-gray-900 truncate">{person.name}</p>
          {person.nickname && (
            <p className="text-xs text-gray-500">"{person.nickname}"</p>
          )}
        </div>
      </div>
    </Link>
  )
}
