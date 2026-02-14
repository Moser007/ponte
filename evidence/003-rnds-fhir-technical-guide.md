# Guia Tecnico de Integracao RNDS - Perfis FHIR Brasileiros

## Resumo Executivo

A Rede Nacional de Dados em Saude (RNDS) e a plataforma nacional de integracao de dados em saude do Brasil, gerenciada pelo Ministerio da Saude atraves do DATASUS. Utiliza o padrao HL7 FHIR R4 para interoperabilidade. Este documento consolida informacoes tecnicas necessarias para desenvolvimento de um conector FHIR compativel com a RNDS.

---

## 1. ARQUITETURA GERAL

### 1.1 Camadas da RNDS

A RNDS opera em duas camadas:
- **EHR-Auth**: Servico de autenticacao (obter tokens de acesso)
- **EHR-Services**: Servicos de saude (envio/consulta de dados FHIR)

### 1.2 Ambientes

| Ambiente | Auth | EHR Services |
|----------|------|-------------|
| **Homologacao** | `ehr-auth-hmg.saude.gov.br` | `ehr-services.hmg.saude.gov.br` |
| **Producao** | `ehr-auth.saude.gov.br` | `{UF}-ehr-services.saude.gov.br` (ex: `sp-ehr-services.saude.gov.br`) |

Cada estado possui endpoint EHR-Services proprio. O endpoint de producao segue o padrao `{sigla-UF}-ehr-services.saude.gov.br`.

### 1.3 Endpoints de API

| Metodo | Endpoint | Finalidade |
|--------|----------|-----------|
| GET | `/api/token` | Obter token de acesso |
| POST | `/api/contexto-atendimento` | Obter token para contexto de atendimento |
| GET | `/api/fhir/r4/Patient` | Consultar dados do paciente |
| GET | `/api/fhir/r4/Organization` | Consultar estabelecimento de saude |
| GET | `/api/fhir/r4/Practitioner` | Consultar profissional de saude |
| GET | `/api/fhir/r4/PractitionerRole` | Consultar lotacao profissional |
| POST | `/api/fhir/r4/Bundle` | Enviar documentos clinicos |

### 1.4 Tipos de Documentos Suportados

| Codigo | Tipo de Documento |
|--------|------------------|
| **RAC** | Registro de Atendimento Clinico |
| **SA** | Sumario de Alta (Resumo de Saida Hospitalar) |
| **CMD** | Conjunto Minimo de Dados |
| **RIA** | Registro de Imunobiologico Administrado |
| **RDM** | Registro de Dispensacao de Medicamento |
| **REL** | Resultado de Exame(s) Laboratorial(is) |

---

## 2. AUTENTICACAO E SEGURANCA

### 2.1 Fluxo de Autenticacao

A RNDS utiliza **2-Way SSL (mTLS)** - autenticacao mutua via certificados digitais.

**Passo a passo:**

1. O conector envia requisicao GET para `/api/token` no EHR-Auth, apresentando o certificado digital (arquivo `.pfx`)
2. O servico valida: (a) validade do certificado, (b) se pertence a cadeia ICP-Brasil, (c) se nao foi revogado
3. Se valido, retorna um `access_token` com validade de **30 minutos**
4. O token e utilizado em todas as requisicoes subsequentes ao EHR-Services

**Headers obrigatorios para requisicoes ao EHR-Services:**

```
X-Authorization-Server: Bearer {access_token}
Authorization: {CNS do profissional responsavel}
```

### 2.2 Certificados Digitais

- **Tipo aceito**: e-CPF ou e-CNPJ, formato **A1** (arquivo `.pfx`)
- **Cadeia**: ICP-Brasil (obrigatorio)
- **Emissores**: Qualquer Autoridade Certificadora credenciada na ICP-Brasil (ex: Serpro, Correios)
- **Requisito critico**: O certificado usado no credenciamento DEVE ser o mesmo utilizado na autenticacao das requisicoes

### 2.3 Credenciamento de Estabelecimento

O processo ocorre em **duas fases**:

**Fase 1 - Homologacao (10 passos):**

*Responsabilidade do Gestor:*
1. Obter certificado digital ICP-Brasil (se nao possuir)
2. Criar conta gov.br (se necessario)
3. Acessar Portal de Servicos DATASUS (`https://servicos-datasus.saude.gov.br`), selecionar RNDS e clicar em "Solicitar acesso"
4. Preencher formulario com dados do estabelecimento + upload do certificado digital
5. Aguardar aprovacao do DATASUS e receber identificador do solicitante

