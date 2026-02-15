import { readFileSync } from 'node:fs';
import type { RndsConfig } from './config.js';
import { getAuthEndpoint } from './config.js';
import type { HttpTransport } from './http-transport.js';
import { NodeHttpTransport } from './http-transport.js';

/**
 * Interface de autenticação RNDS.
 *
 * Fluxo real:
 * 1. Carregar certificado digital ICP-Brasil (.pfx)
 * 2. GET /api/token com mTLS (certificado autentica o requisitante)
 * 3. Receber JWT { access_token, scope, token_type, expires_in }
 * 4. Token dura 30 minutos, renovar a cada 25min
 */
export interface RndsAuth {
  getToken(): Promise<string>;
}

/**
 * Stub para desenvolvimento/testes sem certificado real.
 */
export class RndsAuthStub implements RndsAuth {
  async getToken(): Promise<string> {
    return 'stub-jwt-token-for-development-only';
  }
}

interface TokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

/**
 * Implementação real de autenticação com a RNDS via mTLS.
 *
 * Usa certificado ICP-Brasil (.pfx) para mTLS.
 * Cache do token JWT com renovação automática (margem de 5 min).
 */
export class RndsAuthReal implements RndsAuth {
  private cachedToken: CachedToken | null = null;
  private pfxBuffer: Buffer | null = null;
  private readonly renewMarginMs = 5 * 60 * 1000; // 5 minutos antes de expirar

  constructor(
    private config: RndsConfig,
    private transport: HttpTransport = new NodeHttpTransport()
  ) {}

  async getToken(): Promise<string> {
    // Retornar token cacheado se ainda válido
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.token;
    }

    // Carregar certificado PFX (lazy load)
    if (!this.pfxBuffer) {
      this.pfxBuffer = readFileSync(this.config.pfxPath);
    }

    const authUrl = `${getAuthEndpoint(this.config)}/api/token`;

    const response = await this.transport.request({
      method: 'GET',
      url: authUrl,
      pfx: this.pfxBuffer,
      passphrase: this.config.pfxPassphrase,
    });

    if (response.status !== 200) {
      throw new Error(
        `Falha na autenticação RNDS: HTTP ${response.status} — ${response.body}`
      );
    }

    const tokenData: TokenResponse = JSON.parse(response.body);

    if (!tokenData.access_token) {
      throw new Error('Resposta de autenticação RNDS sem access_token');
    }

    // Cache com margem de segurança
    const expiresInMs = tokenData.expires_in * 1000;
    this.cachedToken = {
      token: tokenData.access_token,
      expiresAt: Date.now() + expiresInMs - this.renewMarginMs,
    };

    return tokenData.access_token;
  }

  /** Invalida o cache do token (força renovação na próxima chamada). */
  invalidateToken(): void {
    this.cachedToken = null;
  }
}
