/**
 * Testes dos deserializadores de structs LEDI/Thrift.
 */

import { describe, it, expect } from 'vitest';
import { ThriftReader } from '../../src/ledi/thrift-reader.js';
import {
  readDadoTransporte,
  readFichaAtendimentoIndividualMaster,
  readCadastroIndividual,
} from '../../src/ledi/deserializers.js';
import {
  ThriftBufferBuilder,
  TType,
  buildDadoTransporte,
  buildDadoInstalacao,
  buildVersao,
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

// Timestamp fixo para testes: 2025-11-20T09:00:00Z
const TIMESTAMP = new Date('2025-11-20T09:00:00Z').getTime();
const TIMESTAMP_FIM = new Date('2025-11-20T09:30:00Z').getTime();
const DUM_EPOCH = new Date('2025-04-10T00:00:00Z').getTime();
const NASCIMENTO_EPOCH = new Date('1985-03-15T00:00:00Z').getTime();

describe('readDadoTransporte', () => {
  it('deserializa envelope com FAI (tipo 4)', () => {
    const faiChild = buildFaiChild({
      cpfCidadao: '12345678901',
      dataNascimento: NASCIMENTO_EPOCH,
      sexo: 1, // F
      tipoAtendimento: 6, // prenatal
      dataHoraInicial: TIMESTAMP,
      dataHoraFinal: TIMESTAMP_FIM,
      problemas: [
        buildProblemaCondicao({ cid10: 'O24.4', situacao: 1 }),
      ],
    });

    const faiMaster = buildFaiMaster({
      header: buildHeaderTransport({
        cbo: '225142',
        cnes: '2695251',
        cnsProfissional: '980016287241133',
        dataAtendimento: TIMESTAMP,
      }),
      children: [faiChild],
      uuidFicha: 'fai-uuid-001',
      tpCdsOrigem: 3,
    });

    const transporteBuffer = buildDadoTransporte({
      uuid: 'transporte-uuid-001',
      tipo: 4,
      cnes: '2695251',
      codIbge: '4205407',
      fichaBuffer: faiMaster,
    });

    const reader = new ThriftReader(transporteBuffer);
    const result = readDadoTransporte(reader);

    expect(result.uuidDadoSerializado).toBe('transporte-uuid-001');
    expect(result.tipoDadoSerializado).toBe(4);
    expect(result.cnesDadoSerializado).toBe('2695251');
    expect(result.codIbge).toBe('4205407');
    expect(result.dadoSerializado).toBeInstanceOf(Buffer);
    expect(result.remetente).toBeDefined();
    expect(result.remetente.uuidInstalacao).toBe('rem-uuid');
    expect(result.originadora).toBeDefined();
    expect(result.versao).toEqual({ major: 5, minor: 3, revision: 25 });
  });

  it('deserializa envelope com FCI (tipo 2)', () => {
    const fciInner = buildCadastroIndividual({
      identificacao: buildIdentificacaoUsuario({
        nomeCidadao: 'Maria Silva Santos',
        cpfCidadao: '12345678901',
        dataNascimentoCidadao: NASCIMENTO_EPOCH,
        sexoCidadao: 1,
        racaCorCidadao: 3,
      }),
      condicoesDeSaude: buildCondicoesDeSaude({
        isGestante: true,
        maternidadeDeReferencia: 'Maternidade Regional de Blumenau',
      }),
      uuid: 'fci-uuid-001',
    });

    const transporteBuffer = buildDadoTransporte({
      tipo: 2,
      codIbge: '4205407',
      fichaBuffer: fciInner,
    });

    const reader = new ThriftReader(transporteBuffer);
    const result = readDadoTransporte(reader);

    expect(result.tipoDadoSerializado).toBe(2);
    expect(result.codIbge).toBe('4205407');
    expect(result.dadoSerializado.length).toBeGreaterThan(0);
  });

  it('lança erro se campo obrigatório ausente', () => {
    // DadoTransporte sem codIbge (campo obrigatório)
    const b = new ThriftBufferBuilder();
    b.writeStringField(1, 'uuid-test');
    b.writeI64Field(2, 4);
    b.writeStringField(3, '2695251');
    // codIbge (field 4) OMITIDO
    b.writeBinaryField(7, Buffer.from([0x00]));
    // remetente
    b.writeFieldHeader(TType.STRUCT, 8);
    const rem = buildDadoInstalacao({ uuidInstalacao: 'rem' });
    b.parts.push(rem);
    // originadora
    b.writeFieldHeader(TType.STRUCT, 9);
    b.parts.push(rem);
    // versao
    b.writeFieldHeader(TType.STRUCT, 10);
    const ver = buildVersao();
    b.parts.push(ver);
    b.writeStop();

    const reader = new ThriftReader(b.build());
    expect(() => readDadoTransporte(reader)).toThrow('Required field missing');
  });
});

describe('readFichaAtendimentoIndividualMaster', () => {
  it('deserializa FAI com 1 atendimento', () => {
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
        buildProblemaCondicao({ cid10: 'O24.4', ciap: 'W85', situacao: 1, isAvaliado: true }),
        buildProblemaCondicao({ cid10: 'O13', situacao: 1 }),
      ],
      medicamentos: [
        buildMedicamento({ codigoCatmat: 'BR0271157U0063', dose: '10UI', viaAdministracao: 8, usoContinuo: true }),
        buildMedicamento({ codigoCatmat: 'BR0267689U0042', dose: '250mg', viaAdministracao: 1, usoContinuo: true }),
      ],
    });

    const header = buildHeaderTransport({
      cbo: '225142',
      cnes: '2695251',
      cnsProfissional: '980016287241133',
      dataAtendimento: TIMESTAMP,
    });

    const master = buildFaiMaster({
      header,
      children: [child],
      uuidFicha: 'fai-maria-001',
      tpCdsOrigem: 3,
    });

    const reader = new ThriftReader(master);
    const result = readFichaAtendimentoIndividualMaster(reader);

    expect(result.uuidFicha).toBe('fai-maria-001');
    expect(result.tpCdsOrigem).toBe(3);
    expect(result.headerTransport).toBeDefined();
    expect(result.headerTransport!.cbo).toBe('225142');
    expect(result.headerTransport!.cnes).toBe('2695251');
    expect(result.headerTransport!.cnsProfissional).toBe('980016287241133');

    expect(result.atendimentosIndividuais).toHaveLength(1);
    const atend = result.atendimentosIndividuais[0];

    expect(atend.cpfCidadao).toBe('12345678901');
    expect(atend.dataNascimento).toBe(NASCIMENTO_EPOCH);
    expect(atend.sexo).toBe(1);
    expect(atend.tipoAtendimento).toBe(6);
    expect(atend.dumDaGestante).toBe(DUM_EPOCH);
    expect(atend.idadeGestacional).toBe(32);
    expect(atend.nuGestasPrevias).toBe(2);
    expect(atend.nuPartos).toBe(1);

    // Medições
    expect(atend.medicoes).toBeDefined();
    expect(atend.medicoes!.pressaoArterialSistolica).toBe(130);
    expect(atend.medicoes!.pressaoArterialDiastolica).toBe(85);
    expect(atend.medicoes!.peso).toBe(78.0);
    expect(atend.medicoes!.glicemiaCapilar).toBe(135);

    // Problemas
    expect(atend.problemasCondicoes).toHaveLength(2);
    expect(atend.problemasCondicoes[0].cid10).toBe('O24.4');
    expect(atend.problemasCondicoes[0].ciap).toBe('W85');
    expect(atend.problemasCondicoes[0].situacao).toBe(1);
    expect(atend.problemasCondicoes[0].isAvaliado).toBe(true);
    expect(atend.problemasCondicoes[1].cid10).toBe('O13');

    // Medicamentos
    expect(atend.medicamentos).toHaveLength(2);
    expect(atend.medicamentos![0].codigoCatmat).toBe('BR0271157U0063');
    expect(atend.medicamentos![0].dose).toBe('10UI');
    expect(atend.medicamentos![0].usoContinuo).toBe(true);
    expect(atend.medicamentos![1].codigoCatmat).toBe('BR0267689U0042');
  });

  it('deserializa FAI com múltiplos atendimentos', () => {
    const child1 = buildFaiChild({
      cpfCidadao: '11111111111',
      dataNascimento: NASCIMENTO_EPOCH,
      sexo: 0, // M
      tipoAtendimento: 1, // consulta
      dataHoraInicial: TIMESTAMP,
      dataHoraFinal: TIMESTAMP_FIM,
      problemas: [buildProblemaCondicao({ cid10: 'J06.9' })],
    });

    const child2 = buildFaiChild({
      cpfCidadao: '22222222222',
      dataNascimento: new Date('1990-01-01T00:00:00Z').getTime(),
      sexo: 1, // F
      tipoAtendimento: 2, // consulta dia
      dataHoraInicial: TIMESTAMP + 3600000,
      dataHoraFinal: TIMESTAMP + 5400000,
      problemas: [],
    });

    const master = buildFaiMaster({
      header: buildHeaderTransport({
        cbo: '225125',
        cnes: '2695251',
        cnsProfissional: '123456789012345',
      }),
      children: [child1, child2],
      uuidFicha: 'fai-multi-001',
    });

    const reader = new ThriftReader(master);
    const result = readFichaAtendimentoIndividualMaster(reader);

    expect(result.atendimentosIndividuais).toHaveLength(2);
    expect(result.atendimentosIndividuais[0].cpfCidadao).toBe('11111111111');
    expect(result.atendimentosIndividuais[0].sexo).toBe(0);
    expect(result.atendimentosIndividuais[1].cpfCidadao).toBe('22222222222');
    expect(result.atendimentosIndividuais[1].sexo).toBe(1);
  });

  it('lança erro se uuidFicha ausente', async () => {
    const child = buildFaiChild({
      dataNascimento: NASCIMENTO_EPOCH,
      sexo: 1,
      tipoAtendimento: 1,
      dataHoraInicial: TIMESTAMP,
      dataHoraFinal: TIMESTAMP_FIM,
      problemas: [],
    });

    // FAI sem uuidFicha
    const { ThriftBufferBuilder, TType } = await import('./thrift-test-helpers.js');
    const b = new ThriftBufferBuilder();
    b.writeFieldHeader(TType.LIST, 2);
    b.writeListHeader(TType.STRUCT, 1);
    b.parts.push(child);
    // uuidFicha (field 3) OMITIDO
    b.writeStop();

    const reader = new ThriftReader(b.build());
    expect(() => readFichaAtendimentoIndividualMaster(reader)).toThrow('Required field missing');
  });
});

