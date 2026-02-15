/**
 * Tipos TypeScript para o formato LEDI/Thrift do e-SUS APS.
 *
 * Baseado na definição Thrift oficial do laboratório Bridge/UFSC:
 * https://github.com/laboratoriobridge/esusab-integracao
 *
 * O LEDI (Layout e-SUS de Dados e Interface) é o formato padrão
 * para troca de dados entre sistemas de APS e o e-SUS PEC.
 * Arquivos .esus contêm structs Thrift serializadas com TBinaryProtocol.
 */

// ── Envelope de transporte ─────────────────────────────────────

export interface DadoInstalacaoThrift {
  contraChave?: string;
  uuidInstalacao?: string;
  cpfOuCnpj?: string;
  nomeOuRazaoSocial?: string;
  fpiOuCnpj?: string; // UF/Município
  email?: string;
  telefone?: string;
}

export interface VersaoThrift {
  major: number;
  minor: number;
  revision: number;
}

export interface DadoTransporteThrift {
  uuidDadoSerializado: string;
  tipoDadoSerializado: TipoDadoSerializado;
  cnesDadoSerializado: string;
  codIbge: string;
  ineDadoSerializado?: string;
  numLote?: number;
  dadoSerializado: Buffer;
  remetente: DadoInstalacaoThrift;
  originadora: DadoInstalacaoThrift;
  versao: VersaoThrift;
}

/** Tipo de ficha serializada dentro do DadoTransporteThrift */
export enum TipoDadoSerializado {
  CadastroIndividual = 2,
  CadastroDomiciliar = 3,
  AtendimentoIndividual = 4,
  AtendimentoOdontologico = 5,
  AtividadeColetiva = 6,
  Procedimento = 7,
  VisitaDomiciliar = 8,
  AtendimentoDomiciliar = 10,
}

// ── Header de lotação ──────────────────────────────────────────

export interface VariasLotacoesHeaderThrift {
  cbo: string;
  cnes: string;
  codigoIne?: string;
  dataAtendimento: number; // epoch ms
  cnsProfissional: string;
}

// ── Ficha de Atendimento Individual (FAI) — tipo 4 ─────────────

export interface MedicoesThrift {
  pressaoArterialSistolica?: number;
  pressaoArterialDiastolica?: number;
  frequenciaRespiratoria?: number;
  frequenciaCardiaca?: number;
  temperatura?: number;
  saturacaoO2?: number;
  glicemiaCapilar?: number;
  peso?: number;
  altura?: number;
}

export interface ProblemaCondicaoThrift {
  ciap?: string;
  cid10?: string;
  situacao?: number; // 0=latente, 1=ativo, 2=resolvido
  dataInicioProblema?: number; // epoch ms
  isAvaliado?: boolean;
}

export interface MedicamentoThrift {
  codigoCatmat?: string;
  viaAdministracao?: number;
  dose?: string;
  usoContinuo?: boolean;
  doseFrequencia?: string;
  dtInicioTratamento?: number; // epoch ms
  duracaoTratamento?: number;
  quantidadeReceitada?: number;
}

export interface EncaminhamentoExternoThrift {
  especialidade?: number;
  hipoteseDiagnosticoCID10?: string;
  classificacaoRisco?: number;
}

export interface ExameThrift {
  codigoExame?: string;
  solicitadoAvaliado?: number; // 1=solicitado, 2=avaliado
}

export interface ResultadoExameThrift {
  codigoExame?: string;
  resultado?: number;
  valor?: string;
}

export interface FichaAtendimentoIndividualChildThrift {
  numeroProntuario?: string;
  cnsCidadao?: string;
  dataNascimento: number; // epoch ms
  localDeAtendimento: number;
  sexo: number; // 0=M, 1=F, 4=ignorado, 5=indeterminado
  turno: number; // 1=manhã, 2=tarde, 3=noite
  tipoAtendimento: number; // 1=consulta agendada, 2=consulta dia, 4=atend domiciliar, 5=escuta inicial, 6=consulta prenatal
  pesoAoNascer?: number;
  dumDaGestante?: number; // epoch ms
  idadeGestacional?: number; // semanas 1-42
  aleitamentoMaterno?: number;
  stGravidezPlanejada?: boolean;
  nuGestasPrevias?: number;
  nuPartos?: number;
  medicoes?: MedicoesThrift;
  problemasCondicoes: ProblemaCondicaoThrift[];
  exame?: ExameThrift[];
  medicamentos?: MedicamentoThrift[];
  encaminhamentos?: EncaminhamentoExternoThrift[];
  resultadosExames?: ResultadoExameThrift[];
  condutas?: number[];
  dataHoraInicialAtendimento: number; // epoch ms
  dataHoraFinalAtendimento: number; // epoch ms
  cpfCidadao?: string;
}

