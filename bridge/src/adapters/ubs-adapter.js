/**
 * Adaptador: UBS (Unidade Básica de Saúde)
 *
 * Simula a extração de dados de um sistema típico de atenção primária
 * brasileira. Na implementação real, este adaptador se conectaria
 * ao e-SUS AB ou sistema equivalente via API ou banco de dados.
 *
 * Este é o Sistema A no cenário de demonstração.
 */

const { createPatientSummary } = require("../patient-summary");

/**
 * Extrai dados do formato interno da UBS e converte para Patient Summary.
 *
 * @param {Object} ubsRecord - Registro no formato interno do sistema da UBS
 * @returns {Object} Patient Summary no formato Bridge
 */
function extract(ubsRecord) {
  return createPatientSummary({
    id: ubsRecord.cpf_hash,
    birthYear: new Date(ubsRecord.data_nascimento).getFullYear(),
    sex: ubsRecord.sexo === "Feminino" ? "F" : ubsRecord.sexo === "Masculino" ? "M" : "O",
    bloodType: ubsRecord.tipo_sanguineo || null,
    conditions: (ubsRecord.problemas || []).map((p) => ({
      code: p.cid,
      system: "ICD-10",
      description: p.descricao,
      onset: p.data_inicio,
      status: p.ativo ? "active" : "resolved",
    })),
    allergies: (ubsRecord.alergias || []).map((a) => ({
      substance: a.substancia,
      severity: a.gravidade,
      reaction: a.reacao,
    })),
    medications: (ubsRecord.medicamentos || []).map((m) => ({
      name: m.nome,
      dose: m.dosagem,
      frequency: m.posologia,
      start: m.inicio,
    })),
    recentEncounters: (ubsRecord.atendimentos || []).map((at) => ({
      date: at.data,
      type: at.tipo,
      provider: at.unidade,
      notes: at.observacoes,
      vitals: at.sinais_vitais
        ? {
            bp_systolic: at.sinais_vitais.pa_sistolica,
            bp_diastolic: at.sinais_vitais.pa_diastolica,
            weight_kg: at.sinais_vitais.peso,
            gestational_weeks: at.sinais_vitais.semanas_gestacionais,
          }
        : null,
    })),
    flags: ubsRecord.alertas || [],
  });
}

/**
 * Converte Patient Summary de volta para o formato interno da UBS.
 * (Para quando dados vindos de outros sistemas precisam ser visualizados na UBS)
 */
function inject(patientSummary) {
  return {
    cpf_hash: patientSummary.patient.id,
    origem: "BRIDGE_PROTOCOL",
    dados_externos: {
      condicoes: patientSummary.conditions,
      alergias: patientSummary.allergies,
      medicamentos: patientSummary.medications,
      atendimentos_recentes: patientSummary.recent_encounters,
      alertas: patientSummary.flags,
    },
    recebido_em: new Date().toISOString(),
  };
}

module.exports = { extract, inject, systemName: "UBS (e-SUS AB)" };
