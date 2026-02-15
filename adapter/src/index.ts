import { randomUUID } from 'node:crypto';
import type { Bundle, Resource } from '@medplum/fhirtypes';
import type { IpmDataSource } from './datasource/ipm-datasource.js';
import type { RndsClient, RndsSubmitResult } from './rnds/client.js';
import { buildPatient } from './builders/patient.js';
import { buildPractitioner } from './builders/practitioner.js';
import { buildOrganization } from './builders/organization.js';
import { buildEncounter } from './builders/encounter.js';
import { buildCondition } from './builders/condition.js';
import { buildAllergyIntolerance } from './builders/allergy.js';
import { buildVitalSigns, buildDumObservation, buildObstetricHistory } from './builders/vital-signs.js';
import { buildMedicationStatement } from './builders/medication.js';
import { buildComposition } from './builders/composition.js';
import { assembleRacBundle } from './bundle/rac-assembler.js';
import { validateBundle } from './validation/validate.js';

type UuidGenerator = () => string;

let uuidGen: UuidGenerator = () => randomUUID();

/**
 * Substitui o gerador de UUID (para testes determinísticos).
 */
export function setUuidGenerator(gen: UuidGenerator): void {
  uuidGen = gen;
}

function generateUuid(): string {
  return uuidGen();
}

export interface ProcessarResult {
  bundle: Bundle;
  validation: { valid: boolean; errors: string[]; warnings: string[] };
  envio?: RndsSubmitResult;
}

/**
 * Orquestra o fluxo completo: DataSource → Builders → Composition → Bundle → Validação → RNDS.
 */
