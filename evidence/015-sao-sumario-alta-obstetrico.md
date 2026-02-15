# R016 — SAO: Sumário de Alta Obstétrico (Portaria GM/MS 8.025/2025)

> Pesquisa autônoma realizada em 2026-02-14
> Pesquisador: Ponte (Claude)
> Status: CONCLUÍDA

---

## 1. Resumo Executivo

A Portaria GM/MS n. 8.025, de 27 de agosto de 2025, instituiu o **Modelo de Informação do Sumário de Alta Obstétrico (SAO)** no âmbito da RNDS. O SAO é uma **especialização do Sumário de Alta (SA)** que adiciona informações obstétricas obrigatórias para continuidade do cuidado em qualquer hipótese de alta de gestante ou puérpera.

**Descoberta principal:** O SAO ainda NÃO tem modelo computacional (FHIR) publicado oficialmente. A Portaria 8.025 define o modelo INFORMACIONAL (quais dados), mas o DEINFO/DATASUS é responsável por criar a representação FHIR — que ainda está em desenvolvimento. No entanto, os perfis BR Core já contêm todos os building blocks necessários para montar um SAO Bundle.

**Implicação para o Ponte:** Podemos antecipar a implementação do SAO usando os perfis BR Core existentes (br-core-sumarioalta como base + seções obstétricas adicionais) e ajustar quando o modelo computacional oficial for publicado.

---

## 2. Base Legal

### Portaria GM/MS n. 8.025, de 27 de agosto de 2025
- **Publicação:** DOU, 28/08/2025
- **Assunto:** Institui o Modelo de Informação do Sumário de Alta Obstétrico (SAO) na RNDS
- **Revoga:** Nada diretamente (é modelo novo)
- **Relação:** Complementa a Portaria GM/MS n. 8.026/2025 que atualizou o SA genérico (revogando a Portaria SAES/MS 701/2022)

### Portaria GM/MS n. 8.026, de 27 de agosto de 2025
- **Assunto:** Institui o novo Modelo de Informação do Sumário de Alta (SA) na RNDS
- **Revoga:** Portaria SAES/MS 701/2022 (SA original)
- **Incorpora:** Conjunto Mínimo de Dados (CMD) da Atenção à Saúde

Ambas publicadas no mesmo dia, o que indica estratégia deliberada de padronização conjunta.

---

## 3. O que é o SAO

### Definição
O SAO constitui **especialização do sumário de alta de internação** que estabelece informações adicionais para a continuidade do cuidado em qualquer hipótese de alta da gestante ou puérpera, devendo ser registrado em internações cujo motivo seja relacionado a:
- Gestação
- Parto
- Aborto
- Puerpério

### Quem gera
O SAO é gerado pelo **hospital/maternidade** no momento da alta. NÃO é gerado pela APS (atenção primária). É responsabilidade do estabelecimento de saúde que realizou a internação obstétrica.

### Quando é gerado
Em TODA alta hospitalar de gestante ou puérpera, independentemente do desfecho (alta normal, transferência, óbito).

---

## 4. Estrutura do SAO — 4 Blocos Obrigatórios

O SAO é organizado em **4 blocos** distintos, além dos dados base do SA:

### Bloco 1: Resumo da Internação Materna
Dados sobre a gestante/puérpera durante a internação:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| Gestações anteriores | Número de gestações prévias (G) | Sim |
| Partos anteriores | Número de partos prévios (P) | Sim |
| Abortos/perdas fetais anteriores | Número de abortos prévios (A) | Sim |
| Tipo de gravidez | Única, gemelar, trigemelar, etc. | Sim |
| Idade gestacional | Em semanas | Sim |
| Risco gestacional | Habitual, alto risco | Sim |
| Classificação da alta | 8 cenários possíveis (ver abaixo) | Sim |

### Bloco 2: Complicações Obstétricas
Documentação de complicações durante gestação, parto ou puerpério:
- Complicações identificadas
- Intervenções realizadas
- Evolução clínica

