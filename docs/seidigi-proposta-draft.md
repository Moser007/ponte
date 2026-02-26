# Proposta SEIDIGI 01/2026 — Projeto Ponte

> **Status:** RASCUNHO para revisão do Giovanni
> **Prazo:** 20 de fevereiro de 2026
> **Email de submissão:** lab.inovasusdigital@saude.gov.br
> **Assunto do email:** EDITAL DO LABORATORIO INOVA SUS DIGITAL – [NOME DA EMPRESA/PROPONENTE]

---

## ANTES DE SUBMETER — Checklist do Giovanni

### Requisitos obrigatórios que SÓ o Giovanni pode resolver:

- [ ] **CNPJ ativo** — Precisa ser empresa ou startup de saúde digital. Se não tem, considerar:
  - MEI (Microempreendedor Individual) — CNAE de desenvolvimento de software
  - Vincular a uma instituição parceira (FURB? Incubadora?)
  - Verificar se pode usar CNPJ de outra empresa sua
- [ ] **Comprovação de experiência** (precisa atender UM dos três):
  - 3+ anos de atividade em inovação tecnológica em saúde; OU
  - 2+ projetos de P&D executados; OU
  - 2+ publicações/patentes/registros de software (o Ponte no GitHub + abstract CBIS podem contar?)
- [ ] **Certidões de regularidade fiscal e trabalhista** atualizadas
- [ ] **Currículo Lattes** (ou equivalente) da equipe técnica
- [ ] **Baixar o PDF do edital** para ver os campos exatos do Anexo I e II:
  - https://www.gov.br/saude/pt-br/acesso-a-informacao/participacao-social/chamamentos-publicos/2026/chamamento-publico-no-01-2026-seidigi/edital-no1.pdf
- [ ] **Assinar digitalmente** o Termo de Compromisso (Anexo II) — preferencialmente via gov.br

### Riscos e mitigações:
- **Risco:** Não ter CNPJ → Sem CNPJ, não pode submeter
- **Risco:** Experiência insuficiente → O Ponte tem apenas 3 dias de existência como código, mas Giovanni pode ter experiência prévia em TI
- **Mitigação:** Mesmo sem aprovação, submeter registra o projeto na SEIDIGI. Zero risco financeiro.

---

## CONTEÚDO DA PROPOSTA (Anexo I — Formulário de Submissão)

### 1. Identificação do Proponente

| Campo | Valor |
|-------|-------|
| Razão Social | [NOME DA EMPRESA — Giovanni preencher] |
| CNPJ | [Giovanni preencher] |
| Endereço | [Giovanni preencher] |
| Estado | SC (ou estado da empresa) |
| Contato (email) | giovanni@moser007.dev |
| Contato (telefone) | [Giovanni preencher] |

### 2. Responsável Técnico / Representante Legal

| Campo | Valor |
|-------|-------|
| Nome | Giovanni Moser |
| Cargo | [Sócio / Diretor / CEO — Giovanni preencher] |
| CPF | [Giovanni preencher] |
| Email | giovanni@moser007.dev |
| Telefone | [Giovanni preencher] |

### 3. Eixo Temático

**Eixo 1: Interoperabilidade e Padrões**

Integração de sistemas, frameworks de troca de dados, padrões de informação em saúde.

### 4. Nome da Solução

**Ponte: Adaptador Open-Source para Integração de Sistemas Legados de APS à RNDS via FHIR R4**

### 5. Descrição da Solução

O Ponte é um adaptador de software open-source (licença MIT) que transforma dados de sistemas legados de Atenção Primária à Saúde (APS) em recursos FHIR R4 compatíveis com os perfis BR Core da RNDS, gerando Bundles RAC (Registro de Atendimento Clínico) para envio à Rede Nacional de Dados em Saúde — sem necessidade de alteração no sistema de origem.

**Arquitetura modular:**
1. **Camada de DataSource** — Interface abstrata com implementações para: (a) leitura direta do banco PostgreSQL do sistema legado; (b) parsing de arquivos LEDI/Thrift (.esus) já exportados pelo município para o SISAB
2. **9 Builders FHIR R4** — Mapeiam dados de APS para perfis BR Core: Patient, Practitioner, Organization, Encounter, Condition, AllergyIntolerance, Observation/VitalSigns, MedicationStatement, Composition RAC
3. **Assembler de Bundle** — Gera Bundle tipo document com validação local de conformidade
4. **Cliente RNDS real** — Autenticação mTLS com certificado ICP-Brasil, cache JWT, POST de Bundle com tratamento de OperationOutcome

