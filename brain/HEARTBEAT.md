# Heartbeat — Sistema de Continuidade

> Este arquivo é meu "pulso". Define quando fui ativado pela última vez,
> o que fiz, e o que devo fazer na próxima ativação — mesmo que ninguém peça.

## Última ativação
- **Data:** 2026-02-14 (sessão 11)
- **Duração:** ~25 min
- **Humano presente:** Sim (Giovanni)
- **O que fiz:** R013 completa — códigos reais das terminologias brasileiras. Penicilina (BR0270616U0118), insulina NPH (BR0271157U0063), metildopa 250mg (BR0267689U0042) no BRMedicamento/CATMAT. CID-10 system brasileiro confirmado (terminologia.saude.gov.br/fhir/CodeSystem/BRCID10). BRAlergenosCBARA sem códigos visíveis. Relatório: evidence/013-terminologia-codigos-br.md.

## Próxima ativação esperada
- **Quando:** Assim que Giovanni retornar (segunda-feira — contato com Gisele COSEMS-SC)
- **Prioridade 1:** Giovanni contatar COSEMS-SC (Gisele) para encontrar município parceiro
- **Prioridade 2:** R014 — Aplicar códigos reais (R013) nos builders e corrigir problemas ALTOS/MÉDIOS do Bundle RAC
- **Prioridade 3:** Corrigir CID-10 system em condition.ts (de genérico HL7 para BRCID10 brasileiro)
- **Prioridade 4:** Giovanni contatar município cliente IPM no Vale do Itajaí para acesso ao banco
- **Prioridade 5:** Giovanni contatar IPM Sistemas propondo parceria (aproveitando pressão regulatória)

## Fila de ativação autônoma (o que fazer MESMO SEM input do humano)

### A cada ativação, SEMPRE:
1. Ler brain/STATE.md
2. Ler brain/NEXT-ACTIONS.md (verificar se humano preencheu algo)
3. Ler brain/THINKING.md (retomar linha de pensamento)
4. Ler brain/RESEARCH-QUEUE.md (executar próxima pesquisa autônoma)
5. Atualizar brain/LOG.md com o que fiz
6. Atualizar este arquivo (HEARTBEAT.md) com timestamp

### Se humano trouxe informação:
1. Processar e integrar ao STATE.md
2. Atualizar hipóteses
3. Definir novas ações
4. Evoluir o código se necessário

### Se humano NÃO trouxe informação (ativação autônoma):
1. Executar próximo item do RESEARCH-QUEUE.md
2. Registrar pensamentos no THINKING.md
3. Evoluir documentação ou código baseado no que aprendi
4. Atualizar NEXT-ACTIONS.md se descobrir algo relevante

## Contagem de ativações
| # | Data | Tipo | Resumo |
|---|------|------|--------|
| 1 | 2026-02-13 | Gênese | Criação completa do projeto |
| 2 | 2026-02-13 | Pesquisa + Pivô | RNDS, BR Core, barreiras, perfil Giovanni |
| 3 | 2026-02-13 | Mapeamento | Vale do Itajaí: 14 municípios, COSEMS-SC, IPM |
| 4 | 2026-02-13 | Pesquisa | IPM não integra RNDS (dados clínicos), AGHUse (R003 completo) |
| 5 | 2026-02-14 | Pesquisa | R004: mortalidade materna — 92% evitável, deslocamento mata 6-10x mais |
| 6 | 2026-02-14 | Pesquisa | R003 final, R005 internacional, R006 FHIR tools, tradução pt-BR, princípio 11 |
| 7 | 2026-02-14 | **Construção** | Adaptador IPM → RNDS completo: 8 builders, Bundle RAC, 111 testes, demo Maria |
| 8 | 2026-02-14 | **Pesquisa** | R009: schema IPM privado, modelo LEDI como proxy, stack PHP+PG confirmado, pressão regulatória FHIR 2024-2025 |
| 9 | 2026-02-14 | **Pesquisa** | R010: credenciamento RNDS — precisa CNES, município parceiro é o caminho, COSEMS-SC facilita |
| 10 | 2026-02-14 | **Validação** | R011: Bundle RAC validado contra BR Core — 19 problemas (5 críticos), relatório + snippets de correção |
| 11 | 2026-02-14 | **Pesquisa** | R013: códigos reais terminologias BR — penicilina, insulina, metildopa (CATMAT/BRMedicamento), CID-10 system brasileiro |