export interface FichaAtendimentoIndividualMasterThrift {
  headerTransport?: VariasLotacoesHeaderThrift;
  atendimentosIndividuais: FichaAtendimentoIndividualChildThrift[];
  uuidFicha: string;
  tpCdsOrigem?: number; // 3 = sistema terceiro
}

// ── Cadastro Individual (FCI) — tipo 2 ─────────────────────────

export interface CondicoesDeSaudeThrift {
  isGestante?: boolean;
  maternidadeDeReferencia?: string;
  isTabagista?: boolean;
  isAlcoolista?: boolean;
  isEpilepsiaOuConvulsao?: boolean;
  isDeficienteVisual?: boolean;
  isDeficienteAuditivo?: boolean;
  isDeficienteFisico?: boolean;
  isDeficienteMental?: boolean;
  isAcamado?: boolean;
  isDomiciliado?: boolean;
  isHipertenso?: boolean;
  isDiabetico?: boolean;
  isUsuarioSaudeMental?: boolean;
  isUsaOutrasPraticasIntegrativas?: boolean;
  isTeveDoeCardiaca?: boolean;
  isTeveInternacao12Meses?: boolean;
  descricaoCausaInternacao12Meses?: string;
  isTeveAvc?: boolean;
  isTeveDoencaRins?: boolean;
  isTeveMalaria?: boolean;
  isTeveHanseniase?: boolean;
  isTeveTuberculose?: boolean;
  isTemCancer?: boolean;
  stTeveDoencaRespiratoria?: boolean;
  stUsaPlantasMedicinais?: boolean;
}

export interface IdentificacaoUsuarioCidadaoThrift {
  nomeCidadao?: string;
  nomeSocialCidadao?: string;
  dataNascimentoCidadao?: number; // epoch ms
  sexoCidadao?: number; // 0=M, 1=F
  racaCorCidadao?: number; // 1-5
  numNisPisPasep?: string;
  portariaNaturalizacao?: string;
  dtEntradaBrasil?: number;
  cnsCidadao?: string;
  cpfCidadao?: string;
  cnsResponsavelFamiliar?: string;
  nomeMaeCidadao?: string;
  microarea?: string;
  stForaArea?: boolean;
  telefoneCelular?: string;
  emailCidadao?: string;
  nacionalidadeCidadao?: number;
  paisNascimento?: number;
  dtNaturalizacao?: number;
  cpfResponsavelFamiliar?: string;
  statusEhResponsavel?: boolean;
}

export interface CadastroIndividualThrift {
  identificacaoUsuarioCidadao?: IdentificacaoUsuarioCidadaoThrift;
  condicoesDeSaude?: CondicoesDeSaudeThrift;
  uuidFichaOriginadora?: string;
  fichaAtualizada?: boolean;
  tpCdsOrigem?: number;
  uuid?: string;
  headerTransport?: VariasLotacoesHeaderThrift;
}

// ── Códigos de via de administração ────────────────────────────

export const VIA_ADMINISTRACAO: Record<number, string> = {
  1: 'oral',
  2: 'sublingual',
  3: 'tópica',
  4: 'transdérmica',
  5: 'inalatória/nasal',
  6: 'endovenosa',
  7: 'intramuscular',
  8: 'subcutânea',
  9: 'retal',
  10: 'vaginal',
  11: 'ocular',
  12: 'auricular',
  13: 'intranasal',
  14: 'intradérmica',
  15: 'intra-articular',
};

// ── Códigos de classificação de risco (encaminhamento) ─────────

export const CLASSIFICACAO_RISCO: Record<number, 'verde' | 'amarelo' | 'vermelho'> = {
  0: 'verde',
  1: 'amarelo',
  2: 'vermelho',
};

// ── Tipo de atendimento ────────────────────────────────────────

export const TIPO_ATENDIMENTO: Record<number, string> = {
  1: 'consulta',    // Consulta agendada programada/cuidado continuado
  2: 'consulta',    // Consulta no dia / demanda espontânea
  4: 'domiciliar',  // Atendimento domiciliar
  5: 'escuta',      // Escuta inicial / orientação
  6: 'prenatal',    // Consulta pré-natal
};

// ── Raça/cor ───────────────────────────────────────────────────

export const RACA_COR: Record<number, 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena'> = {
  1: 'branca',
  2: 'preta',
  3: 'parda',
  4: 'amarela',
  5: 'indigena',
};

// ── Sexo ───────────────────────────────────────────────────────

export const SEXO_LEDI: Record<number, 'M' | 'F'> = {
  0: 'M',
  1: 'F',
};
