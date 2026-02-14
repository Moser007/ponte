import { describe, it, expect } from 'vitest';
import { buildComposition } from '../../src/builders/composition.js';

const refs = {
  patientRef: 'urn:uuid:patient-1',
  encounterRef: 'urn:uuid:encounter-1',
  practitionerRef: 'urn:uuid:practitioner-1',
  organizationRef: 'urn:uuid:org-1',
};

const sections = {
  conditionRefs: ['urn:uuid:cond-1', 'urn:uuid:cond-2'],
  vitalSignRefs: ['urn:uuid:vs-1', 'urn:uuid:vs-2'],
  allergyRefs: ['urn:uuid:allergy-1'],
  medicationRefs: ['urn:uuid:med-1', 'urn:uuid:med-2'],
};

describe('buildComposition', () => {
  const comp = buildComposition('uuid-comp-1', refs, sections, '2025-11-20');

  it('should return resourceType Composition', () => {
    expect(comp.resourceType).toBe('Composition');
  });

  it('should set RAC profile', () => {
    expect(comp.meta?.profile).toContain(
      'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-registroatendimentoclinico'
    );
  });

  it('should set type to RAC', () => {
    expect(comp.type?.coding?.[0]?.code).toBe('RAC');
  });

  it('should set status to final', () => {
    expect(comp.status).toBe('final');
  });

  it('should reference patient as subject', () => {
    expect(comp.subject?.reference).toBe('urn:uuid:patient-1');
  });

  it('should reference encounter', () => {
    expect(comp.encounter?.reference).toBe('urn:uuid:encounter-1');
  });

  it('should reference practitioner as author', () => {
    expect(comp.author?.[0]?.reference).toBe('urn:uuid:practitioner-1');
  });

  it('should reference organization as custodian', () => {
    expect(comp.custodian?.reference).toBe('urn:uuid:org-1');
  });

  it('should have 4 sections', () => {
    expect(comp.section).toHaveLength(4);
  });

  it('should have diagnosticosAvaliados section with LOINC 57852-6', () => {
    const diag = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diag).toBeDefined();
    expect(diag?.entry).toHaveLength(2);
  });

  it('should have sinaisVitais section with LOINC 8716-3', () => {
    const vs = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '8716-3')
    );
    expect(vs).toBeDefined();
    expect(vs?.entry).toHaveLength(2);
  });

  it('should have alergias section with LOINC 48765-2', () => {
    const allergy = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '48765-2')
    );
    expect(allergy).toBeDefined();
    expect(allergy?.entry).toHaveLength(1);
  });

  it('should have medicamentos section with LOINC 52471-0', () => {
    const meds = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '52471-0')
    );
    expect(meds).toBeDefined();
    expect(meds?.entry).toHaveLength(2);
  });

  it('should omit empty optional sections', () => {
    const minimal = buildComposition(
      'uuid-x',
      refs,
      { conditionRefs: ['urn:uuid:c1'] },
      '2025-11-20'
    );
    expect(minimal.section).toHaveLength(1);
  });

  it('should set date', () => {
    expect(comp.date).toBe('2025-11-20');
  });
});