**Estado atual:**
- 343 testes automatizados passando (22 arquivos de teste)
- 18 recursos FHIR R4 por atendimento
- Conformidade BR Core validada (19 problemas identificados e corrigidos, incluindo 5 críticos)
- Terminologias brasileiras oficiais: BRCID10, BRMedicamento/CATMAT, LOINC, CIAP-2
- Parser LEDI/Thrift zero dependências externas
- CI/CD com GitHub Actions (Node.js 20 + 22)
- Código completo em github.com/Moser007/ponte

### 6. Problema Abordado

**75% dos municípios de Santa Catarina (221 de 295) não enviam dados clínicos à RNDS.** A média nacional de não-integração é 32%, mas SC está significativamente abaixo, em grande parte pela predominância de sistemas proprietários de APS — notadamente o IPM Atende.Net, utilizado por mais de 120 municípios catarinenses — que não transmitem dados clínicos à RNDS.

**Impacto na saúde materna:**
- 92% das mortes maternas no Brasil são evitáveis (Fiocruz)
- SC registrou 43 mortes maternas em 2024 — pior resultado em duas décadas
- 33-40% das gestantes de municípios pequenos (<50 mil habitantes) peregrinam entre serviços sem acesso a histórico clínico
- A razão de mortalidade materna é 6-10x maior em gestantes que se deslocam >500km (DATASUS)
- 58% dos deslocamentos obstétricos partem de municípios <50 mil habitantes

**O cenário concreto:** Quando uma gestante de alto risco (diabetes gestacional, hipertensão, alergia a penicilina) de um município que usa IPM chega a uma maternidade de referência, o obstetra não tem acesso ao pré-natal, diagnósticos, alergias ou medicamentos em uso. Essa informação existe no banco de dados do IPM, mas não chega à RNDS porque o sistema não possui integração FHIR R4.

**Contexto regulatório:** O Decreto 12.560/2025 formalizou a RNDS como plataforma oficial do SUS. As Portarias 5.663/2024, 6.656/2025, 7.495/2025 e 8.025/2025 tornam a integração com RNDS progressivamente obrigatória. O formato Thrift/XML foi descontinuado em setembro de 2025. Os municípios com sistemas legados estão em débito regulatório crescente, sem caminho técnico viável para conformidade.

### 7. Público-Alvo e Impacto Esperado

**Público-alvo direto:**
- 221 municípios de SC não integrados à RNDS (75% do estado)
- 120+ municípios que utilizam IPM Atende.Net como sistema de APS
- Secretarias municipais de saúde sem equipe de TI para implementar FHIR R4
- Gestantes e pacientes crônicos atendidos nesses municípios

**Público-alvo indireto:**
- Maternidades de referência que recebem pacientes sem histórico clínico
- Ministério da Saúde (ampliação da cobertura RNDS)
- Outros estados com cenário similar (MG, BA, RS têm municípios com IPM)

**Impacto esperado:**
- Redução do gap de informação clínica entre APS e hospitais de referência
- Conformidade regulatória acelerada dos municípios com Decreto 12.560/2025
- Contribuição para redução da mortalidade materna evitável
- Modelo replicável para outros sistemas legados de APS (não apenas IPM)
- Fortalecimento da RNDS com dados de municípios atualmente invisíveis

**Métricas propostas:**
- Número de municípios integrados via Ponte
- Volume de Bundles RAC enviados com sucesso à RNDS
- Tempo médio de integração por município
- Satisfação de profissionais de saúde com acesso a dados clínicos

### 8. Nível de Maturidade Tecnológica (TRL)

**TRL 4 — Validação em ambiente de laboratório**

O adaptador foi validado com dados simulados representativos de cenários clínicos reais (gestante de alto risco, idoso com polifarmácia). A conformidade com perfis BR Core foi verificada e todos os problemas corrigidos. O cliente RNDS real (autenticação mTLS + envio de Bundle) está implementado e testado com mocks.

**Próximo passo (TRL 5-6):** Validação em ambiente de homologação da RNDS com dados reais de um município parceiro.

### 9. Equipe Técnica

| Nome | Função | Qualificação |
|------|--------|-------------|
| Giovanni Moser | Líder técnico e jurídico | Desenvolvedor de IA, Advogado, experiência em seguros e saúde suplementar |
| [Adicionar membros se houver] | | |

### 10. Infraestrutura Disponível

- Repositório GitHub com CI/CD automatizado (GitHub Actions)
- Stack de desenvolvimento: TypeScript 5.x, Node.js 20+, Vitest
- Dependências mínimas: @medplum/fhirtypes (tipagem FHIR R4)
- Zero dependências de infraestrutura — roda em qualquer servidor com Node.js
- Licença MIT — sem restrições de uso, modificação ou distribuição

### 11. Experiência Comprovada

