# R003 - Relatorio de Pesquisa sobre o AGHUse

**ID da Pesquisa:** R003
**Data:** 2026-02-13
**Assunto:** AGHUse - Sistema Brasileiro de Gestao Hospitalar de Codigo Aberto
**Objetivo:** Avaliar o AGHUse como aliado estrategico para o projeto Ponte (interoperabilidade RNDS/FHIR R4)

---

## Resumo Executivo

O AGHUse e o sistema de gestao hospitalar de codigo aberto mais significativo do Brasil, desenvolvido pelo Hospital de Clinicas de Porto Alegre (HCPA) desde a decada de 1980. Esta implantado em mais de 100 unidades de saude em mais de 10 estados e conta com o apoio do Ministerio da Saude. O sistema e licenciado sob GPL, baseado em Java e roda em PostgreSQL. A integracao RNDS/FHIR esta sendo ativamente desenvolvida para o ramo paralelo AGHU (gerenciado pela Ebserh), com implantacao em 45 hospitais universitarios planejada para o final de 2025. O AGHUse (ramo do HCPA) tambem esta buscando integracao com a RNDS atraves de sua comunidade, particularmente na Bahia.

**Veredito estrategico:** O AGHUse e um aliado estrategico de alto valor para o Ponte. Contribuir com modulos de integracao RNDS/FHIR para o AGHUse proporcionaria credibilidade e alcance imediatos em mais de 100 unidades de saude. No entanto, o modelo comunitario e institucional (nao aceita contribuicoes abertas via GitHub PRs), o que significa que o engajamento requer acordos formais de cooperacao com o HCPA.

---

## 1. Repositorio e Acesso ao Codigo-Fonte

### Status do Codigo-Fonte: NAO disponivel publicamente no GitHub/GitLab

Apesar de ser licenciado sob GPL, o AGHUse **nao** possui um repositorio de codigo-fonte publicamente acessivel no GitHub, GitLab ou qualquer plataforma indexada. Multiplas buscas no GitHub, GitLab e Software Publico Brasileiro nao retornaram resultados.

**Como o codigo-fonte e distribuido:**
- O codigo e compartilhado atraves da **Comunidade AGHUse**
- O acesso requer um instrumento de cooperacao formal com o HCPA
- Alternativamente, atraves de empresas prestadoras de servicos credenciadas
- Uma vez membro, as instituicoes recebem o codigo e se comprometem a contribuir com melhorias

**Licenca:** GPL (General Public License) - confirmada em multiplas fontes oficiais.

**Implicacao para o Ponte:** Para acessar o codigo-fonte, o projeto Ponte (ou uma instituicao participante) precisaria ingressar formalmente na Comunidade AGHUse atraves do HCPA.

### Prestadoras de Servicos Credenciadas (podem facilitar o acesso):
1. Liberty Comercio e Servicos LTDA
2. Lume Servicos de Tecnologia S/A
3. R Forti Recursos para TI LTDA
4. Noxtec Servicos LTDA

---

## 2. Arquitetura e Stack Tecnologica

### Linguagem de Programacao e Frameworks
- **Linguagem:** Java (Java EE)
- **Servidor de Aplicacao:** JBoss WildFly
- **Frameworks:** JBoss Seam, CDI, JSF (JavaServer Faces), Hibernate
- **Build:** Maven
- **Testes:** JUnit
- **Relatorios:** iReport
- **Frontend:** Baseado em web (JSF com RichFaces)

### Banco de Dados
- **Principal:** PostgreSQL
- **Legado:** Oracle (algumas implantacoes internas do HCPA ainda podem usar Oracle; PostgreSQL e o padrao para implantacoes externas)
- **Migracao para nuvem:** Amazon Aurora (compativel com PostgreSQL) na Unicamp

