# Fila de Pesquisa Autônoma

> Pesquisas que devo executar proativamente a cada ativação,
> independentemente de o humano ter trazido algo novo.
> Após executar, mover para a seção "Concluídas" com resultado.

---

## Pendentes (executar na ordem)

### R016 — Pesquisar modelo SAO (Sumário de Alta Obstétrico) da Portaria 8.025/2025
**Por que:** A Portaria 8.025/2025 instituiu o SAO na RNDS — diretamente relevante para cenário Maria (pré-natal → maternidade → alta). O Ponte deveria gerar SAO além do RAC.
**O que fazer:** Pesquisar o modelo informacional do SAO, perfis FHIR associados, seções obrigatórias, e avaliar implementação no adaptador.
**Fontes:** gov.br/saude/seidigi/rnds/legislacao, hl7.org.br/fhir/core, terminologia.saude.gov.br
**Depende de:** Nada — pode ser feito autonomamente.

### R017 — Preparar one-pager / pitch do Ponte para Congresso COSEMS-SC
**Por que:** 10o Congresso COSEMS-SC em Chapecó, 11-13 março 2026. Sessão: "SUS Digital e APS em municípios de pequeno porte em SC". Inscrição R$ 250 (até 19/fev) / R$ 300 (até 13/mar). Giovanni precisa de material pronto.
**O que fazer:** Criar documento Markdown conciso (1-2 páginas) com: problema (75% de SC fora da RNDS), solução (adaptador IPM → RNDS), status (145 testes, 18 entries Bundle RAC conforme BR Core), pedido (município piloto), regulação (Decreto 12.560, Portaria 7.495, 8.025), contato.
**Depende de:** Nada — pode ser feito autonomamente.

### R018 — Pesquisar formato LEDI/Thrift para implementar Via B do adaptador
**Por que:** A Via B (ler exportação LEDI que o IPM já gera para o e-SUS) não depende de acesso ao banco PostgreSQL. Se implementarmos um parser LEDI → FHIR, qualquer município com IPM pode usar o Ponte sem precisar de credenciais do banco.
**O que fazer:** Pesquisar documentação técnica do formato Thrift do e-SUS APS, estrutura dos arquivos LEDI exportados, e implementar parser TypeScript.
**Depende de:** Nada — documentação LEDI é pública.

---

## Concluídas

### R015 — Regulamentações e novidades RNDS janeiro-fevereiro 2026 (2026-02-14)
**Resultado:** Pesquisa abrangente sobre regulamentações RNDS/SUS Digital publicadas em 2025-2026. Marco regulatório: Decreto 12.560/2025 formalizou RNDS como política de Estado com CPF como chave única. 5 portarias em 12 meses expandiram domínios obrigatórios (vacinação, regulação, telessaúde, SA, SAO). Apache Thrift descontinuado para vacinação desde set/2025 (Portaria 5.663/2024). Portaria 6.656/2025 obriga envio diário de dados de regulação à RNDS. Portaria 7.495/2025 exige interoperabilidade RNDS no programa Agora Tem Especialistas. Portaria 8.025/2025 instituiu Sumário de Alta Obstétrico (SAO) na RNDS — diretamente relevante para cenário Maria. Federalização RNDS: Fase 1 (estados) até meados de 2026; Fase 2 (municípios) a seguir. 4a Oficina Nacional em fev/2026 em Belém/PA. IPM sem sinais de migração FHIR. COSEMS-SC Congresso em Chapecó 11-13/mar/2026 com sessão sobre SUS Digital em municípios pequenos. Open Health parado — sem regulamentação até 2028. Primeira portaria de 2026 (10.192, fev) prioriza PEC e integração RNDS para odontologia.
**Descoberta-chave:** Portaria 8.025/2025 (SAO) é um game-changer para o Ponte: o Sumário de Alta Obstétrico agora tem modelo de informação oficial na RNDS. Congresso COSEMS-SC em Chapecó (março 2026) é oportunidade concreta para Giovanni apresentar o Ponte. Federalização municipal em 2026-2027 criará onda de demanda.
**Documento:** evidence/014-rnds-2026-regulations.md

