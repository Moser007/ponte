import { describe, it, expect } from 'vitest';
import { buildAllergyIntolerance } from '../../src/builders/allergy.js';
import type { IpmAlergia } from '../../src/types/ipm.js';

const penicilina: IpmAlergia = {
  id: 1,
  paciente_id: 1,
  substancia: 'Penicilina',
  gravidade: 'high',
  reacao: 'Anafilaxia',
};

describe('buildAllergyIntolerance', () => {
  const allergy = buildAllergyIntolerance(penicilina, 'uuid-allergy-1', 'urn:uuid:patient-1');

  it('should return resourceType AllergyIntolerance', () => {
    expect(allergy.resourceType).toBe('AllergyIntolerance');
  });

  it('should set BR Core profile', () => {
    expect(allergy.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-allergyintolerance'
    );
  });

  it('should set substance in code', () => {
    expect(allergy.code?.text).toBe('Penicilina');
  });

  it('should set type to allergy', () => {
    expect(allergy.type).toBe('allergy');
  });

  it('should set criticality to high', () => {
    expect(allergy.criticality).toBe('high');
  });

  it('should set low criticality for low gravity', () => {
    const low: IpmAlergia = { ...penicilina, gravidade: 'low' };
    const a = buildAllergyIntolerance(low, 'uuid-x', 'urn:uuid:p');
    expect(a.criticality).toBe('low');
  });

  it('should reference patient', () => {
    expect(allergy.patient?.reference).toBe('urn:uuid:patient-1');
  });

  it('should include reaction with manifestation', () => {
    expect(allergy.reaction).toHaveLength(1);
    expect(allergy.reaction?.[0]?.manifestation?.[0]?.text).toBe('Anafilaxia');
  });

  it('should set severity to severe for high gravity', () => {
    expect(allergy.reaction?.[0]?.severity).toBe('severe');
  });

  it('should omit reaction when no reaction info', () => {
    const semReacao: IpmAlergia = { ...penicilina, reacao: undefined };
    const a = buildAllergyIntolerance(semReacao, 'uuid-x', 'urn:uuid:p');
    expect(a.reaction).toBeUndefined();
  });

  it('should set clinical status to active', () => {
    expect(allergy.clinicalStatus?.coding?.[0]?.code).toBe('active');
  });
});
