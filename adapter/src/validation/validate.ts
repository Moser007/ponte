import type { Bundle, Patient, Practitioner, Organization, Composition } from '@medplum/fhirtypes';

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
    if (resource?.resourceType === 'Practitioner') {
      validatePractitioner(resource as Practitioner, errors, warnings);
    }
    if (resource?.resourceType === 'Organization') {
      validateOrganization(resource as Organization, errors, warnings);
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

/**
 * Valida CNS (Cartão Nacional de Saúde).
 * Formato: 15 dígitos, primeiro dígito 1, 2, 7, 8 ou 9.
 * Algoritmo: soma ponderada mod 11 == 0.
 */
export function isValidCns(cns: string): boolean {
  const digits = cns.replace(/\D/g, '');
  if (digits.length !== 15) return false;

  const first = digits[0];
  if (!['1', '2', '7', '8', '9'].includes(first)) return false;

  // Soma ponderada: digit[i] * (15 - i) para i = 0..14
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    sum += parseInt(digits[i]) * (15 - i);
  }
  return sum % 11 === 0;
}

/**
 * Valida CNES (Cadastro Nacional de Estabelecimentos de Saúde).
 * Formato: 7 dígitos numéricos.
 */
export function isValidCnes(cnes: string): boolean {
  const digits = cnes.replace(/\D/g, '');
  return digits.length === 7 && /^\d{7}$/.test(digits);
}

function validatePractitioner(practitioner: Practitioner, errors: string[], warnings: string[]): void {
  const cnsIdentifier = practitioner.identifier?.find(
    (id) => id.system === 'https://saude.gov.br/fhir/sid/cns' && id.value
  );
  if (!cnsIdentifier) {
    errors.push('Practitioner deve ter CNS (system: https://saude.gov.br/fhir/sid/cns)');
  } else if (!isValidCns(cnsIdentifier.value!)) {
    warnings.push(`Practitioner CNS "${cnsIdentifier.value}" tem formato inválido (deve ser 15 dígitos, mod 11)`);
  }

  if (!practitioner.name?.length || !practitioner.name[0]?.text) {
    errors.push('Practitioner.name é obrigatório');
  }
}

function validateOrganization(organization: Organization, errors: string[], warnings: string[]): void {
  const cnesIdentifier = organization.identifier?.find(
    (id) => id.system === 'https://saude.gov.br/fhir/sid/cnes' && id.value
  );
  if (!cnesIdentifier) {
    errors.push('Organization deve ter CNES (system: https://saude.gov.br/fhir/sid/cnes)');
  } else if (!isValidCnes(cnesIdentifier.value!)) {
    warnings.push(`Organization CNES "${cnesIdentifier.value}" tem formato inválido (deve ser 7 dígitos)`);
  }

  if (!organization.name) {
    errors.push('Organization.name é obrigatório');
  }
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