### Bloco 3: Informações do Parto (quando aplicável)
Quando houve parto durante a internação:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| Início do trabalho de parto | Data/hora | Sim (se parto) |
| Rotura de membranas | Data/hora | Sim (se parto) |
| Intervenções farmacológicas | Medicações administradas | Sim (se parto) |
| Via de parto | Vaginal ou cesariana | Sim (se parto) |
| Condições da cesariana | Eletiva, urgência, emergência | Sim (se cesárea) |

### Bloco 4: Dados Neonatais (quando nascido vivo)
Quando houve nascido vivo decorrente do parto:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| Identificação do RN | CPF ou CNS | Sim |
| Sexo ao nascer | M/F/Indeterminado | Sim |
| Data/hora do nascimento | DateTime | Sim |
| Ressuscitação neonatal | Intervenções realizadas | Sim (se realizada) |

### 8 Cenários de Alta Obstétrica

A Portaria 8.025 define 8 hipóteses de classificação da alta:

1. Alta hospitalar da mulher **sem ocorrência de parto**
2. Alta hospitalar da mãe (puérpera) **e do recém-nascido**
3. Alta hospitalar da mãe (puérpera) **e permanência do recém-nascido**
4. Alta hospitalar da mãe (puérpera) **e óbito do recém-nascido**
5. Alta hospitalar da mãe (puérpera) **com óbito fetal**
6. Óbito da mulher **sem ocorrência de parto**
7. Óbito da mulher (puérpera) **e alta do recém-nascido**
8. Óbito da mulher (puérpera) **e permanência do recém-nascido**

---

## 5. SA vs SAO — Diferenças

### Dados que o SA genérico já contém (Portaria 8.026/2025)

O SA (base) contém 11 seções:

| # | Seção | Descrição |
|---|-------|-----------|
| 1 | Identificação do Indivíduo | CPF/CNS ou dados demográficos |
| 2 | Caracterização do Atendimento | Estabelecimento, origem, modalidade, admissão |
| 3 | Diagnósticos | Principal/secundários com CID-10 |
| 4 | Restrições Funcionais | Incapacidades documentadas |
| 5 | Procedimentos | Intervenções realizadas ou solicitadas |
| 6 | Evolução Clínica | Narrativa da progressão clínica |
| 7 | Alergias/Reações Adversas | Agente, manifestação, criticidade |
| 8 | Prescrições de Alta | Medicações com dosagem |
| 9 | Plano de Cuidados | Instruções pós-alta |
| 10 | Informações de Alta | Data, desfecho, encaminhamentos |
| 11 | Informações Complementares | Detalhes adicionais |

### Dados ADICIONAIS que o SAO acrescenta

O SAO herda TUDO do SA e adiciona os 4 blocos obstétricos:

| Bloco SAO | O que adiciona | Inexistente no SA |
|-----------|---------------|-------------------|
| Internação Materna | Histórico obstétrico (G/P/A), tipo gravidez, IG, risco | Sim |
| Complicações Obstétricas | Complicações específicas de gestação/parto | Sim |
| Parto | Via de parto, trabalho de parto, intervenções | Sim |
| Neonatal | Dados do RN (sexo, CPF, ressuscitação) | Sim |

**Conclusão:** O SAO = SA + 4 seções obstétricas. É uma extensão, não um documento separado.

---

## 6. Perfis FHIR (BR Core) Relevantes

### Perfil Base: br-core-sumarioalta
- **URL:** `https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-sumarioalta`
- **Base:** br-core-composition (que herda de FHIR Composition)
- **Versão:** 1.0.0 (STU1)
- **Status:** Active (2025-02-27)
- **Tipo de documento:** Fixed code "SA" no Composition.type
- **Categoria:** LOINC 18842-5 (Discharge Summary)

### 7 Seções do SA no BR Core (todas obrigatórias, 7..7)

