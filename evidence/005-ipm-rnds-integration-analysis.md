# Pesquisa: IPM Sistemas (Atende.Net) e Integração com RNDS — 2026-02-13

## Resumo Executivo

**Pergunta:** O IPM Atende.Net integra com a RNDS?

**Resposta:** PARCIALMENTE. O IPM envia **apenas dados de vacinação** (COVID-19) para a RNDS via SI-PNI desde março de 2021. **NÃO há evidência de que envie dados clínicos** (RAC, RSA, prescrições, exames) para a RNDS. Isso significa que os 6+ municípios do Vale do Itajaí que usam IPM provavelmente NÃO estão compartilhando dados clínicos na RNDS.

**Impacto para o Ponte:** ENORME. O cenário "Maria" (gestante chega na emergência sem histórico) continua real nesses municípios. Existe oportunidade concreta de criar um adaptador IPM → RNDS para dados clínicos.

---

## O que o IPM integra HOJE

### SIM — Integra com:
| Sistema | Tipo | Via |
|---------|------|-----|
| SI-PNI (vacinação COVID) | Dados de vacinação | RNDS (desde março 2021) |
| SISAB | Produção da APS | e-SUS (Thrift/XML via centralizador) |
| BPA | Produção ambulatorial | Exportação direta |
| CNES | Cadastro de estabelecimentos | Integração direta |
| SINAN | Notificações epidemiológicas | Integração direta |
| SI-PNI | Imunizações | Integração direta |
| HORUS/Qualifar | Farmácia | Integração direta |
| +90 outros sistemas SUS | Diversos | Diversos mecanismos |

### NÃO — Não há evidência de:
| O que falta | O que significa |
|-------------|----------------|
| **RAC** (Registro de Atendimento Clínico) | Consultas médicas NÃO vão para RNDS |
| **RSA** (Resumo de Saída Hospitalar) | Internações NÃO vão para RNDS |
| **Prescrições** | Medicamentos prescritos NÃO aparecem na RNDS |
| **Exames** | Resultados de exames NÃO vão para RNDS |
| **FHIR R4** | IPM NÃO gera recursos FHIR nativamente |

---

## Evidências encontradas

### 1. Site oficial do IPM (ipm.com.br/saude/)
- Menciona "integração com +90 sistemas do SUS e Ministério da Saúde"
- **NÃO menciona RNDS, FHIR, barramento, interoperabilidade, ou Rede Nacional de Dados em Saúde** em nenhuma página pública
- Foco em features internas: prontuário eletrônico, cadastro único, BI, georreferenciamento

### 2. Artigo IPM sobre COVID (março 2021)
- Confirma integração com SI-PNI via RNDS para vacinação COVID
- Escopo: APENAS dados de vacinação COVID-19
- Benefício: eliminou dupla digitação (antes: digitava no IPM + no SI-PNI; depois: só no IPM)
- Implementação: março 2021
- **Fonte:** ipm.com.br/noticias/vacina-contra-covid-19-tecnologia-ipm-esta-integrada-ao-ministerio-da-saude/

### 3. Integração com e-SUS/SISAB
- IPM exporta dados de produção para o centralizador e-SUS
- Formato: Thrift/XML (padrão e-SUS AB v2.0)
- O e-SUS centralizador envia para SISAB
- **Isso NÃO é o mesmo que RNDS** — SISAB é para relatórios de produção, RNDS é para dados clínicos

### 4. Portaria GM/MS nº 5.663/2024
- Desde outubro 2024, envio de dados de vacinação para RNDS é **obrigatório** para todos os sistemas (próprios e terceiros)
- IPM provavelmente já cumpre essa obrigação (integração COVID de 2021)
- Mas a Portaria 6.656/2025 vai além: exige envio de dados de **regulação assistencial** à RNDS

### 5. Busca por vagas de emprego
- IPM NÃO tem vagas abertas mencionando FHIR, HL7, ou RNDS
- Isso sugere que NÃO estão investindo ativamente em interoperabilidade FHIR

### 6. COSEMS-SC oficinas (agosto 2024)
- Dia 1 da oficina foi específico para "integração de sistemas terceiros à RNDS"
- Nenhum vendor específico foi nomeado publicamente
- O fato de a oficina existir confirma que a maioria dos terceiros NÃO integra

---

