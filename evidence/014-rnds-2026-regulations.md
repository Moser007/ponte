# R015 — Regulamentações e Novidades RNDS Janeiro-Fevereiro 2026

> Pesquisa realizada em 2026-02-14
> Escopo: Regulamentações, portarias, notícias sobre RNDS/SUS Digital/FHIR R4 publicadas em 2025-2026

---

## 1. Novas Portarias, Decretos e Resoluções (2025-2026)

### Decreto 12.560/2025 (23 de julho de 2025) — MARCO REGULATÓRIO
O decreto presidencial mais importante para o projeto Ponte. Formaliza a RNDS como **política de Estado** (não apenas programa de governo):

- **RNDS = plataforma oficial** de interoperabilidade do ecossistema de dados do SUS
- **CPF = chave única** de identificação em todos os registros de saúde
- **Obrigatório:** Estados, DF e municípios devem enviar dados à RNDS conforme modelos informacionais publicados pelo MS
- **Governança** coordenada pelo MS com instâncias formais (CIT — Comissão Intergestores Tripartite)
- **LGPD aplicada:** parâmetros mínimos de segurança da informação obrigatórios
- **3 plataformas SUS Digital formalizadas:**
  - Meu SUS Digital (cidadão) — 59M downloads, 29M usuários/mês
  - SUS Digital Profissional (profissionais de saúde)
  - SUS Digital Gestor (gestores públicos)
- **Números atuais da RNDS:** 2,8 bilhões de registros clínicos, 3.805 municípios (68,3%) enviando dados regularmente

**Fonte:** https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12560.htm

### Portaria GM/MS 5.663/2024 (31 de outubro de 2024)
Centraliza TODOS os registros de vacinação na RNDS:

- **Exclusividade RNDS:** Todos os sistemas de registro de vacinação devem enviar dados de doses aplicadas exclusivamente à RNDS
- **Modelo RIA** (Registro de Imunobiológico Aplicado) obrigatório
- **DESCONTINUAÇÃO DO APACHE THRIFT:** Integração via e-SUS LEDI APS usando Apache Thrift ou XML descontinuada para dados de vacinas
- **Prazo de transmissão:** 24h para salas com conectividade; 15 dias para salas sem internet
- **Sistemas autorizados:** PEC, CDS ou sistemas terceiros integrados com RNDS
- **Liberdade de escolha:** Municípios podem usar qualquer sistema compatível com RNDS

**Fonte:** https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt5663_04_11_2024.html

### Portaria GM/MS 6.656/2025 (7 de março de 2025)
Obriga envio de dados de **regulação assistencial** à RNDS:

- **Dados obrigatórios:** Filas de espera, solicitações de procedimentos, encaminhamentos para atenção especializada
- **Modelo MIRA** (Modelo de Informação da Regulação Assistencial) obrigatório
- **Frequência:** Envio DIÁRIO à RNDS, com informações atualizadas até o dia anterior
- **Consequência do descumprimento:** Impedimento de adesão a programas de cirurgias eletivas do MS
- **Sistemas afetados:** SISREG (envio automático), e-SUS Regulação (substitui SISREG), sistemas próprios (responsabilidade do gestor)
- **Prazo:** Plano operativo em 30 dias definirá prazos específicos por estado/município
- **Registros físicos** devem ser digitalizados e migrados para sistemas eletrônicos

**Fonte:** https://bvsms.saude.gov.br/bvs/saudelegis/gm/2025/prt6656_10_03_2025.html

### Portaria GM/MS 7.495/2025 (4 de agosto de 2025)
Institui o Componente SUS Digital do Programa **"Agora Tem Especialistas"**:

- **Integração RNDS obrigatória** para dados de regulação e produção assistencial
- **Telessaúde integrada:** Todos os registros de telessaúde devem ser enviados à RNDS de forma obrigatória e padronizada
- **Interoperabilidade exigida:** Sistemas estaduais, municipais e do DF devem ser interoperáveis e integrados com a RNDS
- **Catálogo Nacional de Telemedicina** estruturado por modalidades
- **Objetivo:** Reduzir tempo de espera por atendimento especializado

