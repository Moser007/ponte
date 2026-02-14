import type { Encounter } from '@medplum/fhirtypes';
import type { IpmAtendimento } from '../types/ipm.js';

/**
 * Constrói recurso BRCoreEncounter a partir de dados do IPM.
 */
export function buildEncounter(
  ipm: IpmAtendimento,
  uuid: string,
  refs: {
    patientRef: string;
    practitionerRef: string;
    organizationRef: string;
    conditionRefs: string[];
  }
): Encounter {
  return {
    resourceType: 'Encounter',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-encounter'],
    },
    status: ipm.data_fim ? 'finished' : 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    priority: {
      coding: [
        {
          system: 'https://br-core.saude.gov.br/fhir/CodeSystem/BRCaraterAtendimento',
          code: '01',
          display: 'Eletivo',
        },
      ],
    },
    subject: {
      reference: refs.patientRef,
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                code: 'ATND',
                display: 'attender',
              },
            ],
          },
        ],
        individual: {
          reference: refs.practitionerRef,
        },
      },
    ],
    period: {
      start: ipm.data_inicio,
      end: ipm.data_fim,
    },
    diagnosis: refs.conditionRefs.map((ref) => ({
      condition: { reference: ref },
      use: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/diagnosis-role',
            code: 'AD',
            display: 'Admission diagnosis',
          },
        ],
      },
    })),
    serviceProvider: {
      reference: refs.organizationRef,
    },
  };
}
