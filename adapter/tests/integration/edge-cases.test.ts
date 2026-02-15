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
 * Edge cases: testa comportamento do adaptador em cenários limítrofes.
 */

const basePaciente: IpmPaciente = {
  id: 1,
  nome: 'Pedro Oliveira',
  cpf: '11144477735',
  data_nascimento: '1985-06-15',
  sexo: 'M',
  raca_cor: 'parda',
};

const baseAtendimento: IpmAtendimento = {
  id: 1,
  paciente_id: 1,
  profissional_id: 1,
  estabelecimento_id: 1,
  data_inicio: '2025-12-20T09:00:00-03:00',
  tipo: 'consulta',
};

const baseProfissional: IpmProfissional = {
  id: 1,
  nome: 'Dra. Fernanda Lima',
  cns: '700000000000005',
  cbo: '225125',
};

const baseEstabelecimento: IpmEstabelecimento = {
  id: 1,
  nome: 'UBS Centro',
  cnes: '1234567',
  tipo: 'UBS',
};

function createDataSource(overrides: Partial<{
  paciente: IpmPaciente | null;
  atendimentos: IpmAtendimento[];
  problemas: IpmProblema[];
  alergias: IpmAlergia[];
  medicamentos: IpmMedicamento[];
  sinaisVitais: IpmSinalVital[];
  profissional: IpmProfissional | null;
  estabelecimento: IpmEstabelecimento | null;
}> = {}): IpmDataSource {
  return {
    getPaciente: async () => overrides.paciente !== undefined ? overrides.paciente : basePaciente,
    getAtendimentos: async () => overrides.atendimentos ?? [baseAtendimento],
    getProblemas: async () => overrides.problemas ?? [],
    getAlergias: async () => overrides.alergias ?? [],
    getMedicamentos: async () => overrides.medicamentos ?? [],
    getSinaisVitais: async () => overrides.sinaisVitais ?? [],
    getProfissional: async () => overrides.profissional !== undefined ? overrides.profissional : baseProfissional,
    getEstabelecimento: async () => overrides.estabelecimento !== undefined ? overrides.estabelecimento : baseEstabelecimento,
  };
}

describe('Edge cases — error handling', () => {
  beforeEach(() => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
  });

  it('should throw when patient not found', async () => {
    const ds = createDataSource({ paciente: null });
    await expect(processar('99999999999', ds)).rejects.toThrow('não encontrado');
  });

  it('should throw when no atendimentos', async () => {
    const ds = createDataSource({ atendimentos: [] });
    await expect(processar('11144477735', ds)).rejects.toThrow('Nenhum atendimento');
  });

  it('should throw when profissional not found', async () => {
    const ds = createDataSource({ profissional: null });
    await expect(processar('11144477735', ds)).rejects.toThrow('Profissional');
  });

  it('should throw when estabelecimento not found', async () => {
    const ds = createDataSource({ estabelecimento: null });
    await expect(processar('11144477735', ds)).rejects.toThrow('Estabelecimento');
  });
});

describe('Edge cases — no conditions (empty diagnosis)', () => {
  let result: Awaited<ReturnType<typeof processar>>;

  beforeEach(async () => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
    const ds = createDataSource({ problemas: [] });
    result = await processar('11144477735', ds);
  });

  it('should generate a Bundle even with no conditions', () => {
    expect(result.bundle).toBeDefined();
    expect(result.bundle.type).toBe('document');
  });

  it('should have validation error for missing diagnosticosAvaliados entry', () => {
    expect(result.validation.valid).toBe(false);
    expect(result.validation.errors.some((e) =>
      e.includes('diagnosticosAvaliados') && e.includes('pelo menos uma entry')
    )).toBe(true);
  });

  it('should have only base resources (Composition + Patient + Practitioner + Organization + Encounter)', () => {
    // 5 resources, no conditions/allergies/vitals/medications
    expect(result.bundle.entry).toHaveLength(5);
  });

  it('should have empty diagnósticos section in Composition', () => {
    const comp = result.bundle.entry?.[0]?.resource as Composition;
    const diagSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diagSection).toBeDefined();
    expect(diagSection?.entry).toHaveLength(0);
  });
});

