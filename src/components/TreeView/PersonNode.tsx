import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import Image from 'next/image'
import { User } from 'lucide-react'
import type { NodeProps } from '@xyflow/react'
import type { Person } from '@/types'

export const PersonNode = memo(function PersonNode({ data }: NodeProps) {
  const person = data as Person & { onClick?: () => void }

  return (
    <div
      className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden w-20 cursor-pointer hover:shadow-md transition-shadow"
      onClick={person.onClick}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="w-20 h-20 bg-gray-100 relative">
        {person.photo_url ? (
          <Image src={person.photo_url} alt={person.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={28} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-1 text-center">
        <p className="text-xs font-medium text-gray-800 truncate">
          {person.nickname ?? person.name.split(' ')[0]}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  )
})
