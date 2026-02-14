# 009 - Landscape de Ferramentas FHIR Open-Source para o Projeto Ponte

**Data:** 2026-02-13
**Objetivo:** Mapear o ecossistema de ferramentas FHIR open-source disponíveis para construir o adaptador IPM Atende.Net --> RNDS do Projeto Ponte.

---

## Sumario Executivo

Este relatorio analisa as principais ferramentas FHIR open-source disponiveis para o Projeto Ponte, que visa construir um adaptador entre o sistema IPM Atende.Net (usado em municipios do Vale do Itajai) e a RNDS (Rede Nacional de Dados em Saude). A analise cobre servidores FHIR, bibliotecas cliente, SDKs, plataformas completas, ferramentas de validacao e recursos especificos para o Brasil. A recomendacao final privilegia o stack Node.js do projeto, a necessidade de leveza para municipios com infraestrutura minima e a compatibilidade com licenca MIT.

---

## 1. HAPI FHIR (Java)

### 1.1 Arquitetura e Funcionalidades

O HAPI FHIR e a implementacao FHIR open-source mais madura e amplamente utilizada no mundo. Desenvolvido em Java, e um produto da Smile Digital Health e foi originalmente criado na University Health Network (UHN) do Canada.

**Componentes principais:**
- **HAPI FHIR JPA Server:** Servidor FHIR completo com banco de dados relacional (Hibernate/JPA). Oferece schema proprio, storage e retrieval sem necessidade de codificacao adicional. Usa uma unica tabela para corpos de recursos (armazenados como CLOBs, opcionalmente GZipped) e tabelas auxiliares para indices de busca, tags e historico.
- **HAPI FHIR Plain Server:** Modulo para criar endpoints FHIR contra fontes de dados arbitrarias (bancos customizados, sistemas clinicos existentes, arquivos, etc.).
- **HAPI FHIR Client:** Biblioteca cliente para consumir APIs FHIR de servidores externos.
- **Parsers/Encoders:** Conversao entre formatos FHIR (JSON, XML) e modelos de dados da aplicacao.

**Versao atual:** 7.x (2025), requer Java 17+ (Java 21 tambem suportado). A versao mais recente inclui suporte a AWS OpenSearch para busca fulltext.

### 1.2 Maturidade e Adocao

- **GitHub:** ~2.200+ stars, centenas de contribuidores
- **Licenca:** Apache Software License 2.0
- **Usado por:** Hospitais, governos, empresas de saude, pesquisadores. Sistemas de grande porte, incluindo plataformas de mensageria, repositorios regionais de dados e solucoes de telemedicina, foram construidos sobre HAPI FHIR JPA.
- **Escalabilidade:** Comprovada para milhoes de pacientes e alem.

### 1.3 Relevancia para o Ponte

| Aspecto | Avaliacao |
|---------|-----------|
| Maturidade | Excelente - padrao ouro da industria |
| Funcionalidades | Completo - servidor, cliente, validacao, parsing |
| Performance | Excelente em escala |
| **Contra: Linguagem** | **Java - nao faz parte do stack do Ponte (Node.js)** |
| **Contra: Peso** | **JVM e muito pesada para municipios com infraestrutura minima** |
| **Contra: Complexidade** | **Setup complexo com Hibernate, JPA, configuracao de banco** |

**Veredicto:** Embora seja a ferramenta FHIR mais madura, o uso de Java tornaria o Ponte desnecessariamente pesado e complexo. Nao recomendado como base principal, mas util como referencia de implementacao e para validacao offline de recursos.

---

## 2. Firely (.NET / C#)

### 2.1 Firely .NET SDK

O Firely .NET SDK e a biblioteca oficial de FHIR para .NET, open-source e mantida pela Firely (empresa holandesa co-fundada por Ewout Kramer, um dos criadores do FHIR).

**Funcionalidades:**
- Modelos tipados para todos os recursos FHIR
- Serialization/deserialization (JSON, XML)
- Validacao de recursos contra perfis customizados
- FHIRPath engine
- Cliente REST para servidores FHIR

**Licenca:** BSD-3-Clause (open-source)
**GitHub:** github.com/FirelyTeam/firely-net-sdk

### 2.2 Firely Server (ex-Vonk)

O Firely Server e o produto comercial da empresa. Embora tenha componentes open-source em seu nucleo, o servidor de producao e closed-source e requer licenca comercial. Foca em performance, seguranca e compliance com regulacoes nacionais.

### 2.3 Spark FHIR Server

O Spark e o servidor FHIR open-source em C# da Firely/Incendi. E a implementacao de referencia em C# do FHIR e suporta DSTU2, STU3 e R4. Compativel com .NET Framework 4.6.1+, .NET Standard 2.0 e .NET Core.

### 2.4 Relevancia para o Ponte