*Responsabilidade do Integrador (TI):*
6. Estudar os servicos (entradas/saidas) disponibilizados
7. Desenvolver o software conector
8. Testar e validar no ambiente de homologacao
9. Produzir evidencias de conformidade

**Fase 2 - Producao:**
10. Gestor solicita acesso ao ambiente de producao, DATASUS analisa e libera

**Pre-requisitos do estabelecimento:**
- CNES (Cadastro Nacional de Estabelecimentos de Saude) valido
- Certificado digital ICP-Brasil (A1)
- Conta gov.br
- CNS (Cartao Nacional de Saude) do profissional responsavel

---

## 3. PERFIS FHIR BRASILEIROS (BR Core)

A seguir, detalhamento tecnico de cada perfil relevante.

### 3.1 BRCorePatient (Patient)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-patient`
**Versao:** 1.0.0 | **Base:** FHIR R4 Patient

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `identifier` | **1..*** | Identifier | Identificadores nacionais (CPF obrigatorio) |
| `identifier:cpf` | **1..1** | Identifier | CPF - system: `https://saude.gov.br/fhir/sid/cpf` |
| `gender` | **1..1** | code | Sexo administrativo |
| `extension:raca` | **1..1** | CodeableConcept | Raca/Cor (Portaria 344/2017) |

#### Slices de Identifier

| Slice | Cardinalidade | System | Tipo |
|-------|---------------|--------|------|
| `cpf` | **1..1** | `https://saude.gov.br/fhir/sid/cpf` | TAX |
| `cns` | 0..1 | `https://saude.gov.br/fhir/sid/cns` | HC |
| `registroEstrangeiro` | 0..1 | `https://saude.gov.br/fhir/sid/rne` | RNE |
| `passaporte` | 0..1 | `http://hl7.org/fhir/sid/passport-BRA` | PPN |

#### Extensoes Brasileiras

| Extensao | Cardinalidade | ValueSet | Binding |
|----------|---------------|----------|---------|
| **raca** (raca/cor) | **1..1** | BRRacaCor | required |
| sexoNascimento | 0..1 | BRSexoNascimento | required |
| identidadeGenero | 0..1 | BRIdentidadeGenero | required |
| localNascimento | 0..1 | Address | - |
| povoIndigena | 0..1 | BREtniaIndigena | extensible |
| povoTradicional | 0..1 | BRPopulacaoTradicional | required |
| povoItinerante | 0..1 | BRPovoItinerante | required |

#### Constraint Importante
- **br-core-pat-1**: `Patient.name.given`, `Patient.name.family`, `Patient.name.text` ou `Patient.name.extension` DEVEM estar presentes

#### Referencias Tipadas
- `generalPractitioner` -> BRCoreOrganization | BRCorePractitioner | BRCorePractitionerRole
- `managingOrganization` -> BRCoreOrganization

---

### 3.2 BRCoreCondition (Condition)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-condition`

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `subject` | **1..1** | Reference(BRCorePatient) | Individuo com a condicao |

#### Bindings de Terminologia

| Elemento | Strength | ValueSet | Observacao |
|----------|----------|----------|-----------|
| `category` | required | **BRCategoriaDiagnostico** | Categoria do diagnostico |
| `code` | required | **BRTerminologiaSuspeitaDiagnostica** | Inclui CID-10, CIAP-2 |
| `severity` | preferred | Condition/DiagnosisSeverity | Severidade |
| `bodySite` | example | SNOMEDCTBodyStructures | Local anatomico |

#### CodeSystems Utilizados para Codificacao
- **CID-10** (Classificacao Internacional de Doencas, 10a revisao) - sistema principal
- **CIAP-2** (Classificacao Internacional de Atencao Primaria) - atencao basica
- **SNOMED CT** - quando aplicavel

#### Constraints
- **con-1**: Stage DEVE ter summary ou assessment
- **con-2**: Evidence DEVE ter code ou detail
- **con-4**: Se abated, clinicalStatus deve ser inactive/resolved/remission
- **con-5**: clinicalStatus NAO PODE existir se verificationStatus = entered-in-error

---

### 3.3 BRCoreAllergyIntolerance (AllergyIntolerance)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-allergyintolerance`

#### Campos Obrigatorios e Must-Support

