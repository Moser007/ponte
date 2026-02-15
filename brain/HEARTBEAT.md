# Heartbeat — Sistema de Continuidade

> Este arquivo é meu "pulso". Define quando fui ativado pela última vez,
> o que fiz, e o que devo fazer na próxima ativação — mesmo que ninguém peça.

## Última ativação
- **Data:** 2026-02-15 18:35 EST (sessão 27, Giovanni presente)
- **Duração:** ~20 min
- **Humano presente:** Sim (Giovanni: "continue trabalhando")
- **O que fiz:** Commitado e pushado todo trabalho pendente das sessões 19-25 (3 commits). Implementado cliente RNDS real: RndsAuthReal (mTLS ICP-Brasil + cache JWT 25min), RndsClientReal (POST Bundle + headers RNDS + OperationOutcome), HttpTransport injetável para testes, RndsConfig com endpoints homologação/produção. @types/node adicionado. 343 testes em 22 arquivos.

## Próxima ativação esperada
- **Quando:** Próxima ativação autônoma em ~6h ou quando Giovanni retornar
- **Prioridade 1:** Giovanni contatar COSEMS-SC (Gisele) para encontrar município parceiro — **BLOCKER ABSOLUTO**
- **Prioridade 2:** Giovanni avaliar Edital SEIDIGI 01/2026 — submissão por email até 20/fev (**FALTAM 5 DIAS!**). Email: lab.inovasusdigital@saude.gov.br. Posso preparar proposta em 30 min se Giovanni decidir submeter
- **Prioridade 3:** Giovanni contatar congresso@cosemssc.org.br para modalidade remota ANTES de se inscrever (1o lote R$250 até 19/fev — **FALTAM 4 DIAS**)
- **Prioridade 4:** Giovanni contatar município cliente IPM no Vale do Itajaí para acesso a arquivo .esus de teste
- **Prioridade 5 (autônoma):** ~~Analisar Manual de Integração RNDS de MG~~ — PDF inacessível, mas detalhes técnicos obtidos de outras fontes
- **Prioridade 6 (autônoma):** Construir "homologation kit" CLI (auth mTLS → envio → captura evidências) — base pronta (RndsAuthReal + RndsClientReal)

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
| 12 | 2026-02-14 | **Correção** | R014: todos os 19 problemas BR Core corrigidos, URIs canônicos, códigos CATMAT reais, 114 testes |
| 13 | 2026-02-14 | **Construção + Pesquisa** | DUM + obstétrico no Bundle (18 entries), R015 regulamentações RNDS 2025-2026, demo corrigido, 145 testes |
| 14 | 2026-02-14 | **Pesquisa** | R016: SAO completo — 4 blocos, 8 cenários, FHIR não publicado, BR Core building blocks, decisão: NÃO gerar SAO (foco APS) |
| 15 | 2026-02-14 | **Construção** | Validação CNS/CNES, mock data corrigidos, README, cenário mínimo (José), 163 testes em 12 arquivos |
| 16 | 2026-02-14 | **Pesquisa + Construção** | R018 LEDI/Thrift completa, edge cases, encounter type mapping, 196 testes em 14 arquivos |
| 17 | 2026-02-15 | **Pesquisa** | R020 SBIS concluída, Edital SEIDIGI 01/2026 descoberto (prazo 20/fev!) |
| 18 | 2026-02-15 | **Configuração** | Cron job alterado de 1h → 6h, Patient telecom/address, 201 testes |
| 19 | 2026-02-15 | **Autônoma** | R019 LEDI/Thrift já implementada (verificação), 275 testes em 18 arquivos |
| 20 | 2026-02-15 | **Autônoma** | Abstract CBIS 2026 rascunhado, contagem testes atualizada (175→275) em one-pager e README |
| 21 | 2026-02-15 | **Autônoma** | Pesquisa SEIDIGI 01/2026 (detalhes submissão), insights Via C, estratégia COSEMS-SC remoto, checklist deliverables |
| 22 | 2026-02-15 | **Autônoma** | README.md principal reescrito (diagrama Mermaid, 275 testes, conformidade BR Core, contexto regulatório) |
| 23 | 2026-02-15 | **Autônoma** | CI/CD GitHub Actions criado (.github/workflows/ci.yml — Node 20+22, build+test) |
| 24 | 2026-02-15 | **Autônoma** | Verificação estado, contagem 318 testes confirmada, adapter/README e STATE atualizados |
| 25 | 2026-02-15 | **Autônoma** | Pesquisa fluxo homologação RNDS, 3 evidências mapeadas, Manual MG descoberto, ideia homologation kit CLI |
| 26 | 2026-02-15 | **Autônoma** | Manual MG inacessível (PDF visual). Confirmou detalhes API RNDS via Postman collection kyriosdata + Betha. Validou stubs existentes |
| 27 | 2026-02-15 | **Construção** | Cliente RNDS real (mTLS + JWT cache + POST Bundle), HttpTransport injetável, 343 testes em 22 arquivos. Commits das sessões 19-25 pushados |