### Padrao de Arquitetura
- **Monolitico com estrutura modular** - O sistema e uma grande aplicacao Java EE implantada no JBoss WildFly, organizada em modulos funcionais. NAO e uma arquitetura de microsservicos.
- A implantacao na Unicamp migrou para conteineres (Amazon ECS com Fargate), mas isso e uma modernizacao de infraestrutura, nao uma reescrita arquitetural.

### Modelo de Implantacao
- **On-premises** e o modelo principal
- **Implantacoes em nuvem** existem (AWS na Unicamp e um caso de estudo documentado)
- JBoss WildFly em conteineres (Docker/ECS) para implantacoes em nuvem
- Amazon EFS para armazenamento compartilhado de arquivos entre tarefas ECS
- Multi-zona de disponibilidade para resiliencia

---

## 3. Status da Integracao com a RNDS

### Distincao critica: AGHU (Ebserh) vs. AGHUse (HCPA)

Existem **dois sistemas separados** que compartilham uma origem comum, mas divergiram em 2014:

| Aspecto | AGHU (Ebserh) | AGHUse (HCPA) |
|---------|--------------|---------------|
| Mantenedor | Ebserh (empresa federal) | HCPA + Comunidade |
| Publico-alvo | 45 hospitais universitarios federais | 100+ unidades de saude diversas |
| Versao atual | v11 (2024) | Lancamentos continuos |
| Status RNDS | **Integracao ativa com RNDS/SUS Digital** | Integracao planejada, em andamento |
| Certificacao SBIS | Sim (nivel NGS1) | Nao confirmada |

### AGHU (Ebserh) - Integracao com a RNDS:
- **O AGHU esta agora integrado ao SUS Digital Profissional atraves da RNDS** (confirmado em 2025)
- Testado com sucesso no Hospital Universitario de Brasilia (HUB-UnB)
- Implantacao em todos os 45 hospitais da Ebserh planejada para o final de 2025
- Permite acesso ao "prontuario unico do cidadao"
- Permite que profissionais de saude acessem dados clinicos de pacientes de qualquer unidade do SUS em todo o pais
- O AGHU v11 inclui 198 novas funcionalidades focadas em seguranca, interoperabilidade, qualidade e rastreabilidade

### AGHUse (HCPA) - Integracao com a RNDS:
- A implantacao no estado da Bahia menciona explicitamente a **integracao com a RNDS do AGHUse** como objetivo
- A entrada do Ministerio da Saude na Comunidade AGHUse (julho de 2025) sinaliza a intencao de alinhar o AGHUse com a estrategia nacional de saude digital
- Nenhuma integracao RNDS em producao confirmada para o AGHUse neste momento

### Recursos FHIR R4:
- A integracao com a RNDS utiliza FHIR R4 conforme especificado pelos perfis nacionais do Brasil
- Recursos FHIR especificos para a RNDS: Patient, Encounter, Observation, Condition, Procedure, Immunization, DiagnosticReport, MedicationRequest, entre outros
- RAC (Registro de Atendimento Clinico) e RSA (Resumo de Saude do Atendimento) sao os principais tipos de documentos enviados a RNDS
- Se o AGHU/AGHUse gera especificamente bundles RAC/RSA nao esta explicitamente documentado em fontes publicas, mas a integracao com o SUS Digital implica que essa capacidade esta sendo construida

---

## 4. Comunidade

### Comunidade AGHUse
- **Tamanho:** 100+ unidades de saude em todo o Brasil
- **Estrutura:** Modelo de membresia institucional (nao de contribuidores individuais)
- **Governanca:** Formalizada atraves de instrumentos de cooperacao com o HCPA
- **Portal da comunidade:** https://sites.google.com/hcpa.edu.br/aghuse/
- **Contato (transferencia de tecnologia do HCPA):** nitt@hcpa.edu.br

### Instituicoes Membros Incluem:
- **Governo Federal:** Ministerio da Saude (ingressou em julho de 2025)
- **Militar:** Exercito Brasileiro (4+ hospitais, expandindo para todo o sistema de saude), Forca Aerea Brasileira (HCA)
- **Universidades:** Unicamp (HC), UFRGS, UFRJ (Complexo Hospitalar)
- **Secretarias Estaduais de Saude:** Bahia, Rio Grande do Sul, Sao Paulo, Paraiba, Pernambuco, Rio Grande do Norte, Espirito Santo
- **Total:** 10+ estados e Forcas Armadas

