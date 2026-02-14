# R003 - AGHUse Research Report

**Research ID:** R003
**Date:** 2026-02-13
**Subject:** AGHUse - Brazilian Open-Source Hospital Management System
**Purpose:** Evaluate AGHUse as a strategic ally for the Ponte project (RNDS/FHIR R4 interoperability)

---

## Executive Summary

AGHUse is Brazil's most significant open-source hospital management system, developed by Hospital de Clinicas de Porto Alegre (HCPA) since the 1980s. It is deployed in 100+ health units across 10+ states and backed by the Brazilian Ministry of Health. The system is GPL-licensed, Java-based, and runs on PostgreSQL. RNDS/FHIR integration is actively being developed for the parallel AGHU branch (managed by Ebserh), with deployment across 45 university hospitals planned by end of 2025. AGHUse (the HCPA branch) is also pursuing RNDS integration through its community, particularly in Bahia.

**Strategic verdict:** AGHUse is a high-value strategic ally for Ponte. Contributing RNDS/FHIR integration modules to AGHUse would provide immediate credibility and reach across 100+ health units. However, the community model is institutional (not open-contribution via GitHub PRs), which means engagement requires formal cooperation agreements with HCPA.

---

## 1. Repository and Source Code Access

### Source Code Status: NOT publicly available on GitHub/GitLab

Despite being GPL-licensed, AGHUse does **not** have a publicly accessible source code repository on GitHub, GitLab, or any indexed platform. Multiple searches across GitHub, GitLab, and Software Publico Brasileiro returned no results.

**How source code is distributed:**
- Code is shared through the **Comunidade AGHUse** (AGHUse Community)
- Access requires a formal cooperation agreement (instrumento de cooperacao) with HCPA
- Alternatively, through accredited service provider companies
- Once a member, institutions receive the code and commit to contributing improvements

**License:** GPL (General Public License) - confirmed on multiple official sources.

**Implication for Ponte:** To access the source code, the Ponte project (or a participating institution) would need to formally join the AGHUse Community through HCPA.

### Accredited Service Providers (can facilitate access):
1. Liberty Comercio e Servicos LTDA
2. Lume Servicos de Tecnologia S/A
3. R Forti Recursos para TI LTDA
4. Noxtec Servicos LTDA

---

## 2. Architecture and Tech Stack

### Programming Language and Frameworks
- **Language:** Java (Java EE)
- **Application Server:** JBoss WildFly
- **Frameworks:** JBoss Seam, CDI, JSF (JavaServer Faces), Hibernate
- **Build:** Maven
- **Testing:** JUnit
- **Reporting:** iReport
- **Frontend:** Web-based (JSF with RichFaces)

### Database
- **Primary:** PostgreSQL
- **Legacy:** Oracle (some HCPA internal deployments may still use Oracle; PostgreSQL is the standard for external deployments)
- **Cloud migration:** Amazon Aurora (PostgreSQL-compatible) at Unicamp

### Architecture Pattern
- **Monolithic with modular structure** - The system is a large Java EE application deployed on JBoss WildFly, organized into functional modules. It is NOT a microservices architecture.
- The Unicamp deployment migrated to containers (Amazon ECS with Fargate), but this is an infrastructure modernization, not an architectural rewrite.

### Deployment Model
- **On-premises** is the primary model
- **Cloud deployments** exist (AWS at Unicamp is a documented case study)
- JBoss WildFly in containers (Docker/ECS) for cloud deployments
- Amazon EFS for shared file storage between ECS tasks
- Multi-availability-zone for resilience

---

## 3. RNDS Integration Status

### Critical distinction: AGHU (Ebserh) vs. AGHUse (HCPA)

There are **two separate systems** that share a common origin but diverged in 2014:

| Aspect | AGHU (Ebserh) | AGHUse (HCPA) |
|--------|--------------|---------------|
| Maintainer | Ebserh (federal company) | HCPA + Community |
| Target | 45 federal university hospitals | 100+ diverse health units |
| Current version | v11 (2024) | Ongoing releases |
| RNDS status | **Active integration with RNDS/SUS Digital** | Integration planned, in progress |
| SBIS certification | Yes (NGS1 level) | Not confirmed |

### AGHU (Ebserh) - RNDS Integration:
- **AGHU is now integrated with SUS Digital Professional through RNDS** (confirmed 2025)
- Successfully tested at Hospital Universitario de Brasilia (HUB-UnB)
- Deployment to all 45 Ebserh hospitals planned by end of 2025
- Enables access to the "prontuario unico do cidadao" (unified citizen health record)
- Allows healthcare professionals to access patient clinical data from any SUS unit nationwide
- AGHU v11 includes 198 new functionalities focused on security, interoperability, quality, and traceability

