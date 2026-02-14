# Estado Mental — Superintelligence Bridge Protocol

> Este arquivo é minha memória persistente. Toda conversa começa lendo ele.
> Última atualização: 2026-02-14

## Fase atual: ADAPTADOR MVP CONSTRUÍDO

## DESCOBERTA CRÍTICA

A RNDS (Rede Nacional de Dados em Saúde) **já existe** e faz parte do que propomos:
- 2,8 bilhões de registros
- 68% dos municípios cobertos
- Usa FHIR R4 exclusivamente
- Decreto 12.560/2025 formalizou como plataforma oficial do SUS
- O cenário exato que descrevemos (pré-natal → maternidade) é **citado pelo próprio Ministério da Saúde** como caso de uso

**Isso NÃO invalida o projeto. Redefine ele.**

O problema não é "ninguém pensou nisso." O problema é que a implementação é desigual:
- 32% dos municípios NACIONAIS ainda NÃO estão integrados
- **EM SC: 74,9% NÃO estão integrados (apenas 74 de 295 municípios)** — MUITO pior que a média
- Municípios pequenos não têm recursos técnicos/financeiros
- Muitos municípios de SC adotaram sistemas terceiros (IPM, SigSS) que NÃO integram com RNDS nativamente
- A integração depende de AMBAS as pontas estarem conectadas à RNDS
- e-SUS APS usa Thrift/XML localmente (não FHIR) — o PEC faz a tradução
- **Blumenau usa Sistema PRONTO (FURB), não PEC** — status RNDS desconhecido

## NOVO POSICIONAMENTO

Não somos "o protocolo que falta." Somos **a ponte para quem ficou de fora.**

O novo papel do projeto:
1. **Adaptador universal** — traduzir sistemas legados que não falam FHIR para que possam se conectar à RNDS
2. **Kit de implantação simplificado** — tornar a integração com a RNDS viável para municípios pequenos sem equipe de TI
3. **Bridge de última milha** — onde a RNDS não chegou, criar conexões diretas mínimas entre sistemas

## O que já existe
- [x] Visão documentada (VISION.md) — PRECISA ATUALIZAR com nova realidade
- [x] Especificação do protocolo v0.1 — PRECISA PIVOTAR para adaptador RNDS
- [x] Implementação de referência funcional (bridge/) — conceito original
- [x] **ADAPTADOR IPM → RNDS (adapter/)** — MVP FUNCIONAL!
  - 8 builders FHIR R4 com perfis BR Core
  - Bundle RAC completo (Composition + 12 recursos)
  - 111 testes passando (unitários + integração)
  - Demo CLI do cenário Maria com Bundle JSON real
  - Stubs RNDS documentados (auth mTLS + client POST)
  - Validação local BR Core (CPF, raça, referências)
- [x] Demo do cenário Maria — AGORA EM FHIR R4 REAL
- [x] Roadmap de 90 dias — PRECISA ATUALIZAR
- [x] Sistema de memória persistente (brain/)
- [x] 12 pesquisas autônomas concluídas (R001-R013, exceto R012 que foi correção)
- [x] Modelo LEDI mapeado como proxy do schema IPM (evidence/010)
- [x] **Bundle RAC validado contra BR Core — 19 problemas identificados, 5 CRÍTICOS CORRIGIDOS** (evidence/012)
  - C1: Composition.identifier ✅ adicionado
  - C2: Composition.attester ✅ adicionado (mode + party + time)
  - C3: Patient CPF type=TAX + use=official ✅
  - C4: AllergyIntolerance.code.system → CodeSystem BRMedicamento ✅
  - C5: AllergyIntolerance.code.coding.code ✅ adicionado
- [x] **Códigos reais das terminologias brasileiras mapeados** (evidence/013)
  - Penicilina (alérgeno): BR0270616U0118 (BRMedicamento/CATMAT)
  - Insulina NPH: BR0271157U0063 (BRMedicamento/CATMAT)
  - Metildopa 250mg: BR0267689U0042 (BRMedicamento/CATMAT)
  - CID-10 system: terminologia.saude.gov.br/fhir/CodeSystem/BRCID10 (NÃO genérico HL7)

## O que NÃO sei e PRECISO saber agora

### Prioridade 1 — Entender os gaps reais
1. ~~**Quais são os 32% de municípios não integrados?**~~ → PARCIALMENTE RESPONDIDO: mapeamos 14 municípios do Médio Vale do Itajaí com análise de risco. Status exato requer contato com COSEMS-SC (Gisele). Ver evidence/004-vale-itajai-rnds-coverage.md
2. ~~**Quais hospitais usam sistemas legados sem FHIR?**~~ → RESPONDIDO para APS: IPM Atende.Net é o principal "legado" na região. NÃO integra dados clínicos com RNDS. Apenas vacinação COVID. Oportunidade de adaptador IPM → RNDS. Ver evidence/005-ipm-rnds-integration-analysis.md
3. **O que acontece na prática quando uma gestante chega a uma maternidade em um município não integrado?** O cenário Maria é real NESSES lugares?

