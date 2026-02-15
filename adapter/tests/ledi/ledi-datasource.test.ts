/**
 * Testes do LediDataSource — DataSource que lê arquivos LEDI/Thrift.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LediDataSource } from '../../src/ledi/ledi-datasource.js';
import { resetIdCounter } from '../../src/ledi/ledi-mapper.js';
import {
  buildDadoTransporte,
  buildFaiMaster,
  buildFaiChild,
  buildHeaderTransport,
  buildMedicoes,
  buildProblemaCondicao,
  buildMedicamento,
  buildIdentificacaoUsuario,
  buildCondicoesDeSaude,
  buildCadastroIndividual,
} from './thrift-test-helpers.js';

const TIMESTAMP = new Date('2025-11-20T09:00:00Z').getTime();
const TIMESTAMP_FIM = new Date('2025-11-20T09:30:00Z').getTime();
const DUM_EPOCH = new Date('2025-04-10T00:00:00Z').getTime();
const NASCIMENTO_EPOCH = new Date('1985-03-15T00:00:00Z').getTime();

/**
 * Helper: cria um buffer .esus com uma FAI (atendimento) completa do cenário Maria.
 */
function buildMariaFaiTransporte(): Buffer {
  const child = buildFaiChild({
    cpfCidadao: '12345678901',
    dataNascimento: NASCIMENTO_EPOCH,
    sexo: 1,
    tipoAtendimento: 6,
    dataHoraInicial: TIMESTAMP,
    dataHoraFinal: TIMESTAMP_FIM,
    dumDaGestante: DUM_EPOCH,
    idadeGestacional: 32,
    nuGestasPrevias: 2,
    nuPartos: 1,
    medicoes: buildMedicoes({
      paSistolica: 130,
      paDiastolica: 85,
      peso: 78.0,
      glicemiaCapilar: 135,
    }),
    problemas: [
      buildProblemaCondicao({ cid10: 'O24.4', ciap: 'W85', situacao: 1 }),
      buildProblemaCondicao({ cid10: 'O13', situacao: 1 }),
    ],
    medicamentos: [
      buildMedicamento({ codigoCatmat: 'BR0271157U0063', dose: '10UI', viaAdministracao: 8, usoContinuo: true }),
      buildMedicamento({ codigoCatmat: 'BR0267689U0042', dose: '250mg', viaAdministracao: 1, usoContinuo: true }),
    ],
  });

  const faiMaster = buildFaiMaster({
    header: buildHeaderTransport({
      cbo: '225142',
      cnes: '2695251',
      cnsProfissional: '980016287241133',
      dataAtendimento: TIMESTAMP,
    }),
    children: [child],
    uuidFicha: 'fai-maria-001',
    tpCdsOrigem: 3,
  });

  return buildDadoTransporte({
    uuid: 'transporte-maria-fai',
    tipo: 4,
    cnes: '2695251',
    codIbge: '4205407',
    fichaBuffer: faiMaster,
  });
}

/**
 * Helper: cria um buffer .esus com um FCI (cadastro) da Maria.
 */
function buildMariaFciTransporte(): Buffer {
  const fci = buildCadastroIndividual({
    identificacao: buildIdentificacaoUsuario({
      nomeCidadao: 'Maria Silva Santos',
      nomeSocialCidadao: 'Maria Santos',
      cpfCidadao: '12345678901',
      cnsCidadao: '980016287241133',
      dataNascimentoCidadao: NASCIMENTO_EPOCH,
      sexoCidadao: 1,
      racaCorCidadao: 3,
      telefoneCelular: '47999998888',
    }),
    condicoesDeSaude: buildCondicoesDeSaude({
      isGestante: true,
      maternidadeDeReferencia: 'Maternidade Regional de Blumenau',
      isHipertenso: true,
      isDiabetico: true,
    }),
    uuid: 'fci-maria-001',
  });

  return buildDadoTransporte({
    uuid: 'transporte-maria-fci',
    tipo: 2,
    cnes: '2695251',
    codIbge: '4205407',
    fichaBuffer: fci,
  });
}

