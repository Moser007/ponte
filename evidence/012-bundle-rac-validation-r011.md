# R011 -- Validacao do Bundle RAC com Perfis BR Core

**Data:** 2026-02-14
**Metodo:** Validacao manual contra perfis BR Core (hl7.org.br/fhir/core) e guia tecnico RNDS
**Motivo:** Java 8 disponivel, mas HL7 FHIR Validator CLI requer Java 17+. Validacao manual realizada.
**Bundle analisado:** adapter/bundle-maria.json (13 entries, cenario Maria)

---

## 1. RESUMO EXECUTIVO

| Gravidade | Quantidade | Descricao |
|-----------|-----------|-----------|
| **CRITICO** | **5** | Campos obrigatorios ausentes -- RNDS rejeitaria |
| **ALTO** | **4** | Campos que podem causar rejeicao ou erro de processamento |
| **MEDIO** | **6** | Campos recomendados/must-support ausentes |
| **BAIXO** | **4** | Melhorias de conformidade e boas praticas |
| **TOTAL** | **19** | |

**Resultado geral:** O Bundle NAO seria aceito pela RNDS no estado atual. Ha 5 problemas criticos que precisam ser corrigidos antes de qualquer tentativa de envio.

---

## 2. LISTA DETALHADA DE PROBLEMAS

### CRITICOS (RNDS rejeitaria)

#### C1. Composition.identifier AUSENTE
- **Campo:** `Composition.identifier`
- **Gravidade:** CRITICO
- **Perfil:** br-core-registroatendimentoclinico
- **Descricao:** O perfil RAC exige `identifier` (1..1) com um identificador unico do documento. Nosso Composition nao tem `identifier`. A RNDS usa esse campo para deduplicacao e rastreabilidade.
- **Correcao:** Adicionar `identifier` com system do estabelecimento + value unico (UUID ou ID sequencial).

#### C2. Composition.attester AUSENTE
- **Campo:** `Composition.attester` (1..1), `attester.mode`, `attester.party`, `attester.time`
- **Gravidade:** CRITICO
- **Perfil:** br-core-registroatendimentoclinico
- **Descricao:** O RAC exige um attester (atestante) com mode, party (referencia ao profissional) e time (data/hora da atestacao). Ausente no nosso Bundle.
- **Correcao:** Adicionar `attester` com `mode: "professional"`, `party` referenciando o Practitioner, e `time` com o timestamp do atendimento.

#### C3. Patient.identifier:cpf SEM type e use FIXOS
- **Campo:** `Patient.identifier[cpf].type` e `Patient.identifier[cpf].use`
- **Gravidade:** CRITICO
- **Perfil:** br-core-patient
- **Descricao:** O slice de CPF no BRCorePatient exige valores fixos: `use: "official"` e `type.coding.code: "TAX"`. Nosso Patient tem apenas `system` e `value`, sem `type` nem `use`. O validator FHIR nao reconheceria como slice CPF valido.
- **Correcao:** Adicionar `use: "official"` e `type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "TAX" }] }` ao identifier CPF.

#### C4. AllergyIntolerance.code.coding.system INCORRETO
- **Campo:** `AllergyIntolerance.code.coding[0].system`
- **Gravidade:** CRITICO
- **Valor atual:** `"https://terminologia.saude.gov.br/fhir/ValueSet/BRAlergenos"`
- **Descricao:** O system aponta para a URI do ValueSet, NAO para um CodeSystem. Em FHIR, `coding.system` deve referenciar um CodeSystem, nao um ValueSet. O ValueSet BRAlergenos inclui 3 CodeSystems: `BRMedicamento`, `BRImunobiologico`, e `BRAlergenosCBARA`. Para penicilina (medicamento), o system correto e `https://terminologia.saude.gov.br/fhir/CodeSystem/BRMedicamento`.
- **Correcao:** Usar o CodeSystem correto E incluir o `code` (nao apenas display). Sem o code, o binding required falha.

