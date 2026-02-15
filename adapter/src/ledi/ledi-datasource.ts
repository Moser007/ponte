/**
 * DataSource que lê dados de arquivos LEDI (.esus) exportados pelo IPM.
 *
 * Implementa a interface IpmDataSource, permitindo que o mesmo pipeline
 * de builders FHIR funcione tanto com dados de banco (Via A) quanto
 * com dados de exportação LEDI (Via B).
 *
 * Uso:
 *   const ds = new LediDataSource();
 *   ds.loadFile(buffer);                      // carrega um .esus
 *   ds.loadFiles([buffer1, buffer2, ...]);     // carrega múltiplos
 *   const resultado = await processar(cpf, ds);
 */

import type { IpmDataSource } from '../datasource/ipm-datasource.js';
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
import { TipoDadoSerializado } from '../types/ledi.js';
import type { DadoTransporteThrift } from '../types/ledi.js';
import { ThriftReader } from './thrift-reader.js';
import { readDadoTransporte, readFichaAtendimentoIndividualMaster, readCadastroIndividual } from './deserializers.js';
import { mapFai, mapFci, mergePaciente, resetIdCounter } from './ledi-mapper.js';
import type { LediAtendimentoMapeado } from './ledi-mapper.js';

/**
 * DataSource baseado em arquivos LEDI/Thrift.
 *
 * Carrega arquivos .esus, deserializa, mapeia para tipos IPM,
 * e disponibiliza via interface IpmDataSource para o pipeline FHIR.
 */
export class LediDataSource implements IpmDataSource {
  /** Pacientes indexados por CPF */
  private pacientes = new Map<string, IpmPaciente>();

  /** Atendimentos por paciente_id */
  private atendimentos = new Map<number, IpmAtendimento[]>();

  /** Problemas por atendimento_id */
  private problemas = new Map<number, IpmProblema[]>();

  /** Alergias por paciente_id (LEDI FAI não tem alergias — vem do FCI/condições) */
  private alergias = new Map<number, IpmAlergia[]>();

  /** Medicamentos por paciente_id */
  private medicamentos = new Map<number, IpmMedicamento[]>();

  /** Sinais vitais por atendimento_id */
  private sinaisVitais = new Map<number, IpmSinalVital[]>();

  /** Profissionais por id */
  private profissionaisMap = new Map<number, IpmProfissional>();

  /** Estabelecimentos por id */
  private estabelecimentosMap = new Map<number, IpmEstabelecimento>();

  /** Código IBGE do município (do DadoTransporte) */
  private codIbge = '';

  constructor() {
    resetIdCounter();
  }

  // ── Carregar dados ─────────────────────────────────────────

  /**
   * Carrega um único arquivo .esus (buffer binário).
   * Pode ser chamado múltiplas vezes para carregar fichas de diferentes arquivos.
   */
  loadFile(buffer: Buffer): void {
    const reader = new ThriftReader(buffer);
    const transporte = readDadoTransporte(reader);
    this.codIbge = transporte.codIbge;
    this.processTransporte(transporte);
  }

  /**
   * Carrega múltiplos arquivos .esus.
   */
  loadFiles(buffers: Buffer[]): void {
    for (const buf of buffers) {
      this.loadFile(buf);
    }
  }

  /**
   * Carrega dados diretamente de um DadoTransporteThrift já deserializado.
   */
  loadTransporte(transporte: DadoTransporteThrift): void {
    this.codIbge = transporte.codIbge;
    this.processTransporte(transporte);
  }

  private processTransporte(transporte: DadoTransporteThrift): void {
    const innerReader = new ThriftReader(transporte.dadoSerializado);

    switch (transporte.tipoDadoSerializado) {
      case TipoDadoSerializado.AtendimentoIndividual: {
        const master = readFichaAtendimentoIndividualMaster(innerReader);
        const mapeados = mapFai(master);
        for (const m of mapeados) {
          this.storeMapeado(m, transporte);
        }
        break;
      }
      case TipoDadoSerializado.CadastroIndividual: {
        const fci = readCadastroIndividual(innerReader);
        const pacienteParcial = mapFci(fci);
        if (pacienteParcial.cpf) {
          const existing = this.pacientes.get(pacienteParcial.cpf);
          if (existing) {
            const merged = mergePaciente(pacienteParcial, existing);
            merged.id = existing.id; // preservar ID para referências
            this.pacientes.set(pacienteParcial.cpf, merged);
          } else {
            this.pacientes.set(pacienteParcial.cpf, {
              ...pacienteParcial,
              nome: pacienteParcial.nome ?? '',
              cpf: pacienteParcial.cpf,
              data_nascimento: pacienteParcial.data_nascimento ?? '',
              sexo: pacienteParcial.sexo ?? 'F',
              raca_cor: pacienteParcial.raca_cor ?? 'parda',
            } as IpmPaciente);
          }
        }
        break;
      }
      default:
        // Tipos não suportados (odontológico, visita domiciliar, etc.) são ignorados
        break;
    }
  }

