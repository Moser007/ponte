import type { Bundle, Patient, Composition } from '@medplum/fhirtypes';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validação local dos recursos gerados antes do envio à RNDS.
 * Verifica regras BR Core obrigatórias.
 */
export function validateBundle(bundle: Bundle): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Bundle deve ser type=document
  if (bundle.type !== 'document') {
    errors.push(`Bundle.type deve ser "document", recebido: "${bundle.type}"`);
  }

  // 2. Deve ter entries
  if (!bundle.entry?.length) {
    errors.push('Bundle deve conter pelo menos uma entry');
    return { valid: false, errors, warnings };
  }

  // 3. Primeira entry deve ser Composition
  const firstResource = bundle.entry[0]?.resource;
  if (firstResource?.resourceType !== 'Composition') {
    errors.push(
      `Primeira entry deve ser Composition, recebido: "${firstResource?.resourceType}"`
    );
  }

  // 4. Coletar todos os fullUrls para validação de referências
  const fullUrls = new Set<string>();
  for (const entry of bundle.entry) {
    if (entry.fullUrl) {
      fullUrls.add(entry.fullUrl);
    }
  }

  // 5. Validar Composition (RAC)
  if (firstResource?.resourceType === 'Composition') {
    const comp = firstResource as Composition;
    validateComposition(comp, fullUrls, errors, warnings);
  }

  // 6. Validar Patient (BR Core: CPF e raça obrigatórios)
  for (const entry of bundle.entry) {
    const resource = entry.resource;
    if (resource?.resourceType === 'Patient') {
      validatePatient(resource as Patient, errors, warnings);
    }
  }

  // 7. Validar referências internas (todas urn:uuid devem resolver)
  validateInternalReferences(bundle, fullUrls, errors);

  return { valid: errors.length === 0, errors, warnings };
}

function validateComposition(
  comp: Composition,
  fullUrls: Set<string>,
  errors: string[],
  warnings: string[]
): void {
  if (!comp.subject?.reference) {
    errors.push('Composition.subject é obrigatório');
  }
  if (!comp.encounter?.reference) {
    errors.push('Composition.encounter é obrigatório');
  }
  if (!comp.date) {
    errors.push('Composition.date é obrigatório');
  }
  if (!comp.author?.length) {
    errors.push('Composition.author é obrigatório');
  }

  // Seção diagnosticosAvaliados é obrigatória
  const diagSection = comp.section?.find((s) =>
    s.code?.coding?.some((c) => c.code === '57852-6')
  );
  if (!diagSection) {
    errors.push('Seção diagnosticosAvaliados (LOINC 57852-6) é obrigatória no RAC');
  } else if (!diagSection.entry?.length) {
    errors.push('Seção diagnosticosAvaliados deve conter pelo menos uma entry');
  }

  // Validar que referências da Composition resolvem
  if (comp.subject?.reference && !fullUrls.has(comp.subject.reference)) {
    warnings.push(`Composition.subject referencia "${comp.subject.reference}" não encontrada no Bundle`);
  }
}

/**
 * Valida CPF com dígitos verificadores (algoritmo Receita Federal).
 */
export function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  // Rejeitar sequências repetidas (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  // Primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

function validatePatient(patient: Patient, errors: string[], warnings: string[]): void {
  // CPF é obrigatório
  const cpfIdentifier = patient.identifier?.find(
    (id) => id.system === 'https://saude.gov.br/fhir/sid/cpf' && id.value
  );
  if (!cpfIdentifier) {
    errors.push('Patient deve ter CPF (system: https://saude.gov.br/fhir/sid/cpf)');
  } else if (!isValidCpf(cpfIdentifier.value!)) {
    warnings.push(`CPF "${cpfIdentifier.value}" tem dígitos verificadores inválidos`);
  }

  // Raça/cor é obrigatória
  const hasRaca = patient.extension?.some((ext) =>
    ext.url?.includes('BRRacaCorEtnia')
  );
  if (!hasRaca) {
    errors.push('Patient deve ter extensão raça/cor (BRRacaCorEtnia)');
  }

  // Gender é obrigatório
  if (!patient.gender) {
    errors.push('Patient.gender é obrigatório');
  }
}

function validateInternalReferences(
  bundle: Bundle,
  fullUrls: Set<string>,
  errors: string[]
): void {
  for (const entry of bundle.entry ?? []) {
    const resource = entry.resource;
    if (!resource) continue;

    const refs = extractReferences(resource);
    for (const ref of refs) {
      if (ref.startsWith('urn:uuid:') && !fullUrls.has(ref)) {
        errors.push(
          `Referência "${ref}" em ${resource.resourceType}/${resource.id} não resolve para nenhuma entry no Bundle`
        );
      }
    }
  }
}

function extractReferences(obj: unknown, refs: string[] = []): string[] {
  if (obj == null || typeof obj !== 'object') return refs;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractReferences(item, refs);
    }
    return refs;
  }

  const record = obj as Record<string, unknown>;
  if (typeof record['reference'] === 'string') {
    refs.push(record['reference']);
  }

  for (const value of Object.values(record)) {
    if (typeof value === 'object' && value != null) {
      extractReferences(value, refs);
    }
  }

  return refs;
}
