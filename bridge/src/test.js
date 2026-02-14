/**
 * Testes mínimos — verificação de sanidade do protocolo.
 */

const crypto = require("crypto");
const { createPatientSummary, validate } = require("./patient-summary");
const { Bridge } = require("./bridge");
const ubsAdapter = require("./adapters/ubs-adapter");

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

console.log("Bridge Protocol v0.1 — Testes\n");

// ── Patient Summary ──
console.log("Patient Summary:");

const summary = createPatientSummary({
  id: "abc123",
  birthYear: 1985,
  sex: "F",
  bloodType: "O+",
  conditions: [{ code: "O24.4", description: "Diabetes gestacional" }],
  allergies: [{ substance: "Penicilina", severity: "high" }],
});

assert(summary.bridge_version === "0.1", "versão correta");
assert(summary.patient.id === "abc123", "ID preservado");
assert(summary.conditions.length === 1, "condição registrada");
assert(summary.allergies.length === 1, "alergia registrada");
assert(summary.conditions[0].system === "ICD-10", "sistema padrão ICD-10");
assert(summary.conditions[0].status === "active", "status padrão active");

// ── Validação ──
console.log("\nValidação:");

const valid = validate(summary);
assert(valid.valid === true, "summary válido passa");

const invalid = validate({ bridge_version: "0.1", patient: {} });
assert(invalid.valid === false, "summary inválido falha");
assert(invalid.errors.length > 0, "erros listados");

// ── Adapter UBS ──
console.log("\nAdaptador UBS:");

const ubsRecord = {
  cpf_hash: "hash123",
  data_nascimento: "1985-03-15",
  sexo: "Feminino",
  tipo_sanguineo: "A+",
  problemas: [{ cid: "J06", descricao: "IVAS", data_inicio: "2025-01", ativo: true }],
  alergias: [{ substancia: "AAS", gravidade: "low", reacao: "Urticária" }],
  medicamentos: [],
  atendimentos: [],
  alertas: [],
};

const extracted = ubsAdapter.extract(ubsRecord);
assert(extracted.patient.id === "hash123", "extração preserva ID");
assert(extracted.patient.sex === "F", "traduz sexo corretamente");
assert(extracted.patient.birth_year === 1985, "extrai ano de nascimento");
assert(extracted.conditions[0].code === "J06", "extrai CID");

const validation2 = validate(extracted);
assert(validation2.valid === true, "extração produz summary válido");

// ── Bridge ──
console.log("\nBridge (integração):");

async function testBridge() {
  const bridge = new Bridge();
  const testId = "patient-001";

  bridge.registerSystem("system-a", ubsAdapter, async (id) => {
    if (id === testId) return ubsRecord;
    return null;
  });

  bridge.registerSystem("system-b", ubsAdapter, async () => null);

  const result = await bridge.query(testId, "system-b", "teste");
  assert(result.results.length === 1, "encontra dados no system-a");
  assert(result.meta.systemsQueried === 1, "consulta apenas outros sistemas");
  assert(result.meta.belowTarget === true, "responde em <5s");

  const noResult = await bridge.query("inexistente", "system-b", "teste");
  assert(noResult.results.length === 0, "retorna vazio para paciente inexistente");

  const auditLog = bridge.getAuditLog();
  assert(auditLog.length === 4, "registra auditoria (2 queries x 2 eventos)");

  // Resultado
  console.log(`\n${"─".repeat(40)}`);
  console.log(`  Resultado: ${passed} passou, ${failed} falhou`);
  console.log(`${"─".repeat(40)}`);

  if (failed > 0) process.exit(1);
}

testBridge().catch(console.error);
