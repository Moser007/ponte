import { describe, it, expect, beforeEach } from 'vitest';
import type { IpmDataSource } from '../../src/datasource/ipm-datasource.js';
import type {
  IpmPaciente,
  IpmAtendimento,
  IpmProblema,
  IpmAlergia,
  IpmMedicamento,
  IpmSinalVital,
  IpmProfissional,
  IpmEstabelecimento,
} from '../../src/types/ipm.js';
import { processar, setUuidGenerator } from '../../src/index.js';
import type { Bundle, Composition } from '@medplum/fhirtypes';

/**
 * Cenário mínimo: paciente masculino, idoso, consulta simples.
 * Sem dados obstétricos, sem alergias, sem medicamentos.
 * Testa que o adaptador funciona para QUALQUER paciente, não só gestantes.
 */
class MinimalDataSource implements IpmDataSource {
  async getPaciente(cpf: string): Promise<IpmPaciente | null> {
    if (cpf !== '52998224725') return null;
    return {
      id: 1,
      nome: 'José Pereira',
      cpf: '52998224725',
      data_nascimento: '1955-08-20',
      sexo: 'M',
      raca_cor: 'branca',
    };
  }

  async getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]> {
    return [
      {
        id: 1,
        paciente_id: pacienteId,
        profissional_id: 1,
        estabelecimento_id: 1,
        data_inicio: '2025-12-01T14:00:00-03:00',
        data_fim: '2025-12-01T14:30:00-03:00',
        tipo: 'consulta',
      },
    ];
  }

  async getProblemas(atendimentoId: number): Promise<IpmProblema[]> {
    return [
      {
        id: 1,
        atendimento_id: atendimentoId,
        paciente_id: 1,
        cid: 'I10',
        descricao: 'Hipertensão essencial (primária)',
        data_inicio: '2020-03',
        ativo: true,
      },
    ];
  }

  async getAlergias(): Promise<IpmAlergia[]> {
    return []; // Sem alergias
  }

  async getMedicamentos(): Promise<IpmMedicamento[]> {
    return []; // Sem medicamentos
  }

  async getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]> {
    return [
      {
        id: 1,
        atendimento_id: atendimentoId,
        paciente_id: 1,
        pa_sistolica: 145,
        pa_diastolica: 92,
        peso: 85,
        data_medicao: '2025-12-01T14:10:00-03:00',
      },
    ];
  }

  async getProfissional(): Promise<IpmProfissional | null> {
    return {
      id: 1,
      nome: 'Dra. Ana Costa',
      cns: '898001111222020',
      cbo: '225125',
      cbo_descricao: 'Médico clínico',
    };
  }

  async getEstabelecimento(): Promise<IpmEstabelecimento | null> {
    return {
      id: 1,
      nome: 'UBS Centro',
      cnes: '1234567',
      tipo: 'UBS',
    };
  }
}

describe('Minimal scenario — non-obstetric patient', () => {
  let result: Awaited<ReturnType<typeof processar>>;
  let bundle: Bundle;

  beforeEach(async () => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-b000-${hex}`;
    });
    const dataSource = new MinimalDataSource();
    result = await processar('52998224725', dataSource);
    bundle = result.bundle;
  });

  it('should produce a valid Bundle', () => {
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should have correct number of entries without obstetric data', () => {
    // Composition + Patient + Practitioner + Organization + Encounter
    // + 1 Condition + 3 VitalSigns (PA×2 + peso) = 9
    // NO allergy, NO medication, NO DUM, NO obstetric history
    expect(bundle.entry).toHaveLength(9);
  });

  it('should have male patient', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource;
    expect((patient as any).gender).toBe('male');
  });

  it('should have valid CPF (52998224725)', () => {
    // This CPF has valid check digits — no warning expected
    expect(result.validation.warnings.some((w) => w.includes('CPF'))).toBe(false);
  });

  it('should have no allergy section', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const allergySection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '48765-2')
    );
    expect(allergySection).toBeUndefined();
  });

  it('should have no medication section', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const medSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '52471-0')
    );
    expect(medSection).toBeUndefined();
  });

  it('should have sinaisVitais section with 3 observations (PA + peso only)', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const vsSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '8716-3')
    );
    expect(vsSection?.entry).toHaveLength(3);
  });

  it('should have diagnosticosAvaliados section with 1 condition', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const diagSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diagSection?.entry).toHaveLength(1);
  });

  it('should have all references resolving', () => {
    const fullUrls = new Set(bundle.entry?.map((e) => e.fullUrl));
    for (const entry of bundle.entry ?? []) {
      const json = JSON.stringify(entry.resource);
      const refs = [...json.matchAll(/"reference":"(urn:uuid:[^"]+)"/g)];
      for (const [, ref] of refs) {
        expect(fullUrls.has(ref), `Reference ${ref} should resolve`).toBe(true);
      }
    }
  });

  it('should work without RNDS client (no envio)', () => {
    expect(result.envio).toBeUndefined();
  });
});
