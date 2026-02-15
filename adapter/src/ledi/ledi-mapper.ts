/**
 * Mapeamento LEDI/Thrift → tipos IPM do Ponte.
 *
 * Converte structs deserializadas do formato LEDI (FAI, FCI)
 * para as interfaces IpmPaciente, IpmAtendimento, IpmProblema, etc.
 * que alimentam o pipeline de builders FHIR.
 */

import type {
  FichaAtendimentoIndividualMasterThrift,
  FichaAtendimentoIndividualChildThrift,
  CadastroIndividualThrift,
  MedicoesThrift,
  ProblemaCondicaoThrift,
  MedicamentoThrift,
} from '../types/ledi.js';
import {
  TIPO_ATENDIMENTO,
  VIA_ADMINISTRACAO,
  RACA_COR,
  SEXO_LEDI,
} from '../types/ledi.js';
import type {
  IpmPaciente,
  IpmAtendimento,
  IpmProblema,
  IpmMedicamento,
  IpmSinalVital,
  IpmProfissional,
  IpmEstabelecimento,
} from '../types/ipm.js';

// ── Resultado do mapeamento de uma FAI ─────────────────────────

export interface LediAtendimentoMapeado {
  paciente: Partial<IpmPaciente>;
  atendimento: IpmAtendimento;
  problemas: IpmProblema[];
  medicamentos: IpmMedicamento[];
  sinaisVitais: IpmSinalVital[];
  profissional: Partial<IpmProfissional>;
  estabelecimento: Partial<IpmEstabelecimento>;
}

// ── Contadores para IDs sintéticos ─────────────────────────────

let nextId = 1;
export function resetIdCounter(start = 1): void {
  nextId = start;
}
function genId(): number {
  return nextId++;
}

// ── Conversão de timestamps ────────────────────────────────────

/** Epoch ms → ISO date string (YYYY-MM-DD) */
export function epochToDate(epochMs: number): string {
  return new Date(epochMs).toISOString().split('T')[0];
}

/** Epoch ms → ISO datetime string */
export function epochToDatetime(epochMs: number): string {
  return new Date(epochMs).toISOString();
}