| Elemento | Cardinalidade | Must Support | Tipo | Descricao |
|----------|---------------|--------------|------|-----------|
| `patient` | **1..1** | Sim | Reference(BRCorePatient) | Paciente |
| `clinicalStatus` | 0..1 | Sim | CodeableConcept | Estado clinico |
| `type` | 0..1 | Sim | code | allergy \| intolerance |
| `code` | 0..1 | Sim | CodeableConcept | Substancia alergena |
| `asserter` | 0..1 | Sim | Reference | Fonte da informacao |
| `reaction` | 0..* | Sim | BackboneElement | Eventos de reacao adversa |
| `reaction.manifestation` | **1..*** | Sim | CodeableConcept | Manifestacao clinica |
| `reaction.severity` | 0..1 | Sim | code | mild \| moderate \| severe |

#### Bindings Brasileiros

| Elemento | Strength | ValueSet |
|----------|----------|----------|
| `code` | **required** | **BRAlergenos** (`https://terminologia.saude.gov.br/fhir/ValueSet/BRAlergenos`) |
| `clinicalStatus` | required | AllergyIntoleranceClinicalStatusCodes |
| `verificationStatus` | required | AllergyIntoleranceVerificationStatusCodes |
| `reaction.manifestation` | example | SNOMEDCTClinicalFindings |
| `reaction.severity` | required | AllergyIntoleranceSeverity |

---

### 3.4 BRCoreMedicationRequest (MedicationRequest)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-medicationrequest`

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `identifier` | **1..1** | Identifier | Identificador unico da prescricao |
| `status` | **1..1** | code | Estado da prescricao |
| `intent` | **1..1** | code | Intencao (proposal, plan, order, etc.) |
| `medication[x]:medicationReference` | **1..1** | Reference(br-core-medication) | Medicamento prescrito |
| `subject` | **1..1** | Reference(BRCorePatient) | Paciente |
| `authoredOn` | **1..1** | dateTime | Data da prescricao |
| `requester` | **1..1** | Reference(BRCorePractitioner\|...) | Prescritor |

#### Bindings Relevantes

| Elemento | Strength | ValueSet |
|----------|----------|----------|
| `reasonCode` | required | **BRCID10** (CID-10) |
| `performerType` | required | **BROcupacao** (CBO - Classificacao Brasileira de Ocupacoes) |
| `dosageInstruction.route` | required | Medicine Route of Administration |
| `dosageInstruction.site` | required | Body Site codes |
| `dosageInstruction.asNeeded[x]` | required | BRCID10 |
| `dispenseRequest.validityPeriod` | **1..1** | Period (start/end) |

---

### 3.5 BRCoreMedicationStatement (MedicationStatement)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-medicationstatement`

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `status` | **1..1** | code | active, completed, entered-in-error, etc. |
| `medication[x]` | **1..1** | CodeableConcept ou Reference(br-core-medication) | Medicamento |
| `subject` | **1..1** | Reference(BRCorePatient) | Paciente |

#### Bindings
- `dosage.route` -> Medicine Route of Administration - IPS (required)
- `medication[x]` -> SNOMED CT Medication Codes (example)

---

### 3.6 BRCoreEncounter (Encounter / Contato Assistencial)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-encounter`

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `status` | **1..1** | code | planned, arrived, triaged, in-progress, finished, cancelled |
| `class` | **1..1** | Coding | Classificacao (inpatient, outpatient, ambulatory, emergency) |
| `priority` | **1..1** | CodeableConcept | Carater do atendimento (Eletivo/Urgencia) |
| `subject` | **1..1** | Reference(BRCorePatient) | Paciente atendido |
| `period` | **1..1** | Period | Inicio e fim do atendimento |
| `serviceProvider` | **1..1** | Reference(BRCoreOrganization) | Organizacao responsavel |
| `participant.type` | **1..*** | CodeableConcept | Tipo de participacao |
| `diagnosis.condition` | **1..1** | Reference(BRCoreCondition\|BRCoreProcedure) | Condicao diagnosticada |
| `diagnosis.use` | **1..1** | CodeableConcept | Papel do diagnostico |
| `hospitalization.admitSource` | **1..1** | CodeableConcept | Origem da admissao |
| `hospitalization.dischargeDisposition` | **1..1** | CodeableConcept | Motivo do encerramento |

#### Bindings Brasileiros

