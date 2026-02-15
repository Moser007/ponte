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
import type {
  Bundle,
  Patient,
  Condition,
  AllergyIntolerance,
  Observation,
  MedicationStatement,
  Composition,
  Encounter,
} from '@medplum/fhirtypes';

/**
 * Cenario Jose completo — paciente idoso com polifarmacia.
 *
 * Jose Carlos Schneider, 69 anos, branco, masculino.
 * Morador de Ascurra/SC (municipio pequeno, IPM, Vale do Itajai).
 *
 * Diagnosticos:
 *   - I10   Hipertensao essencial (cronica, desde 2015)
 *   - E11.9 Diabetes mellitus tipo 2 (desde 2018)
 *   - N18.3 Doenca renal cronica estagio 3 (desde 2023)
 *
 * Alergias:
 *   - AAS (acido acetilsalicilico) — gravidade baixa, reacao urticaria
 *
 * Medicamentos (polifarmacia — 4 medicamentos ativos):
 *   - Losartana 50mg 1x/dia (hipertensao)
 *   - Metformina 850mg 2x/dia (diabetes)
 *   - Sinvastatina 20mg 1x/dia a noite (dislipidemia)
 *   - Insulina NPH 10UI 1x/dia a noite (diabetes — recente)
 *
 * Sinais vitais:
 *   - PA 155/95 mmHg (hipertensao nao controlada)
 *   - Peso 92 kg
 *   - Altura 172 cm
 *   - Glicemia capilar 189 mg/dL (diabetes nao controlado)
 *   - FC 78 bpm
 *
 * Este cenario demonstra que o Ponte funciona para QUALQUER paciente,
 * nao so gestantes. Um idoso com polifarmacia e DRC e tao critico
 * quanto uma gestante de alto risco — precisa de continuidade do cuidado.
 */
class JoseDataSource implements IpmDataSource {
  async getPaciente(cpf: string): Promise<IpmPaciente | null> {
    if (cpf !== '71428793003') return null;
    return {
      id: 10,
      nome: 'Jose Carlos Schneider',
      cpf: '71428793003',
      cns: '898007654321050',
      data_nascimento: '1956-06-12',
      sexo: 'M',
      raca_cor: 'branca',
      telefone: '47991234567',
      endereco: 'Rua XV de Novembro, 123, Centro',
      municipio_ibge: '4201901', // Ascurra/SC
    };
  }

