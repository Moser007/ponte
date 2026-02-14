# R010 — Processo de Credenciamento RNDS para Homologacao

> Pesquisa autonoma executada em 2026-02-14
> Objetivo: Documentar o processo completo de credenciamento na RNDS para ambiente de homologacao
> Contexto: Projeto Ponte (adaptador IPM -> RNDS) precisa testar com a RNDS real

---

## 1. RESUMO EXECUTIVO

O credenciamento na RNDS e feito EXCLUSIVAMENTE para **estabelecimentos de saude** com CNES valido, nao para desenvolvedores independentes ou empresas de software. O processo exige: (1) certificado digital ICP-Brasil (e-CPF ou e-CNPJ, tipo A1), (2) conta gov.br, (3) CNES do estabelecimento, (4) gestor cadastrado no CNES. **Giovanni, como pessoa fisica sem estabelecimento de saude, NAO PODE se credenciar diretamente.** A unica via e conseguir um municipio parceiro que forneca suas credenciais para desenvolvimento. O COSEMS-SC pode facilitar esse contato.

---

## 2. PRE-REQUISITOS COMPLETOS

### 2.1 Documentos e Cadastros Obrigatorios

| Pre-requisito | Descricao | Status Giovanni |
|---------------|-----------|-----------------|
| **CNES valido** | Cadastro Nacional de Estabelecimentos de Saude do estabelecimento que fara a integracao | NAO TEM |
| **Conta gov.br** | Login unico do governo federal (CPF + senha) | Pode criar |
| **Certificado digital ICP-Brasil** | e-CPF ou e-CNPJ, tipo A1 (arquivo .pfx), cadeia ICP-Brasil | Pode obter nos EUA |
| **Gestor cadastrado no CNES** | O responsavel pelo credenciamento deve estar registrado no CNES do estabelecimento | NAO TEM |
| **CNS do profissional** | Cartao Nacional de Saude do profissional que assina os atendimentos | NAO TEM |
| **CBO registrado no CNES** | Classificacao Brasileira de Ocupacoes vinculada ao profissional no CNES | NAO TEM |

### 2.2 Perfis Envolvidos

**GESTOR:** Responsavel pelo estabelecimento de saude. Executa:
- Aquisicao do certificado digital
- Criacao de conta gov.br
- Solicitacao de acesso no Portal de Servicos DATASUS
- Assinatura do termo de compromisso

**INTEGRADOR (TI):** Desenvolvedor de software. Executa:
- Familiarizacao com APIs e servicos RNDS
- Desenvolvimento do conector (software de integracao)
- Testes no ambiente de homologacao
- Producao de evidencias de homologacao
- Deploy em producao

### 2.3 Regra Critica para Empresas de Software

> **"O credenciamento e para laboratorios [e estabelecimentos de saude] e NAO para empresas que produzem software para estes laboratorios. As empresas de software que prestam servicos a estes laboratorios deverao receber destes a credencial de acesso."**
> — FAQ oficial RNDS

Isso significa que o Ponte, como projeto de software, nao pode se credenciar autonomamente. Precisa de um estabelecimento de saude parceiro.

---

## 3. PASSO-A-PASSO DO CREDENCIAMENTO

### Fase 1: Preparacao (Gestor)

**Passo 1 — Obter certificado digital ICP-Brasil**
- Tipo: e-CPF ou e-CNPJ (escolha no momento da solicitacao)
- Formato: A1 (arquivo digital .pfx, validade 1 ano) ou A3 (token/smart card, validade 3-5 anos)
- Recomendado para desenvolvimento: **A1** (mais pratico, instalavel em varios computadores)
- Cadeia: ICP-Brasil obrigatoria
- O certificado sera associado ao estabelecimento de saude no portal
- IMPORTANTE: O certificado usado na solicitacao DEVE SER o mesmo usado pelo conector nas autenticacoes

