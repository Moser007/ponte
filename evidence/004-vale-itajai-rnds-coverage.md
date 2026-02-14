# Pesquisa: Cobertura RNDS no Vale do Itajaí — 2026-02-13

## Resumo Executivo

**Pergunta:** Quais municípios do Vale do Itajaí ao redor de Blumenau estão integrados ou não à RNDS?

**Resposta curta:** Não é possível determinar o status exato de integração RNDS por município a partir de fontes públicas. Porém, descobrimos que **apenas 74 dos 295 municípios de SC (25,1%) estão conectados à RNDS** (dado de agosto/2024, COSEMS-SC) — muito abaixo da média nacional de 68,3%. Isso significa que a grande maioria dos municípios do Vale do Itajaí provavelmente NÃO está integrada.

**Implicação para o Ponte:** Santa Catarina não é o estado avançado que pensávamos. É na verdade um dos estados com mais gap — e o Vale do Itajaí é nosso laboratório ideal.

---

## DADO CRÍTICO: SC está muito atrás na RNDS

| Métrica | Nacional | Santa Catarina |
|---------|----------|----------------|
| Municípios conectados à RNDS | 68,3% (3.805/5.570) | **25,1% (74/295)** |
| Gap | 31,7% | **74,9%** |

**Fonte:** COSEMS-SC, oficinas de expansão SUS Digital, agosto/2024.

Isso muda completamente nossa análise de risco. Mesmo municípios maiores como Gaspar (73k) e Indaial (71k) podem não estar integrados.

---

## Municípios mapeados (19 na região ampliada do Vale do Itajaí)

### Médio Vale do Itajaí (CISAMVI — 14 municípios)

| # | Município | Pop. IBGE 2024 | UBS | Sistema de Prontuário | Usa PEC? | RNDS (estimado) |
|---|-----------|---------------|-----|----------------------|----------|-----------------|
| 1 | **Blumenau** | 380.597 | 77 | **Sistema PRONTO** (próprio, FURB desde 2011) | Não — sistema próprio integra e-SUS para SISAB | Provável SIM |
| 2 | **Brusque** | 151.949 | 23 | Prontuário eletrônico próprio (desde 2009), app "Saúde Cidadão" | Não — sistema terceiro | Provável SIM |
| 3 | **Gaspar** | 76.982 | 19-21 | **SigSS** (Sistema terceiro com BI) | Não — substituiu PEC por terceiro | Incerto |
| 4 | **Indaial** | 76.333 | 13 | **IPM Atende.Net** (desde 1997) | Não — sistema terceiro | Incerto |
| 5 | **Timbó** | 48.903 | 10 | **IPM Atende.Net** (desde 2016, assinatura digital) | Não — sistema terceiro | Incerto |
| 6 | **Pomerode** | 36.392 | 8 | **IPM Atende.Net** | Não — sistema terceiro | Incerto |
| 7 | **Guabiruba** | ~23.000 | 5+ | Não confirmado | Provável PEC | Incerto |
| 8 | **Rodeio** | 13.321 | 5 | Provável e-SUS PEC | Provável SIM | Incerto |
| 9 | **Apiúna** | 10.020 | 5 | Provável e-SUS PEC | Provável SIM | Incerto |
| 10 | **Rio dos Cedros** | 11.163 | 4 | **IPM Atende.Net** (confirmado) | Não — sistema terceiro | Incerto |
| 11 | **Benedito Novo** | 10.738 | 3 | Provável e-SUS PEC | Provável SIM | Incerto |
| 12 | **Ascurra** | 8.635 | 3 | **IPM Atende.Net** (confirmado) | Não — sistema terceiro | Incerto |
| 13 | **Botuverá** | ~5.500 | 2+ | Provável e-SUS PEC | Provável SIM | Incerto |
| 14 | **Doutor Pedrinho** | 3.719 | 3 | Provável e-SUS PEC | Provável SIM | Incerto |

### Foz do Rio Itajaí (CIS-AMFRI — municípios adicionais relevantes)

