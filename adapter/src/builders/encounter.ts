import type { Encounter } from '@medplum/fhirtypes';
import type { IpmAtendimento } from '../types/ipm.js';

/**
 * Mapeia tipo IPM → class/type/priority do Encounter.
 */
function mapEncounterType(tipo: string): {
  classCode: string;
  classDisplay: string;
  typeCode: string;
  typeDisplay: string;
  priorityCode: string;
  priorityDisplay: string;
} {
  switch (tipo) {
    case 'urgencia':
      return {
        classCode: 'EMER',
        classDisplay: 'Emergency',
        typeCode: '05',
        typeDisplay: 'Atendimento de urgência',
        priorityCode: '02',
        priorityDisplay: 'Urgência',
      };
    default:
      // consulta, prenatal, retorno, etc. → ambulatorial
      return {
        classCode: 'AMB',
        classDisplay: 'Ambulatory',
        typeCode: '04',
        typeDisplay: 'Consulta',
        priorityCode: '01',
        priorityDisplay: 'Eletivo',
      };
  }
}

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
  const mapping = mapEncounterType(ipm.tipo);

  return {
    resourceType: 'Encounter',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-encounter'],
    },
    status: ipm.data_fim ? 'finished' : 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: mapping.classCode,
      display: mapping.classDisplay,
    },
    type: [
      {
        coding: [
          {
            system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRAtendimentoPrestado',
            code: mapping.typeCode,
            display: mapping.typeDisplay,
          },
        ],
      },
    ],
    priority: {
      coding: [
        {
          system: 'https://br-core.saude.gov.br/fhir/CodeSystem/BRCaraterAtendimento',
          code: mapping.priorityCode,
          display: mapping.priorityDisplay,
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
    diagnosis: refs.conditionRefs.map((ref, index) => ({
      condition: { reference: ref },
      use: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/diagnosis-role',
            code: index === 0 ? 'CC' : 'CM',
            display: index === 0 ? 'Chief complaint' : 'Comorbidity',
          },
        ],
      },
    })),
    serviceProvider: {
      reference: refs.organizationRef,
    },
  };
}