**Passo 2 — Criar conta gov.br**
- URL: https://acesso.gov.br
- Necessario CPF brasileiro
- Nivel prata ou ouro recomendado

**Passo 3 — Acessar Portal de Servicos DATASUS**
- URL: https://servicos-datasus.saude.gov.br/
- Autenticar com conta gov.br
- Selecionar servico "RNDS"
- Clicar em "Solicitar acesso"

**Passo 4 — Preencher formulario de solicitacao**
O formulario tem 4 etapas:

1. **Responsavel**: Indicar se e interno ao MS ou externo (estabelecimento de saude)
2. **Sistema**: Informar o sistema que fara a integracao com a RNDS
3. **Operacao**: Definir quais operacoes/APIs serao utilizadas
4. **Finalizacao**: Upload do certificado digital (.cer ou .pfx), informar CNES, telefone e e-mail do gestor

**Passo 5 — Aguardar aprovacao**
- A equipe DATASUS analisa a solicitacao
- Prazo: nao ha prazo formal, mas relatos indicam dias a poucas semanas
- Quando aprovado, o solicitante recebe um **identificador de requisitante** (lab-identificador)
- Acesso ao ambiente de homologacao e liberado

### Fase 2: Desenvolvimento e Homologacao (Integrador)

**Passo 6 — Familiarizar-se com os servicos**
- Documentacao: https://rnds-guia.saude.gov.br/
- Postman collection: https://documenter.getpostman.com/view/215332/TVewY47S
- Biblioteca JavaScript: `rnds` no npm (kyriosdata)
- Biblioteca Java: `projetos/rnds-java` (kyriosdata)

**Passo 7 — Desenvolver o conector**
- Implementar autenticacao mTLS (Two-way SSL)
- Obter token via POST na API Auth
- Enviar Bundle FHIR R4 via POST na API EHR
- Headers obrigatorios:
  - `X-Authorization-Server`: "Bearer " + access_token
  - `Authorization`: CNS do profissional de saude

**Passo 8 — Testar no ambiente de homologacao**
- Enviar dados de teste para validacao
- Registrar evidencias (screenshots, logs)

**Passo 9 — Produzir evidencias de homologacao**
Evidencias aceitas (formato PDF ou PNG, max 10MB):
- Screenshot do validador FHIR R4 local com sucesso
- Screenshot do header de resposta de criacao de registro na RNDS
- Registro de envio bem-sucedido ao ambiente de homologacao

### Fase 3: Producao (Gestor + Integrador)

**Passo 10 — Solicitar acesso a producao**
- Menu "Gerenciar Credenciais" no portal
- Expandir solicitacao aprovada
- Clicar "Solicitar acesso ao Ambiente de producao"
- Upload das evidencias de homologacao
- Equipe DATASUS valida em ate 2 dias uteis

**Passo 11 — Deploy**
- Alterar endpoints de homologacao para producao
- Alterar endpoint EHR para o endpoint estadual correto (ex: sc-ehr-services.saude.gov.br)

---

## 4. ENDPOINTS E URLs

### Ambiente de Homologacao (Testes)

| Funcao | URL |
|--------|-----|
| Auth (obter token) | `https://ehr-auth-hmg.saude.gov.br` |
| EHR (servicos de saude) | `https://ehr-services.hmg.saude.gov.br` |

### Ambiente de Producao

| Funcao | URL |
|--------|-----|
| Auth (obter token) | `https://ehr-auth.saude.gov.br` |
| EHR (servicos de saude) | `https://{UF}-ehr-services.saude.gov.br` |

Para Santa Catarina: `https://sc-ehr-services.saude.gov.br`

### Outros URLs Relevantes

