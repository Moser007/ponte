/**
 * Adaptador: Hospital / Maternidade
 *
 * Simula a interface com um sistema hospitalar típico (HIS).
 * Na implementação real, conectaria via HL7v2, FHIR, ou API proprietária.
 *
 * Este é o Sistema B no cenário de demonstração.
 */

const { createPatientSummary } = require("../patient-summary");

/**
 * Extrai dados do formato interno do HIS e converte para Patient Summary.
 */
function extract(hisRecord) {
  return createPatientSummary({
    id: hisRecord.patient_hash,
    birthYear: hisRecord.birth_year,
    sex: hisRecord.gender,
    bloodType: hisRecord.blood_type || null,
    conditions: (hisRecord.diagnoses || []).map((d) => ({
      code: d.icd_code,
      system: "ICD-10",
      description: d.description,
      onset: d.diagnosed_at,
      status: d.active ? "active" : "resolved",
    })),
    allergies: (hisRecord.allergy_list || []).map((a) => ({
      substance: a.allergen,
      severity: a.severity,
      reaction: a.reaction_type,
    })),
    medications: (hisRecord.prescriptions || []).map((p) => ({
      name: p.drug_name,
      dose: p.dosage,
      frequency: p.schedule,
      start: p.prescribed_date,
    })),
    recentEncounters: (hisRecord.visits || []).map((v) => ({
      date: v.visit_date,
      type: v.visit_type,
      provider: v.department,
      notes: v.clinical_notes,
      vitals: v.vitals || null,
    })),
    flags: hisRecord.alerts || [],
  });
}

/**
 * Renderiza um Patient Summary recebido pelo Bridge no formato
 * que o sistema hospitalar exibe ao médico.
 */
function render(patientSummary) {
  const p = patientSummary;
  const lines = [];

  lines.push("╔══════════════════════════════════════════════════════════════╗");
  lines.push("║         DADOS EXTERNOS — BRIDGE PROTOCOL v" + p.bridge_version + "              ║");
  lines.push("╠══════════════════════════════════════════════════════════════╣");
  lines.push(`║  Paciente: ${p.patient.id.substring(0, 12)}...  Sexo: ${p.patient.sex}  Nasc: ${p.patient.birth_year}`);
  if (p.patient.blood_type) {
    lines.push(`║  Tipo sanguíneo: ${p.patient.blood_type}`);
  }

  if (p.flags.length > 0) {
    lines.push("║");
    lines.push("║  ⚠ ALERTAS: " + p.flags.join(" | "));
  }

  if (p.allergies.length > 0) {
    lines.push("║");
    lines.push("║  🔴 ALERGIAS:");
    for (const a of p.allergies) {
      lines.push(`║     - ${a.substance} (${a.severity}) → ${a.reaction || "reação não especificada"}`);
    }
  }

  if (p.conditions.length > 0) {
    lines.push("║");
    lines.push("║  CONDIÇÕES ATIVAS:");
    for (const c of p.conditions.filter((x) => x.status === "active")) {
      lines.push(`║     - [${c.code}] ${c.description} (desde ${c.onset || "?"})`);
    }
  }

  if (p.medications.length > 0) {
    lines.push("║");
    lines.push("║  MEDICAMENTOS EM USO:");
    for (const m of p.medications) {
      lines.push(`║     - ${m.name} ${m.dose || ""} ${m.frequency || ""}`);
    }
  }

  if (p.recent_encounters.length > 0) {
    lines.push("║");
    lines.push("║  ÚLTIMOS ATENDIMENTOS:");
    for (const e of p.recent_encounters.slice(0, 3)) {
      lines.push(`║     ${e.date} | ${e.type} | ${e.provider}`);
      if (e.notes) lines.push(`║       "${e.notes}"`);
      if (e.vitals) {
        const v = e.vitals;
        const parts = [];
        if (v.bp_systolic) parts.push(`PA ${v.bp_systolic}/${v.bp_diastolic}`);
        if (v.weight_kg) parts.push(`Peso ${v.weight_kg}kg`);
        if (v.gestational_weeks) parts.push(`IG ${v.gestational_weeks}sem`);
        if (parts.length > 0) lines.push(`║       Sinais: ${parts.join(" | ")}`);
      }
    }
  }

  lines.push("║");
  lines.push("╚══════════════════════════════════════════════════════════════╝");

  return lines.join("\n");
}

module.exports = { extract, render, systemName: "Hospital (HIS)" };
