/**
 * Autenticação RNDS — Stub.
 *
 * Fluxo real (documentado para implementação futura):
 * 1. Carregar certificado digital ICP-Brasil (.pfx) — formato e-CPF ou e-CNPJ, A1 ou A3
 * 2. Configurar https.Agent com mTLS (pfx + passphrase)
 * 3. GET https://ehr-auth-hmg.saude.gov.br/api/token  (homologação)
 *    GET https://ehr-auth.saude.gov.br/api/token      (produção — centralizado)
 * 4. Receber JSON: { access_token, scope, token_type, expires_in }
 *    - access_token: JWT, validade 30 minutos
 *    - O mTLS substitui credenciais no body (sem client_id/secret)
 * 5. Headers obrigatórios em todas as chamadas EHR:
 *    - X-Authorization-Server: Bearer {access_token}
 *    - Authorization: {CNS do profissional responsável}
 * 6. Renovar token a cada 25min (margem de segurança)
 *
 * Endpoints EHR por estado (produção):
 *   SC: sc-ehr-services.saude.gov.br
 *   Padrão: {uf}-ehr-services.saude.gov.br (todos os 27 estados)
 *   Homologação: ehr-services.hmg.saude.gov.br (único)
 */

export interface RndsAuth {
  getToken(): Promise<string>;
}

export class RndsAuthStub implements RndsAuth {
  async getToken(): Promise<string> {
    // Stub: retorna token fake para desenvolvimento/testes
    return 'stub-jwt-token-for-development-only';
  }
}