### R014 — Corrigir todos os problemas de conformidade do Bundle RAC (2026-02-14)
**Resultado:** Todos os 19 problemas identificados na R011 foram corrigidos nos builders TypeScript. URIs canônicos aplicados (CID-10 → terminologia.saude.gov.br, BRMedicamento → saude.gov.br/fhir/r4). Códigos CATMAT reais inseridos nos builders e mock data. MedicationStatement agora inclui coding BRMedicamento quando codigo_catmat presente. 3 novos testes adicionados. Total: 114 testes passando.
**Documento:** Correções aplicadas diretamente nos builders (condition.ts, allergy.ts, medication.ts, encounter.ts, organization.ts, composition.ts, patient.ts, rac-assembler.ts, mock-datasource.ts)

### R013 — Pesquisar códigos BRMedicamento para alergenos e CATMAT para medicamentos (2026-02-14)
**Resultado:** Códigos reais encontrados para todos os medicamentos e alérgenos do cenário Maria.
- **Penicilina (alergia):** `BR0270616U0118` — BENZILPENICILINA POTÁSSICA 5.000.000 UI, system `http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento`
- **Insulina NPH:** `BR0271157U0063` — INSULINA HUMANA NPH 100 UI/ML, mesmo system
- **Metildopa 250mg:** `BR0267689U0042` — METILDOPA 250 MG COMPRIMIDO, mesmo system
- **CID-10 system brasileiro:** `https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10` (NÃO usar o genérico `http://hl7.org/fhir/sid/icd-10` — binding required REJEITARIA)
- **BRAlergenosCBARA:** Códigos não disponíveis publicamente (content: not-present). Para penicilina como alérgeno, usar BRMedicamento (não CBARA).
- **BRObmCATMAT:** CodeSystem adicional (OBM/CATMAT) identificado, mas BRMedicamento é suficiente para nossos builders.
**Descoberta-chave:** O CodeSystem BRMedicamento usa códigos CATMAT com prefixo BR. O content é `not-present` no servidor oficial, mas a expansão completa está disponível no kyriosdata/rnds-ig. Para o cenário Maria, agora temos TODOS os códigos reais necessários. O CID-10 brasileiro usa URI próprio e o binding é required — nosso builder condition.ts precisa ser atualizado.
**Documento:** evidence/013-terminologia-codigos-br.md

### R012 — Corrigir 5 problemas CRÍTICOS do Bundle RAC (2026-02-14)
**Resultado:** Todas as 5 correções críticas aplicadas nos builders TypeScript. 111 testes passando.
- C1: Composition.identifier adicionado (system ponte + uuid)
- C2: Composition.attester adicionado (mode=professional, party=practitioner, time=date)
- C3: Patient CPF identifier com type=TAX e use=official adicionados
- C4: AllergyIntolerance.code.system corrigido de ValueSet para CodeSystem/BRMedicamento
- C5: AllergyIntolerance.code.coding.code adicionado (usando ipm.codigo ou substancia como fallback)
- IpmAlergia tipo atualizado com campo `codigo` opcional
**Documento:** Correções aplicadas diretamente nos builders (patient.ts, composition.ts, allergy.ts, ipm.ts)

