# Rascunho — Abstract CBIS 2026

> **Status:** RASCUNHO v1 — preparado autonomamente em 2026-02-15
> **Congresso:** XXI Congresso Brasileiro de Informática em Saúde (CBIS 2026)
> **Local/Data:** Brasília, 23-25 de setembro de 2026
> **Modalidade sugerida:** Relato de Experiência (case report) ou Artigo Completo (se houver resultados do piloto)
> **Idioma:** Português (com abstract em inglês)

---

## Título

**Ponte: Adaptador Open-Source para Integração de Sistemas Legados de APS à RNDS via FHIR R4 — Experiência com IPM Atende.Net em Municípios de Santa Catarina**

### Title (English)

**Ponte: An Open-Source Adapter for Integrating Legacy PHC Systems with Brazil's National Health Data Network via FHIR R4 — Experience with IPM Atende.Net in Santa Catarina Municipalities**

---

## Resumo Estruturado (pt-BR)

### Introdução

A Rede Nacional de Dados em Saúde (RNDS), formalizada pelo Decreto 12.560/2025 como plataforma oficial do SUS, alcança 68% dos municípios brasileiros. Em Santa Catarina, porém, apenas 25% dos municípios (74 de 295) estão integrados — situação agravada pela predominância de sistemas proprietários de Atenção Primária à Saúde (APS) como o IPM Atende.Net, utilizado por mais de 120 municípios, que não transmite dados clínicos à RNDS. Essa lacuna impacta diretamente a continuidade do cuidado: 92% das mortes maternas no Brasil são evitáveis, e gestantes de municípios pequenos (<50 mil habitantes) representam 58% dos deslocamentos obstétricos, frequentemente sem acesso a histórico clínico no serviço receptor.

### Objetivo

Apresentar o Ponte, um adaptador open-source (licença MIT) que transforma dados de sistemas legados de APS em recursos FHIR R4 compatíveis com os perfis BR Core, gerando Bundles RAC (Registro de Atendimento Clínico) para envio à RNDS — sem necessidade de alteração no sistema de origem.

### Métodos

O adaptador foi desenvolvido em TypeScript com arquitetura modular: (1) camada de DataSource (interface abstrata com implementações para dados mock, leitura de banco PostgreSQL, e parsing de arquivos LEDI/Thrift exportados pelo e-SUS APS); (2) 9 builders FHIR R4 mapeando dados de APS para perfis BR Core (Patient, Practitioner, Organization, Encounter, Condition, AllergyIntolerance, Observation/VitalSigns, MedicationStatement, Composition RAC); (3) assembler de Bundle tipo document com validação local de conformidade. O cenário clínico de referência ("Maria") representa uma gestante de alto risco (39 anos, G3P1, diabetes e hipertensão gestacional, alergia a penicilina) atendida em UBS com IPM. A conformidade foi validada contra os perfis BR Core publicados em hl7.org.br/fhir/core e as terminologias oficiais (BRCID10, BRMedicamento/CATMAT, LOINC, CIAP-2). A via LEDI/Thrift foi implementada como alternativa ao acesso direto ao banco, utilizando os arquivos .esus que o IPM já exporta obrigatoriamente para o SISAB.

### Resultados

O adaptador gera Bundles RAC com 18 recursos FHIR R4 por atendimento, incluindo Composition com 4 seções (diagnósticos avaliados, sinais vitais, alergias/reações adversas, medicamentos), dados obstétricos (DUM, idade gestacional, gestas/partos prévios), e codificação com terminologias brasileiras oficiais (códigos CATMAT reais para medicamentos e alérgenos, CID-10 com URI canônico brasileiro, LOINC para observações). Dezenove problemas de conformidade com os perfis BR Core foram identificados e corrigidos, incluindo 5 críticos (Composition.identifier, Composition.attester, Patient CPF type/use, AllergyIntolerance code system/code). O parser LEDI/Thrift implementado (zero dependências externas) desserializa fichas de Atendimento Individual (FAI) e Cadastro Individual (FCI) com merge por CPF. A suíte de testes automatizados conta com 275 testes em 18 arquivos. Todo o código é open-source (MIT) e está disponível em github.com/Moser007/ponte.

### Conclusão

O Ponte demonstra a viabilidade técnica de integrar sistemas legados de APS à RNDS por meio de um adaptador externo, sem cooperação do fornecedor do sistema. A abordagem via LEDI/Thrift (arquivos já exportados pelo município) oferece um caminho de integração que não requer acesso ao banco de dados proprietário, reduzindo barreiras técnicas e legais. O projeto contribui para a implementação das Portarias 5.663/2024, 7.495/2025 e 8.025/2025, e pode ser estendido a outros sistemas de APS que exportem dados no formato LEDI. Próximos passos incluem piloto com município parceiro em SC (via COSEMS-SC) e validação em ambiente de homologação da RNDS.

### Palavras-chave

