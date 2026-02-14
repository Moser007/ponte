import type { Bundle, BundleEntry, Resource } from '@medplum/fhirtypes';

/**
 * Monta Bundle RAC (type=document).
 * Regra: Composition DEVE ser entry[0].
 * Todas as referências internas usam urn:uuid:{id}.
 */
export function assembleRacBundle(
  composition: Resource,
  resources: Resource[],
  timestamp: string
): Bundle {
  const entries: BundleEntry[] = [
    {
      fullUrl: `urn:uuid:${composition.id}`,
      resource: composition,
    },
    ...resources.map((r) => ({
      fullUrl: `urn:uuid:${r.id}`,
      resource: r,
    })),
  ];

  return {
    resourceType: 'Bundle',
    meta: {
      lastUpdated: timestamp,
    },
    identifier: {
      system: 'https://ponte.saude.gov.br/fhir/sid/bundle',
      value: composition.id ?? timestamp,
    },
    type: 'document',
    timestamp,
    entry: entries,
  };
}
