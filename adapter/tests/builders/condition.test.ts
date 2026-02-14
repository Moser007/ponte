import { describe, it, expect } from 'vitest';
import { buildCondition } from '../../src/builders/condition.js';
import type { IpmProblema } from '../../src/types/ipm.js';

const diabetesGestacional: IpmProblema = {
  id: 1,
  atendimento_id: 1,
  paciente_id: 1,
  cid: 'O24.4',
  descricao: 'Diabetes mellitus gestacional',
  data_inicio: '2025-06',
  ativo: true,
};

const hipertensao: IpmProblema = {
  id: 2,
  atendimento_id: 1,
  paciente_id: 1,
  cid: 'O13',
  descricao: 'Hipertensão gestacional',
  data_inicio: '2025-09',
  ativo: true,
};

describe('buildCondition', () => {
  const condition = buildCondition(diabetesGestacional, 'uuid-cond-1', 'urn:uuid:patient-1');

  it('should return resourceType Condition', () => {
    expect(condition.resourceType).toBe('Condition');
  });

  it('should set BR Core profile', () => {
    expect(condition.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-condition'
    );
  });

  it('should set CID-10 code', () => {
    const coding = condition.code?.coding?.[0];
    expect(coding?.system).toBe('http://hl7.org/fhir/sid/icd-10');
    expect(coding?.code).toBe('O24.4');
    expect(coding?.display).toBe('Diabetes mellitus gestacional');
  });

  it('should set clinical status to active', () => {
    expect(condition.clinicalStatus?.coding?.[0]?.code).toBe('active');
  });

  it('should set clinical status to resolved when inactive', () => {
    const resolved = buildCondition(
      { ...diabetesGestacional, ativo: false },
      'uuid-x',
      'urn:uuid:p'
    );
    expect(resolved.clinicalStatus?.coding?.[0]?.code).toBe('resolved');
  });

  it('should set verification status to confirmed', () => {
    expect(condition.verificationStatus?.coding?.[0]?.code).toBe('confirmed');
  });

  it('should set category to encounter-diagnosis', () => {
    expect(condition.category?.[0]?.coding?.[0]?.code).toBe('encounter-diagnosis');
  });

  it('should reference patient', () => {
    expect(condition.subject?.reference).toBe('urn:uuid:patient-1');
  });

  it('should set onset', () => {
    expect(condition.onsetString).toBe('2025-06');
  });

  it('should handle hypertension CID correctly', () => {
    const cond = buildCondition(hipertensao, 'uuid-cond-2', 'urn:uuid:patient-1');
    expect(cond.code?.coding?.[0]?.code).toBe('O13');
  });
});