| Elemento | Strength | ValueSet |
|----------|----------|----------|
| `type` | required | **BRAtendimentoPrestado** |
| `serviceType` | required | **BRServicoEspecializado** |
| `reasonCode` | required | **BRReasonEncounter** |
| `hospitalization.dischargeDisposition` | required | **motivo-encerramento** |
| `location.physicalType` | required | LocationType |

---

### 3.7 BRCoreObservation (Observation)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-observation`

#### Campos Obrigatorios

| Elemento | Cardinalidade | Must Support | Tipo |
|----------|---------------|--------------|------|
| `status` | **1..1** | Sim | code |
| `category` | **1..1** | Sim | CodeableConcept |
| `code` | **1..1** | Sim | CodeableConcept (LOINC) |

#### Campos Must-Support Opcionais

| Elemento | Cardinalidade | Tipo |
|----------|---------------|------|
| `subject` | 0..1 | Reference(BRCorePatient) |
| `effective[x]` | 0..1 | dateTime \| Period \| Timing \| instant |
| `issued` | 0..1 | instant |
| `performer` | 0..* | Reference(BRCorePractitioner\|...) |

---

### 3.8 BRCoreVitalSigns (Vital Signs)

**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-vitalsigns`
**Base:** Observation (com restricoes adicionais de sinais vitais)

#### Campos Obrigatorios

| Elemento | Cardinalidade | Tipo | Descricao |
|----------|---------------|------|-----------|
| `status` | **1..1** | code | ObservationStatus |
| `category` | **1..*** | CodeableConcept | Inclui slice VSCat = "vital-signs" |
| `code` | **1..1** | CodeableConcept | Binding: **BRSinaisVitais** (required) |
| `subject` | **1..1** | Reference(BRCorePatient) | Paciente |
| `effective[x]` | **1..1** | dateTime \| Period | Momento da medicao |
| `issued` | **1..1** | instant | Data de disponibilizacao |
| `value[x]` | **1..1** | Quantity \| CodeableConcept \| ... | Resultado da medicao |

#### Codigos LOINC para Sinais Vitais (ValueSet BRSinaisVitais)

| Codigo LOINC | Sinal Vital | Unidades UCUM |
|-------------|-------------|---------------|
| 8302-2 | Altura | cm, [in_i] |
| 29463-7 | Peso Corporal | g, kg, [lb_av] |
| 8480-6 | Pressao Arterial Sistolica | mm[Hg] |
| 8462-4 | Pressao Arterial Diastolica | mm[Hg] |
| 9279-1 | Frequencia Respiratoria | /min |
| 8867-4 | Frequencia Cardiaca | /min |
| 8310-5 | Temperatura Corporal | Cel, [degF] |
| 2708-6 | Saturacao de Oxigenio | % |
| 39156-5 | IMC | kg/m2 |
| 9843-4 | Perimetro Cefalico | cm, [in_i] |
| 8280-0 | Circunferencia Abdominal | cm, [in_i] |

#### Constraints Especificos
- **vs-1**: Valores dateTime devem ter precisao minima de dia
- **vs-2**: Deve ter value[x] OU dataAbsentReason OU component/hasMember
- **vs-3**: Cada component requer value[x] OU dataAbsentReason

---

## 4. ESTRUTURA DO RAC (Registro de Atendimento Clinico)

**Perfil:** `br-core-registroatendimentoclinico` (baseado em Composition)
**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-registroatendimentoclinico`

O RAC e o registro dos dados essenciais de uma consulta realizada a um individuo no ambito da atencao basica, especializada ou domiciliar.

### 4.1 Estrutura do Bundle RAC

O RAC e enviado como um **Bundle do tipo `document`** contendo:

1. **Composition** (primeiro recurso do Bundle) - define a estrutura do documento
2. **Recursos referenciados** nas sections da Composition

### 4.2 Elementos Raiz do Composition

| Elemento | Obrigatorio | Descricao |
|----------|-------------|-----------|
| `identifier` | Sim | Identificador do documento |
| `status` | Sim | Estado do documento |
| `type` | Sim | Tipo do documento (RAC) |
| `subject` | Sim | Referencia ao paciente (BRCorePatient) |
| `encounter` | Sim | Referencia ao contato assistencial |
| `date` | Sim | Data do documento |
| `author` | Sim | Autor(es) do documento |
| `attester` | Sim | Atestante (party, time, mode) |
| `custodian` | Sim | Custodiante do documento |