### Dinamica da Comunidade:
- Cada instituicao membro se compromete a desenvolver melhorias e contribui-las de volta
- Novas versoes sao desenvolvidas colaborativamente e distribuidas a todos os membros
- Existe uma "metodologia de calculo de contribuicao"
- A comunidade possui seu proprio Regimento

### Nenhum forum publico, lista de discussao ou chat foi encontrado
- A comunicacao parece acontecer atraves de canais institucionais
- Nao ha issue tracker publico, GitHub Discussions, Slack/Discord

---

## 5. Contribuicoes Externas

### Modelo de Contribuicao: Institucional, Nao Aberto

O AGHUse **nao** segue o modelo padrao de contribuicao de codigo aberto (fork, PR, merge). Pontos-chave:

- **Sem CONTRIBUTING.md publico** - nao existe repositorio publicamente acessivel
- **Sem processo de PR** - contribuicoes acontecem atraves do framework institucional da comunidade
- **Requisito de ingresso:** Instituicoes devem ingressar formalmente na Comunidade AGHUse
- **Requisito minimo de equipe:** Instituicoes que desejam contribuir com desenvolvimento devem demonstrar uma equipe minima de coordenacao, desenvolvimento e suporte
- **Obrigacao de contribuicao:** Membros se comprometem a desenvolver melhorias como condicao de membresia

### Como Contribuir:
1. Ingressar na Comunidade AGHUse atraves de um instrumento de cooperacao com o HCPA
2. Receber o codigo-fonte e a documentacao
3. Desenvolver melhorias para modulos designados ou escolhidos
4. Submeter melhorias atraves do processo interno da comunidade
5. Melhorias sao incorporadas a base de codigo compartilhada

### Para o Ponte especificamente:
- Uma contribuicao direta de codigo aberto (como um GitHub PR) nao e possivel
- O Ponte precisaria de respaldo institucional para ingressar na comunidade
- Alternativamente, o Ponte poderia desenvolver modulos RNDS/FHIR de forma independente e propor integracao atraves de uma instituicao membro da comunidade

---

## 6. Implantacao e Adocao

### Escala
- **100+ unidades de saude** em todo o Brasil (ate 2025)
- **10+ estados** mais Forcas Armadas
- **80+ hospitais** conforme relatorios anteriores
- Potencial: Estimativas sugerem que ate **7.000 hospitais do SUS** poderiam eventualmente adotar o sistema
- Economia projetada: R$ 3 bilhoes para os estados em 5 anos

### Implantacoes Notaveis:

**Bahia:**
- 32+ unidades da rede estadual rodando o AGHUse
- Policlinicas em Salvador (Narandiba, Escada) migraram no final de 2024
- Modulos implantados: Ambulatorio, Exames, Pequenas Cirurgias
- Modulos adicionais (Farmacia, Estoque, Faturamento, Certificacao Digital) planejados para inicio de 2025

**Paraiba:**
- 18+ unidades hospitalares operacionais
- Expandindo para 25 unidades, depois 35 unidades cobrindo toda a rede estadual
- Tres macrorregioes de saude cobertas

**Rio Grande do Sul:**
- Secretaria Estadual de Saude adotou o AGHUse
- O proprio HCPA e a implantacao principal

**Sao Paulo:**
- Unicamp HC - implantacao de grande porte com 750.000+ acessos nos primeiros 15 meses
- Migrado para infraestrutura em nuvem AWS

**Militar:**
- Exercito Brasileiro: 4+ hospitais, expandindo para todo o sistema de saude nacional
- Forca Aerea Brasileira: HCA (Hospital Central da Aeronautica)
- Hospital Militar de Area de Brasilia, Manaus, Campo Grande

