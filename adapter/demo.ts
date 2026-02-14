import { MockDataSource } from './src/datasource/mock-datasource.js';
import { RndsAuthStub } from './src/rnds/auth.js';
import { RndsClientStub } from './src/rnds/client.js';
import { processar, resetUuidCounter } from './src/index.js';

async function runDemo() {
  console.log('='.repeat(64));
  console.log('  PONTE ADAPTER — IPM Atende.Net -> RNDS (FHIR R4)');
  console.log('='.repeat(64));
  console.log();
  console.log('Cenario: Maria, 39 anos, gestante de alto risco.');
  console.log('Pre-natal na UBS Vila Nova (IPM Atende.Net).');
  console.log('Gerando Bundle RAC para envio a RNDS...');
  console.log();

  resetUuidCounter();
  const dataSource = new MockDataSource();
  const auth = new RndsAuthStub();
  const rndsClient = new RndsClientStub(auth);

  const result = await processar('12345678901', dataSource, rndsClient);

  // --- ANTES ---
  console.log('-'.repeat(64));
  console.log('  ANTES: Dados no IPM Atende.Net (banco PostgreSQL)');
  console.log('-'.repeat(64));
  console.log();
  const paciente = await dataSource.getPaciente('12345678901');
  console.log(`  Paciente: ${paciente?.nome}`);
  console.log(`  CPF: ${paciente?.cpf}`);
  console.log(`  Nascimento: ${paciente?.data_nascimento}`);
  console.log(`  Raca/Cor: ${paciente?.raca_cor}`);
  console.log();

  const atendimentos = await dataSource.getAtendimentos(paciente!.id);
  const problemas = await dataSource.getProblemas(atendimentos[0].id);
  const alergias = await dataSource.getAlergias(paciente!.id);
  const medicamentos = await dataSource.getMedicamentos(paciente!.id);
  const sinais = await dataSource.getSinaisVitais(atendimentos[0].id);

  console.log('  Problemas:');
  for (const p of problemas) {
    console.log(`    - [${p.cid}] ${p.descricao} (ativo: ${p.ativo})`);
  }
  console.log('  Alergias:');
  for (const a of alergias) {
    console.log(`    - ${a.substancia} (gravidade: ${a.gravidade}, reacao: ${a.reacao})`);
  }
  console.log('  Medicamentos:');
  for (const m of medicamentos) {
    console.log(`    - ${m.nome} ${m.dosagem} ${m.posologia}`);
  }
  console.log('  Sinais Vitais:');
  for (const s of sinais) {
    console.log(`    - PA: ${s.pa_sistolica}/${s.pa_diastolica} mmHg`);
    console.log(`    - Peso: ${s.peso} kg`);
    console.log(`    - IG: ${s.semanas_gestacionais} semanas`);
  }
  console.log();

  // --- DEPOIS ---
  console.log('-'.repeat(64));
  console.log('  DEPOIS: Bundle RAC FHIR R4 (pronto para RNDS)');
  console.log('-'.repeat(64));
  console.log();
  console.log(JSON.stringify(result.bundle, null, 2));
  console.log();

  // --- VALIDACAO ---
  console.log('-'.repeat(64));
  console.log('  VALIDACAO');
  console.log('-'.repeat(64));
  console.log();
  console.log(`  Valido: ${result.validation.valid ? 'SIM' : 'NAO'}`);
  if (result.validation.errors.length) {
    console.log('  Erros:');
    for (const e of result.validation.errors) {
      console.log(`    - ${e}`);
    }
  }
  if (result.validation.warnings.length) {
    console.log('  Avisos:');
    for (const w of result.validation.warnings) {
      console.log(`    - ${w}`);
    }
  }
  console.log();

  // --- ENVIO ---
  console.log('-'.repeat(64));
  console.log('  ENVIO RNDS (stub)');
  console.log('-'.repeat(64));
  console.log();
  if (result.envio) {
    console.log(`  Status: ${result.envio.status}`);
    console.log(`  Sucesso: ${result.envio.success}`);
    console.log(`  Mensagem: ${result.envio.message}`);
  }
  console.log();

  // --- RESUMO ---
  console.log('='.repeat(64));
  console.log('  RESUMO');
  console.log('='.repeat(64));
  console.log();
  console.log(`  Entries no Bundle: ${result.bundle.entry?.length}`);
  console.log(`  Composition: ${result.bundle.entry?.[0]?.resource?.resourceType}`);
  console.log(`  Validacao: ${result.validation.valid ? 'PASSOU' : 'FALHOU'}`);
  console.log(`  Envio RNDS: ${result.envio?.success ? 'ACEITO' : 'N/A'}`);
  console.log();
  console.log('  Este Bundle contem os dados clinicos da Maria em formato');
  console.log('  FHIR R4 compativel com BR Core, pronto para ser recebido');
  console.log('  pela RNDS e disponibilizado para qualquer profissional');
  console.log('  de saude no pais.');
  console.log();
  console.log('='.repeat(64));
}

runDemo().catch(console.error);
