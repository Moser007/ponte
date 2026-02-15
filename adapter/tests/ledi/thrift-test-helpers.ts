/**
 * Helpers para construção de buffers Thrift TBinaryProtocol para testes.
 *
 * Equivalente a um ThriftWriter mínimo — gera bytes no formato TBinaryProtocol
 * que o ThriftReader pode deserializar.
 */

/** Thrift field type IDs (TBinaryProtocol) */
export const TType = {
  STOP: 0,
  BOOL: 2,     // BOOL_FALSE (TBinaryProtocol usa type 2 para bool fields)
  BYTE: 3,
  DOUBLE: 4,
  I16: 6,
  I32: 8,
  I64: 10,
  STRING: 11,
  STRUCT: 12,
  MAP: 13,
  SET: 14,
  LIST: 15,
} as const;

export class ThriftBufferBuilder {
  parts: Buffer[] = [];

  /** Escreve um byte bruto */
  writeByte(val: number): this {
    const buf = Buffer.alloc(1);
    buf.writeInt8(val);
    this.parts.push(buf);
    return this;
  }

  writeI16(val: number): this {
    const buf = Buffer.alloc(2);
    buf.writeInt16BE(val);
    this.parts.push(buf);
    return this;
  }

  writeI32(val: number): this {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(val);
    this.parts.push(buf);
    return this;
  }

  writeI64(val: number): this {
    const buf = Buffer.alloc(8);
    // Split into high and low 32 bits
    const hi = Math.floor(val / 0x100000000);
    const lo = val >>> 0;
    buf.writeInt32BE(hi, 0);
    buf.writeUInt32BE(lo, 4);
    this.parts.push(buf);
    return this;
  }

  writeDouble(val: number): this {
    const buf = Buffer.alloc(8);
    buf.writeDoubleBE(val);
    this.parts.push(buf);
    return this;
  }

  writeBool(val: boolean): this {
    return this.writeByte(val ? 1 : 0);
  }

  writeString(val: string): this {
    const strBuf = Buffer.from(val, 'utf8');
    this.writeI32(strBuf.length);
    this.parts.push(strBuf);
    return this;
  }

  writeBinary(val: Buffer): this {
    this.writeI32(val.length);
    this.parts.push(val);
    return this;
  }

  /** Escreve um field header: type (byte) + field ID (i16) */
  writeFieldHeader(fieldType: number, fieldId: number): this {
    this.writeByte(fieldType);
    this.writeI16(fieldId);
    return this;
  }

  /** Escreve STOP (marca fim de struct) */
  writeStop(): this {
    return this.writeByte(TType.STOP);
  }

  /** Escreve um list header: element type (byte) + size (i32) */
  writeListHeader(elementType: number, size: number): this {
    this.writeByte(elementType);
    this.writeI32(size);
    return this;
  }

  /** Escreve um map header: key type + value type + size */
  writeMapHeader(keyType: number, valueType: number, size: number): this {
    this.writeByte(keyType);
    this.writeByte(valueType);
    this.writeI32(size);
    return this;
  }

  /** Monta o buffer final */
  build(): Buffer {
    return Buffer.concat(this.parts);
  }

  /** Atalho: campo string */
  writeStringField(fieldId: number, val: string): this {
    return this.writeFieldHeader(TType.STRING, fieldId).writeString(val);
  }

  /** Atalho: campo i32 */
  writeI32Field(fieldId: number, val: number): this {
    return this.writeFieldHeader(TType.I32, fieldId).writeI32(val);
  }

  /** Atalho: campo i64 */
  writeI64Field(fieldId: number, val: number): this {
    return this.writeFieldHeader(TType.I64, fieldId).writeI64(val);
  }

  /** Atalho: campo double */
  writeDoubleField(fieldId: number, val: number): this {
    return this.writeFieldHeader(TType.DOUBLE, fieldId).writeDouble(val);
  }

  /** Atalho: campo bool */
  writeBoolField(fieldId: number, val: boolean): this {
    return this.writeFieldHeader(TType.BOOL, fieldId).writeBool(val);
  }

  /** Atalho: campo binary */
  writeBinaryField(fieldId: number, val: Buffer): this {
    return this.writeFieldHeader(TType.STRING, fieldId).writeBinary(val);
  }
}

// ── Builders para structs LEDI comuns ────────────────────────────