### R011 — Validação do Bundle RAC com perfis BR Core (2026-02-14)
**Resultado:** Validação manual completa contra perfis BR Core (Java 8 disponível, mas validator requer 17+). Encontrados 19 problemas: 5 CRÍTICOS, 4 ALTOS, 6 MÉDIOS, 4 BAIXOS. Os 5 críticos são: (C1) Composition.identifier ausente, (C2) Composition.attester ausente, (C3) Patient.identifier CPF sem type=TAX e use=official, (C4) AllergyIntolerance.code.system aponta para ValueSet em vez de CodeSystem, (C5) AllergyIntolerance.code sem campo code. Nosso Bundle é significativamente mais completo que o exemplo oficial da RNDS (13 entries vs 4, 4 seções vs 1), mas tem gaps de conformidade técnica. Tempo estimado para corrigir críticos: ~50 min.
**Descoberta-chave:** O ValueSet BRAlergenos inclui 3 CodeSystems: BRMedicamento, BRImunobiologico, BRAlergenosCBARA. Para medicamentos alérgenos (penicilina), o system correto é `https://terminologia.saude.gov.br/fhir/CodeSystem/BRMedicamento`. O CID-10 brasileiro usa system `http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10` (não o genérico HL7). O perfil RAC exige identifier + attester que não estão nem no exemplo oficial simplificado.
**Documento:** evidence/012-bundle-rac-validation-r011.md

### R010 — Processo de credenciamento RNDS para homologação (2026-02-14)
**Resultado:** Pesquisa completa sobre o processo de credenciamento na RNDS. O credenciamento é EXCLUSIVO para estabelecimentos de saúde com CNES válido — NÃO para desenvolvedores independentes ou empresas de software. Processo em 2 fases: (1) homologação, (2) produção. Exige: certificado digital ICP-Brasil (e-CPF ou e-CNPJ, A1 ou A3), conta gov.br, CNES do estabelecimento, gestor cadastrado no CNES. Token de acesso via mTLS dura 30 min. Endpoints de homologação: ehr-auth-hmg.saude.gov.br e ehr-services.hmg.saude.gov.br. Produção por estado: sc-ehr-services.saude.gov.br. Evidências de homologação: screenshots PDF/PNG (max 10MB). DATASUS aprova em até 2 dias úteis. NÃO existe sandbox sem certificado ICP-Brasil. NÃO existe programa formal para desenvolvedores independentes.
**Descoberta-chave:** Giovanni NÃO PODE se credenciar diretamente (sem CNES). Precisa de município parceiro. O COSEMS-SC é o melhor caminho: já promove oficinas de integração RNDS, tem apoiadora regional no Médio Vale do Itajaí. A SBIS tem convênio com MS para ser elo entre RNDS e desenvolvedores. Certificado ICP-Brasil pode ser obtido nos EUA via videoconferência. Custo total: R$ 99-250 (apenas certificado). Prazo realista com município parceiro: 6-8 semanas.
**Documento:** evidence/011-rnds-credenciamento-homologacao.md

### R000 — Estado atual da RNDS (2026-02-13)
**Resultado:** RNDS existe, 2.8B registros, 68% cobertura, FHIR R4. Pivô necessário.
**Documento:** evidence/001-rnds-research.md

### R001 — Perfis FHIR brasileiros (2026-02-13)
**Resultado:** Guia técnico completo com todos os perfis BR Core (Patient, Condition, AllergyIntolerance, MedicationRequest, MedicationStatement, Encounter, Observation, VitalSigns), estrutura do RAC e SA, CodeSystems, ValueSets, extensões, fluxo de autenticação, endpoints da API, exemplo de Bundle RAC, checklist de desenvolvimento.
**Descoberta-chave:** Nosso Patient Summary mapeia quase 1:1 com uma combinação de RAC + perfis BR Core. A adaptação é viável.
**Documento:** evidence/003-rnds-fhir-technical-guide.md

### R002 — Barreiras de integração RNDS (2026-02-13)
**Resultado:** Pesquisa detalhada sobre barreiras técnicas, burocráticas, financeiras e de RH. 70,6% dos municípios têm <20k habitantes. Certificado ICP-Brasil é barreira histórica. Municípios pequenos não têm sequer 1 profissional de TI. e-SUS PEC já tem integração nativa — o problema é a CONFIGURAÇÃO, não a programação. COSEMS estaduais são o modelo de sucesso para apoio regional.
**Descoberta-chave:** O problema NÃO é construir software novo. É simplificar o processo de configuração e credenciamento para quem não tem TI.
**Documento:** evidence/002-barriers-research.md

