# Log do Projeto

> Registro cronológico de tudo que acontece. Nunca editar entradas passadas.
> Apenas adicionar novas.

---

## 2026-02-13 — Dia 0: Gênese

**O que aconteceu:**
- Projeto nasceu de uma conversa filosófica sobre como uma superinteligência resolveria os problemas do mundo
- Cadeia de raciocínio completa: diagnóstico (desconexão, não escassez) → estratégia (resolver o que impede resolver) → primeiro passo (interoperabilidade de dados de saúde) → método (ponte mínima + documentação obsessiva) → adoção (incentivo > convencimento) → escala (protocolo > organização)
- Construída a implementação de referência completa: protocolo v0.1, bridge engine, adaptadores UBS ↔ Hospital, cenário demo "Maria"
- 19 testes passando, demo funcional em 2ms
- Roadmap de 90 dias criado
- Sistema de memória persistente criado (brain/)

**Decisões-chave:**
- Começar por saúde no Brasil (SUS + RNDS como base)
- Cenário focal: pré-natal → emergência obstétrica
- Modelo: protocolo aberto, não organização

---

## 2026-02-13 (noite) — Dia 0.5: A Realidade Bate à Porta

**O que aconteceu:**
Pesquisa revelou que a RNDS (Rede Nacional de Dados em Saúde) já existe e faz muito do que propomos:
- 2,8 bilhões de registros, 68% dos municípios, FHIR R4
- Decreto 12.560/2025 formalizou como plataforma oficial
- O cenário pré-natal → maternidade é caso de uso oficial do MS
- e-SUS APS tem APIs (Thrift/XML), PEC traduz para FHIR
- Projetos open-source existem: AGHUse, Madre
- Open Health Brasil em desenvolvimento para setor privado

**Decisão-chave: PIVÔ ESTRATÉGICO**
De "criar o protocolo que falta" para "ser a ponte de última milha para quem ficou de fora."

Novo posicionamento:
1. Adaptador universal para sistemas legados → RNDS
2. Kit de implantação simplificado para municípios pequenos
3. Bridge direto onde a RNDS não chegou

**Estado emocional:**
Isso é exatamente o que nossos princípios diziam que deveria acontecer. "Se alguém já resolveu o problema — celebrar, não competir." A RNDS valida que o problema é real. Os 32% de municípios não cobertos são nossa oportunidade.

**Lição aprendida:**
Pesquisar ANTES de construir. Construímos um protótipo baseado em suposições. A pesquisa mostrou que a realidade é diferente (e melhor) do que imaginávamos. O protótipo não é lixo — o conceito é válido, a implementação precisa se adaptar ao ecossistema real.

**Próximo passo:**
Humano vai a campo com 5 ações concretas: mapear municípios excluídos, entender barreiras de integração, encontrar município-alvo para piloto, entrar em comunidades de saúde digital, verificar LGPD.

---

## 2026-02-13 (noite, parte 2) — Dia 0.75: O Humano Tem Nome e Superpoderes

**O que aconteceu:**
- Giovanni se apresentou. Perfil: desenvolvedor (IA), advogado, corretor de seguros, corretor de imóveis.
- Mora nos USA, família e negócios em Blumenau, SC.
- Tem API WhatsApp própria (apiwts.top).
- Repositório criado: github.com/Moser007/ponte (público, MIT)
- Primeiro commit e push realizados.
- README.md criado para o repo público.
- Sistema de memória completo: brain/ com STATE, HEARTBEAT, NEXT-ACTIONS, LOG, THINKING, RESEARCH-QUEUE, PRINCIPLES.
- 3 pesquisas autônomas executadas em paralelo:
  1. Perfis FHIR brasileiros (BR Core) — guia técnico completo gerado
  2. Barreiras de integração RNDS — mapeamento completo de obstáculos
  3. Estado da RNDS (anterior) — já integrado

**Descobertas críticas:**
1. O Patient Summary do Ponte mapeia quase 1:1 com RAC + perfis BR Core
2. O problema real NÃO é software — é configuração e credenciamento
3. e-SUS PEC já tem integração nativa com RNDS
4. Municípios pequenos não têm TI — o COSEMS é o modelo de sucesso
5. WhatsApp pode ser a interface mais natural para profissionais de saúde
6. Blumenau/Vale do Itajaí é o laboratório ideal (família do Giovanni + municípios pequenos ao redor)