| # | Município | Pop. IBGE 2024 | UBS | Sistema de Prontuário | Usa PEC? | RNDS (estimado) |
|---|-----------|---------------|-----|----------------------|----------|-----------------|
| 15 | **Itajaí** | 287.289 | 24 | Sistema próprio + app "Conecta.í" | Não — sistema terceiro | Provável SIM |
| 16 | **Balneário Camboriú** | 148.758 | 12 | **PEC e-SUS** (confirmado) | **SIM** | Provável SIM |
| 17 | **Navegantes** | 93.619 | 13 | Não confirmado | Sem info | Incerto |
| 18 | **Ilhota** | 18.197 | 3 | Provável e-SUS PEC | Provável SIM | Incerto |
| 19 | **Luiz Alves** | 12.126 | 4 | Provável e-SUS PEC | Provável SIM | Incerto |

### Alto Vale do Itajaí (CISAMAVI)

| # | Município | Pop. IBGE 2024 | UBS | Sistema de Prontuário | Usa PEC? | RNDS (estimado) |
|---|-----------|---------------|-----|----------------------|----------|-----------------|
| 20 | **Ibirama** | 20.663 | 7 | **IPM Atende.Net** (evidências) | Não — sistema terceiro | Incerto |

---

## Análise por Sistema de Prontuário

### Municípios com sistema TERCEIRO (NÃO usam PEC padrão)
Esses enfrentam desafio adicional para RNDS — dependem do fornecedor desenvolver a integração:

| Município | Sistema | Fornecedor | Pop. |
|-----------|---------|------------|------|
| Blumenau | PRONTO | FURB (próprio) | 380k |
| Brusque | Próprio (desde 2009) | Não identificado | 151k |
| Itajaí | Próprio + Conecta.í | Não identificado | 287k |
| Gaspar | SigSS | Terceiro com BI | 76k |
| Indaial | Atende.Net | **IPM Sistemas** | 76k |
| Timbó | Atende.Net | **IPM Sistemas** | 48k |
| Pomerode | Atende.Net | **IPM Sistemas** | 36k |
| Rio dos Cedros | Atende.Net | **IPM Sistemas** | 11k |
| Ascurra | Atende.Net | **IPM Sistemas** | 8.6k |
| Ibirama | Atende.Net | **IPM Sistemas** | 20k |

**Total: 10 municípios com sistema terceiro. 6 deles usam IPM Sistemas.**

### Municípios que provavelmente usam e-SUS PEC
Para esses, integração RNDS é "apenas" configurar o certificado ICP-Brasil:

| Município | Pop. |
|-----------|------|
| Balneário Camboriú (confirmado) | 148k |
| Rodeio | 13k |
| Apiúna | 10k |
| Benedito Novo | 10k |
| Botuverá | 5.5k |
| Doutor Pedrinho | 3.7k |
| Ilhota | 18k |
| Luiz Alves | 12k |
| Guabiruba | 23k |

---

## Descobertas-chave

### 1. SC está MUITO atrás na RNDS (25,1% vs 68,3% nacional)
- Apenas 74 dos 295 municípios conectados (agosto/2024)
- O COSEMS-SC realizou oficinas de expansão em agosto/2024 para acelerar
- **O gap é ENORME e o Ponte tem espaço real de atuação**

### 2. Blumenau usa Sistema PRONTO (não PEC)
- Desenvolvido pela FURB (Universidade de Blumenau) desde 2011
- +10 anos de dados, 2.300 profissionais de saúde
- Referência nacional em saúde digital
- FURB retomou desenvolvimento recentemente
- Telemedicina 24h
- Integra com e-SUS para envio ao SISAB, mas status RNDS desconhecido

### 3. IPM Sistemas domina a região (6 municípios confirmados)
- Sede de tecnologia em Rio do Sul (Alto Vale do Itajaí)
- IPM afirma "integração com sistemas do SUS e MS" mas **não confirmamos integração RNDS**
- Se IPM NÃO integra RNDS → oportunidade de criar adaptador IPM → RNDS
- Se IPM integra → 6 municípios podem estar cobertos automaticamente

### 4. Gaspar substituiu PEC por SigSS
- Adotou sistema terceiro com Business Intelligence
- ACS usam tablets
- App "Alô Saúde" para cidadãos
- Integração RNDS depende do fornecedor SigSS

### 5. COSEMS-SC oficinas de expansão RNDS (agosto/2024)
- Duas oficinas online:
  - Dia 1: Integração de sistemas terceiros à RNDS
  - Dia 2: Integração do PEC e-SUS à RNDS
- Parceria com CGIIS/DATASUS/SEIDIGI, SEMS/SC, CONASEMS, SES/SC
- **Programa PMAE exige RNDS** — isso está acelerando adesão

