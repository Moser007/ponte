import { describe, it, expect } from 'vitest';
import { buildEncounter } from '../../src/builders/encounter.js';
import type { IpmAtendimento } from '../../src/types/ipm.js';

const atendimento: IpmAtendimento = {
  id: 1,
  paciente_id: 1,
  profissional_id: 1,
  estabelecimento_id: 1,
  data_inicio: '2025-11-20T09:00:00-03:00',
  data_fim: '2025-11-20T09:45:00-03:00',
  tipo: 'prenatal',
  observacoes: 'Glicemia jejum 135mg/dL.',
};

const refs = {
  patientRef: 'urn:uuid:patient-1',
  practitionerRef: 'urn:uuid:practitioner-1',
  organizationRef: 'urn:uuid:org-1',
  conditionRefs: ['urn:uuid:cond-1', 'urn:uuid:cond-2'],
};

describe('buildEncounter', () => {
  const encounter = buildEncounter(atendimento, 'uuid-enc-1', refs);

  it('should return resourceType Encounter', () => {
    expect(encounter.resourceType).toBe('Encounter');
  });

  it('should set BR Core profile', () => {
    expect(encounter.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-encounter'
    );
  });

  it('should set status to finished when data_fim exists', () => {
    expect(encounter.status).toBe('finished');
  });

  it('should set status to in-progress when data_fim is absent', () => {
    const ongoing: IpmAtendimento = { ...atendimento, data_fim: undefined };
    const enc = buildEncounter(ongoing, 'uuid-x', refs);
    expect(enc.status).toBe('in-progress');
  });

  it('should set class to AMB (ambulatory)', () => {
    expect(encounter.class?.code).toBe('AMB');
  });

  it('should reference patient', () => {
    expect(encounter.subject?.reference).toBe('urn:uuid:patient-1');
  });

  it('should reference service provider', () => {
    expect(encounter.serviceProvider?.reference).toBe('urn:uuid:org-1');
  });

  it('should include participant with practitioner', () => {
    expect(encounter.participant?.[0]?.individual?.reference).toBe(
      'urn:uuid:practitioner-1'
    );
  });

  it('should set period', () => {
    expect(encounter.period?.start).toBe('2025-11-20T09:00:00-03:00');
    expect(encounter.period?.end).toBe('2025-11-20T09:45:00-03:00');
  });

  it('should include diagnoses', () => {
    expect(encounter.diagnosis).toHaveLength(2);
  });

  it('should set priority', () => {
    expect(encounter.priority?.coding?.[0]?.code).toBe('01');
  });
});