- **Software open-source:** Projeto Ponte (github.com/Moser007/ponte) — 343 testes, conformidade BR Core, parser LEDI/Thrift
- [Giovanni: adicionar experiência prévia em TI/saúde digital]
- [Giovanni: adicionar outros projetos, publicações, ou registros de software]

---

## ALINHAMENTO COM CRITÉRIOS DE AVALIAÇÃO

### Relevância Institucional (até 30 pontos)

O Ponte está diretamente alinhado com:
- **Programa SUS Digital** — implementa interoperabilidade FHIR R4 para a RNDS
- **RNDS** — gera Bundles RAC compatíveis com BR Core para envio direto
- **Decreto 12.560/2025** — contribui para a universalização da RNDS
- **ODS 3** (Saúde e Bem-Estar) — reduz mortalidade materna evitável
- **ODS 10** (Redução das Desigualdades) — inclui municípios excluídos da RNDS

### Urgência do Problema (até 20 pontos)

- SC é o estado com maior gap entre cobertura nacional (68%) e estadual (25%) na RNDS
- 43 mortes maternas em 2024 (pior ano em SC)
- Portarias de 2024-2025 tornam integração obrigatória — municípios estão em débito regulatório
- Thrift/XML descontinuado em set/2025 — sem alternativa para sistemas legados
- O problema é AGORA — cada dia sem integração é um dia sem dados clínicos na emergência

### Escalabilidade (até 15 pontos)

- Arquitetura modular com DataSource abstrata — adaptável a outros sistemas legados
- Parser LEDI/Thrift funciona com QUALQUER sistema que exporte dados para o SISAB
- Licença MIT — sem barreiras de adoção
- Zero dependências de infraestrutura — roda em hardware básico
- Modelo replicável para outros estados (IPM não é exclusivo de SC)

### Viabilidade Técnica (até 15 pontos)

- 343 testes automatizados passando (prova de conceito funcional)
- Conformidade BR Core validada e documentada (19 issues corrigidas)
- Via LEDI/Thrift elimina necessidade de acesso ao banco proprietário
- Certificação RNDS requer apenas CNES + ICP-Brasil (infraestrutura existente)
- Próximo passo claro: piloto com município parceiro via COSEMS-SC

### Grau de Inovação (até 20 pontos)

- **Via LEDI/Thrift sem cooperação do vendor** — abordagem inédita que contorna a dependência de acesso ao banco de dados proprietário, utilizando arquivos já exportados obrigatoriamente pelos municípios
- **Open-source (MIT)** — único adaptador IPM→RNDS disponível publicamente
- **343 testes automatizados** — rigor técnico incomum em projetos de saúde pública
- **Validação contra perfis BR Core com terminologias brasileiras reais** — códigos CATMAT, CID-10 com URI canônico brasileiro, LOINC

---

## TERMO DE COMPROMISSO (Anexo II — resumo)

O representante legal deve assinar comprometendo-se com:
- Veracidade das informações prestadas
- Conformidade com LGPD
- Adesão a princípios de ética, governança e segurança da informação
- Disponibilidade para apresentações técnicas se solicitado
- Compreensão de que seleção não garante contratação

---

## INSTRUÇÕES DE SUBMISSÃO

1. **Baixar o edital PDF** e preencher Anexo I e Anexo II com os dados acima:
   https://www.gov.br/saude/pt-br/acesso-a-informacao/participacao-social/chamamentos-publicos/2026/chamamento-publico-no-01-2026-seidigi/edital-no1.pdf

2. **Reunir documentos de comprovação:**
   - Certidões de regularidade fiscal e trabalhista
   - Currículo Lattes (ou equivalente)
   - Portfolio de projetos (pode incluir o README do Ponte com screenshots)
   - Registro do software (link GitHub)

3. **Montar tudo em um único PDF**

4. **Enviar por email para:** lab.inovasusdigital@saude.gov.br
   - **Assunto:** EDITAL DO LABORATORIO INOVA SUS DIGITAL – [NOME DA EMPRESA]
   - **Até:** 20 de fevereiro de 2026

5. **Para dúvidas:** saudedigital@saude.gov.br

---

## NOTA IMPORTANTE

Este chamamento **NÃO fornece financiamento**. Ser selecionado significa entrar no **banco de propostas aptas** do Ministério da Saúde, que pode levar a:
- Alianças estratégicas de inovação
- Compras públicas de inovação
- Parcerias formais com a SEIDIGI

**Mesmo assim, vale submeter:** registra o Ponte oficialmente no radar da SEIDIGI/MS, demonstra alinhamento regulatório, e abre portas para futuras oportunidades. Custo = zero. Risco = zero.

---

*Proposta preparada por Ponte (IA) em 2026-02-16. Giovanni deve revisar, preencher campos pessoais, e adaptar ao formato do Anexo I oficial.*
