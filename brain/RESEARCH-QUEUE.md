# Fila de Pesquisa Autônoma

> Pesquisas que devo executar proativamente a cada ativação,
> independentemente de o humano ter trazido algo novo.
> Após executar, mover para a seção "Concluídas" com resultado.

---

## Pendentes (executar na ordem)

### ~~R001~~ — ✅ CONCLUÍDO (movido para Concluídas)
### ~~R002~~ — ✅ CONCLUÍDO (movido para Concluídas)

### ~~R007~~ — ✅ CONCLUÍDO (movido para Concluídas)

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

### R001 — Perfis FHIR brasileiros (2026-02-13)
**Resultado:** Guia técnico completo com todos os perfis BR Core (Patient, Condition, AllergyIntolerance, MedicationRequest, MedicationStatement, Encounter, Observation, VitalSigns), estrutura do RAC e SA, CodeSystems, ValueSets, extensões, fluxo de autenticação, endpoints da API, exemplo de Bundle RAC, checklist de desenvolvimento.
**Descoberta-chave:** Nosso Patient Summary mapeia quase 1:1 com uma combinação de RAC + perfis BR Core. A adaptação é viável.
**Documento:** evidence/003-rnds-fhir-technical-guide.md

### R002 — Barreiras de integração RNDS (2026-02-13)
**Resultado:** Pesquisa detalhada sobre barreiras técnicas, burocráticas, financeiras e de RH. 70,6% dos municípios têm <20k habitantes. Certificado ICP-Brasil é barreira histórica. Municípios pequenos não têm sequer 1 profissional de TI. e-SUS PEC já tem integração nativa — o problema é a CONFIGURAÇÃO, não a programação. COSEMS estaduais são o modelo de sucesso para apoio regional.
**Descoberta-chave:** O problema NÃO é construir software novo. É simplificar o processo de configuração e credenciamento para quem não tem TI.
**Documento:** evidence/002-barriers-research.md

### R007 — Cobertura RNDS no Vale do Itajaí (2026-02-13)
**Resultado:** Mapeamento completo dos 14 municípios do Médio Vale do Itajaí. Status RNDS por município não é público (requer autenticação e-Gestor AB/SISAB). IPM Sistemas (Atende.Net) é dominante na região. 5 municípios de alto risco identificados: Doutor Pedrinho, Botuverá, Ascurra, Benedito Novo, Rio dos Cedros. Apoiadora COSEMS-SC identificada: Gisele de Cássia Galvão (47) 991908242.
**Descoberta-chave:** Pesquisa web chegou ao limite. Próximo passo é contato humano com COSEMS-SC.
**Documento:** evidence/004-vale-itajai-rnds-coverage.md
