import { describe, it, expect } from 'vitest';
import { buildVitalSigns } from '../../src/builders/vital-signs.js';
import type { IpmSinalVital } from '../../src/types/ipm.js';

const sinaisVitais: IpmSinalVital = {
  id: 1,
  atendimento_id: 1,
  paciente_id: 1,
  pa_sistolica: 130,
  pa_diastolica: 85,
  peso: 78,
  data_medicao: '2025-11-20T09:15:00-03:00',
};

describe('buildVitalSigns', () => {
  const uuids = ['uuid-vs-1', 'uuid-vs-2', 'uuid-vs-3'];
  const observations = buildVitalSigns(sinaisVitais, uuids, 'urn:uuid:patient-1');

  it('should return 3 observations for 3 vitals', () => {
    expect(observations).toHaveLength(3);
  });

  it('should return Observation resourceType', () => {
    for (const obs of observations) {
      expect(obs.resourceType).toBe('Observation');
    }
  });

  it('should set BR Core vital signs profile', () => {
    for (const obs of observations) {
      expect(obs.meta?.profile).toContain(
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-vitalsigns'
      );
    }
  });

  it('should set vital-signs category', () => {
    for (const obs of observations) {
      expect(obs.category?.[0]?.coding?.[0]?.code).toBe('vital-signs');
    }
  });

  it('should build systolic BP with LOINC 8480-6', () => {
    const sys = observations.find((o) => o.code?.coding?.[0]?.code === '8480-6');
    expect(sys).toBeDefined();
    expect(sys?.valueQuantity?.value).toBe(130);
    expect(sys?.valueQuantity?.code).toBe('mm[Hg]');
  });

  it('should build diastolic BP with LOINC 8462-4', () => {
    const dia = observations.find((o) => o.code?.coding?.[0]?.code === '8462-4');
    expect(dia).toBeDefined();
    expect(dia?.valueQuantity?.value).toBe(85);
  });

  it('should build weight with LOINC 29463-7', () => {
    const weight = observations.find((o) => o.code?.coding?.[0]?.code === '29463-7');
    expect(weight).toBeDefined();
    expect(weight?.valueQuantity?.value).toBe(78);
    expect(weight?.valueQuantity?.code).toBe('kg');
  });

  it('should reference patient', () => {
    for (const obs of observations) {
      expect(obs.subject?.reference).toBe('urn:uuid:patient-1');
    }
  });

  it('should set effectiveDateTime', () => {
    for (const obs of observations) {
      expect(obs.effectiveDateTime).toBe('2025-11-20T09:15:00-03:00');
    }
  });

  it('should return empty array for no vitals', () => {
    const empty: IpmSinalVital = {
      id: 2,
      atendimento_id: 1,
      paciente_id: 1,
      data_medicao: '2025-11-20T09:15:00-03:00',
    };
    const result = buildVitalSigns(empty, [], 'urn:uuid:p');
    expect(result).toHaveLength(0);
  });

  it('should use UCUM system for units', () => {
    for (const obs of observations) {
      expect(obs.valueQuantity?.system).toBe('http://unitsofmeasure.org');
    }
  });
});
