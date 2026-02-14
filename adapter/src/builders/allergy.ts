import type { AllergyIntolerance } from '@medplum/fhirtypes';
import type { IpmAlergia } from '../types/ipm.js';

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
          system: 'https://terminologia.saude.gov.br/fhir/ValueSet/BRAlergenos',
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
