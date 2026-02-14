# R009 — Esquema Real do Banco PostgreSQL do IPM Atende.Net (Módulo Saúde)

> Pesquisa executada em 2026-02-14
> Ponte (pesquisa autônoma #9)

---

## 1. Resumo Executivo

**Pergunta central:** Qual é a estrutura real das tabelas do módulo de saúde do IPM Atende.Net?

**Resposta:** O schema interno do banco PostgreSQL do IPM Atende.Net **NÃO é público**. O IPM é um sistema proprietário, fechado, hospedado em nuvem (SaaS), e não expõe documentação de banco de dados, API pública, ou SDK para o módulo de saúde. A wiki técnica (wiki.ipm.com.br) requer autenticação de cliente. Não encontramos NENHUM repositório GitHub, blog, vaga de emprego, ou documento público que revele nomes de tabelas, colunas, ou relacionamentos do banco.

**O que CONSEGUIMOS inferir:**
1. **Stack tecnológico confirmado:** PHP + PostgreSQL + AJAX + JavaScript + HTML/CSS, hospedado em datacenter próprio (Tier III)
2. **O modelo de dados obrigatório:** O IPM DEVE seguir o modelo LEDI (Layout e-SUS de Dados e Interface) para exportar dados ao e-SUS/SISAB. Este modelo é 100% documentado publicamente (UFSC) e define TODOS os campos que o IPM precisa armazenar
3. **Módulos do sistema:** Cadastro Único (paciente), Prontuário Multiprofissional (SOAP), Agendamento, Farmácia, Vacinação, Exames/Laboratório, Faturamento (SIGTAP/BPA), Vigilância, ACS (Agente Comunitário)
4. **Integração RNDS:** ATUALIZAÇÃO CRÍTICA — Novas portarias de 2024-2025 (5.663, 6.656, 7.495) e o Decreto 12.560/2025 estão FORÇANDO todos os sistemas (incluindo IPM) a integrar com RNDS via FHIR R4. O IPM hoje só envia vacinação. A pressão regulatória é ENORME e crescente.

---

## 2. O que foi encontrado sobre o Schema/Tabelas

### 2.1 Nenhum schema direto encontrado

Após 40+ buscas web, NÃO encontramos:
- Documentação de tabelas do IPM
- Dicionário de dados do IPM
- ERD (Entity Relationship Diagram)
- SQL schema dumps
- Repositórios GitHub com código que acesse o banco IPM (módulo saúde)
- Vagas de DBA que mencionem tabelas específicas
- Screenshots que revelem nomes de campos internos

**Motivos:**
- IPM é SaaS 100% cloud — clientes não têm acesso ao banco
- Wiki técnica (wiki.ipm.com.br) requer login de cliente
- Não há API pública ou SDK para saúde
- O código é proprietário e fechado

### 2.2 O modelo LEDI como proxy do schema

**Descoberta-chave:** O IPM é obrigado a exportar dados para o e-SUS/SISAB usando o modelo LEDI (Layout e-SUS de Dados e Interface). Isso significa que o banco do IPM NECESSARIAMENTE contém TODOS os campos definidos no LEDI, ou campos equivalentes que possam ser mapeados para o LEDI.

O modelo LEDI é documentado publicamente em: https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/

#### Fichas LEDI relevantes para o adaptador Ponte:

**Ficha de Cadastro Individual (FCI) — equivalente ao nosso IpmPaciente:**
| Campo LEDI | Tipo | Obrigatório | Equivalente Ponte |
|------------|------|-------------|-------------------|
| cpfCidadao | String(11) | Condicional | cpf |
| cnsCidadao | String(15) | Condicional | cns |
| nomeCidadao | String(3-70) | Sim | nome |
| dataNascimentoCidadao | Long (Epoch ms) | Sim | data_nascimento |
| sexoCidadao | Long (código) | Sim | sexo |
| racaCorCidadao | Long (código) | Sim | raca_cor |
| nomeSocial | String(0-70) | Não | — (falta no Ponte) |
| emailCidadao | String(6-100) | Não | — |
| telefoneCelular | String(10-11) | Condicional | telefone |
| codigoIbgeMunicipioNascimento | String(7) | Condicional | municipio_ibge |
| nacionalidadeCidadao | Long | Sim | — (falta no Ponte) |
| etnia | Long | Condicional | — (falta no Ponte) |
| nomeMaeCidadao | String(3-70) | Condicional | — |
| nomePaiCidadao | String(3-70) | Condicional | — |
| microarea | String(2) | Não | — |
| cnsResponsavelFamiliar | String(15) | Não | — |

**Condições de Saúde (CondicoesDeSaude — dentro do FCI):**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| statusTemDiabetes | Boolean | Marcador de diabetes |
| statusTemHipertensaoArterial | Boolean | Marcador de hipertensão |
| statusEhGestante | Boolean | Marcador de gestação |
| maternidadeDeReferencia | String(0-100) | Nome da maternidade de referência |
| statusEhFumante | Boolean | Marcador de tabagismo |
| statusTeveInfarto | Boolean | Marcador de infarto prévio |
| statusTeveAvcDerrame | Boolean | Marcador de AVC |
| statusTemDoencaRespiratoria | Boolean | Marcador de doença respiratória |
| statusTemTuberculose | Boolean | Marcador de tuberculose |
| statusTemHanseniase | Boolean | Marcador de hanseníase |
| statusDiagnosticoMental | Boolean | Marcador de diagnóstico de saúde mental |
| statusEhDependenteAlcool | Boolean | Marcador de dependência de álcool |
| statusEhDependenteOutrasDrogas | Boolean | Marcador de dependência de outras drogas |
| statusTeveInternadoem12Meses | Boolean | Internação nos últimos 12 meses |
| doencaCardiaca | List(Long) | Códigos de doença cardíaca (até 3) |
| doencaRespiratoria | List(Long) | Códigos de doença respiratória (até 4) |
| doencaRins | List(Long) | Códigos de doença renal (até 3) |

**Ficha de Atendimento Individual (FAI) — equivalente ao nosso IpmAtendimento + IpmProblema + IpmSinalVital + IpmMedicamento:**

**Dados do Atendimento:**
| Campo LEDI | Tipo | Equivalente Ponte |
|------------|------|-------------------|
| numeroProntuario | String(30) | atendimento.id (?) |
| cnsCidadao | String(15) | paciente.cns |
| cpfCidadao | String(11) | paciente.cpf |
| dataNascimento | Long (Epoch ms) | paciente.data_nascimento |
| sexo | Long (código) | paciente.sexo |
| dataHoraInicialAtendimento | Long (Epoch ms) | atendimento.data_inicio |
| dataHoraFinalAtendimento | Long (Epoch ms) | atendimento.data_fim |
| localDeAtendimento | Long (código 1-10) | — (falta no Ponte) |
| turno | Long (código) | — (falta no Ponte) |
| tipoAtendimento | Long (1,2,4,5,6) | atendimento.tipo |

**Dados Obstétricos:**
| Campo LEDI | Tipo | Equivalente Ponte |
|------------|------|-------------------|
| dumDaGestante | Long (Epoch ms) | — (FALTA NO PONTE — CRÍTICO!) |
| idadeGestacional | Integer (1-42 semanas) | sinal_vital.semanas_gestacionais |
| stGravidezPlanejada | Boolean | — |
| nuGestasPrevias | Integer (0-2) | — |
| nuPartos | Integer (0-2) | — |
| aleitamentoMaterno | Long (código) | — |

**Medições (Sinais Vitais) — campo `medicoes` na FAI:**
| Campo LEDI | Tipo | Equivalente Ponte |
|------------|------|-------------------|
| pressaoArterialSistolica | Integer (0-999) | sinal_vital.pa_sistolica |
| pressaoArterialDiastolica | Integer (0-999) | sinal_vital.pa_diastolica |
| peso | Double (0.5-500 kg) | sinal_vital.peso |
| altura | Double (20-250 cm) | sinal_vital.altura |
| temperatura | Double (20.0-45.0°C) | sinal_vital.temperatura |
| frequenciaCardiaca | Integer (0-999) | sinal_vital.freq_cardiaca |
| frequenciaRespiratoria | Integer (0-200) | sinal_vital.freq_respiratoria |
| saturacaoO2 | Integer (0-100) | sinal_vital.saturacao_o2 |
| glicemiaCapilar | Integer (0-800) | — (falta no Ponte) |
| tipoGlicemiaCapilar | Long (0-3) | — |
| circunferenciaAbdominal | Double (0-99999) | — |
| perimetroCefalico | Double (10-200) | — |
| perimetroPanturrilha | Double (10-99) | — |

**Problemas e Condições (campo `problemasCondicoes` na FAI):**
| Campo LEDI | Tipo | Equivalente Ponte |
|------------|------|-------------------|
| ciap | String | — (FALTA NO PONTE — IPM pode usar CIAP2!) |
| cid10 | String | problema.cid |
| situacao | String (0-2) | problema.ativo (mapeamento necessário) |
| dataInicioProblema | Long (Epoch ms) | problema.data_inicio |
| dataFimProblema | Long (Epoch ms) | — |
| uuidProblema | String(44) | — |
| isAvaliado | Boolean | — |

**Medicamentos (campo `Medicamentos` na FAI):**
| Campo LEDI | Tipo | Equivalente Ponte |
|------------|------|-------------------|
| codigoCatmat | String(20) | — (FALTA NO PONTE — IPM usa código CATMAT!) |
| viaAdministracao | Integer (código) | — |
| dose | String(100) | medicamento.dosagem |
| doseUnica | Boolean | — |
| usoContinuo | Boolean | — |
| doseFrequenciaTipo | Integer (1-3) | — |
| doseFrequencia | Integer | medicamento.posologia (parcial) |
| dtInicioTratamento | Long (Epoch ms) | medicamento.data_inicio |
| duracaoTratamento | Integer | — |
| quantidadeReceitada | Integer (1-999) | — |

**Encaminhamentos (campo `Encaminhamentos` na FAI):**
| Campo LEDI | Tipo | Descrição |
|------------|------|-----------|
| especialidade | Integer (1-62) | Código da especialidade |
| hipoteseDiagnosticoCID10 | String | CID10 do encaminhamento |
| hipoteseDiagnosticoCIAP2 | String | CIAP2 do encaminhamento |
| classificacaoRisco | Integer | Classificação de risco |

**Exames e Resultados:**
| Campo LEDI | Tipo | Descrição |
|------------|------|-----------|
| codigoExame | String | Código SIGTAP ou AB |
| solicitadoAvaliado | List(String) | Solicitado e/ou Avaliado |
| dataSolicitacao | Long (Epoch ms) | Data da solicitação |
| dataRealizacao | Long (Epoch ms) | Data de realização |
| resultadoExame | List | Resultados estruturados |

### 2.3 Módulos do sistema inferidos de fontes públicas

Do site ipm.com.br e artigos públicos, os seguintes módulos de saúde existem:

| Módulo | Descrição | Dados gerenciados |
|--------|-----------|-------------------|
| **Cadastro Único** | Registro unificado de cidadãos | Dados demográficos, CPF, CNS, endereço |
| **Prontuário Eletrônico Multiprofissional** | Registro clínico (SOAP) | Subjetivo, Objetivo, Avaliação, Plano — 78+ especialidades |
| **Agendamento** | Consultas, exames, procedimentos | Agenda por profissional, lista de espera, autoagendamento |
| **Farmácia** | Dispensação de medicamentos | Estoque, distribuição, HORUS/Qualifar |
| **Vacinação** | Imunizações | Registro de doses, caderneta digital, integração SI-PNI/RNDS |
| **Laboratório** | Exames laboratoriais | Solicitação, coleta, resultado, integração PACS |
| **Faturamento** | Produção SUS | BPA-C, BPA-I, SIGTAP, SIA |
| **Vigilância Epidemiológica** | Notificações | SINAN, doenças de notificação compulsória |
| **ACS (App)** | Visitas domiciliares | Geolocalização, fichas CDS, modo offline |
| **Regulação** | Encaminhamentos | Fila de espera, classificação de risco |
| **Fila de Atendimento** | Gestão de filas | Classificação de risco, triagem, acolhimento |
| **BI/Indicadores** | Business Intelligence | Dashboards, relatórios, indicadores Previne Brasil |
| **Dara (IA)** | Inteligência artificial | Predição de doenças (diabetes, infarto, AVC), planejamento |

---

## 3. O que foi encontrado sobre integração RNDS — ATUALIZAÇÃO CRÍTICA

### 3.1 Status atual do IPM com RNDS (fevereiro 2026)

| Item | Status | Evidência |
|------|--------|-----------|
| Vacinação COVID → RNDS | SIM (desde março 2021) | Artigo IPM, SI-PNI |
| Vacinação rotina → RNDS | PROVÁVEL (obrigatório desde Portaria 5.663/2024) | Pressão regulatória |
| RAC (dados clínicos) → RNDS | NÃO HÁ EVIDÊNCIA | Site IPM não menciona |
| RSA (alta hospitalar) → RNDS | NÃO HÁ EVIDÊNCIA | Site IPM não menciona |
| Regulação → RNDS | DESCONHECIDO (obrigatório desde Portaria 6.656/2025) | Prazo em definição |
| FHIR R4 nativo | NÃO HÁ EVIDÊNCIA | Nenhuma vaga, artigo ou menção |
| API pública para saúde | NÃO EXISTE | Apenas SOAP para módulo atuarial (RH) |

### 3.2 Pressão regulatória crescente (NOVO — 2024-2025)

**Este é o achado mais importante desta pesquisa atualizada:**

| Regulamento | Data | Exigência | Prazo | Impacto para IPM |
|-------------|------|-----------|-------|-------------------|
| **Portaria 5.663/2024** | Out/2024 | Vacinação exclusivamente via RNDS. Apache Thrift DESCONTINUADO para vacinas | 120 dias | IPM precisa migrar de Thrift para FHIR R4 para vacinação |
| **Portaria 6.656/2025** | Mar/2025 | Regulação assistencial → RNDS obrigatório. Dados via MIRA (FHIR) | Plano Operativo tripartite (30 dias) | IPM precisa enviar encaminhamentos/regulação via FHIR |
| **Decreto 12.560/2025** | Jul/2025 | RNDS = plataforma oficial do SUS. CPF como identificador nacional | Imediato | IPM DEVE integrar com RNDS ou ficar fora do ecossistema |
| **Portaria 7.495/2025** | Ago/2025 | SUS Digital no "Agora Tem Especialistas". Interoperabilidade com RNDS obrigatória | Plano Operativo | Municípios IPM sem RNDS perdem acesso a programas federais |
| **Portaria SEIDIGI 7/2025** | Out/2025 | Chamamento público SUS Digital Telessaúde — exige fluxos RNDS | Editais | Reforça obrigatoriedade |

**Consequência crítica:** A Portaria 5.663/2024 descontinua o Apache Thrift para dados de vacinação. Isso significa que o mecanismo que o IPM usa hoje (Thrift → e-SUS → SISAB) está sendo SUBSTITUÍDO por FHIR R4 → RNDS. O IPM VAI PRECISAR implementar FHIR R4 cedo ou tarde.

### 3.3 Descontinuação do Thrift — deadline se aproxima

O formato Apache Thrift para envio de dados de imunização será descontinuado a partir de **setembro de 2025** (conforme Portaria 5.663/2024 + notas técnicas DATASUS). Isso força TODOS os sistemas terceiros, incluindo IPM, a migrar para integração FHIR R4 direta com a RNDS.

**Implicações para o Ponte:**
1. Se o IPM implementar FHIR R4 para vacinação, o passo seguinte (RAC, regulação) fica mais fácil
2. Se o IPM NÃO implementar a tempo, haverá uma janela onde o Ponte pode servir como bridge temporário
3. De qualquer forma, a migração Thrift → FHIR é inevitável — isso VALIDA nossa abordagem

---

## 4. Descrições de Formulários que Revelam Campos

### 4.1 Portal do Cidadão (demonstracao.atende.net)

Os serviços de saúde visíveis no portal do cidadão incluem:
- Consultas médicas (agendamento, consultas agendadas, fila de espera, consultas realizadas)
- Atendimentos (enfermagem, multiprofissional, odontológico)
- Medicamentos disponíveis e em uso
- Vacinas aplicadas / atrasadas / pendentes
- Resultados de exames
- Visitas domiciliares

### 4.2 Prontuário Eletrônico (SOAP)

O prontuário do IPM usa o método SOAP:
- **S (Subjetivo):** Relato do paciente
- **O (Objetivo):** Exame físico, sinais vitais, exames laboratoriais
- **A (Avaliação):** Diagnóstico (CID-10, CIAP-2), hipóteses
- **P (Plano):** Condutas, prescrições, encaminhamentos

### 4.3 App ACS (Atende.Net ACS)

O aplicativo para Agentes Comunitários de Saúde inclui:
- Registro de visitas domiciliares com geolocalização
- Gerenciamento de famílias, domicílios e integrantes
- Funcionamento offline
- Filtro por data no mapa
- Sincronização com o sistema central

### 4.4 Dara (IA)

A IA do IPM (lançada maio 2023) pode predizer:
- Prognóstico de diabetes (até 3 anos antes)
- Risco de infarto
- Risco de AVC
- Planejamento de demanda de infraestrutura

Isso indica que o banco de dados do IPM contém dados históricos suficientes para machine learning, incluindo possivelmente: séries temporais de sinais vitais, diagnósticos, medicamentos, exames laboratoriais, e dados sociodemográficos.

---

## 5. Tecnologias Confirmadas

| Tecnologia | Status | Fonte |
|-----------|--------|-------|
| **PHP** | CONFIRMADO | Vagas de emprego ("conhecimentos em PHP e sua estrutura") |
| **PostgreSQL** | CONFIRMADO | LinkedIn de desenvolvedor IPM ("MySQL e PostgreSQL") |
| **MySQL** | TAMBÉM USADO | LinkedIn de desenvolvedor IPM |
| **JavaScript** | CONFIRMADO | Vagas + código público do portal |
| **HTML/CSS** | CONFIRMADO | Vagas + código público |
| **AJAX** | CONFIRMADO | LinkedIn de desenvolvedor Full Stack IPM |
| **Cloud (100% SaaS)** | CONFIRMADO | Site IPM, artigos |
| **Datacenter Tier III** | CONFIRMADO | Site IPM |
| **Vue.js** | PROVÁVEL | Código fonte do portal do cidadão |
| **Apache Thrift** | CONFIRMADO (para e-SUS) | Modelo LEDI, artigos |
| **XML** | CONFIRMADO (para e-SUS) | Modelo LEDI, artigos |
| **SOAP (webservices)** | CONFIRMADO (módulo atuarial) | GitHub nfephp-org/Atende |
| **FHIR R4** | NÃO CONFIRMADO | Nenhuma evidência |
| **Java** | NÃO CONFIRMADO para IPM | Não mencionado em vagas IPM |

**Nota sobre o banco:** Desenvolvedores IPM no LinkedIn mencionam tanto PostgreSQL quanto MySQL. É possível que diferentes módulos usem diferentes bancos, ou que houve migração ao longo dos 26 anos da empresa.

---

## 6. Fontes Consultadas

### Sites oficiais do IPM
- [IPM Saúde](https://www.ipm.com.br/saude/)
- [IPM Sistemas](https://www.ipm.com.br/)
- [IPM Soluções Atende.Net](https://www.ipm.com.br/solucoes/atende-net/)
- [IPM Vigilância](https://www.ipm.com.br/vigilancia/)
- [IPM Carreiras](https://www.ipm.com.br/carreiras/)
- [IPM Dara IA](https://www.ipm.com.br/dara/)
- [IPM Vacina COVID](https://www.ipm.com.br/noticias/vacina-contra-covid-19-tecnologia-ipm-esta-integrada-ao-ministerio-da-saude/)
- [IPM Arapongas](https://www.ipm.com.br/noticias/arapongas-implanta-ipm-saude-para-integrar-dados-e-reduzir-gastos/)
- [IPM Cascavel](https://www.ipm.com.br/prontuario-eletronico-agiliza-atendimento-e-reduz-uso-de-papel-em-cascavel-pr/)
- [IPM Marechal Cândido Rondon](https://www.ipm.com.br/blog/saude/marechal-candido-rondon-comemora-vantagens-de-cadastro-unico-e-prontuario-medico-eletronico/)
- [IPM Panambi ACS](https://www.ipm.com.br/noticias/panambi-rs-saude-uso-do-atende-net-acs/)
- [IPM ACATE](https://www.acate.com.br/noticias/ipm-sistemas-completa-20-anos-e-consolida-tecnologia-para-gestao-publica/)
- [IPM NIC.br](https://nic.br/noticia/na-midia/ipm-sistemas-cria-solucoes-para-prefeituras-verdadeiramente-digitais/)
- [Wiki IPM](https://wiki.ipm.com.br/) (requer login)
- [Wiki Araucária](https://wiki.araucaria.pr.gov.br/books/ipm-atendenet) (timeout)

### Portais de municípios
- [Demonstração IPM](https://demonstracao.atende.net/)
- [Castro IPM Saúde](https://castro.atende.net/saude/)
- [Cascavel IPM](https://cascavel.atende.net/)
- [Arapongas IPM Saúde](https://arapongas.atende.net/subportal/saude)
- [Araucária Manuais](https://araucaria.atende.net/subportal/saude/pagina/manuais-ipm-saude)

### Modelo LEDI (e-SUS APS)
- [LEDI - Dicionário FAI (Ficha de Atendimento Individual)](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fai.html)
- [LEDI - Dicionário FCI (Ficha de Cadastro Individual)](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fci.html)
- [LEDI - Integração e-SUS APS (UFSC)](https://integracao.esusab.ufsc.br/)

### Regulamentação (portarias e decretos)
- [Portaria 5.663/2024](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt5663_04_11_2024.html) — vacinação → RNDS
- [Portaria 6.656/2025](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2025/prt6656_10_03_2025.html) — regulação → RNDS
- [Decreto 12.560/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12560.htm) — RNDS plataforma oficial
- [Portaria 7.495/2025](https://mtdsistemas.com.br/suporte/publico/portarias/749504082025.pdf) — SUS Digital "Agora Tem Especialistas"
- [Portaria SEIDIGI 7/2025](https://bvsms.saude.gov.br/bvs/saudelegis/seidigi/2025/prt0007_16_10_2025.html) — Telessaúde/RNDS
- [Nota Técnica DATASUS - Sistemas Próprios](https://www.cevs.rs.gov.br/upload/arquivos/202404/29095847-nota-tecnica-conjunta-datasus-envio-de-dados-para-a-rnds-de-sistemas-proprios.pdf)

### RNDS
- [RNDS Portal](https://www.gov.br/saude/pt-br/composicao/seidigi/rnds)
- [RNDS FHIR](https://rnds-fhir.saude.gov.br/)
- [RNDS Guia](https://rnds-guia.saude.gov.br/)
- [Modelo RAC](https://rnds-guia.saude.gov.br/docs/rac/mi-rac/)
- [Manual de Integração Barramento](https://datasus.saude.gov.br/wp-content/uploads/2020/04/SOA-RNDS_ManualIntegracaoBarramento_vSite.pdf)

### LinkedIn e vagas
- [IPM Sistemas LinkedIn](https://br.linkedin.com/company/ipmsistemas)
- [Leonardo Pereira (Full Stack Developer IPM - PHP, PostgreSQL)](https://www.zoominfo.com/p/Leonardo-Pereira/13601478176)
- [Augusto Rustick (PHP Backend Developer IPM)](https://www.zoominfo.com/p/Augusto-Rustick/10191334940)
- [Jean Rothenburg (Web Developer IPM - MySQL, PostgreSQL)](https://www.zoominfo.com/p/Jean-Rothenburg/10633222843)
- [IPM vagas LinkedIn](https://br.linkedin.com/jobs/ipm-sistemas-vagas)
- [IPM vagas Infojobs](https://www.infojobs.com.br/ipm-sistemas/vagas)

### GitHub
- [nfephp-org/Atende (PHP SOAP para módulo atuarial)](https://github.com/nfephp-org/Atende) — NÃO é módulo saúde
- [atende/postgresql (Docker)](https://github.com/atende/postgresql) — NÃO é do IPM

### Outros
- [COSEMS-SP - RNDS e Imunização](https://www.cosemssp.org.br/wp-content/uploads/2024/09/APRESENTACAO-JOSE-RNDS.pdf)
- [COSEMS-SC - Integração PEC a RNDS](https://www.cosemssc.org.br/wp-content/uploads/2022/09/Integracao-PEC-e-SUS-a-RNDS.pdf)
- [COSEMS-ES - Expansão RNDS](https://www.cosemses.org.br/wp-content/uploads/2025/02/Apresentacao_ES_Expansao-RNDS.pdf)
- [Tecnospeed - Documentação Padrão IPM](https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360008410074) (NFe, não saúde)

---

## 7. Nível de Confiança das Informações

| Informação | Confiança | Justificativa |
|-----------|-----------|---------------|
| IPM usa PHP + PostgreSQL | ALTA (90%) | Confirmado por perfis LinkedIn de desenvolvedores |
| IPM exporta para e-SUS via Thrift/XML | ALTA (95%) | Site IPM + modelo LEDI |
| IPM integra vacinação com RNDS | ALTA (95%) | Artigo oficial IPM |
| IPM NÃO envia RAC/dados clínicos para RNDS | ALTA (85%) | Ausência total de evidência no site, vagas, documentação |
| Modelo LEDI define campos mínimos do banco IPM | ALTA (90%) | Obrigação legal — SISAB exige esses campos |
| IPM NÃO tem API pública para saúde | ALTA (85%) | Nenhuma evidência encontrada |
| IPM NÃO gera FHIR R4 nativamente | MÉDIA-ALTA (80%) | Nenhuma menção em vagas ou site, mas pode estar em desenvolvimento |
| Portarias 2024-2025 forçam integração FHIR | ALTA (95%) | Textos oficiais das portarias confirmam |
| IPM será obrigado a migrar de Thrift para FHIR | ALTA (90%) | Portaria 5.663/2024 descontinua Thrift para vacinas |
| Schema real do banco IPM | NENHUMA (0%) | Não encontrado em fontes públicas |

---

## 8. Recomendações para o Projeto Ponte

### 8.1 Estratégia para obter o schema real

O schema do banco do IPM NÃO será encontrado por pesquisa web. As opções são:

1. **Contato direto com município cliente do IPM (MAIS VIÁVEL)**
   - Giovanni contata a Secretaria de Saúde de Timbó, Indaial, ou Pomerode (municípios que usam IPM no Vale do Itajaí)
   - Pergunta: "É possível acessar os dados do prontuário eletrônico para fins de integração com a RNDS?"
   - Se o município tem DBA ou TI, pode fornecer schema ou views do banco

2. **Contato direto com IPM Sistemas**
   - Sede: Florianópolis (admin) + Rio do Sul (tech center)
   - Email: datacenter@ipm.com.br
   - Pitch: "Somos projeto open-source que pode ajudar seus clientes a cumprir as portarias de integração RNDS"
   - Risco: IPM pode ver como concorrência e se fechar

3. **Acesso via wiki.ipm.com.br (requer credenciais de cliente)**
   - Se Giovanni conseguir contato em município cliente, pedir acesso temporário à wiki para documentação técnica
   - A wiki provavelmente tem documentação de integração

4. **Engenharia reversa (ÚLTIMO RECURSO)**
   - Se conseguirmos acesso de leitura ao banco de um município, mapear tabelas diretamente
   - Requer autorização do município e cuidado com LGPD

### 8.2 Usar o modelo LEDI como base para o adaptador

**Recomendação principal:** Em vez de esperar pelo schema real, usar o modelo LEDI como fonte de verdade. Justificativa:

1. O IPM PRECISA armazenar todos os campos do LEDI (senão não consegue exportar para e-SUS/SISAB)
2. O LEDI é documentado publicamente com dicionário de dados completo
3. Os campos LEDI mapeiam diretamente para os campos FHIR BR Core que usamos

**Ação técnica imediata:** Atualizar `src/types/ipm.ts` para incluir TODOS os campos do LEDI relevantes para o RAC:
- Adicionar CIAP-2 (além de CID-10) para condições
- Adicionar código CATMAT para medicamentos
- Adicionar DUM (data última menstruação) — CRÍTICO para pré-natal
- Adicionar campos de encaminhamento
- Adicionar resultados de exames estruturados
- Adicionar localDeAtendimento e turno
- Adicionar condições de saúde do cadastro individual (diabetes, hipertensão, gestação)

### 8.3 Estratégia dupla de acesso aos dados

Como o IPM é SaaS e os municípios não têm acesso direto ao banco, propor duas vias:

**Via A — Banco PostgreSQL direto (se possível):**
- O município solicita ao IPM um acesso de leitura (read replica ou views) ao banco
- O adaptador Ponte roda no servidor do município e lê os dados
- Mapeia para FHIR R4 e envia à RNDS

**Via B — Exportação LEDI como intermediário:**
- O IPM já exporta dados via Thrift/XML para o e-SUS
- O Ponte pode ler esses arquivos Thrift/XML e converter para FHIR R4
- Isso não requer NENHUM acesso ao banco do IPM
- Desvantagem: dados são em batch (não tempo real)

**Via C — API futura do IPM (longo prazo):**
- Se o IPM implementar API REST/FHIR própria, o Ponte se conecta via API
- Mais limpo e sustentável, mas depende do IPM

### 8.4 O timing é PERFEITO

A pressão regulatória de 2024-2025 cria uma janela de oportunidade para o Ponte:

1. **Thrift sendo descontinuado (set/2025)** → IPM precisa migrar para FHIR R4 para vacinação
2. **Regulação → RNDS obrigatório (Portaria 6.656/2025)** → IPM precisa enviar dados de encaminhamento
3. **Decreto 12.560/2025** → RNDS é plataforma oficial do SUS — sem RNDS, sem ecossistema
4. **Portaria 7.495/2025** → Municípios sem RNDS perdem acesso a programas federais

O IPM vai PRECISAR resolver isso. Se resolverem internamente, ótimo — os municípios se beneficiam. Se não resolverem a tempo, o Ponte é a solução. De qualquer forma, ter o adaptador pronto ANTES é estratégico.

### 8.5 Gaps identificados no nosso adapter/src/types/ipm.ts

Comparando nosso `IpmPaciente`, `IpmAtendimento`, etc. com o modelo LEDI:

| Campo que FALTA no Ponte | Importância | Onde adicionar |
|--------------------------|-------------|----------------|
| CIAP-2 (além de CID-10) | ALTA | IpmProblema |
| Código CATMAT (medicamento) | ALTA | IpmMedicamento |
| DUM (data última menstruação) | CRÍTICA para pré-natal | IpmAtendimento ou novo tipo |
| Gestas prévias / Partos | MÉDIA | IpmAtendimento |
| Gravidez planejada | BAIXA | IpmAtendimento |
| Glicemia capilar | MÉDIA | IpmSinalVital |
| Local de atendimento (código) | MÉDIA | IpmAtendimento |
| Turno | BAIXA | IpmAtendimento |
| Encaminhamentos | ALTA | Novo tipo IpmEncaminhamento |
| Exames + resultados | ALTA | Novo tipo IpmExame |
| Via de administração medicamento | MÉDIA | IpmMedicamento |
| Uso contínuo/dose única | MÉDIA | IpmMedicamento |
| Nome social | MÉDIA | IpmPaciente |
| Etnia (para indígenas) | MÉDIA | IpmPaciente |
| Nacionalidade | BAIXA | IpmPaciente |
| Nome da mãe | MÉDIA | IpmPaciente |
| Condições de saúde (booleans) | ALTA | Novo tipo ou dentro de IpmPaciente |
| Maternidade de referência | ALTA para pré-natal | IpmPaciente |
| IVCF (vulnerabilidade idoso) | BAIXA (fora do escopo) | — |

---

## 9. Conclusão

O schema real do banco PostgreSQL do IPM Atende.Net permanece desconhecido e inacessível por pesquisa web. Porém, esta pesquisa revelou algo possivelmente mais valioso: **o modelo LEDI é o blueprint do que o IPM armazena**, porque é obrigatório para exportação ao e-SUS/SISAB. Além disso, a pressão regulatória de 2024-2025 está acelerando dramaticamente a necessidade de integração FHIR R4, validando completamente a estratégia do Ponte.

**Próximos passos imediatos:**
1. Atualizar `src/types/ipm.ts` com campos LEDI faltantes (DUM, CIAP, CATMAT, encaminhamentos)
2. Giovanni contatar município cliente do IPM no Vale do Itajaí para explorar acesso ao banco
3. Giovanni contatar IPM Sistemas diretamente propondo parceria
4. Avaliar Via B (ler exportação LEDI/Thrift como alternativa ao acesso direto ao banco)
