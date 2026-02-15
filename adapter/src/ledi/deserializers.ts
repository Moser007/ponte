/**
 * Deserializadores para structs LEDI/Thrift.
 *
 * Cada função lê uma struct Thrift específica usando o ThriftReader.
 * Os field IDs correspondem às definições .thrift oficiais do laboratório Bridge/UFSC.
 */

import { ThriftReader, ThriftType } from './thrift-reader.js';
import type {
  DadoTransporteThrift,
  DadoInstalacaoThrift,
  VersaoThrift,
  VariasLotacoesHeaderThrift,
  FichaAtendimentoIndividualMasterThrift,
  FichaAtendimentoIndividualChildThrift,
  MedicoesThrift,
  ProblemaCondicaoThrift,
  MedicamentoThrift,
  EncaminhamentoExternoThrift,
  ExameThrift,
  ResultadoExameThrift,
  CadastroIndividualThrift,
  IdentificacaoUsuarioCidadaoThrift,
  CondicoesDeSaudeThrift,
} from '../types/ledi.js';
import { TipoDadoSerializado } from '../types/ledi.js';

// ── DadoTransporteThrift (envelope) ────────────────────────────

export function readDadoTransporte(reader: ThriftReader): DadoTransporteThrift {
  const result: Partial<DadoTransporteThrift> = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.uuidDadoSerializado = reader.readString(); break;
      case 2: result.tipoDadoSerializado = reader.readI64() as TipoDadoSerializado; break;
      case 3: result.cnesDadoSerializado = reader.readString(); break;
      case 4: result.codIbge = reader.readString(); break;
      case 5: result.ineDadoSerializado = reader.readString(); break;
      case 6: result.numLote = reader.readI64(); break;
      case 7: result.dadoSerializado = reader.readBinary(); break;
      case 8: result.remetente = readDadoInstalacao(reader); break;
      case 9: result.originadora = readDadoInstalacao(reader); break;
      case 10: result.versao = readVersao(reader); break;
      default: reader.skip(fieldType);
    }
  }

  assertField(result.uuidDadoSerializado, 'DadoTransporte.uuidDadoSerializado');
  assertField(result.tipoDadoSerializado !== undefined, 'DadoTransporte.tipoDadoSerializado');
  assertField(result.cnesDadoSerializado, 'DadoTransporte.cnesDadoSerializado');
  assertField(result.codIbge, 'DadoTransporte.codIbge');
  assertField(result.dadoSerializado, 'DadoTransporte.dadoSerializado');
  assertField(result.remetente, 'DadoTransporte.remetente');
  assertField(result.originadora, 'DadoTransporte.originadora');
  assertField(result.versao, 'DadoTransporte.versao');

  return result as DadoTransporteThrift;
}

function readDadoInstalacao(reader: ThriftReader): DadoInstalacaoThrift {
  const result: DadoInstalacaoThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.contraChave = reader.readString(); break;
      case 2: result.uuidInstalacao = reader.readString(); break;
      case 3: result.cpfOuCnpj = reader.readString(); break;
      case 4: result.nomeOuRazaoSocial = reader.readString(); break;
      case 5: result.fpiOuCnpj = reader.readString(); break;
      case 6: result.email = reader.readString(); break;
      case 7: result.telefone = reader.readString(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readVersao(reader: ThriftReader): VersaoThrift {
  let major = 0, minor = 0, revision = 0;

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: major = reader.readI32(); break;
      case 2: minor = reader.readI32(); break;
      case 3: revision = reader.readI32(); break;
      default: reader.skip(fieldType);
    }
  }

  return { major, minor, revision };
}

// ── Header de lotação ──────────────────────────────────────────

function readHeaderTransport(reader: ThriftReader): VariasLotacoesHeaderThrift {
  const result: Partial<VariasLotacoesHeaderThrift> = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.cbo = reader.readString(); break;
      case 2: result.cnes = reader.readString(); break;
      case 3: result.codigoIne = reader.readString(); break;
      case 4: result.dataAtendimento = reader.readI64(); break;
      case 5: result.cnsProfissional = reader.readString(); break;
      default: reader.skip(fieldType);
    }
  }

  return result as VariasLotacoesHeaderThrift;
}

// ── Ficha de Atendimento Individual (FAI) ──────────────────────

export function readFichaAtendimentoIndividualMaster(reader: ThriftReader): FichaAtendimentoIndividualMasterThrift {
  const result: Partial<FichaAtendimentoIndividualMasterThrift> = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.headerTransport = readHeaderTransport(reader); break;
      case 2: {
        const { size } = reader.readListHeader();
        result.atendimentosIndividuais = [];
        for (let i = 0; i < size; i++) {
          result.atendimentosIndividuais.push(readFichaAtendimentoIndividualChild(reader));
        }
        break;
      }
      case 3: result.uuidFicha = reader.readString(); break;
      case 4: result.tpCdsOrigem = reader.readI32(); break;
      default: reader.skip(fieldType);
    }
  }

  assertField(result.atendimentosIndividuais, 'FAI.atendimentosIndividuais');
  assertField(result.uuidFicha, 'FAI.uuidFicha');

  return result as FichaAtendimentoIndividualMasterThrift;
}