#### C5. AllergyIntolerance.code.coding SEM code
- **Campo:** `AllergyIntolerance.code.coding[0].code`
- **Gravidade:** CRITICO
- **Descricao:** O coding de penicilina tem apenas `display: "Penicilina"`, sem campo `code`. O binding para BRAlergenos e `required`, o que significa que DEVE haver um codigo valido do ValueSet. Sem `code`, a validacao falha.
- **Correcao:** Pesquisar o codigo correto de penicilina no CodeSystem BRMedicamento e incluir. Alternativa temporaria: usar SNOMED CT com codigo 764146007 (penicillin) se penicilina nao estiver no BRMedicamento.

---

### ALTO (Podem causar rejeicao)

#### A1. Composition.text AUSENTE
- **Campo:** `Composition.text`
- **Gravidade:** ALTO
- **Perfil:** br-core-registroatendimentoclinico
- **Descricao:** O perfil RAC exige `text` (1..1) -- um narrative XHTML resumo do documento. Ausente no nosso Bundle. Algumas implementacoes RNDS podem rejeitar sem narrative.
- **Correcao:** Gerar `text` com `status: "generated"` e `div` contendo resumo XHTML do atendimento.

#### A2. reaction.manifestation.coding SEM code (SNOMED)
- **Campo:** `AllergyIntolerance.reaction[0].manifestation[0].coding[0].code`
- **Gravidade:** ALTO
- **Descricao:** O coding de manifestacao (Anafilaxia) usa system SNOMED CT mas nao tem `code`. Embora o binding seja `example`, a ausencia de code em um coding e um erro estrutural FHIR -- um coding sem code e invalido (constraint ele-1 / coding-1).
- **Correcao:** Adicionar codigo SNOMED: `39579001` (anaphylaxis) ou `68310008` (anaphylactic reaction).

#### A3. Encounter.type AUSENTE (binding required)
- **Campo:** `Encounter.type`
- **Gravidade:** ALTO
- **Perfil:** br-core-encounter
- **Descricao:** Embora `type` seja 0..* no cardinalidade, o binding para `BRAtendimentoPrestado` e `required`. A RNDS pode esperar esse campo para classificar o tipo de atendimento. Ausente no nosso Bundle.
- **Correcao:** Adicionar `type` com codigo de BRAtendimentoPrestado (ex: consulta medica).

#### A4. MedicationStatement.medicationCodeableConcept SEM coding
- **Campo:** `MedicationStatement.medicationCodeableConcept.coding`
- **Gravidade:** ALTO
- **Descricao:** Ambos os MedicationStatements (insulina NPH e metildopa) tem apenas `text`, sem `coding`. O binding para medication e `example`, entao nao falha validacao formal, mas a RNDS pode esperar codificacao estruturada (CATMAT, SNOMED CT, ou EAN).
- **Correcao:** Adicionar coding com codigo CATMAT ou SNOMED CT. Ex: insulina NPH (CATMAT BR0264397, SNOMED 325072002), metildopa (CATMAT, SNOMED 387486006).

---

### MEDIO (Recomendados/Must-Support)

#### M1. Bundle.meta.lastUpdated AUSENTE
- **Campo:** `Bundle.meta.lastUpdated`
- **Gravidade:** MEDIO
- **Descricao:** Boa pratica incluir `meta.lastUpdated` no Bundle para versionamento. Nao obrigatorio, mas recomendado pela RNDS.
- **Correcao:** Adicionar `meta: { lastUpdated: "<ISO datetime>" }` ao Bundle.

#### M2. Bundle.identifier AUSENTE
- **Campo:** `Bundle.identifier`
- **Gravidade:** MEDIO
- **Descricao:** O Bundle tipo document deveria ter um `identifier` para rastreabilidade. Nao e obrigatorio pelo perfil, mas e padrao FHIR para documentos.
- **Correcao:** Adicionar `identifier: { system: "<system>", value: "<UUID>" }`.

#### M3. Condition.code.coding.system USA icd-10 generico
- **Campo:** `Condition.code.coding[0].system`
- **Gravidade:** MEDIO
- **Valor atual:** `"http://hl7.org/fhir/sid/icd-10"`
- **Descricao:** O binding para Condition.code e `required` com ValueSet `BRTerminologiaSuspeitaDiagnostica` que inclui CID-10 via system brasileiro: `http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10`. O system generico HL7 pode nao ser aceito se a RNDS validar binding estrito.
- **Correcao:** Trocar para `"http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10"` ou manter ambos como codings alternativos.

