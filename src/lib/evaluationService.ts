import { createClient } from '@supabase/supabase-js';
import { AvaliacaoPortage } from './portageEngine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function buscarUltimaAvaliacao(patientId: string) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('evaluation_date, responses, notes') // Extrai o JSONB das respostas[cite: 1]
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar avaliação:', error.message);
    return null;
  }

  return {
    dataAvaliacao: data.evaluation_date,
    respostas: data.responses as unknown as AvaliacaoPortage,
    notas: data.notes
  };
}