**Fonte:** https://www.conass.org.br/conass-informa-n-136-2025-publicada-a-portaria-gm-n-7495-que-dispoe-sobre-o-componente-sus-digital-do-programa-agora-tem-especialistas-no-ambito-do-sistema-unico-de-saude-sus/

### Portarias GM/MS 8.025 e 8.026/2025 (27 de agosto de 2025)
Instituem modelos de informação na RNDS:

- **8.025:** Modelo de Informação do **Sumário de Alta Obstétrico (SAO)** — DIRETAMENTE relevante para o cenário Maria/pré-natal
- **8.026:** Modelo de Informação do **Sumário de Alta (SA)** — complementa o RAC que já construímos

**Fonte:** https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/legislacao

### Portaria GM/MS 10.192/2026 (5 de fevereiro de 2026)
Primeira portaria de 2026 com impacto em saúde digital:

- Altera registros de informações de produção de CEOs e LRPD (odontologia)
- **Prioriza o PEC** (Prontuário Eletrônico do Cidadão) por garantir maior detalhamento e integração com RNDS
- Extingue uso do BPA para CEOs e Laboratórios de Prótese no âmbito do Brasil Sorridente

**Fonte:** https://p2saude.com.br/brasil-sorridente-digital-nova-portaria-extingue-uso-do-bpa-para-ceos-e-laboratorios-de-protese/

---

## 2. IPM Sistemas e FHIR/RNDS

### Status atual (fev/2026)
- **Nenhuma menção pública** a FHIR, RNDS ou interoperabilidade no site do IPM (ipm.com.br)
- IPM continua se posicionando como "govtech #1 do Brasil" e "solução premiada para cidades inteligentes"
- O módulo de saúde (Atende.Net Saúde) continua 100% cloud
- **Vagas de emprego** do IPM NÃO mencionam FHIR ou HL7 (confirmado em pesquisas anteriores)
- **Sem comunicados** sobre integração RNDS para dados clínicos

### Pressão regulatória sobre o IPM
A pressão é ENORME e crescente:
1. **Portaria 5.663/2024:** Apache Thrift descontinuado para vacinação — IPM precisa migrar para FHIR
2. **Portaria 6.656/2025:** Dados de regulação devem ir à RNDS diariamente — municípios IPM precisam cumprir
3. **Portaria 7.495/2025:** Sistemas devem ser interoperáveis com RNDS — IPM não tem escolha
4. **Decreto 12.560/2025:** RNDS é política de Estado — não é mais opcional
5. **Portaria 8.025/2025:** SAO (Sumário de Alta Obstétrico) na RNDS — gestantes que usam municípios IPM precisam ter dados acessíveis

### Implicação para o Ponte
O IPM está numa posição cada vez mais insustentável. A cada nova portaria, a pressão para integrar com RNDS via FHIR R4 aumenta. O Ponte como adaptador IPM → RNDS tem uma janela de oportunidade clara: oferecer uma solução antes que o IPM implemente a sua própria (se implementar).

---

## 3. COSEMS-SC e RNDS em 2026

### Oficinas de Expansão SUS Digital (agosto 2024)
- **28-29 de agosto de 2024:** Oficinas online de expansão da RNDS em SC
- Dia 1: Municípios com **sistemas terceiros** (IPM, etc.) — integração à RNDS
- Dia 2: Municípios com e-SUS PEC — integração à RNDS
- **Status na época:** Apenas 74 municípios (25,1%) conectados à RNDS
- **Parceria:** CGIIS/DATASUS/SEIDIGI, SEMS/SC, CONASEMS, COSEMS/SC, SES/SC

### 10o Congresso COSEMS-SC — Chapecó, 11-13 março 2026
- **Sessão confirmada:** "SUS Digital e a qualificação da Atenção Primária em municípios de pequeno porte em Santa Catarina" (12/mar, 8:30-10:00)
- Outros temas: redes de atenção à saúde, cobertura vacinal, saúde indígena, gestão financeira
- **Inscrições:** R$ 250 (1o lote até 19/fev) / R$ 300 (2o lote até 13/mar)
- **Contato:** congresso@cosemssc.org.br | (48) 3364-4003

