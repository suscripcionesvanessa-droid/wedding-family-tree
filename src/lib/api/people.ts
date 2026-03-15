import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/types'

export async function getAllPeople(): Promise<Person[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function getPeopleByFamily(side: 'bride' | 'groom'): Promise<Person[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('family_side', side)
    .order('name')
  if (error) throw error
  return data
}

export async function getPersonById(id: string): Promise<Person | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function searchPeople(query: string): Promise<Person[]> {
  const supabase = createClient()
  // Use separate filters instead of raw .or() string to avoid PostgREST filter injection
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .or(`name.ilike.%${query.replace(/[%_,()]/g, '')}%,nickname.ilike.%${query.replace(/[%_,()]/g, '')}%`)
    .order('name')
  if (error) throw error
  return data
}

export async function createPerson(
  person: Omit<Person, 'id' | 'created_at'>
): Promise<Person> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('people')
    .insert(person)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePerson(
  id: string,
  updates: Partial<Omit<Person, 'id' | 'created_at'>>
): Promise<Person> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('people')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePerson(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('people').delete().eq('id', id)
  if (error) throw error
}