#### M4. Organization.active AUSENTE
- **Campo:** `Organization.active`
- **Gravidade:** MEDIO
- **Descricao:** Campo `active` e must-support em muitas implementacoes. Indica se o estabelecimento esta ativo.
- **Correcao:** Adicionar `active: true`.

#### M5. Encounter.serviceType AUSENTE
- **Campo:** `Encounter.serviceType`
- **Gravidade:** MEDIO
- **Perfil:** br-core-encounter
- **Descricao:** Binding required para `BRServicoEspecializado`. Embora 0..1, quando presente o binding e obrigatorio. Para pre-natal, deveria indicar o servico especializado.
- **Correcao:** Adicionar com codigo de servico pre-natal do ValueSet BRServicoEspecializado.

#### M6. Practitioner SEM CPF
- **Campo:** `Practitioner.identifier`
- **Gravidade:** MEDIO
- **Descricao:** O Practitioner tem apenas CNS. BR Core nao exige CPF para Practitioner, mas a RNDS pode usar CPF para validacao cruzada.
- **Correcao:** Adicionar identifier CPF do profissional se disponivel.

---

### BAIXO (Melhorias de conformidade)

#### B1. Patient.name sem given/family
- **Campo:** `Patient.name[0]`
- **Gravidade:** BAIXO
- **Descricao:** O name usa apenas `text: "Maria Silva Santos"`. A constraint br-core-pat-1 permite `text` OU `given/family`, entao e valido. Porem, `given` + `family` permitem buscas estruturadas.
- **Correcao:** Decompor em `given: ["Maria"]` e `family: "Silva Santos"` (ou `family: "Santos"`).

#### B2. Encounter.diagnosis.use = AD para ambos diagnosticos
- **Campo:** `Encounter.diagnosis[*].use`
- **Gravidade:** BAIXO
- **Descricao:** Ambos os diagnosticos usam `AD` (Admission diagnosis). Para atendimento ambulatorial, `CC` (Chief complaint) ou `DD` (Discharge diagnosis) pode ser mais apropriado para um deles.
- **Correcao:** Usar `CC` para o diagnostico principal e `CM` (comorbidity) para o secundario.

#### B3. Observation.issued formato ISO completo
- **Campo:** `Observation.issued`
- **Gravidade:** BAIXO
- **Valor atual:** `"2025-11-20T09:15:00-03:00"`
- **Descricao:** `issued` e do tipo `instant`, que no FHIR R4 requer precisao ate segundos com timezone. O valor atual esta correto, mas confirmar que todos os horarios incluem timezone.
- **Correcao:** Nenhuma necessaria -- ja esta correto.

#### B4. Encounter.class display em minuscula
- **Campo:** `Encounter.class.display`
- **Gravidade:** BAIXO
- **Descricao:** `display: "ambulatory"` em minuscula. Convencao FHIR usa title case: `"Ambulatory"`.
- **Correcao:** Trocar para `"Ambulatory"`.

---

## 3. CHECKLIST DE CONFORMIDADE

### Bundle
- [x] `resourceType: "Bundle"` -- OK
- [x] `type: "document"` -- OK
- [x] `timestamp` presente -- OK
- [x] `entry[0]` e Composition -- OK
- [x] Todas as urn:uuid resolvem -- OK (verificado pelo validator local)
- [ ] `identifier` -- AUSENTE (MEDIO)
- [ ] `meta.lastUpdated` -- AUSENTE (MEDIO)

### Composition (RAC)
- [x] `status: "final"` -- OK
- [x] `type` com RAC (BRTipoDocumento) -- OK
- [x] `subject` referencia Patient -- OK
- [x] `encounter` referencia Encounter -- OK
- [x] `date` presente -- OK
- [x] `author` referencia Practitioner -- OK
- [x] `custodian` referencia Organization -- OK
- [x] `title` presente -- OK
- [x] `section:diagnosticosAvaliados` (LOINC 57852-6) com entries -- OK
- [x] `section:sinaisVitais` (LOINC 8716-3) com entries -- OK
- [x] `section:alergiasIntolerancias` (LOINC 48765-2) com entries -- OK
- [x] `section:medicamentos` (LOINC 52471-0) com entries -- OK
- [x] `meta.profile` correto -- OK
- [ ] **`identifier` -- AUSENTE (CRITICO C1)**
- [ ] **`attester` -- AUSENTE (CRITICO C2)**
- [ ] **`text` (narrative) -- AUSENTE (ALTO A1)**

