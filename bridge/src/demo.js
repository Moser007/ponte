/**
 * DEMONSTRAÇÃO: A Primeira Ponte
 *
 * Cenário: Maria, 39 anos, gestante de alto risco.
 * Faz pré-natal na UBS Vila Nova (Sistema A).
 * Chega com emergência à Maternidade Regional (Sistema B).
 * O obstetra de plantão nunca a viu antes.
 *
 * ANTES do Bridge: ele não tem acesso a nenhum histórico.
 * DEPOIS do Bridge: em menos de 5 segundos, ele sabe tudo que precisa.
 *
 * Esta demonstração simula esse cenário completo.
 */

const crypto = require("crypto");
const { Bridge } = require("./bridge");
const ubsAdapter = require("./adapters/ubs-adapter");
const hospitalAdapter = require("./adapters/hospital-adapter");

// ─────────────────────────────────────────────────────────
// Simulação de dados: o que cada sistema sabe sobre Maria
// ─────────────────────────────────────────────────────────

const MARIA_ID = crypto.createHash("sha256").update("CPF:12345678901+SALT").digest("hex");

// Dados que existem no sistema da UBS (pré-natal)
const ubsDatabase = {
  [MARIA_ID]: {
    cpf_hash: MARIA_ID,
    data_nascimento: "1985-03-15",
    sexo: "Feminino",
    tipo_sanguineo: "O+",
    problemas: [
      {
        cid: "O24.4",
        descricao: "Diabetes mellitus gestacional",
        data_inicio: "2025-06",
        ativo: true,
      },
      {
        cid: "O13",
        descricao: "Hipertensão gestacional",
        data_inicio: "2025-09",
        ativo: true,
      },
    ],
    alergias: [
      {
        substancia: "Penicilina",
        gravidade: "high",
        reacao: "Anafilaxia",
      },
    ],
    medicamentos: [
      {
        nome: "Insulina NPH",
        dosagem: "10 UI",
        posologia: "2x/dia (café e jantar)",
        inicio: "2025-07",
      },
      {
        nome: "Metildopa",
        dosagem: "250mg",
        posologia: "3x/dia",
        inicio: "2025-09",
      },
    ],
    atendimentos: [
      {
        data: "2025-11-20",
        tipo: "prenatal",
        unidade: "UBS Vila Nova",
        observacoes: "Glicemia jejum 135mg/dL. Ajuste de insulina. PA controlada com metildopa. Encaminhada para USG obstétrica.",
        sinais_vitais: {
          pa_sistolica: 130,
          pa_diastolica: 85,
          peso: 78,
          semanas_gestacionais: 32,
        },
      },
      {
        data: "2025-11-06",
        tipo: "prenatal",
        unidade: "UBS Vila Nova",
        observacoes: "Queixa de edema em MMII. PA 140/90. Iniciada metildopa. Solicitados exames.",
        sinais_vitais: {
          pa_sistolica: 140,
          pa_diastolica: 90,
          peso: 77,
          semanas_gestacionais: 30,
        },
      },
    ],
    alertas: ["GESTACAO_ALTO_RISCO", "ALERGIA_PENICILINA"],
  },
};

// ─────────────────────────────────────────────────────────
// Execução da demonstração
// ─────────────────────────────────────────────────────────

async function runDemo() {
  console.log("═".repeat(64));
  console.log("  SUPERINTELLIGENCE BRIDGE PROTOCOL — DEMONSTRAÇÃO v0.1");
  console.log("═".repeat(64));
  console.log();
  console.log("Cenário: Maria, 39 anos, gestante de alto risco.");
  console.log("Chega à emergência da Maternidade Regional com dor abdominal");
  console.log("intensa às 3h da manhã. O obstetra de plantão nunca a viu.");
  console.log();

  // ── ANTES: sem Bridge ──
  console.log("─".repeat(64));
  console.log("  ❌ ANTES DO BRIDGE:");
  console.log("─".repeat(64));
  console.log();
  console.log('  Obstetra: "Você tem alguma alergia?"');
  console.log('  Maria (com dor, assustada): "Acho que sim... não lembro o nome"');
  console.log('  Obstetra: "Toma alguma medicação?"');
  console.log('  Maria: "Tomo uma insulina... e outro remédio... não sei a dose"');
  console.log('  Obstetra: "Qual é sua idade gestacional?"');
  console.log('  Maria: "Acho que uns 8 meses..."');
  console.log();
  console.log("  Resultado: médico opera às cegas. Risco de prescrever");
  console.log("  penicilina (anafilaxia). Sem histórico de PA e glicemia.");
  console.log();

  // ── DEPOIS: com Bridge ──
  console.log("─".repeat(64));
  console.log("  ✅ DEPOIS DO BRIDGE:");
  console.log("─".repeat(64));
  console.log();
  console.log("  Obstetra consulta o Bridge com o identificador de Maria...");
  console.log();

  // Configurar o Bridge
  const bridge = new Bridge();

  bridge.registerSystem(
    "ubs-vila-nova",
    ubsAdapter,
    async (patientId) => ubsDatabase[patientId] || null
  );

  bridge.registerSystem(
    "maternidade-regional",
    hospitalAdapter,
    async () => null // Hospital não tem dados prévios de Maria
  );

  // Executar a consulta (o momento que salva a vida)
  const result = await bridge.query(
    MARIA_ID,
    "maternidade-regional",
    "Emergência obstétrica — paciente sem histórico local"
  );

  // Exibir resultado como o médico veria
  if (result.results.length > 0) {
    for (const r of result.results) {
      console.log(`  Dados encontrados em: ${r.adapterName}`);
      console.log();
      console.log(hospitalAdapter.render(r.summary));
    }
  }

  console.log();
  console.log("─".repeat(64));
  console.log("  RESULTADO:");
  console.log("─".repeat(64));
  console.log();
  console.log(`  Sistemas consultados: ${result.meta.systemsQueried}`);
  console.log(`  Resultados encontrados: ${result.meta.resultsFound}`);
  console.log(`  Tempo de resposta: ${result.meta.elapsedMs}ms`);
  console.log(`  Dentro do alvo (<5s): ${result.meta.belowTarget ? "SIM" : "NÃO"}`);
  console.log();
  console.log("  O obstetra agora sabe:");
  console.log("    → Maria é ALÉRGICA A PENICILINA (não vai prescrever)");
  console.log("    → Tem diabetes gestacional (insulina 10UI 2x/dia)");
  console.log("    → Tem hipertensão gestacional (metildopa 250mg 3x/dia)");
  console.log("    → Está com 32 semanas (não 'uns 8 meses')");
  console.log("    → Última PA: 130/85, glicemia de jejum: 135mg/dL");
  console.log("    → É gestação de ALTO RISCO");
  console.log();
  console.log("  Essa informação chegou em milissegundos.");
  console.log("  Sem ela, o médico opera às cegas.");
  console.log("  Com ela, ele salva duas vidas.");
  console.log();
  console.log("═".repeat(64));
  console.log("  Esta é a primeira ponte. As próximas vêm depois.");
  console.log("═".repeat(64));

  // Mostrar audit log
  console.log();
  console.log("LOG DE AUDITORIA:");
  for (const entry of bridge.getAuditLog()) {
    console.log(`  [${entry.timestamp}] ${entry.action} — ${JSON.stringify(entry)}`);
  }
}

runDemo().catch(console.error);