**Federal:**
- Ministerio da Saude (ingressou na comunidade em julho de 2025)
- Hospital Federal de Ipanema (Rio de Janeiro) - implantacao inicial do Ministerio

**Unicamp:**
- 750.000+ acessos em 15 meses
- Migracao para nuvem AWS (caso de estudo documentado)

---

## 7. Historico

### Linha do Tempo:
- **Decada de 1980:** HCPA comeca a desenvolver o AGH (Aplicativos de Gestao Hospitalar) como sistema interno
- **2009:** Ministerio da Educacao (MEC) inicia o projeto AGHU para padronizar a gestao em 47 hospitais universitarios. Parceria: HCPA + MEC + Ebserh
- **2009-2014:** AGHU desenvolvido e distribuido para hospitais universitarios
- **2014:** Ocorre a bifurcacao (fork):
  - **Ebserh** assume a manutencao do AGHU (continua como "AGHU")
  - **HCPA** lanca o **AGHUse** com atualizacoes arquiteturais (migracao da v5 para v7)
- **2017-2018:** Exercito Brasileiro inicia implantacao
- **2018:** Implantacao na Unicamp atinge 750.000 acessos
- **2023:** Nota Tecnica CONASS 05/2023 documenta o AGHUse e o AGHU como sistemas hospitalares de referencia para o SUS
- **2023:** Acordo de cooperacao entre Ministerio da Saude, MEC, Ebserh, Conass e Conasems
- **2024:** Ebserh lanca AGHU v11 com 198 novas funcionalidades, certificacao SBIS
- **2024:** Bahia e Paraiba expandem implantacoes do AGHUse
- **2024-2025:** AGHU se integra ao SUS Digital/RNDS
- **2025 (julho):** Ministerio da Saude ingressa formalmente na Comunidade AGHUse
- **2025:** Implantacao da integracao RNDS nos 45 hospitais da Ebserh planejada

### Criadores:
- **Hospital de Clinicas de Porto Alegre (HCPA)** - vinculado a Universidade Federal do Rio Grande do Sul (UFRGS)
- Status atual: **Muito ativo** - comunidade em crescimento, apoio do Ministerio da Saude, expansao nacional

---

## 8. Documentacao

### Documentacao Disponivel:
- **Portal da comunidade:** https://sites.google.com/hcpa.edu.br/aghuse/
- **Pagina institucional do HCPA:** https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse
- **Vitrine tecnologica do NITT:** https://sites.google.com/hcpa.edu.br/nitt/vitrine-tecnologica/aghuse-sistema-de-gestao-em-saude
- **Apresentacao geral (Google Drive):** https://drive.google.com/file/d/1t5yIbwyMlr7pppD54H7m2nxZiUMjke1d/
- **Nota Tecnica CONASS 05/2023:** https://www.conass.org.br/biblioteca/wp-content/uploads/2024/09/NT-05-2023-software-hospitalar.pdf
- **Caso de estudo ENAP (PDF):** https://repositorio.enap.gov.br/bitstream/1/4075/1/AGHU%20%20Modelo%20de%20Gest%C3%A3o%20do%20HCPA%20Inovando%20a%20Assist%C3%AAncia%20%C3%A0%20Sa%C3%BAde.pdf
- **Caso de estudo AWS Unicamp:** https://aws.amazon.com/pt/blogs/aws-brasil/case-de-sucesso-como-a-unicamp-construiu-uma-arquitetura-resiliente-e-migrou-o-aghuse-para-a-aws/
- **Wiki/FAQ do Espirito Santo:** https://app.wiki.saude.es.gov.br/pt-br/AGHUSE/faq
- **Regimento e metodologia de contribuicao da comunidade** - disponiveis para membros

### Nao Disponivel Publicamente:
- Documentacao de API
- Guias para desenvolvedores
- Documentacao do codigo-fonte
- Diagramas de arquitetura
- Schema do banco de dados
- Guias de implantacao