/** Epoch ms → YYYY-MM (para data_inicio de problemas/medicamentos) */
export function epochToYearMonth(epochMs: number): string {
  const d = new Date(epochMs);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ── Mapear FAI (Ficha de Atendimento Individual) ───────────────

/**
 * Mapeia uma FAI completa (master + children) para tipos IPM.
 * Retorna um array porque uma FAI pode conter até 99 atendimentos.
 */
export function mapFai(
  master: FichaAtendimentoIndividualMasterThrift,
): LediAtendimentoMapeado[] {
  const header = master.headerTransport;
  const cnes = header?.cnes ?? '';
  const cnsProfissional = header?.cnsProfissional ?? '';
  const cboProfissional = header?.cbo ?? '';

  const profissionalId = genId();
  const estabelecimentoId = genId();

  const profissional: Partial<IpmProfissional> = {
    id: profissionalId,
    nome: '', // LEDI não inclui nome do profissional — só CNS e CBO
    cns: cnsProfissional,
    cbo: cboProfissional,
  };

  const estabelecimento: Partial<IpmEstabelecimento> = {
    id: estabelecimentoId,
    nome: '', // LEDI não inclui nome do estabelecimento
    cnes,
    tipo: 'UBS',
    municipio_ibge: '', // preenchido pelo DadoTransporte.codIbge
  };

  return master.atendimentosIndividuais.map((child) =>
    mapFaiChild(child, profissionalId, estabelecimentoId, profissional, estabelecimento),
  );
}

function mapFaiChild(
  child: FichaAtendimentoIndividualChildThrift,
  profissionalId: number,
  estabelecimentoId: number,
  profissional: Partial<IpmProfissional>,
  estabelecimento: Partial<IpmEstabelecimento>,
): LediAtendimentoMapeado {
  const pacienteId = genId();
  const atendimentoId = genId();

  // ── Paciente (parcial — FCI complementa) ───────────────────
  const sexo = SEXO_LEDI[child.sexo];
  const paciente: Partial<IpmPaciente> = {
    id: pacienteId,
    cpf: child.cpfCidadao ?? '',
    cns: child.cnsCidadao,
    data_nascimento: epochToDate(child.dataNascimento),
    sexo: sexo ?? 'F',
    gestante: child.dumDaGestante !== undefined || child.nuGestasPrevias !== undefined,
    dum: child.dumDaGestante ? epochToDate(child.dumDaGestante) : undefined,
    gestas_previas: child.nuGestasPrevias,
    partos: child.nuPartos,
  };

  // ── Atendimento ────────────────────────────────────────────
  const tipoStr = TIPO_ATENDIMENTO[child.tipoAtendimento] ?? 'consulta';
  const atendimento: IpmAtendimento = {
    id: atendimentoId,
    paciente_id: pacienteId,
    profissional_id: profissionalId,
    estabelecimento_id: estabelecimentoId,
    data_inicio: epochToDatetime(child.dataHoraInicialAtendimento),
    data_fim: epochToDatetime(child.dataHoraFinalAtendimento),
    tipo: tipoStr,
  };

  // ── Problemas/Condições ────────────────────────────────────
  const problemas = child.problemasCondicoes.map((p) =>
    mapProblemaCondicao(p, atendimentoId, pacienteId),
  );

  // ── Medicamentos ───────────────────────────────────────────
  const medicamentos = (child.medicamentos ?? []).map((m) =>
    mapMedicamento(m, pacienteId, atendimentoId),
  );

  // ── Sinais Vitais ──────────────────────────────────────────
  const sinaisVitais: IpmSinalVital[] = [];
  if (child.medicoes) {
    sinaisVitais.push(mapMedicoes(child.medicoes, atendimentoId, pacienteId, child.dataHoraInicialAtendimento));
  }
  // Idade gestacional vem do campo direto, não de medições
  if (child.idadeGestacional && sinaisVitais.length > 0) {
    sinaisVitais[0].semanas_gestacionais = child.idadeGestacional;
  } else if (child.idadeGestacional) {
    sinaisVitais.push({
      id: genId(),
      atendimento_id: atendimentoId,
      paciente_id: pacienteId,
      semanas_gestacionais: child.idadeGestacional,
      data_medicao: epochToDatetime(child.dataHoraInicialAtendimento),
    });
  }

  return {
    paciente,
    atendimento,
    problemas,
    medicamentos,
    sinaisVitais,
    profissional,
    estabelecimento,
  };
}

// ── Sub-mappers ────────────────────────────────────────────────

function mapProblemaCondicao(
  p: ProblemaCondicaoThrift,
  atendimentoId: number,
  pacienteId: number,
): IpmProblema {
  // LEDI pode ter CIAP-2, CID-10, ou ambos
  const cid = p.cid10 ?? p.ciap ?? '';
  const ciap = p.ciap;
  const descricao = p.cid10
    ? `CID-10 ${p.cid10}${p.ciap ? ` / CIAP-2 ${p.ciap}` : ''}`
    : p.ciap
      ? `CIAP-2 ${p.ciap}`
      : 'Condição não codificada';

  return {
    id: genId(),
    atendimento_id: atendimentoId,
    paciente_id: pacienteId,
    cid,
    ciap,
    descricao,
    data_inicio: p.dataInicioProblema ? epochToYearMonth(p.dataInicioProblema) : undefined,
    ativo: p.situacao !== 2, // 2 = resolvido
  };
}

function mapMedicamento(
  m: MedicamentoThrift,
  pacienteId: number,
  atendimentoId: number,
): IpmMedicamento {
  return {
    id: genId(),
    paciente_id: pacienteId,
    atendimento_id: atendimentoId,
    nome: m.codigoCatmat ?? 'Medicamento sem código',
    codigo_catmat: m.codigoCatmat,
    dosagem: m.dose,
    posologia: m.doseFrequencia,
    via_administracao: m.viaAdministracao ? VIA_ADMINISTRACAO[m.viaAdministracao] : undefined,
    data_inicio: m.dtInicioTratamento ? epochToYearMonth(m.dtInicioTratamento) : undefined,
    ativo: m.usoContinuo ?? true,
  };
}

function mapMedicoes(
  med: MedicoesThrift,
  atendimentoId: number,
  pacienteId: number,
  epochMs: number,
): IpmSinalVital {
  return {
    id: genId(),
    atendimento_id: atendimentoId,
    paciente_id: pacienteId,
    pa_sistolica: med.pressaoArterialSistolica,
    pa_diastolica: med.pressaoArterialDiastolica,
    peso: med.peso,
    altura: med.altura,
    temperatura: med.temperatura,
    freq_cardiaca: med.frequenciaCardiaca,
    freq_respiratoria: med.frequenciaRespiratoria,
    saturacao_o2: med.saturacaoO2,
    glicemia_capilar: med.glicemiaCapilar,
    data_medicao: epochToDatetime(epochMs),
  };
}

// ── Mapear FCI (Cadastro Individual) ───────────────────────────

/**
 * Mapeia um Cadastro Individual para IpmPaciente.
 * O FCI contém dados demográficos completos (nome, CPF, raça, condições).
 */
export function mapFci(fci: CadastroIndividualThrift): Partial<IpmPaciente> {
  const id = fci.identificacaoUsuarioCidadao;
  const cond = fci.condicoesDeSaude;

  const racaNum = id?.racaCorCidadao;
  const raca = racaNum ? RACA_COR[racaNum] : undefined;
  const sexoNum = id?.sexoCidadao;
  const sexo = sexoNum !== undefined ? SEXO_LEDI[sexoNum] : undefined;

  return {
    id: genId(),
    nome: id?.nomeCidadao ?? '',
    nome_social: id?.nomeSocialCidadao,
    cpf: id?.cpfCidadao ?? '',
    cns: id?.cnsCidadao,
    data_nascimento: id?.dataNascimentoCidadao ? epochToDate(id.dataNascimentoCidadao) : '',
    sexo: sexo ?? 'F',
    raca_cor: raca ?? 'parda',
    telefone: id?.telefoneCelular,
    gestante: cond?.isGestante,
    maternidade_referencia: cond?.maternidadeDeReferencia,
  };
}

// ── Merge paciente FCI + FAI ───────────────────────────────────

/**
 * Combina dados de paciente do FCI (nome, CPF, raça) com dados do FAI (obstétricos).
 * FCI tem dados demográficos completos; FAI tem dados clínicos do atendimento.
 */
export function mergePaciente(
  fromFci: Partial<IpmPaciente>,
  fromFai: Partial<IpmPaciente>,
): IpmPaciente {
  return {
    id: fromFci.id ?? fromFai.id ?? genId(),
    nome: fromFci.nome || fromFai.nome || '',
    nome_social: fromFci.nome_social ?? fromFai.nome_social,
    cpf: fromFci.cpf || fromFai.cpf || '',
    cns: fromFci.cns ?? fromFai.cns,
    data_nascimento: fromFci.data_nascimento || fromFai.data_nascimento || '',
    sexo: fromFci.sexo ?? fromFai.sexo ?? 'F',
    raca_cor: fromFci.raca_cor ?? fromFai.raca_cor ?? 'parda',
    telefone: fromFci.telefone,
    municipio_ibge: fromFci.municipio_ibge,
    gestante: fromFci.gestante ?? fromFai.gestante,
    dum: fromFai.dum, // DUM vem do FAI, não do FCI
    gestas_previas: fromFai.gestas_previas,
    partos: fromFai.partos,
    maternidade_referencia: fromFci.maternidade_referencia,
  };
}