| Aspecto | Avaliacao |
|---------|-----------|
| Maturidade SDK | Boa - mantido ativamente |
| Funcionalidades | Completo para .NET |
| **Contra: Linguagem** | **C#/.NET - nao faz parte do stack do Ponte** |
| **Contra: Servidor comercial** | **Firely Server requer licenca paga** |
| Spark | Alternativa open-source mas menos ativa |

**Veredicto:** Nao recomendado. Stack .NET nao se alinha com Node.js do Ponte. O SDK e excelente mas irrelevante para nosso contexto tecnico.

---

## 3. Ferramentas FHIR para JavaScript/Node.js

Este e o ecossistema mais relevante para o Projeto Ponte. Existem varias bibliotecas e servidores disponiveis.

### 3.1 Pacote `fhir` (npm)

**Repositorio:** github.com/lantanagroup/FHIR.js
**npm:** `npm install fhir`

**Funcionalidades:**
- Serializacao entre XML e JSON
- Validacao contra spec core e perfis customizados
- Avaliacao de FHIRPath
- Suporte a multiplas versoes FHIR (>= STU3, incluindo R4)
- Funciona em Node.js e no browser
- Preserva precisao de decimais na conversao XML -> Obj

**Exemplo de uso:**
```javascript
const Fhir = require('fhir').Fhir;
const fhir = new Fhir();

// Validar recurso
const result = fhir.validate(resource);

// Converter JSON para XML
const xml = fhir.objToXml(resource);
```

**Maturidade:** Mantido pela Lantana Consulting Group. Suporte ativo.

### 3.2 fhirpath.js

**Repositorio:** github.com/HL7/fhirpath.js
**npm:** `npm install fhirpath`

**Funcionalidades:**
- Implementacao JavaScript/TypeScript da especificacao FHIRPath
- Desenvolvido pela U.S. National Library of Medicine (NLM) e Health Samurai
- Doado ao HL7 e mantido pela NLM
- Suporte a modelos FHIR R4 com choice types
- Ferramenta de linha de comando incluida
- Funciona no browser e Node.js

**Exemplo de uso:**
```javascript
const fhirpath = require('fhirpath');
const fhirpath_r4_model = require('fhirpath/fhir-context/r4');

const result = fhirpath.evaluate(
  patient,
  'name.given',
  null,
  fhirpath_r4_model
);
```

**Maturidade:** Excelente. Mantido pelo HL7 e NLM. Referencia oficial.

### 3.3 node-fhir-server-core (BlueHalo/Asymmetrik)

**Repositorio:** github.com/bluehalo/node-fhir-server-core
**npm:** `@asymmetrik/node-fhir-server-core`

**Funcionalidades:**
- Implementacao REST segura da spec FHIR em Node.js
- Suporte simultaneo a DSTU2, STU3 e R4
- Framework para criar servidores FHIR customizados
- Middleware configuravel, seguranca, rotas FHIR

**Maturidade:**
- GitHub: ~408 stars, 126 forks
- **Atencao:** Ultima release ha quase 2 anos. Manutencao parece reduzida.
- Issues recentes em 2025 indicam alguma atividade da comunidade.

**Relevancia:** Util como referencia de arquitetura para servidor FHIR em Node.js, mas a baixa atividade de manutencao e um risco. O Ponte nao precisa de um servidor FHIR completo - precisa de um cliente/gerador de recursos.

### 3.4 fhir.js (FHIR/fhir.js)

**Repositorio:** github.com/FHIR/fhir.js
**Funcionalidades:** Cliente JavaScript para servidores FHIR. Permite buscar, criar, atualizar e deletar recursos.

**Maturidade:** Projeto mais antigo, menos atualizado. Funciona mas ha alternativas melhores.

### 3.5 fhirclient

**npm:** `fhirclient`
**Funcionalidades:** Biblioteca JavaScript para conectar aplicacoes SMART on FHIR a servidores FHIR. Funciona no browser (IE 10+) e Node.js (10+).

**Relevancia para Ponte:** Baixa. Focado em SMART on FHIR, que nao e o modelo de autenticacao da RNDS.

### 3.6 Avaliacao do Ecossistema Node.js

O ecossistema JavaScript/Node.js para FHIR e funcional mas fragmentado. Nao ha uma unica solucao "faz-tudo" como o HAPI FHIR em Java. A estrategia recomendada e combinar bibliotecas especializadas:

| Necessidade | Biblioteca Recomendada |
|-------------|----------------------|
| Tipos TypeScript FHIR R4 | `@medplum/fhirtypes` |
| Construcao de recursos | `@medplum/core` ou construcao manual com tipos |
| Validacao de recursos | pacote `fhir` (Lantana) |
| Avaliacao FHIRPath | `fhirpath` (HL7/NLM) |
| Cliente HTTP FHIR | Implementacao customizada com `axios` ou `node-fetch` |

---

## 4. Medplum (TypeScript/React)

### 4.1 Arquitetura

O Medplum e uma plataforma de saude open-source moderna, construida inteiramente em TypeScript. E a ferramenta FHIR mais relevante para projetos baseados em Node.js.

