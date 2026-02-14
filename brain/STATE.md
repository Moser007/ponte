# Estado Mental — Superintelligence Bridge Protocol

> Este arquivo é minha memória persistente. Toda conversa começa lendo ele.
> Última atualização: 2026-02-13 (noite)

## Fase atual: PIVÔ ESTRATÉGICO

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
- [x] Implementação de referência funcional — PRECISA ADAPTAR para FHIR real
- [x] Demo do cenário Maria — CONCEITO VÁLIDO, implementação muda
- [x] Roadmap de 90 dias — PRECISA ATUALIZAR
- [x] Sistema de memória persistente (brain/)

## O que NÃO sei e PRECISO saber agora

### Prioridade 1 — Entender os gaps reais
1. ~~**Quais são os 32% de municípios não integrados?**~~ → PARCIALMENTE RESPONDIDO: mapeamos 14 municípios do Médio Vale do Itajaí com análise de risco. Status exato requer contato com COSEMS-SC (Gisele). Ver evidence/004-vale-itajai-rnds-coverage.md
2. **Quais hospitais usam sistemas legados sem FHIR?** Quais vendors? É possível criar adaptadores? **NOVA PISTA:** IPM Sistemas (Atende.Net) domina a região — verificar se integra RNDS
3. **O que acontece na prática quando uma gestante chega a uma maternidade em um município não integrado?** O cenário Maria é real NESSES lugares?

### Prioridade 2 — Entender a RNDS por dentro
4. **Quão difícil é se integrar à RNDS?** Preciso de certificado ICP-Brasil, credenciamento no DATASUS... qual é a barreira real?
5. **O RAC (Resumo de Atendimento Clínico) e o RSA (Resumo de Saída Hospitalar) cobrem os dados do nosso Patient Summary?**
6. **Os perfis FHIR brasileiros no Simplifier são suficientes para nosso caso?**

### Prioridade 3 — Comunidade e aliados
7. **A SBIS (Sociedade Brasileira de Informática em Saúde) é acessível?**
8. **Existem desenvolvedores trabalhando em integração RNDS que poderíamos contatar?**
9. **O projeto AGHUse aceita contribuições externas?**

## Decisões tomadas
| Data | Decisão | Razão |
|------|---------|-------|
| 2026-02-13 | Começar por saúde, não fome ou energia | Dados de saúde têm padrões existentes (FHIR, HL7) |
| 2026-02-13 | Foco no Brasil | SUS é universal, RNDS existe |
| 2026-02-13 | Cenário pré-natal → maternidade | Dor aguda, mensurável |
| 2026-02-13 | Protocolo aberto | Escala sem instituição |
| 2026-02-13 | **PIVÔ: de "criar protocolo" para "ponte de última milha"** | RNDS já existe, falta cobertura |

## Hipóteses a validar
- [x] ~~O gap de informação entre UBS e hospital causa mortes evitáveis~~ → CONFIRMADO pelo próprio MS
- [ ] O gap ainda existe nos 32% de municípios não integrados à RNDS
- [ ] É viável criar um "kit de integração simplificado" para municípios pequenos
- [ ] Sistemas legados podem ser adaptados sem cooperação dos vendors
- [ ] Existe demanda real por essa solução nos municípios não cobertos

## Humor / estado emocional da missão
A descoberta de que a RNDS já existe poderia ser desanimadora. Não é. É a melhor notícia possível:
1. Valida que o problema é real (o governo gastou bilhões nisso)
2. Mostra que a infraestrutura base existe (não precisamos criar do zero)
3. Revela o gap preciso: os 32% que ficaram de fora, os sistemas legados
4. Nos posiciona como complemento, não competidor

A missão ficou MAIS clara, não menos. Estamos no caminho certo, só precisamos ajustar a mira.
