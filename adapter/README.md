# Ponte Adapter — IPM Atende.Net → RNDS

Adaptador que transforma dados do sistema IPM Atende.Net em recursos FHIR R4 compatíveis com a RNDS (Rede Nacional de Dados em Saúde), usando perfis BR Core.

## Por que existe

O IPM Atende.Net é usado por 120+ municípios em SC, mas **não envia dados clínicos à RNDS** — apenas vacinação COVID. Isso significa que quando uma gestante atendida em UBS com IPM chega a uma maternidade de referência, o obstetra não tem acesso ao pré-natal, diagnósticos, alergias ou medicamentos.

O adaptador gera Bundles RAC (Registro de Atendimento Clínico) a partir dos dados do IPM e os envia à RNDS via FHIR R4.

## Uso rápido

```bash
npm install
npm test        # 318 testes
npm run demo    # Cenário Maria (gestante alto risco)
npm run build   # Compila TypeScript
```

## Duas vias de entrada

```
Via A: IPM (PostgreSQL) → SQL DataSource → Ponte → FHIR R4 → RNDS
Via B: IPM → LEDI (.esus)  → LEDI DataSource → Ponte → FHIR R4 → RNDS  ✅ implementada
```

**Via A** (banco direto) requer acesso ao PostgreSQL do IPM. Depende de cooperação do município.

**Via B** (LEDI/Thrift) lê os arquivos `.esus` que o IPM já exporta para o e-SUS/SISAB. Schema 100% público (UFSC/Bridge). Funciona com qualquer sistema que exporte LEDI — não só IPM. Parser Thrift customizado, zero dependências externas.

## Cenários de teste

### Maria — gestante de alto risco (18 entries)

| Dado | Valor |
|------|-------|
| Diagnósticos | Diabetes gestacional (O24.4), Hipertensão gestacional (O13) |
| Alergia | Penicilina (gravidade alta, anafilaxia) |
| Medicamentos | Insulina NPH 10UI 2x/dia, Metildopa 250mg 3x/dia |
| PA | 130/85 mmHg |
| Glicemia | 135 mg/dL |
| IG | 32 semanas |
| DUM | 2025-04-10 |
| Obstétrico | G3P1 |

### José — idoso com polifarmácia (19 entries)

| Dado | Valor |
|------|-------|
| Diagnósticos | Hipertensão essencial (I10), DM2 (E11.9), DRC estágio 3 (N18.3) |
| Alergia | AAS (gravidade baixa, urticária) |
| Medicamentos | Losartana 50mg, Metformina 850mg, Sinvastatina 20mg, Insulina NPH 10UI |
| PA | 155/95 mmHg |
| Glicemia | 189 mg/dL |
| Peso/Altura | 92 kg / 172 cm |
| FC | 78 bpm |

Demonstra que o adaptador funciona para **qualquer paciente**, não só gestantes.

## Arquitetura

```
IPM Data → DataSource (Mock | LEDI | SQL) → Builders FHIR R4 → Composition RAC → Bundle → Validação → RNDS
```

### Builders FHIR R4

| Builder | Perfil BR Core | Códigos |
|---------|---------------|---------|
| `patient.ts` | BRCorePatient | CPF, CNS, raça/cor, telecom, address |
| `practitioner.ts` | BRCorePractitioner | CNS, CBO |
| `organization.ts` | BRCoreOrganization | CNES |
| `encounter.ts` | BRCoreEncounter | AMB, EMER |
| `condition.ts` | BRCoreCondition | CID-10 (BRCID10), CIAP-2 |
| `allergy.ts` | BRCoreAllergyIntolerance | BRMedicamento/CATMAT |
| `vital-signs.ts` | BRCoreVitalSigns | LOINC, UCUM |
| `medication.ts` | BRCoreMedicationStatement | BRMedicamento/CATMAT |
| `composition.ts` | RAC | 4 seções (diagnósticos, vitais, alergias, medicamentos) |

### Observations

| Observation | LOINC | Tipo |
|------------|-------|------|
| PA sistólica | 8480-6 | valueQuantity (mm[Hg]) |
| PA diastólica | 8462-4 | valueQuantity (mm[Hg]) |
| Peso | 29463-7 | valueQuantity (kg) |
| Altura | 8302-2 | valueQuantity (cm) |
| Glicemia capilar | 2339-0 | valueQuantity (mg/dL) |
| Freq. cardíaca | 8867-4 | valueQuantity (/min) |
| Idade gestacional | 11884-4 | valueQuantity (wk) |
| DUM | 8665-2 | valueDateTime |
| Gestas prévias | 11996-6 | valueQuantity ({#}) |
| Partos | 11977-6 | valueQuantity ({#}) |

### Parser LEDI/Thrift (Via B)

| Módulo | Função |
|--------|--------|
| `thrift-reader.ts` | Leitor TBinaryProtocol genérico (zero deps) |
| `deserializers.ts` | Deserialização FAI (tipo 4) e FCI (tipo 2) |
| `ledi-mapper.ts` | Mapeamento LEDI → tipos IPM |
| `ledi-datasource.ts` | Implementa IpmDataSource a partir de fichas LEDI |

Suporta: FAI (atendimentos, problemas CID-10/CIAP-2, medicamentos CATMAT, sinais vitais), FCI (demografia, condições de saúde, gestante, maternidade de referência). Merge FCI+FAI por CPF.

## Estrutura

```
adapter/
├── src/
│   ├── index.ts              # Orquestrador (processar)
│   ├── types/
│   │   ├── ipm.ts            # Interfaces IPM
│   │   └── ledi.ts           # Tipos LEDI/Thrift
│   ├── datasource/           # Interface + Mock (Maria)
│   ├── builders/             # IPM → FHIR R4
│   ├── bundle/               # RAC Bundle assembler
│   ├── ledi/                 # Parser LEDI/Thrift (Via B)
│   ├── rnds/                 # Auth + Client (stubs)
│   └── validation/           # Validação local + CPF + CNS + CNES
├── tests/                    # 318 testes em 19 arquivos (Vitest)
├── demo.ts                   # Demo CLI
└── package.json
```

## Status

- [x] Bundle RAC FHIR R4 conforme BR Core
- [x] 19 problemas de conformidade corrigidos (R011/R014)
- [x] Códigos reais: BRCID10, BRMedicamento/CATMAT, LOINC, UCUM
- [x] Validação CPF (algoritmo Receita Federal), CNS (mod 11), CNES (7 dígitos)
- [x] UUIDs reais (crypto.randomUUID)
- [x] Parser LEDI/Thrift — Via B funcional (zero deps externas)
- [x] 2 cenários integrados: Maria (obstétrico) + José (polifarmácia)
- [x] Encounter type mapping: consulta → AMB, urgencia → EMER
- [x] CI/CD GitHub Actions (Node 20 + 22)
- [ ] DataSource SQL (Via A) — depende de acesso a banco IPM
- [ ] Auth mTLS real — depende de certificado ICP-Brasil
- [ ] Envio real à RNDS — depende de credenciamento RNDS

## Dependências

Apenas 2 dependências de produção:
- `@medplum/core` — validação FHIR R4
- `@medplum/fhirtypes` — tipos TypeScript para FHIR R4

## Licença

MIT