**Stack tecnologico:**
- **Backend:** Node.js + PostgreSQL
- **Frontend:** React 19
- **Linguagem:** TypeScript full-stack
- **Licenca:** Apache 2.0

**Camadas da plataforma:**
- **Data Layer:** Servidor FHIR R4 com PostgreSQL, busca, historico, compartimentos e transacoes
- **API Layer:** REST, GraphQL, Subscriptions, WebSockets
- **Seguranca:** OAuth 2 / OpenID Connect, RBAC, ACLs por linha, audit logs completos
- **UI Components:** 40+ componentes React para interfaces de saude
- **Extensibilidade:** "Bots" (TypeScript lambdas) que executam em hooks de recursos; perfis customizados

### 4.2 Pacotes npm Relevantes

| Pacote | Funcao |
|--------|--------|
| `@medplum/core` | Biblioteca core - cliente FHIR, validacao, FHIRPath, sem dependencias externas |
| `@medplum/fhirtypes` | Definicoes TypeScript para todos os tipos FHIR R4 |
| `@medplum/fhir-router` | Roteador FHIR para servidor |

**Destaques do `@medplum/core`:**
- Cliente FHIR completo (create, read, update, delete, patch, search)
- Validacao de recursos (`$validate`)
- Avaliacao FHIRPath
- WebSockets para comunicacao em tempo real
- **Zero dependencias externas** - ideal para projetos leves
- Tipagem TypeScript rigorosa - erros estruturais pegos em tempo de desenvolvimento

### 4.3 Maturidade

- **GitHub:** ~5.000+ stars (um dos projetos FHIR mais populares)
- **npm downloads:** ~93.000+ downloads para `@medplum/fhirtypes`
- **Versao atual:** v5 (2025) com ESM por padrao
- **Contribuidores:** Comunidade ativa e crescente
- **Deploy:** Self-hosted ou cloud gerenciado (app.medplum.com)

### 4.4 Relevancia para o Ponte

| Aspecto | Avaliacao |
|---------|-----------|
| **Linguagem** | **TypeScript/Node.js - alinhado com nosso stack!** |
| **Tipos FHIR** | **Excelentes - tipagem completa R4** |
| **Validacao** | **Integrada no @medplum/core** |
| Peso | Core e leve, sem dependencias externas |
| Licenca | Apache 2.0 - compativel com MIT |
| Plataforma completa | Mais do que precisamos - servidor, UI, bots |

**Pode servir como base para o Ponte?**

**Nao como plataforma completa.** O Medplum e uma plataforma de EHR/saude que seria excessiva para nosso caso de uso (adaptador IPM -> RNDS). Porem, seus **pacotes npm individuais** (`@medplum/core` e `@medplum/fhirtypes`) sao extremamente uteis e podem ser usados como bibliotecas standalone sem instalar a plataforma inteira.

**Veredicto:** Os pacotes `@medplum/core` e `@medplum/fhirtypes` sao a melhor opcao para o Ponte como bibliotecas de suporte FHIR em TypeScript.

---

## 5. LinuxForHealth / FHIR (IBM)

### 5.1 Arquitetura

O LinuxForHealth FHIR Server (anteriormente IBM FHIR Server) e uma implementacao modular em Java da especificacao FHIR, focada em performance e configurabilidade.

**Caracteristicas:**
- Suporta FHIR R4 e R4B
- Construido sobre o projeto open-source OpenLiberty (tambem funciona no IBM WebSphere Liberty)
- Modelo de objetos gerado a partir da spec FHIR R4B
- Parsers e geradores para XML e JSON
- Suporte a audit via Apache Kafka (formato CADF)
- Offloading de payload para IBM Cloud Object Storage, Cassandra e Azure Blob

**Metricas:**
- GitHub: ~357 stars, 25 contribuidores
- Licenca: Apache 2.0
- Ultima release significativa: v5.0.0

### 5.2 Relevancia para o Ponte

| Aspecto | Avaliacao |
|---------|-----------|
| Maturidade | Boa, mas menor comunidade que HAPI |
| **Contra: Linguagem** | **Java - pesado demais para nosso caso** |
| **Contra: Complexidade** | **WebSphere Liberty, Kafka, etc. - overengineered** |
| Foco enterprise | Projetado para IBM Cloud - nao para municipios pequenos |

**Veredicto:** Nao recomendado. Mesmos problemas do HAPI (Java, peso) com menor comunidade e foco excessivo em infraestrutura enterprise IBM.

---

## 6. Aidbox (Health Samurai)

### 6.1 Visao Geral

O Aidbox e uma plataforma FHIR backend-as-a-service criada pela Health Samurai. E descrito como a primeira plataforma FHIR backend comercial do mercado.

**Caracteristicas:**
- Metadata-driven: tudo e representado como dados/recursos
- Storage baseado em PostgreSQL
- Auth server com OAuth 2.0 e OpenID Connect
- Camada de seguranca com politicas flexiveis de controle de acesso
- Servidor de terminologia integrado
- APIs: FHIR RESTful, GraphQL, SQL

