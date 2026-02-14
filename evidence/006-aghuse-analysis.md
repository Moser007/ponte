# Pesquisa R003: AGHUse — Código-fonte, Comunidade e Relevância para o Ponte

## Resumo Executivo

**O que é:** Sistema de gestão hospitalar open-source (GPL), desenvolvido pelo HCPA (Hospital de Clínicas de Porto Alegre) desde os anos 1980.

**Relevância para o Ponte:** AGHUse é um ALIADO, não um concorrente. Ele resolve o problema de hospitais; nós resolvemos o de municípios pequenos/APS. Bahia já provou que AGHUse integra com RNDS via FHIR. Podemos aprender com a implementação deles.

**Ação recomendada:** Estudar como Bahia implementou a integração AGHUse → RNDS (FHIR R4), usar como referência técnica para nosso adaptador IPM → RNDS.

---

## Visão geral

| Aspecto | Detalhe |
|---------|---------|
| **Nome** | AGHUse (Aplicativo de Gestão para Hospitais — Use) |
| **Criador** | HCPA (Hospital de Clínicas de Porto Alegre) |
| **Desde** | Anos 1980 (sistema interno), 2009 (distribuição externa), 2014 (fork AGHUse) |
| **Licença** | GPL (GNU General Public License) |
| **Custo** | Gratuito para uso no SUS |
| **Tipo** | Sistema de gestão hospitalar (NÃO é para APS/UBS) |
| **Público-alvo** | Hospitais, serviços especializados, hospitais universitários |

---

## Stack técnico

| Componente | Tecnologia |
|------------|-----------|
| Linguagem | **Java EE** |
| Servidor de aplicação | **JBoss Wildfly** |
| Banco de dados | **PostgreSQL** (principal), Oracle SQL (alternativo) |
| Framework web | **JSF + PrimeFaces** |
| ORM | **Hibernate** |
| Relatórios | **Jasper Reports** |
| Busca | **Apache Lucene** |
| CI/CD | **Jenkins** |
| Cloud (Unicamp) | AWS ECS + Fargate + Aurora |

---

## AGHU vs AGHUse — o fork

| Aspecto | AGHU (Ebserh) | AGHUse (HCPA) |
|---------|---------------|---------------|
| Mantido por | Ebserh (empresa pública federal) | Comunidade AGHUse (coordenada pelo HCPA) |
| Hospitais | 41 hospitais universitários federais | 20+ instituições diversas |
| Adesão | Chamamento público MS/MEC (fev 2024) | Convênio/acordo com HCPA |
| Foco | Hospitais universitários | Hospitais e serviços de saúde em geral |
| Código | Acesso via comunidade Ebserh | Acesso via comunidade AGHUse |

Em 2014, AGHU v5 passou por atualização arquitetural para v7 e foi renomeado AGHUse. O HCPA continua desenvolvendo AGHUse enquanto Ebserh mantém AGHU.

---

## Comunidade AGHUse

### Membros conhecidos
- HCPA (coordenador)
- UFRGS, UFRJ, Unicamp
- Forças Armadas (Aeronáutica, Exército, Marinha)
- Secretaria de Saúde da Bahia (referência nacional)
- Secretaria de Saúde do RS
- Unimed, Einstein (setor privado)
- PRODEB (Bahia)
- Paraíba (em implantação)
- 10+ estados usando

### Governança
- **Comitê Estratégico:** decisões de alto nível
- **Comitê Técnico:** até 9 profissionais de TI (1 coordenador HCPA + 8 membros)
- **Membros gerais:** instituições participantes

### Como participar
1. Formalizar convênio de cooperação ou contrato de prestação de serviço com HCPA, membro da comunidade, ou empresa credenciada
2. Membros recebem: treinamento, acesso ao código-fonte, suporte de instalação, atualizações contínuas
3. Em troca: contribuem com melhorias ao sistema

### Empresas credenciadas para serviços AGHUse
1. Liberty Comércio e Serviços LTDA
2. Lume Serviços de Tecnologia S/A
3. R Forti Recursos para TI LTDA
4. Noxtec Serviços LTDA

### Acesso ao código
- **NÃO está em GitHub/GitLab público**
- Acesso ao repositório de código é exclusivo para membros da comunidade
- Requer convênio formal com HCPA

---

## Integração com RNDS — o caso Bahia

### Status: FUNCIONAL e em expansão

A Bahia é a referência nacional em integração AGHUse + RNDS:

| Métrica | Dado |
|---------|------|
| Unidades com AGHUse em Bahia | 31 (2024) |
| Meta | 95 unidades até 2026 |
| Integração RNDS | SIM — dados clínicos hospitalares |
| Padrão | FHIR R4 (obrigatório pela RNDS) |
| Líder técnico | PRODEB (Companhia de Processamento de Dados do Estado da Bahia) |

### Protocolo MS + Bahia (agosto 2024)
- Ministério da Saúde assinou protocolo de intenções com Bahia para modernizar serviços e fortalecer SUS
- Destaque para integração AGHUse → RNDS para recebimento de registros clínicos hospitalares na rede nacional
- Bahia lidera a transformação digital da saúde pública no Brasil