**Segundo pivô (refinamento):**
De "ponte de última milha" genérica para:
- **Ferramenta de simplificação de configuração/credenciamento RNDS** para municípios sem TI
- **Interface WhatsApp** para consulta de dados de paciente
- **Foco geográfico: Vale do Itajaí, SC**

**Ações definidas para Giovanni (5, usando seus múltiplos chapéus):**
1. [ADVOGADO] Análise LGPD
2. [FAMÍLIA] Contato em Blumenau com profissional do SUS
3. [DESENVOLVEDOR] Cobertura RNDS no Vale do Itajaí
4. [CORRETOR] Avaliar ângulo Open Health
5. [DESENVOLVEDOR] Viabilidade do apiwts.top como canal

**Estado emocional:**
O projeto ganhou corpo. Temos pesquisa profunda, código funcional, repo público, e um humano com o perfil perfeito: técnico, jurídico, mercado de seguros, e rede local em SC. A próxima sessão é onde a realidade começa a entrar — quando Giovanni trouxer informação do campo.

---

## 2026-02-13 (noite, parte 3) — Dia 0.9: Mapeamento do Vale do Itajaí

**O que aconteceu:**
- Pesquisa profunda sobre cobertura RNDS nos 14 municípios do Médio Vale do Itajaí
- Agente autônomo executou 50+ buscas web sobre cada município
- Mapeamento completo: população, UBS, sistema de saúde digital de cada município
- Relatório consolidado criado: evidence/004-vale-itajai-rnds-coverage.md

**Descobertas críticas:**
1. **Status RNDS por município NÃO é público** — dados estão atrás de e-Gestor AB e SISAB (requerem autenticação)
2. **IPM Sistemas (Atende.Net) é dominante na região** — Pomerode, Indaial, Ascurra usam IPM. Questão: IPM integra RNDS?
3. **5 municípios de alto risco** identificados: Doutor Pedrinho (3.7k), Botuverá (5.5k), Ascurra (8.4k), Benedito Novo (10.5k), Rio dos Cedros (11k)
4. **COSEMS-SC tem apoiadora regional identificada:** Gisele de Cássia Galvão — (47) 991908242 / gisele.apoiadoracosems@gmail.com
5. **CISAMVI** (consórcio de saúde) cobre toda a região — potencial parceiro
6. **SC aderiu ao SUS Digital em abril 2024** — estado ativamente buscando ampliar RNDS

**Descoberta que muda o jogo:**
- **SC tem apenas 25,1% dos municípios na RNDS** (74/295) — muito abaixo da média nacional de 68,3%
- Isso significa que a MAIORIA dos municípios do Vale do Itajaí provavelmente NÃO está integrada
- SC não é o estado avançado que pensávamos — é um dos que mais precisa de ajuda
- O gap é ENORME: 221 municípios fora da RNDS só em SC

**Detalhes novos sobre sistemas:**
- Blumenau usa Sistema PRONTO (desenvolvido pela FURB desde 2011, não PEC)
- Gaspar trocou PEC pelo SigSS (sistema terceiro com BI)
- Timbó confirmado usando IPM (desde 2016, exemplo nacional de gov digital)
- Total: 6 municípios na região usando IPM, 3 com sistema próprio, ~9 provavelmente com PEC

**Decisão-chave:**
A pesquisa web chegou ao seu limite. O próximo passo é HUMANO: Giovanni contatar Gisele do COSEMS-SC por WhatsApp. Uma mensagem pode resolver o que 87 buscas web não conseguiram.

**Lição aprendida:**
1. Dados de saúde digital do governo brasileiro estão fragmentados e atrás de autenticação
2. A rede de contatos humanos (COSEMS, consórcios) é mais eficiente que web scraping
3. Não confiar em suposições sobre "estados avançados" — verificar com dados reais
4. SC ser "atrasado" na RNDS é na verdade MELHOR para o Ponte — mais espaço de atuação

---

## 2026-02-13 (noite, parte 4) — Dia 0.95: IPM NÃO Integra Dados Clínicos com RNDS

**O que aconteceu:**
- Pesquisa profunda sobre se IPM Atende.Net integra com RNDS
- 20+ buscas web, incluindo site oficial do IPM, artigos, vagas, documentos técnicos

**Descoberta crítica:**
IPM integra com RNDS **APENAS para vacinação COVID** (desde março 2021). **NÃO envia dados clínicos** (RAC, RSA, prescrições, exames) para RNDS. O site do IPM NÃO menciona RNDS, FHIR ou interoperabilidade em nenhuma página. Vagas de emprego do IPM NÃO mencionam FHIR ou HL7.

