# Pesquisa: Estado Atual da RNDS — 2026-02-13

## Resumo

A RNDS é a plataforma nacional de interoperabilidade de dados de saúde do Brasil. Usa FHIR R4, tem 2,8 bilhões de registros, cobre 68% dos municípios. Formalizada pelo Decreto 12.560/2025.

## Dados-chave

### Cobertura
- 3.805 municípios integrados (68,3%)
- 21 estados + DF
- Desigualdade regional significativa

### Dados trocados
| Tipo | Volume |
|------|--------|
| Vacinas | 1,5 milhão |
| Exames laboratoriais | 75 milhões |
| Consultas/atendimentos | 436 milhões |
| Prescrições eletrônicas | 30,2 milhões |
| Atestados médicos | 4,8 milhões |
| Regulação | 773 milhões |
| Internações | 9 milhões |

### Casos de uso RNDS
- RAC: Resumo de Atendimento Clínico (atenção primária)
- RSA: Resumo de Saída Hospitalar
- RIA: Registro de Imunobiológico
- REL: Resultado de Exame Laboratorial
- RPA: Registro de Prescrição
- RPO: Resumo de Parto Obstétrico
- RDI: Registro de Dispensação

### Tecnologia
- Padrão: FHIR R4 exclusivamente
- 40 perfis FHIR, 72 CodeSystems, 93 ValueSets, 32 extensões
- Autenticação: certificados ICP-Brasil + mTLS
- Perfis publicados: https://simplifier.net/redenacionaldedadosemsaude
- Guia de integração: https://rnds-guia.saude.gov.br/

### e-SUS APS
- PEC (Prontuário Eletrônico do Cidadão): sistema para UBS
- APIs locais: Apache Thrift + XML (LEDI)
- O PEC faz a ponte Thrift/XML → FHIR para enviar à RNDS
- Desenvolvido pela UFSC

### Projetos Open Source
- AGHUse: HIS open-source do HCPA (GPL), integrado à RNDS
- Madre (BasisTI): HIS open-source no GitHub
- OpenEHR Brasil: comunidade ativa

### Limitações identificadas
1. Desigualdade regional na implantação
2. Municípios pequenos sem recursos técnicos/financeiros
3. Sistemas legados sem suporte a FHIR
4. Fragmentação regulatória (ANS, MS, ANVISA)
5. Integração público-privado ainda incipiente
6. Conectividade precária em regiões remotas

### Fontes
- https://www.gov.br/saude/pt-br/composicao/seidigi/rnds
- https://rnds-guia.saude.gov.br/
- https://simplifier.net/redenacionaldedadosemsaude
- Decreto 12.560/2025
- https://sisaps.saude.gov.br/sistemas/esusaps/