### Documentacao Ebserh/AGHU:
- Manuais de treinamento disponiveis em: https://www.gov.br/ebserh/pt-br/hospitais-universitarios/ (por hospital)
- Pagina da plataforma AGHU: https://www.gov.br/ebserh/pt-br/governanca/plataformas-e-tecnologias/aghu

---

## 9. Modulos

### Modulos Assistenciais/Clinicos:
1. **Pacientes** - cadastro e dados demograficos de pacientes
2. **Ambulatorio** - gestao ambulatorial administrativa e clinica
3. **Internacao** - gestao de internacoes
4. **Prescricao Medica**
5. **Prescricao de Enfermagem e Multiprofissional**
6. **Emergencia**
7. **Cirurgias/PDT** (Procedimentos Diagnostico-Terapeuticos)
8. **Anamnese e Evolucao** (Anamnese e Evolucao Clinica)
9. **Controles do Paciente**
10. **Exames** (Laboratoriais e de Imagem)
11. **Perinatologia**
12. **Nutricao**
13. **Prontuario Online** (Prontuario Eletronico do Paciente)

### Modulos de Gestao/Administrativos:
14. **Farmacia**
15. **Estoque/Suprimentos**
16. **Custos**
17. **Faturamento** (integracao AIH do SUS)
18. **Certificacao Digital**
19. **Agenda Profissional**
20. **Manutencao**
21. **Controle de Infeccao Hospitalar**
22. **Inventario**

**Total: ~18-22 modulos** dependendo de como sao contabilizados (algumas fontes citam 16, outras listam mais).

---

## 10. Relevancia para o Projeto Ponte

### Avaliacao Estrategica

#### Oportunidades:

1. **Alcance massivo:** Contribuir com integracao RNDS para o AGHUse beneficiaria instantaneamente 100+ unidades de saude e potencialmente milhares mais conforme a adocao cresce.

2. **Alinhamento com o Ministerio da Saude:** O Ministerio ingressou na Comunidade AGHUse em julho de 2025, sinalizando importancia estrategica nacional. O foco do Ponte em RNDS se alinha perfeitamente.

3. **Lacuna RNDS no AGHUse:** Enquanto o AGHU da Ebserh esta se integrando a RNDS, o ramo AGHUse (versao do HCPA usada por hospitais nao universitarios) NAO possui integracao RNDS em producao confirmada. Esta e uma lacuna clara que o Ponte poderia preencher.

4. **Credibilidade:** Estar associado ao AGHUse (apoiado pelo HCPA, Ministerio da Saude, Exercito Brasileiro) daria ao Ponte enorme credibilidade institucional.

5. **Testes em ambiente real:** Acesso imediato a ambientes hospitalares para testar modulos FHIR R4.

6. **Conexao com a Bahia:** A implantacao do AGHUse na Bahia menciona explicitamente a integracao com a RNDS como objetivo -- um ponto de entrada concreto.

#### Desafios:

1. **Sem repositorio publico:** O codigo-fonte nao esta no GitHub/GitLab. Isso significa que o Ponte nao pode simplesmente submeter PRs. Engajamento institucional e necessario.

2. **Modelo institucional:** Ingressar na comunidade requer acordos formais de cooperacao, nao contribuicoes de desenvolvedores individuais.

3. **Stack tecnologica legada:** Java EE com JBoss Seam/JSF e uma stack mais antiga. O trabalho de integracao precisaria ser em Java e compativel com essa arquitetura.

4. **Dois ecossistemas:** A divisao AGHU (Ebserh) vs. AGHUse (HCPA) significa que o trabalho em um ramo pode nao beneficiar automaticamente o outro.

5. **Escassez de documentacao:** Documentacao tecnica publica limitada torna mais dificil comecar a desenvolver sem estar dentro da comunidade.

#### Abordagem Recomendada:

1. **Contatar o NITT do HCPA** (nitt@hcpa.edu.br) para explorar o ingresso na Comunidade AGHUse ou estabelecer um canal de cooperacao.