### Patient (BRCorePatient)
- [x] CPF com system correto -- OK
- [x] `gender` presente -- OK
- [x] Extensao raca/cor com BRRacaCor -- OK
- [x] `meta.profile` correto -- OK
- [x] `name` com `text` -- OK (satisfaz br-core-pat-1)
- [x] `birthDate` presente -- OK
- [x] CNS presente -- OK
- [ ] **`identifier[cpf].type` = TAX -- AUSENTE (CRITICO C3)**
- [ ] **`identifier[cpf].use` = official -- AUSENTE (CRITICO C3)**
- [ ] `name` com `given/family` -- AUSENTE (BAIXO B1)

### Condition (BRCoreCondition)
- [x] `subject` referencia Patient -- OK
- [x] `code` com CID-10 -- OK
- [x] `clinicalStatus` presente -- OK
- [x] `verificationStatus` presente -- OK
- [x] `category` presente -- OK
- [x] `onsetString` presente -- OK
- [x] `meta.profile` correto -- OK
- [ ] `code.coding.system` usa ICD-10 generico em vez de BRCID10 -- (MEDIO M3)

### AllergyIntolerance
- [x] `patient` referencia Patient -- OK
- [x] `clinicalStatus` presente -- OK
- [x] `verificationStatus` presente -- OK
- [x] `type` presente -- OK
- [x] `criticality` presente -- OK
- [x] `reaction.severity` presente -- OK
- [x] `reaction.manifestation` presente -- OK
- [x] `meta.profile` correto -- OK
- [ ] **`code.coding.system` aponta para ValueSet em vez de CodeSystem -- (CRITICO C4)**
- [ ] **`code.coding.code` ausente -- (CRITICO C5)**
- [ ] `reaction.manifestation.coding.code` ausente -- (ALTO A2)

### Observation (VitalSigns)
- [x] `status: "final"` -- OK
- [x] `category` = vital-signs -- OK
- [x] `code` com LOINC correto -- OK
- [x] `subject` referencia Patient -- OK
- [x] `effectiveDateTime` presente -- OK
- [x] `issued` presente -- OK
- [x] `valueQuantity` com UCUM -- OK
- [x] `meta.profile` correto -- OK
- [x] Codigos LOINC corretos (8480-6, 8462-4, 29463-7) -- OK

### Encounter (BRCoreEncounter)
- [x] `status` presente -- OK
- [x] `class` presente (AMB) -- OK
- [x] `priority` com BRCaraterAtendimento -- OK
- [x] `subject` referencia Patient -- OK
- [x] `period` com start e end -- OK
- [x] `serviceProvider` referencia Organization -- OK
- [x] `participant.type` presente -- OK
- [x] `diagnosis.condition` referencia Condition -- OK
- [x] `diagnosis.use` presente -- OK
- [x] `meta.profile` correto -- OK
- [ ] `type` (BRAtendimentoPrestado) -- AUSENTE (ALTO A3)
- [ ] `serviceType` (BRServicoEspecializado) -- AUSENTE (MEDIO M5)

### MedicationStatement
- [x] `status` presente -- OK
- [x] `medicationCodeableConcept` presente -- OK
- [x] `subject` referencia Patient -- OK
- [x] `effectivePeriod` presente -- OK
- [x] `dosage` presente -- OK
- [x] `meta.profile` correto -- OK
- [ ] `medicationCodeableConcept` sem `coding` estruturado -- (ALTO A4)

### Practitioner
- [x] CNS presente -- OK
- [x] `name` presente -- OK
- [x] `qualification` com CBO -- OK
- [x] `meta.profile` correto -- OK
- [ ] CPF ausente -- (MEDIO M6)

### Organization
- [x] CNES presente -- OK
- [x] `name` presente -- OK
- [x] `type` presente -- OK
- [x] `meta.profile` correto -- OK
- [ ] `active` ausente -- (MEDIO M4)

---

## 4. COMPARACAO COM EXEMPLO OFICIAL RNDS (secao 8.2 do guia)

