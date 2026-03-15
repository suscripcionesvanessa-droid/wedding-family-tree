import { formatRelationshipText } from '@/lib/utils/relationships'
import type { ResolvedRelationship } from '@/types'

interface Props {
  relationships: ResolvedRelationship[]
}

export function RelationshipList({ relationships }: Props) {
  if (relationships.length === 0) return null

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Relaciones
      </h3>
      <ul className="space-y-1">
        {relationships.map((rel) => (
          <li key={`${rel.other.id}-${rel.type}`} className="text-sm text-gray-700">
            {formatRelationshipText(rel)}
          </li>
        ))}
      </ul>
    </div>
  )
}
