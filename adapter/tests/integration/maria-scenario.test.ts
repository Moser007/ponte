import { describe, it, expect, beforeEach } from 'vitest';
import { MockDataSource } from '../../src/datasource/mock-datasource.js';
import { RndsAuthStub } from '../../src/rnds/auth.js';
import { RndsClientStub } from '../../src/rnds/client.js';
import { processar, resetUuidCounter } from '../../src/index.js';
import type { Bundle, Patient, Condition, AllergyIntolerance, Observation, MedicationStatement, Composition, Encounter } from '@medplum/fhirtypes';

describe('Maria scenario — end-to-end', () => {
  let result: Awaited<ReturnType<typeof processar>>;
  let bundle: Bundle;

  beforeEach(async () => {
    resetUuidCounter();
    const dataSource = new MockDataSource();
    const auth = new RndsAuthStub();
    const rndsClient = new RndsClientStub(auth);
    result = await processar('12345678901', dataSource, rndsClient);
    bundle = result.bundle;
  });

  // --- Bundle structure ---

  it('should produce a valid Bundle', () => {
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should be a document Bundle', () => {
    expect(bundle.type).toBe('document');
  });

  it('should have Composition as first entry', () => {
    expect(bundle.entry?.[0]?.resource?.resourceType).toBe('Composition');
  });

  it('should have correct number of entries', () => {
    // Composition + Patient + Practitioner + Organization + Encounter
    // + 2 Conditions + 1 Allergy + 3 VitalSigns + 2 Medications = 13
    expect(bundle.entry).toHaveLength(13);
  });

  it('should have timestamp', () => {
    expect(bundle.timestamp).toBeDefined();
  });

  // --- Composition (RAC) ---

  it('should have RAC type in Composition', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.type?.coding?.[0]?.code).toBe('RAC');
  });

  it('should have diagnosticosAvaliados section with 2 conditions', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const diagSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diagSection?.entry).toHaveLength(2);
  });

  it('should have sinaisVitais section with 3 observations', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const vsSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '8716-3')
    );
    expect(vsSection?.entry).toHaveLength(3);
  });

  it('should have alergias section with 1 allergy', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const allergySection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '48765-2')
    );
    expect(allergySection?.entry).toHaveLength(1);
  });

  it('should have medicamentos section with 2 medications', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const medSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '52471-0')
    );
    expect(medSection?.entry).toHaveLength(2);
  });

  // --- Patient ---

  it('should have Patient with CPF 12345678901', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const cpf = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cpf'
    );
    expect(cpf?.value).toBe('12345678901');
  });

  it('should have Patient with raça/cor extension', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const raca = patient.extension?.find((ext) => ext.url?.includes('BRRacaCorEtnia'));
    expect(raca).toBeDefined();
    expect(raca?.valueCodeableConcept?.coding?.[0]?.code).toBe('03'); // parda
  });

  it('should have Patient with gender female', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    expect(patient.gender).toBe('female');
  });

  // --- Conditions ---

  it('should have diabetes gestacional O24.4', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    const diabetes = conditions?.find(
      (c) => c.code?.coding?.[0]?.code === 'O24.4'
    );
    expect(diabetes).toBeDefined();
    expect(diabetes?.clinicalStatus?.coding?.[0]?.code).toBe('active');
  });

  it('should have hipertensão gestacional O13', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    const hipertensao = conditions?.find(
      (c) => c.code?.coding?.[0]?.code === 'O13'
    );
    expect(hipertensao).toBeDefined();
  });

  // --- Allergy ---

  it('should have penicillin allergy with severity severe', () => {
    const allergy = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'AllergyIntolerance'
    )?.resource as AllergyIntolerance;
    expect(allergy.code?.text).toBe('Penicilina');
    expect(allergy.criticality).toBe('high');
    expect(allergy.reaction?.[0]?.severity).toBe('severe');
  });

  // --- Vital Signs ---

  it('should have systolic BP 130 mmHg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const systolic = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8480-6'
    );
    expect(systolic?.valueQuantity?.value).toBe(130);
    expect(systolic?.valueQuantity?.code).toBe('mm[Hg]');
  });

  it('should have diastolic BP 85 mmHg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const diastolic = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8462-4'
    );
    expect(diastolic?.valueQuantity?.value).toBe(85);
  });

  it('should have weight 78 kg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const weight = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '29463-7'
    );
    expect(weight?.valueQuantity?.value).toBe(78);
    expect(weight?.valueQuantity?.code).toBe('kg');
  });

  // --- Medications ---

  it('should have Insulina NPH medication', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const insulina = medications?.find(
      (m) => m.medicationCodeableConcept?.text === 'Insulina NPH'
    );
    expect(insulina).toBeDefined();
    expect(insulina?.status).toBe('active');
  });

  it('should have Metildopa medication', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const metildopa = medications?.find((m) =>
      m.medicationCodeableConcept?.text?.includes('Metildopa')
    );
    expect(metildopa).toBeDefined();
  });

  // --- Encounter ---

  it('should have finished Encounter', () => {
    const encounter = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as Encounter;
    expect(encounter.status).toBe('finished');
    expect(encounter.class?.code).toBe('AMB');
  });

  // --- References ---

  it('should have all urn:uuid references resolving', () => {
    const fullUrls = new Set(bundle.entry?.map((e) => e.fullUrl));
    for (const entry of bundle.entry ?? []) {
      const json = JSON.stringify(entry.resource);
      const refs = [...json.matchAll(/"reference":"(urn:uuid:[^"]+)"/g)];
      for (const [, ref] of refs) {
        expect(fullUrls.has(ref), `Reference ${ref} should resolve`).toBe(true);
      }
    }
  });

  // --- RNDS Submission ---

  it('should successfully submit to RNDS (stub)', () => {
    expect(result.envio?.success).toBe(true);
    expect(result.envio?.status).toBe(201);
  });

  // --- Error handling ---

  it('should throw for unknown CPF', async () => {
    const ds = new MockDataSource();
    await expect(processar('00000000000', ds)).rejects.toThrow('não encontrado');
  });
});