### Implicação para o Ponte
O congresso de Chapecó (março 2026) é uma **oportunidade concreta** para Giovanni:
1. Participar da sessão sobre SUS Digital em municípios pequenos
2. Apresentar o Ponte como solução para municípios com sistemas terceiros
3. Fazer contato direto com gestores municipais e técnicos do COSEMS-SC
4. Mapear demanda real por adaptadores IPM → RNDS

---

## 4. Open Health Brasil (Saúde Suplementar)

### Status em fevereiro 2026
- **Open Health NÃO saiu do papel.** Continua sendo conceito/relatório.
- O MS e ANS publicaram relatório em agosto/2022 prevendo implantação, mas progresso é mínimo
- **Horizonte:** ANS projeta integração de dados para Open Health até **2028**
- **Sem consulta pública** específica aberta em jan-fev/2026
- **Sem portaria ou decreto** regulamentando Open Health em 2025-2026

### Barreiras identificadas
1. **Padronização de dados:** Cada instituição usa seu próprio dicionário (medicamentos, exames, procedimentos)
2. **Resistência do mercado:** Operadoras e hospitais relutam em compartilhar dados
3. **Fragmentação regulatória:** ANS e MS não têm regulação unificada (diferente do Open Finance/BC)
4. **Segurança da informação:** Dados sensíveis de saúde exigem protocolos robustos
5. **Falta de incentivos claros** para adesão dos players de mercado

### RN ANS 649/2025
- Entra em vigor em **julho de 2026**
- Moderniza o arcabouço regulatório das autogestões
- Não é especificamente sobre Open Health, mas faz parte da modernização do setor

### Perspectivas 2026 para saúde suplementar
- Setor projeta ano **desafiador** para 53 milhões de beneficiários
- 49,2% das operadoras com resultado operacional negativo (315 de 640)
- 8,65 milhões de beneficiários em operadoras com resultado negativo
- ANS adiou discussões estruturais (reajuste coletivos, copagamento, planos segmentados) para depois de 2026
- Foco em sustentabilidade, IA, coordenação do cuidado e atenção primária

### Implicação para o Ponte
O Open Health é irrelevante para o Ponte no curto prazo (2026). Nosso foco é o SUS público e a RNDS. Se Open Health avançar (2028+), poderemos expandir o adaptador para interoperar com saúde suplementar, mas isso está longe.

---

## 5. Prazos de Integração RNDS para Municípios

### Prazos já em vigor
| Portaria | O que | Prazo |
|----------|-------|-------|
| 5.663/2024 | Vacinação via FHIR/RNDS (Thrift descontinuado) | **Setembro 2025** (já venceu) |
| 6.656/2025 | Regulação assistencial (MIRA) diária à RNDS | **30 dias** para plano operativo; envio diário |
| 7.495/2025 | Sistemas interoperáveis com RNDS (Agora Tem Especialistas) | Imediato para aderentes ao programa |
| 8.025-8.026/2025 | SA e SAO na RNDS | Publicação dos modelos (implementação gradual) |
| 12.560/2025 (Decreto) | Todos os dados conforme modelos informacionais à RNDS | Conforme publicação de cada modelo pelo MS |

### Cronograma de Federalização RNDS
- **Fase 1 (estados):** Prevista para conclusão até **meados de 2026**
- **Fase 2 (municípios):** Inicia após conclusão da Fase 1
- **4a Oficina Nacional:** Fevereiro 2026 em Belém/PA (domínio: Comunicação)
- **Duração total estimada:** ~2 anos desde o início do processo
- **4 eixos de trabalho:** Institucional, Governança, Informação/Informática, Comunicação

### Status dos estados
- **21 estados + DF** integrados
- **3 em implantação:** São Paulo, Sergipe, Rio Grande do Norte
- **2 a iniciar em breve:** Minas Gerais, Mato Grosso do Sul
- **SC:** Já integrado ao nível estadual, mas apenas 25,1% dos municípios conectados

### Implicação para o Ponte
A federalização municipal da RNDS (Fase 2) começará em 2026-2027. Isso criará uma **onda de demanda** por soluções de integração em municípios pequenos. O Ponte precisa estar pronto antes dessa onda chegar.

---

## 6. Status da Descontinuação do Apache Thrift