### 6.2 Modelo de Licenciamento

| Tipo | Detalhes |
|------|----------|
| Desenvolvimento | Gratuito (Aidbox.Dev) - ate 5 GB, sem PHI |
| Producao | $1.900/mes (flat fee) |
| Academico | Licencas gratuitas para instituicoes educacionais sem fins lucrativos |
| Trial | 14 dias para producao |

### 6.3 Contribuicoes Open-Source

A Health Samurai contribui para varios projetos open-source: sql-on-fhir, fhirbase, hl7proxy, jute.clj, fhirpath.js (co-desenvolvimento com NLM), retest, suitkin.

### 6.4 Relevancia para o Ponte

| Aspecto | Avaliacao |
|---------|-----------|
| Funcionalidades | Excelente plataforma FHIR |
| **Contra: Custo** | **$1.900/mes e inviavel para municipios pequenos** |
| **Contra: Modelo** | **Comercial - nao atende requisito open-source/MIT** |
| Desenvolvimento | Gratuito para dev, mas lock-in para producao |

**Veredicto:** Nao recomendado. O custo mensal e o modelo comercial sao incompativeis com o objetivo de software livre para municipios com orcamento limitado. As contribuicoes open-source da Health Samurai (especialmente fhirpath.js) sao valiosas, mas o Aidbox em si nao se encaixa.

---

## 7. Ferramentas de Validacao e Teste FHIR

### 7.1 HL7 FHIR Validator (Java)

O validador oficial do HL7 e uma ferramenta standalone em Java que verifica conformidade de recursos contra a especificacao base FHIR e Implementation Guides customizados.

**Caracteristicas:**
- Linha de comando: `java -jar org.hl7.fhir.validator_cli.jar`
- Validacao contra spec core, perfis, terminologias
- Suporte a extensoes customizadas
- Parte do projeto HAPI core
- Integracao com HAPI FHIR via `FhirInstanceValidator`

**Uso no Ponte:** Pode ser usado como ferramenta de CI/CD para validar recursos gerados, mesmo que o projeto principal seja em Node.js. Execucao via Docker em pipeline de testes.

### 7.2 Inferno Framework

O Inferno e um framework open-source criado pelo ONC (Office of the National Coordinator for Health IT) dos EUA para criar, executar e compartilhar testes automatizados de conformidade FHIR.

**Funcionalidades:**
- DSL flexivel para testes de conformidade
- APIs web, linha de comando e JSON
- Test Kits distribuiveis
- Validacao via HL7 FHIR Java Validator (wrapper REST)
- Testes para ONC Health IT Certification e outros IGs

**Componentes relevantes:**
- `fhir-validator-wrapper`: Servico persistente que expoe o validador Java via REST API
- `fhir-validator-app`: App standalone para validacao de recursos contra Implementation Guides

**Uso no Ponte:** O `fhir-validator-wrapper` pode ser usado como microsservico de validacao, expondo o validador Java via REST para consumo pelo adaptador Node.js.

### 7.3 Simplifier.net para Perfis Brasileiros

O Simplifier.net e a plataforma colaborativa do ecossistema FHIR para publicacao e gerenciamento de perfis. Os perfis brasileiros estao disponiveis em:

- **BR-Core:** https://simplifier.net/br-core - Repositorio de Implementation Guide R4 do Brasil
- **RNDS:** https://simplifier.net/redenacionaldedadosemsaude - Perfis da Rede Nacional de Dados em Saude
- **Terminologia Saude:** Guias de terminologia brasileira

**Uso no Ponte:** Essencial para obter as definicoes dos perfis BR Core que devem ser aplicados aos recursos FHIR enviados a RNDS.

### 7.4 Validacao em Node.js

Para validacao diretamente em Node.js sem depender de Java:

| Ferramenta | Capacidade |
|------------|-----------|
| Pacote `fhir` (npm) | Validacao contra spec core e perfis customizados |
| `@medplum/core` | Validacao `$validate` integrada |
| `@d4l/js-fhir-validator` | Validador FHIR para Node.js |
| `fhir-validator` (npm) | Validador FHIR basico |

---

## 8. Ferramentas Especificas para o Brasil

### 8.1 Perfis BR Core no Simplifier

O BR-Core e o Implementation Guide brasileiro para FHIR R4, publicado no Simplifier.net. Define os perfis nacionais que devem ser utilizados por sistemas que se integram a RNDS.

**Perfis importantes para o Ponte:**
- BRIndividuo (Patient)
- BREstabelecimentoSaude (Organization)
- BRProfissionalSaude (Practitioner)
- BRImunobiologicoAdministrado (Immunization)
- BRComposicaoRegistroImunobiologicoAdministrado (Composition)
- BRDocumentoREQUISICAO (Bundle)

**Pacote:** `BRCore-01.00.00` disponivel no FHIR Package Registry.

