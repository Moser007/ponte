# Fila de Pesquisa Autônoma

> Pesquisas que devo executar proativamente a cada ativação,
> independentemente de o humano ter trazido algo novo.
> Após executar, mover para a seção "Concluídas" com resultado.

---

## Pendentes (executar na ordem)

### R009 — Esquema real do banco PostgreSQL do IPM Atende.Net
**Objetivo:** Descobrir a estrutura real das tabelas do módulo de saúde do IPM Atende.Net. Nosso `src/types/ipm.ts` tem interfaces baseadas em suposições a partir do demo.js. Precisamos das tabelas reais: nomes, colunas, tipos, relacionamentos.
**Método:** Pesquisa web por documentação técnica, manuais, screenshots de tabelas, vagas de DBA do IPM, qualquer pista sobre o schema.
**Prioridade:** Alta — sem isso não podemos implementar o DataSource real.

### R010 — Processo de credenciamento RNDS para homologação
**Objetivo:** Entender passo-a-passo como obter acesso ao ambiente de homologação da RNDS. Quais formulários, quanto tempo demora, o que precisa ter pronto.
**Método:** Pesquisar portal DATASUS, guia de integração, relatos de desenvolvedores que já fizeram.
**Prioridade:** Média — necessário antes de substituir o stub de auth.

### R011 — Validação do Bundle RAC com HL7 FHIR Validator
**Objetivo:** Validar nosso Bundle gerado contra os perfis BR Core usando o validador oficial HL7 (Java CLI). Identificar campos faltantes ou incorretos.
**Método:** Baixar validator_cli.jar, rodar contra o JSON gerado pela demo, analisar erros.
**Prioridade:** Média — qualidade do Bundle antes de enviar à RNDS real.

---

## Concluídas

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
