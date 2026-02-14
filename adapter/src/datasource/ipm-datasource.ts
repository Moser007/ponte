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
 * Interface para acesso a dados do IPM Atende.Net.
 * Em produção: implementação com pg (PostgreSQL).
 * Em desenvolvimento/testes: MockDataSource.
 */
export interface IpmDataSource {
  getPaciente(cpf: string): Promise<IpmPaciente | null>;
  getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]>;
  getProblemas(atendimentoId: number): Promise<IpmProblema[]>;
  getAlergias(pacienteId: number): Promise<IpmAlergia[]>;
  getMedicamentos(pacienteId: number): Promise<IpmMedicamento[]>;
  getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]>;
  getProfissional(profissionalId: number): Promise<IpmProfissional | null>;
  getEstabelecimento(estabelecimentoId: number): Promise<IpmEstabelecimento | null>;
}