### 8.2 Ferramentas do DATASUS para Integracao RNDS

**Portal de Servicos:** https://servicos-datasus.saude.gov.br
**Documentacao FHIR RNDS:** https://rnds-fhir.saude.gov.br/
**Guia de Integracao:** https://rnds-guia.saude.gov.br/

**Processo de integracao:**
1. Solicitar acesso no portal de servicos do Ministerio da Saude
2. Upload de certificado e-CNPJ ou e-CPF ICP-Brasil
3. Testar em ambiente de homologacao
4. Solicitar credencial de producao

**API Endpoints principais:**
- `POST /token` - Autenticacao (EHR Auth) - retorna access_token (30 min)
- `GET /fhir/r4/Patient` - Consulta pacientes
- `GET /fhir/r4/Organization` - Consulta organizacoes
- `GET /fhir/r4/Practitioner` - Consulta profissionais
- `POST /fhir/r4/Bundle` - Envio de documentos FHIR
- `GET /contexto-atendimento` - Contexto de atendimento

**Autenticacao:**
- mTLS (Two-way SSL) com certificado ICP-Brasil
- Token JWT via `POST /token` com header `X-Authorization-Server: Bearer <token>`

### 8.3 Biblioteca `rnds` (npm) - kyriosdata

**Repositorio:** https://github.com/kyriosdata/rnds
**npm:** `npm install rnds`
**Versao:** 0.2.4
**Autor:** Fabio Nogueira de Lucena (kyriosdata)

Esta e a unica biblioteca JavaScript/Node.js especificamente projetada para integracao com a RNDS. Oferece:

**Funcionalidades:**
- Autenticacao com certificado ICP-Brasil
- Facade para ambientes FHIR da RNDS (homologacao e producao)
- Metodos encapsulados: `checkVersion()`, `capability()`, `atendimento()`, `cnes()`, `cns()`, `cpf()`, `cnpj()`, `lotacoes()`, `patient()`
- Colecao Postman incluida para testes
- Integracao com fhir.js

**Limitacoes:**
- Versao 0.2.x - projeto academico/experimental
- Foco inicial em resultados de exames COVID-19
- Requer `--openssl-legacy-provider` com Node.js 17+
- Pouca documentacao
- Comunidade pequena

**Uso no Ponte:** Pode servir como **referencia de implementacao** para entender o fluxo de autenticacao e envio de Bundles a RNDS, mas provavelmente sera necessario implementar nossa propria camada de integracao com melhor manutencao e suporte a todos os tipos de documento.

### 8.4 Colecao Postman da RNDS

O repositorio kyriosdata/rnds inclui uma colecao Postman (`rnds-postman-collection.json`) que documenta todos os endpoints da RNDS com exemplos de requisicoes. Esta colecao e extremamente valiosa para entender o formato exato das requisicoes e respostas.

### 8.5 Estrutura de Bundle para RNDS

Exemplo conceitual da estrutura de um Bundle para envio a RNDS (Registro de Imunobiologico Administrado):

```
Bundle (type: "document")
  |-- meta.lastUpdated
  |-- identifier (system + value do solicitante)
  |-- timestamp
  |-- entry[0]: Composition (BRComposicaoRegistroImunobiologicoAdministrado)
  |     |-- references -> entry[1]
  |-- entry[1]: Immunization (BRImunobiologicoAdministrado)
```

A `Composition` referencia o `Immunization`, e ambos estao agrupados no `Bundle` atraves da propriedade `entry` com `fullUrl` e `resource`.

---

## 9. Matriz de Comparacao

### 9.1 Tabela Comparativa Completa

| Criterio | HAPI FHIR | Firely SDK | node-fhir-server-core | Medplum | LinuxForHealth | Aidbox | fhir (npm) | fhirpath.js |
|----------|-----------|------------|----------------------|---------|----------------|--------|------------|-------------|
| **Linguagem** | Java | C#/.NET | Node.js | TypeScript | Java | Clojure/Java | JavaScript | JavaScript |
| **Licenca** | Apache 2.0 | BSD-3 | MIT | Apache 2.0 | Apache 2.0 | Comercial | MIT | BSD-3 |
| **Tipo** | Servidor + Client + SDK | SDK + Client | Servidor | Plataforma completa | Servidor | Plataforma (SaaS) | Biblioteca | Biblioteca |
| **GitHub Stars** | ~2.200+ | ~1.000+ | ~408 | ~5.000+ | ~357 | N/A (closed) | ~200+ | ~200+ |
| **Ultima release** | 2025 (7.x) | 2025 | ~2023 | 2025 (v5) | v5.0.0 | Contínuo | 2024+ | 2025 |
| **Contribuidores** | Centenas | Dezenas | ~30 | Dezenas | 25 | Equipe interna | Pequena | NLM + HL7 |
| **FHIR R4** | Sim | Sim | Sim | Sim | Sim | Sim | Sim (>= STU3) | Sim |
| **Perfis customizados** | Sim | Sim | Parcial | Sim | Sim | Sim | Sim | N/A |
| **Performance** | Excelente | Boa | Boa | Boa | Boa | Excelente | Leve | Leve |
| **Complexidade setup** | Alta | Media | Media | Alta (plataforma) / Baixa (pacotes) | Alta | Baixa (SaaS) | Muito baixa | Muito baixa |
| **Relevancia Ponte** | **Baixa** | **Baixa** | **Media** | **Alta** (pacotes) | **Baixa** | **Baixa** | **Alta** | **Alta** |