### AGHUse (HCPA) - RNDS Integration:
- The Bahia state deployment explicitly mentions **RNDS integration with AGHUse** as a goal
- The Ministry of Health's entry into the AGHUse Community (July 2025) signals intent to align AGHUse with national digital health strategy
- No confirmed production RNDS integration for AGHUse at this time

### FHIR R4 Resources:
- The RNDS integration uses FHIR R4 as specified by Brazil's national profiles
- Specific FHIR resources for RNDS: Patient, Encounter, Observation, Condition, Procedure, Immunization, DiagnosticReport, MedicationRequest, among others
- RAC (Registro de Atendimento Clinico) and RSA (Resumo de Saude do Atendimento) are the primary document types sent to RNDS
- Whether AGHU/AGHUse specifically generates RAC/RSA bundles is not explicitly documented in public sources, but the SUS Digital integration implies this capability is being built

---

## 4. Community

### Comunidade AGHUse
- **Size:** 100+ health units across Brazil
- **Structure:** Institutional membership model (not individual contributors)
- **Governance:** Formalized through cooperation agreements with HCPA
- **Community portal:** https://sites.google.com/hcpa.edu.br/aghuse/
- **Contact (HCPA tech transfer):** nitt@hcpa.edu.br

### Member Institutions Include:
- **Federal Government:** Ministry of Health (joined July 2025)
- **Military:** Brazilian Army (4+ hospitals, expanding to entire health system), Brazilian Air Force (HCA)
- **Universities:** Unicamp (HC), UFRGS, UFRJ (Complexo Hospitalar)
- **State Health Secretariats:** Bahia, Rio Grande do Sul, Sao Paulo, Paraiba, Pernambuco, Rio Grande do Norte, Espirito Santo
- **Total:** 10+ states and Armed Forces

### Community Dynamics:
- Each member institution commits to developing improvements and contributing them back
- New versions are collaboratively developed and distributed to all members
- There is a "contribution calculation methodology" (metodologia de calculo de contribuicao)
- Community has its own bylaws (Regimento)

### No public forum, mailing list, or chat was found
- Communication appears to happen through institutional channels
- No public issue tracker, no GitHub Discussions, no Slack/Discord

---

## 5. External Contributions

### Contribution Model: Institutional, Not Open

AGHUse does **not** follow the standard open-source contribution model (fork, PR, merge). Key points:

- **No public CONTRIBUTING.md** - there is no publicly accessible repository
- **No PR process** - contributions happen through the community's institutional framework
- **Requirement to join:** Institutions must formally join the Comunidade AGHUse
- **Minimum team requirement:** Institutions wanting to contribute development must demonstrate a minimum coordination, development, and support team
- **Contribution obligation:** Members commit to developing improvements as a condition of membership

### How to Contribute:
1. Join the Comunidade AGHUse through a cooperation agreement with HCPA
2. Receive the source code and documentation
3. Develop improvements to assigned or chosen modules
4. Submit improvements through the community's internal process
5. Improvements are incorporated into the shared codebase

### For Ponte specifically:
- A direct open-source contribution (like a GitHub PR) is not possible
- Ponte would need institutional backing to join the community
- Alternatively, Ponte could develop RNDS/FHIR modules independently and propose integration through a community member institution

---

## 6. Deployment and Adoption

### Scale
- **100+ health units** across Brazil (as of 2025)
- **10+ states** plus Armed Forces
- **80+ hospitals** as of earlier reports
- Potential: Estimates suggest up to **7,000 SUS hospitals** could eventually adopt the system
- Projected savings: R$ 3 billion to states over 5 years

### Notable Deployments:

**Bahia:**
- 32+ state network units running AGHUse
- Policlinicas in Salvador (Narandiba, Escada) migrated in late 2024
- Modules deployed: Ambulatory, Exams, Minor Surgeries
- Additional modules (Pharmacy, Inventory, Billing, Digital Certification) planned for early 2025

**Paraiba:**
- 18+ hospital units operational
- Expanding to 25 units, then 35 units covering the entire state network
- Three health macro-regions covered

**Rio Grande do Sul:**
- State Health Secretariat adopted AGHUse
- HCPA itself is the primary deployment

**Sao Paulo:**
- Unicamp HC - major deployment with 750,000+ accesses in first 15 months
- Migrated to AWS cloud infrastructure

**Military:**
- Brazilian Army: 4+ hospitals, expanding to entire health system nationwide
- Brazilian Air Force: HCA (Hospital Central da Aeronautica)
- Hospital Militar de Area de Brasilia, Manaus, Campo Grande

