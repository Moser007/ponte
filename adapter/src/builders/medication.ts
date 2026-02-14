import type { MedicationStatement } from '@medplum/fhirtypes';
import type { IpmMedicamento } from '../types/ipm.js';

/**
 * Constrói recurso BRCoreMedicationStatement a partir de dados do IPM.
 */
export function buildMedicationStatement(
  ipm: IpmMedicamento,
  uuid: string,
  patientRef: string
): MedicationStatement {
  return {
    resourceType: 'MedicationStatement',
    id: uuid,
    meta: {
      profile: [
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-medicationstatement',
      ],
    },
    status: ipm.ativo ? 'active' : 'completed',
    medicationCodeableConcept: {
      text: ipm.nome,
    },
    subject: {
      reference: patientRef,
    },
    effectivePeriod: {
      start: ipm.data_inicio,
      end: ipm.data_fim,
    },
    dosage: ipm.dosagem || ipm.posologia
      ? [
          {
            text: [ipm.dosagem, ipm.posologia].filter(Boolean).join(' — '),
          },
        ]
      : undefined,
  };
}
