import { createClient } from '@/lib/supabase/client'
import type { Relationship, RelationshipType } from '@/types'

export async function getAllRelationships(): Promise<Relationship[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('relationships').select('*')
  if (error) throw error
  return data
}

export async function createRelationship(
  personAId: string,
  personBId: string,
  type: RelationshipType
): Promise<Relationship> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('relationships')
    .insert({ person_a_id: personAId, person_b_id: personBId, type })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateRelationship(
  id: string,
  personAId: string,
  personBId: string,
  type: RelationshipType
): Promise<Relationship> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('relationships')
    .update({ person_a_id: personAId, person_b_id: personBId, type })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRelationship(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('relationships').delete().eq('id', id)
  if (error) throw error
}