## Análise técnica: por que o IPM provavelmente NÃO integra com RNDS para dados clínicos

### Diferença entre SISAB e RNDS
| Aspecto | SISAB | RNDS |
|---------|-------|------|
| Propósito | Relatório de produção APS | Troca de dados clínicos |
| Formato | Thrift/XML (e-SUS AB) | **FHIR R4** |
| Dados | Procedimentos realizados, indicadores | Prontuário resumido do paciente |
| Frequência | Mensal (batch) | **Tempo real** |
| Autenticação | Simples | **mTLS com ICP-Brasil** |

O IPM sabe enviar dados via Thrift/XML para SISAB. Mas RNDS exige FHIR R4 + certificado ICP-Brasil + mTLS — uma arquitetura completamente diferente.

### Custo de implementação para o IPM
Para o IPM integrar dados clínicos com RNDS, precisaria:
1. Implementar geração de recursos FHIR R4 (Bundle, Patient, Encounter, Condition, etc.)
2. Mapear dados internos para perfis BR Core
3. Implementar autenticação mTLS com certificado ICP-Brasil
4. Obter homologação no ambiente de testes da RNDS
5. Deploy para 120+ clientes

Isso é um projeto significativo de engenharia. Não é impossível, mas provavelmente não é prioridade comercial do IPM HOJE (não aparece em vagas, site, ou materiais públicos).

---

## O que isso significa para o Ponte

### Oportunidade A: Adaptador IPM → RNDS
Criar um middleware que:
1. Lê dados do IPM Atende.Net (via API ou banco de dados)
2. Traduz para FHIR R4 com perfis BR Core
3. Envia para RNDS via barramento (mTLS + ICP-Brasil)

**Impacto potencial:** 120+ municípios que usam IPM passariam a enviar dados clínicos para RNDS.

### Oportunidade B: Parceria com IPM
Propor à IPM Sistemas uma parceria:
- Ponte desenvolve o módulo de integração RNDS
- IPM incorpora ao Atende.Net
- Todos os clientes IPM são beneficiados
- IPM ganha compliance com regulamentações crescentes

### Oportunidade C: Pressão regulatória cria urgência
- Portaria 5.663/2024: vacinação → RNDS (obrigatório)
- Portaria 6.656/2025: regulação assistencial → RNDS (obrigatório)
- PMAE: sem RNDS = sem acesso a especialistas federais
- **A cada nova portaria, a pressão sobre IPM aumenta**

### Risco: IPM pode estar desenvolvendo internamente
É possível que o IPM esteja trabalhando em integração RNDS internamente mas ainda não tenha publicado. A ausência de evidência não é evidência de ausência. Porém, a falta de vagas de FHIR/HL7 e a ausência total do tema no site oficial sugerem que NÃO é prioridade atual.

---

## Próximos passos

1. **Pesquisar o IPM mais a fundo** — Existe API pública do Atende.Net? Documentação técnica? SDK?
2. **Contatar o IPM diretamente** — Giovanni pode ligar/emailar para o comercial do IPM e perguntar sobre planos de integração RNDS
3. **Verificar com a Gisele (COSEMS-SC)** — Ela pode saber se algum município IPM no Vale do Itajaí está na RNDS
4. **Avaliar viabilidade técnica do adaptador** — Qual seria a arquitetura? Qual o esforço?

---

## Fontes
- IPM Sistemas - Saúde: ipm.com.br/saude/
- IPM Sistemas - Institucional: ipm.com.br/ipm-sistemas/saude/
- IPM - Vacina COVID integração: ipm.com.br/noticias/vacina-contra-covid-19-tecnologia-ipm-esta-integrada-ao-ministerio-da-saude/
- IPM - Previne Brasil: ipm.com.br/previne-brasil/
- COSEMS-SC - Oficinas RNDS: cosemssc.org.br/oficinas-de-expansao-do-sus-digital-profissional/
- COSEMS-SC - Integração RNDS: cosemssc.org.br/category/integracao-a-rnds/
- Portaria 5.663/2024: bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt5663_04_11_2024.html
- RNDS Integração FHIR: rnds-fhir.saude.gov.br/integracao.html
- e-SUS Manual de Exportação v2.0: sisaps.saude.gov.br/esus/upload/docs/ManualExportacao_e-SUS-AB-v2.0.pdf
