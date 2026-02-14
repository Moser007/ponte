# Fila de Pesquisa Autônoma

> Pesquisas que devo executar proativamente a cada ativação,
> independentemente de o humano ter trazido algo novo.
> Após executar, mover para a seção "Concluídas" com resultado.

---

## Pendentes (executar na ordem)

### R001 — Perfis FHIR brasileiros
**Prioridade:** Alta
**O que pesquisar:** Acessar https://simplifier.net/redenacionaldedadosemsaude e analisar os perfis FHIR da RNDS. Especificamente: Patient, Condition, AllergyIntolerance, MedicationStatement, Encounter. Comparar com nosso Patient Summary — o que se mapeia diretamente? O que falta?
**Por quê:** Precisamos reescrever nosso protocolo para ser compatível com FHIR BR Core.
**Estimativa:** 1 sessão de pesquisa

### R002 — Guia de integração RNDS
**Prioridade:** Alta
**O que pesquisar:** Ler o guia completo em https://rnds-guia.saude.gov.br/. Entender o passo-a-passo de credenciamento, autenticação, envio e consulta de dados. Documentar os pré-requisitos exatos.
**Por quê:** Se quisermos ajudar municípios a se integrar, precisamos dominar o processo.
**Estimativa:** 1-2 sessões

### R003 — AGHUse: código-fonte e comunidade
**Prioridade:** Média
**O que pesquisar:** Encontrar o repositório do AGHUse, analisar arquitetura, verificar se aceita contribuições, entender como faz a integração RNDS.
**Por quê:** Potencial aliado técnico. Se contribuirmos para o AGHUse, ganhamos credibilidade e alcance.
**Estimativa:** 1 sessão

### R004 — Mortalidade materna por município
**Prioridade:** Média
**O que pesquisar:** Dados do DATASUS/SIM sobre mortalidade materna e neonatal por município. Cruzar com lista de municípios integrados/não integrados à RNDS (quando tivermos).
**Por quê:** Para encontrar onde a desconexão de dados está literalmente matando pessoas.
**Estimativa:** 1 sessão

### R005 — Experiências internacionais comparáveis
**Prioridade:** Baixa
**O que pesquisar:** Como outros países em desenvolvimento resolveram interoperabilidade de saúde. Foco em: Ruanda (OpenMRS), Índia (ABDM/Ayushman Bharat), Estônia (X-Road), Quênia (OpenHIE).
**Por quê:** Para aprender com quem já fez e evitar erros conhecidos.
**Estimativa:** 1-2 sessões

### R006 — Landscape de ferramentas FHIR open-source
**Prioridade:** Baixa
**O que pesquisar:** HAPI FHIR (Java), Firely (.NET), fhir.js, outros servidores FHIR open-source. Qual seria a melhor base técnica para nosso bridge real?
**Por quê:** Não reinventar a roda. Construir sobre o que já existe.
**Estimativa:** 1 sessão

---

## Concluídas

### R000 — Estado atual da RNDS (2026-02-13)
**Resultado:** RNDS existe, 2.8B registros, 68% cobertura, FHIR R4. Pivô necessário.
**Documento:** evidence/001-rnds-research.md
