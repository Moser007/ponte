# Pitch para Gisele — COSEMS-SC

> Contato: Gisele de Cássia Galvão (apoiadora regional Médio Vale do Itajaí)
> WhatsApp: (47) 991908242
> Email: gisele.apoiadoracosems@gmail.com
> Quando: Segunda-feira, 17/02/2026

---

## 1. Mensagem inicial (WhatsApp)

Manter curta. Gisele recebe dezenas de mensagens por dia. O objetivo é conseguir uma ligação ou reunião, não explicar tudo por texto.

```
Bom dia, Gisele! Tudo bem?

Meu nome é Giovanni Moser, sou desenvolvedor de tecnologia e advogado.
Tenho família em Blumenau e estou trabalhando num projeto open-source
chamado Ponte — um adaptador gratuito que conecta o sistema IPM Atende.Net
à RNDS para envio de dados clínicos (RAC).

Sabemos que as portarias recentes (5.663/2024, 7.495/2025) estão
exigindo integração RNDS, e que o IPM ainda não envia dados clínicos.
Nosso adaptador resolve isso.

Precisamos de um município parceiro no Vale do Itajaí que use IPM
para testarmos na homologação RNDS. O COSEMS poderia indicar algum?

Posso explicar melhor por ligação se preferir. Obrigado!
```

---

## 2. Se ela responder pedindo mais detalhes (texto)

```
Claro! Em resumo:

- O IPM Atende.Net é usado por 120+ municípios em SC, mas só envia
  vacinação COVID para a RNDS. Dados clínicos (pré-natal, diagnósticos,
  alergias, medicamentos) não são enviados.

- Isso significa que quando uma gestante de um município com IPM chega
  numa maternidade de referência, o médico não tem acesso ao histórico
  dela na RNDS.

- O Ponte é um adaptador que lê os dados do IPM e traduz para FHIR R4
  (formato da RNDS). É gratuito, open-source (licença MIT), e já está
  funcional com 114 testes automatizados.

- Precisamos de um município que: (1) use IPM, (2) queira fazer o
  credenciamento de homologação no DATASUS, e (3) nos dê acesso às
  credenciais para testar o envio.

- O município ganha: conformidade com as portarias federais + dados
  clínicos dos pacientes disponíveis na RNDS + custo zero.

O projeto está no GitHub: github.com/Moser007/ponte
```

---

## 3. Se ela topar uma ligação — roteiro da conversa

### Abertura (2 min)
- "Gisele, obrigado por atender. Vou ser breve."
- Apresentar-se: desenvolvedor com experiência em IA, advogado, família em Blumenau
- "Vi que o COSEMS-SC fez oficinas de integração RNDS em agosto passado. Excelente trabalho."

### O problema (2 min)
- "Você sabe melhor que eu: quantos municípios do Vale do Itajaí ainda não enviam dados clínicos para a RNDS?"
- **Deixar ela falar.** Ela tem informação que não temos.
- Se ela confirmar o gap: "Exatamente. E com as portarias 5.663 e 7.495, os municípios estão sendo pressionados."
- Se ela minimizar: "Entendo. Você sabe se os municípios que usam IPM Atende.Net estão enviando RAC para a RNDS?"

### A solução (3 min)
- "Construímos um adaptador open-source que traduz dados do IPM para FHIR R4 e envia como RAC para a RNDS."
- "Já está funcional: gera Bundle RAC com Patient, Encounter, Condition (CID-10), AllergyIntolerance, medicamentos, sinais vitais. Tudo conforme BR Core."
- "É gratuito, MIT license. O código está no GitHub."
- "O que falta: testar com dados reais na homologação RNDS. E para isso precisamos de um município parceiro."

### O pedido (2 min)
- "Você poderia indicar um município no Vale do Itajaí que use IPM e esteja interessado?"
- "Idealmente um município pequeno, que ainda não integra dados clínicos com a RNDS."
- "O que precisamos do município: fazer o credenciamento de homologação no portal DATASUS e compartilhar as credenciais conosco."
- "Em troca, o município ganha a integração RNDS funcionando — sem custo."

### Perguntas para fazer a ela
1. "Quais municípios do Médio Vale do Itajaí já estão enviando dados para a RNDS?"
2. "Os que usam IPM estão entre os integrados ou não?"
3. "O COSEMS tem algum programa ou iniciativa para apoiar municípios na integração RNDS?"
4. "Existe algum secretário de saúde na região que seria receptivo a esse tipo de projeto?"
5. "O COSEMS estaria disposto a ser parceiro institucional do Ponte?"

### Encerramento
- "Gisele, posso te mandar um resumo por email com o link do projeto?"
- "Se souber de algum município interessado, pode me passar o contato que eu mesmo ligo."
- Agradecer e deixar porta aberta.

---

## 4. Se ela indicar um município — próximo passo

Contatar o secretário de saúde ou responsável de TI do município indicado. Mensagem:

```
Bom dia! Meu nome é Giovanni Moser, fui indicado pela Gisele do COSEMS-SC.

Estou desenvolvendo o Ponte, um adaptador open-source e gratuito que
conecta o IPM Atende.Net à RNDS para envio de dados clínicos (RAC).

Gostaria de conversar sobre a possibilidade de [município] ser nosso
município piloto. O benefício: conformidade com as portarias federais
de integração RNDS, sem custo.

Posso explicar por ligação. Qual o melhor horário?
```

---

## 5. Dados de apoio (caso peçam números)

- **92%** das mortes maternas no Brasil são evitáveis
- **33-40%** das gestantes peregrinam entre serviços sem dados clínicos
- **75%** dos municípios de SC NÃO estão integrados à RNDS (221 de 295)
- **120+** municípios usam IPM Atende.Net em SC — nenhum envia dados clínicos à RNDS
- **5 portarias/decretos** de 2024-2025 exigem integração FHIR R4 com RNDS
- Portaria 7.495/2025: municípios sem RNDS perdem acesso a programas federais
- O adaptador Ponte tem **114 testes automatizados** e gera Bundle RAC conforme BR Core
- Licença MIT — 100% gratuito e open-source

---

## 6. Objeções possíveis e respostas

**"O IPM já vai fazer isso."**
> "Esperamos que sim. Mas enquanto o IPM não implementa, os municípios ficam sem conformidade. O Ponte é a solução imediata — e se o IPM implementar nativamente, ótimo, o Ponte terá cumprido seu papel."

**"Precisamos avaliar a questão de dados/LGPD."**
> "Com certeza. O Ponte opera dentro do marco legal: Decreto 12.560/2025 autoriza compartilhamento de dados via RNDS para continuidade do cuidado. Sou advogado e posso discutir os aspectos legais."

**"Não tenho tempo para isso agora."**
> "Entendo completamente. Posso deixar tudo pronto e quando houver janela, precisamos apenas de 30 minutos para o credenciamento no portal DATASUS. O resto é por nossa conta."

**"Qual o custo?"**
> "Zero. O projeto é open-source (MIT), sem fins lucrativos. Nosso objetivo é que nenhuma gestante chegue a uma emergência sem histórico clínico."

**"Isso não é função do COSEMS."**
> "O COSEMS já promoveu oficinas de integração RNDS em 2024. O Ponte é uma ferramenta que complementa esse trabalho — ajuda os municípios que participaram das oficinas a efetivamente implementar."