| Recurso | URL |
|---------|-----|
| Portal de Servicos DATASUS | https://servicos-datasus.saude.gov.br/ |
| Guia de Integracao RNDS | https://rnds-guia.saude.gov.br/ |
| Portal RNDS oficial | https://rnds.saude.gov.br/ |
| FAQ RNDS | https://webatendimento.saude.gov.br/faq/rnds |
| CNES (consulta) | https://cnes.datasus.gov.br/ |
| Conta gov.br | https://acesso.gov.br |
| Postman examples | https://documenter.getpostman.com/view/215332/TVewY47S |
| kyriosdata/rnds (GitHub) | https://github.com/kyriosdata/rnds |
| kyriosdata docs | https://kyriosdata.github.io/rnds |
| COSEMS-SC | https://www.cosemssc.org.br/ |
| Suporte RNDS (email) | rnds@saude.gov.br |

---

## 5. FLUXO TECNICO DE AUTENTICACAO

```
1. Conector envia requisicao HTTPS GET para Auth endpoint
   - Usando certificado digital (.pfx) via mTLS (Two-way SSL)

2. Auth valida o certificado:
   - Verifica cadeia ICP-Brasil
   - Verifica validade
   - Identifica CNPJ/CPF
   - Verifica credenciamento

3. Auth retorna access_token (JWT):
   {
     "access_token": "[token longo]",
     "scope": "read write",
     "token_type": "jwt",
     "expires_in": 1800000   // 30 minutos
   }

4. Conector faz requisicoes ao EHR endpoint:
   POST https://ehr-services.hmg.saude.gov.br/api/fhir/r4/Bundle
   Headers:
     X-Authorization-Server: Bearer [access_token]
     Authorization: [CNS do profissional]
     Content-Type: application/fhir+json
   Body: [Bundle FHIR R4]

5. Resposta de sucesso:
   HTTP 200 OK
   Location: [URL do recurso criado na RNDS]
```

---

## 6. CUSTOS ENVOLVIDOS

### Certificado Digital ICP-Brasil

| Tipo | Preco estimado | Validade | Onde comprar |
|------|---------------|----------|--------------|
| e-CPF A1 (Brasil) | R$ 99 - R$ 220 | 1 ano | Serpro, Certisign, Valid, Serasa |
| e-CNPJ A1 (Brasil) | R$ 165 - R$ 250 | 1 ano | Serpro, Certisign, Valid |
| e-CPF A1 (nos EUA) | USD 80 - 200 (estimado) | 1 ano | Certifica Aqui USA, Certifique EUA, EasySign Brasil |
| e-CPF A3 (token) | R$ 200 - R$ 400 | 3-5 anos | Serpro, Certisign |

### Para brasileiros nos EUA

- **E POSSIVEL** obter certificado ICP-Brasil morando nos EUA
- Validacao por **videoconferencia** e autorizada por lei
- Empresas especializadas: Certifica Aqui USA (+1 786 451 9850), Certifique EUA, EasySign Brasil, Cartorio Brasileiro, SM Certificadora
- Necessario: CPF, documento com foto (CNH ou passaporte brasileiro)
- Processo 100% online em muitos casos

### Outros custos

| Item | Custo |
|------|-------|
| Conta gov.br | Gratuito |
| Credenciamento RNDS | Gratuito |
| Acesso a homologacao | Gratuito |
| Acesso a producao | Gratuito |

**Custo total estimado: R$ 99 - R$ 250 (apenas o certificado digital)**

---

## 7. PRAZOS ESTIMADOS

| Etapa | Prazo estimado |
|-------|---------------|
| Emissao de certificado digital A1 | 1-3 dias (pode ser mesmo dia) |
| Criacao de conta gov.br | Imediato |
| Preenchimento do formulario RNDS | 30 minutos |
| Aprovacao pelo DATASUS (homologacao) | 2-15 dias uteis (sem SLA formal) |
| Desenvolvimento do conector | Ja feito (adaptador Ponte) |
| Testes de homologacao | 1-5 dias |
| Producao de evidencias | 1 dia |
| Aprovacao para producao | Ate 2 dias uteis |
| **Total estimado** | **1-4 semanas** (se tiver CNES) |

