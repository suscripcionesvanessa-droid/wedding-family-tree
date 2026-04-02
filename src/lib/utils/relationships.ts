import type { Person, Relationship, ResolvedRelationship } from '@/types'

export function formatRelationshipText(rel: ResolvedRelationship): string {
  const name = rel.other.nickname ?? rel.other.name
  switch (rel.type) {
    case 'parent_of':
      return rel.direction === 'a_to_b'
        ? `Madre/Padre de ${name}`
        : `Hija/Hijo de ${name}`
    case 'sibling_of':
      return `Hermana/Hermano de ${name}`
    case 'married_to':
      return `Casada/Casado con ${name}`
    case 'partner_of':
      return `Pareja de ${name}`
    case 'uncle_aunt_of':
      return rel.direction === 'a_to_b'
        ? `Tío/Tía de ${name}`
        : `Sobrino/Sobrina de ${name}`
    case 'cousin_of':
      return `Primo/Prima de ${name}`
  }
}

export function getRelatedPeople(
  personId: string,
  relationships: Relationship[],
  people: Person[]
): ResolvedRelationship[] {
  const peopleById = Object.fromEntries(people.map(p => [p.id, p]))
  const result: ResolvedRelationship[] = []

  for (const rel of relationships) {
    if (rel.person_a_id === personId && peopleById[rel.person_b_id]) {
      result.push({ type: rel.type, direction: 'a_to_b', other: peopleById[rel.person_b_id] })
    } else if (rel.person_b_id === personId && peopleById[rel.person_a_id]) {
      result.push({ type: rel.type, direction: 'b_to_a', other: peopleById[rel.person_a_id] })
    }
  }

  return result
}