function readFichaAtendimentoIndividualChild(reader: ThriftReader): FichaAtendimentoIndividualChildThrift {
  const result: Partial<FichaAtendimentoIndividualChildThrift> = {
    problemasCondicoes: [],
  };

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.numeroProntuario = reader.readString(); break;
      case 2: result.cnsCidadao = reader.readString(); break;
      case 3: result.dataNascimento = reader.readI64(); break;
      case 4: result.localDeAtendimento = reader.readI64(); break;
      case 5: result.sexo = reader.readI64(); break;
      case 6: result.turno = reader.readI64(); break;
      case 7: result.tipoAtendimento = reader.readI64(); break;
      case 8: result.pesoAoNascer = reader.readDouble(); break;
      case 9: result.dumDaGestante = reader.readI64(); break;
      case 10: result.idadeGestacional = reader.readI32(); break;
      case 11: result.aleitamentoMaterno = reader.readI64(); break;
      case 12: result.stGravidezPlanejada = reader.readBool(); break;
      case 13: result.nuGestasPrevias = reader.readI32(); break;
      case 14: result.nuPartos = reader.readI32(); break;
      case 15: result.medicoes = readMedicoes(reader); break;
      case 16: {
        const { size } = reader.readListHeader();
        result.problemasCondicoes = [];
        for (let i = 0; i < size; i++) {
          result.problemasCondicoes.push(readProblemaCondicao(reader));
        }
        break;
      }
      case 17: {
        const { size } = reader.readListHeader();
        result.exame = [];
        for (let i = 0; i < size; i++) {
          result.exame.push(readExame(reader));
        }
        break;
      }
      case 18: {
        const { size } = reader.readListHeader();
        result.medicamentos = [];
        for (let i = 0; i < size; i++) {
          result.medicamentos.push(readMedicamento(reader));
        }
        break;
      }
      case 19: {
        const { size } = reader.readListHeader();
        result.encaminhamentos = [];
        for (let i = 0; i < size; i++) {
          result.encaminhamentos.push(readEncaminhamentoExterno(reader));
        }
        break;
      }
      case 20: {
        const { size } = reader.readListHeader();
        result.resultadosExames = [];
        for (let i = 0; i < size; i++) {
          result.resultadosExames.push(readResultadoExame(reader));
        }
        break;
      }
      case 21: {
        const { size } = reader.readListHeader();
        result.condutas = [];
        for (let i = 0; i < size; i++) {
          result.condutas.push(reader.readI64());
        }
        break;
      }
      case 26: result.dataHoraInicialAtendimento = reader.readI64(); break;
      case 27: result.dataHoraFinalAtendimento = reader.readI64(); break;
      case 28: result.cpfCidadao = reader.readString(); break;
      default: reader.skip(fieldType);
    }
  }

  return result as FichaAtendimentoIndividualChildThrift;
}

