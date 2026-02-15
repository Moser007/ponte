import { describe, it, expect } from 'vitest';
import { isValidCns, isValidCnes } from '../../src/validation/validate.js';

describe('isValidCns', () => {
  it('should accept valid CNS (mod 11 check)', () => {
    // Sum of digit[i] * (15 - i) for i=0..14 must be divisible by 11
    expect(isValidCns('898001234567840')).toBe(true); // sum=550, 550%11=0
    expect(isValidCns('898009876543220')).toBe(true); // sum=682, 682%11=0
    expect(isValidCns('898001111222020')).toBe(true); // sum=418, 418%11=0
    expect(isValidCns('700000000000005')).toBe(true); // sum=110, 110%11=0
  });

  it('should reject CNS with wrong check digit', () => {
    expect(isValidCns('898001234567893')).toBe(false); // sum=563, 563%11=2
    expect(isValidCns('898009876543210')).toBe(false); // sum=680, 680%11=9
    expect(isValidCns('898001111222333')).toBe(false); // sum=432, 432%11=3
  });

  it('should reject wrong length', () => {
    expect(isValidCns('12345678901234')).toBe(false); // 14 digits
    expect(isValidCns('1234567890123456')).toBe(false); // 16 digits
    expect(isValidCns('')).toBe(false);
  });

  it('should reject CNS starting with invalid digit', () => {
    // First digit must be 1, 2, 7, 8, or 9
    expect(isValidCns('300000000000003')).toBe(false);
    expect(isValidCns('400000000000004')).toBe(false);
    expect(isValidCns('500000000000005')).toBe(false);
    expect(isValidCns('600000000000006')).toBe(false);
    expect(isValidCns('000000000000000')).toBe(false);
  });

  it('should accept CNS starting with valid prefixes', () => {
    // 1xx = definitive type 1
    expect(isValidCns('198765432100100')).toBe(true); // sum=528, 528%11=0
    // 2xx = definitive type 2
    expect(isValidCns('200000000000011')).toBe(true); // sum=33, 33%11=0
  });
});

describe('isValidCnes', () => {
  it('should accept valid CNES (7 digits)', () => {
    expect(isValidCnes('2695251')).toBe(true);
    expect(isValidCnes('1234567')).toBe(true);
    expect(isValidCnes('0000001')).toBe(true);
  });

  it('should reject wrong length', () => {
    expect(isValidCnes('123456')).toBe(false); // 6 digits
    expect(isValidCnes('12345678')).toBe(false); // 8 digits
    expect(isValidCnes('')).toBe(false);
  });

  it('should reject non-numeric', () => {
    expect(isValidCnes('123456A')).toBe(false);
    expect(isValidCnes('ABCDEFG')).toBe(false);
  });
});