2. **Alavancar um parceiro institucional:** Se o Ponte possui relacionamentos com algum membro da comunidade AGHUse (ex.: um hospital universitario, uma secretaria estadual de saude), usar isso como ponto de entrada.

3. **Focar na lacuna RNDS:** Posicionar o Ponte como a equipe capaz de entregar integracao RNDS/FHIR R4 para o AGHUse (especificamente geracao e submissao de RAC/RSA para a RNDS).

4. **Considerar o angulo da Bahia:** A implantacao no estado da Bahia esta ativamente buscando integracao RNDS com o AGHUse. Uma parceria aqui poderia ter alto impacto.

5. **Construir modulos FHIR autonomos primeiro:** Desenvolver bibliotecas de geracao de recursos FHIR R4 que funcionem com o modelo de dados do AGHUse, depois propor integracao.

6. **Engajar ambos os ecossistemas:** Embora o AGHUse seja o alvo principal, monitorar o trabalho de integracao RNDS do AGHU da Ebserh para aprender com seus padroes de integracao.

---

## Comparacao: AGHUse vs. Sistemas Relacionados

| Sistema | Mantenedor | Licenca | Stack Tecnologica | RNDS | Status | Acesso ao Codigo |
|---------|-----------|---------|-------------------|------|--------|-------------------|
| **AGHUse** | HCPA | GPL | Java EE, JBoss, PostgreSQL | Planejado | Muito ativo, 100+ unidades | Apenas comunidade |
| **AGHU** | Ebserh | GPL | Java EE, JBoss, PostgreSQL | Ativo (2025) | Muito ativo, 45 hospitais | Rede Ebserh |
| **Madre** | Basis TI | EULA proprietaria | Java, TypeScript, Docker | Nenhum | **Arquivado** (fev 2025) | GitHub (arquivado) |
| **OpenSUS** | Comunidade | Desconhecida | Desconhecida | Desconhecido | Informacoes limitadas | Desconhecido |

