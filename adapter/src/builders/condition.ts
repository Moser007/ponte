import type { Condition } from '@medplum/fhirtypes';
import type { IpmProblema } from '../types/ipm.js';

/**
 * Constrói recurso BRCoreCondition a partir de dados do IPM.
 */
export function buildCondition(
  ipm: IpmProblema,
  uuid: string,
  patientRef: string
): Condition {
  return {
    resourceType: 'Condition',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-condition'],
    },
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: ipm.ativo ? 'active' : 'resolved',
          display: ipm.ativo ? 'Active' : 'Resolved',
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
          code: 'confirmed',
          display: 'Confirmed',
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'encounter-diagnosis',
            display: 'Encounter Diagnosis',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10',
          code: ipm.cid,
          display: ipm.descricao,
        },
      ],
      text: ipm.descricao,
    },
    subject: {
      reference: patientRef,
    },
    onsetString: ipm.data_inicio,
  };
}