describe('LediDataSource', () => {
  let ds: LediDataSource;

  beforeEach(() => {
    resetIdCounter(1);
    ds = new LediDataSource();
  });

  describe('loadFile com FAI', () => {
    it('carrega FAI e disponibiliza paciente por CPF', async () => {
      ds.loadFile(buildMariaFaiTransporte());

      const paciente = await ds.getPaciente('12345678901');
      expect(paciente).not.toBeNull();
      expect(paciente!.cpf).toBe('12345678901');
      expect(paciente!.sexo).toBe('F');
      expect(paciente!.gestante).toBe(true);
      expect(paciente!.dum).toBe('2025-04-10');
      expect(paciente!.gestas_previas).toBe(2);
      expect(paciente!.partos).toBe(1);
      expect(paciente!.municipio_ibge).toBe('4205407');
    });

    it('retorna null para CPF inexistente', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('00000000000');
      expect(paciente).toBeNull();
    });

    it('disponibiliza atendimentos do paciente', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const atendimentos = await ds.getAtendimentos(paciente!.id);

      expect(atendimentos).toHaveLength(1);
      expect(atendimentos[0].tipo).toBe('prenatal');
      expect(atendimentos[0].paciente_id).toBe(paciente!.id);
    });

    it('disponibiliza problemas do atendimento', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const atendimentos = await ds.getAtendimentos(paciente!.id);
      const problemas = await ds.getProblemas(atendimentos[0].id);

      expect(problemas).toHaveLength(2);
      expect(problemas[0].cid).toBe('O24.4');
      expect(problemas[0].ciap).toBe('W85');
      expect(problemas[0].ativo).toBe(true);
      expect(problemas[1].cid).toBe('O13');
    });

    it('disponibiliza medicamentos do paciente', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const medicamentos = await ds.getMedicamentos(paciente!.id);

      expect(medicamentos).toHaveLength(2);
      expect(medicamentos[0].codigo_catmat).toBe('BR0271157U0063');
      expect(medicamentos[0].dosagem).toBe('10UI');
      expect(medicamentos[0].via_administracao).toBe('subcutânea');
      expect(medicamentos[1].codigo_catmat).toBe('BR0267689U0042');
      expect(medicamentos[1].via_administracao).toBe('oral');
    });

    it('disponibiliza sinais vitais do atendimento', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const atendimentos = await ds.getAtendimentos(paciente!.id);
      const vitais = await ds.getSinaisVitais(atendimentos[0].id);

      expect(vitais).toHaveLength(1);
      expect(vitais[0].pa_sistolica).toBe(130);
      expect(vitais[0].pa_diastolica).toBe(85);
      expect(vitais[0].peso).toBe(78.0);
      expect(vitais[0].glicemia_capilar).toBe(135);
      expect(vitais[0].semanas_gestacionais).toBe(32);
    });

    it('disponibiliza profissional do atendimento', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const atendimentos = await ds.getAtendimentos(paciente!.id);
      const profissional = await ds.getProfissional(atendimentos[0].profissional_id);

      expect(profissional).not.toBeNull();
      expect(profissional!.cns).toBe('980016287241133');
      expect(profissional!.cbo).toBe('225142');
    });

    it('disponibiliza estabelecimento do atendimento', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const atendimentos = await ds.getAtendimentos(paciente!.id);
      const estab = await ds.getEstabelecimento(atendimentos[0].estabelecimento_id);

      expect(estab).not.toBeNull();
      expect(estab!.cnes).toBe('2695251');
      expect(estab!.municipio_ibge).toBe('4205407');
    });

    it('alergias retornam vazio (LEDI FAI não tem alergias)', async () => {
      ds.loadFile(buildMariaFaiTransporte());
      const paciente = await ds.getPaciente('12345678901');
      const alergias = await ds.getAlergias(paciente!.id);

      expect(alergias).toEqual([]);
    });
  });

  describe('loadFile com FCI', () => {
    it('carrega FCI e disponibiliza paciente com dados demográficos', async () => {
      ds.loadFile(buildMariaFciTransporte());

      const paciente = await ds.getPaciente('12345678901');
      expect(paciente).not.toBeNull();
      expect(paciente!.nome).toBe('Maria Silva Santos');
      expect(paciente!.nome_social).toBe('Maria Santos');
      expect(paciente!.cpf).toBe('12345678901');
      expect(paciente!.cns).toBe('980016287241133');
      expect(paciente!.data_nascimento).toBe('1985-03-15');
      expect(paciente!.sexo).toBe('F');
      expect(paciente!.raca_cor).toBe('parda');
      expect(paciente!.gestante).toBe(true);
      expect(paciente!.maternidade_referencia).toBe('Maternidade Regional de Blumenau');
    });
  });

  describe('loadFiles — merge FCI + FAI', () => {
    it('combina FCI (nome/raça) com FAI (obstétrico/clínico)', async () => {
      // Carregar FCI primeiro, depois FAI
      ds.loadFiles([
        buildMariaFciTransporte(),
        buildMariaFaiTransporte(),
      ]);

      const paciente = await ds.getPaciente('12345678901');
      expect(paciente).not.toBeNull();

      // Do FCI
      expect(paciente!.nome).toBe('Maria Silva Santos');
      expect(paciente!.raca_cor).toBe('parda');
      expect(paciente!.maternidade_referencia).toBe('Maternidade Regional de Blumenau');

      // Do FAI
      expect(paciente!.dum).toBe('2025-04-10');
      expect(paciente!.gestas_previas).toBe(2);
      expect(paciente!.partos).toBe(1);

      // Deve ter atendimentos
      const atendimentos = await ds.getAtendimentos(paciente!.id);
      expect(atendimentos.length).toBeGreaterThan(0);
    });

    it('combina FAI primeiro, depois FCI (ordem inversa)', async () => {
      ds.loadFiles([
        buildMariaFaiTransporte(),
        buildMariaFciTransporte(),
      ]);

      const paciente = await ds.getPaciente('12345678901');
      expect(paciente).not.toBeNull();
      expect(paciente!.nome).toBe('Maria Silva Santos');
      expect(paciente!.dum).toBe('2025-04-10');
    });
  });

  describe('múltiplos pacientes', () => {
    it('carrega FAI com múltiplos pacientes', async () => {
      const child1 = buildFaiChild({
        cpfCidadao: '11111111111',
        dataNascimento: NASCIMENTO_EPOCH,
        sexo: 0,
        tipoAtendimento: 1,
        dataHoraInicial: TIMESTAMP,
        dataHoraFinal: TIMESTAMP_FIM,
        problemas: [buildProblemaCondicao({ cid10: 'J06.9' })],
      });

      const child2 = buildFaiChild({
        cpfCidadao: '22222222222',
        dataNascimento: new Date('1990-05-20T00:00:00Z').getTime(),
        sexo: 1,
        tipoAtendimento: 6,
        dataHoraInicial: TIMESTAMP + 3600000,
        dataHoraFinal: TIMESTAMP + 5400000,
        dumDaGestante: DUM_EPOCH,
        problemas: [buildProblemaCondicao({ cid10: 'O24.4' })],
      });

      const faiMaster = buildFaiMaster({
        header: buildHeaderTransport({
          cbo: '225142',
          cnes: '2695251',
          cnsProfissional: '980016287241133',
        }),
        children: [child1, child2],
        uuidFicha: 'fai-multi-001',
      });

      const transporte = buildDadoTransporte({
        tipo: 4,
        codIbge: '4205407',
        fichaBuffer: faiMaster,
      });

      ds.loadFile(transporte);

      const p1 = await ds.getPaciente('11111111111');
      expect(p1).not.toBeNull();
      expect(p1!.sexo).toBe('M');

      const p2 = await ds.getPaciente('22222222222');
      expect(p2).not.toBeNull();
      expect(p2!.sexo).toBe('F');
      expect(p2!.gestante).toBe(true);
    });
  });

  describe('tipo não suportado', () => {
    it('ignora ficha de tipo não suportado (ex: odontológico tipo 5)', async () => {
      // Criar um transporte com tipo 5 (odontológico)
      const transporte = buildDadoTransporte({
        tipo: 5, // AtendimentoOdontologico
        fichaBuffer: Buffer.from([0x00]), // STOP (struct vazia)
      });

      // Não deve lançar erro
      ds.loadFile(transporte);

      // Não deve ter pacientes
      const paciente = await ds.getPaciente('12345678901');
      expect(paciente).toBeNull();
    });
  });

  describe('retornos vazios', () => {
    it('retorna arrays vazios para paciente sem dados', async () => {
      expect(await ds.getAtendimentos(999)).toEqual([]);
      expect(await ds.getProblemas(999)).toEqual([]);
      expect(await ds.getAlergias(999)).toEqual([]);
      expect(await ds.getMedicamentos(999)).toEqual([]);
      expect(await ds.getSinaisVitais(999)).toEqual([]);
    });

    it('retorna null para profissional/estabelecimento inexistente', async () => {
      expect(await ds.getProfissional(999)).toBeNull();
      expect(await ds.getEstabelecimento(999)).toBeNull();
    });
  });
});