### R007 — Cobertura RNDS no Vale do Itajaí (2026-02-13)
**Resultado:** Mapeamento completo dos 14 municípios do Médio Vale do Itajaí. Status RNDS por município não é público (requer autenticação e-Gestor AB/SISAB). IPM Sistemas (Atende.Net) é dominante na região. 5 municípios de alto risco identificados: Doutor Pedrinho, Botuverá, Ascurra, Benedito Novo, Rio dos Cedros. Apoiadora COSEMS-SC identificada: Gisele de Cássia Galvão (47) 991908242.
**Descoberta-chave:** Pesquisa web chegou ao limite. Próximo passo é contato humano com COSEMS-SC.
**Documento:** evidence/004-vale-itajai-rnds-coverage.md

### R008 — IPM Atende.Net e integração RNDS (2026-02-13)
**Resultado:** IPM integra com RNDS APENAS para vacinação COVID (desde março 2021). NÃO envia dados clínicos (RAC, RSA, prescrições, exames). Site do IPM NÃO menciona RNDS ou FHIR. Vagas de emprego NÃO pedem FHIR/HL7. IPM exporta para SISAB via Thrift/XML (e-SUS), que é diferente de RNDS (FHIR R4).
**Descoberta-chave:** 120+ municípios que usam IPM provavelmente NÃO compartilham dados clínicos na RNDS. Oportunidade enorme para adaptador IPM → RNDS.
**Documento:** evidence/005-ipm-rnds-integration-analysis.md

### R003 — AGHUse: código-fonte e comunidade (2026-02-13)
**Resultado:** AGHUse é sistema GPL de gestão hospitalar do HCPA (desde anos 1980). Stack: Java EE, JBoss Wildfly, PostgreSQL, PrimeFaces, Hibernate. Fork AGHU (Ebserh, 41 hospitais universitários) vs AGHUse (HCPA, 20+ instituições). Código NÃO é público — requer convênio formal com HCPA. Comunidade inclui UFRGS, UFRJ, Unicamp, Forças Armadas, SES-BA, SES-RS. 4 empresas credenciadas para serviços.
**Descoberta-chave:** Bahia já integra AGHUse + RNDS (31 unidades, meta 95 até 2026). PRODEB lidera. SC está no piloto RNDS federalizado (8 estados). AGHUse é ALIADO (hospitais), não concorrente (APS). Módulo FHIR da Bahia pode servir como referência técnica para nosso adaptador IPM → RNDS.
**Documento:** evidence/006-aghuse-analysis.md

### R004 — Mortalidade materna por município (2026-02-14)
**Resultado:** Pesquisa abrangente com dados do SIM/SINASC, estudos Fiocruz, OOBr, SciELO e PMC. 10.911 mortes maternas analisadas (2018-2023). 92% das mortes são evitáveis. Mulheres deslocadas >500km morrem 6-10x mais. 58,2% dos deslocamentos partem de municípios <50k hab. SC teve recorde de 43 mortes em 2024 (48,3% de aumento, pior ano em 2 décadas). 33-40% das gestantes peregrinam entre serviços. Transferência não planejada = risco 4,8x de near miss. Subnotificação de 35% (OOBr).
**Descoberta-chave:** A cadeia de evidências é poderosa: mortes evitáveis (92%) + peregrinação sem dados clínicos (33-40%) + deslocamento de municípios pequenos (58%) + SC sem RNDS (75%) + IPM sem dados clínicos na RNDS = o cenário Maria é REAL e está matando pessoas. A Rede Alyne depende da Caderneta Digital via Meu SUS Digital, que só funciona com RNDS. O Ponte é a peça que falta.
**Documento:** evidence/007-mortalidade-materna-municipal.md

