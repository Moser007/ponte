import type { Bundle } from '@medplum/fhirtypes';
import type { RndsAuth } from './auth.js';

/**
 * Cliente RNDS — Stub.
 *
 * Endpoint real:
 *   POST https://{UF}-ehr-services.saude.gov.br/api/fhir/r4/Bundle
 *
 * Headers obrigatórios:
 *   Content-Type: application/fhir+json
 *   X-Authorization-Server: Bearer {access_token}
 *   Authorization: {CNS do profissional responsável}
 *
 * Resposta de sucesso: HTTP 201 Created
 *   Header Location contém o ID atribuído pela RNDS
 */

export interface RndsSubmitResult {
  success: boolean;
  status: number;
  message: string;
  bundleId?: string;
}

export interface RndsClient {
  enviarBundle(bundle: Bundle, cnsProfissional: string): Promise<RndsSubmitResult>;
}

export class RndsClientStub implements RndsClient {
  constructor(private auth: RndsAuth) {}

  async enviarBundle(bundle: Bundle, _cnsProfissional: string): Promise<RndsSubmitResult> {
    // Validação básica antes do "envio"
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

    // Obter token (stub)
    const _token = await this.auth.getToken();

    // Stub: simula envio bem-sucedido
    const bundleId = `rnds-${Date.now()}`;
    return {
      success: true,
      status: 201,
      message: `Bundle aceito pela RNDS (stub). Location: /api/fhir/r4/Bundle/${bundleId}`,
      bundleId,
    };
  }
}
