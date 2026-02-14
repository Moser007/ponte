import { describe, it, expect } from 'vitest';
import { assembleRacBundle } from '../../src/bundle/rac-assembler.js';
import type { Resource } from '@medplum/fhirtypes';

const composition: Resource = {
  resourceType: 'Composition',
  id: 'comp-1',
};

const patient: Resource = {
  resourceType: 'Patient',
  id: 'patient-1',
};

const condition: Resource = {
  resourceType: 'Condition',
  id: 'cond-1',
};

describe('assembleRacBundle', () => {
  const bundle = assembleRacBundle(
    composition,
    [patient, condition],
    '2025-11-20T12:00:00Z'
  );

  it('should return resourceType Bundle', () => {
    expect(bundle.resourceType).toBe('Bundle');
  });

  it('should set type to document', () => {
    expect(bundle.type).toBe('document');
  });

  it('should set timestamp', () => {
    expect(bundle.timestamp).toBe('2025-11-20T12:00:00Z');
  });

  it('should have Composition as first entry', () => {
    expect(bundle.entry?.[0]?.resource?.resourceType).toBe('Composition');
  });

  it('should have 3 entries total', () => {
    expect(bundle.entry).toHaveLength(3);
  });

  it('should set fullUrl with urn:uuid prefix', () => {
    expect(bundle.entry?.[0]?.fullUrl).toBe('urn:uuid:comp-1');
    expect(bundle.entry?.[1]?.fullUrl).toBe('urn:uuid:patient-1');
    expect(bundle.entry?.[2]?.fullUrl).toBe('urn:uuid:cond-1');
  });

  it('should include all resources', () => {
    const types = bundle.entry?.map((e) => e.resource?.resourceType);
    expect(types).toEqual(['Composition', 'Patient', 'Condition']);
  });
});