/** Constrói um DadoInstalacao Thrift struct */
export function buildDadoInstalacao(
  opts: { contraChave?: string; uuidInstalacao?: string; cpfOuCnpj?: string } = {},
): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.contraChave) b.writeStringField(1, opts.contraChave);
  if (opts.uuidInstalacao) b.writeStringField(2, opts.uuidInstalacao);
  if (opts.cpfOuCnpj) b.writeStringField(3, opts.cpfOuCnpj);
  b.writeStop();
  return b.build();
}

/** Constrói um Versao Thrift struct */
export function buildVersao(major = 5, minor = 3, revision = 25): Buffer {
  const b = new ThriftBufferBuilder();
  b.writeI32Field(1, major);
  b.writeI32Field(2, minor);
  b.writeI32Field(3, revision);
  b.writeStop();
  return b.build();
}

/** Constrói um HeaderTransport Thrift struct */
export function buildHeaderTransport(opts: {
  cbo?: string;
  cnes?: string;
  codigoIne?: string;
  dataAtendimento?: number;
  cnsProfissional?: string;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.cbo) b.writeStringField(1, opts.cbo);
  if (opts.cnes) b.writeStringField(2, opts.cnes);
  if (opts.codigoIne) b.writeStringField(3, opts.codigoIne);
  if (opts.dataAtendimento) b.writeI64Field(4, opts.dataAtendimento);
  if (opts.cnsProfissional) b.writeStringField(5, opts.cnsProfissional);
  b.writeStop();
  return b.build();
}

/** Constrói um Medicoes struct */
export function buildMedicoes(opts: {
  paSistolica?: number;
  paDiastolica?: number;
  peso?: number;
  altura?: number;
  temperatura?: number;
  glicemiaCapilar?: number;
  freqCardiaca?: number;
  freqRespiratoria?: number;
  saturacaoO2?: number;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.paSistolica !== undefined) b.writeI32Field(3, opts.paSistolica);
  if (opts.paDiastolica !== undefined) b.writeI32Field(4, opts.paDiastolica);
  if (opts.freqRespiratoria !== undefined) b.writeI32Field(5, opts.freqRespiratoria);
  if (opts.freqCardiaca !== undefined) b.writeI32Field(6, opts.freqCardiaca);
  if (opts.temperatura !== undefined) b.writeDoubleField(7, opts.temperatura);
  if (opts.saturacaoO2 !== undefined) b.writeI32Field(8, opts.saturacaoO2);
  if (opts.glicemiaCapilar !== undefined) b.writeI32Field(9, opts.glicemiaCapilar);
  if (opts.peso !== undefined) b.writeDoubleField(11, opts.peso);
  if (opts.altura !== undefined) b.writeDoubleField(12, opts.altura);
  b.writeStop();
  return b.build();
}

/** Constrói um ProblemaCondicao struct */
export function buildProblemaCondicao(opts: {
  ciap?: string;
  cid10?: string;
  situacao?: number;
  dataInicioProblema?: number;
  isAvaliado?: boolean;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.ciap) b.writeStringField(4, opts.ciap);
  if (opts.cid10) b.writeStringField(5, opts.cid10);
  if (opts.situacao !== undefined) b.writeI64Field(6, opts.situacao);
  if (opts.dataInicioProblema !== undefined) b.writeI64Field(7, opts.dataInicioProblema);
  if (opts.isAvaliado !== undefined) b.writeBoolField(9, opts.isAvaliado);
  b.writeStop();
  return b.build();
}

/** Constrói um Medicamento struct */
export function buildMedicamento(opts: {
  codigoCatmat?: string;
  viaAdministracao?: number;
  dose?: string;
  usoContinuo?: boolean;
  doseFrequencia?: string;
  dtInicioTratamento?: number;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.codigoCatmat) b.writeStringField(1, opts.codigoCatmat);
  if (opts.viaAdministracao !== undefined) b.writeI64Field(2, opts.viaAdministracao);
  if (opts.dose) b.writeStringField(3, opts.dose);
  if (opts.usoContinuo !== undefined) b.writeBoolField(5, opts.usoContinuo);
  if (opts.doseFrequencia) b.writeStringField(7, opts.doseFrequencia);
  if (opts.dtInicioTratamento !== undefined) b.writeI64Field(10, opts.dtInicioTratamento);
  b.writeStop();
  return b.build();
}

/**
 * Constrói uma FichaAtendimentoIndividualChild struct completa.
 */