describe('Edge cases — minimal valid encounter', () => {
  let result: Awaited<ReturnType<typeof processar>>;
  let bundle: Bundle;

  beforeEach(async () => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
    // Only 1 condition, nothing else
    const ds = createDataSource({
      problemas: [
        {
          id: 1,
          atendimento_id: 1,
          paciente_id: 1,
          cid: 'Z00.0',
          descricao: 'Exame médico geral',
          ativo: true,
        },
      ],
    });
    result = await processar('11144477735', ds);
    bundle = result.bundle;
  });

  it('should produce a valid Bundle', () => {
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should have exactly 6 entries (Composition + Patient + Practitioner + Organization + Encounter + 1 Condition)', () => {
    expect(bundle.entry).toHaveLength(6);
  });

  it('should have only diagnósticos section (no vitals, allergies, or meds)', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.section).toHaveLength(1);
    expect(comp.section?.[0]?.code?.coding?.[0]?.code).toBe('57852-6');
  });

  it('should have encounter with single diagnosis', () => {
    const encounter = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as any;
    expect(encounter.diagnosis).toHaveLength(1);
    expect(encounter.diagnosis[0].use.coding[0].code).toBe('CC');
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

describe('Edge cases — encounter with finished status', () => {
  beforeEach(() => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
  });

  it('should set encounter status to finished when data_fim is present', async () => {
    const ds = createDataSource({
      atendimentos: [{
        ...baseAtendimento,
        data_fim: '2025-12-20T10:00:00-03:00',
      }],
      problemas: [{
        id: 1,
        atendimento_id: 1,
        paciente_id: 1,
        cid: 'Z00.0',
        descricao: 'Exame médico geral',
        ativo: true,
      }],
    });
    const result = await processar('11144477735', ds);
    const encounter = result.bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as any;
    expect(encounter.status).toBe('finished');
    expect(encounter.period.end).toBe('2025-12-20T10:00:00-03:00');
  });

  it('should set encounter status to in-progress when data_fim is absent', async () => {
    const ds = createDataSource({
      problemas: [{
        id: 1,
        atendimento_id: 1,
        paciente_id: 1,
        cid: 'Z00.0',
        descricao: 'Exame médico geral',
        ativo: true,
      }],
    });
    const result = await processar('11144477735', ds);
    const encounter = result.bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as any;
    expect(encounter.status).toBe('in-progress');
  });
});

describe('Edge cases — many conditions', () => {
  beforeEach(() => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
  });

  it('should handle 5 conditions with correct CC/CM roles', async () => {
    const problemas: IpmProblema[] = [
      { id: 1, atendimento_id: 1, paciente_id: 1, cid: 'J06.9', descricao: 'IVAS', ativo: true },
      { id: 2, atendimento_id: 1, paciente_id: 1, cid: 'I10', descricao: 'HAS', ativo: true },
      { id: 3, atendimento_id: 1, paciente_id: 1, cid: 'E11', descricao: 'DM2', ativo: true },
      { id: 4, atendimento_id: 1, paciente_id: 1, cid: 'E78.0', descricao: 'Dislipidemia', ativo: true },
      { id: 5, atendimento_id: 1, paciente_id: 1, cid: 'F32', descricao: 'Depressão', ativo: true },
    ];
    const ds = createDataSource({ problemas });
    const result = await processar('11144477735', ds);

    expect(result.validation.valid).toBe(true);

    const encounter = result.bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as any;
    expect(encounter.diagnosis).toHaveLength(5);
    // First is CC (Chief Complaint), rest are CM (Comorbidity)
    expect(encounter.diagnosis[0].use.coding[0].code).toBe('CC');
    expect(encounter.diagnosis[1].use.coding[0].code).toBe('CM');
    expect(encounter.diagnosis[4].use.coding[0].code).toBe('CM');

    // Composition diagnósticos section should have 5 entries
    const comp = result.bundle.entry?.[0]?.resource as Composition;
    const diagSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diagSection?.entry).toHaveLength(5);

    // Bundle should have 5+5=10 entries (base + 5 conditions)
    expect(result.bundle.entry).toHaveLength(10);
  });
});

describe('Edge cases — all data present', () => {
  beforeEach(() => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-e000-${hex}`;
    });
  });

  it('should handle maximal data correctly', async () => {
    const ds = createDataSource({
      problemas: [
        { id: 1, atendimento_id: 1, paciente_id: 1, cid: 'J06.9', descricao: 'IVAS', ativo: true },
        { id: 2, atendimento_id: 1, paciente_id: 1, cid: 'I10', descricao: 'HAS', ativo: true },
      ],
      alergias: [
        { id: 1, paciente_id: 1, substancia: 'AAS', gravidade: 'low' },
        { id: 2, paciente_id: 1, substancia: 'Dipirona', gravidade: 'high', reacao: 'Urticária' },
      ],
      medicamentos: [
        { id: 1, paciente_id: 1, nome: 'Losartana 50mg', posologia: '1x/dia', ativo: true },
        { id: 2, paciente_id: 1, nome: 'Omeprazol 20mg', posologia: '1x/dia', ativo: true },
        { id: 3, paciente_id: 1, nome: 'AAS 100mg', posologia: '1x/dia', ativo: true },
      ],
      sinaisVitais: [
        {
          id: 1,
          atendimento_id: 1,
          paciente_id: 1,
          pa_sistolica: 140,
          pa_diastolica: 90,
          peso: 85,
          altura: 170,
          temperatura: 36.5,
          freq_cardiaca: 78,
          data_medicao: '2025-12-20T09:15:00-03:00',
        },
      ],
    });
    const result = await processar('11144477735', ds);

    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);

    // Composition + Patient + Practitioner + Organization + Encounter
    // + 2 Conditions + 2 Allergies + 3 Medications + 6 VitalSigns (PA×2 + peso + altura + temp + FC)
    expect(result.bundle.entry).toHaveLength(18);

    // All 4 sections present
    const comp = result.bundle.entry?.[0]?.resource as Composition;
    expect(comp.section).toHaveLength(4);
  });
});