function readMedicoes(reader: ThriftReader): MedicoesThrift {
  const result: MedicoesThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 3: result.pressaoArterialSistolica = reader.readI32(); break;
      case 4: result.pressaoArterialDiastolica = reader.readI32(); break;
      case 5: result.frequenciaRespiratoria = reader.readI32(); break;
      case 6: result.frequenciaCardiaca = reader.readI32(); break;
      case 7: result.temperatura = reader.readDouble(); break;
      case 8: result.saturacaoO2 = reader.readI32(); break;
      case 9: result.glicemiaCapilar = reader.readI32(); break;
      case 11: result.peso = reader.readDouble(); break;
      case 12: result.altura = reader.readDouble(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readProblemaCondicao(reader: ThriftReader): ProblemaCondicaoThrift {
  const result: ProblemaCondicaoThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 4: result.ciap = reader.readString(); break;
      case 5: result.cid10 = reader.readString(); break;
      case 6: result.situacao = reader.readI64(); break;
      case 7: result.dataInicioProblema = reader.readI64(); break;
      case 9: result.isAvaliado = reader.readBool(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readMedicamento(reader: ThriftReader): MedicamentoThrift {
  const result: MedicamentoThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.codigoCatmat = reader.readString(); break;
      case 2: result.viaAdministracao = reader.readI64(); break;
      case 3: result.dose = reader.readString(); break;
      case 5: result.usoContinuo = reader.readBool(); break;
      case 7: result.doseFrequencia = reader.readString(); break;
      case 10: result.dtInicioTratamento = reader.readI64(); break;
      case 11: result.duracaoTratamento = reader.readI32(); break;
      case 13: result.quantidadeReceitada = reader.readI32(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readEncaminhamentoExterno(reader: ThriftReader): EncaminhamentoExternoThrift {
  const result: EncaminhamentoExternoThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.especialidade = reader.readI64(); break;
      case 2: result.hipoteseDiagnosticoCID10 = reader.readString(); break;
      case 4: result.classificacaoRisco = reader.readI64(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readExame(reader: ThriftReader): ExameThrift {
  const result: ExameThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.codigoExame = reader.readString(); break;
      case 2: result.solicitadoAvaliado = reader.readI64(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readResultadoExame(reader: ThriftReader): ResultadoExameThrift {
  const result: ResultadoExameThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.codigoExame = reader.readString(); break;
      case 2: result.resultado = reader.readI64(); break;
      case 3: result.valor = reader.readString(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

// ── Cadastro Individual (FCI) ──────────────────────────────────

export function readCadastroIndividual(reader: ThriftReader): CadastroIndividualThrift {
  const result: Partial<CadastroIndividualThrift> = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.identificacaoUsuarioCidadao = readIdentificacaoUsuario(reader); break;
      case 2: result.condicoesDeSaude = readCondicoesDeSaude(reader); break;
      case 3: result.uuidFichaOriginadora = reader.readString(); break;
      case 4: result.fichaAtualizada = reader.readBool(); break;
      case 5: result.tpCdsOrigem = reader.readI32(); break;
      case 6: result.uuid = reader.readString(); break;
      case 7: result.headerTransport = readHeaderTransport(reader); break;
      default: reader.skip(fieldType);
    }
  }

  return result as CadastroIndividualThrift;
}

function readIdentificacaoUsuario(reader: ThriftReader): IdentificacaoUsuarioCidadaoThrift {
  const result: IdentificacaoUsuarioCidadaoThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.nomeCidadao = reader.readString(); break;
      case 2: result.nomeSocialCidadao = reader.readString(); break;
      case 3: result.dataNascimentoCidadao = reader.readI64(); break;
      case 4: result.sexoCidadao = reader.readI64(); break;
      case 5: result.racaCorCidadao = reader.readI64(); break;
      case 6: result.numNisPisPasep = reader.readString(); break;
      case 7: result.portariaNaturalizacao = reader.readString(); break;
      case 8: result.dtEntradaBrasil = reader.readI64(); break;
      case 9: result.cnsCidadao = reader.readString(); break;
      case 10: result.cpfCidadao = reader.readString(); break;
      case 11: result.cnsResponsavelFamiliar = reader.readString(); break;
      case 12: result.nomeMaeCidadao = reader.readString(); break;
      case 13: result.microarea = reader.readString(); break;
      case 14: result.stForaArea = reader.readBool(); break;
      case 15: result.telefoneCelular = reader.readString(); break;
      case 16: result.emailCidadao = reader.readString(); break;
      case 17: result.nacionalidadeCidadao = reader.readI64(); break;
      case 18: result.paisNascimento = reader.readI64(); break;
      case 19: result.dtNaturalizacao = reader.readI64(); break;
      case 20: result.cpfResponsavelFamiliar = reader.readString(); break;
      case 21: result.statusEhResponsavel = reader.readBool(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

function readCondicoesDeSaude(reader: ThriftReader): CondicoesDeSaudeThrift {
  const result: CondicoesDeSaudeThrift = {};

  for (;;) {
    const { fieldType, fieldId } = reader.readFieldHeader();
    if (fieldType === ThriftType.STOP) break;

    switch (fieldId) {
      case 1: result.isGestante = reader.readBool(); break;
      case 2: result.maternidadeDeReferencia = reader.readString(); break;
      case 3: result.isTabagista = reader.readBool(); break;
      case 4: result.isAlcoolista = reader.readBool(); break;
      case 5: result.isEpilepsiaOuConvulsao = reader.readBool(); break;
      case 6: result.isDeficienteVisual = reader.readBool(); break;
      case 7: result.isDeficienteAuditivo = reader.readBool(); break;
      case 8: result.isDeficienteFisico = reader.readBool(); break;
      case 9: result.isDeficienteMental = reader.readBool(); break;
      case 10: result.isAcamado = reader.readBool(); break;
      case 11: result.isDomiciliado = reader.readBool(); break;
      case 12: result.isHipertenso = reader.readBool(); break;
      case 13: result.isDiabetico = reader.readBool(); break;
      case 14: result.isUsuarioSaudeMental = reader.readBool(); break;
      case 15: result.isUsaOutrasPraticasIntegrativas = reader.readBool(); break;
      case 16: result.isTeveDoeCardiaca = reader.readBool(); break;
      case 17: result.isTeveInternacao12Meses = reader.readBool(); break;
      case 18: result.descricaoCausaInternacao12Meses = reader.readString(); break;
      case 19: result.isTeveAvc = reader.readBool(); break;
      case 20: result.isTeveDoencaRins = reader.readBool(); break;
      case 21: result.isTeveMalaria = reader.readBool(); break;
      case 22: result.isTeveHanseniase = reader.readBool(); break;
      case 23: result.isTeveTuberculose = reader.readBool(); break;
      case 24: result.isTemCancer = reader.readBool(); break;
      case 25: result.stTeveDoencaRespiratoria = reader.readBool(); break;
      case 26: result.stUsaPlantasMedicinais = reader.readBool(); break;
      default: reader.skip(fieldType);
    }
  }

  return result;
}

// ── Utilidades ──────────────────────────────────────────────────

function assertField(value: unknown, name: string): asserts value {
  if (value === undefined || value === null) {
    throw new Error(`Required field missing: ${name}`);
  }
}