### 4.3 Secoes do RAC

| # | Secao (Slice) | Card. | Codigo LOINC | Entry References |
|---|--------------|-------|-------------|-----------------|
| 1 | **diagnosticosAvaliados** | **1..*** | 57852-6 (Problem List) | BRCoreCondition |
| 2 | **procedimentosRealizados** | 0..1 | 47519-4 (History of Procedures) | BRCoreProcedure |
| 3 | **sinaisVitais** | 0..1 | 8716-3 (Vital Signs) | BRCoreVitalSigns |
| 4 | **historiaObstetrica** | 0..1 | 89213-3 (Obstetrics History) | BRCoreObservationPregnancyStatus, BRCoreObservationPregnancyOutcome |
| 5 | **aleitamentoMaterno** | 0..1 | 63895-7 (Breastfeeding Status) | BRCoreObservationBreastfeedingStatus |
| 6 | **historiaSocial** | 0..1 | 29762-2 (Social History) | BRCoreObservationAlcoholUse, BRCoreObservationTobaccoUse |
| 7 | **alergiasIntolerancias** | 0..1 | 48765-2 (Allergies and Adverse Reactions) | br-core-allergyintolerance |
| 8 | **medicamentos** | 0..1 | 52471-0 (Medications) | MedicationStatement, MedicationRequest, MedicationAdministration, MedicationDispense, DocumentReference |

**Observacao**: A secao `diagnosticosAvaliados` e a unica obrigatoria (1..*).

---

## 5. ESTRUTURA DO SA / RSA (Sumario de Alta / Resumo de Saida Hospitalar)

**Perfil:** `br-core-sumarioalta` (baseado em Composition)
**URL Canonica:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-sumarioalta`
**Base Legal:** Portaria No 701/2022

O SA documenta o resumo clinico da internacao hospitalar: intervencoes realizadas, instrucoes de cuidados pos-alta e estado de saude do individuo ao final da internacao.

### 5.1 Secoes do Sumario de Alta

Todas as 7 secoes sao **obrigatorias** (cardinalidade do conjunto: 7..7):

| # | Secao (Slice) | Card. | Codigo LOINC | Entry References |
|---|--------------|-------|-------------|-----------------|
| 1 | **diagnosticosAdmissao** | **1..1** | 42347-5 (Admission Diagnosis) | BRCoreCondition |
| 2 | **alergiasIntolerancias** | **1..1** | 48765-2 (Allergies/Adverse Reactions) | br-core-allergyintolerance |
| 3 | **diagnosticosAvaliados** | **1..1** | 11450-4 (Problem List) | BRCoreCondition |
| 4 | **procedimentosRealizados** | **1..1** | 47519-4 (History of Procedures) | BRCoreProcedure |
| 5 | **prescricaoAlta** | **1..1** | 8654-6 (Hospital Discharge Medications) | br-core-medicationrequest |
| 6 | **planoCuidados** | **1..1** | 18776-5 (Plan of Care Note) | BRCoreCarePlan |
| 7 | **capacidadeFuncional** | **1..1** | 54522-8 (Functional Status) | BRCoreCapacidadeFuncional |

### 5.2 Elementos Raiz do SA

| Elemento | Valor | Observacao |
|----------|-------|-----------|
| `category` | LOINC 18842-5 | "Sumario de Alta" |
| `title` | "Sumario Internacional do Paciente" | Fixo |
| `status` | 1..1 | CompositionStatus |
| `date` | 1..1 | Data de criacao |
| `author` | 1..* | Profissional responsavel |

---

## 6. SISTEMAS DE CODIFICACAO (CodeSystems)

### 6.1 CodeSystems Brasileiros Principais

| CodeSystem | Descricao | Uso |
|-----------|-----------|-----|
| **CID-10** | Classificacao Internacional de Doencas | Diagnosticos, motivos de atendimento |
| **CIAP-2** | Classificacao Internacional de Atencao Primaria | Atencao basica |
| **CBO** | Classificacao Brasileira de Ocupacoes | Ocupacao do profissional |
| **CBHPM/TUSS** | Classificacao Brasileira Hierarquizada de Procedimentos Medicos | Procedimentos (saude suplementar) |
| **Tabela SUS** | Tabela de Procedimentos, Medicamentos e OPM do SUS | Procedimentos (SUS) |
| **LOINC** | Logical Observation Identifiers Names and Codes | Exames laboratoriais, secoes de documentos |
| **BRDivisaoGeograficaBrasil** | Divisao geografica do IBGE | Municipios, UFs |

### 6.2 Identificadores Nacionais (NamingSystems)

| NamingSystem | System URI | Descricao |
|-------------|-----------|-----------|
| **CPF** | `https://saude.gov.br/fhir/sid/cpf` | Cadastro de Pessoa Fisica |
| **CNS** | `https://saude.gov.br/fhir/sid/cns` | Cartao Nacional de Saude |
| **CNES** | Sistema proprio | Cadastro Nacional de Estabelecimentos de Saude |
| **RNE** | `https://saude.gov.br/fhir/sid/rne` | Registro Nacional de Estrangeiros |
| **Passaporte** | `http://hl7.org/fhir/sid/passport-BRA` | Passaporte brasileiro |

