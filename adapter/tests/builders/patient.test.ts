import { describe, it, expect } from 'vitest';
import { buildPatient } from '../../src/builders/patient.js';
import type { IpmPaciente } from '../../src/types/ipm.js';

const maria: IpmPaciente = {
  id: 1,
  nome: 'Maria Silva Santos',
  cpf: '12345678901',
  cns: '898001234567893',
  data_nascimento: '1985-03-15',
  sexo: 'F',
  raca_cor: 'parda',
};

describe('buildPatient', () => {
  const patient = buildPatient(maria, 'uuid-patient-1');

  it('should return resourceType Patient', () => {
    expect(patient.resourceType).toBe('Patient');
  });

  it('should set BR Core profile', () => {
    expect(patient.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-patient'
    );
  });

  it('should include CPF identifier', () => {
    const cpf = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cpf'
    );
    expect(cpf).toBeDefined();
    expect(cpf?.value).toBe('12345678901');
  });

  it('should include CNS identifier when available', () => {
    const cns = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cns'
    );
    expect(cns).toBeDefined();
    expect(cns?.value).toBe('898001234567893');
  });

  it('should omit CNS when not provided', () => {
    const semCns: IpmPaciente = { ...maria, cns: undefined };
    const p = buildPatient(semCns, 'uuid-2');
    expect(p.identifier?.length).toBe(1);
  });

  it('should set gender to female', () => {
    expect(patient.gender).toBe('female');
  });

  it('should set male gender for M', () => {
    const homem: IpmPaciente = { ...maria, sexo: 'M' };
    const p = buildPatient(homem, 'uuid-3');
    expect(p.gender).toBe('male');
  });

  it('should set birthDate', () => {
    expect(patient.birthDate).toBe('1985-03-15');
  });

  it('should set name', () => {
    expect(patient.name?.[0]?.text).toBe('Maria Silva Santos');
  });

  it('should include raça/cor extension', () => {
    const raca = patient.extension?.find((ext) =>
      ext.url?.includes('BRRacaCorEtnia')
    );
    expect(raca).toBeDefined();
    expect(raca?.valueCodeableConcept?.coding?.[0]?.code).toBe('03'); // parda
    expect(raca?.valueCodeableConcept?.coding?.[0]?.display).toBe('Parda');
  });

  it('should map all raça/cor codes correctly', () => {
    const racas: Array<{ cor: IpmPaciente['raca_cor']; code: string }> = [
      { cor: 'branca', code: '01' },
      { cor: 'preta', code: '02' },
      { cor: 'parda', code: '03' },
      { cor: 'amarela', code: '04' },
      { cor: 'indigena', code: '05' },
    ];
    for (const { cor, code } of racas) {
      const p = buildPatient({ ...maria, raca_cor: cor }, 'uuid-x');
      const ext = p.extension?.find((e) => e.url?.includes('BRRacaCorEtnia'));
      expect(ext?.valueCodeableConcept?.coding?.[0]?.code).toBe(code);
    }
  });

  it('should set id from uuid parameter', () => {
    expect(patient.id).toBe('uuid-patient-1');
  });

  it('should include nome social when provided', () => {
    const comNomeSocial: IpmPaciente = { ...maria, nome_social: 'Maria Santos' };
    const p = buildPatient(comNomeSocial, 'uuid-ns');
    const usual = p.name?.find((n) => n.use === 'usual');
    expect(usual).toBeDefined();
    expect(usual?.text).toBe('Maria Santos');
  });

  it('should not include nome social when not provided', () => {
    const usual = patient.name?.find((n) => n.use === 'usual');
    expect(usual).toBeUndefined();
  });
});