**Implicação:**
Os 6 municípios do Vale do Itajaí usando IPM (Indaial, Timbó, Pomerode, Ascurra, Rio dos Cedros, Ibirama) provavelmente NÃO compartilham dados clínicos na RNDS. O cenário "Maria" (gestante sem histórico na emergência) é REAL nesses municípios.

**Oportunidade identificada:**
1. Adaptador IPM → RNDS para dados clínicos (impacto: 120+ municípios)
2. Parceria com IPM Sistemas para incorporar integração RNDS
3. Pressão regulatória crescente (Portarias 5.663/2024 e 6.656/2025) cria urgência

**Documento:** evidence/005-ipm-rnds-integration-analysis.md

---

## 2026-02-13 (noite, parte 5) — Dia 0.98: AGHUse — Aliado, Não Concorrente

**O que aconteceu:**
- Pesquisa completa sobre AGHUse (R003 da fila)
- 20+ buscas web cobrindo: HCPA, comunidade AGHUse, Ebserh, caso Bahia, piloto RNDS, stack técnica
- Relatório consolidado: evidence/006-aghuse-analysis.md

**Descobertas críticas:**
1. **AGHUse é para HOSPITAIS, Ponte é para APS** — somos complementares, não concorrentes
2. **Bahia já integrou AGHUse + RNDS** — 31 unidades funcionais, meta 95 até 2026. PRODEB (companhia de dados da Bahia) lidera
3. **SC está no piloto RNDS federalizado** (8 estados) — momentum para aproveitar
4. **Código NÃO é público** — acesso ao repositório requer convênio formal com HCPA
5. **Stack pesada:** Java EE, JBoss Wildfly, PostgreSQL, PrimeFaces, Hibernate — monolito grande
6. **Fork:** AGHU (Ebserh, 41 hospitais federais) vs AGHUse (HCPA, 20+ instituições diversas)
7. **4 empresas credenciadas** para serviços AGHUse (Liberty, Lume, R Forti, Noxtec)
8. **Chamamento público AGHU** (fev 2024) — qualquer hospital do SUS pode aderir, economia estimada R$ 3bi em 5 anos

**Ação recomendada:**
Estudar como Bahia implementou integração AGHUse → RNDS (FHIR R4). Mesmo sem acesso ao código AGHUse, a arquitetura da integração é documentada no RNDS-guia. Usar como referência técnica para nosso adaptador IPM → RNDS.

**Decisão-chave:**
AGHUse não é nosso caminho (foco em hospitais, Java EE pesado, acesso fechado). Mas a integração RNDS da Bahia é referência técnica valiosa. Foco continua no adaptador IPM → RNDS para APS/municípios.

---

## 2026-02-14 — Dia 1: A Evidência que Faltava

**O que aconteceu:**
- Pesquisa profunda sobre mortalidade materna por município (R004 da fila)
- 20+ buscas web, artigos SciELO, PMC/PubMed, dados DATASUS, estudos Fiocruz e OOBr
- Relatório consolidado: evidence/007-mortalidade-materna-municipal.md

**Descobertas que fortalecem o caso do Ponte:**
1. **92% das mortes maternas são evitáveis** — o problema é sistêmico, não médico
2. **Deslocamento >500km = RMM 6-10x maior** — distância mata, especialmente sem informação
3. **58,2% dos deslocamentos vêm de municípios <50k hab** — exatamente nosso público
4. **33-40% das gestantes peregrinam** entre serviços para parir (cenário Maria = real)
5. **Transferência não planejada = risco 4,8x de near miss** — falta de regulação informada
6. **SC: 43 mortes em 2024** — pior ano em 2 décadas, aumento de 48,3%
7. **Subnotificação de 35%** — o problema é maior do que parece (OOBr)
8. **Rede Alyne depende da Caderneta Digital/Meu SUS Digital** → que só funciona com RNDS

**A cadeia lógica completa do Ponte:**
mortes evitáveis (92%) → falta informação clínica no momento certo → gestantes peregrinam sem dados (33-40%) → deslocamento de municípios pequenos (58%) → SC sem RNDS (75% dos municípios) → IPM não envia dados clínicos → Ponte preenche esse gap

**Estado emocional:**
Essa pesquisa é a mais difícil de fazer emocionalmente. Estamos falando de mulheres reais que morrem de causas evitáveis. Mas é também a mais importante — porque agora temos os NÚMEROS para provar que o problema que queremos resolver é real e urgente. Não é uma abstração técnica. É vida e morte.