| # | Slice Name | LOINC Code | Display | Entry Profile |
|---|-----------|-----------|---------|---------------|
| 1 | diagnosticosAdmissao | 42347-5 | Admission Diagnosis | BRCoreCondition |
| 2 | alergiasIntolerancias | 48765-2 | Allergies and adverse reactions | br-core-allergyintolerance |
| 3 | diagnosticosAvaliados | 57852-6 | Problem List | BRCoreCondition |
| 4 | procedimentosRealizados | 47519-4 | History of Procedures | BRCoreProcedure |
| 5 | prescricaoAlta | 8654-6 | Hospital discharge medications | br-core-medicationrequest |
| 6 | planoCuidados | 18776-5 | Plan of care note | BRCoreCarePlan |
| 7 | capacidadeFuncional | 54522-8 | Functional status | BRCoreCapacidadeFuncional |

### Perfis Obstétricos do BR Core

O BR Core define 4 perfis obstétricos (Observation):

| Perfil | Recurso | Uso |
|--------|---------|-----|
| BRCoreObservationPregnancyStatus | Observation | Status da gestação (grávida/não grávida) |
| BRCoreObservationPregnancyEDD | Observation | Data provável do parto (DPP) |
| BRCoreObservationPregnancyOutcome | Observation | Desfecho da gestação |
| BRCoreObservationBreastfeedingStatus | Observation | Status de aleitamento materno |

### Seção RAC relevante para comparação

O perfil br-core-registroatendimentoclinico (RAC) já tem uma seção obstétrica:

| Seção RAC | LOINC Code | Display | Entry Profile |
|-----------|-----------|---------|---------------|
| historiaObstetrica | 89213-3 | Obstetrics History | BRCoreObservationPregnancyStatus / PregnancyOutcome |

Esta seção LOINC 89213-3 (Obstetrics History) pode ser reutilizada no SAO para o Bloco 1 (Resumo da Internação Materna).

### Outros Perfis BR Core que o SAO usará

| Perfil | Recurso FHIR | Uso no SAO |
|--------|-------------|-----------|
| BRCoreCondition | Condition | Diagnósticos obstétricos (O24.4, O13, etc.) |
| BRCoreProcedure | Procedure | Procedimentos de parto (cesariana, episiotomia, etc.) |
| br-core-allergyintolerance | AllergyIntolerance | Alergias (penicilina, etc.) |
| br-core-medicationrequest | MedicationRequest | Prescrições de alta |
| BRCoreCarePlan | CarePlan | Plano de cuidados pós-alta |
| BRCorePatient | Patient | Mãe e recém-nascido |
| BRCorePractitioner | Practitioner | Profissional responsável |
| BRCoreOrganization | Organization | Hospital/maternidade |
| br-core-encounter | Encounter | Internação obstétrica |
| BRCoreVitalSigns | Observation | Sinais vitais maternos e neonatais |

---

## 7. Modelo Computacional (FHIR) — Status

### Status atual: NÃO PUBLICADO

A Portaria 8.025 define o modelo INFORMACIONAL (quais dados coletar). O Art. 3 delega ao DEINFO/DATASUS a criação do **modelo computacional** (representação FHIR) e sua implementação técnica na RNDS.

Até a data desta pesquisa (2026-02-14):
- O rnds-fhir.saude.gov.br NÃO lista SAO como tipo de documento no CodeSystem BRTipoDocumento
- O rnds-guia.saude.gov.br NÃO tem seção dedicada ao SAO
- O DATASUS/MAD NÃO lista SAO nos modelos desenvolvidos
- O BR Core NÃO tem perfil br-core-sumarioaltaobstetrico

**Conclusão:** O modelo computacional FHIR para o SAO está em desenvolvimento pelo DEINFO/DATASUS. Não há StructureDefinition, exemplos de Bundle, ou guia de integração disponíveis publicamente.

### O que sabemos sobre como será

Baseado no padrão estabelecido pelo SA (br-core-sumarioalta):

1. **Bundle.type = "document"**
2. **Composition como entry[0]** com type "SAO" (novo código no BRTipoDocumento)
3. **Composition herda de br-core-sumarioalta** (7 seções do SA) + seções obstétricas adicionais
4. **Seções obstétricas** provavelmente usando LOINC codes existentes:
   - 89213-3 (Obstetrics History) para histórico obstétrico
   - 57074-7 (Fetus summary) ou similar para dados neonatais
   - 72135-7 (Labor and delivery summary) para dados do parto
