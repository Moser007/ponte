# Ponte Adapter — IPM Atende.Net → RNDS

Adaptador que transforma dados do sistema IPM Atende.Net em recursos FHIR R4 compatíveis com a RNDS (Rede Nacional de Dados em Saúde), usando perfis BR Core.

## Por que existe

O IPM Atende.Net é usado por 120+ municípios em SC, mas **não envia dados clínicos à RNDS** — apenas vacinação COVID. Isso significa que quando uma gestante atendida em UBS com IPM chega a uma maternidade de referência, o obstetra não tem acesso ao pré-natal, diagnósticos, alergias ou medicamentos.

O adaptador gera Bundles RAC (Registro de Atendimento Clínico) a partir dos dados do IPM e os envia à RNDS via FHIR R4.

## Uso rápido

```bash
npm install
npm test        # 175 testes
npm run demo    # Cenário Maria (gestante alto risco)
npm run build   # Compila TypeScript
```

## Cenário Maria (demo)

Gestante de 39 anos, G3P1, alto risco:

| Dado | Valor |
|------|-------|
| Diagnósticos | Diabetes gestacional (O24.4), Hipertensão gestacional (O13) |
| Alergia | Penicilina (gravidade alta, anafilaxia) |
| Medicamentos | Insulina NPH 10UI 2x/dia, Metildopa 250mg 3x/dia |
| PA | 130/85 mmHg |
| Glicemia | 135 mg/dL |
| IG | 32 semanas |
| DUM | 2025-04-10 |

O demo gera um Bundle RAC FHIR R4 com **18 entries** contendo todos esses dados em formato que a RNDS aceita.

## Arquitetura

```
IPM (PostgreSQL) → DataSource → Builders → Composition → Bundle RAC → Validação → RNDS
```

### Builders FHIR R4

| Builder | Perfil BR Core | Códigos |
|---------|---------------|---------|
| `patient.ts` | BRCorePatient | CPF, CNS, raça/cor |
| `practitioner.ts` | BRCorePractitioner | CNS, CBO |
| `organization.ts` | BRCoreOrganization | CNES |
| `encounter.ts` | BRCoreEncounter | AMB |
| `condition.ts` | BRCoreCondition | CID-10 (BRCID10), CIAP-2 |
| `allergy.ts` | BRCoreAllergyIntolerance | BRMedicamento/CATMAT |
| `vital-signs.ts` | BRCoreVitalSigns | LOINC, UCUM |
| `medication.ts` | BRCoreMedicationStatement | BRMedicamento/CATMAT |
| `composition.ts` | RAC | 4 seções (diagnósticos, vitais, alergias, medicamentos) |

### Observations adicionais

| Observation | LOINC | Tipo |
|------------|-------|------|
| PA sistólica | 8480-6 | valueQuantity (mm[Hg]) |
| PA diastólica | 8462-4 | valueQuantity (mm[Hg]) |
| Peso | 29463-7 | valueQuantity (kg) |
| Glicemia capilar | 2339-0 | valueQuantity (mg/dL) |
| Idade gestacional | 11884-4 | valueQuantity (wk) |
| DUM | 8665-2 | valueDateTime |
| Gestas prévias | 11996-6 | valueQuantity ({#}) |
| Partos | 11977-6 | valueQuantity ({#}) |

## Estrutura

```
adapter/
├── src/
│   ├── index.ts              # Orquestrador (processar)
│   ├── types/ipm.ts          # Interfaces IPM
│   ├── datasource/           # Interface + Mock (Maria)
│   ├── builders/             # IPM → FHIR R4
│   ├── bundle/               # RAC Bundle assembler
│   ├── rnds/                 # Auth + Client (stubs)
│   └── validation/           # Validação local + CPF + CNS + CNES
├── tests/                    # 175 testes (Vitest)
├── demo.ts                   # Demo CLI
└── package.json
```

## Status

- [x] Bundle RAC FHIR R4 conforme BR Core
- [x] 19 problemas de conformidade corrigidos (R011/R014)
- [x] Códigos reais: BRCID10, BRMedicamento/CATMAT, LOINC, UCUM
- [x] Validação CPF (algoritmo Receita Federal)
- [x] UUIDs reais (crypto.randomUUID)
- [ ] DataSource real (PostgreSQL) — depende de acesso a banco IPM
- [ ] Auth mTLS real — depende de certificado ICP-Brasil
- [ ] Envio real à RNDS — depende de credenciamento RNDS

## Dependências

Apenas 2 dependências de produção:
- `@medplum/core` — validação FHIR R4
- `@medplum/fhirtypes` — tipos TypeScript para FHIR R4

## Licença

MIT