**Federal:**
- Ministry of Health (joined community July 2025)
- Federal Hospital of Ipanema (Rio de Janeiro) - initial Ministry deployment

**Unicamp:**
- 750,000+ accesses in 15 months
- AWS cloud migration (documented case study)

---

## 7. History

### Timeline:
- **1980s:** HCPA begins developing AGH (Aplicativos de Gestao Hospitalar) as an internal system
- **2009:** Ministry of Education (MEC) initiates the AGHU project to standardize management across 47 university hospitals. Partnership: HCPA + MEC + Ebserh
- **2009-2014:** AGHU developed and distributed to university hospitals
- **2014:** Fork occurs:
  - **Ebserh** takes over AGHU maintenance (continues as "AGHU")
  - **HCPA** launches **AGHUse** with architectural updates (migration from v5 to v7)
- **2017-2018:** Brazilian Army begins implementation
- **2018:** Unicamp deployment reaches 750,000 accesses
- **2023:** CONASS Technical Note 05/2023 documents AGHUse and AGHU as reference hospital systems for SUS
- **2023:** Cooperation accord between Ministry of Health, MEC, Ebserh, Conass, and Conasems
- **2024:** Ebserh launches AGHU v11 with 198 new features, SBIS certification
- **2024:** Bahia, Paraiba expand AGHUse deployments
- **2024-2025:** AGHU integrates with SUS Digital/RNDS
- **2025 (July):** Ministry of Health formally joins AGHUse Community
- **2025:** RNDS integration deployment across 45 Ebserh hospitals planned

### Creators:
- **Hospital de Clinicas de Porto Alegre (HCPA)** - linked to Universidade Federal do Rio Grande do Sul (UFRGS)
- Current status: **Very active** - growing community, Ministry of Health backing, national expansion

---

## 8. Documentation

### Available Documentation:
- **Community portal:** https://sites.google.com/hcpa.edu.br/aghuse/
- **HCPA institutional page:** https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse
- **NITT technology showcase:** https://sites.google.com/hcpa.edu.br/nitt/vitrine-tecnologica/aghuse-sistema-de-gestao-em-saude
- **General presentation (Google Drive):** https://drive.google.com/file/d/1t5yIbwyMlr7pppD54H7m2nxZiUMjke1d/
- **CONASS Technical Note 05/2023:** https://www.conass.org.br/biblioteca/wp-content/uploads/2024/09/NT-05-2023-software-hospitalar.pdf
- **ENAP case study (PDF):** https://repositorio.enap.gov.br/bitstream/1/4075/1/AGHU%20%20Modelo%20de%20Gest%C3%A3o%20do%20HCPA%20Inovando%20a%20Assist%C3%AAncia%20%C3%A0%20Sa%C3%BAde.pdf
- **AWS Unicamp case study:** https://aws.amazon.com/pt/blogs/aws-brasil/case-de-sucesso-como-a-unicamp-construiu-uma-arquitetura-resiliente-e-migrou-o-aghuse-para-a-aws/
- **Espirito Santo wiki/FAQ:** https://app.wiki.saude.es.gov.br/pt-br/AGHUSE/faq
- **Community bylaws and contribution methodology** - available to members

### Not Available Publicly:
- API documentation
- Developer guides
- Source code documentation
- Architecture diagrams
- Database schema
- Deployment guides

### Ebserh/AGHU Documentation:
- Training manuals available at: https://www.gov.br/ebserh/pt-br/hospitais-universitarios/ (per hospital)
- AGHU platform page: https://www.gov.br/ebserh/pt-br/governanca/plataformas-e-tecnologias/aghu

---

## 9. Modules

### Care/Clinical Modules (Assistenciais):
1. **Pacientes** (Patients) - patient registration and demographics
2. **Ambulatorio** (Outpatient) - administrative and clinical outpatient management
3. **Internacao** (Inpatient) - admissions management
4. **Prescricao Medica** (Medical Prescription)
5. **Prescricao de Enfermagem e Multiprofissional** (Nursing and Multiprofessional Prescription)
6. **Emergencia** (Emergency)
7. **Cirurgias/PDT** (Surgeries/Diagnostic-Therapeutic Procedures)
8. **Anamnese e Evolucao** (Anamnesis and Clinical Evolution)
9. **Controles do Paciente** (Patient Controls)
10. **Exames** (Laboratory and Imaging Exams)
11. **Perinatologia** (Perinatology)
12. **Nutricao** (Nutrition)
13. **Prontuario Online** (Online Medical Record / EHR)