5. **Entries** usando os perfis BR Core obstétricos já existentes

---

## 8. Proposta de Mapeamento FHIR para o SAO

Baseado na Portaria 8.025 e nos perfis BR Core disponíveis, proponho o seguinte mapeamento:

### Bundle SAO (proposta)

```
Bundle (type: document)
├── Composition (type: SAO)
│   ├── section[diagnosticosAdmissao] (LOINC 42347-5) — herdado do SA
│   │   └── entry: Condition (diagnósticos de admissão obstétrica)
│   ├── section[alergiasIntolerancias] (LOINC 48765-2) — herdado do SA
│   │   └── entry: AllergyIntolerance
│   ├── section[diagnosticosAvaliados] (LOINC 57852-6) — herdado do SA
│   │   └── entry: Condition (CID-10: O24.4, O13, O14, etc.)
│   ├── section[procedimentosRealizados] (LOINC 47519-4) — herdado do SA
│   │   └── entry: Procedure (parto vaginal, cesariana, episiotomia)
│   ├── section[prescricaoAlta] (LOINC 8654-6) — herdado do SA
│   │   └── entry: MedicationRequest (prescrições pós-alta)
│   ├── section[planoCuidados] (LOINC 18776-5) — herdado do SA
│   │   └── entry: CarePlan (consulta puerperal, amamentação)
│   ├── section[capacidadeFuncional] (LOINC 54522-8) — herdado do SA
│   │   └── entry: (capacidade funcional pós-parto)
│   ├── section[historicoObstetrico] (LOINC 89213-3) — NOVO: Bloco 1
│   │   └── entry: Observation (G/P/A, tipo gravidez, IG, risco)
│   ├── section[complicacoesObstetricas] (LOINC TBD) — NOVO: Bloco 2
│   │   └── entry: Condition (complicações)
│   ├── section[informacoesParto] (LOINC 72135-7*) — NOVO: Bloco 3
│   │   └── entry: Procedure + Observation (via parto, TP, rotura)
│   └── section[dadosNeonatais] (LOINC 57074-7*) — NOVO: Bloco 4
│       └── entry: Patient (RN) + Observation (Apgar, peso, etc.)
├── Patient (mãe)
├── Patient (recém-nascido, se nascido vivo)
├── Practitioner (responsável)
├── Organization (hospital/maternidade)
├── Encounter (internação obstétrica)
├── Condition[] (diagnósticos obstétricos)
├── Procedure[] (procedimentos de parto)
├── AllergyIntolerance[] (alergias)
├── MedicationRequest[] (prescrições de alta)
├── Observation[] (sinais vitais, histórico obstétrico, neonatal)
├── CarePlan (plano de cuidados)
└── RelatedPerson (vínculo mãe-RN, se aplicável)
```

*Nota: LOINC codes marcados com * são sugestões baseadas no padrão IPS/US Core. Os códigos oficiais serão definidos pelo DEINFO/DATASUS no modelo computacional.

### LOINC Codes Candidatos para Seções SAO

