import { describe, it, expect } from 'vitest';
import { buildVitalSigns, buildDumObservation, buildObstetricHistory } from '../../src/builders/vital-signs.js';
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

  it('should build glicemia capilar with LOINC 2339-0', () => {
    const withGlicemia: IpmSinalVital = {
      ...sinaisVitais,
      glicemia_capilar: 135,
    };
    const uuids4 = ['uuid-vs-1', 'uuid-vs-2', 'uuid-vs-3', 'uuid-vs-4'];
    const obs = buildVitalSigns(withGlicemia, uuids4, 'urn:uuid:patient-1');
    const glucose = obs.find((o) => o.code?.coding?.[0]?.code === '2339-0');
    expect(glucose).toBeDefined();
    expect(glucose?.valueQuantity?.value).toBe(135);
    expect(glucose?.valueQuantity?.code).toBe('mg/dL');
  });

  it('should build gestational age with LOINC 11884-4', () => {
    const withIG: IpmSinalVital = {
      ...sinaisVitais,
      semanas_gestacionais: 32,
    };
    const uuids4 = ['uuid-vs-1', 'uuid-vs-2', 'uuid-vs-3', 'uuid-vs-4'];
    const obs = buildVitalSigns(withIG, uuids4, 'urn:uuid:patient-1');
    const ga = obs.find((o) => o.code?.coding?.[0]?.code === '11884-4');
    expect(ga).toBeDefined();
    expect(ga?.valueQuantity?.value).toBe(32);
    expect(ga?.valueQuantity?.code).toBe('wk');
  });
});

describe('buildDumObservation', () => {
  const dum = buildDumObservation('2025-04-10', 'uuid-dum-1', 'urn:uuid:patient-1');

  it('should return Observation resourceType', () => {
    expect(dum.resourceType).toBe('Observation');
  });

  it('should set LOINC 8665-2 code', () => {
    expect(dum.code?.coding?.[0]?.code).toBe('8665-2');
    expect(dum.code?.coding?.[0]?.system).toBe('http://loinc.org');
  });

  it('should use valueDateTime (not valueQuantity)', () => {
    expect(dum.valueDateTime).toBe('2025-04-10');
    expect(dum.valueQuantity).toBeUndefined();
  });

  it('should set survey category (not vital-signs)', () => {
    expect(dum.category?.[0]?.coding?.[0]?.code).toBe('survey');
  });

  it('should set br-core-observation profile', () => {
    expect(dum.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-observation'
    );
  });

  it('should reference patient', () => {
    expect(dum.subject?.reference).toBe('urn:uuid:patient-1');
  });

  it('should set id from uuid parameter', () => {
    expect(dum.id).toBe('uuid-dum-1');
  });
});

describe('buildObstetricHistory', () => {
  const obs = buildObstetricHistory(
    { gestas_previas: 3, partos: 2 },
    ['uuid-obs-1', 'uuid-obs-2'],
    'urn:uuid:patient-1'
  );

  it('should return 2 observations for gestas + partos', () => {
    expect(obs).toHaveLength(2);
  });

  it('should build pregnancies count with LOINC 11996-6', () => {
    const gravida = obs.find((o) => o.code?.coding?.[0]?.code === '11996-6');
    expect(gravida).toBeDefined();
    expect(gravida?.valueQuantity?.value).toBe(3);
    expect(gravida?.valueQuantity?.code).toBe('{#}');
  });

  it('should build parity with LOINC 11977-6', () => {
    const parity = obs.find((o) => o.code?.coding?.[0]?.code === '11977-6');
    expect(parity).toBeDefined();
    expect(parity?.valueQuantity?.value).toBe(2);
    expect(parity?.valueQuantity?.code).toBe('{#}');
  });

  it('should set survey category', () => {
    for (const o of obs) {
      expect(o.category?.[0]?.coding?.[0]?.code).toBe('survey');
    }
  });

  it('should set br-core-observation profile', () => {
    for (const o of obs) {
      expect(o.meta?.profile).toContain(
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-observation'
      );
    }
  });

  it('should return only gestas when partos is undefined', () => {
    const partial = buildObstetricHistory(
      { gestas_previas: 1 },
      ['uuid-x'],
      'urn:uuid:p'
    );
    expect(partial).toHaveLength(1);
    expect(partial[0].code?.coding?.[0]?.code).toBe('11996-6');
  });

  it('should return empty array when no obstetric data', () => {
    const empty = buildObstetricHistory({}, [], 'urn:uuid:p');
    expect(empty).toHaveLength(0);
  });
});