Interoperabilidade; FHIR R4; RNDS; Atenção Primária à Saúde; Saúde Materna; Open-Source

---

## Abstract (English)

### Introduction

Brazil's National Health Data Network (RNDS), formalized by Decree 12,560/2025 as the official SUS platform, covers 68% of municipalities nationally. In Santa Catarina, however, only 25% of municipalities (74 of 295) are integrated — a gap worsened by the prevalence of proprietary PHC systems like IPM Atende.Net, used by 120+ municipalities, which does not transmit clinical data to the RNDS. This gap directly impacts care continuity: 92% of maternal deaths in Brazil are preventable, and pregnant women from small municipalities (<50,000 inhabitants) account for 58% of obstetric displacements, often without clinical history at the receiving facility.

### Objective

To present Ponte, an open-source adapter (MIT license) that transforms legacy PHC system data into FHIR R4 resources conforming to BR Core profiles, generating RAC (Clinical Encounter Summary) Bundles for submission to the RNDS — without modifications to the source system.

### Methods

The adapter was developed in TypeScript with a modular architecture: (1) DataSource layer (abstract interface with implementations for mock data, PostgreSQL database, and LEDI/Thrift file parsing from e-SUS APS exports); (2) 9 FHIR R4 builders mapping PHC data to BR Core profiles (Patient, Practitioner, Organization, Encounter, Condition, AllergyIntolerance, Observation/VitalSigns, MedicationStatement, RAC Composition); (3) document Bundle assembler with local conformance validation. The reference clinical scenario ("Maria") represents a high-risk pregnant woman (39 years, G3P1, gestational diabetes and hypertension, penicillin allergy) seen at a PHC unit using IPM. Conformance was validated against BR Core profiles and official terminologies (BRCID10, BRMedicamento/CATMAT, LOINC, ICPC-2). The LEDI/Thrift pathway was implemented as an alternative to direct database access, using .esus files that IPM already exports to SISAB.

### Results

The adapter generates RAC Bundles with 18 FHIR R4 resources per encounter, including a Composition with 4 sections (assessed diagnoses, vital signs, allergies/adverse reactions, medications), obstetric data (LMP, gestational age, gravidity/parity), and coding with official Brazilian terminologies (real CATMAT codes for medications and allergens, ICD-10 with Brazilian canonical URI, LOINC for observations). Nineteen conformance issues with BR Core profiles were identified and corrected, including 5 critical ones. The LEDI/Thrift parser (zero external dependencies) deserializes Individual Encounter (FAI) and Individual Registration (FCI) records with merge by CPF. The automated test suite comprises 275 tests across 18 files. All code is open-source (MIT) at github.com/Moser007/ponte.

### Conclusion

Ponte demonstrates the technical feasibility of integrating legacy PHC systems with the RNDS through an external adapter, without vendor cooperation. The LEDI/Thrift approach (using files already exported by municipalities) provides an integration pathway that requires no access to the proprietary database, reducing technical and legal barriers. The project contributes to the implementation of Ordinances 5,663/2024, 7,495/2025, and 8,025/2025, and can be extended to other PHC systems that export LEDI data. Next steps include a pilot with a partner municipality in SC (via COSEMS-SC) and validation in the RNDS staging environment.

### Keywords

Interoperability; FHIR R4; RNDS; Primary Health Care; Maternal Health; Open-Source

---

## Notas para Giovanni

1. **Modalidade:** Se tivermos resultados do piloto até jul/2026, submeter como **artigo completo** (publicado no JHI/LILACS). Se não, submeter como **relato de experiência** (publicado nos anais do CBIS com ISSN 2178-2857).

2. **Chamada de trabalhos:** A chamada deve abrir por volta de abril-maio 2026 (CBIS 2024 teve chamada em jan-abr). Ficar atento ao site sbis.org.br.

3. **Co-autoria:** Considerar incluir como co-autores:
   - Gisele (COSEMS-SC) — se participar do piloto
   - Profissional de saúde do município parceiro
   - Pesquisador da FURB (se houver parceria acadêmica)
   - Até 10 autores permitidos

4. **Eixo temático provável:** "Interoperabilidade e Padrões" ou "Sistemas de Informação em Saúde" ou "Saúde Digital na APS"

5. **Diferencial competitivo do trabalho:**
   - Open-source (MIT) — reprodutível
   - Via LEDI sem cooperação do vendor — inovador
   - 275 testes automatizados — rigor técnico
   - Problema real com dados epidemiológicos robustos (mortalidade materna)
   - Alinhamento regulatório (5 portarias/decretos citados)

6. **Se o piloto acontecer antes da submissão**, adicionar:
   - Dados reais de conformidade (validação com HL7 FHIR Validator)
   - Tempo de processamento por atendimento
   - Taxa de sucesso de envio à RNDS em homologação
   - Feedback de profissionais de saúde
   - Número de atendimentos processados
