/**
 * Patient Summary — o menor conjunto de informações que salva vidas.
 *
 * Este módulo define a estrutura e validação do Patient Summary,
 * o formato central do Bridge Protocol.
 */

const BRIDGE_VERSION = "0.1";

function createPatientSummary({
  id,
  birthYear,
  sex,
  bloodType,
  conditions = [],
  allergies = [],
  medications = [],
  recentEncounters = [],
  flags = [],
}) {
  return {
    bridge_version: BRIDGE_VERSION,
    patient: {
      id,
      birth_year: birthYear,
      sex,
      blood_type: bloodType || null,
    },
    conditions: conditions.map((c) => ({
      code: c.code,
      system: c.system || "ICD-10",
      description: c.description,
      onset: c.onset || null,
      status: c.status || "active",
    })),
    allergies: allergies.map((a) => ({
      substance: a.substance,
      severity: a.severity || "unknown",
      reaction: a.reaction || null,
    })),
    medications: medications.map((m) => ({
      name: m.name,
      dose: m.dose || null,
      frequency: m.frequency || null,
      start: m.start || null,
    })),
    recent_encounters: recentEncounters.map((e) => ({
      date: e.date,
      type: e.type,
      provider: e.provider,
      notes: e.notes || null,
      vitals: e.vitals || null,
    })),
    flags,
  };
}

function validate(summary) {
  const errors = [];

  if (summary.bridge_version !== BRIDGE_VERSION) {
    errors.push(`Versão incompatível: esperado ${BRIDGE_VERSION}, recebido ${summary.bridge_version}`);
  }
  if (!summary.patient?.id) {
    errors.push("patient.id é obrigatório");
  }
  if (!summary.patient?.birth_year) {
    errors.push("patient.birth_year é obrigatório");
  }
  if (!["M", "F", "O"].includes(summary.patient?.sex)) {
    errors.push("patient.sex deve ser M, F ou O");
  }

  for (const c of summary.conditions || []) {
    if (!c.code) errors.push("condition.code é obrigatório");
    if (!c.description) errors.push("condition.description é obrigatório");
  }

  for (const a of summary.allergies || []) {
    if (!a.substance) errors.push("allergy.substance é obrigatório");
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { createPatientSummary, validate, BRIDGE_VERSION };