---

## 8. OBSTACULOS E SOLUCOES PARA O CASO PONTE/GIOVANNI

### Obstaculo 1: Giovanni NAO tem CNES (CRITICO)

**Problema:** O credenciamento RNDS exige CNES de um estabelecimento de saude. Giovanni nao e profissional de saude e nao tem estabelecimento de saude.

**Solucoes possiveis:**

A) **Municipio parceiro** (RECOMENDADO)
- Encontrar um municipio do Vale do Itajai que use IPM e esteja disposto a testar o Ponte
- O secretario de saude municipal faz o credenciamento como gestor
- O municipio fornece o certificado digital e as credenciais ao Giovanni como integrador
- Giovanni desenvolve e testa o conector usando as credenciais do municipio
- **Vantagem:** Validacao com dados reais de um municipio real
- **Como:** Contatar Gisele do COSEMS-SC ou secretario de saude de municipio alvo

B) **COSEMS-SC como facilitador**
- O COSEMS-SC ja promove oficinas de integracao RNDS
- Contato: cosemssc@cosemssc.org.br | (48) 3364-4003
- Pedir apoio para encontrar municipio parceiro para piloto
- O COSEMS pode fazer a "ponte" (ironia intencional) entre Giovanni e um municipio

C) **Consorcio CISAMVI**
- Consorcio Intermunicipal de Saude do Medio Vale do Itajai
- Cobre todos os municipios-alvo
- Pode facilitar acesso a credenciais de um municipio membro

D) **FURB / Universidade**
- A FURB ja desenvolve o Sistema PRONTO para Blumenau
- Pode ter credenciais de homologacao para fins academicos/pesquisa
- Parceria academica pode facilitar acesso

### Obstaculo 2: Giovanni mora nos EUA

**Problema:** Certificado digital ICP-Brasil historicamente exigia presenca fisica para validacao.

**Solucao:** Desde a regulamentacao de videoconferencia, e possivel obter certificado ICP-Brasil 100% online morando nos EUA. Empresas como Certifica Aqui USA e Certifique EUA oferecem esse servico.

### Obstaculo 3: Certificado precisa ser do estabelecimento, nao do desenvolvedor

**Problema:** O certificado digital usado no credenciamento deve ser do estabelecimento de saude (e-CNPJ do municipio ou e-CPF do gestor da saude).

**Solucao:** O municipio parceiro fornece o certificado digital ao Giovanni como integrador. Na pratica, o arquivo .pfx e compartilhado com o desenvolvedor para que ele possa fazer as chamadas mTLS durante o desenvolvimento.

### Obstaculo 4: Necessidade de CNS do profissional

**Problema:** Toda requisicao a RNDS exige o CNS (Cartao Nacional de Saude) do profissional responsavel, com CBO registrado no CNES.

**Solucao:** O municipio parceiro fornece o CNS de um profissional de saude que participara do piloto. Em homologacao, pode-se usar dados de teste (a confirmar com DATASUS).

### Obstaculo 5: Nao existe sandbox sem certificado

**Problema:** Nao ha ambiente sandbox publico da RNDS que funcione sem certificado ICP-Brasil e credenciamento.

**Solucao:** A unica via e o credenciamento formal via estabelecimento de saude parceiro. O ambiente de homologacao e o "sandbox" da RNDS.

---

## 9. ALTERNATIVAS PARA DESENVOLVEDORES SEM ESTABELECIMENTO DE SAUDE

### 9.1 Via municipio parceiro (melhor opcao)
O desenvolvedor trabalha como integrador contratado/parceiro de um municipio. O municipio faz o credenciamento e compartilha as credenciais.

### 9.2 Via SBIS
A SBIS tem convenio com o Ministerio da Saude para ser o elo entre RNDS e desenvolvedores. Pode haver programas de apoio ou acesso facilitado.
- Contato: https://sbis.org.br/