| Aspecto | Exemplo RNDS | Nosso Bundle | Diferenca |
|---------|-------------|-------------|-----------|
| Bundle.type | document | document | OK |
| Composition como entry[0] | Sim | Sim | OK |
| Composition.identifier | Ausente no exemplo | Ausente | Ambos ausentes, mas perfil exige |
| Composition.attester | Ausente no exemplo | Ausente | Ambos ausentes, mas perfil exige |
| Composition.custodian | Ausente no exemplo | Presente | Nosso e MELHOR |
| Patient.identifier.type | Ausente no exemplo | Ausente | Ambos ausentes, mas perfil exige |
| Patient.extension:raca | Ausente no exemplo | Presente | Nosso e MELHOR |
| Encounter.class.system | Ausente no exemplo | Presente | Nosso e MELHOR |
| Condition.code.system | BRCID10 | icd-10 (generico) | Nosso difere |
| Secoes do RAC | Apenas diagnosticos | 4 secoes | Nosso e MAIS COMPLETO |

**Conclusao da comparacao:** Nosso Bundle e SIGNIFICATIVAMENTE mais completo que o exemplo oficial (que e explicitamente "simplificado"). Temos 13 entries vs 4, 4 secoes vs 1, e mais campos preenchidos. Os problemas sao de conformidade tecnica (types, codes), nao de completude.

---

## 5. CORRECOES SUGERIDAS (TypeScript)

### Correcao C1 + C2: Composition.identifier e attester

```typescript
// Em src/builders/composition.ts

export function buildComposition(
  uuid: string,
  refs: {
    patientRef: string;
    encounterRef: string;
    practitionerRef: string;
    organizationRef: string;
  },
  sections: RacSectionRefs,
  date: string
): Composition {
  // ... sections code stays the same ...

  return {
    resourceType: 'Composition',
    id: uuid,
    meta: {
      profile: [
        'https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-registroatendimentoclinico',
      ],
    },
    // C1: Adicionar identifier
    identifier: {
      system: `urn:oid:${refs.organizationRef.replace('urn:uuid:', '')}`,
      value: uuid,
    },
    status: 'final',
    type: {
      coding: [
        {
          system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRTipoDocumento',
          code: 'RAC',
          display: 'Registro de Atendimento Clinico',
        },
      ],
    },
    subject: { reference: refs.patientRef },
    encounter: { reference: refs.encounterRef },
    date,
    author: [{ reference: refs.practitionerRef }],
    // C2: Adicionar attester
    attester: [
      {
        mode: 'professional',
        time: date,
        party: { reference: refs.practitionerRef },
      },
    ],
    custodian: { reference: refs.organizationRef },
    title: 'Registro de Atendimento Clinico',
    // A1: Adicionar text (narrative)
    text: {
      status: 'generated',
      div: '<div xmlns="http://www.w3.org/1999/xhtml">Registro de Atendimento Clinico</div>',
    },
    section: compositionSections,
  };
}
```

### Correcao C3: Patient.identifier com type e use

```typescript
// Em src/builders/patient.ts

const identifiers: Patient['identifier'] = [
  {
    use: 'official',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: 'TAX',
        },
      ],
    },
    system: 'https://saude.gov.br/fhir/sid/cpf',
    value: ipm.cpf,
  },
];

if (ipm.cns) {
  identifiers.push({
    use: 'official',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: 'HC',
        },
      ],
    },
    system: 'https://saude.gov.br/fhir/sid/cns',
    value: ipm.cns,
  });
}
```

### Correcao C4 + C5: AllergyIntolerance.code com CodeSystem correto

```typescript
// Em src/builders/allergy.ts
// Mapear substancias para CodeSystem correto

const ALERGENO_MAP: Record<string, { system: string; code: string; display: string }> = {
  'Penicilina': {
    system: 'https://terminologia.saude.gov.br/fhir/CodeSystem/BRMedicamento',
    code: 'BR0268551',  // Verificar codigo real
    display: 'Penicilina',
  },
  // Adicionar mais mapeamentos conforme necessario
};

// No buildAllergyIntolerance:
const alergeno = ALERGENO_MAP[ipm.substancia];
const code = alergeno
  ? {
      coding: [
        {
          system: alergeno.system,
          code: alergeno.code,
          display: alergeno.display,
        },
      ],
      text: ipm.substancia,
    }
  : {
      text: ipm.substancia,  // Fallback: apenas texto se nao encontrar no mapa
    };
```