### Management/Administrative Modules:
14. **Farmacia** (Pharmacy)
15. **Estoque/Suprimentos** (Inventory/Supplies)
16. **Custos** (Costs)
17. **Faturamento** (Billing - SUS AIH integration)
18. **Certificacao Digital** (Digital Certification)
19. **Agenda Profissional** (Professional Schedule)
20. **Manutencao** (Maintenance)
21. **Controle de Infeccao Hospitalar** (Hospital Infection Control)
22. **Inventario** (Inventory)

**Total: ~18-22 modules** depending on how they are counted (some sources say 16, others list more).

---

## 10. Relevance to Ponte Project

### Strategic Assessment

#### Opportunities:

1. **Massive reach:** Contributing RNDS integration to AGHUse would instantly benefit 100+ health units and potentially thousands more as adoption grows.

2. **Ministry of Health alignment:** The Ministry joined the AGHUse Community in July 2025, signaling national strategic importance. Ponte's RNDS focus aligns perfectly.

3. **RNDS gap in AGHUse:** While Ebserh's AGHU is integrating with RNDS, the AGHUse branch (HCPA's version used by non-university hospitals) does NOT yet have confirmed production RNDS integration. This is a clear gap that Ponte could fill.

4. **Credibility:** Being associated with AGHUse (backed by HCPA, Ministry of Health, Brazilian Army) would give Ponte enormous institutional credibility.

5. **Real-world testing:** Immediate access to hospital environments for testing FHIR R4 modules.

6. **Bahia connection:** Bahia's AGHUse deployment explicitly mentions RNDS integration as a goal -- a concrete entry point.

#### Challenges:

1. **No public repository:** The source code is not on GitHub/GitLab. This means Ponte cannot simply submit PRs. Institutional engagement is required.

2. **Institutional model:** Joining the community requires formal cooperation agreements, not individual developer contributions.

3. **Legacy tech stack:** Java EE with JBoss Seam/JSF is an older stack. Integration work would need to be in Java and compatible with this architecture.

4. **Two ecosystems:** The AGHU (Ebserh) vs. AGHUse (HCPA) split means work on one branch may not automatically benefit the other.

5. **Documentation scarcity:** Limited public technical documentation makes it harder to start developing without being inside the community.

#### Recommended Approach:

1. **Contact HCPA's NITT** (nitt@hcpa.edu.br) to explore joining the AGHUse Community or establishing a cooperation channel.

2. **Leverage an institutional partner:** If Ponte has relationships with any AGHUse community member (e.g., a university hospital, a state health secretariat), use that as an entry point.

3. **Focus on the RNDS gap:** Position Ponte as the team that can deliver RNDS/FHIR R4 integration for AGHUse (specifically RAC/RSA generation and submission to RNDS).

4. **Consider the Bahia angle:** The Bahia state deployment is actively seeking RNDS integration with AGHUse. A partnership here could be highly impactful.

5. **Build standalone FHIR modules first:** Develop FHIR R4 resource generation libraries that can work with AGHUse's data model, then propose integration.

6. **Engage both ecosystems:** While AGHUse is the primary target, monitor Ebserh's AGHU RNDS work to learn from their integration patterns.

---

## Comparison: AGHUse vs. Related Systems

| System | Maintainer | License | Tech Stack | RNDS | Status | Source Access |
|--------|-----------|---------|------------|------|--------|--------------|
| **AGHUse** | HCPA | GPL | Java EE, JBoss, PostgreSQL | Planned | Very active, 100+ units | Community only |
| **AGHU** | Ebserh | GPL | Java EE, JBoss, PostgreSQL | Active (2025) | Very active, 45 hospitals | Ebserh network |
| **Madre** | Basis TI | Custom EULA | Java, TypeScript, Docker | None | **Archived** (Feb 2025) | GitHub (archived) |
| **OpenSUS** | Community | Unknown | Unknown | Unknown | Limited info | Unknown |

