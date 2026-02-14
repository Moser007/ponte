import type { Practitioner } from '@medplum/fhirtypes';
import type { IpmProfissional } from '../types/ipm.js';

/**
 * Constrói recurso BRCorePractitioner a partir de dados do IPM.
 */
export function buildPractitioner(ipm: IpmProfissional, uuid: string): Practitioner {
  return {
    resourceType: 'Practitioner',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-practitioner'],
    },
    identifier: [
      {
        system: 'https://saude.gov.br/fhir/sid/cns',
        value: ipm.cns,
      },
    ],
    name: [
      {
        use: 'official',
        text: ipm.nome,
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: 'https://br-core.saude.gov.br/fhir/CodeSystem/BRCBO',
              code: ipm.cbo,
              display: ipm.cbo_descricao,
            },
          ],
        },
      },
    ],
  };
}