### 6.3 ValueSets Brasileiros Relevantes

| ValueSet | Descricao | Binding Strength |
|----------|-----------|-----------------|
| BRRacaCor | Raca/Cor do IBGE | required |
| BRSexoNascimento | Sexo ao nascimento | required |
| BRIdentidadeGenero | Identidade de genero | required |
| BREtniaIndigena | Etnia indigena | extensible |
| BRAlergenos | Substancias alergenas | required |
| BRSinaisVitais | Sinais vitais (LOINC) | required |
| BRTipoDocumentoIndividuo | Tipos de documentos do individuo | required |
| BRCategoriaDiagnostico | Categoria de diagnostico | required |
| BRTerminologiaSuspeitaDiagnostica | CID-10/CIAP-2 para diagnosticos | required |
| BRAtendimentoPrestado | Tipos de atendimento | required |
| BRServicoEspecializado | Servicos especializados | required |
| BROcupacao | Ocupacoes (CBO) | required |
| BRCID10 | CID-10 | required |
| BRCaraterAtendimento | Carater do atendimento (Eletivo=01, Urgencia=02) | required |
| BRPopulacaoTradicional | Populacoes tradicionais | required |
| BRPovoItinerante | Povos itinerantes | required |

---

## 7. EXTENSOES BRASILEIRAS

### 7.1 Extensoes de Paciente

| Extensao | URL | Tipo | Descricao |
|----------|-----|------|-----------|
| Raca/Cor e Etnia | BRRacaCorEtnia-1.0 | CodeableConcept | Raca/cor conforme IBGE |
| Sexo ao Nascimento | - | CodeableConcept | Sexo biologico |
| Identidade de Genero | - | CodeableConcept | Genero auto-declarado |
| Local de Nascimento | - | Address | Endereco de nascimento |
| Povo Indigena | - | CodeableConcept | Etnia indigena |
| Populacao Tradicional | - | CodeableConcept | Quilombolas, ribeirinhos, etc. |
| Povo Itinerante | - | CodeableConcept | Ciganos, circenses, etc. |
| Qualidade do Cadastro | BRQualidadeCadastroIndividuo-1.0 | decimal | Nota de 0-100 |
| Individuo Protegido | BRIndividuoProtegido-1.0 | boolean | Individuo sob protecao |

### 7.2 Extensoes de Estabelecimento/Profissional

| Extensao | Descricao |
|----------|-----------|
| BRAtendeSUS-1.0 | Indica se o estabelecimento atende SUS |
| BRAdministradorTerceiro-1.0 | Identificacao do administrador terceiro |
| BRJurisdicaoOrgaoEmissor-1.0 | Jurisdicao do orgao emissor de documentos |
| BRMunicipio-1.0 | Municipio (codigo IBGE) |
| BRNacionalidade | Nacionalidade |
| BRNaturalizacao-1.0 | Dados de naturalizacao |
| BRPais-1.0 | Pais |
| BRParentesIndividuo-1.0 | Parentes do individuo |

### 7.3 Extensoes Clinicas

| Extensao | Descricao |
|----------|-----------|
| Condicao Maternal | Status maternal para vacinacao |
| Responsavel pelo Atendimento | Indica se o profissional foi responsavel |
| Roupas Usadas na Medicao | Vestimenta durante medicao corporal |
| Turno | Turno do atendimento |
| Quantidade | Quantidades em registros |
| Valor Monetario de Medicamento | Valor para dispensacao pelo MS |

---

