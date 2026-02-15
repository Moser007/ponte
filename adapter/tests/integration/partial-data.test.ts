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
import type { Bundle, Composition, Observation } from '@medplum/fhirtypes';

/**
 * Cenário com dados parciais: sinais vitais incompletos,
 * apenas pressão arterial, sem peso, sem glicemia.
 * Testa que o adaptador lida corretamente com campos opcionais.
 */
class PartialDataSource implements IpmDataSource {
  async getPaciente(cpf: string): Promise<IpmPaciente | null> {
    if (cpf !== '11144477735') return null;
    return {
      id: 1,
      nome: 'Ana',  // Nome sem sobrenome (caso de teste)
      cpf: '11144477735',
      // Sem CNS
      data_nascimento: '2000-01-01',
      sexo: 'F',
      raca_cor: 'branca',
      // Sem dados obstétricos
    };
  }

  async getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]> {
    return [
      {
        id: 1,
        paciente_id: pacienteId,
        profissional_id: 1,
        estabelecimento_id: 1,
        data_inicio: '2025-12-15T10:00:00-03:00',
        // Sem data_fim
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
        cid: 'J06.9',
        descricao: 'Infecção aguda das vias aéreas superiores',
        // Sem data_inicio
        ativo: true,
      },
    ];
  }

  async getAlergias(): Promise<IpmAlergia[]> {
    return [
      {
        id: 1,
        paciente_id: 1,
        substancia: 'Dipirona',
        // Sem código BRMedicamento
        gravidade: 'low',
        // Sem reação
      },
    ];
  }

  async getMedicamentos(): Promise<IpmMedicamento[]> {
    return [
      {
        id: 1,
        paciente_id: 1,
        nome: 'Amoxicilina 500mg',
        // Sem código CATMAT
        // Sem dosagem
        posologia: '8/8h por 7 dias',
        ativo: true,
      },
    ];
  }

  async getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]> {
    return [
      {
        id: 1,
        atendimento_id: atendimentoId,
        paciente_id: 1,
        pa_sistolica: 120,
        pa_diastolica: 80,
        // Sem peso, sem altura, sem glicemia, sem IG
        data_medicao: '2025-12-15T10:10:00-03:00',
      },
    ];
  }

  async getProfissional(): Promise<IpmProfissional | null> {
    return {
      id: 1,
      nome: 'Dr. Carlos',
      cns: '700000000000005', // CNS válido (soma=110, mod 11=0)
      cbo: '225125',
      // Sem cbo_descricao
    };
  }

  async getEstabelecimento(): Promise<IpmEstabelecimento | null> {
    return {
      id: 1,
      nome: 'UBS Rural',
      cnes: '9876543',
      tipo: 'UBS',
    };
  }
}

describe('Partial data scenario — minimal fields', () => {
  let result: Awaited<ReturnType<typeof processar>>;
  let bundle: Bundle;

  beforeEach(async () => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-c000-${hex}`;
    });
    const dataSource = new PartialDataSource();
    result = await processar('11144477735', dataSource);
    bundle = result.bundle;
  });

  it('should produce a valid Bundle', () => {
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should have correct entry count', () => {
    // Composition + Patient + Practitioner + Organization + Encounter
    // + 1 Condition + 1 Allergy + 2 VitalSigns (PA×2) + 1 Medication = 10
    expect(bundle.entry).toHaveLength(10);
  });

  it('should handle patient without CNS', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as any;
    // Should have only CPF identifier (no CNS)
    expect(patient.identifier).toHaveLength(1);
    expect(patient.identifier[0].system).toBe('https://saude.gov.br/fhir/sid/cpf');
  });

  it('should handle patient name without family', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as any;
    // Single name "Ana" — no family name split
    expect(patient.name[0].text).toBe('Ana');
  });

  it('should have valid CPF (11144477735)', () => {
    expect(result.validation.warnings.some((w) => w.includes('CPF'))).toBe(false);
  });

  it('should have allergy section with 1 entry', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const allergySection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '48765-2')
    );
    expect(allergySection?.entry).toHaveLength(1);
  });

  it('should have medication section with 1 entry', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const medSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '52471-0')
    );
    expect(medSection?.entry).toHaveLength(1);
  });

  it('should have only PA observations (2: systolic + diastolic)', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const vsSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '8716-3')
    );
    expect(vsSection?.entry).toHaveLength(2);
  });

  it('should have allergy without code (fallback to substancia)', () => {
    const allergy = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'AllergyIntolerance'
    )?.resource as any;
    expect(allergy.code.coding[0].display).toBe('Dipirona');
  });

  it('should have medication without CATMAT code', () => {
    const med = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'MedicationStatement'
    )?.resource as any;
    expect(med.medicationCodeableConcept.text).toBe('Amoxicilina 500mg');
  });

  it('should have no obstetric data (no DUM, no gestas, no partos)', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      ?.map((e) => e.resource as Observation) ?? [];

    // No DUM (8665-2)
    const dum = observations.find((o) =>
      o.code?.coding?.some((c) => c.code === '8665-2')
    );
    expect(dum).toBeUndefined();

    // No pregnancies (11996-6)
    const gravida = observations.find((o) =>
      o.code?.coding?.some((c) => c.code === '11996-6')
    );
    expect(gravida).toBeUndefined();
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
});
