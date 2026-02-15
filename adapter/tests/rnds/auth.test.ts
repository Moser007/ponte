import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RndsAuthReal, RndsAuthStub } from '../../src/rnds/auth.js';
import type { RndsConfig } from '../../src/rnds/config.js';
import type { HttpTransport, HttpResponse } from '../../src/rnds/http-transport.js';

// Mock readFileSync to avoid needing a real PFX file
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(() => Buffer.from('fake-pfx-content')),
}));

const config: RndsConfig = {
  environment: 'homologacao',
  pfxPath: '/path/to/cert.pfx',
  pfxPassphrase: 'senha123',
  cnes: '2695251',
  cnsProfissional: '898001234567840',
  identificadorRequisitante: 'abc123',
};

function createMockTransport(response: HttpResponse): HttpTransport {
  return {
    request: vi.fn().mockResolvedValue(response),
  };
}

describe('RndsAuthStub', () => {
  it('should return stub token', async () => {
    const auth = new RndsAuthStub();
    const token = await auth.getToken();
    expect(token).toBe('stub-jwt-token-for-development-only');
  });
});

describe('RndsAuthReal', () => {
  let mockTransport: HttpTransport;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should request token from homologacao endpoint', async () => {
    mockTransport = createMockTransport({
      status: 200,
      headers: {},
      body: JSON.stringify({
        access_token: 'jwt-token-abc',
        scope: 'read write',
        token_type: 'Bearer',
        expires_in: 1800,
      }),
    });

    const auth = new RndsAuthReal(config, mockTransport);
    const token = await auth.getToken();

    expect(token).toBe('jwt-token-abc');
    expect(mockTransport.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://ehr-auth-hmg.saude.gov.br/api/token',
        pfx: expect.any(Buffer),
        passphrase: 'senha123',
      })
    );
  });

  it('should request token from producao endpoint', async () => {
    mockTransport = createMockTransport({
      status: 200,
      headers: {},
      body: JSON.stringify({
        access_token: 'jwt-prod',
        scope: 'read write',
        token_type: 'Bearer',
        expires_in: 1800,
      }),
    });

    const prodConfig = { ...config, environment: 'producao' as const, uf: 'sc' };
    const auth = new RndsAuthReal(prodConfig, mockTransport);
    const token = await auth.getToken();

    expect(token).toBe('jwt-prod');
    expect(mockTransport.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://ehr-auth.saude.gov.br/api/token',
      })
    );
  });

  it('should cache token and reuse it', async () => {
    mockTransport = createMockTransport({
      status: 200,
      headers: {},
      body: JSON.stringify({
        access_token: 'cached-token',
        scope: '',
        token_type: 'Bearer',
        expires_in: 1800,
      }),
    });

    const auth = new RndsAuthReal(config, mockTransport);

    const token1 = await auth.getToken();
    const token2 = await auth.getToken();

    expect(token1).toBe('cached-token');
    expect(token2).toBe('cached-token');
    // Should only call transport once (second call uses cache)
    expect(mockTransport.request).toHaveBeenCalledTimes(1);
  });

  it('should invalidate token and re-fetch', async () => {
    let callCount = 0;
    mockTransport = {
      request: vi.fn().mockImplementation(async () => {
        callCount++;
        return {
          status: 200,
          headers: {},
          body: JSON.stringify({
            access_token: `token-${callCount}`,
            scope: '',
            token_type: 'Bearer',
            expires_in: 1800,
          }),
        };
      }),
    };

    const auth = new RndsAuthReal(config, mockTransport);

    const token1 = await auth.getToken();
    expect(token1).toBe('token-1');

    auth.invalidateToken();

    const token2 = await auth.getToken();
    expect(token2).toBe('token-2');
    expect(mockTransport.request).toHaveBeenCalledTimes(2);
  });

  it('should throw on HTTP error', async () => {
    mockTransport = createMockTransport({
      status: 401,
      headers: {},
      body: 'Unauthorized',
    });

    const auth = new RndsAuthReal(config, mockTransport);
    await expect(auth.getToken()).rejects.toThrow(
      'Falha na autenticação RNDS: HTTP 401'
    );
  });

  it('should throw if response has no access_token', async () => {
    mockTransport = createMockTransport({
      status: 200,
      headers: {},
      body: JSON.stringify({ scope: '', token_type: 'Bearer' }),
    });

    const auth = new RndsAuthReal(config, mockTransport);
    await expect(auth.getToken()).rejects.toThrow(
      'Resposta de autenticação RNDS sem access_token'
    );
  });
});
