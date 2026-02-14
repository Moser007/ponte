import type { IpmDataSource } from './ipm-datasource.js';
import type {
  IpmPaciente,
  IpmAtendimento,
  IpmProblema,
  IpmAlergia,
  IpmMedicamento,
  IpmSinalVital,
  IpmProfissional,
  IpmEstabelecimento,
} from '../types/ipm.js';

/**
 * Mock data source com dados da Maria (cenário pré-natal de alto risco).
 * Reproduz o cenário do bridge/src/demo.js em formato IPM real.
 */
export class MockDataSource implements IpmDataSource {
  private pacientes: IpmPaciente[] = [
    {
      id: 1,
      nome: 'Maria Silva Santos',
      cpf: '12345678901',
      cns: '898001234567893',
      data_nascimento: '1985-03-15',
      sexo: 'F',
      raca_cor: 'parda',
      tipo_sanguineo: 'O+',
      municipio_ibge: '4205407', // Florianópolis
      // Campos obstétricos (LEDI)
      gestante: true,
      dum: '2025-04-10',            // DUM → IG ~32 semanas em 20/11/2025
      gestas_previas: 2,
      partos: 1,
      maternidade_referencia: 'Maternidade Regional de Blumenau'
    },
  ];

  private profissionais: IpmProfissional[] = [
    {
      id: 1,
      nome: 'Dr. João Oliveira',
      cns: '898009876543210',
      cbo: '225142', // Médico ginecologista e obstetra
      cbo_descricao: 'Médico ginecologista e obstetra',
    },
  ];

  private estabelecimentos: IpmEstabelecimento[] = [
    {
      id: 1,
      nome: 'UBS Vila Nova',
      cnes: '2695251',
      tipo: 'UBS',
      municipio_ibge: '4205407',
    },
  ];

  private atendimentos: IpmAtendimento[] = [
    {
      id: 1,
      paciente_id: 1,
      profissional_id: 1,
      estabelecimento_id: 1,
      data_inicio: '2025-11-20T09:00:00-03:00',
      data_fim: '2025-11-20T09:45:00-03:00',
      tipo: 'prenatal',
      observacoes:
        'Glicemia jejum 135mg/dL. Ajuste de insulina. PA controlada com metildopa. Encaminhada para USG obstétrica.',
    },
  ];

  private problemas: IpmProblema[] = [
    {
      id: 1,
      atendimento_id: 1,
      paciente_id: 1,
      cid: 'O24.4',
      descricao: 'Diabetes mellitus gestacional',
      data_inicio: '2025-06',
      ativo: true,
    },
    {
      id: 2,
      atendimento_id: 1,
      paciente_id: 1,
      cid: 'O13',
      descricao: 'Hipertensão gestacional',
      data_inicio: '2025-09',
      ativo: true,
    },
  ];

  private alergias: IpmAlergia[] = [
    {
      id: 1,
      paciente_id: 1,
      substancia: 'Penicilina',
      codigo: 'BR0270616U0118',
      gravidade: 'high',
      reacao: 'Anafilaxia',
    },
  ];

  private medicamentos: IpmMedicamento[] = [
    {
      id: 1,
      paciente_id: 1,
      atendimento_id: 1,
      nome: 'Insulina NPH',
      codigo_catmat: 'BR0271157U0063',  // BRMedicamento/CATMAT insulina humana NPH
      dosagem: '10 UI',
      posologia: '2x/dia (café e jantar)',
      via_administracao: 'subcutânea',
      data_inicio: '2025-07',
      ativo: true,
    },
    {
      id: 2,
      paciente_id: 1,
      atendimento_id: 1,
      nome: 'Metildopa 250mg',
      codigo_catmat: 'BR0267689U0042',  // BRMedicamento/CATMAT metildopa 250mg
      dosagem: '250mg',
      posologia: '3x/dia',
      via_administracao: 'oral',
      data_inicio: '2025-09',
      ativo: true,
    },
  ];

  private sinaisVitais: IpmSinalVital[] = [
    {
      id: 1,
      atendimento_id: 1,
      paciente_id: 1,
      pa_sistolica: 130,
      pa_diastolica: 85,
      peso: 78,
      semanas_gestacionais: 32,
      data_medicao: '2025-11-20T09:15:00-03:00',
    },
  ];

  async getPaciente(cpf: string): Promise<IpmPaciente | null> {
    return this.pacientes.find((p) => p.cpf === cpf) ?? null;
  }

  async getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]> {
    return this.atendimentos.filter((a) => a.paciente_id === pacienteId);
  }

  async getProblemas(atendimentoId: number): Promise<IpmProblema[]> {
    return this.problemas.filter((p) => p.atendimento_id === atendimentoId);
  }

  async getAlergias(pacienteId: number): Promise<IpmAlergia[]> {
    return this.alergias.filter((a) => a.paciente_id === pacienteId);
  }

  async getMedicamentos(pacienteId: number): Promise<IpmMedicamento[]> {
    return this.medicamentos.filter((m) => m.paciente_id === pacienteId);
  }

  async getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]> {
    return this.sinaisVitais.filter((s) => s.atendimento_id === atendimentoId);
  }

  async getProfissional(profissionalId: number): Promise<IpmProfissional | null> {
    return this.profissionais.find((p) => p.id === profissionalId) ?? null;
  }

  async getEstabelecimento(estabelecimentoId: number): Promise<IpmEstabelecimento | null> {
    return this.estabelecimentos.find((e) => e.id === estabelecimentoId) ?? null;
  }
}