### 9.3 Via HL7 Brasil / Instituto HL7 Brasil
Organizacao que promove padroes HL7/FHIR no Brasil. Oferece cursos e pode ter conexoes para facilitar acesso de desenvolvedores.
- Contato: https://hl7.org.br/
- EAD: https://ead.hl7.org.br/
- Curso FHIR Intermediario: proxima turma marco 2026

### 9.4 Via Postman Collection (desenvolvimento sem RNDS real)
O kyriosdata disponibiliza exemplos completos de requisicoes RNDS via Postman. E possivel desenvolver e testar o conector localmente sem acesso real a RNDS, usando mocks baseados nos exemplos reais.
- URL: https://documenter.getpostman.com/view/215332/TVewY47S

### 9.5 Via biblioteca `rnds` npm (kyriosdata)
Wrapper JavaScript para a API da RNDS. Pode ser usada para desenvolvimento com mocks ate obter credenciais reais.
- GitHub: https://github.com/kyriosdata/rnds
- NPM: `npm install rnds`

### 9.6 NAO existe
- Sandbox publica sem certificado ICP-Brasil
- Programa formal de "desenvolvedor parceiro" RNDS
- Certificado de teste/desenvolvimento (o certificado precisa ser ICP-Brasil real)
- Credenciamento para pessoa fisica sem CNES

---

## 10. RECURSOS DE APOIO

### Documentacao oficial
- Guia de Integracao RNDS: https://rnds-guia.saude.gov.br/
- Manual de Integracao (PDF): disponivel no site do DATASUS
- FAQ oficial: https://webatendimento.saude.gov.br/faq/rnds
- Perguntas e respostas MS: https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/perguntas-e-respostas/faq

### Ferramentas para desenvolvedores
- kyriosdata/rnds (JS + Java): https://github.com/kyriosdata/rnds
- Postman collection: https://documenter.getpostman.com/view/215332/TVewY47S
- FHIR R4 profiles BR Core: https://simplifier.net/redenacionaldedadosemsaude

### Comunidade e apoio
- COSEMS-SC: https://www.cosemssc.org.br/ | cosemssc@cosemssc.org.br | (48) 3364-4003
- SBIS: https://sbis.org.br/
- HL7 Brasil: https://hl7.org.br/
- Suporte RNDS: rnds@saude.gov.br

### COSEMS-SC — Apoio a integracao RNDS
- O COSEMS-SC ja realizou "Oficina de integracao a RNDS" (ago/2024)
- Material tecnico e videos disponiveis
- Apoiadores regionais em cada regiao de saude de SC
- **Apoiadora Medio Vale do Itajai: Gisele de Cassia Galvao** — (47) 991908242 | gisele.apoiadoracosems@gmail.com

---

## 11. FONTES CONSULTADAS