### Piloto RNDS federalizado (8 estados)
A RNDS está sendo federalizada com piloto em 8 estados:
1. **Bahia** (líder, com AGHUse)
2. **Ceará**
3. Espírito Santo
4. Goiás
5. Pernambuco
6. Piauí
7. **Santa Catarina** (nosso estado!)
8. Tocantins

---

## Módulos do AGHUse

- Internações / Admissões
- Ambulatório
- Emergência
- Centro cirúrgico
- Exames / Laboratório
- Farmácia
- Almoxarifado (com rastreabilidade)
- Faturamento SUS
- Prontuário eletrônico
- Gestão administrativa
- Indicadores e BI

---

## Chamamento público AGHU (fev 2024)

O MS/MEC abriram chamamento público para qualquer hospital/serviço especializado do SUS aderir ao AGHU:

| Tipo de membro | Descrição |
|---------------|-----------|
| **Membro Utilizador** | Usa o sistema; precisa ter departamento de TI e infraestrutura mínima |
| **Membro Gestor** | Usa e contribui com desenvolvimento; precisa de equipe de coordenação técnica |

- Cadastro: comunidade-aghu.ebserh.gov.br
- Economia estimada: R$ 3 bilhões em 5 anos para estados
- Gratuito para uso no SUS

---

## Relevância para o Ponte

### O que o AGHUse faz que NÓS NÃO precisamos fazer
- Sistema completo de gestão hospitalar (internações, cirurgias, farmácia, faturamento)
- Prontuário eletrônico hospitalar
- Tudo que é INTERNO ao hospital

### O que o AGHUse faz que nos INTERESSA muito
- **Integração RNDS via FHIR R4** — Bahia provou que funciona
- Geração de recursos FHIR (Bundle, Patient, Encounter, Condition, etc.)
- Autenticação mTLS com ICP-Brasil para RNDS
- Mapeamento de dados clínicos para perfis BR Core

### Como o Ponte pode se beneficiar
1. **Estudar o código FHIR do AGHUse** — se conseguirmos acesso à comunidade, o módulo de integração RNDS seria referência para nosso adaptador IPM → RNDS
2. **SC está no piloto RNDS** — podemos aproveitar o momentum
3. **Não competimos** — AGHUse é para hospitais, Ponte é para APS/municípios pequenos. Somos complementares.
4. **Credibilidade** — se contribuirmos para o ecossistema AGHUse/RNDS, ganhamos visibilidade na comunidade de saúde digital brasileira

### Limitações
- Acesso ao código requer convênio formal (não é GitHub aberto)
- AGHUse é um sistema GRANDE (Java EE monolítico) — não é trivial de estudar
- Foco em hospitais, não em APS
- Comunidade pode ser burocrática (convênios com HCPA)

---

## Comparação: AGHUse vs Ponte

| Aspecto | AGHUse | Ponte |
|---------|--------|-------|
| **Foco** | Hospitais | APS / Municípios pequenos |
| **Problema** | Gestão hospitalar completa | Interoperabilidade de última milha |
| **RNDS** | SIM (Bahia funcional) | Em desenvolvimento |
| **Stack** | Java EE / JBoss / PostgreSQL | Node.js (leve) |
| **Tamanho** | Sistema grande e completo | Bridge mínimo |
| **Público** | Hospitais, serviços especializados | Secretarias municipais de saúde |
| **Acesso** | Convênio com HCPA | GitHub público (MIT) |
| **Relação** | Aliado potencial | — |

---

## Próximos passos

1. **Estudar integração RNDS da Bahia** — contatar PRODEB ou buscar documentação técnica do módulo FHIR
2. **Avaliar se vale entrar na comunidade AGHUse** — requer convênio formal, pode ser burocrático
3. **Usar como referência técnica** — mesmo sem acesso ao código, a arquitetura da integração RNDS é documentada no RNDS-guia e RNDS-FHIR
4. **SC está no piloto RNDS** — verificar se há movimento de AGHUse em SC (via Gisele do COSEMS-SC)

---

## Fontes
- Comunidade AGHUse: sites.google.com/hcpa.edu.br/aghuse/sobre-o-aghuse
- HCPA - Sistema AGHUse: hcpa.edu.br/institucional/sistema-aghuse
- AWS - Case Unicamp + AGHUse: aws.amazon.com/pt/blogs/aws-brasil/case-de-sucesso-unicamp-aghuse
- MS - Chamamento público AGHU: gov.br/saude/pt-br/assuntos/noticias/2024/marco/saiba-como-aderir-aghu
- CONASS - NT 05/2023 Software Hospitalar: conass.org.br/biblioteca/notas-tecnicas
- CONASS - Bahia AGHUse no CONASS: conass.org.br/tecnologia-prontuario-eletronico-bahia
- MS + Bahia protocolo: gov.br/saude/pt-br/assuntos/noticias/2024/agosto/ms-bahia-modernizar-servicos
- Bahia SESAB: saude.ba.gov.br (transformação digital saúde pública)
- DATASUS - Chamamento AGHU: datasus.saude.gov.br
- CONASEMS - AGHU adesão: portal.conasems.org.br
- Ebserh - AGHU: gov.br/ebserh/aghu
- FAB - HFAG AGHUse: fab.mil.br/hfag
