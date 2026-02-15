/**
 * Testes do LediMapper — conversão LEDI/Thrift → tipos IPM.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  mapFai,
  mapFci,
  mergePaciente,
  epochToDate,
  epochToDatetime,
  epochToYearMonth,
  resetIdCounter,
} from '../../src/ledi/ledi-mapper.js';
import type {
  FichaAtendimentoIndividualMasterThrift,
  FichaAtendimentoIndividualChildThrift,
  CadastroIndividualThrift,
  MedicoesThrift,
  ProblemaCondicaoThrift,
  MedicamentoThrift,
} from '../../src/types/ledi.js';

const TIMESTAMP = new Date('2025-11-20T09:00:00Z').getTime();
const TIMESTAMP_FIM = new Date('2025-11-20T09:30:00Z').getTime();
const DUM_EPOCH = new Date('2025-04-10T00:00:00Z').getTime();
const NASCIMENTO_EPOCH = new Date('1985-03-15T00:00:00Z').getTime();

beforeEach(() => {
  resetIdCounter(1);
});

describe('epochToDate', () => {
  it('converte epoch ms para YYYY-MM-DD', () => {
    expect(epochToDate(DUM_EPOCH)).toBe('2025-04-10');
  });

  it('converte epoch 0 (1970-01-01)', () => {
    expect(epochToDate(0)).toBe('1970-01-01');
  });
});

describe('epochToDatetime', () => {
  it('converte epoch ms para ISO datetime', () => {
    const result = epochToDatetime(TIMESTAMP);
    expect(result).toBe('2025-11-20T09:00:00.000Z');
  });
});

describe('epochToYearMonth', () => {
  it('converte epoch ms para YYYY-MM', () => {
    expect(epochToYearMonth(DUM_EPOCH)).toBe('2025-04');
  });

  it('converte janeiro corretamente (mês 1)', () => {
    const jan = new Date('2026-01-15T00:00:00Z').getTime();
    expect(epochToYearMonth(jan)).toBe('2026-01');
  });
});

describe('mapFai', () => {
  function makeFaiMaster(
    children: FichaAtendimentoIndividualChildThrift[],
    headerOpts: Partial<{ cbo: string; cnes: string; cnsProfissional: string }> = {},
  ): FichaAtendimentoIndividualMasterThrift {
    return {
      headerTransport: {
        cbo: headerOpts.cbo ?? '225142',
        cnes: headerOpts.cnes ?? '2695251',
        cnsProfissional: headerOpts.cnsProfissional ?? '980016287241133',
        dataAtendimento: TIMESTAMP,
      },
      atendimentosIndividuais: children,
      uuidFicha: 'fai-test-001',
    };
  }

  function makeChild(overrides: Partial<FichaAtendimentoIndividualChildThrift> = {}): FichaAtendimentoIndividualChildThrift {
    return {
      dataNascimento: NASCIMENTO_EPOCH,
      localDeAtendimento: 1,
      sexo: 1,
      turno: 1,
      tipoAtendimento: 6,
      problemasCondicoes: [],
      dataHoraInicialAtendimento: TIMESTAMP,
      dataHoraFinalAtendimento: TIMESTAMP_FIM,
      ...overrides,
    };
  }

  it('mapeia FAI com 1 atendimento gestante', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
      dumDaGestante: DUM_EPOCH,
      idadeGestacional: 32,
      nuGestasPrevias: 2,
      nuPartos: 1,
      medicoes: {
        pressaoArterialSistolica: 130,
        pressaoArterialDiastolica: 85,
        peso: 78.0,
        glicemiaCapilar: 135,
      },
      problemasCondicoes: [
        { cid10: 'O24.4', ciap: 'W85', situacao: 1, isAvaliado: true },
        { cid10: 'O13', situacao: 1 },
      ],
      medicamentos: [
        { codigoCatmat: 'BR0271157U0063', dose: '10UI', viaAdministracao: 8, usoContinuo: true },
      ],
    });

    const result = mapFai(makeFaiMaster([child]));

    expect(result).toHaveLength(1);
    const m = result[0];

    // Paciente
    expect(m.paciente.cpf).toBe('12345678901');
    expect(m.paciente.sexo).toBe('F');
    expect(m.paciente.gestante).toBe(true);
    expect(m.paciente.dum).toBe('2025-04-10');
    expect(m.paciente.gestas_previas).toBe(2);
    expect(m.paciente.partos).toBe(1);

    // Atendimento
    expect(m.atendimento.tipo).toBe('prenatal');
    expect(m.atendimento.data_inicio).toBe(epochToDatetime(TIMESTAMP));
    expect(m.atendimento.data_fim).toBe(epochToDatetime(TIMESTAMP_FIM));

    // Profissional
    expect(m.profissional.cns).toBe('980016287241133');
    expect(m.profissional.cbo).toBe('225142');

    // Estabelecimento
    expect(m.estabelecimento.cnes).toBe('2695251');

    // Problemas
    expect(m.problemas).toHaveLength(2);
    expect(m.problemas[0].cid).toBe('O24.4');
    expect(m.problemas[0].ciap).toBe('W85');
    expect(m.problemas[0].ativo).toBe(true);
    expect(m.problemas[0].descricao).toContain('CID-10 O24.4');
    expect(m.problemas[0].descricao).toContain('CIAP-2 W85');
    expect(m.problemas[1].cid).toBe('O13');

    // Medicamentos
    expect(m.medicamentos).toHaveLength(1);
    expect(m.medicamentos[0].codigo_catmat).toBe('BR0271157U0063');
    expect(m.medicamentos[0].dosagem).toBe('10UI');
    expect(m.medicamentos[0].via_administracao).toBe('subcutânea');
    expect(m.medicamentos[0].ativo).toBe(true);

    // Sinais vitais
    expect(m.sinaisVitais).toHaveLength(1);
    expect(m.sinaisVitais[0].pa_sistolica).toBe(130);
    expect(m.sinaisVitais[0].pa_diastolica).toBe(85);
    expect(m.sinaisVitais[0].peso).toBe(78.0);
    expect(m.sinaisVitais[0].glicemia_capilar).toBe(135);
    expect(m.sinaisVitais[0].semanas_gestacionais).toBe(32);
  });

  it('mapeia atendimento masculino não-gestante', () => {
    const child = makeChild({
      cpfCidadao: '99988877766',
      sexo: 0, // M
      tipoAtendimento: 1, // consulta
      problemasCondicoes: [
        { cid10: 'J06.9', situacao: 1 },
      ],
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].paciente.sexo).toBe('M');
    expect(result[0].paciente.gestante).toBe(false);
    expect(result[0].atendimento.tipo).toBe('consulta');
  });

  it('mapeia múltiplos atendimentos na mesma FAI', () => {
    const child1 = makeChild({ cpfCidadao: '11111111111' });
    const child2 = makeChild({ cpfCidadao: '22222222222' });
    const child3 = makeChild({ cpfCidadao: '33333333333' });

    const result = mapFai(makeFaiMaster([child1, child2, child3]));
    expect(result).toHaveLength(3);
    expect(result[0].paciente.cpf).toBe('11111111111');
    expect(result[1].paciente.cpf).toBe('22222222222');
    expect(result[2].paciente.cpf).toBe('33333333333');
  });

  it('todos compartilham o mesmo profissional e estabelecimento', () => {
    const child1 = makeChild({ cpfCidadao: '11111111111' });
    const child2 = makeChild({ cpfCidadao: '22222222222' });

    const result = mapFai(makeFaiMaster([child1, child2]));
    expect(result[0].profissional.id).toBe(result[1].profissional.id);
    expect(result[0].estabelecimento.id).toBe(result[1].estabelecimento.id);
  });

  it('mapeia problema com CIAP-2 apenas', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
      problemasCondicoes: [
        { ciap: 'W78', situacao: 1 },
      ],
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].problemas[0].cid).toBe('W78');
    expect(result[0].problemas[0].ciap).toBe('W78');
    expect(result[0].problemas[0].descricao).toContain('CIAP-2 W78');
  });

  it('mapeia problema resolvido (situacao=2) como inativo', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
      problemasCondicoes: [
        { cid10: 'J06.9', situacao: 2 },
      ],
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].problemas[0].ativo).toBe(false);
  });

  it('mapeia via de administração oral', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
      medicamentos: [
        { codigoCatmat: 'BR0267689U0042', dose: '250mg', viaAdministracao: 1 },
      ],
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].medicamentos[0].via_administracao).toBe('oral');
  });

  it('cria sinal vital só com idade gestacional se não há medições', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
      idadeGestacional: 28,
      // SEM medicoes
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].sinaisVitais).toHaveLength(1);
    expect(result[0].sinaisVitais[0].semanas_gestacionais).toBe(28);
    expect(result[0].sinaisVitais[0].pa_sistolica).toBeUndefined();
  });

  it('atendimento sem medições e sem IG não gera sinais vitais', () => {
    const child = makeChild({
      cpfCidadao: '12345678901',
    });

    const result = mapFai(makeFaiMaster([child]));
    expect(result[0].sinaisVitais).toHaveLength(0);
  });
});

describe('mapFci', () => {
  it('mapeia FCI com dados completos', () => {
    const fci: CadastroIndividualThrift = {
      identificacaoUsuarioCidadao: {
        nomeCidadao: 'Maria Silva Santos',
        nomeSocialCidadao: 'Maria Santos',
        cpfCidadao: '12345678901',
        cnsCidadao: '980016287241133',
        dataNascimentoCidadao: NASCIMENTO_EPOCH,
        sexoCidadao: 1,
        racaCorCidadao: 3,
        telefoneCelular: '47999998888',
      },
      condicoesDeSaude: {
        isGestante: true,
        maternidadeDeReferencia: 'Maternidade Regional de Blumenau',
        isHipertenso: true,
        isDiabetico: true,
      },
      uuid: 'fci-001',
    };

    const result = mapFci(fci);

    expect(result.nome).toBe('Maria Silva Santos');
    expect(result.nome_social).toBe('Maria Santos');
    expect(result.cpf).toBe('12345678901');
    expect(result.cns).toBe('980016287241133');
    expect(result.data_nascimento).toBe('1985-03-15');
    expect(result.sexo).toBe('F');
    expect(result.raca_cor).toBe('parda');
    expect(result.telefone).toBe('47999998888');
    expect(result.gestante).toBe(true);
    expect(result.maternidade_referencia).toBe('Maternidade Regional de Blumenau');
  });

  it('mapeia FCI masculino branco', () => {
    const fci: CadastroIndividualThrift = {
      identificacaoUsuarioCidadao: {
        nomeCidadao: 'José Souza',
        cpfCidadao: '98765432100',
        dataNascimentoCidadao: new Date('1970-01-01T00:00:00Z').getTime(),
        sexoCidadao: 0,
        racaCorCidadao: 1,
      },
      uuid: 'fci-jose',
    };

    const result = mapFci(fci);
    expect(result.nome).toBe('José Souza');
    expect(result.sexo).toBe('M');
    expect(result.raca_cor).toBe('branca');
    expect(result.gestante).toBeUndefined();
  });

  it('mapeia FCI sem identificação (edge case)', () => {
    const fci: CadastroIndividualThrift = {
      uuid: 'fci-empty',
    };

    const result = mapFci(fci);
    expect(result.nome).toBe('');
    expect(result.cpf).toBe('');
  });
});

describe('mergePaciente', () => {
  it('combina FCI (nome/raça) com FAI (obstétrico)', () => {
    const fromFci = {
      id: 1,
      nome: 'Maria Silva Santos',
      cpf: '12345678901',
      data_nascimento: '1985-03-15',
      sexo: 'F' as const,
      raca_cor: 'parda' as const,
      telefone: '47999998888',
      maternidade_referencia: 'Maternidade Regional de Blumenau',
    };

    const fromFai = {
      id: 2,
      nome: '',
      cpf: '12345678901',
      data_nascimento: '1985-03-15',
      sexo: 'F' as const,
      gestante: true,
      dum: '2025-04-10',
      gestas_previas: 2,
      partos: 1,
    };

    const merged = mergePaciente(fromFci, fromFai);

    // FCI prevalece para nome/raça
    expect(merged.nome).toBe('Maria Silva Santos');
    expect(merged.raca_cor).toBe('parda');
    expect(merged.telefone).toBe('47999998888');
    expect(merged.maternidade_referencia).toBe('Maternidade Regional de Blumenau');

    // FAI prevalece para obstétrico
    expect(merged.gestante).toBe(true);
    expect(merged.dum).toBe('2025-04-10');
    expect(merged.gestas_previas).toBe(2);
    expect(merged.partos).toBe(1);

    // ID do FCI prevalece
    expect(merged.id).toBe(1);
  });

  it('merge com FCI vazio usa dados do FAI', () => {
    const fromFci = {};
    const fromFai = {
      id: 5,
      nome: 'Paciente FAI',
      cpf: '11111111111',
      data_nascimento: '1990-01-01',
      sexo: 'M' as const,
      raca_cor: 'branca' as const,
    };

    const merged = mergePaciente(fromFci, fromFai);
    expect(merged.nome).toBe('Paciente FAI');
    expect(merged.cpf).toBe('11111111111');
    expect(merged.id).toBe(5);
  });
});