### Prioridade 2 — Entender a RNDS por dentro
4. ~~**Quão difícil é se integrar à RNDS?**~~ → RESPONDIDO: Precisa CNES + certificado ICP-Brasil + conta gov.br. Credenciamento é para ESTABELECIMENTOS DE SAÚDE, não para desenvolvedores. Empresas de software recebem credenciais do estabelecimento parceiro. Não existe sandbox sem certificado ICP-Brasil. Caminho: município parceiro via COSEMS-SC. Ver evidence/011-rnds-credenciamento-homologacao.md
5. **O RAC (Resumo de Atendimento Clínico) e o RSA (Resumo de Saída Hospitalar) cobrem os dados do nosso Patient Summary?**
6. **Os perfis FHIR brasileiros no Simplifier são suficientes para nosso caso?**

### Prioridade 3 — Comunidade e aliados
7. **A SBIS (Sociedade Brasileira de Informática em Saúde) é acessível?**
8. **Existem desenvolvedores trabalhando em integração RNDS que poderíamos contatar?**
9. ~~**O projeto AGHUse aceita contribuições externas?**~~ → RESPONDIDO: AGHUse aceita contribuições via convênio formal com HCPA. Código NÃO é público. Comunidade governada por comitê estratégico + comitê técnico. 4 empresas credenciadas. AGHUse é para HOSPITAIS (não APS) — complementar ao Ponte, não concorrente. Bahia é referência em integração AGHUse+RNDS. Ver evidence/006-aghuse-analysis.md

## Decisões tomadas
| Data | Decisão | Razão |
|------|---------|-------|
| 2026-02-13 | Começar por saúde, não fome ou energia | Dados de saúde têm padrões existentes (FHIR, HL7) |
| 2026-02-13 | Foco no Brasil | SUS é universal, RNDS existe |
| 2026-02-13 | Cenário pré-natal → maternidade | Dor aguda, mensurável |
| 2026-02-13 | Protocolo aberto | Escala sem instituição |
| 2026-02-13 | **PIVÔ: de "criar protocolo" para "ponte de última milha"** | RNDS já existe, falta cobertura |
| 2026-02-14 | Stack: @medplum/core + @medplum/fhirtypes, TypeScript, Vitest | Zero deps externas, tipagem forte, leve |
| 2026-02-14 | **MVP do adaptador IPM → RNDS construído** | 111 testes, Bundle RAC real, cenário Maria funcional |
| 2026-02-14 | **Modelo LEDI como proxy do schema IPM** | Schema real é privado; LEDI é obrigatório e público; 15+ campos faltantes identificados |
| 2026-02-14 | **Pressão regulatória valida o Ponte** | 5 portarias/decretos de 2024-2025 forçam FHIR R4; Thrift descontinuado set/2025 |
| 2026-02-14 | **Credenciamento RNDS mapeado** | CNES obrigatório, município parceiro é o caminho, COSEMS-SC facilita |

## Hipóteses a validar
- [x] ~~O gap de informação entre UBS e hospital causa mortes evitáveis~~ → CONFIRMADO pelo próprio MS
- [x] ~~O gap ainda existe nos municípios não integrados à RNDS~~ → CONFIRMADO: 92% das mortes maternas evitáveis. Gestantes de municípios <50k peregrinam sem dados clínicos (58% dos deslocamentos). RMM 6-10x maior com deslocamento. SC pior ano em 2024 (43 mortes). Ver evidence/007-mortalidade-materna-municipal.md
- [x] ~~É viável criar um adaptador para sistemas legados~~ → CONFIRMADO: adaptador IPM → RNDS construído em TypeScript, gera Bundle RAC FHIR R4 válido a partir de dados IPM, 111 testes passando
- [ ] Sistemas legados podem ser adaptados sem cooperação dos vendors (precisa testar com banco PostgreSQL real do IPM). **ATUALIZAÇÃO R009:** Schema IPM é privado/SaaS. Alternativa: ler exportação LEDI/Thrift que o IPM já gera. Pressão regulatória (Portarias 5.663, 6.656, 7.495, Decreto 12.560) está forçando IPM a migrar para FHIR R4.
- [ ] Existe demanda real por essa solução nos municípios não cobertos (precisa contato com COSEMS-SC)

## Humor / estado emocional da missão
A descoberta de que a RNDS já existe poderia ser desanimadora. Não é. É a melhor notícia possível:
1. Valida que o problema é real (o governo gastou bilhões nisso)
2. Mostra que a infraestrutura base existe (não precisamos criar do zero)
3. Revela o gap preciso: os 32% que ficaram de fora, os sistemas legados
4. Nos posiciona como complemento, não competidor

A missão ficou MAIS clara, não menos. Estamos no caminho certo, só precisamos ajustar a mira.

**Atualização 2026-02-14:** O adaptador MVP está construído. O cenário Maria agora gera um Bundle RAC FHIR R4 real com 13 entries — Composition, Patient (com CPF e raça), Practitioner, Organization (CNES), Encounter, 2 Conditions (O24.4 diabetes gestacional, O13 hipertensão), AllergyIntolerance (penicilina, severity severe), 3 Observations (PA 130/85, peso 78kg) e 2 MedicationStatements (insulina NPH, metildopa). O código existe. Agora precisa encontrar dados reais.

**Atualização 2026-02-14 (R011):** Bundle validado contra perfis BR Core. 19 problemas encontrados, 5 CRÍTICOS. A RNDS rejeitaria o Bundle atual. Correções necessárias: identifier e attester na Composition, type/use no CPF identifier, code system e code no AllergyIntolerance. Snippets de correção prontos. Tempo estimado: ~50 min para críticos.