export async function processar(
  cpf: string,
  dataSource: IpmDataSource,
  rndsClient?: RndsClient
): Promise<ProcessarResult> {
  // 1. Buscar paciente
  const paciente = await dataSource.getPaciente(cpf);
  if (!paciente) {
    throw new Error(`Paciente com CPF ${cpf} não encontrado`);
  }

  // 2. Buscar atendimentos
  const atendimentos = await dataSource.getAtendimentos(paciente.id);
  if (!atendimentos.length) {
    throw new Error(`Nenhum atendimento encontrado para paciente ${paciente.id}`);
  }

  // Usar o atendimento mais recente
  const atendimento = atendimentos[0];

  // 3. Buscar dados associados
  const [problemas, alergias, medicamentos, sinaisVitaisData, profissional, estabelecimento] =
    await Promise.all([
      dataSource.getProblemas(atendimento.id),
      dataSource.getAlergias(paciente.id),
      dataSource.getMedicamentos(paciente.id),
      dataSource.getSinaisVitais(atendimento.id),
      dataSource.getProfissional(atendimento.profissional_id),
      dataSource.getEstabelecimento(atendimento.estabelecimento_id),
    ]);

  if (!profissional) {
    throw new Error(`Profissional ${atendimento.profissional_id} não encontrado`);
  }
  if (!estabelecimento) {
    throw new Error(`Estabelecimento ${atendimento.estabelecimento_id} não encontrado`);
  }

  // 4. Gerar UUIDs
  const patientUuid = generateUuid();
  const practitionerUuid = generateUuid();
  const organizationUuid = generateUuid();
  const conditionUuids = problemas.map(() => generateUuid());
  const allergyUuids = alergias.map(() => generateUuid());
  const medicationUuids = medicamentos.map(() => generateUuid());

  // Sinais vitais: cada medição pode gerar múltiplas observations
  const vitalSignUuids: string[][] = [];
  const allVitalSigns: Resource[] = [];
  for (const sv of sinaisVitaisData) {
    // Count how many vitals this record has
    let count = 0;
    if (sv.pa_sistolica != null) count++;
    if (sv.pa_diastolica != null) count++;
    if (sv.peso != null) count++;
    if (sv.altura != null) count++;
    if (sv.temperatura != null) count++;
    if (sv.freq_cardiaca != null) count++;
    if (sv.freq_respiratoria != null) count++;
    if (sv.saturacao_o2 != null) count++;
    if (sv.glicemia_capilar != null) count++;
    if (sv.semanas_gestacionais != null) count++;
    const uuids = Array.from({ length: count }, () => generateUuid());
    vitalSignUuids.push(uuids);
    const observations = buildVitalSigns(sv, uuids, `urn:uuid:${patientUuid}`);
    allVitalSigns.push(...observations);
  }

  const encounterUuid = generateUuid();
  const compositionUuid = generateUuid();

  // 5. Construir recursos FHIR
  const patient = buildPatient(paciente, patientUuid);
  const practitioner = buildPractitioner(profissional, practitionerUuid);
  const organization = buildOrganization(estabelecimento, organizationUuid);

  const conditions = problemas.map((p, i) =>
    buildCondition(p, conditionUuids[i], `urn:uuid:${patientUuid}`)
  );

  const allergies = alergias.map((a, i) =>
    buildAllergyIntolerance(a, allergyUuids[i], `urn:uuid:${patientUuid}`)
  );

  const medications = medicamentos.map((m, i) =>
    buildMedicationStatement(m, medicationUuids[i], `urn:uuid:${patientUuid}`)
  );

  const encounter = buildEncounter(atendimento, encounterUuid, {
    patientRef: `urn:uuid:${patientUuid}`,
    practitionerRef: `urn:uuid:${practitionerUuid}`,
    organizationRef: `urn:uuid:${organizationUuid}`,
    conditionRefs: conditionUuids.map((u) => `urn:uuid:${u}`),
  });

  // DUM (Data da Última Menstruação) — vem do paciente, não dos sinais vitais
  let dumObservation: Resource | undefined;
  let dumUuid: string | undefined;
  if (paciente.dum) {
    dumUuid = generateUuid();
    dumObservation = buildDumObservation(paciente.dum, dumUuid, `urn:uuid:${patientUuid}`);
  }

  // Histórico obstétrico (gestas prévias, partos) — dados do paciente
  const obstetricUuids: string[] = [];
  let obstetricObs: Resource[] = [];
  if (paciente.gestas_previas != null || paciente.partos != null) {
    let count = 0;
    if (paciente.gestas_previas != null) count++;
    if (paciente.partos != null) count++;
    for (let i = 0; i < count; i++) obstetricUuids.push(generateUuid());
    obstetricObs = buildObstetricHistory(
      { gestas_previas: paciente.gestas_previas, partos: paciente.partos },
      obstetricUuids,
      `urn:uuid:${patientUuid}`
    );
  }

  const allVitalSignUuids = [
    ...vitalSignUuids.flat(),
    ...(dumUuid ? [dumUuid] : []),
    ...obstetricUuids,
  ];

  const composition = buildComposition(
    compositionUuid,
    {
      patientRef: `urn:uuid:${patientUuid}`,
      encounterRef: `urn:uuid:${encounterUuid}`,
      practitionerRef: `urn:uuid:${practitionerUuid}`,
      organizationRef: `urn:uuid:${organizationUuid}`,
    },
    {
      conditionRefs: conditionUuids.map((u) => `urn:uuid:${u}`),
      vitalSignRefs: allVitalSignUuids.map((u) => `urn:uuid:${u}`),
      allergyRefs: allergyUuids.map((u) => `urn:uuid:${u}`),
      medicationRefs: medicationUuids.map((u) => `urn:uuid:${u}`),
    },
    atendimento.data_inicio
  );

  // 6. Montar Bundle
  const resources: Resource[] = [
    patient,
    practitioner,
    organization,
    encounter,
    ...conditions,
    ...allergies,
    ...allVitalSigns,
    ...(dumObservation ? [dumObservation] : []),
    ...obstetricObs,
    ...medications,
  ];

  const bundle = assembleRacBundle(
    composition,
    resources,
    new Date(atendimento.data_inicio).toISOString()
  );

  // 7. Validar
  const validation = validateBundle(bundle);

  // 8. Enviar (se cliente disponível e validação OK)
  let envio: RndsSubmitResult | undefined;
  if (rndsClient && validation.valid) {
    envio = await rndsClient.enviarBundle(bundle, profissional.cns);
  }

  return { bundle, validation, envio };
}