export function buildFaiChild(opts: {
  cpfCidadao?: string;
  cnsCidadao?: string;
  dataNascimento: number;
  sexo: number;
  turno?: number;
  tipoAtendimento: number;
  dataHoraInicial: number;
  dataHoraFinal: number;
  dumDaGestante?: number;
  idadeGestacional?: number;
  nuGestasPrevias?: number;
  nuPartos?: number;
  stGravidezPlanejada?: boolean;
  medicoes?: Buffer;
  problemas?: Buffer[];
  medicamentos?: Buffer[];
} = { dataNascimento: 0, sexo: 1, tipoAtendimento: 1, dataHoraInicial: 0, dataHoraFinal: 0 }): Buffer {
  const b = new ThriftBufferBuilder();

  if (opts.cnsCidadao) b.writeStringField(2, opts.cnsCidadao);

  // field 3: dataNascimento (i64)
  b.writeI64Field(3, opts.dataNascimento);

  // field 4: localDeAtendimento (i64) — default 1 (UBS)
  b.writeI64Field(4, 1);

  // field 5: sexo (i64)
  b.writeI64Field(5, opts.sexo);

  // field 6: turno (i64)
  b.writeI64Field(6, opts.turno ?? 1);

  // field 7: tipoAtendimento (i64)
  b.writeI64Field(7, opts.tipoAtendimento);

  // field 9: dumDaGestante (i64)
  if (opts.dumDaGestante !== undefined) b.writeI64Field(9, opts.dumDaGestante);

  // field 10: idadeGestacional (i32)
  if (opts.idadeGestacional !== undefined) b.writeI32Field(10, opts.idadeGestacional);

  // field 12: stGravidezPlanejada (bool)
  if (opts.stGravidezPlanejada !== undefined) b.writeBoolField(12, opts.stGravidezPlanejada);

  // field 13: nuGestasPrevias (i32)
  if (opts.nuGestasPrevias !== undefined) b.writeI32Field(13, opts.nuGestasPrevias);

  // field 14: nuPartos (i32)
  if (opts.nuPartos !== undefined) b.writeI32Field(14, opts.nuPartos);

  // field 15: medicoes (struct)
  if (opts.medicoes) {
    b.writeFieldHeader(TType.STRUCT, 15);
    b.parts.push(opts.medicoes);
  }

  // field 16: problemasCondicoes (list<struct>)
  const problemas = opts.problemas ?? [];
  b.writeFieldHeader(TType.LIST, 16);
  b.writeListHeader(TType.STRUCT, problemas.length);
  for (const p of problemas) {
    b.parts.push(p);
  }

  // field 18: medicamentos (list<struct>)
  if (opts.medicamentos && opts.medicamentos.length > 0) {
    b.writeFieldHeader(TType.LIST, 18);
    b.writeListHeader(TType.STRUCT, opts.medicamentos.length);
    for (const m of opts.medicamentos) {
      b.parts.push(m);
    }
  }

  // field 26: dataHoraInicialAtendimento (i64)
  b.writeI64Field(26, opts.dataHoraInicial);

  // field 27: dataHoraFinalAtendimento (i64)
  b.writeI64Field(27, opts.dataHoraFinal);

  // field 28: cpfCidadao (string)
  if (opts.cpfCidadao) b.writeStringField(28, opts.cpfCidadao);

  b.writeStop();
  return b.build();
}

/**
 * Constrói uma FAI Master struct completa.
 */
export function buildFaiMaster(opts: {
  header?: Buffer;
  children: Buffer[];
  uuidFicha: string;
  tpCdsOrigem?: number;
}): Buffer {
  const b = new ThriftBufferBuilder();

  // field 1: headerTransport (struct)
  if (opts.header) {
    b.writeFieldHeader(TType.STRUCT, 1);
    b.parts.push(opts.header);
  }

  // field 2: atendimentosIndividuais (list<struct>)
  b.writeFieldHeader(TType.LIST, 2);
  b.writeListHeader(TType.STRUCT, opts.children.length);
  for (const c of opts.children) {
    b.parts.push(c);
  }

  // field 3: uuidFicha (string)
  b.writeStringField(3, opts.uuidFicha);

  // field 4: tpCdsOrigem (i32)
  if (opts.tpCdsOrigem !== undefined) b.writeI32Field(4, opts.tpCdsOrigem);

  b.writeStop();
  return b.build();
}