### Decisão
A **Portaria 5.663/2024** determinou a descontinuação da integração via Apache Thrift e XML para dados de vacinação no e-SUS LEDI APS.

### Prazo
**Setembro de 2025** — Thrift não é mais aceito para envio de dados de imunização.

### Status atual (fev/2026)
- O prazo de setembro/2025 **já venceu**
- Não foram encontradas notícias sobre prorrogação do prazo
- Não foram encontradas notícias sobre status de cumprimento pelos municípios
- O modelo RIA (FHIR R4) é agora o único caminho aceito para dados de vacinação
- **Sistemas terceiros** (como IPM) que usavam Thrift/XML para enviar dados de vacinação precisaram migrar ou estão em desconformidade

### Escopo da descontinuação
- **Confirmado:** Vacinação (dados de imunobiológicos aplicados)
- **Não confirmado:** Outros domínios de dados (RAC, prescrições, exames). A migração Thrift → FHIR parece estar acontecendo domínio por domínio
- O e-SUS PEC continua usando Thrift para outros tipos de dados (APS/SISAB), mas a tendência é migração total para FHIR

### Implicação para o Ponte
A descontinuação do Thrift para vacinação é o **primeiro dominó**. À medida que outros domínios migrem para FHIR R4 exclusivo, sistemas como IPM que dependem de Thrift/XML ficarão cada vez mais defasados. O Ponte se posiciona perfeitamente nessa transição.

---

## Resumo Executivo

### O cenário regulatório favorece FORTEMENTE o Ponte:

1. **Decreto 12.560/2025** tornou a RNDS política de Estado — não há volta atrás
2. **5 portarias** em 12 meses (out/2024 a ago/2025) expandiram domínios obrigatórios na RNDS
3. **Apache Thrift** já foi descontinuado para vacinação (set/2025) — FHIR R4 é o único caminho
4. **Federalização municipal** começa em 2026-2027 — onda de demanda iminente
5. **IPM** não mostra sinais públicos de migração para FHIR — oportunidade para o Ponte
6. **COSEMS-SC Congresso em Chapecó (março 2026)** — oportunidade concreta de apresentação
7. **Portaria 8.025 (SAO)** — Sumário de Alta Obstétrico na RNDS, diretamente relevante para cenário Maria
8. **Open Health** parado — não compete com o Ponte no curto prazo

### Riscos identificados:
1. IPM pode anunciar integração FHIR própria a qualquer momento (sem sinais até agora)
2. Prazo Thrift pode ter sido prorrogado silenciosamente (sem evidências)
3. Federalização municipal pode atrasar (estimativa de 2 anos é otimista)
4. Portaria 10.192/2026 (odontologia) mostra que o MS continua expandindo o PEC como padrão — pode reduzir a base de sistemas terceiros

---

## Fontes Principais

- Decreto 12.560/2025: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12560.htm
- Portaria 5.663/2024: https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt5663_04_11_2024.html
- Portaria 6.656/2025: https://bvsms.saude.gov.br/bvs/saudelegis/gm/2025/prt6656_10_03_2025.html
- Portaria 7.495/2025: https://www.conass.org.br/conass-informa-n-136-2025-publicada-a-portaria-gm-n-7495/
- Legislação RNDS: https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/legislacao
- COSEMS-SC Oficinas: https://www.cosemssc.org.br/oficinas-de-expansao-do-sus-digital-profissional/
- COSEMS-SC Congresso 2026: https://congresso.cosemssc.org.br/
- SBIS sobre Decreto: https://sbis.org.br/noticia/governo-institui-rnds-como-base-de-dados-do-sus-e-define-cpf-como-chave-unica-em-saude/
- COSEMS-SP Thrift: https://www.cosemssp.org.br/noticias/sistemas-de-vacinacao-deverao-estar-integrados-a-rnds-ate-setembro/
- Federalização RNDS: https://www.saude.pr.gov.br/Noticia/Parana-participa-da-3a-Oficina-da-Federalizacao-da-RNDS
- Open Health: https://medicinasa.com.br/open-health-brasil/
- CNseg Saúde 2026: https://cnseg.org.br/noticias/saude-suplementar-projeta-2026-desafiador-mas-com-potencial-de-avancos-para-53-milhoes-de-beneficiarios
