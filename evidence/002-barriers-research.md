# Pesquisa: Barreiras Reais de Integração com a RNDS — 2026-02-13

## Resumo Executivo

70,6% dos municípios brasileiros têm até 20.000 habitantes (3.935 de 5.570). Esses são os que mais precisam e menos conseguem se integrar à RNDS.

## Pré-requisitos Técnicos

### Hardware
- RNDS **não exige servidor dedicado** — é API em nuvem
- Basta um computador rodando e-SUS APS/PEC
- PEC já tem integração nativa com RNDS

### Internet
- Não há requisito mínimo publicado
- ~10 Mbps suficiente para município pequeno
- **Problema real:** muitos municípios rurais nem têm internet estável
- 16.202 UBS foram identificadas sem internet

### Certificado Digital ICP-Brasil (OBRIGATÓRIO)
- e-CNPJ A1: R$ 150-170/ano
- e-CNPJ A3 (token): R$ 250-350 (1-3 anos)
- Two-way SSL + token Bearer com validade de 15 min
- **Uma das maiores barreiras históricas**

### Stack
- HTTPS + FHIR R4 (JSON)
- Agnóstico de linguagem (exemplos em Java, libs em JS)
- Repo open-source: github.com/kyriosdata/rnds
- Coleção Postman disponível

## Processo de Credenciamento

### Fase 1 — Homologação
1. CNES válido
2. Conta gov.br (nível prata)
3. Certificado ICP-Brasil
4. Formulário no Portal DATASUS
5. Testes no ambiente de homologação

### Fase 2 — Produção
1. Solicitação de acesso ao ambiente de produção
2. Aprovação do DATASUS

**Prazo:** Não definido oficialmente. Na prática: semanas a meses.

## Barreiras Identificadas (por categoria)

### Infraestrutura
- Internet instável em áreas rurais
- Falta de energia elétrica estável
- Equipamentos obsoletos

### Técnicas
- Dificuldade com certificados ICP-Brasil
- Complexidade do FHIR
- Erros de autenticação SSL
- Renovação de certificados

### Burocráticas
- Credenciamento complexo e sem prazo
- CNES desatualizado
- Conta gov.br nível prata requer validação biométrica

### Recursos Humanos
- **Escassez de profissionais de TI é fator limitante**
- Muitos municípios não têm sequer 1 profissional de TI
- Alta rotatividade a cada mudança de gestão
- Acúmulo de funções

### Financeiras
- 70% dos municípios dependem de >80% de verbas externas
- Sem linha orçamentária específica para TI
- Déficit fiscal municipal: R$ 16,2 bilhões

## Casos de Sucesso

### Espírito Santo (COSEMS/ES)
- 24 municípios integrados
- 370 UBS conectadas
- COSEMS como intermediário técnico

### Acre (COSEMS/AC)
- 22 municípios via oficinas presenciais

### Fatores de sucesso
- COSEMS como centros de suporte regional
- e-SUS PEC com integração nativa
- Oficinas presenciais > EAD
- Apoio estadual coordenado

## Treinamento Gratuito Disponível
- UNA-SUS/UFG: curso de integração RNDS
- RNP/ESR: trilha de saúde digital
- Guia oficial: rnds-guia.saude.gov.br
- GitHub: kyriosdata/rnds

## Modelo Recomendado: Consórcio Intermunicipal
- Compartilhar equipe de TI entre municípios
- Negociar certificados em volume
- Centralizar credenciamento
- Manter conhecimento independente de mudanças políticas
- Help desk regional

## Dado-chave para o Ponte
O e-SUS APS/PEC já tem integração nativa com RNDS. Para a maioria dos municípios pequenos, **não é necessário programar nada** — basta configurar o certificado. O problema é que mesmo essa configuração simples é barreira demais para quem não tem TI.

**Oportunidade:** Criar um serviço/ferramenta que automatiza TODO o processo de configuração e credenciamento, reduzindo de "semanas com profissional de TI" para "horas com qualquer pessoa alfabetizada digitalmente".