1. Guia de Integracao RNDS — Passo a passo: https://rnds-guia.saude.gov.br/docs/passo-a-passo/
2. RNDS Guia — Certificado digital: https://rnds-guia.saude.gov.br/docs/publico-alvo/gestor/certificado/
3. RNDS Guia — Papel do gestor: https://rnds-guia.saude.gov.br/docs/publico-alvo/gestor/gestor/
4. RNDS Guia — Solicitar acesso: https://rnds-guia.saude.gov.br/docs/publico-alvo/gestor/portal/
5. RNDS Guia — Ambientes: https://rnds-guia.saude.gov.br/docs/rnds/ambientes/
6. RNDS Guia — Papel do integrador: https://rnds-guia.saude.gov.br/docs/publico-alvo/ti/ti/
7. RNDS Guia — Conector: https://rnds-guia.saude.gov.br/docs/conector/
8. RNDS Guia — Conhecer servicos: https://rnds-guia.saude.gov.br/docs/publico-alvo/ti/conhecer/
9. FAQ RNDS — Web atendimento MS: https://webatendimento.saude.gov.br/faq/rnds
10. FAQ RNDS — Credenciamento e certificado: https://www.gov.br/saude/pt-br/composicao/seidigi/rnds/perguntas-e-respostas/faq/credenciamento-certificado-digital/
11. Portal de Servicos DATASUS: https://servicos-datasus.saude.gov.br/
12. Catalogo APIs governamentais — RNDS: https://www.gov.br/conecta/catalogo/apis/rnds-rede-nacional-de-dados-em-saude
13. kyriosdata/rnds (GitHub): https://github.com/kyriosdata/rnds
14. Postman RNDS examples: https://documenter.getpostman.com/view/215332/TVewY47S
15. COSEMS-SC — Integracao RNDS: https://www.cosemssc.org.br/category/integracao-a-rnds/
16. COSEMS-SC — Integracao PEC e-SUS RNDS (PDF): https://www.cosemssc.org.br/wp-content/uploads/2022/09/Integracao-PEC-e-SUS-a-RNDS.pdf
17. Certificado digital para brasileiros no exterior: Certifica Aqui USA, Certifique EUA, EasySign Brasil
18. SBIS — Convenio MS para RNDS: https://sbis.org.br/
19. HL7 Brasil: https://hl7.org.br/
20. Portal gov.br — Certificacao digital: https://www.gov.br/pt-br/servicos/obter-certificacao-digital

---

## 12. RECOMENDACAO FINAL PARA GIOVANNI

### Caminho critico (o que fazer, nesta ordem):

**Passo 1 — CONTATAR COSEMS-SC (esta semana)**
- Ligar/WhatsApp para Gisele do COSEMS-SC: (47) 991908242
- OU email para cosemssc@cosemssc.org.br
- Mensagem: "Sou desenvolvedor do projeto Ponte (open-source, MIT), que cria adaptador IPM -> RNDS para dados clinicos. Precisamos de um municipio parceiro no Vale do Itajai que use IPM e esteja disposto a nos fornecer credenciais de homologacao RNDS para testarmos o adaptador. O COSEMS pode indicar um municipio interessado?"

**Passo 2 — IDENTIFICAR MUNICIPIO PARCEIRO**
Prioridades (municipios pequenos do Vale do Itajai que usam IPM):
1. Indaial (65k, usa IPM)
2. Timbo (45k, usa IPM)
3. Pomerode (35k, usa IPM)
4. Ascurra (8.4k, usa IPM)
5. Rio dos Cedros (11k, usa IPM)

**Passo 3 — MUNICIPIO FAZ CREDENCIAMENTO**
O secretario de saude do municipio parceiro:
- Usa seu certificado digital (que ja deve ter para outros sistemas do SUS)
- Acessa servicos-datasus.saude.gov.br
- Solicita acesso a homologacao RNDS
- Informa que o sistema a integrar e o Ponte (adaptador IPM -> RNDS)
- Aguarda aprovacao do DATASUS

**Passo 4 — MUNICIPIO COMPARTILHA CREDENCIAIS COM GIOVANNI**
- Arquivo .pfx do certificado digital
- Identificador de requisitante (lab-identificador)
- CNES do estabelecimento
- CNS de um profissional de saude

**Passo 5 — GIOVANNI TESTA O ADAPTADOR**
- Configura o conector Ponte com as credenciais
- Testa autenticacao mTLS com o endpoint de homologacao
- Envia Bundle RAC de teste
- Registra evidencias

**Passo 6 — OBTER CERTIFICADO DIGITAL PESSOAL (opcional, paralelo)**
- Obter e-CPF A1 ICP-Brasil nos EUA via videoconferencia
- Custo: ~USD 100-200
- Empresas: Certifica Aqui USA (+1 786 451 9850), Certifique EUA
- Util para: assinar como responsavel tecnico, futuras integracoes

