import type { Organization } from '@medplum/fhirtypes';
import type { IpmEstabelecimento } from '../types/ipm.js';

/**
 * Constrói recurso BRCoreOrganization a partir de dados do IPM.
 */
export function buildOrganization(ipm: IpmEstabelecimento, uuid: string): Organization {
  return {
    resourceType: 'Organization',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-organization'],
    },
    identifier: [
      {
        system: 'https://saude.gov.br/fhir/sid/cnes',
        value: ipm.cnes,
      },
    ],
    name: ipm.nome,
    type: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/organization-type',
            code: 'prov',
            display: 'Healthcare Provider',
          },
        ],
        text: ipm.tipo,
      },
    ],
  };
}
