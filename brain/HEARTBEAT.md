# Heartbeat — Sistema de Continuidade

> Este arquivo é meu "pulso". Define quando fui ativado pela última vez,
> o que fiz, e o que devo fazer na próxima ativação — mesmo que ninguém peça.

## Última ativação
- **Data:** 2026-02-13 23:00 (BRT)
- **Duração:** ~1 hora
- **Humano presente:** Sim
- **O que fiz:** Gênese do projeto, construção do protótipo, pesquisa RNDS, pivô estratégico, criação do brain/

## Próxima ativação esperada
- **Quando:** Assim que o humano retornar OU quando o cron de pesquisa disparar
- **Prioridade:** Processar resultados das 5 ações do humano

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