  async getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]> {
    return [
      {
        id: 10,
        paciente_id: pacienteId,
        profissional_id: 10,
        estabelecimento_id: 10,
        data_inicio: '2025-12-10T10:00:00-03:00',
        data_fim: '2025-12-10T10:40:00-03:00',
        tipo: 'consulta',
        observacoes:
          'Paciente refere tontura e cefaleia occipital. PA elevada. ' +
          'Glicemia capilar 189 mg/dL (jejum). Ajuste de medicacao: ' +
          'adicionada insulina NPH noturna. Solicitar creatinina e HbA1c. ' +
          'Retorno em 30 dias.',
      },
    ];
  }

  async getProblemas(atendimentoId: number): Promise<IpmProblema[]> {
    return [
      {
        id: 10,
        atendimento_id: atendimentoId,
        paciente_id: 10,
        cid: 'I10',
        ciap: 'K86',
        descricao: 'Hipertensao essencial (primaria)',
        data_inicio: '2015-03',
        ativo: true,
      },
      {
        id: 11,
        atendimento_id: atendimentoId,
        paciente_id: 10,
        cid: 'E11.9',
        ciap: 'T90',
        descricao: 'Diabetes mellitus tipo 2 sem complicacoes',
        data_inicio: '2018-07',
        ativo: true,
      },
      {
        id: 12,
        atendimento_id: atendimentoId,
        paciente_id: 10,
        cid: 'N18.3',
        descricao: 'Doenca renal cronica estagio 3',
        data_inicio: '2023-11',
        ativo: true,
      },
    ];
  }

  async getAlergias(pacienteId: number): Promise<IpmAlergia[]> {
    return [
      {
        id: 10,
        paciente_id: pacienteId,
        substancia: 'Acido acetilsalicilico (AAS)',
        gravidade: 'low',
        reacao: 'Urticaria',
      },
    ];
  }

  async getMedicamentos(pacienteId: number): Promise<IpmMedicamento[]> {
    return [
      {
        id: 10,
        paciente_id: pacienteId,
        atendimento_id: 10,
        nome: 'Losartana Potassica 50mg',
        codigo_catmat: 'BR0267402U0055',
        dosagem: '50mg',
        posologia: '1x/dia pela manha',
        via_administracao: 'oral',
        data_inicio: '2015-03',
        ativo: true,
      },
      {
        id: 11,
        paciente_id: pacienteId,
        atendimento_id: 10,
        nome: 'Cloridrato de Metformina 850mg',
        codigo_catmat: 'BR0267417U0022',
        dosagem: '850mg',
        posologia: '2x/dia (cafe e jantar)',
        via_administracao: 'oral',
        data_inicio: '2018-07',
        ativo: true,
      },
      {
        id: 12,
        paciente_id: pacienteId,
        atendimento_id: 10,
        nome: 'Sinvastatina 20mg',
        codigo_catmat: 'BR0267795U0026',
        dosagem: '20mg',
        posologia: '1x/dia a noite',
        via_administracao: 'oral',
        data_inicio: '2019-01',
        ativo: true,
      },
      {
        id: 13,
        paciente_id: pacienteId,
        atendimento_id: 10,
        nome: 'Insulina NPH',
        codigo_catmat: 'BR0271157U0063',
        dosagem: '10 UI',
        posologia: '1x/dia a noite',
        via_administracao: 'subcutanea',
        data_inicio: '2025-12',
        ativo: true,
      },
    ];
  }

  async getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]> {
    return [
      {
        id: 10,
        atendimento_id: atendimentoId,
        paciente_id: 10,
        pa_sistolica: 155,
        pa_diastolica: 95,
        peso: 92,
        altura: 172,
        glicemia_capilar: 189,
        freq_cardiaca: 78,
        data_medicao: '2025-12-10T10:05:00-03:00',
      },
    ];
  }

  async getProfissional(): Promise<IpmProfissional | null> {
    return {
      id: 10,
      nome: 'Dra. Fernanda Weiss',
      cns: '898002222333040',
      cbo: '225125',
      cbo_descricao: 'Medico clinico',
    };
  }

  async getEstabelecimento(): Promise<IpmEstabelecimento | null> {
    return {
      id: 10,
      nome: 'UBS Central Ascurra',
      cnes: '2569841',
      tipo: 'UBS',
      municipio_ibge: '4201901',
    };
  }
}

