/**
 * Interfaces TypeScript representando as tabelas do IPM Atende.Net.
 * Campos em português refletem a estrutura real do banco PostgreSQL.
 * Campos opcionais adicionados baseados no modelo LEDI do e-SUS (R009).
 */

export interface IpmPaciente {
  id: number;
  nome: string;
  nome_social?: string;       // LEDI: obrigatório por lei para travestis/transexuais
  cpf: string;
  cns?: string;
  data_nascimento: string;    // YYYY-MM-DD
  sexo: 'M' | 'F';
  raca_cor: 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena';
  tipo_sanguineo?: string;
  telefone?: string;
  endereco?: string;
  municipio_ibge?: string;
  // Campos obstétricos (LEDI FCI)
  gestante?: boolean;
  dum?: string;               // LEDI: Data da Última Menstruação (YYYY-MM-DD) — crítico para IG
  gestas_previas?: number;    // LEDI: número de gestações anteriores
  partos?: number;            // LEDI: número de partos
  maternidade_referencia?: string; // LEDI: nome/CNES da maternidade de referência
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
  cid: string;                // CID-10 ou CIAP-2
  ciap?: string;              // LEDI: CIAP-2 (pode coexistir com CID-10)
  descricao: string;
  data_inicio?: string;
  ativo: boolean;
}

export interface IpmAlergia {
  id: number;
  paciente_id: number;
  substancia: string;
  codigo?: string;              // Código BRMedicamento, BRImunobiologico ou BRAlergenosCBARA
  gravidade: 'low' | 'high' | 'unable-to-assess';
  reacao?: string;
}

export interface IpmMedicamento {
  id: number;
  paciente_id: number;
  atendimento_id?: number;
  nome: string;
  codigo_catmat?: string;     // LEDI: código CATMAT (medicamento SUS)
  dosagem?: string;
  posologia?: string;
  via_administracao?: string; // LEDI: oral, subcutânea, etc.
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
  peso?: number;              // kg
  altura?: number;            // cm
  temperatura?: number;       // Celsius
  freq_cardiaca?: number;
  freq_respiratoria?: number;
  saturacao_o2?: number;
  glicemia_capilar?: number;  // LEDI: mg/dL — relevante para diabetes gestacional
  semanas_gestacionais?: number;
  data_medicao: string;       // ISO datetime
}

export interface IpmEncaminhamento {
  id: number;
  atendimento_id: number;
  paciente_id: number;
  especialidade: string;
  classificacao_risco?: 'verde' | 'amarelo' | 'vermelho';  // LEDI
  hipotese_diagnostica?: string;   // CID-10
  motivo?: string;
  data_encaminhamento: string;
}

export interface IpmExame {
  id: number;
  atendimento_id: number;
  paciente_id: number;
  codigo?: string;              // LEDI: código SIGTAP ou LOINC
  descricao: string;
  resultado?: string;
  valor_numerico?: number;
  unidade?: string;
  data_solicitacao: string;
  data_resultado?: string;
}