**Madre** (https://github.com/BasisTI/madre) was a potential alternative but was **archived in February 2025** with only 14 stars and 28 contributors. It is no longer maintained.

---

## Key Contacts

- **HCPA Tech Transfer (NITT):** nitt@hcpa.edu.br
- **AGHUse Community Portal:** https://sites.google.com/hcpa.edu.br/aghuse/
- **HCPA Official:** https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse

---

## Sources

- [AGHUse Community Portal](https://sites.google.com/hcpa.edu.br/aghuse/sobre-o-aghuse)
- [HCPA AGHUse Institutional Page](https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse)
- [Ministry of Health Joins AGHUse Community](https://www.hcpa.edu.br/4125-ministerio-da-saude-e-o-mais-novo-integrante-da-comunidade-aghuse)
- [HCPA Technical Visit for AGHUse](https://www.hcpa.edu.br/4117-hcpa-recebe-visita-tecnica-para-apresentar-o-aghuse-sistema-que-transforma-a-gestao-hospitalar)
- [RS Health Secretariat Adopts AGHUse](https://www.hcpa.edu.br/3933-secretaria-da-saude-do-rs-fara-uso-de-sistema-de-gestao-criado-pelo-hospital-de-clinicas-de-porto-alegre)
- [Brazilian Army AGHUse Agreement](https://www.hcpa.edu.br/3794-exercito-brasileiro-firma-acordo-para-ampliar-utilizacao-do-aghuse)
- [HCPA Trains Accredited Companies](https://www.hcpa.edu.br/3829-hcpa-capacita-empresas-credenciadas-a-implantar-o-sistema-aghuse)
- [Army Visits HCPA for AGHUse](https://www.hcpa.edu.br/3403-comitiva-do-exercito-brasileiro-visita-o-clinicas-para-acelerar-implantacao-do-aghuse)
- [Bahia Policlinicas AGHUse Deployment](https://www.saude.ba.gov.br/2024/11/04/policlinicas-de-salvador-comecam-a-utilizar-o-aghuse/)
- [Bahia Digital Health Leadership](https://www.saude.ba.gov.br/2024/08/30/bahia-lidera-transformacao-digital-da-saude-publica-no-brasil-com-assinatura-de-protocolo-de-intencoes-pioneiro/)
- [Paraiba AGHUse Deployment](https://paraiba.pb.gov.br/diretas/saude/noticias/paraiba-avanca-na-implantacao-do-sistema-aghuse-que-garante-modernizacao-e-maior-eficiencia-na-gestao-em-saude)
- [Unicamp AGHUse Adoption](https://hc.unicamp.br/newsite_noticia_389_aghuse-sera-adotado-em-unidades-assistenciais-da-unicamp/)
- [Unicamp AWS Migration Case Study](https://aws.amazon.com/pt/blogs/aws-brasil/case-de-sucesso-como-a-unicamp-construiu-uma-arquitetura-resiliente-e-migrou-o-aghuse-para-a-aws/)
- [AGHU Ebserh Platform Page](https://www.gov.br/ebserh/pt-br/governanca/plataformas-e-tecnologias/aghu)
- [AGHU SUS Digital Integration (SBIS)](https://sbis.org.br/noticia/aghu-sistema-certificado-pela-sbis-e-integrado-ao-sus-digital-e-fortalece-o-prontuario-unico-do-cidadao/)
- [AGHU SUS Digital Integration (Ebserh)](https://www.gov.br/ebserh/pt-br/comunicacao/noticias/aghu-se-integra-ao-sus-digital-e-fortalece-o-prontuario-unico-do-cidadao)
- [Ebserh AGHU v11 Launch (SBIS)](https://sbis.org.br/noticia/ebserh-lanca-nova-versao-do-aplicativo-de-gestao-para-hospitais-universitarios-em-parceira-com-a-sbis-e-a-rnp/)
- [CONASS Technical Note 05/2023](https://www.conass.org.br/biblioteca/wp-content/uploads/2024/09/NT-05-2023-software-hospitalar.pdf)
- [Ministry of Health AGHU Expansion](https://www.gov.br/saude/pt-br/assuntos/noticias/2024/fevereiro/hospitais-e-servicos-especializados-do-sus-poderao-aderir-ao-sistema-eletronico-aghu)
- [AGHU ENAP Case Study](https://repositorio.enap.gov.br/bitstream/1/4075/1/AGHU%20%20Modelo%20de%20Gest%C3%A3o%20do%20HCPA%20Inovando%20a%20Assist%C3%AAncia%20%C3%A0%20Sa%C3%BAde.pdf)
- [NITT AGHUse Technology Showcase](https://sites.google.com/hcpa.edu.br/nitt/vitrine-tecnologica/aghuse-sistema-de-gestao-em-saude)
- [Madre GitHub Repository (Archived)](https://github.com/BasisTI/madre)
- [Brazilian Air Force HCA AGHUse](https://www2.fab.mil.br/hca/index.php/slideshow/301-implantacao-do-sistema-aghuse-no-hca)
- [DATASUS AGHU Public Call](https://datasus.saude.gov.br/ministerio-da-saude-faz-chamamento-publico-para-adesao-a-comunidade-do-aghu)
- [AGHU SBIS Certification](https://www.conass.org.br/aghu-recebe-certificacao-de-excelencia-da-sociedade-brasileira-de-informatica-em-saude/)