### 9.2 Tabela Focada nas Ferramentas Node.js/TypeScript

| Criterio | @medplum/core | @medplum/fhirtypes | fhir (npm) | fhirpath.js | rnds (npm) | node-fhir-server-core |
|----------|--------------|-------------------|------------|-------------|------------|----------------------|
| **Funcao** | Client + Validacao + FHIRPath | Tipos TypeScript R4 | Validacao + Serialization | FHIRPath engine | Client RNDS | Servidor FHIR |
| **Dependencias** | Zero | Zero | Minimas | Minimas | Varias | Varias |
| **TypeScript** | Nativo | Nativo (definicoes) | Nao | Sim (tipos incluidos) | Nao | Nao |
| **Validacao BR Core** | Parcial (precisa perfis) | N/A | Sim (perfis customizados) | N/A | Nao | Nao |
| **Manutencao** | Ativa (2025) | Ativa (2025) | Ativa | Ativa (NLM) | Baixa (0.2.x) | Baixa (~2023) |
| **Leveza** | Leve | Muito leve | Leve | Leve | Media | Pesado |
| **Necessario para Ponte?** | **Sim** | **Sim** | **Talvez** | **Sim** | **Referencia** | **Nao** |

---

## 10. Recomendacao para o Projeto Ponte

### 10.1 Requisitos Revisitados

| Requisito | Implicacao Tecnica |
|-----------|-------------------|
| Stack Node.js | Excluir Java, C#, plataformas nao-JS |
| Gerar recursos FHIR R4 com perfis BR Core | Precisamos de tipos TypeScript + validacao |
| mTLS com certificado ICP-Brasil | Implementacao customizada com `https` nativo do Node.js |
| Ler dados do IPM Atende.Net (PostgreSQL) | Driver PostgreSQL (`pg` ou `postgres.js`) |
| Enviar Bundles para API RNDS | Cliente HTTP com mTLS + token JWT |
| Sistema LEVE | Minimo de dependencias, sem JVM, sem servidor pesado |
| Licenca compativel com MIT | Apache 2.0 e BSD-3 sao compativeis |

### 10.2 Combinacao de Ferramentas Recomendada

