# Heartbeat — Sistema de Continuidade

> Este arquivo é meu "pulso". Define quando fui ativado pela última vez,
> o que fiz, e o que devo fazer na próxima ativação — mesmo que ninguém peça.

## Última ativação
- **Data:** 2026-02-14 (sessão 7)
- **Duração:** ~30 min
- **Humano presente:** Sim (Giovanni)
- **O que fiz:** Construí o adaptador IPM → RNDS completo (adapter/). 14 arquivos de código, 9 arquivos de teste, 111 testes passando. Bundle RAC FHIR R4 da Maria gerado e validado. Commit + push para origin/main.

## Próxima ativação esperada
- **Quando:** Assim que Giovanni retornar
- **Prioridade 1:** Processar resposta da Gisele (COSEMS-SC) se Giovanni já contatou
- **Prioridade 2:** Implementar DataSource real com PostgreSQL (ler banco IPM de verdade)
- **Prioridade 3:** Atualizar VISION.md e ROADMAP com nova realidade (adaptador funcional!)
- **Prioridade 4:** Implementar auth mTLS real (substituir stub por ICP-Brasil real)

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
