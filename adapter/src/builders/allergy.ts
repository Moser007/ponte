import type { AllergyIntolerance } from '@medplum/fhirtypes';
import type { IpmAlergia } from '../types/ipm.js';

const MANIFESTACAO_SNOMED: Record<string, string> = {
  'Anafilaxia': '39579001',
  'Urticária': '126485001',
  'Urticaria': '126485001',
  'Edema': '267038008',
  'Rash': '271807003',
  'Broncoespasmo': '4386001',
};

/**
 * Constrói recurso BRCoreAllergyIntolerance a partir de dados do IPM.
 */
export function buildAllergyIntolerance(
  ipm: IpmAlergia,
  uuid: string,
  patientRef: string
): AllergyIntolerance {
  const severity = ipm.gravidade === 'high' ? 'severe' : ipm.gravidade === 'low' ? 'mild' : 'moderate';

  return {
    resourceType: 'AllergyIntolerance',
    id: uuid,
    meta: {
      profile: [
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-allergyintolerance',
      ],
    },
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
          code: 'active',
          display: 'Active',
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
          code: 'confirmed',
          display: 'Confirmed',
        },
      ],
    },
    type: 'allergy',
    criticality: ipm.gravidade === 'high' ? 'high' : 'low',
    code: {
      coding: [
        {
          system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento',
          code: ipm.codigo ?? ipm.substancia,
          display: ipm.substancia,
        },
      ],
      text: ipm.substancia,
    },
    patient: {
      reference: patientRef,
    },
    reaction: ipm.reacao
      ? [
          {
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: MANIFESTACAO_SNOMED[ipm.reacao!] ?? undefined,
                    display: ipm.reacao,
                  },
                ],
                text: ipm.reacao,
              },
            ],
            severity,
          },
        ]
      : undefined,
  };
}