describe('readCadastroIndividual', () => {
  it('deserializa FCI com dados demográficos completos', () => {
    const fci = buildCadastroIndividual({
      identificacao: buildIdentificacaoUsuario({
        nomeCidadao: 'Maria Silva Santos',
        nomeSocialCidadao: 'Maria Santos',
        cpfCidadao: '12345678901',
        cnsCidadao: '980016287241133',
        dataNascimentoCidadao: NASCIMENTO_EPOCH,
        sexoCidadao: 1,
        racaCorCidadao: 3,
        nomeMaeCidadao: 'Ana Silva',
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

    const reader = new ThriftReader(fci);
    const result = readCadastroIndividual(reader);

    expect(result.uuid).toBe('fci-maria-001');

    // Identificação
    const id = result.identificacaoUsuarioCidadao!;
    expect(id.nomeCidadao).toBe('Maria Silva Santos');
    expect(id.nomeSocialCidadao).toBe('Maria Santos');
    expect(id.cpfCidadao).toBe('12345678901');
    expect(id.cnsCidadao).toBe('980016287241133');
    expect(id.dataNascimentoCidadao).toBe(NASCIMENTO_EPOCH);
    expect(id.sexoCidadao).toBe(1);
    expect(id.racaCorCidadao).toBe(3);
    expect(id.nomeMaeCidadao).toBe('Ana Silva');
    expect(id.telefoneCelular).toBe('47999998888');

    // Condições de saúde
    const cond = result.condicoesDeSaude!;
    expect(cond.isGestante).toBe(true);
    expect(cond.maternidadeDeReferencia).toBe('Maternidade Regional de Blumenau');
    expect(cond.isHipertenso).toBe(true);
    expect(cond.isDiabetico).toBe(true);
  });

  it('deserializa FCI mínimo (sem condições de saúde)', () => {
    const fci = buildCadastroIndividual({
      identificacao: buildIdentificacaoUsuario({
        nomeCidadao: 'José Souza',
        cpfCidadao: '98765432100',
        dataNascimentoCidadao: new Date('1970-01-01T00:00:00Z').getTime(),
        sexoCidadao: 0,
        racaCorCidadao: 1,
      }),
      uuid: 'fci-jose-001',
    });

    const reader = new ThriftReader(fci);
    const result = readCadastroIndividual(reader);

    expect(result.uuid).toBe('fci-jose-001');
    expect(result.identificacaoUsuarioCidadao!.nomeCidadao).toBe('José Souza');
    expect(result.identificacaoUsuarioCidadao!.sexoCidadao).toBe(0);
    expect(result.condicoesDeSaude).toBeUndefined();
  });
});
