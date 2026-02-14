/**
 * Autenticação RNDS — Stub.
 *
 * Fluxo real (documentado para implementação futura):
 * 1. Carregar certificado digital ICP-Brasil (.pfx / .pem)
 * 2. Configurar https.Agent com mTLS (cert + key + ca)
 * 3. GET https://ehr-auth.saude.gov.br/api/token (homologação)
 *    ou GET https://ehr-auth-hmg.saude.gov.br/api/token (homologação)
 * 4. Receber access_token JWT (validade: 30 minutos)
 * 5. Usar token em header: X-Authorization-Server: Bearer {token}
 * 6. Renovar token a cada 25min (margem de segurança)
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