### 6. Consorcios intermunicipais de saúde
- **CISAMVI/CISAMVE:** 14 municípios do Médio Vale do Itajaí
- **CIS-AMFRI:** Municípios da Foz do Rio Itajaí (Itajaí, BC, Navegantes, etc.)
- **CISAMAVI:** Alto Vale do Itajaí (Ibirama, etc.)

### 7. Contato COSEMS-SC identificado
- **Apoiadora regional Médio Vale do Itajaí:** Gisele de Cássia Galvão
- **WhatsApp:** (47) 991908242
- **Email:** gisele.apoiadoracosems@gmail.com

---

## Caminhos para obter status exato de RNDS por município

**Caminho 1 — Giovanni contata Gisele do COSEMS-SC (mais rápido):**
Uma mensagem de WhatsApp para (47) 991908242 pode resolver em minutos.

**Caminho 2 — Acesso ao e-Gestor AB:**
Com credenciais do SUS, acessar egestorab.saude.gov.br para ver relatórios por município.

**Caminho 3 — CIEGES/SC:**
Portal de informações em saúde do estado: cieges.saude.sc.gov.br

**Caminho 4 — SISAB:**
sisab.saude.gov.br — requer autenticação de gestor.

---

## Municípios-alvo prioritários para o Ponte

### Categoria A: Municípios pequenos com PEC (problema = configuração)
Ação do Ponte: Kit de configuração RNDS simplificado.

1. **Doutor Pedrinho** (3.719 hab.) — menor da região
2. **Botuverá** (5.500 hab.) — muito pequeno
3. **Benedito Novo** (10.738 hab.)
4. **Apiúna** (10.020 hab.)
5. **Rodeio** (13.321 hab.)

### Categoria B: Municípios com IPM (problema = fornecedor)
Ação do Ponte: Adaptador IPM → RNDS ou parceria com IPM.

1. **Ascurra** (8.635 hab.) — IPM + pequeno
2. **Rio dos Cedros** (11.163 hab.) — IPM + pequeno
3. **Pomerode** (36.392 hab.) — IPM
4. **Timbó** (48.903 hab.) — IPM
5. **Indaial** (76.333 hab.) — IPM
6. **Ibirama** (20.663 hab.) — IPM, Alto Vale

### Categoria C: Municípios com sistema próprio (problema = desenvolvimento)
Ação do Ponte: Adaptador específico ou contribuição ao sistema.

1. **Gaspar** (76.982 hab.) — SigSS
2. **Blumenau** (380.597 hab.) — PRONTO/FURB
3. **Brusque** (151.949 hab.) — próprio

---

## Próximos passos

1. **Giovanni contata Gisele (COSEMS-SC)** — confirmar quais municípios da região estão/não na RNDS
2. **Pesquisar se IPM Atende.Net integra RNDS** — muda estratégia para 6 municípios
3. **Investigar Sistema PRONTO (FURB/Blumenau)** — potencial parceria acadêmica
4. **Definir município-piloto** — após confirmação do passo 1

---

## Fontes
- COSEMS-SC - Integração à RNDS: cosemssc.org.br/category/integracao-a-rnds/
- COSEMS-SC - Oficinas de Expansão SUS Digital: cosemssc.org.br/oficinas-de-expansao-do-sus-digital-profissional/
- COSEMS-SC - Médio Vale do Itajaí: cosemssc.org.br/macrorregioes/medio-vale-do-itajai/
- Prefeitura de Blumenau - Sistema PRONTO
- Informe Blumenau - PRONTO volta a FURB
- Gaspar - Novo software de saúde: gaspar.sc.gov.br
- IPM Sistemas - Indaial: ipm.com.br
- IPM Sistemas - Timbó: ipm.com.br
- CIS-AMFRI: cis-amfri.sc.gov.br
- CONASEMS - Teleconsultoria Balneário Camboriú
- Agência Gov - RNDS instituída (julho/2025)
- SC Todo Dia - Integração digital na saúde
- PostosdeSaude.com.br - Dados de UBS
- CNES/DATASUS: cnes2.datasus.gov.br
- RNDS Guia: rnds-guia.saude.gov.br
- SISAB: sisab.saude.gov.br
- e-Gestor AB: egestorab.saude.gov.br
- CIEGES/SC: cieges.saude.sc.gov.br
