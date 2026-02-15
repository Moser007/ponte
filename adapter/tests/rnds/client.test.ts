import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RndsClientReal, RndsClientStub } from '../../src/rnds/client.js';
import { RndsAuthStub } from '../../src/rnds/auth.js';
import type { RndsAuth } from '../../src/rnds/auth.js';
import type { RndsConfig } from '../../src/rnds/config.js';
import type { HttpTransport, HttpResponse } from '../../src/rnds/http-transport.js';
import type { Bundle } from '@medplum/fhirtypes';

// Mock readFileSync
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

const validBundle: Bundle = {
  resourceType: 'Bundle',
  type: 'document',
  identifier: {
    system: 'urn:ponte:test',
    value: 'test-bundle-1',
  },
  entry: [
    {
      fullUrl: 'urn:uuid:comp-1',
      resource: {
        resourceType: 'Composition',
        status: 'final',
        type: {
          coding: [{ system: 'http://loinc.org', code: '60591-5' }],
        },
      },
    },
  ],
};

function createMockAuth(token = 'test-jwt-token'): RndsAuth {
  return {
    getToken: vi.fn().mockResolvedValue(token),
  };
}

function createMockTransport(response: HttpResponse): HttpTransport {
  return {
    request: vi.fn().mockResolvedValue(response),
  };
}

describe('RndsClientStub', () => {
  const auth = new RndsAuthStub();

  it('should accept valid Bundle', async () => {
    const client = new RndsClientStub(auth);
    const result = await client.enviarBundle(validBundle, '898001234567840');

    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(result.bundleId).toBeDefined();
  });

  it('should reject non-document Bundle', async () => {
    const client = new RndsClientStub(auth);
    const bundle = { ...validBundle, type: 'collection' as const };
    const result = await client.enviarBundle(bundle, '898001234567840');

    expect(result.success).toBe(false);
    expect(result.status).toBe(422);
  });

  it('should reject empty Bundle', async () => {
    const client = new RndsClientStub(auth);
    const bundle = { ...validBundle, entry: [] };
    const result = await client.enviarBundle(bundle, '898001234567840');

    expect(result.success).toBe(false);
    expect(result.status).toBe(422);
  });
});

describe('RndsClientReal', () => {
  let mockAuth: RndsAuth;
  let mockTransport: HttpTransport;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth = createMockAuth();
  });

  it('should send Bundle to homologacao endpoint', async () => {
    mockTransport = createMockTransport({
      status: 201,
      headers: {
        location: '/api/fhir/r4/Bundle/rnds-123',
        'content-location': 'urn:uuid:456',
      },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    const result = await client.enviarBundle(validBundle, '898001234567840');

    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(result.bundleId).toBe('rnds-123');
    expect(result.location).toBe('/api/fhir/r4/Bundle/rnds-123');
    expect(result.contentLocation).toBe('urn:uuid:456');
  });

  it('should send correct headers', async () => {
    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    await client.enviarBundle(validBundle, '898001234567840');

    expect(mockTransport.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://ehr-services.hmg.saude.gov.br/api/fhir/r4/Bundle',
        headers: expect.objectContaining({
          'Content-Type': 'application/fhir+json',
          'X-Authorization-Server': 'Bearer test-jwt-token',
          'Authorization': '898001234567840',
        }),
        pfx: expect.any(Buffer),
        passphrase: 'senha123',
      })
    );
  });

  it('should inject identifier.system with identificadorRequisitante', async () => {
    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    await client.enviarBundle(validBundle, '898001234567840');

    const sentBody = JSON.parse(
      (mockTransport.request as ReturnType<typeof vi.fn>).mock.calls[0][0].body
    );
    expect(sentBody.identifier.system).toBe(
      'http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-abc123'
    );
  });

  it('should preserve existing identifier.value', async () => {
    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    await client.enviarBundle(validBundle, '898001234567840');

    const sentBody = JSON.parse(
      (mockTransport.request as ReturnType<typeof vi.fn>).mock.calls[0][0].body
    );
    expect(sentBody.identifier.value).toBe('test-bundle-1');
  });

  it('should not modify Bundle if identifier.system already correct', async () => {
    const bundleWithCorrectId: Bundle = {
      ...validBundle,
      identifier: {
        system: 'http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-abc123',
        value: 'my-value',
      },
    };

    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    await client.enviarBundle(bundleWithCorrectId, '898001234567840');

    const sentBody = JSON.parse(
      (mockTransport.request as ReturnType<typeof vi.fn>).mock.calls[0][0].body
    );
    expect(sentBody.identifier.system).toBe(
      'http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-abc123'
    );
    expect(sentBody.identifier.value).toBe('my-value');
  });

  it('should send to producao SC endpoint', async () => {
    const scConfig = { ...config, environment: 'producao' as const, uf: 'SC' };
    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(scConfig, mockAuth, mockTransport);
    await client.enviarBundle(validBundle, '898001234567840');

    expect(mockTransport.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://sc-ehr-services.saude.gov.br/api/fhir/r4/Bundle',
      })
    );
  });

  it('should return error with OperationOutcome on 422', async () => {
    const operationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'processing',
          diagnostics: 'Composition.identifier is required',
        },
      ],
    };

    mockTransport = createMockTransport({
      status: 422,
      headers: {},
      body: JSON.stringify(operationOutcome),
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    const result = await client.enviarBundle(validBundle, '898001234567840');

    expect(result.success).toBe(false);
    expect(result.status).toBe(422);
    expect(result.operationOutcome).toEqual(operationOutcome);
  });

  it('should handle non-JSON error body', async () => {
    mockTransport = createMockTransport({
      status: 500,
      headers: {},
      body: 'Internal Server Error',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    const result = await client.enviarBundle(validBundle, '898001234567840');

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
    expect(result.operationOutcome).toBeUndefined();
  });

  it('should get token from auth before sending', async () => {
    mockTransport = createMockTransport({
      status: 201,
      headers: { location: '/api/fhir/r4/Bundle/x' },
      body: '',
    });

    const client = new RndsClientReal(config, mockAuth, mockTransport);
    await client.enviarBundle(validBundle, '898001234567840');

    expect(mockAuth.getToken).toHaveBeenCalledTimes(1);
  });
});
