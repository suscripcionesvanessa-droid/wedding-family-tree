import { formatRelationshipText, getRelatedPeople } from '../relationships'
import type { Person, ResolvedRelationship } from '@/types'

const mockPerson: Person = {
  id: '1', name: 'Ana', nickname: null,
  photo_url: null, family_side: 'bride', bio: null, created_at: ''
}
const mockOther: Person = {
  id: '2', name: 'María', nickname: null,
  photo_url: null, family_side: 'bride', bio: null, created_at: ''
}

describe('formatRelationshipText', () => {
  it('formats parent_of a→b as "Madre/Padre de X"', () => {
    const rel: ResolvedRelationship = {
      type: 'parent_of', direction: 'a_to_b', other: mockOther
    }
    expect(formatRelationshipText(rel)).toBe('Madre/Padre de María')
  })

  it('formats parent_of b→a as "Hija/Hijo de X"', () => {
    const rel: ResolvedRelationship = {
      type: 'parent_of', direction: 'b_to_a', other: mockOther
    }
    expect(formatRelationshipText(rel)).toBe('Hija/Hijo de María')
  })

  it('formats sibling_of as "Hermana/Hermano de X"', () => {
    const rel: ResolvedRelationship = {
      type: 'sibling_of', direction: 'a_to_b', other: mockOther
    }
    expect(formatRelationshipText(rel)).toBe('Hermana/Hermano de María')
  })

  it('formats married_to as "Casada/Casado con X"', () => {
    const rel: ResolvedRelationship = {
      type: 'married_to', direction: 'a_to_b', other: mockOther
    }
    expect(formatRelationshipText(rel)).toBe('Casada/Casado con María')
  })

  it('formats partner_of as "Pareja de X"', () => {
    const rel: ResolvedRelationship = {
      type: 'partner_of', direction: 'a_to_b', other: mockOther
    }
    expect(formatRelationshipText(rel)).toBe('Pareja de María')
  })

  it('uses nickname when available', () => {
    const rel: ResolvedRelationship = {
      type: 'sibling_of', direction: 'a_to_b',
      other: { ...mockOther, nickname: 'Mafi' }
    }
    expect(formatRelationshipText(rel)).toBe('Hermana/Hermano de Mafi')
  })
})

describe('getRelatedPeople', () => {
  it('resolves relationships where person is person_a', () => {
    const relationships = [{
      id: 'r1', person_a_id: '1', person_b_id: '2',
      type: 'sibling_of' as const, created_at: ''
    }]
    const people = [mockPerson, mockOther]
    const result = getRelatedPeople('1', relationships, people)
    expect(result).toHaveLength(1)
    expect(result[0].direction).toBe('a_to_b')
    expect(result[0].other.id).toBe('2')
  })

  it('resolves relationships where person is person_b', () => {
    const relationships = [{
      id: 'r1', person_a_id: '2', person_b_id: '1',
      type: 'parent_of' as const, created_at: ''
    }]
    const people = [mockPerson, mockOther]
    const result = getRelatedPeople('1', relationships, people)
    expect(result).toHaveLength(1)
    expect(result[0].direction).toBe('b_to_a')
  })
})