```
+------------------------------------------------------------------+
|                    PROJETO PONTE - Stack FHIR                     |
+------------------------------------------------------------------+
|                                                                    |
|  CAMADA DE TIPOS E CONSTRUCAO                                     |
|  +------------------------------------------------------------+  |
|  | @medplum/fhirtypes  - Tipos TypeScript para FHIR R4        |  |
|  | @medplum/core        - Construcao e validacao de recursos   |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  CAMADA DE AVALIACAO E TRANSFORMACAO                              |
|  +------------------------------------------------------------+  |
|  | fhirpath              - Avaliacao de expressoes FHIRPath    |  |
|  | fhir (npm)            - Validacao contra perfis BR Core     |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  CAMADA DE COMUNICACAO RNDS                                       |
|  +------------------------------------------------------------+  |
|  | Modulo customizado    - mTLS + ICP-Brasil + Token JWT       |  |
|  | (inspirado em kyriosdata/rnds como referencia)              |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  CAMADA DE DADOS                                                  |
|  +------------------------------------------------------------+  |
|  | pg / postgres.js      - Leitura do banco IPM Atende.Net    |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 10.3 Detalhamento das Ferramentas Escolhidas

#### Tier 1 - Essenciais (instalar como dependencias)

| Pacote | Funcao no Ponte | Licenca |
|--------|----------------|---------|
| `@medplum/fhirtypes` | Tipagem TypeScript completa para todos os recursos FHIR R4. Garante que recursos gerados estejam estruturalmente corretos em tempo de compilacao. | Apache 2.0 |
| `@medplum/core` | Funcoes utilitarias para construcao de recursos, validacao basica, avaliacao FHIRPath. Zero dependencias externas - ideal para sistema leve. | Apache 2.0 |
| `fhirpath` | Engine FHIRPath para extrair e transformar dados de recursos FHIR. Mantido oficialmente pelo HL7/NLM. | BSD-3 |
| `pg` | Driver PostgreSQL para Node.js. Leitura dos dados do IPM Atende.Net. | MIT |

#### Tier 2 - Recomendadas (avaliar durante desenvolvimento)

| Pacote | Funcao no Ponte | Licenca |
|--------|----------------|---------|
| `fhir` (npm, Lantana) | Validacao de recursos contra perfis customizados BR Core. Suporte a serializacao XML/JSON. | MIT |
| `axios` ou `undici` | Cliente HTTP para comunicacao com API RNDS. Suporte a mTLS via agente HTTPS customizado. | MIT |

#### Tier 3 - Ferramentas de Desenvolvimento e CI/CD

| Ferramenta | Funcao | Licenca |
|------------|--------|---------|
| HL7 FHIR Validator (Java CLI) | Validacao rigorosa de recursos contra perfis BR Core em pipeline CI/CD. Execucao via Docker. | Apache 2.0 |
| Colecao Postman RNDS (kyriosdata) | Referencia para testes manuais e documentacao de endpoints. | Open |
| Inferno `fhir-validator-wrapper` | Alternativa: microsservico de validacao que expoe o validador Java via REST. | Apache 2.0 |

### 10.4 Arquitetura Recomendada

```
                    ARQUITETURA DO ADAPTADOR PONTE
                    ==============================

  +-------------------+         +-----------------------------+
  | IPM Atende.Net    |         |      RNDS (DATASUS)         |
  | (PostgreSQL)      |         |  rnds-fhir.saude.gov.br     |
  +--------+----------+         +-------------+---------------+
           |                                  ^
           | Leitura SQL                      | POST /fhir/r4/Bundle
           | (pg driver)                      | (mTLS + Bearer Token)
           v                                  |
  +--------+----------------------------------+---------------+
  |                   PONTE ADAPTER (Node.js/TypeScript)       |
  |                                                            |
  |  +------------------+    +--------------------+            |
  |  | Data Extractor   |    | RNDS Client        |            |
  |  | - Queries SQL    |    | - mTLS com ICP-BR  |            |
  |  | - Mapeamento     |    | - Token JWT        |            |
  |  |   IPM -> FHIR    |    | - Envio de Bundles |            |
  |  +--------+---------+    +--------+-----------+            |
  |           |                       ^                        |
  |           v                       |                        |
  |  +--------+-----------------------+-----------+            |
  |  | FHIR Resource Builder                      |            |
  |  | - @medplum/fhirtypes (tipos)               |            |
  |  | - @medplum/core (construcao)               |            |
  |  | - Perfis BR Core aplicados                 |            |
  |  | - Validacao pre-envio                      |            |
  |  +--------------------------------------------+            |
  |                                                            |
  |  +--------------------------------------------+            |
  |  | Scheduler / Queue                          |            |
  |  | - Processamento em lotes (cron ou fila)    |            |
  |  | - Retry com backoff exponencial            |            |
  |  | - Log de auditoria local                   |            |
  |  +--------------------------------------------+            |
  |                                                            |
  +------------------------------------------------------------+
```

### 10.5 Fluxo de Dados

1. **Extracao:** O `Data Extractor` le dados do banco PostgreSQL do IPM Atende.Net via queries SQL usando o driver `pg`.

2. **Transformacao:** O `FHIR Resource Builder` transforma os dados extraidos em recursos FHIR R4 com perfis BR Core, usando `@medplum/fhirtypes` para tipagem e `@medplum/core` para construcao e validacao.

3. **Validacao:** Antes do envio, cada recurso e validado contra os perfis BR Core. Em desenvolvimento/CI, o HL7 FHIR Validator (Java) garante conformidade total.

4. **Autenticacao:** O `RNDS Client` realiza autenticacao mTLS com certificado ICP-Brasil e obtem token JWT via `POST /token`.

5. **Envio:** Os Bundles FHIR sao enviados via `POST /fhir/r4/Bundle` com o token Bearer no header `X-Authorization-Server`.

6. **Resiliencia:** O `Scheduler/Queue` gerencia processamento em lotes, retries e logging.

### 10.6 Exemplo Conceitual de Implementacao mTLS

```typescript
// Conceito de como seria a autenticacao mTLS com RNDS
import https from 'node:https';
import fs from 'node:fs';

const agent = new https.Agent({
  cert: fs.readFileSync('/path/to/certificado-icp-brasil.pem'),
  key: fs.readFileSync('/path/to/chave-privada.pem'),
  // CA do ICP-Brasil (se necessario)
  ca: fs.readFileSync('/path/to/ca-icp-brasil.pem'),
  rejectUnauthorized: true
});