## 8. FLUXO DE INTEGRACAO - GUIA PRATICO

### 8.1 Envio de Documento (POST Bundle)

```
POST https://{UF}-ehr-services.saude.gov.br/api/fhir/r4/Bundle
Content-Type: application/fhir+json
X-Authorization-Server: Bearer {access_token}
Authorization: {CNS_profissional}
```

**Corpo da requisicao**: Bundle FHIR do tipo `document`

**Resposta de sucesso**: HTTP 201 Created
- Header `Location` contem o identificador atribuido pela RNDS ao Bundle

### 8.2 Exemplo Simplificado de Bundle RAC

```json
{
  "resourceType": "Bundle",
  "type": "document",
  "timestamp": "2024-01-15T10:30:00-03:00",
  "entry": [
    {
      "fullUrl": "urn:uuid:composition-1",
      "resource": {
        "resourceType": "Composition",
        "status": "final",
        "type": {
          "coding": [{
            "system": "http://www.saude.gov.br/fhir/r4/CodeSystem/BRTipoDocumento",
            "code": "RAC"
          }]
        },
        "subject": { "reference": "urn:uuid:patient-1" },
        "encounter": { "reference": "urn:uuid:encounter-1" },
        "date": "2024-01-15",
        "author": [{ "reference": "urn:uuid:practitioner-1" }],
        "section": [
          {
            "title": "Diagnosticos Avaliados",
            "code": {
              "coding": [{
                "system": "https://loinc.org",
                "code": "57852-6"
              }]
            },
            "entry": [{ "reference": "urn:uuid:condition-1" }]
          }
        ]
      }
    },
    {
      "fullUrl": "urn:uuid:patient-1",
      "resource": {
        "resourceType": "Patient",
        "identifier": [{
          "system": "https://saude.gov.br/fhir/sid/cpf",
          "value": "12345678901"
        }],
        "gender": "male"
      }
    },
    {
      "fullUrl": "urn:uuid:encounter-1",
      "resource": {
        "resourceType": "Encounter",
        "status": "finished",
        "class": { "code": "AMB" },
        "subject": { "reference": "urn:uuid:patient-1" },
        "period": {
          "start": "2024-01-15T09:00:00-03:00",
          "end": "2024-01-15T10:30:00-03:00"
        }
      }
    },
    {
      "fullUrl": "urn:uuid:condition-1",
      "resource": {
        "resourceType": "Condition",
        "code": {
          "coding": [{
            "system": "http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10",
            "code": "J06.9",
            "display": "Infeccao aguda das vias aereas superiores"
          }]
        },
        "subject": { "reference": "urn:uuid:patient-1" }
      }
    }
  ]
}
```

**NOTA**: Este e um exemplo simplificado para ilustrar a estrutura. Em producao, todos os campos obrigatorios dos perfis devem ser preenchidos.

### 8.3 Consulta de Paciente

```
GET https://{UF}-ehr-services.saude.gov.br/api/fhir/r4/Patient?identifier=https://saude.gov.br/fhir/sid/cpf|12345678901
X-Authorization-Server: Bearer {access_token}
Authorization: {CNS_profissional}
```

### 8.4 Consulta de Estabelecimento

```
GET https://{UF}-ehr-services.saude.gov.br/api/fhir/r4/Organization/{CNPJ}
X-Authorization-Server: Bearer {access_token}
Authorization: {CNS_profissional}
```

---

## 9. PERFIS RNDS (PUBLICADOS NO SIMPLIFIER)

Alem dos perfis BR Core (hl7.org.br), a RNDS publica perfis especificos no Simplifier:

### 9.1 Perfis Clinicos RNDS

| Perfil | Recurso FHIR | Status | Descricao |
|--------|-------------|--------|-----------|
| Contato Assistencial | Encounter | Active | Resumo do atendimento |
| Contato Assistencial ANS | Encounter | Active | Versao para saude suplementar |
| Problema/Diagnostico | Condition | Draft | Problema/diagnostico atribuido |
| Procedimento Realizado | Procedure | Active | Procedimento executado |
| Procedimento Realizado ANS | Procedure | Draft | Versao saude suplementar |

### 9.2 Perfis de Documentos RNDS

| Perfil | Recurso FHIR | Status | Descricao |
|--------|-------------|--------|-----------|
| Conjunto Minimo de Dados - CMD | Composition | Draft | Dataset minimo obrigatorio |
| Conjunto Minimo de Dados ANS | Composition | Active | CMD para saude suplementar |
| Regulacao Assistencial | Composition | Active | Dados de regulacao |

