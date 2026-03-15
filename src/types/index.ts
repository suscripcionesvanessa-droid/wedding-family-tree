export type FamilySide = 'bride' | 'groom'

export type RelationshipType = 'parent_of' | 'sibling_of' | 'married_to' | 'partner_of'

export interface Person {
  id: string
  name: string
  nickname: string | null
  photo_url: string | null
  family_side: FamilySide
  bio: string | null
  created_at: string
}

export interface Relationship {
  id: string
  person_a_id: string
  person_b_id: string
  type: RelationshipType
  created_at: string
}

export interface PersonWithRelationships extends Person {
  relationships: ResolvedRelationship[]
}

export interface ResolvedRelationship {
  type: RelationshipType
  direction: 'a_to_b' | 'b_to_a'
  other: Person
}
