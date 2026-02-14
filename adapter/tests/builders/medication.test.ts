import { describe, it, expect } from 'vitest';
import { buildMedicationStatement } from '../../src/builders/medication.js';
import type { IpmMedicamento } from '../../src/types/ipm.js';

const insulina: IpmMedicamento = {
  id: 1,
  paciente_id: 1,
  nome: 'Insulina NPH',
  codigo_catmat: 'BR0271157U0063',
  dosagem: '10 UI',
  posologia: '2x/dia (café e jantar)',
  data_inicio: '2025-07',
  ativo: true,
};

const metildopa: IpmMedicamento = {
  id: 2,
  paciente_id: 1,
  nome: 'Metildopa 250mg',
  dosagem: '250mg',
  posologia: '3x/dia',
  data_inicio: '2025-09',
  ativo: true,
};

describe('buildMedicationStatement', () => {
  const med = buildMedicationStatement(insulina, 'uuid-med-1', 'urn:uuid:patient-1');

  it('should return resourceType MedicationStatement', () => {
    expect(med.resourceType).toBe('MedicationStatement');
  });

  it('should set BR Core profile', () => {
    expect(med.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-medicationstatement'
    );
  });

  it('should set status to active', () => {
    expect(med.status).toBe('active');
  });

  it('should set status to completed when inactive', () => {
    const completed = buildMedicationStatement(
      { ...insulina, ativo: false },
      'uuid-x',
      'urn:uuid:p'
    );
    expect(completed.status).toBe('completed');
  });

  it('should set medication name', () => {
    expect(med.medicationCodeableConcept?.text).toBe('Insulina NPH');
  });

  it('should set BRMedicamento coding when codigo_catmat present', () => {
    const coding = med.medicationCodeableConcept?.coding?.[0];
    expect(coding?.system).toBe('http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento');
    expect(coding?.code).toBe('BR0271157U0063');
    expect(coding?.display).toBe('Insulina NPH');
  });

  it('should omit coding when no codigo_catmat', () => {
    const semCodigo = buildMedicationStatement(
      { ...insulina, codigo_catmat: undefined },
      'uuid-x',
      'urn:uuid:p'
    );
    expect(semCodigo.medicationCodeableConcept?.coding).toBeUndefined();
    expect(semCodigo.medicationCodeableConcept?.text).toBe('Insulina NPH');
  });

  it('should reference patient', () => {
    expect(med.subject?.reference).toBe('urn:uuid:patient-1');
  });

  it('should include dosage text', () => {
    expect(med.dosage?.[0]?.text).toContain('10 UI');
    expect(med.dosage?.[0]?.text).toContain('2x/dia');
  });

  it('should set effective period', () => {
    expect(med.effectivePeriod?.start).toBe('2025-07');
  });

  it('should handle metildopa correctly', () => {
    const m = buildMedicationStatement(metildopa, 'uuid-med-2', 'urn:uuid:patient-1');
    expect(m.medicationCodeableConcept?.text).toBe('Metildopa 250mg');
    expect(m.dosage?.[0]?.text).toContain('250mg');
    expect(m.dosage?.[0]?.text).toContain('3x/dia');
  });
});
