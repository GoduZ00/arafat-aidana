import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface Guest {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guests: string;
  created_at: string;
}

export async function addGuest(data: { name: string; attending: string; guests: string }): Promise<string> {
  if (!supabase) return 'no-db';
  const { data: result, error } = await supabase
    .from('guests')
    .insert({
      name: data.name,
      attending: data.attending,
      guests: data.guests,
    })
    .select()
    .single();

  if (error) throw error;
  return result.id;
}

export async function getGuests(): Promise<Guest[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteGuest(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
