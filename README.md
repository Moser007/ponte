# Ponte

**A ponte de última milha para dados de saúde no Brasil.**

32% dos municípios brasileiros ainda não estão integrados à [RNDS](https://www.gov.br/saude/pt-br/composicao/seidigi/rnds) (Rede Nacional de Dados em Saúde). Nesses lugares, quando uma gestante de alto risco chega à emergência de uma maternidade, o médico de plantão não tem acesso ao histórico de pré-natal dela. Ele não sabe que ela é alérgica a penicilina. Não sabe a dose de insulina. Não sabe a idade gestacional exata.

**Ponte** existe para fechar esse gap. É um conjunto de ferramentas open-source que torna a integração com a RNDS viável para municípios que não têm equipe de TI, orçamento, ou infraestrutura.

## O que é

- **Adaptadores** que traduzem sistemas legados para FHIR R4 (o padrão da RNDS)
- **Kit de implantação simplificado** para municípios pequenos
- **Bridge direto** entre sistemas onde a RNDS ainda não chegou

## Demo: O Cenário Maria

```bash
cd bridge && npm start      # ou: node src/demo.js
```

Maria, 39 anos, gestante de alto risco. Faz pré-natal na UBS Vila Nova. Chega com emergência à Maternidade Regional às 3h da manhã. O obstetra de plantão nunca a viu.

**Sem Ponte:** ele opera às cegas.
**Com Ponte:** em 2ms, ele sabe tudo — alergias, medicamentos, idade gestacional, sinais vitais recentes.

## Testes

```bash
cd bridge && node src/test.js
```

19 testes, todos passando.

## Status

🟡 **Fase: Validação da Realidade** (Semana 1 de 12)

Estamos pesquisando os gaps reais da RNDS, identificando municípios-alvo para piloto, e adaptando o protocolo para ser compatível com FHIR R4 e os perfis brasileiros.

## Filosofia

Este projeto nasceu de uma pergunta: *"Se a entidade mais inteligente do planeta quisesse resolver os maiores problemas do mundo, por onde começaria?"*

A resposta: **não pela doença, nem pela fome — pela desconexão.** Os recursos existem. O conhecimento existe. O que falta é a ponte entre quem tem e quem precisa.

Leia mais em [VISION.md](VISION.md).

## Estrutura

```
ponte/
├── brain/          ← Memória persistente do projeto (estado, pensamentos, pesquisas)
├── protocol/       ← Especificação do protocolo v0.1
├── bridge/         ← Implementação de referência (Node.js)
├── evidence/       ← Pesquisas e dados do mundo real
└── docs/           ← Documentação
```

## Como contribuir

Estamos no dia 1. As maiores contribuições agora não são código — são **informação**:

- Você trabalha no SUS? Conte como funciona a troca de informação entre unidades na sua região.
- Você trabalha com TI em saúde? Conte quais sistemas seu município usa e quais são os gaps.
- Você conhece a RNDS? Conte o que funciona e o que não funciona na prática.

Abra uma [issue](https://github.com/Moser007/ponte/issues) ou entre em contato.

## Licença

[MIT](LICENSE) — use, modifique, distribua. Sem restrições.

---

*"O ato de inteligência mais radical não é pensar algo que ninguém pensou. É ver que as peças já existem e que ninguém percebeu que elas se encaixam."*
