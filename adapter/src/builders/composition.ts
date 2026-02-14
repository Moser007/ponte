import type { Composition } from '@medplum/fhirtypes';

export interface RacSectionRefs {
  conditionRefs: string[];
  vitalSignRefs?: string[];
  allergyRefs?: string[];
  medicationRefs?: string[];
}

/**
 * Constrói recurso Composition RAC (Registro de Atendimento Clínico).
 * Seção obrigatória: diagnosticosAvaliados (LOINC 57852-6).
 */
export function buildComposition(
  uuid: string,
  refs: {
    patientRef: string;
    encounterRef: string;
    practitionerRef: string;
    organizationRef: string;
  },
  sections: RacSectionRefs,
  date: string
): Composition {
  const compositionSections: Composition['section'] = [];

  // Seção 1 (obrigatória): Diagnósticos Avaliados
  compositionSections.push({
    title: 'Diagnósticos Avaliados',
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '57852-6',
          display: 'Problem list',
        },
      ],
    },
    entry: sections.conditionRefs.map((ref) => ({ reference: ref })),
  });

  // Seção 2: Sinais Vitais
  if (sections.vitalSignRefs?.length) {
    compositionSections.push({
      title: 'Sinais Vitais',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '8716-3',
            display: 'Vital signs',
          },
        ],
      },
      entry: sections.vitalSignRefs.map((ref) => ({ reference: ref })),
    });
  }

  // Seção 3: Alergias e Intolerancias
  if (sections.allergyRefs?.length) {
    compositionSections.push({
      title: 'Alergias e Intolerancias',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '48765-2',
            display: 'Allergies and adverse reactions',
          },
        ],
      },
      entry: sections.allergyRefs.map((ref) => ({ reference: ref })),
    });
  }

  // Seção 4: Medicamentos
  if (sections.medicationRefs?.length) {
    compositionSections.push({
      title: 'Medicamentos',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '52471-0',
            display: 'Medications',
          },
        ],
      },
      entry: sections.medicationRefs.map((ref) => ({ reference: ref })),
    });
  }

  return {
    resourceType: 'Composition',
    id: uuid,
    meta: {
      profile: [
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-registroatendimentoclinico',
      ],
    },
    status: 'final',
    type: {
      coding: [
        {
          system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRTipoDocumento',
          code: 'RAC',
          display: 'Registro de Atendimento Clínico',
        },
      ],
    },
    subject: { reference: refs.patientRef },
    encounter: { reference: refs.encounterRef },
    date,
    author: [{ reference: refs.practitionerRef }],
    custodian: { reference: refs.organizationRef },
    title: 'Registro de Atendimento Clínico',
    section: compositionSections,
  };
}
