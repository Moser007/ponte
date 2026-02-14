# Bridge Protocol Specification v0.1

> "A especificação mais útil é a que um desenvolvedor sozinho implementa num fim de semana."

## Objetivo

Permitir que dois sistemas de saúde que não se conhecem troquem informações de paciente de forma padronizada, segura e mínima — sem exigir que nenhum dos dois mude sua arquitetura interna.

## Arquitetura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Sistema A   │────▶│    BRIDGE    │────▶│  Sistema B   │
│  (ex: UBS)   │     │  (tradutor)  │     │(ex: Hospital)│
│              │◀────│              │◀────│              │
└──────────────┘     └──────────────┘     └──────────────┘
```

O Bridge não armazena dados. Ele **traduz** entre formatos e **roteia** entre sistemas. É uma camada intermediária stateless.

## Conceitos fundamentais

### 1. Patient Summary (Resumo do Paciente)

O menor conjunto de informações que um profissional de saúde precisa ao receber um paciente que nunca viu antes.

```json
{
  "bridge_version": "0.1",
  "patient": {
    "id": "hash-anonimizado",
    "birth_year": 1985,
    "sex": "F",
    "blood_type": "O+"
  },
  "conditions": [
    {
      "code": "O24.4",
      "system": "ICD-10",
      "description": "Diabetes mellitus gestacional",
      "onset": "2025-06",
      "status": "active"
    }
  ],
  "allergies": [
    {
      "substance": "Penicilina",
      "severity": "high",
      "reaction": "Anafilaxia"
    }
  ],
  "medications": [
    {
      "name": "Insulina NPH",
      "dose": "10 UI",
      "frequency": "2x/dia",
      "start": "2025-07"
    }
  ],
  "recent_encounters": [
    {
      "date": "2025-11-20",
      "type": "prenatal",
      "provider": "UBS Vila Nova",
      "notes": "Glicemia de jejum 135mg/dL. Ajuste de insulina.",
      "vitals": {
        "bp_systolic": 130,
        "bp_diastolic": 85,
        "weight_kg": 78,
        "gestational_weeks": 32
      }
    }
  ],
  "flags": [
    "HIGH_RISK_PREGNANCY"
  ]
}
```

### 2. Adaptadores (Adapters)

Cada sistema existente fala sua própria linguagem. O adaptador traduz de/para o formato Bridge.

```
Sistema Legado ──▶ [Adapter] ──▶ Patient Summary (formato Bridge)
Patient Summary ──▶ [Adapter] ──▶ Sistema Legado
```

Um adaptador é uma função com duas operações:
- `extract(source_data) → PatientSummary`
- `inject(PatientSummary) → target_format`

### 3. Roteamento por necessidade

O Bridge não sincroniza tudo com tudo. Ele responde a uma pergunta específica:

> "Este paciente (identificado por X) tem dados em outros sistemas? Se sim, envie o resumo."

A consulta é **pull-based** (sob demanda), não push-based. Isso minimiza problemas de privacidade e consentimento.

## Fluxo de operação

```
1. Paciente chega à emergência do Hospital B
2. Profissional consulta o Bridge com identificador do paciente
3. Bridge verifica quais sistemas têm dados deste paciente
4. Bridge solicita Patient Summary a cada sistema via adaptador
5. Bridge consolida e entrega ao profissional
6. Tempo total alvo: < 5 segundos
```

## Identificação do paciente

O desafio número 1 de interoperabilidade. Para v0.1, usamos abordagem pragmática:

- **Identificador primário**: CPF (no Brasil) ou equivalente nacional, sempre hasheado (SHA-256 + salt por instalação)
- **Matching secundário**: nome normalizado + data de nascimento + nome da mãe (fuzzy matching para cobrir variações)
- **Consentimento**: o paciente deve consentir ativamente ao se cadastrar em qualquer sistema conectado ao Bridge

## Segurança (mínima viável)

- **Em trânsito**: TLS 1.3 obrigatório
- **Identificadores**: sempre hasheados, nunca em texto claro
- **Dados em repouso**: o Bridge não armazena nada. Zero data at rest.
- **Autenticação**: mTLS entre Bridge e sistemas. Cada sistema tem certificado próprio.
- **Auditoria**: toda consulta gera log imutável (quem pediu, quando, sobre quem, por quê)
- **Consentimento**: modelo opt-in. Nenhum dado trafega sem consentimento registrado do paciente.

## O que esta especificação NÃO cobre (intencionalmente)

- Imagens médicas (DICOM) — complexidade desproporcional para v0.1
- Interoperabilidade internacional — começamos com um país
- Dados genômicos — requer framework de consentimento mais robusto
- Prescrição eletrônica — regulação específica por jurisdição
- Faturamento/billing — domínio diferente, Bridge diferente

## Compatibilidade com padrões existentes

- O Patient Summary é um **subconjunto simplificado** do FHIR Patient resource + Condition + AllergyIntolerance + MedicationStatement
- Adaptadores para FHIR são triviais (mapeamento 1:1 na maioria dos campos)
- Adaptadores para HL7v2 requerem parsing de segmentos PID, DG1, AL1, RXA
- Adaptadores para sistemas proprietários são específicos por vendor

O Bridge não compete com FHIR. Ele é a **rampa de acesso** para sistemas que ainda não conseguem implementar FHIR completo.

## Critério de sucesso v0.1

Um cenário real demonstrado:

> Uma gestante de alto risco faz pré-natal na UBS Vila Nova (Sistema A).
> Ela tem uma emergência e chega à maternidade do Hospital Regional (Sistema B).
> O obstetra de plantão, que nunca a viu antes, acessa seu histórico completo em menos de 5 segundos.
> Antes do Bridge: isso não era possível. Depois: é.

Se este cenário funcionar uma vez, no mundo real, com dados reais — a v0.1 cumpriu seu papel.