### R005 — Experiências internacionais comparáveis (2026-02-14)
**Resultado:** Análise de 5 países: Ruanda (OpenMRS + RHIE/OpenHIM, 520 centros), Índia (ABDM, 834M+ ABHA IDs, arquitetura federada), Estônia (X-Road, 99% digitalização, 1.3M hab), Quênia (OpenHIE + KHIE, 100k agentes comunitários), Tailândia (UCS, smart card, 47M pessoas). Todos usam padrões abertos (FHIR), registros únicos de paciente, e camada de interoperabilidade antes de exigir sistemas específicos.
**Descoberta-chave:** Padrão de sucesso = adaptador/mediador leve (não reescrever sistemas), começar por fluxos prioritários (vacinação, pré-natal), garantir offline capability, medir uso real (não só habilitação). Brasil tem vantagem: 265k agentes comunitários de saúde. Continuidade do cuidado reduz mortalidade materna em 26% (meta-análise). Fracassos comuns: subestimar complexidade sociotécnica, falta de engajamento local, infraestrutura inadequada na última milha.
**Documento:** evidence/008-experiencias-internacionais.md

### R006 — Landscape de ferramentas FHIR open-source (2026-02-14)
**Resultado:** Análise de 10+ ferramentas FHIR: HAPI FHIR (Java, padrão-ouro mas pesado), Firely (.NET), Medplum (TypeScript, Apache 2.0, 5k+ stars), fhir.js, node-fhir-server-core, Aidbox (comercial), IBM FHIR, validadores. Descoberta crítica: biblioteca `rnds` npm (kyriosdata, v0.2.4) — wrapper Node.js para a API da RNDS já existe!
**Descoberta-chave:** Stack recomendado para o Ponte: `@medplum/core` + `@medplum/fhirtypes` (construção/validação FHIR R4, zero dependências) + `fhirpath` (expressões FHIRPath) + `pg` (PostgreSQL para ler IPM). Apenas 4 dependências de produção. mTLS via `https.Agent` nativo do Node.js. Não precisamos de servidor FHIR completo — apenas adaptador unidirecional IPM → FHIR → RNDS.
**Documento:** evidence/009-fhir-tools-landscape.md

### R009 — Esquema real do banco PostgreSQL do IPM Atende.Net (2026-02-14)
**Resultado:** Schema real do banco IPM é PRIVADO e inacessível via pesquisa web. Sistema é SaaS 100% cloud, sem API pública, sem SDK, wiki requer login de cliente. PORÉM: (1) Stack confirmado: PHP + PostgreSQL + AJAX + JS, (2) Modelo LEDI do e-SUS define TODOS os campos obrigatórios que o IPM deve armazenar — documentado publicamente pela UFSC, (3) Módulos identificados: Cadastro Único, Prontuário SOAP (78+ especialidades), Agendamento, Farmácia, Vacinação, Lab, Faturamento SIGTAP, Vigilância, ACS, Regulação, BI, Dara IA, (4) DESCOBERTA CRÍTICA ATUALIZADA: Portarias 5.663/2024, 6.656/2025, Decreto 12.560/2025, Portaria 7.495/2025 estão FORÇANDO integração FHIR R4 com RNDS. Apache Thrift sendo descontinuado para vacinas (set/2025). IPM VAI PRECISAR implementar FHIR.
**Descoberta-chave:** O modelo LEDI é o proxy perfeito para o schema IPM. Comparação com nosso `src/types/ipm.ts` revelou 15+ campos faltantes críticos: DUM (data última menstruação), CIAP-2, código CATMAT, encaminhamentos, resultados de exames, condições de saúde, nome social, etc. Pressão regulatória cria janela de oportunidade perfeita para o Ponte.
**Documento:** evidence/010-ipm-schema-research.md