// Obter token
const tokenResponse = await fetch('https://ehr-auth.saude.gov.br/api/token', {
  method: 'POST',
  // @ts-ignore - agent nao e oficialmente suportado em fetch nativo
  agent: agent,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
});
```

### 10.7 Justificativa da Recomendacao

**Por que @medplum/core + @medplum/fhirtypes como base?**

1. **TypeScript nativo:** Tipagem completa para FHIR R4, erros pegos em compilacao
2. **Zero dependencias:** Minima pegada, ideal para sistema leve
3. **Mantido ativamente:** Equipe Medplum com releases regulares (v5 em 2025)
4. **Licenca Apache 2.0:** Compativel com MIT
5. **Pode ser usado standalone:** Nao requer a plataforma Medplum inteira
6. **Validacao integrada:** `$validate` disponivel sem ferramentas externas
7. **FHIRPath incluido:** Nao precisa de biblioteca separada para expressoes simples
8. **Comunidade crescente:** 5.000+ stars, documentacao extensa

**Por que NAO um servidor FHIR completo (HAPI, Spark, etc.)?**

O Ponte nao e um servidor FHIR. E um **adaptador unidirecional** que:
- Le dados do IPM (PostgreSQL)
- Transforma em recursos FHIR
- Envia para a RNDS

Nao ha necessidade de expor endpoints FHIR, armazenar recursos, implementar busca FHIR ou gerenciar historico. Um servidor FHIR seria massivo overhead sem beneficio.

**Por que implementar mTLS customizado em vez de usar a biblioteca `rnds`?**

A biblioteca `rnds` (kyriosdata) e valiosa como referencia, mas:
- Versao 0.2.x (experimental)
- Requer flags de compatibilidade (`--openssl-legacy-provider`)
- Focada em COVID-19
- Sem tipagem TypeScript
- Manutencao incerta

A implementacao customizada com `https.Agent` nativo do Node.js e mais robusta, tipada e controlavel.

### 10.8 Estimativa de Dependencias do Ponte

```json
{
  "dependencies": {
    "@medplum/core": "^5.x",
    "@medplum/fhirtypes": "^5.x",
    "fhirpath": "^3.x",
    "pg": "^8.x"
  },
  "devDependencies": {
    "fhir": "^4.x",
    "typescript": "^5.x"
  }
}
```

**Total de dependencias de producao: 4 pacotes** (sendo 2 com zero subdependencias). Isso resulta em um sistema extremamente leve, adequado para municipios com infraestrutura minima.

---

## Apendice A - Links de Referencia

### Ferramentas Principais
- HAPI FHIR: https://hapifhir.io/ | https://github.com/hapifhir/hapi-fhir
- Firely .NET SDK: https://fire.ly/products/firely-net-sdk/ | https://github.com/FirelyTeam/firely-net-sdk
- Medplum: https://www.medplum.com/ | https://github.com/medplum/medplum
- node-fhir-server-core: https://github.com/bluehalo/node-fhir-server-core
- LinuxForHealth FHIR: https://github.com/LinuxForHealth/FHIR
- Aidbox: https://www.health-samurai.io/fhir-server
- Spark FHIR Server: https://github.com/FirelyTeam/spark

### Bibliotecas JavaScript/TypeScript
- @medplum/core: https://www.npmjs.com/package/@medplum/core
- @medplum/fhirtypes: https://www.npmjs.com/package/@medplum/fhirtypes
- fhir (npm): https://www.npmjs.com/package/fhir
- fhirpath.js: https://github.com/HL7/fhirpath.js | https://www.npmjs.com/package/fhirpath
- fhirclient: https://www.npmjs.com/package/fhirclient
- rnds: https://www.npmjs.com/package/rnds | https://github.com/kyriosdata/rnds

### Validacao e Teste
- HL7 FHIR Validator: https://confluence.hl7.org/display/FHIR/Using+the+FHIR+Validator
- Inferno Framework: https://inferno.healthit.gov/ | https://github.com/inferno-framework
- Validador online: https://validator.fhir.org/

### Brasil / RNDS
- RNDS Portal FHIR: https://rnds-fhir.saude.gov.br/
- RNDS Guia de Integracao: https://rnds-guia.saude.gov.br/
- BR-Core (Simplifier): https://simplifier.net/br-core
- RNDS (Simplifier): https://simplifier.net/redenacionaldedadosemsaude
- Catalogo APIs RNDS: https://www.gov.br/conecta/catalogo/apis/rnds-rede-nacional-de-dados-em-saude

### Especificacao FHIR
- FHIR R4: https://hl7.org/fhir/R4/
- Implementacoes Open Source: https://confluence.hl7.org/display/FHIR/Open+Source+Implementations

---

## Apendice B - Glossario

| Termo | Significado |
|-------|-------------|
| FHIR | Fast Healthcare Interoperability Resources - padrao HL7 para troca de dados de saude |
| RNDS | Rede Nacional de Dados em Saude - plataforma de interoperabilidade do Ministerio da Saude |
| BR Core | Implementation Guide brasileiro para FHIR R4 |
| mTLS | Mutual TLS - autenticacao bidirecional via certificados |
| ICP-Brasil | Infraestrutura de Chaves Publicas Brasileira |
| FHIRPath | Linguagem de expressoes para extrair e avaliar dados de recursos FHIR |
| Bundle | Recurso FHIR container que agrupa outros recursos |
| Composition | Recurso FHIR que representa um documento clinico |
| IG | Implementation Guide - guia de implementacao FHIR para um caso de uso especifico |
| IPM | Empresa fornecedora do sistema Atende.Net usado em municipios |
