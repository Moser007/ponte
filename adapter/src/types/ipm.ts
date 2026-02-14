/**
 * Interfaces TypeScript representando as tabelas do IPM Atende.Net.
 * Campos em português refletem a estrutura real do banco PostgreSQL.
 */

export interface IpmPaciente {
  id: number;
  nome: string;
  cpf: string;
  cns?: string;
  data_nascimento: string; // YYYY-MM-DD
  sexo: 'M' | 'F';
  raca_cor: 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena';
  tipo_sanguineo?: string;
  telefone?: string;
  endereco?: string;
  municipio_ibge?: string;
}

export interface IpmProfissional {
  id: number;
  nome: string;
  cns: string;
  cbo: string; // Classificação Brasileira de Ocupações
  cbo_descricao?: string;
}

export interface IpmEstabelecimento {
  id: number;
  nome: string;
  cnes: string; // Cadastro Nacional de Estabelecimentos de Saúde
  tipo: string;
  municipio_ibge?: string;
}

export interface IpmAtendimento {
  id: number;
  paciente_id: number;
  profissional_id: number;
  estabelecimento_id: number;
  data_inicio: string; // ISO datetime
  data_fim?: string;
  tipo: string; // prenatal, consulta, urgencia, etc.
  observacoes?: string;
}

export interface IpmProblema {
  id: number;
  atendimento_id: number;
  paciente_id: number;
  cid: string; // CID-10
  descricao: string;
  data_inicio?: string;
  ativo: boolean;
}

export interface IpmAlergia {
  id: number;
  paciente_id: number;
  substancia: string;
  gravidade: 'low' | 'high' | 'unable-to-assess';
  reacao?: string;
}

export interface IpmMedicamento {
  id: number;
  paciente_id: number;
  atendimento_id?: number;
  nome: string;
  dosagem?: string;
  posologia?: string;
  data_inicio?: string;
  data_fim?: string;
  ativo: boolean;
}

export interface IpmSinalVital {
  id: number;
  atendimento_id: number;
  paciente_id: number;
  pa_sistolica?: number;
  pa_diastolica?: number;
  peso?: number;         // kg
  altura?: number;       // cm
  temperatura?: number;  // Celsius
  freq_cardiaca?: number;
  freq_respiratoria?: number;
  saturacao_o2?: number;
  semanas_gestacionais?: number;
  data_medicao: string;  // ISO datetime
}
