import { readFileSync } from 'node:fs';
import type { Bundle } from '@medplum/fhirtypes';
import type { RndsAuth } from './auth.js';
import type { RndsConfig } from './config.js';
import { getEhrEndpoint } from './config.js';
import type { HttpTransport } from './http-transport.js';
import { NodeHttpTransport } from './http-transport.js';

/**
 * Resultado do envio de um Bundle à RNDS.
 */
export interface RndsSubmitResult {
  success: boolean;
  status: number;
  message: string;
  /** ID do Bundle na RNDS (extraído do header Location) */
  bundleId?: string;
  /** URL completa do recurso na RNDS (header Location) */
  location?: string;
  /** Header content-location (identificador alternativo) */
  contentLocation?: string;
  /** OperationOutcome da RNDS em caso de erro */
  operationOutcome?: unknown;
}

/**
 * Interface do cliente RNDS.
 */
export interface RndsClient {
  enviarBundle(bundle: Bundle, cnsProfissional: string): Promise<RndsSubmitResult>;
}

/**
 * Stub para desenvolvimento/testes sem credenciais reais.
 */
export class RndsClientStub implements RndsClient {
  constructor(private auth: RndsAuth) {}

  async enviarBundle(bundle: Bundle, _cnsProfissional: string): Promise<RndsSubmitResult> {
    if (bundle.type !== 'document') {
      return {
        success: false,
        status: 422,
        message: 'Bundle.type deve ser "document"',
      };
    }

    if (!bundle.entry?.length) {
      return {
        success: false,
        status: 422,
        message: 'Bundle deve conter pelo menos uma entry',
      };
    }

    const firstEntry = bundle.entry[0]?.resource;
    if (firstEntry?.resourceType !== 'Composition') {
      return {
        success: false,
        status: 422,
        message: 'Primeira entry do Bundle deve ser Composition',
      };
    }

    const _token = await this.auth.getToken();

    const bundleId = `rnds-${Date.now()}`;
    return {
      success: true,
      status: 201,
      message: `Bundle aceito pela RNDS (stub). Location: /api/fhir/r4/Bundle/${bundleId}`,
      bundleId,
    };
  }
}

/**
 * Cliente RNDS real — envia Bundles FHIR R4 via HTTPS com mTLS.
 *
 * Headers obrigatórios:
 *   Content-Type: application/fhir+json
 *   X-Authorization-Server: Bearer {access_token}
 *   Authorization: {CNS do profissional responsável}
 *
 * Resposta de sucesso: HTTP 201 Created
 *   Location: URL do recurso na RNDS
 *   content-location: identificador alternativo
 *
 * Bundle.identifier.system deve ser:
 *   "http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-{identificadorRequisitante}"
 */
export class RndsClientReal implements RndsClient {
  private pfxBuffer: Buffer | null = null;

  constructor(
    private config: RndsConfig,
    private auth: RndsAuth,
    private transport: HttpTransport = new NodeHttpTransport()
  ) {}

  async enviarBundle(bundle: Bundle, cnsProfissional: string): Promise<RndsSubmitResult> {
    // Injetar identifier.system com o identificador requisitante
    const bundleWithIdentifier = this.ensureBundleIdentifier(bundle);

    const token = await this.auth.getToken();

    // Carregar certificado PFX (lazy load)
    if (!this.pfxBuffer) {
      this.pfxBuffer = readFileSync(this.config.pfxPath);
    }

    const ehrUrl = `${getEhrEndpoint(this.config)}/api/fhir/r4/Bundle`;
    const body = JSON.stringify(bundleWithIdentifier);

    const response = await this.transport.request({
      method: 'POST',
      url: ehrUrl,
      headers: {
        'Content-Type': 'application/fhir+json',
        'X-Authorization-Server': `Bearer ${token}`,
        'Authorization': cnsProfissional,
      },
      body,
      pfx: this.pfxBuffer,
      passphrase: this.config.pfxPassphrase,
    });

    // 201 Created = sucesso
    if (response.status === 201) {
      const location = response.headers['location'] ?? '';
      const contentLocation = response.headers['content-location'] ?? '';
      const bundleId = location.split('/').pop() ?? '';

      return {
        success: true,
        status: 201,
        message: 'Bundle aceito pela RNDS',
        bundleId,
        location,
        contentLocation,
      };
    }

    // Erro — tentar parsear OperationOutcome
    let operationOutcome: unknown;
    try {
      operationOutcome = JSON.parse(response.body);
    } catch {
      // Body não é JSON
    }

    return {
      success: false,
      status: response.status,
      message: `RNDS rejeitou o Bundle: HTTP ${response.status}`,
      operationOutcome,
    };
  }

  /**
   * Garante que o Bundle tem identifier.system com o identificador requisitante.
   * Não modifica o Bundle original — retorna cópia se necessário.
   */
  private ensureBundleIdentifier(bundle: Bundle): Bundle {
    const expectedSystem = `http://www.saude.gov.br/fhir/r4/NamingSystem/BRRNDS-${this.config.identificadorRequisitante}`;

    if (bundle.identifier?.system === expectedSystem) {
      return bundle;
    }

    return {
      ...bundle,
      identifier: {
        ...bundle.identifier,
        system: expectedSystem,
      },
    };
  }
}