### Alternativa: se nenhum municipio parceiro for encontrado

1. Continuar desenvolvendo com mocks (o que ja fazemos)
2. Validar o Bundle com HL7 FHIR Validator (R011)
3. Usar a Postman collection do kyriosdata para simular chamadas
4. Quando Giovanni visitar Blumenau pessoalmente, bater na porta de uma secretaria de saude municipal
5. Considerar abordar a SBIS ou HL7 Brasil para apoio como projeto open-source

### Timeline realista

| Semana | Acao |
|--------|------|
| Sem 1 | Contatar COSEMS-SC e Gisele |
| Sem 2 | Identificar municipio parceiro |
| Sem 3 | Municipio faz credenciamento |
| Sem 4-5 | DATASUS aprova |
| Sem 5-6 | Giovanni recebe credenciais e testa |
| Sem 6-7 | Primeiro Bundle RAC real enviado a RNDS homologacao |

**Prazo total estimado: 6-8 semanas** (com cooperacao de um municipio)

---

## 13. DIAGRAMA DO FLUXO

```
Giovanni (Integrador)          Municipio Parceiro (Gestor)
        |                              |
        |                    [1] Tem CNES + certificado
        |                    [2] Acessa servicos-datasus.saude.gov.br
        |                    [3] Solicita acesso homologacao RNDS
        |                              |
        |                    [4] DATASUS aprova (2-15 dias)
        |                              |
        |  <-- [5] Compartilha .pfx + identificador + CNES + CNS
        |
[6] Configura conector Ponte
[7] Autentica via mTLS -> ehr-auth-hmg.saude.gov.br
[8] Recebe access_token (JWT, 30min)
[9] Envia Bundle RAC -> ehr-services.hmg.saude.gov.br
[10] Recebe HTTP 200 + Location
[11] Registra evidencias (screenshots)
        |
        | --> [12] Municipio solicita producao
        |          com evidencias de homologacao
        |
        | --> [13] DATASUS aprova producao (ate 2 dias)
        |
[14] Altera endpoint para sc-ehr-services.saude.gov.br
[15] Deploy em producao
```

---

## 14. DESCOBERTAS IMPORTANTES

### 14.1 Nao existe sandbox publica
A RNDS NAO tem sandbox sem credenciamento. O ambiente de homologacao E o sandbox, mas exige credenciamento formal com CNES + certificado ICP-Brasil. Isso e uma barreira significativa para desenvolvedores independentes e projetos open-source.

### 14.2 O token dura 30 minutos
O access_token tem validade de 1.800.000ms (30 minutos). O conector deve reutilizar o token dentro desse periodo, nao solicitar um novo a cada requisicao.

### 14.3 Endpoints de producao sao por estado
Em producao, cada estado tem seu proprio endpoint EHR. Para SC: `sc-ehr-services.saude.gov.br`.

### 14.4 COSEMS-SC ja promove integracao RNDS
O COSEMS-SC realizou oficinas de integracao RNDS em agosto 2024. Isso sugere que ha momentum e receptividade para projetos como o Ponte.

### 14.5 SBIS como ponte para o mercado
A SBIS tem convenio com o MS para ser o elo entre RNDS e desenvolvedores/mercado. Pode ser um canal para obter apoio ou visibilidade para o Ponte.

### 14.6 Certificados A1/A3 sendo descontinuados apos 2026
A Resolucao CG/ICP-Brasil 211/2024 prevê mudancas nos tipos de certificado apos 31/12/2026. Novos modelos substituirao A1/A3. Isso afeta planejamento de longo prazo.

### 14.7 PEC nao precisa de credenciamento manual
Usuarios do e-SUS APS PEC nao precisam fazer ajustes no portal para integracao com RNDS — o PEC ja tem integracao nativa. Isso confirma que o problema de credenciamento e dos sistemas terceiros (como IPM).
