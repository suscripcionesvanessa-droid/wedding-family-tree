import type { Relationship, RelationshipType } from '@/types'

export interface SuggestedRelationship {
  person_a_id: string
  person_b_id: string
  type: RelationshipType
  reason: string
}

function getSiblings(personId: string, relationships: Relationship[]): string[] {
  return relationships
    .filter(r => r.type === 'sibling_of' && (r.person_a_id === personId || r.person_b_id === personId))
    .map(r => r.person_a_id === personId ? r.person_b_id : r.person_a_id)
}

function getChildren(personId: string, relationships: Relationship[]): string[] {
  return relationships
    .filter(r => r.type === 'parent_of' && r.person_a_id === personId)
    .map(r => r.person_b_id)
}

function relationshipExists(
  aId: string, bId: string, type: RelationshipType, relationships: Relationship[]
): boolean {
  return relationships.some(r =>
    r.type === type && (
      (r.person_a_id === aId && r.person_b_id === bId) ||
      (r.person_a_id === bId && r.person_b_id === aId)
    )
  )
}

export function inferRelationships(relationships: Relationship[]): SuggestedRelationship[] {
  const suggestions: SuggestedRelationship[] = []
  const seen = new Set<string>()

  for (const rel of relationships) {
    if (rel.type !== 'parent_of') continue
    const parentId = rel.person_a_id
    const childId = rel.person_b_id

    // Rule 1: parent's siblings are uncle/aunt of child
    const siblings = getSiblings(parentId, relationships)
    for (const siblingId of siblings) {
      if (relationshipExists(siblingId, childId, 'uncle_aunt_of', relationships)) continue
      const key = [siblingId, childId, 'uncle_aunt_of'].sort().join('-')
      if (seen.has(key)) continue
      seen.add(key)
      suggestions.push({ person_a_id: siblingId, person_b_id: childId, type: 'uncle_aunt_of', reason: '' })
    }

    // Rule 2: children of parent's siblings are cousins
    for (const siblingId of siblings) {
      const cousinCandidates = getChildren(siblingId, relationships)
      for (const cousinId of cousinCandidates) {
        if (cousinId === childId) continue
        if (relationshipExists(childId, cousinId, 'cousin_of', relationships)) continue
        const key = [childId, cousinId, 'cousin_of'].sort().join('-')
        if (seen.has(key)) continue
        seen.add(key)
        suggestions.push({ person_a_id: childId, person_b_id: cousinId, type: 'cousin_of', reason: '' })
      }
    }
  }

  return suggestions
}
