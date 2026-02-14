import type { Observation } from '@medplum/fhirtypes';
import type { IpmSinalVital } from '../types/ipm.js';

interface VitalSignDef {
  loincCode: string;
  display: string;
  value: number;
  unit: string;
  ucumCode: string;
}

/**
 * Constrói recursos BRCoreVitalSigns a partir de dados do IPM.
 * Retorna um array — cada sinal vital gera um Observation separado.
 */
export function buildVitalSigns(
  ipm: IpmSinalVital,
  uuids: string[],
  patientRef: string
): Observation[] {
  const vitals: VitalSignDef[] = [];

  if (ipm.pa_sistolica != null) {
    vitals.push({
      loincCode: '8480-6',
      display: 'Systolic blood pressure',
      value: ipm.pa_sistolica,
      unit: 'mmHg',
      ucumCode: 'mm[Hg]',
    });
  }

  if (ipm.pa_diastolica != null) {
    vitals.push({
      loincCode: '8462-4',
      display: 'Diastolic blood pressure',
      value: ipm.pa_diastolica,
      unit: 'mmHg',
      ucumCode: 'mm[Hg]',
    });
  }

  if (ipm.peso != null) {
    vitals.push({
      loincCode: '29463-7',
      display: 'Body weight',
      value: ipm.peso,
      unit: 'kg',
      ucumCode: 'kg',
    });
  }

  if (ipm.altura != null) {
    vitals.push({
      loincCode: '8302-2',
      display: 'Body height',
      value: ipm.altura,
      unit: 'cm',
      ucumCode: 'cm',
    });
  }

  if (ipm.temperatura != null) {
    vitals.push({
      loincCode: '8310-5',
      display: 'Body temperature',
      value: ipm.temperatura,
      unit: '°C',
      ucumCode: 'Cel',
    });
  }

  if (ipm.freq_cardiaca != null) {
    vitals.push({
      loincCode: '8867-4',
      display: 'Heart rate',
      value: ipm.freq_cardiaca,
      unit: '/min',
      ucumCode: '/min',
    });
  }

  if (ipm.freq_respiratoria != null) {
    vitals.push({
      loincCode: '9279-1',
      display: 'Respiratory rate',
      value: ipm.freq_respiratoria,
      unit: '/min',
      ucumCode: '/min',
    });
  }

  if (ipm.saturacao_o2 != null) {
    vitals.push({
      loincCode: '2708-6',
      display: 'Oxygen saturation',
      value: ipm.saturacao_o2,
      unit: '%',
      ucumCode: '%',
    });
  }

  return vitals.map((v, i): Observation => ({
    resourceType: 'Observation',
    id: uuids[i],
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-vitalsigns'],
    },
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: v.loincCode,
          display: v.display,
        },
      ],
    },
    subject: {
      reference: patientRef,
    },
    effectiveDateTime: ipm.data_medicao,
    issued: ipm.data_medicao,
    valueQuantity: {
      value: v.value,
      unit: v.unit,
      system: 'http://unitsofmeasure.org',
      code: v.ucumCode,
    },
  }));
}