### 9.3 Perfis de Imunizacao RNDS

| Perfil | Recurso FHIR | Status | Descricao |
|--------|-------------|--------|-----------|
| Imunobiologico Administrado em Rotina | Immunization | Active | Vacinacao de rotina |
| Imunobiologico Administrado de Carga | Immunization | Active | Carga via SISAB |

### 9.4 Perfis de Suprimentos RNDS

| Perfil | Recurso FHIR | Status | Descricao |
|--------|-------------|--------|-----------|
| Orteses, Proteses e Materiais | Device | Active | Dispositivos medicos |
| Entrega de Suprimentos | SupplyDelivery | Active | Registro de entrega |

### 9.5 Perfis Estruturais RNDS (rnds-fhir.saude.gov.br)

| Perfil | Recurso FHIR | Descricao |
|--------|-------------|-----------|
| BRIndividuo-1.0 | Patient | Individuo/Paciente |
| BRProfissional-1.0 | Practitioner | Profissional de saude |
| BRLotacaoProfissional-1.0 | PractitionerRole | Lotacao profissional |
| BREstabelecimentoSaude-1.0 | Organization | Estabelecimento de saude |
| BRPessoaJuridicaProfissionalLiberal-1.0 | Organization | PJ ou profissional liberal |
| BRCondicaoSaude | Condition | Condicao de saude |
| BRAmostraBiologica-1.0 | Specimen | Amostra biologica |
| BRDiagnosticoLaboratorioClinico-3.2.1 | Observation | Diagnostico laboratorial |
| BRResultadoExameLaboratorial-3.2.1 | Bundle | Resultado de exame |

---

## 10. RESUMO DE URLs E REFERENCIAS

### 10.1 Repositorios Oficiais

| Recurso | URL |
|---------|-----|
| Simplifier RNDS | https://simplifier.net/redenacionaldedadosemsaude |
| BR Core IG (HL7 Brasil) | https://hl7.org.br/fhir/core/ |
| RNDS FHIR IG Oficial | https://rnds-fhir.saude.gov.br/ |
| RNDS IG (kyriosdata) | https://kyriosdata.github.io/rnds-ig/ |
| Guia de Integracao | https://rnds-guia.saude.gov.br/ |
| Portal de Servicos DATASUS | https://servicos-datasus.saude.gov.br/ |
| Catalogo de APIs Gov | https://www.gov.br/conecta/catalogo/apis/rnds-rede-nacional-de-dados-em-saude |

### 10.2 Contatos Tecnicos

| Area | Contato |
|------|---------|
| Negocios | cgisd.datasus@saude.gov.br / (61) 3315-3509 |
| Tecnico | coinp@saude.gov.br / (61) 3315-2484 |

### 10.3 Pacote FHIR

| Informacao | Valor |
|-----------|-------|
| Pacote BR Core | `br.gov.saude.br-core.fhir#1.0.0` |
| Versao FHIR | R4 (4.0.1) |
| Status | STU1 (Standard for Trial Use) |

---

## 11. CHECKLIST PARA INICIO DO DESENVOLVIMENTO

- [ ] Obter certificado digital ICP-Brasil (e-CPF ou e-CNPJ tipo A1)
- [ ] Solicitar credenciamento no Portal de Servicos DATASUS
- [ ] Configurar ambiente com suporte a mTLS (2-Way SSL)
- [ ] Implementar fluxo de obtencao de token (GET /api/token)
- [ ] Implementar headers obrigatorios (X-Authorization-Server + Authorization)
- [ ] Mapear dados internos para os perfis BR Core / RNDS
- [ ] Implementar validacao FHIR local antes de envio
- [ ] Testar no ambiente de homologacao
- [ ] Implementar tratamento de erros FHIR (OperationOutcome)
- [ ] Documentar evidencias para aprovacao em producao
- [ ] Solicitar acesso ao ambiente de producao

---

*Documento gerado em 2026-02-13 com base em informacoes publicas da RNDS, BR Core IG, Simplifier.net e Guia de Integracao RNDS.*
*Fontes: simplifier.net/redenacionaldedadosemsaude, hl7.org.br/fhir/core, rnds-fhir.saude.gov.br, rnds-guia.saude.gov.br*
