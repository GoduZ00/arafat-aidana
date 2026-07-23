import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Guest {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guests: string;
  created_at: string;
}

export async function addGuest(data: { name: string; attending: string; guests: string }): Promise<string> {
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
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
