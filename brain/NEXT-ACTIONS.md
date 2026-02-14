# Próximas Ações — Para Giovanni (Ponte Humana)

> Recalibradas após descobrir o perfil do Giovanni.
> Última atualização: 2026-02-13

## PERFIL DO GIOVANNI
- Desenvolvedor (IA), advogado, corretor de seguros
- Mora nos USA, família e negócios em Blumenau, SC
- Tem API WhatsApp (apiwts.top)
- GitHub: Moser007

---

## SPRINT ATUAL: Conseguir Acesso à RNDS Homologação (Semana 2-4)

### MARCO ALCANÇADO: Adaptador MVP Construído (2026-02-14)
O adaptador IPM → RNDS está funcional com dados mock (cenário Maria). 111 testes passando. Bundle RAC FHIR R4 real gerado.

### MARCO ALCANÇADO: Credenciamento RNDS Mapeado (2026-02-14)
Processo completo documentado. Descoberta: Giovanni NÃO pode se credenciar sozinho (precisa CNES). Caminho: município parceiro via COSEMS-SC.

### BLOCKER ATUAL: Sem CNES, sem acesso à RNDS
O código está pronto. A barreira agora é 100% burocrática/relacional: precisamos de um município parceiro.

---

### Ação 0 — [PRIORIDADE MÁXIMA] Contatar COSEMS-SC para município parceiro
**O que fazer:** Contatar Gisele do COSEMS-SC ou a sede do COSEMS-SC para encontrar um município do Vale do Itajaí que use IPM e queira testar o adaptador Ponte.
**Contatos:**
- **Gisele de Cássia Galvão** (apoiadora Médio Vale do Itajaí): (47) 991908242 | gisele.apoiadoracosems@gmail.com
- **COSEMS-SC sede:** (48) 3364-4003 | cosemssc@cosemssc.org.br
**Mensagem sugerida:** "Olá, sou Giovanni Moser, desenvolvedor e advogado. Estou construindo o Ponte, um projeto open-source (MIT) que cria um adaptador para conectar o sistema IPM Atende.Net à RNDS para dados clínicos. Precisamos de um município parceiro no Vale do Itajaí que use IPM e esteja disposto a: (1) fazer o credenciamento no portal DATASUS para homologação RNDS, e (2) compartilhar as credenciais conosco para testarmos o adaptador. O Ponte é gratuito e ajuda o município a cumprir as portarias 5.663/2024 e 7.495/2025. O COSEMS pode indicar um município interessado?"
**Por que você:** Você tem rede local e a Gisele já foi identificada como apoiadora regional.
**Status:** [ ] Pendente
**Resultado:** (preencher)

---

### Ação 1 — [ADVOGADO] Análise LGPD para dados de saúde
**O que fazer:** Como advogado, analisar a viabilidade legal do projeto sob a LGPD.
**Perguntas específicas:**
- O Decreto 12.560/2025 cobre o compartilhamento de dados de saúde dentro da RNDS. E fora dela (nossa ponte)?
- Dados de saúde podem trafegar via WhatsApp com consentimento do paciente?
- Qual é o modelo de consentimento necessário? Opt-in explícito? Termo assinado?
- Existe base legal para tratamento de dados de saúde para fins de continuidade do cuidado (Art. 7, VIII e Art. 11, II, f da LGPD)?
- A ANPD já se pronunciou sobre interoperabilidade em saúde?
**Por que você:** Você é advogado. Isso é algo que você pode avaliar melhor que qualquer pesquisa que eu faça.
**Status:** [ ] Pendente
**Resultado:** (preencher)

### Ação 2 — [FAMÍLIA] Contato inicial em Blumenau
**O que fazer:** Perguntar na sua rede familiar/pessoal em Blumenau se alguém conhece profissional de saúde que trabalha em UBS ou hospital público na região do Vale do Itajaí.
**A pergunta mágica:** "Você conhece alguém que trabalha no SUS aqui na região? Médico, enfermeiro, alguém da secretaria de saúde? Estou trabalhando num projeto de tecnologia para saúde pública."
**Por que você:** Você tem rede local em Blumenau. Uma apresentação pessoal vale mais que 100 cold emails.
**Status:** [ ] Pendente
**Resultado:** (preencher)

### Ação 3 — [DESENVOLVEDOR] Verificar cobertura RNDS no Vale do Itajaí
**O que fazer:** ~~Acessar painéis do DATASUS~~ → **CONTATAR GISELE DO COSEMS-SC**
**Status:** [~] Parcialmente concluída pelo Ponte (pesquisa web)
**Resultado da pesquisa web (Ponte):**
- 14 municípios mapeados com população, UBS e sistema de saúde
- Status RNDS por município NÃO é público (requer autenticação)
- IPM Sistemas (Atende.Net) dominante na região
- 5 municípios de alto risco: Doutor Pedrinho, Botuverá, Ascurra, Benedito Novo, Rio dos Cedros
- Documento completo: evidence/004-vale-itajai-rnds-coverage.md

**PRÓXIMO PASSO (Giovanni):**
Mandar WhatsApp para **Gisele de Cássia Galvão** (apoiadora COSEMS-SC Médio Vale do Itajaí):
- **WhatsApp:** (47) 991908242
- **Email:** gisele.apoiadoracosems@gmail.com
- **Mensagem sugerida:** "Olá Gisele, tudo bem? Sou Giovanni Moser, desenvolvedor de tecnologia e advogado. Estou trabalhando num projeto open-source (Ponte) para ajudar municípios pequenos a se integrarem à RNDS. Gostaria de saber: quais municípios do Médio Vale do Itajaí já estão enviando dados para a RNDS e quais ainda não estão? Seria possível uma conversa rápida?"

### Ação 4 — [CORRETOR DE SEGUROS] Avaliar ângulo saúde suplementar
**O que fazer:** Como corretor de seguros, avaliar se existe oportunidade no Open Health Brasil para o Ponte.
**Perguntas:**
- O Open Health vai exigir interoperabilidade entre operadoras e SUS?
- Operadoras menores em SC teriam interesse em um adaptador FHIR?
- Existe gap de mercado aqui que pode gerar receita para sustentar o projeto?
**Por que você:** Você conhece o mercado de seguros. Pode ver oportunidades que eu não vejo.
**Status:** [ ] Pendente
**Resultado:** (preencher)

### Ação 5 — [DESENVOLVEDOR] Explorar o apiwts.top como canal
**O que fazer:** Avaliar a viabilidade de usar sua API WhatsApp como interface do Bridge.
**Cenário a validar:** Um médico manda mensagem para um número de WhatsApp com CPF do paciente e recebe de volta o resumo de saúde formatado.
**Perguntas técnicas:**
- A API suporta receber e responder mensagens automaticamente?
- Suporta formatação rica (bold, listas)?
- Qual é o custo por mensagem?
- Existe log/auditoria das mensagens?
**Status:** [ ] Pendente
**Resultado:** (preencher)

---

## REGRAS ATUALIZADAS

1. **Use suas múltiplas habilidades.** Você não é só desenvolvedor — é advogado, corretor, e tem rede local. Cada ação usa um "chapéu" diferente.
2. **Blumenau e Vale do Itajaí são nosso laboratório.** Foco geográfico definido.
3. **Uma conversa real com um profissional do SUS local é a ação mais valiosa.** Se conseguir uma, tudo muda.
4. **Documente tudo aqui.** Preencha os campos "Resultado" com o que descobrir.
5. **Se algo mudar o jogo — me conte imediatamente.** Ex: "meu primo é enfermeiro numa UBS de Gaspar" ou "o Open Health vai exigir FHIR até 2027".
