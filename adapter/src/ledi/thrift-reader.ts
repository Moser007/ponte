/**
 * Leitor TBinaryProtocol mínimo para deserialização de arquivos LEDI (.esus).
 *
 * Implementa apenas o subset do protocolo Thrift necessário para ler
 * DadoTransporteThrift e fichas internas (FAI, FCI).
 *
 * Referência: https://github.com/apache/thrift/blob/master/doc/specs/thrift-binary-protocol.md
 *
 * Zero dependências externas — só usa Buffer nativo do Node.js.
 */

/** Tipos de campo Thrift (TBinaryProtocol) */
export const enum ThriftType {
  STOP = 0,
  BOOL_TRUE = 1, // also VOID
  BOOL_FALSE = 2,
  BYTE = 3,
  I16 = 6,
  I32 = 8,
  I64 = 10,
  DOUBLE = 4,
  STRING = 11, // also BINARY
  STRUCT = 12,
  MAP = 13,
  SET = 14,
  LIST = 15,
}

/**
 * Leitor sequencial de bytes com suporte ao TBinaryProtocol do Apache Thrift.
 *
 * Uso:
 *   const reader = new ThriftReader(buffer);
 *   const { fieldType, fieldId } = reader.readFieldHeader();
 *   const value = reader.readString();
 */
export class ThriftReader {
  private buf: Buffer;
  private pos: number;

  constructor(buf: Buffer, offset = 0) {
    this.buf = buf;
    this.pos = offset;
  }

  get position(): number {
    return this.pos;
  }

  get remaining(): number {
    return this.buf.length - this.pos;
  }

  // ── Primitivos ────────────────────────────────────────────────

  readByte(): number {
    const val = this.buf.readInt8(this.pos);
    this.pos += 1;
    return val;
  }

  readI16(): number {
    const val = this.buf.readInt16BE(this.pos);
    this.pos += 2;
    return val;
  }

  readI32(): number {
    const val = this.buf.readInt32BE(this.pos);
    this.pos += 4;
    return val;
  }

  readI64(): number {
    // Thrift i64 = 8 bytes big-endian signed.
    // JavaScript Number pode perder precisão acima de 2^53, mas para
    // timestamps em milissegundos (epoch ms) e enums, Number é suficiente.
    const hi = this.buf.readInt32BE(this.pos);
    const lo = this.buf.readUInt32BE(this.pos + 4);
    this.pos += 8;
    return hi * 0x100000000 + lo;
  }

  readDouble(): number {
    const val = this.buf.readDoubleBE(this.pos);
    this.pos += 8;
    return val;
  }

  readBool(): boolean {
    return this.readByte() !== 0;
  }

  readString(): string {
    const len = this.readI32();
    if (len < 0 || len > this.remaining) {
      throw new ThriftReadError(`Invalid string length: ${len} (remaining: ${this.remaining})`, this.pos);
    }
    const val = this.buf.toString('utf8', this.pos, this.pos + len);
    this.pos += len;
    return val;
  }

  readBinary(): Buffer {
    const len = this.readI32();
    if (len < 0 || len > this.remaining) {
      throw new ThriftReadError(`Invalid binary length: ${len} (remaining: ${this.remaining})`, this.pos);
    }
    const val = this.buf.subarray(this.pos, this.pos + len);
    this.pos += len;
    return val;
  }

  // ── Containers ────────────────────────────────────────────────

  /** Lê header de campo: { fieldType, fieldId }. STOP se fieldType === 0. */
  readFieldHeader(): { fieldType: ThriftType; fieldId: number } {
    const fieldType = this.readByte() as ThriftType;
    if (fieldType === ThriftType.STOP) {
      return { fieldType, fieldId: 0 };
    }
    const fieldId = this.readI16();
    return { fieldType, fieldId };
  }

  /** Lê header de lista: { elementType, size } */
  readListHeader(): { elementType: ThriftType; size: number } {
    const elementType = this.readByte() as ThriftType;
    const size = this.readI32();
    return { elementType, size };
  }

  /** Lê header de map: { keyType, valueType, size } */
  readMapHeader(): { keyType: ThriftType; valueType: ThriftType; size: number } {
    const keyType = this.readByte() as ThriftType;
    const valueType = this.readByte() as ThriftType;
    const size = this.readI32();
    return { keyType, valueType, size };
  }

  // ── Skip ──────────────────────────────────────────────────────

  /** Pula um valor de tipo desconhecido (para campos que não mapeamos) */
  skip(fieldType: ThriftType): void {
    switch (fieldType) {
      case ThriftType.BOOL_TRUE:
      case ThriftType.BOOL_FALSE:
      case ThriftType.BYTE:
        this.pos += 1;
        break;
      case ThriftType.I16:
        this.pos += 2;
        break;
      case ThriftType.I32:
        this.pos += 4;
        break;
      case ThriftType.I64:
      case ThriftType.DOUBLE:
        this.pos += 8;
        break;
      case ThriftType.STRING:
        this.skipString();
        break;
      case ThriftType.STRUCT:
        this.skipStruct();
        break;
      case ThriftType.LIST:
      case ThriftType.SET: {
        const { elementType, size } = this.readListHeader();
        for (let i = 0; i < size; i++) {
          this.skip(elementType);
        }
        break;
      }
      case ThriftType.MAP: {
        const { keyType, valueType, size } = this.readMapHeader();
        for (let i = 0; i < size; i++) {
          this.skip(keyType);
          this.skip(valueType);
        }
        break;
      }
      default:
        throw new ThriftReadError(`Unknown Thrift type to skip: ${fieldType}`, this.pos);
    }
  }

  private skipString(): void {
    const len = this.readI32();
    if (len < 0 || len > this.remaining) {
      throw new ThriftReadError(`Invalid string length to skip: ${len}`, this.pos);
    }
    this.pos += len;
  }

  private skipStruct(): void {
    for (;;) {
      const { fieldType } = this.readFieldHeader();
      if (fieldType === ThriftType.STOP) break;
      this.skip(fieldType);
    }
  }
}

export class ThriftReadError extends Error {
  constructor(message: string, public readonly offset: number) {
    super(`${message} at offset ${offset}`);
    this.name = 'ThriftReadError';
  }
}
