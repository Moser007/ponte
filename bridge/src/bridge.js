/**
 * Bridge — o núcleo do protocolo.
 *
 * Stateless. Não armazena dados. Apenas traduz e roteia.
 * Conecta sistemas que não se conhecem através de adaptadores.
 */

const crypto = require("crypto");
const { validate } = require("./patient-summary");

class Bridge {
  constructor() {
    this.systems = new Map();
    this.auditLog = [];
  }

  /**
   * Registra um sistema no Bridge.
   *
   * @param {string} systemId - Identificador único do sistema
   * @param {Object} adapter - Adaptador com funções extract/inject
   * @param {Function} dataSource - Função que retorna dados do paciente dado um ID
   */
  registerSystem(systemId, adapter, dataSource) {
    this.systems.set(systemId, { adapter, dataSource, registeredAt: new Date() });
  }

  /**
   * Consulta todos os sistemas registrados em busca de dados de um paciente.
   * Esta é a operação central do Bridge: a consulta pull-based.
   *
   * @param {string} patientId - ID hasheado do paciente
   * @param {string} requestingSystem - ID do sistema que está pedindo
   * @param {string} reason - Motivo da consulta (para auditoria)
   * @returns {Object} Resultados consolidados de todos os sistemas
   */
  async query(patientId, requestingSystem, reason) {
    const queryId = crypto.randomUUID();
    const startTime = Date.now();

    this.audit({
      queryId,
      action: "QUERY_START",
      patientId: this.maskId(patientId),
      requestingSystem,
      reason,
      timestamp: new Date().toISOString(),
    });

    const results = [];
    const errors = [];

    for (const [systemId, { adapter, dataSource }] of this.systems) {
      if (systemId === requestingSystem) continue;

      try {
        const rawData = await dataSource(patientId);
        if (!rawData) continue;

        const summary = adapter.extract(rawData);
        const validation = validate(summary);

        if (validation.valid) {
          results.push({ systemId, summary, adapterName: adapter.systemName });
        } else {
          errors.push({ systemId, errors: validation.errors });
        }
      } catch (err) {
        errors.push({ systemId, errors: [err.message] });
      }
    }

    const elapsed = Date.now() - startTime;

    this.audit({
      queryId,
      action: "QUERY_COMPLETE",
      systemsQueried: this.systems.size - 1,
      resultsFound: results.length,
      errorsEncountered: errors.length,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });

    return {
      queryId,
      patientId: this.maskId(patientId),
      results,
      errors,
      meta: {
        systemsQueried: this.systems.size - 1,
        resultsFound: results.length,
        elapsedMs: elapsed,
        belowTarget: elapsed < 5000,
      },
    };
  }

  /**
   * Retorna o log de auditoria completo.
   * Em produção, isso seria um append-only log persistente.
   */
  getAuditLog() {
    return [...this.auditLog];
  }

  /** @private */
  audit(entry) {
    this.auditLog.push(entry);
  }

  /** @private */
  maskId(id) {
    if (!id || id.length < 8) return "***";
    return id.substring(0, 4) + "..." + id.substring(id.length - 4);
  }
}

module.exports = { Bridge };