### Correcao A2: Reaction.manifestation com SNOMED code

```typescript
// Em src/builders/allergy.ts

const MANIFESTACAO_MAP: Record<string, { code: string; display: string }> = {
  'Anafilaxia': { code: '39579001', display: 'Anaphylaxis' },
  'Urticaria': { code: '126485001', display: 'Urticaria' },
  'Edema': { code: '267038008', display: 'Edema' },
  'Rash': { code: '271807003', display: 'Eruption of skin' },
};

// No buildAllergyIntolerance, substituir:
manifestation: [
  {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: MANIFESTACAO_MAP[ipm.reacao]?.code,
        display: ipm.reacao,
      },
    ],
    text: ipm.reacao,
  },
],
```

### Correcao A3: Encounter.type

```typescript
// Em src/builders/encounter.ts, adicionar ao objeto Encounter:

type: [
  {
    coding: [
      {
        system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRAtendimentoPrestado',
        code: '03',  // Consulta medica -- verificar codigo real
        display: 'Consulta medica',
      },
    ],
  },
],
```

### Correcao M3: Condition.code com BRCID10

```typescript
// Em src/builders/condition.ts, trocar system:

code: {
  coding: [
    {
      system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10',
      code: ipm.cid,
      display: ipm.descricao,
    },
  ],
  text: ipm.descricao,
},
```

---

## 6. PRIORIDADE DE CORRECOES

### Fase 1 -- Criticos (fazer AGORA)
1. **C1** -- Composition.identifier (5 min, trivial)
2. **C2** -- Composition.attester (5 min, trivial)
3. **C3** -- Patient.identifier type/use (10 min, trivial)
4. **C4+C5** -- AllergyIntolerance code system + code (30 min, requer pesquisa de codigos)

### Fase 2 -- Altos (fazer em seguida)
5. **A1** -- Composition.text narrative (15 min)
6. **A2** -- Reaction.manifestation SNOMED code (10 min)
7. **A3** -- Encounter.type (10 min, requer pesquisa de codigo)
8. **A4** -- MedicationStatement coding (30 min, requer pesquisa CATMAT)

### Fase 3 -- Medios (fazer antes de testar com RNDS)
9. **M3** -- Condition CID-10 system brasileiro (5 min)
10. **M1** -- Bundle.meta.lastUpdated (2 min)
11. **M2** -- Bundle.identifier (2 min)
12. **M4** -- Organization.active (2 min)
13. **M5** -- Encounter.serviceType (10 min)
14. **M6** -- Practitioner CPF (5 min)

### Fase 4 -- Baixos (quando houver tempo)
15. **B1** -- Patient.name given/family (5 min)
16. **B2** -- Encounter.diagnosis.use mais especifico (5 min)
17. **B4** -- Encounter.class display case (1 min)

**Tempo estimado total:** ~2.5 horas para todas as correcoes.
**Tempo estimado Fase 1 (criticos):** ~50 minutos.

---

## 7. NOTA SOBRE O HL7 FHIR VALIDATOR

O HL7 FHIR Validator CLI (`validator_cli.jar`) requer Java 17+. O sistema atual tem Java 8.
Para executar a validacao formal no futuro:

```bash
# Instalar Java 17+ (ex: AdoptOpenJDK/Temurin)
# Baixar o validator:
curl -L -o validator_cli.jar https://github.com/hapifhir/org.hl7.fhir.core/releases/latest/download/validator_cli.jar

# Executar validacao basica FHIR R4:
java -jar validator_cli.jar bundle-maria.json -version 4.0.1

# Executar com perfis BR Core:
java -jar validator_cli.jar bundle-maria.json -version 4.0.1 -ig br.gov.saude.br-core.fhir#1.0.0
```

A validacao formal com perfis BR Core e essencial antes de enviar para a RNDS em homologacao.

---

*Pesquisa R011 concluida em 2026-02-14 por Ponte.*
*Fontes: hl7.org.br/fhir/core (perfis BR Core), terminologia.saude.gov.br (ValueSets/CodeSystems), evidence/003-rnds-fhir-technical-guide.md*