/**
 * Constrói um IdentificacaoUsuarioCidadao struct.
 */
export function buildIdentificacaoUsuario(opts: {
  nomeCidadao?: string;
  nomeSocialCidadao?: string;
  dataNascimentoCidadao?: number;
  sexoCidadao?: number;
  racaCorCidadao?: number;
  cnsCidadao?: string;
  cpfCidadao?: string;
  nomeMaeCidadao?: string;
  telefoneCelular?: string;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.nomeCidadao) b.writeStringField(1, opts.nomeCidadao);
  if (opts.nomeSocialCidadao) b.writeStringField(2, opts.nomeSocialCidadao);
  if (opts.dataNascimentoCidadao !== undefined) b.writeI64Field(3, opts.dataNascimentoCidadao);
  if (opts.sexoCidadao !== undefined) b.writeI64Field(4, opts.sexoCidadao);
  if (opts.racaCorCidadao !== undefined) b.writeI64Field(5, opts.racaCorCidadao);
  if (opts.cnsCidadao) b.writeStringField(9, opts.cnsCidadao);
  if (opts.cpfCidadao) b.writeStringField(10, opts.cpfCidadao);
  if (opts.nomeMaeCidadao) b.writeStringField(12, opts.nomeMaeCidadao);
  if (opts.telefoneCelular) b.writeStringField(15, opts.telefoneCelular);
  b.writeStop();
  return b.build();
}

/**
 * Constrói um CondicoesDeSaude struct.
 */
export function buildCondicoesDeSaude(opts: {
  isGestante?: boolean;
  maternidadeDeReferencia?: string;
  isHipertenso?: boolean;
  isDiabetico?: boolean;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.isGestante !== undefined) b.writeBoolField(1, opts.isGestante);
  if (opts.maternidadeDeReferencia) b.writeStringField(2, opts.maternidadeDeReferencia);
  if (opts.isHipertenso !== undefined) b.writeBoolField(12, opts.isHipertenso);
  if (opts.isDiabetico !== undefined) b.writeBoolField(13, opts.isDiabetico);
  b.writeStop();
  return b.build();
}

/**
 * Constrói um CadastroIndividual struct.
 */
export function buildCadastroIndividual(opts: {
  identificacao?: Buffer;
  condicoesDeSaude?: Buffer;
  uuid?: string;
  headerTransport?: Buffer;
} = {}): Buffer {
  const b = new ThriftBufferBuilder();
  if (opts.identificacao) {
    b.writeFieldHeader(TType.STRUCT, 1);
    b.parts.push(opts.identificacao);
  }
  if (opts.condicoesDeSaude) {
    b.writeFieldHeader(TType.STRUCT, 2);
    b.parts.push(opts.condicoesDeSaude);
  }
  if (opts.uuid) b.writeStringField(6, opts.uuid);
  if (opts.headerTransport) {
    b.writeFieldHeader(TType.STRUCT, 7);
    b.parts.push(opts.headerTransport);
  }
  b.writeStop();
  return b.build();
}

/**
 * Constrói um DadoTransporte completo com uma ficha serializada dentro.
 */
export function buildDadoTransporte(opts: {
  uuid?: string;
  tipo: number;
  cnes?: string;
  codIbge?: string;
  fichaBuffer: Buffer;
}): Buffer {
  const remetente = buildDadoInstalacao({ uuidInstalacao: 'rem-uuid', cpfOuCnpj: '12345678000199' });
  const originadora = buildDadoInstalacao({ uuidInstalacao: 'orig-uuid', cpfOuCnpj: '12345678000199' });
  const versao = buildVersao(5, 3, 25);

  const b = new ThriftBufferBuilder();
  b.writeStringField(1, opts.uuid ?? 'test-uuid-001');
  b.writeI64Field(2, opts.tipo);
  b.writeStringField(3, opts.cnes ?? '2695251');
  b.writeStringField(4, opts.codIbge ?? '4205407');
  b.writeBinaryField(7, opts.fichaBuffer);
  b.writeFieldHeader(TType.STRUCT, 8);
  b.parts.push(remetente);
  b.writeFieldHeader(TType.STRUCT, 9);
  b.parts.push(originadora);
  b.writeFieldHeader(TType.STRUCT, 10);
  b.parts.push(versao);
  b.writeStop();

  return b.build();
}