| Seção SAO | LOINC Candidato | Display |
|-----------|-----------------|---------|
| Histórico Obstétrico | 89213-3 | Obstetrics History |
| Gestações anteriores | 11996-6 | [#] Pregnancies |
| Partos anteriores | 11977-6 | [#] Parity |
| Abortos anteriores | 69043-8 | Other pregnancy outcome |
| Idade gestacional | 11884-4 | Gestational age |
| DUM | 8665-2 | Last menstrual period start date |
| DPP | 11778-8 | Delivery date estimated |
| Via de parto | 73762-7 | Method of delivery |
| Tipo de gravidez | 11878-6 | Number of fetuses |
| Apgar 1 min | 9272-6 | 1 minute Apgar score |
| Apgar 5 min | 9274-2 | 5 minute Apgar score |
| Peso ao nascer | 8339-4 | Birth weight measured |
| Trabalho de parto | 72135-7 | Labor and delivery summary |
| Complicações obstétricas | 73781-7 | Pregnancy complications |

---

## 9. Códigos CID-10 Relevantes para SAO

### Diagnósticos Obstétricos Frequentes

| CID-10 | Descrição | Relevância |
|--------|-----------|-----------|
| O24.4 | Diabetes mellitus gestacional | Cenário Maria |
| O13 | Hipertensão gestacional sem proteinúria | Cenário Maria |
| O14.0 | Pré-eclâmpsia leve | Complicação comum |
| O14.1 | Pré-eclâmpsia grave | Emergência |
| O15 | Eclâmpsia | Emergência |
| O42 | Ruptura prematura de membranas | Complicação |
| O60 | Trabalho de parto prematuro | Complicação |
| O80 | Parto único espontâneo | Desfecho normal |
| O82 | Parto por cesariana | Desfecho cirúrgico |
| O72 | Hemorragia pós-parto | Emergência puerperal |

### Procedimentos (Tabela SUS/SIGTAP)

| Código | Descrição |
|--------|-----------|
| 0411010026 | Parto normal |
| 0411010034 | Parto cesariano |
| 0409060070 | Curetagem pós-aborto |
| 0411020013 | Parto cesariano com laqueadura tubária |

---

## 10. Exemplo SAO Bundle — NÃO DISPONÍVEL

**Não existe** exemplo oficial de Bundle SAO na documentação pública da RNDS, nos repositórios kyriosdata/rnds-ig, ou em qualquer outra fonte pesquisada. Isso confirma que o modelo computacional ainda não foi publicado.

Para referência, o SA tem um exemplo parcial no rnds-guia, mas o SAO não.

---

## 11. Evidência Acadêmica: Lacunas na Alta Obstétrica

Um estudo publicado na RMMG (Revista Médica de Minas Gerais) analisou sumários de alta obstétrica em maternidade de referência e encontrou lacunas graves:

| Dado | % Documentação |
|------|---------------|
| Exame obstétrico na admissão | 58,8% |
| Sexo do RN | 36,7% |
| Desfecho neonatal | 11,7% |
| Medicações prescritas | 38,1% |
| Data de retorno pós-alta | 11,1% |
| Instruções pós-alta | 26,8% |
| Campos estruturados (datas, transfusão) | 90-99% |

**Insight:** Campos estruturados (com preenchimento obrigatório no sistema) têm completude muito maior que campos de texto livre. O SAO, ao padronizar os campos obstétricos como obrigatórios e estruturados, pode melhorar dramaticamente a qualidade da documentação de alta obstétrica.

---

## 12. Implicações para o Projeto Ponte

### 12.1 O que o SAO muda para o cenário Maria

O fluxo completo com SAO:

```
1. Maria → UBS Vila Nova (IPM)
   → Ponte gera RAC → envia RNDS
   [Seção historiaObstetrica: G3P1, DUM, IG, risco alto]

2. Maria → Maternidade Regional (emergência obstétrica)
   → Obstetra consulta RNDS → vê RAC com dados pré-natais
   → Sabe: diabetes gestacional, hipertensão, alergia penicilina

3. Maria recebe alta da maternidade
   → Hospital gera SAO → envia RNDS
   [Via de parto, complicações, dados do RN, prescrições]

4. Maria retorna à UBS Vila Nova (consulta puerperal)
   → Enfermeira consulta RNDS → vê SAO
   → Sabe: como foi o parto, medicações, cuidados com RN
```

**Sem o SAO, a informação flui numa direção só (UBS → hospital). Com o SAO, o cuidado é bidirecional.**

### 12.2 O Ponte deveria implementar SAO?

**Análise:**

| Fator | Análise |
|-------|---------|
| Quem gera o SAO? | Hospital, NÃO a APS |
| O Ponte foca em quê? | Adaptador IPM → RNDS (IPM é usado na APS) |
| O IPM é usado em hospitais? | Raramente; mais comum em APS/UBS |
| Modelo computacional disponível? | NÃO (ainda em desenvolvimento pelo DATASUS) |

**Conclusão:** O Ponte NÃO deveria implementar SAO agora. Razões:
1. O SAO é gerado pelo hospital, não pela APS (nosso foco)
2. O modelo computacional FHIR não está publicado
3. O hospital que gera SAO provavelmente usa AGHUse, PRONTO, ou outro sistema hospitalar, não IPM

**PORÉM:** O Ponte deveria ser capaz de CONSUMIR o SAO (ler da RNDS e exibir para a enfermeira na UBS). Isso é mais simples que gerar — basta parsear o Bundle e exibir.

### 12.3 Prioridades técnicas

1. **Curto prazo:** Manter foco no RAC (geração). O RAC do Ponte já inclui seção historiaObstetrica
2. **Médio prazo:** Implementar CONSUMO de SA/SAO da RNDS (leitura e exibição)
3. **Longo prazo:** Se o Ponte for adotado por hospitais que usam IPM, implementar geração de SAO

### 12.4 Preparação técnica

Mesmo sem implementar SAO agora, devemos:
- Usar os LOINC codes corretos para dados obstétricos no RAC (89213-3, 11996-6, 11977-6, 8665-2)
- Estruturar os builders para suportar seções adicionais facilmente
- Manter compatibilidade com br-core-sumarioalta (nosso RAC já usa br-core-composition como base)
- Documentar os perfis obstétricos BR Core (PregnancyStatus, PregnancyEDD, PregnancyOutcome) para uso futuro

---

## 13. Fontes

### Legislação
- [Portaria GM/MS 8.025/2025 - CONASS Informa 152/2025](https://www.conass.org.br/conass-informa-n-152-2025-publicada-a-portaria-gm-n-8-025-que-institui-o-modelo-de-informacao-do-sumario-de-alta-obstetrico-sao-no-ambito-da-rede-nacional-de-dados-em-saude-rnds/)
- [Portaria GM/MS 8.026/2025 - SA (texto completo)](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2025/prt8026_28_08_2025.html)
- [Portaria SAES/MS 701/2022 - SA original (revogada pela 8.026)](https://bvsms.saude.gov.br/bvs/saudelegis/Saes/2022/prt0701_19_10_2022.html)
- [Legislação RNDS - Ministério da Saúde](https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/legislacao)

### Notícias e Análises
- [MS padroniza altas hospitalares (notícia oficial)](https://www.gov.br/saude/pt-br/assuntos/noticias/2025/agosto/ministerio-da-saude-padroniza-altas-hospitalares-e-fortalece-integracao-de-dados-no-sus)
- [CONASEMS - Legislação diária 28/08/2025](https://portal.conasems.org.br/legislacao-diaria/2592_legislacao-diaria-nacional-28-de-agosto-de-2025)
- [Análise do conteúdo do sumário de alta obstétrica (RMMG)](https://rmmg.org/artigo/detalhes/1860)

### Especificações Técnicas FHIR
- [BR Core IG - hl7.org.br/fhir/core](https://hl7.org.br/fhir/core/)
- [BR Core Artifacts](https://hl7.org.br/fhir/core/artifacts.html)
- [br-core-sumarioalta (SA profile)](https://hl7.org.br/fhir/core/StructureDefinition-br-core-sumarioalta.html)
- [br-core-registroatendimentoclinico (RAC profile)](https://hl7.org.br/fhir/core/StructureDefinition-br-core-registroatendimentoclinico.html)
- [br-core-composition (base Composition profile)](https://hl7.org.br/fhir/core/StructureDefinition-br-core-composition.html)
- [RNDS FHIR IG](https://rnds-fhir.saude.gov.br/)
- [BRTipoDocumento CodeSystem](https://rnds-fhir.saude.gov.br/CodeSystem-BRTipoDocumento.html)
- [RNDS Guia de Integração](https://rnds-guia.saude.gov.br/docs/introducao/)
- [RNDS SA - Objetivo](https://rnds-guia.saude.gov.br/docs/sa/objetivo-sa/)
- [RNDS SA - Modelo de Informação](https://rnds-guia.saude.gov.br/docs/sa/mi-sa/)
- [DATASUS MAD](https://datasus.saude.gov.br/modelo-padrao-de-dados-mad/)

### Repositórios
- [kyriosdata/rnds (GitHub)](https://github.com/kyriosdata/rnds)
- [kyriosdata/rnds-ig (FHIR IG)](https://kyriosdata.github.io/rnds-ig/toc.html)
- [RNDS Simplifier](https://simplifier.net/redenacionaldedadosemsaude)
- [BR-Core Simplifier](https://simplifier.net/br-core)

### Referências Internacionais (perfis obstétricos FHIR)
- [IPS - Pregnancy Outcome (HL7 UV)](http://hl7.org/fhir/uv/ips/StructureDefinition-Observation-pregnancy-outcome-uv-ips.html)
- [IPS Brasil](https://ips-brasil.web.app/)
- [Nictiz BirthCare FHIR IG (Holanda)](https://informatiestandaarden.nictiz.nl/wiki/Gebz:V1.1_FHIR_IG)
- [NHS Maternity Record (UK)](https://nhsconnect.github.io/FHIR-Maternity-Record/explore_pregnancy_episode.html)
- [Brazilian IPS Initiative (Oxford Academic)](https://academic.oup.com/oodh/article/doi/10.1093/oodh/oqae015/7667343)

---

## 14. Resumo das Descobertas

| # | Descoberta | Impacto |
|---|-----------|---------|
| 1 | SAO = SA + 4 blocos obstétricos (internação materna, complicações, parto, neonatal) | Estrutura clara e extensível |
| 2 | SAO é gerado pelo HOSPITAL, não pela APS | Ponte NÃO deve gerar SAO (foco em APS/IPM) |
| 3 | Modelo computacional FHIR do SAO NÃO está publicado | Não podemos implementar SAO conforme até publicação |
| 4 | BR Core já tem perfis obstétricos (PregnancyStatus, EDD, Outcome, Breastfeeding) | Building blocks existem para futura implementação |
| 5 | br-core-sumarioalta tem 7 seções obrigatórias com LOINC codes definidos | Base técnica sólida para quando SAO FHIR for publicado |
| 6 | RAC já tem seção historiaObstetrica (LOINC 89213-3) | Nosso RAC já suporta dados obstétricos |
| 7 | 8 cenários de alta obstétrica definidos (da alta normal ao óbito materno) | Complexidade de desfechos requer modelagem cuidadosa |
| 8 | Estudo RMMG: campos estruturados têm 90-99% completude vs 11-38% texto livre | Padronização SAO vai melhorar qualidade dos dados |
| 9 | RNDS tem 2.9 bilhões de registros (cresceu de 2.8B citado antes) | Infraestrutura robusta e em crescimento |
| 10 | Portarias 8.025 e 8.026 publicadas no mesmo dia (27/ago/2025) | Estratégia deliberada de padronização conjunta SA+SAO |

---

## 15. Recomendações de Ação

### Para o Ponte (imediato)
1. **NÃO implementar geração de SAO** — foco no RAC para APS/IPM
2. **Garantir que o RAC inclua seção historiaObstetrica** (LOINC 89213-3) com dados obstétricos completos
3. **Usar LOINC codes corretos** para dados obstétricos: 11996-6 (gestações), 11977-6 (partos), 8665-2 (DUM), 11884-4 (IG)
4. **Documentar mapeamento proposto** para referência futura quando modelo computacional SAO for publicado

### Para o Ponte (médio prazo)
5. **Implementar consumo de SA/SAO** — ler Bundle SA/SAO da RNDS e exibir na interface (WhatsApp ou web)
6. **Monitorar publicação do modelo computacional SAO** pelo DEINFO/DATASUS
7. **Preparar builder SAO** que estenda o SA com seções obstétricas adicionais

### Para Giovanni
8. **Usar SAO como argumento** no contato com COSEMS-SC: "O cenário obstétrico agora é CENTRAL na RNDS. O Ponte prepara os municípios para a nova era de interoperabilidade obstétrica."
9. **Monitorar DATASUS** para publicação do modelo computacional SAO
