/**
 * Testes do ThriftReader — deserializador TBinaryProtocol.
 */

import { describe, it, expect } from 'vitest';
import { ThriftReader, ThriftType, ThriftReadError } from '../../src/ledi/thrift-reader.js';
import { ThriftBufferBuilder, TType } from './thrift-test-helpers.js';

describe('ThriftReader', () => {
  describe('primitivos', () => {
    it('readByte lê int8 corretamente', () => {
      const buf = Buffer.from([0x7f]); // 127
      const reader = new ThriftReader(buf);
      expect(reader.readByte()).toBe(127);
      expect(reader.position).toBe(1);
    });

    it('readByte lê valor negativo', () => {
      const buf = Buffer.from([0x80]); // -128
      const reader = new ThriftReader(buf);
      expect(reader.readByte()).toBe(-128);
    });

    it('readI16 lê int16 big-endian', () => {
      const buf = Buffer.alloc(2);
      buf.writeInt16BE(12345);
      const reader = new ThriftReader(buf);
      expect(reader.readI16()).toBe(12345);
      expect(reader.position).toBe(2);
    });

    it('readI32 lê int32 big-endian', () => {
      const buf = Buffer.alloc(4);
      buf.writeInt32BE(1234567890);
      const reader = new ThriftReader(buf);
      expect(reader.readI32()).toBe(1234567890);
      expect(reader.position).toBe(4);
    });

    it('readI64 lê int64 como Number (epoch ms)', () => {
      // Epoch ms para 2025-04-10T00:00:00Z = 1744243200000
      const epoch = 1744243200000;
      const b = new ThriftBufferBuilder();
      b.writeI64(epoch);
      const reader = new ThriftReader(b.build());
      expect(reader.readI64()).toBe(epoch);
      expect(reader.position).toBe(8);
    });

    it('readDouble lê double big-endian', () => {
      const buf = Buffer.alloc(8);
      buf.writeDoubleBE(78.5);
      const reader = new ThriftReader(buf);
      expect(reader.readDouble()).toBe(78.5);
      expect(reader.position).toBe(8);
    });

    it('readBool lê true e false', () => {
      const buf = Buffer.from([0x01, 0x00]);
      const reader = new ThriftReader(buf);
      expect(reader.readBool()).toBe(true);
      expect(reader.readBool()).toBe(false);
    });

    it('readString lê string UTF-8 com length prefix', () => {
      const b = new ThriftBufferBuilder();
      b.writeString('Maria Silva');
      const reader = new ThriftReader(b.build());
      expect(reader.readString()).toBe('Maria Silva');
    });

    it('readString lê string vazia', () => {
      const b = new ThriftBufferBuilder();
      b.writeString('');
      const reader = new ThriftReader(b.build());
      expect(reader.readString()).toBe('');
    });

    it('readString com UTF-8 multibyte (acentos)', () => {
      const b = new ThriftBufferBuilder();
      b.writeString('José da Conceição');
      const reader = new ThriftReader(b.build());
      expect(reader.readString()).toBe('José da Conceição');
    });

    it('readString lança erro para length inválido', () => {
      const buf = Buffer.alloc(4);
      buf.writeInt32BE(999999); // length maior que o buffer restante
      const reader = new ThriftReader(buf);
      expect(() => reader.readString()).toThrow(ThriftReadError);
    });

    it('readString lança erro para length negativo', () => {
      const buf = Buffer.alloc(4);
      buf.writeInt32BE(-1);
      const reader = new ThriftReader(buf);
      expect(() => reader.readString()).toThrow(ThriftReadError);
    });

    it('readBinary lê buffer binário com length prefix', () => {
      const data = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF]);
      const b = new ThriftBufferBuilder();
      b.writeBinary(data);
      const reader = new ThriftReader(b.build());
      const result = reader.readBinary();
      expect(result).toEqual(data);
    });
  });

  describe('containers', () => {
    it('readFieldHeader lê tipo e ID do campo', () => {
      const b = new ThriftBufferBuilder();
      b.writeFieldHeader(TType.STRING, 5);
      const reader = new ThriftReader(b.build());
      const { fieldType, fieldId } = reader.readFieldHeader();
      expect(fieldType).toBe(ThriftType.STRING);
      expect(fieldId).toBe(5);
    });

    it('readFieldHeader reconhece STOP', () => {
      const buf = Buffer.from([0x00]); // STOP
      const reader = new ThriftReader(buf);
      const { fieldType, fieldId } = reader.readFieldHeader();
      expect(fieldType).toBe(ThriftType.STOP);
      expect(fieldId).toBe(0);
    });

    it('readListHeader lê tipo de elemento e tamanho', () => {
      const b = new ThriftBufferBuilder();
      b.writeListHeader(TType.STRUCT, 3);
      const reader = new ThriftReader(b.build());
      const { elementType, size } = reader.readListHeader();
      expect(elementType).toBe(ThriftType.STRUCT);
      expect(size).toBe(3);
    });

    it('readMapHeader lê key type, value type e tamanho', () => {
      const b = new ThriftBufferBuilder();
      b.writeMapHeader(TType.STRING, TType.I32, 2);
      const reader = new ThriftReader(b.build());
      const { keyType, valueType, size } = reader.readMapHeader();
      expect(keyType).toBe(ThriftType.STRING);
      expect(valueType).toBe(ThriftType.I32);
      expect(size).toBe(2);
    });
  });

  describe('skip', () => {
    it('skip pula byte', () => {
      const buf = Buffer.from([0x42, 0xFF]);
      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.BYTE);
      expect(reader.position).toBe(1);
    });

    it('skip pula i16', () => {
      const buf = Buffer.alloc(2);
      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.I16);
      expect(reader.position).toBe(2);
    });

    it('skip pula i32', () => {
      const buf = Buffer.alloc(4);
      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.I32);
      expect(reader.position).toBe(4);
    });

    it('skip pula i64', () => {
      const buf = Buffer.alloc(8);
      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.I64);
      expect(reader.position).toBe(8);
    });

    it('skip pula double', () => {
      const buf = Buffer.alloc(8);
      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.DOUBLE);
      expect(reader.position).toBe(8);
    });

    it('skip pula string', () => {
      const b = new ThriftBufferBuilder();
      b.writeString('ignorar isso');
      const reader = new ThriftReader(b.build());
      reader.skip(ThriftType.STRING);
      expect(reader.remaining).toBe(0);
    });

    it('skip pula struct completa', () => {
      // Struct com 2 campos: string + i32 + STOP
      const b = new ThriftBufferBuilder();
      b.writeStringField(1, 'test');
      b.writeI32Field(2, 42);
      b.writeStop();
      const buf = b.build();

      const reader = new ThriftReader(buf);
      reader.skip(ThriftType.STRUCT);
      expect(reader.remaining).toBe(0);
    });

    it('skip pula list de i32', () => {
      const b = new ThriftBufferBuilder();
      b.writeListHeader(TType.I32, 3);
      b.writeI32(1).writeI32(2).writeI32(3);
      const reader = new ThriftReader(b.build());
      reader.skip(ThriftType.LIST);
      expect(reader.remaining).toBe(0);
    });

    it('skip pula map de string→i32', () => {
      const b = new ThriftBufferBuilder();
      b.writeMapHeader(TType.STRING, TType.I32, 1);
      b.writeString('key');
      b.writeI32(42);
      const reader = new ThriftReader(b.build());
      reader.skip(ThriftType.MAP);
      expect(reader.remaining).toBe(0);
    });

    it('skip lança erro para tipo desconhecido', () => {
      const buf = Buffer.alloc(1);
      const reader = new ThriftReader(buf);
      expect(() => reader.skip(99 as ThriftType)).toThrow(ThriftReadError);
    });
  });

  describe('position e remaining', () => {
    it('position começa em 0', () => {
      const reader = new ThriftReader(Buffer.alloc(10));
      expect(reader.position).toBe(0);
    });

    it('position com offset customizado', () => {
      const reader = new ThriftReader(Buffer.alloc(10), 5);
      expect(reader.position).toBe(5);
      expect(reader.remaining).toBe(5);
    });

    it('remaining diminui após leitura', () => {
      const b = new ThriftBufferBuilder();
      b.writeI32(42);
      b.writeI32(99);
      const reader = new ThriftReader(b.build());
      expect(reader.remaining).toBe(8);
      reader.readI32();
      expect(reader.remaining).toBe(4);
      reader.readI32();
      expect(reader.remaining).toBe(0);
    });
  });

  describe('leitura sequencial de múltiplos campos', () => {
    it('lê struct Thrift completa (como um DadoInstalacao)', () => {
      const b = new ThriftBufferBuilder();
      // field 1: contraChave (string)
      b.writeFieldHeader(TType.STRING, 1);
      b.writeString('chave-123');
      // field 2: uuidInstalacao (string)
      b.writeFieldHeader(TType.STRING, 2);
      b.writeString('uuid-456');
      // STOP
      b.writeStop();

      const reader = new ThriftReader(b.build());

      // Campo 1
      const f1 = reader.readFieldHeader();
      expect(f1.fieldType).toBe(ThriftType.STRING);
      expect(f1.fieldId).toBe(1);
      expect(reader.readString()).toBe('chave-123');

      // Campo 2
      const f2 = reader.readFieldHeader();
      expect(f2.fieldType).toBe(ThriftType.STRING);
      expect(f2.fieldId).toBe(2);
      expect(reader.readString()).toBe('uuid-456');

      // STOP
      const stop = reader.readFieldHeader();
      expect(stop.fieldType).toBe(ThriftType.STOP);
      expect(reader.remaining).toBe(0);
    });
  });
});