describe('Jose scenario — elderly patient with polypharmacy', () => {
  let result: Awaited<ReturnType<typeof processar>>;
  let bundle: Bundle;

  beforeEach(async () => {
    let counter = 0;
    setUuidGenerator(() => {
      counter++;
      const hex = counter.toString(16).padStart(12, '0');
      return `00000000-0000-4000-c000-${hex}`;
    });
    const dataSource = new JoseDataSource();
    result = await processar('71428793003', dataSource);
    bundle = result.bundle;
  });

  // --- Bundle structure ---

  it('should produce a valid Bundle', () => {
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should be a document Bundle', () => {
    expect(bundle.type).toBe('document');
  });

  it('should have Composition as first entry', () => {
    expect(bundle.entry?.[0]?.resource?.resourceType).toBe('Composition');
  });

  it('should have correct number of entries', () => {
    // Composition + Patient + Practitioner + Organization + Encounter
    // + 3 Conditions + 1 Allergy + 6 VitalSigns (PA x2 + peso + altura + glicemia + FC)
    // + 4 Medications = 19
    // NO DUM, NO obstetric history (male patient)
    expect(bundle.entry).toHaveLength(19);
  });

  it('should have timestamp', () => {
    expect(bundle.timestamp).toBeDefined();
  });

  // --- Composition (RAC) ---

  it('should have RAC type in Composition', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.type?.coding?.[0]?.code).toBe('RAC');
  });

  it('should have 4 sections (diagnosticos, sinaisVitais, alergias, medicamentos)', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.section).toHaveLength(4);
  });

  it('should have diagnosticosAvaliados section with 3 conditions', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const diagSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '57852-6')
    );
    expect(diagSection?.entry).toHaveLength(3);
  });

  it('should have sinaisVitais section with 6 observations', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const vsSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '8716-3')
    );
    // PA x2 + peso + altura + glicemia + FC = 6
    expect(vsSection?.entry).toHaveLength(6);
  });

  it('should have alergias section with 1 allergy', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const allergySection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '48765-2')
    );
    expect(allergySection?.entry).toHaveLength(1);
  });

  it('should have medicamentos section with 4 medications', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    const medSection = comp.section?.find((s) =>
      s.code?.coding?.some((c) => c.code === '52471-0')
    );
    expect(medSection?.entry).toHaveLength(4);
  });

  it('should have Composition.identifier', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.identifier).toBeDefined();
    expect(comp.identifier?.system).toContain('ponte');
  });

  it('should have Composition.attester', () => {
    const comp = bundle.entry?.[0]?.resource as Composition;
    expect(comp.attester).toBeDefined();
    expect(comp.attester).toHaveLength(1);
    expect(comp.attester?.[0]?.mode).toBe('professional');
  });

  // --- Patient ---

  it('should have male patient', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    expect(patient.gender).toBe('male');
  });

  it('should have valid CPF (71428793003)', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const cpf = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cpf'
    );
    expect(cpf?.value).toBe('71428793003');
    // Valid CPF — no warning
    expect(result.validation.warnings.some((w) => w.includes('CPF'))).toBe(false);
  });

  it('should have CPF with type TAX and use official', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const cpf = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cpf'
    );
    expect(cpf?.type?.coding?.[0]?.code).toBe('TAX');
    expect(cpf?.use).toBe('official');
  });

  it('should have CNS identifier', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const cns = patient.identifier?.find(
      (id) => id.system === 'https://saude.gov.br/fhir/sid/cns'
    );
    expect(cns?.value).toBe('898007654321050');
  });

  it('should have raca branca (01)', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const raca = patient.extension?.find((ext) => ext.url?.includes('BRRacaCorEtnia'));
    expect(raca?.valueCodeableConcept?.coding?.[0]?.code).toBe('01'); // branca
  });

  it('should have birthDate', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    expect(patient.birthDate).toBe('1956-06-12');
  });

  it('should have telecom (phone)', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    const phone = patient.telecom?.find((t) => t.system === 'phone');
    expect(phone?.value).toBe('47991234567');
  });

  it('should have address with municipio_ibge', () => {
    const patient = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Patient'
    )?.resource as Patient;
    expect(patient.address).toBeDefined();
    expect(patient.address?.[0]?.text).toBe('Rua XV de Novembro, 123, Centro');
  });

  // --- Conditions ---

  it('should have hipertensao I10 with CIAP K86', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    const htn = conditions?.find(
      (c) => c.code?.coding?.some((cd) => cd.code === 'I10')
    );
    expect(htn).toBeDefined();
    expect(htn?.clinicalStatus?.coding?.[0]?.code).toBe('active');
    // Check CIAP-2 is present as second coding
    const ciap = htn?.code?.coding?.find((cd) => cd.code === 'K86');
    expect(ciap).toBeDefined();
  });

  it('should have diabetes E11.9 with CIAP T90', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    const dm = conditions?.find(
      (c) => c.code?.coding?.some((cd) => cd.code === 'E11.9')
    );
    expect(dm).toBeDefined();
    const ciap = dm?.code?.coding?.find((cd) => cd.code === 'T90');
    expect(ciap).toBeDefined();
  });

  it('should have DRC N18.3', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    const drc = conditions?.find(
      (c) => c.code?.coding?.some((cd) => cd.code === 'N18.3')
    );
    expect(drc).toBeDefined();
    expect(drc?.clinicalStatus?.coding?.[0]?.code).toBe('active');
  });

  it('should have all conditions with CID-10 BR system', () => {
    const conditions = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Condition')
      .map((e) => e.resource as Condition);
    for (const cond of conditions ?? []) {
      const cidCoding = cond.code?.coding?.find(
        (cd) => cd.code && /^[A-Z]\d/.test(cd.code)
      );
      expect(cidCoding?.system).toBe(
        'https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10'
      );
    }
  });

  // --- Allergy ---

  it('should have AAS allergy with low criticality', () => {
    const allergy = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'AllergyIntolerance'
    )?.resource as AllergyIntolerance;
    expect(allergy.code?.text).toBe('Acido acetilsalicilico (AAS)');
    expect(allergy.criticality).toBe('low');
  });

  it('should have urticaria reaction', () => {
    const allergy = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'AllergyIntolerance'
    )?.resource as AllergyIntolerance;
    expect(allergy.reaction?.[0]?.manifestation?.[0]?.text).toBe('Urticaria');
  });

  // --- Vital Signs ---

  it('should have systolic BP 155 mmHg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const systolic = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8480-6'
    );
    expect(systolic?.valueQuantity?.value).toBe(155);
    expect(systolic?.valueQuantity?.code).toBe('mm[Hg]');
  });

  it('should have diastolic BP 95 mmHg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const diastolic = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8462-4'
    );
    expect(diastolic?.valueQuantity?.value).toBe(95);
  });

  it('should have weight 92 kg', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const weight = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '29463-7'
    );
    expect(weight?.valueQuantity?.value).toBe(92);
  });

  it('should have height 172 cm', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const height = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8302-2'
    );
    expect(height?.valueQuantity?.value).toBe(172);
    expect(height?.valueQuantity?.code).toBe('cm');
  });

  it('should have capillary glucose 189 mg/dL', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const glucose = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '2339-0'
    );
    expect(glucose?.valueQuantity?.value).toBe(189);
    expect(glucose?.valueQuantity?.code).toBe('mg/dL');
  });

  it('should have heart rate 78 bpm', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const hr = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8867-4'
    );
    expect(hr?.valueQuantity?.value).toBe(78);
    expect(hr?.valueQuantity?.code).toBe('/min');
  });

  it('should NOT have DUM or obstetric observations (male patient)', () => {
    const observations = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'Observation')
      .map((e) => e.resource as Observation);
    const dum = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '8665-2'
    );
    const gravida = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '11996-6'
    );
    const parity = observations?.find(
      (o) => o.code?.coding?.[0]?.code === '11977-6'
    );
    expect(dum).toBeUndefined();
    expect(gravida).toBeUndefined();
    expect(parity).toBeUndefined();
  });

  // --- Medications (polypharmacy) ---

  it('should have 4 active medications', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    expect(medications).toHaveLength(4);
    for (const med of medications ?? []) {
      expect(med.status).toBe('active');
    }
  });

  it('should have Losartana with CATMAT code', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const losartana = medications?.find((m) =>
      m.medicationCodeableConcept?.text?.includes('Losartana')
    );
    expect(losartana).toBeDefined();
    const brCode = losartana?.medicationCodeableConcept?.coding?.find(
      (c) => c.system?.includes('BRMedicamento')
    );
    expect(brCode?.code).toBe('BR0267402U0055');
  });

  it('should have Metformina with CATMAT code', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const metformina = medications?.find((m) =>
      m.medicationCodeableConcept?.text?.includes('Metformina')
    );
    expect(metformina).toBeDefined();
    const brCode = metformina?.medicationCodeableConcept?.coding?.find(
      (c) => c.system?.includes('BRMedicamento')
    );
    expect(brCode?.code).toBe('BR0267417U0022');
  });

  it('should have Sinvastatina with CATMAT code', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const sinva = medications?.find((m) =>
      m.medicationCodeableConcept?.text?.includes('Sinvastatina')
    );
    expect(sinva).toBeDefined();
    const brCode = sinva?.medicationCodeableConcept?.coding?.find(
      (c) => c.system?.includes('BRMedicamento')
    );
    expect(brCode?.code).toBe('BR0267795U0026');
  });

  it('should have Insulina NPH with CATMAT code', () => {
    const medications = bundle.entry
      ?.filter((e) => e.resource?.resourceType === 'MedicationStatement')
      .map((e) => e.resource as MedicationStatement);
    const insulina = medications?.find((m) =>
      m.medicationCodeableConcept?.text?.includes('Insulina')
    );
    expect(insulina).toBeDefined();
    const brCode = insulina?.medicationCodeableConcept?.coding?.find(
      (c) => c.system?.includes('BRMedicamento')
    );
    expect(brCode?.code).toBe('BR0271157U0063');
  });

  // --- Encounter ---

  it('should have finished AMB Encounter', () => {
    const encounter = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as Encounter;
    expect(encounter.status).toBe('finished');
    expect(encounter.class?.code).toBe('AMB');
  });

  it('should have 3 diagnoses in Encounter', () => {
    const encounter = bundle.entry?.find(
      (e) => e.resource?.resourceType === 'Encounter'
    )?.resource as Encounter;
    expect(encounter.diagnosis).toHaveLength(3);
  });

  // --- References ---

  it('should have all urn:uuid references resolving', () => {
    const fullUrls = new Set(bundle.entry?.map((e) => e.fullUrl));
    for (const entry of bundle.entry ?? []) {
      const json = JSON.stringify(entry.resource);
      const refs = [...json.matchAll(/"reference":"(urn:uuid:[^"]+)"/g)];
      for (const [, ref] of refs) {
        expect(fullUrls.has(ref), `Reference ${ref} should resolve`).toBe(true);
      }
    }
  });

  // --- No RNDS client ---

  it('should work without RNDS client (no envio)', () => {
    expect(result.envio).toBeUndefined();
  });
});