  private storeMapeado(m: LediAtendimentoMapeado, transporte: DadoTransporteThrift): void {
    const cpf = m.paciente.cpf;
    if (!cpf) return;

    // Paciente
    const existing = this.pacientes.get(cpf);
    if (existing) {
      const merged = mergePaciente(existing, m.paciente);
      merged.id = existing.id;
      merged.municipio_ibge = transporte.codIbge;
      this.pacientes.set(cpf, merged);
    } else {
      const paciente: IpmPaciente = {
        ...m.paciente,
        nome: m.paciente.nome ?? '',
        cpf,
        data_nascimento: m.paciente.data_nascimento ?? '',
        sexo: m.paciente.sexo ?? 'F',
        raca_cor: m.paciente.raca_cor ?? 'parda',
        municipio_ibge: transporte.codIbge,
      } as IpmPaciente;
      this.pacientes.set(cpf, paciente);
    }

    const paciente = this.pacientes.get(cpf)!;
    const pacienteId = paciente.id;

    // Atendimento (ajustar paciente_id para o ID canônico)
    const atend = { ...m.atendimento, paciente_id: pacienteId };
    const atendList = this.atendimentos.get(pacienteId) ?? [];
    atendList.push(atend);
    this.atendimentos.set(pacienteId, atendList);

    // Problemas
    const probs = m.problemas.map((p) => ({ ...p, paciente_id: pacienteId }));
    const probList = this.problemas.get(atend.id) ?? [];
    probList.push(...probs);
    this.problemas.set(atend.id, probList);

    // Medicamentos
    const meds = m.medicamentos.map((med) => ({ ...med, paciente_id: pacienteId }));
    const medList = this.medicamentos.get(pacienteId) ?? [];
    medList.push(...meds);
    this.medicamentos.set(pacienteId, medList);

    // Sinais vitais
    const vitais = m.sinaisVitais.map((sv) => ({ ...sv, paciente_id: pacienteId }));
    const vitalList = this.sinaisVitais.get(atend.id) ?? [];
    vitalList.push(...vitais);
    this.sinaisVitais.set(atend.id, vitalList);

    // Profissional
    if (m.profissional.cns) {
      this.profissionaisMap.set(atend.profissional_id, m.profissional as IpmProfissional);
    }

    // Estabelecimento
    if (m.estabelecimento.cnes) {
      const estab = {
        ...m.estabelecimento,
        municipio_ibge: transporte.codIbge,
      } as IpmEstabelecimento;
      this.estabelecimentosMap.set(atend.estabelecimento_id, estab);
    }
  }

  // ── Interface IpmDataSource ────────────────────────────────

  async getPaciente(cpf: string): Promise<IpmPaciente | null> {
    return this.pacientes.get(cpf) ?? null;
  }

  async getAtendimentos(pacienteId: number): Promise<IpmAtendimento[]> {
    return this.atendimentos.get(pacienteId) ?? [];
  }

  async getProblemas(atendimentoId: number): Promise<IpmProblema[]> {
    return this.problemas.get(atendimentoId) ?? [];
  }

  async getAlergias(pacienteId: number): Promise<IpmAlergia[]> {
    return this.alergias.get(pacienteId) ?? [];
  }

  async getMedicamentos(pacienteId: number): Promise<IpmMedicamento[]> {
    return this.medicamentos.get(pacienteId) ?? [];
  }

  async getSinaisVitais(atendimentoId: number): Promise<IpmSinalVital[]> {
    return this.sinaisVitais.get(atendimentoId) ?? [];
  }

  async getProfissional(profissionalId: number): Promise<IpmProfissional | null> {
    return this.profissionaisMap.get(profissionalId) ?? null;
  }

  async getEstabelecimento(estabelecimentoId: number): Promise<IpmEstabelecimento | null> {
    return this.estabelecimentosMap.get(estabelecimentoId) ?? null;
  }
}