**Madre** (https://github.com/BasisTI/madre) era uma alternativa potencial, mas foi **arquivado em fevereiro de 2025** com apenas 14 estrelas e 28 contribuidores. Nao esta mais sendo mantido.

---

## Contatos-Chave

- **Transferencia de Tecnologia do HCPA (NITT):** nitt@hcpa.edu.br
- **Portal da Comunidade AGHUse:** https://sites.google.com/hcpa.edu.br/aghuse/
- **Pagina Oficial do HCPA:** https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse

---

## Fontes

- [Portal da Comunidade AGHUse](https://sites.google.com/hcpa.edu.br/aghuse/sobre-o-aghuse)
- [Pagina Institucional do AGHUse no HCPA](https://www.hcpa.edu.br/institucional/institucional-apresentacao/tecnologia-da-informacao-e-comunicacao/institucional-sistema-aghuse)
- [Ministerio da Saude Ingressa na Comunidade AGHUse](https://www.hcpa.edu.br/4125-ministerio-da-saude-e-o-mais-novo-integrante-da-comunidade-aghuse)
- [Visita Tecnica ao HCPA para Apresentacao do AGHUse](https://www.hcpa.edu.br/4117-hcpa-recebe-visita-tecnica-para-apresentar-o-aghuse-sistema-que-transforma-a-gestao-hospitalar)
- [Secretaria de Saude do RS Adota o AGHUse](https://www.hcpa.edu.br/3933-secretaria-da-saude-do-rs-fara-uso-de-sistema-de-gestao-criado-pelo-hospital-de-clinicas-de-porto-alegre)
- [Exercito Brasileiro Firma Acordo para o AGHUse](https://www.hcpa.edu.br/3794-exercito-brasileiro-firma-acordo-para-ampliar-utilizacao-do-aghuse)
- [HCPA Capacita Empresas Credenciadas](https://www.hcpa.edu.br/3829-hcpa-capacita-empresas-credenciadas-a-implantar-o-sistema-aghuse)
- [Comitiva do Exercito Visita o HCPA para o AGHUse](https://www.hcpa.edu.br/3403-comitiva-do-exercito-brasileiro-visita-o-clinicas-para-acelerar-implantacao-do-aghuse)
- [Policlinicas de Salvador Implantam o AGHUse](https://www.saude.ba.gov.br/2024/11/04/policlinicas-de-salvador-comecam-a-utilizar-o-aghuse/)
- [Bahia Lidera Transformacao Digital da Saude](https://www.saude.ba.gov.br/2024/08/30/bahia-lidera-transformacao-digital-da-saude-publica-no-brasil-com-assinatura-de-protocolo-de-intencoes-pioneiro/)
- [Implantacao do AGHUse na Paraiba](https://paraiba.pb.gov.br/diretas/saude/noticias/paraiba-avanca-na-implantacao-do-sistema-aghuse-que-garante-modernizacao-e-maior-eficiencia-na-gestao-em-saude)
- [Unicamp Adota o AGHUse](https://hc.unicamp.br/newsite_noticia_389_aghuse-sera-adotado-em-unidades-assistenciais-da-unicamp/)
- [Caso de Estudo da Migracao da Unicamp para AWS](https://aws.amazon.com/pt/blogs/aws-brasil/case-de-sucesso-como-a-unicamp-construiu-uma-arquitetura-resiliente-e-migrou-o-aghuse-para-a-aws/)
- [Pagina da Plataforma AGHU na Ebserh](https://www.gov.br/ebserh/pt-br/governanca/plataformas-e-tecnologias/aghu)
- [Integracao AGHU com SUS Digital (SBIS)](https://sbis.org.br/noticia/aghu-sistema-certificado-pela-sbis-e-integrado-ao-sus-digital-e-fortalece-o-prontuario-unico-do-cidadao/)
- [Integracao AGHU com SUS Digital (Ebserh)](https://www.gov.br/ebserh/pt-br/comunicacao/noticias/aghu-se-integra-ao-sus-digital-e-fortalece-o-prontuario-unico-do-cidadao)
- [Ebserh Lanca AGHU v11 (SBIS)](https://sbis.org.br/noticia/ebserh-lanca-nova-versao-do-aplicativo-de-gestao-para-hospitais-universitarios-em-parceira-com-a-sbis-e-a-rnp/)
- [Nota Tecnica CONASS 05/2023](https://www.conass.org.br/biblioteca/wp-content/uploads/2024/09/NT-05-2023-software-hospitalar.pdf)
- [Ministerio da Saude Expande AGHU](https://www.gov.br/saude/pt-br/assuntos/noticias/2024/fevereiro/hospitais-e-servicos-especializados-do-sus-poderao-aderir-ao-sistema-eletronico-aghu)
- [Caso de Estudo AGHU na ENAP](https://repositorio.enap.gov.br/bitstream/1/4075/1/AGHU%20%20Modelo%20de%20Gest%C3%A3o%20do%20HCPA%20Inovando%20a%20Assist%C3%AAncia%20%C3%A0%20Sa%C3%BAde.pdf)
- [Vitrine Tecnologica do AGHUse no NITT](https://sites.google.com/hcpa.edu.br/nitt/vitrine-tecnologica/aghuse-sistema-de-gestao-em-saude)
- [Repositorio GitHub do Madre (Arquivado)](https://github.com/BasisTI/madre)
- [AGHUse na Forca Aerea Brasileira (HCA)](https://www2.fab.mil.br/hca/index.php/slideshow/301-implantacao-do-sistema-aghuse-no-hca)
- [Chamamento Publico DATASUS para o AGHU](https://datasus.saude.gov.br/ministerio-da-saude-faz-chamamento-publico-para-adesao-a-comunidade-do-aghu)
- [Certificacao SBIS do AGHU](https://www.conass.org.br/aghu-recebe-certificacao-de-excelencia-da-sociedade-brasileira-de-informatica-em-saude/)
