import { describe, it, expect } from 'vitest';
import { isValidCpf } from '../../src/validation/validate.js';

describe('isValidCpf', () => {
  it('should accept valid CPF', () => {
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('11144477735')).toBe(true);
  });

  it('should reject CPF with wrong check digits', () => {
    expect(isValidCpf('12345678901')).toBe(false);
    expect(isValidCpf('52998224720')).toBe(false);
  });

  it('should reject repeated digit sequences', () => {
    expect(isValidCpf('11111111111')).toBe(false);
    expect(isValidCpf('00000000000')).toBe(false);
    expect(isValidCpf('99999999999')).toBe(false);
  });

  it('should reject wrong length', () => {
    expect(isValidCpf('1234567890')).toBe(false);
    expect(isValidCpf('123456789012')).toBe(false);
    expect(isValidCpf('')).toBe(false);
  });

  it('should handle formatted CPF', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.444.777-35')).toBe(true);
  });
});
