import { describe, it, expect } from 'vitest';
import { getAuthEndpoint, getEhrEndpoint } from '../../src/rnds/config.js';
import type { RndsConfig } from '../../src/rnds/config.js';

const baseConfig: RndsConfig = {
  environment: 'homologacao',
  pfxPath: '/path/to/cert.pfx',
  pfxPassphrase: 'senha123',
  cnes: '2695251',
  cnsProfissional: '898001234567840',
  identificadorRequisitante: 'abc123',
};

describe('getAuthEndpoint', () => {
  it('should return homologacao auth endpoint', () => {
    expect(getAuthEndpoint(baseConfig)).toBe(
      'https://ehr-auth-hmg.saude.gov.br'
    );
  });

  it('should return producao auth endpoint', () => {
    const config = { ...baseConfig, environment: 'producao' as const };
    expect(getAuthEndpoint(config)).toBe('https://ehr-auth.saude.gov.br');
  });
});

describe('getEhrEndpoint', () => {
  it('should return homologacao EHR endpoint', () => {
    expect(getEhrEndpoint(baseConfig)).toBe(
      'https://ehr-services.hmg.saude.gov.br'
    );
  });

  it('should return producao EHR endpoint with UF', () => {
    const config = {
      ...baseConfig,
      environment: 'producao' as const,
      uf: 'SC',
    };
    expect(getEhrEndpoint(config)).toBe(
      'https://sc-ehr-services.saude.gov.br'
    );
  });

  it('should lowercase UF for producao', () => {
    const config = {
      ...baseConfig,
      environment: 'producao' as const,
      uf: 'RJ',
    };
    expect(getEhrEndpoint(config)).toBe(
      'https://rj-ehr-services.saude.gov.br'
    );
  });

  it('should throw if producao without UF', () => {
    const config = { ...baseConfig, environment: 'producao' as const };
    expect(() => getEhrEndpoint(config)).toThrow(
      'UF é obrigatória para ambiente de produção'
    );
  });
});
