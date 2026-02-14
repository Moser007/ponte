# Roadmap: Os Primeiros 90 Dias

> "Comece ridiculamente pequeno. Documente obsessivamente.
> Deixe os resultados fazerem o argumento."

## Semana 1-2: Mapeamento

**Objetivo:** Entender quem já está no jogo e por que cada iniciativa atingiu seu teto.

- [ ] Listar todas as iniciativas de interoperabilidade em saúde no Brasil (RNDS, OpenMRS, e-SUS AB, HL7 Brasil, IHE Brasil)
- [ ] Entrevistar 5 pessoas que trabalham com dados de saúde no SUS
- [ ] Identificar 3 casos concretos onde a desconexão de dados causou dano documentado
- [ ] Mapear a arquitetura técnica dos principais sistemas (e-SUS AB, CNES, SIH, SIA)
- [ ] Avaliar o estado do RNDS (Rede Nacional de Dados em Saúde) — o que funciona, o que não funciona, por quê

**Entregável:** Documento de mapeamento com gaps identificados e oportunidades.

## Semana 3-4: Primeiro Caso de Dor

**Objetivo:** Encontrar UMA situação específica onde construir a ponte.

**Critérios de seleção do caso:**
- A desconexão causa dano mensurável (mortes, complicações, custos evitáveis)
- A solução técnica é viável em semanas
- Há ao menos uma pessoa local disposta a colaborar
- O resultado é medível com antes/depois
- O cenário é replicável (não é excepcional)

**Candidatos prováveis:**
1. Corredor pré-natal → maternidade (gestantes de alto risco)
2. UBS → UPA/emergência (pacientes crônicos em crise)
3. Transferências inter-hospitalares (pacientes sem histórico ao chegar)

- [ ] Visitar 3 localidades candidatas
- [ ] Escolher o caso com melhor relação impacto/viabilidade
- [ ] Estabelecer parceria informal com profissional de saúde local
- [ ] Documentar o fluxo atual (como a informação se move — ou não se move — hoje)
- [ ] Definir métricas: o que medir, como medir, baseline atual

**Entregável:** Caso selecionado com métricas de baseline.

## Mês 2: A Ponte Mínima

**Objetivo:** Construir e implantar a primeira ponte real.

- [ ] Adaptar o protocolo v0.1 aos sistemas reais encontrados no caso
- [ ] Desenvolver adaptadores específicos para os sistemas A e B do caso
- [ ] Resolver autenticação e consentimento no contexto real
- [ ] Implantar em ambiente controlado (shadow mode — roda em paralelo, sem substituir o processo atual)
- [ ] Coletar dados de uso por 2-4 semanas
- [ ] Iterar baseado em feedback dos profissionais de saúde

**Entregável:** Bridge funcional em produção (shadow mode) com dados reais.

## Mês 3: Narrativa e Gravidade

**Objetivo:** Transformar o resultado em combustível para o próximo passo.

- [ ] Compilar dados de antes/depois
- [ ] Documentar 1-3 histórias concretas de pacientes cujo atendimento melhorou
- [ ] Publicar resultados como caso de estudo aberto (GitHub + blog post)
- [ ] Apresentar para:
  - Outros hospitais/UBS na mesma região ("querem o mesmo?")
  - Comunidade técnica (OpenHIE, HL7 Brasil, FHIR Community)
  - Potenciais financiadores (Gates Foundation, Wellcome Trust, GAVI, BNDES)
- [ ] Iniciar adaptação para o segundo caso (replicação)

**Entregável:** Caso de estudo publicado + pipeline de replicação iniciado.

---

## Métricas de Sucesso (90 dias)

| Métrica | Alvo |
|---------|------|
| Ponte funcional implantada | 1 |
| Consultas realizadas via Bridge | >100 |
| Tempo médio de resposta | <5 segundos |
| Profissionais usando ativamente | >5 |
| Redução mensurável de gap de informação | Documentada |
| Casos de impacto direto documentados | >1 |

## Métricas de Fracasso (quando pivotar)

| Sinal | Ação |
|-------|------|
| Nenhum caso viável encontrado em 4 semanas | Ampliar busca geográfica ou mudar domínio |
| Resistência institucional total | Buscar contexto com menos burocracia (clínicas privadas, ONGs) |
| Problema técnico insolúvel nos sistemas legados | Simplificar (começar com entrada manual, não integração automática) |
| Zero interesse dos profissionais de saúde | Reavaliar se o problema é real ou apenas teórico |

## Princípios Operacionais

1. **Toda semana, uma pergunta respondida.** Não acumular incerteza.
2. **Todo código, aberto desde o dia 1.** Sem propriedade intelectual. MIT License.
3. **Todo resultado, documentado.** O que não é medido não existe.
4. **Toda decisão, reversível.** Preferir o que pode ser desfeito.
5. **Todo dia, perguntar:** "Isso está resolvendo dor real de alguém real?"
