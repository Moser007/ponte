/**
 * Configuração de conexão com a RNDS.
 *
 * Ambientes:
 *   - homologacao: ehr-auth-hmg.saude.gov.br / ehr-services.hmg.saude.gov.br
 *   - producao: ehr-auth.saude.gov.br / {uf}-ehr-services.saude.gov.br
 */
export interface RndsConfig {
  /** Ambiente RNDS */
  environment: 'homologacao' | 'producao';
  /** UF do estado (obrigatório para produção, ex: 'sc') */
  uf?: string;
  /** Caminho do certificado digital ICP-Brasil (.pfx) */
  pfxPath: string;
  /** Senha do certificado .pfx */
  pfxPassphrase: string;
  /** CNES do estabelecimento de saúde credenciado */
  cnes: string;
  /** CNS do profissional responsável (15 dígitos) */
  cnsProfissional: string;
  /** Identificador do requisitante (fornecido pelo DATASUS no credenciamento) */
  identificadorRequisitante: string;
}

/** Endpoint de autenticação (obtenção de token JWT via mTLS) */
export function getAuthEndpoint(config: RndsConfig): string {
  return config.environment === 'homologacao'
    ? 'https://ehr-auth-hmg.saude.gov.br'
    : 'https://ehr-auth.saude.gov.br';
}

/** Endpoint EHR (envio de Bundles FHIR R4) */
export function getEhrEndpoint(config: RndsConfig): string {
  if (config.environment === 'homologacao') {
    return 'https://ehr-services.hmg.saude.gov.br';
  }
  if (!config.uf) {
    throw new Error('UF é obrigatória para ambiente de produção');
  }
  return `https://${config.uf.toLowerCase()}-ehr-services.saude.gov.br`;
}
