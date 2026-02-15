# PONTE — Adaptador IPM → RNDS para Municípios de SC

> Projeto open-source (MIT) | github.com/Moser007/ponte
> Contato: Giovanni Moser | giovanni@moser007.dev

---

## O Problema

**75% dos municípios de SC não enviam dados clínicos à RNDS** (apenas 74 de 295 conectados). O IPM Atende.Net, usado por 120+ municípios, **não integra dados clínicos** com a RNDS — apenas vacinação COVID.

**Consequência real:** Quando uma gestante de um município com IPM chega a uma maternidade de referência, o obstetra **não tem acesso** ao pré-natal, diagnósticos, alergias ou medicamentos. 92% das mortes maternas são evitáveis (Fiocruz). 33-40% das gestantes peregrinam entre serviços sem dados clínicos. SC registrou 43 mortes maternas em 2024 — pior ano em duas décadas.

## A Solução

O **Ponte** é um adaptador que lê dados do IPM e gera documentos FHIR R4 compatíveis com a RNDS, permitindo que municípios cumpram as exigências do Decreto 12.560/2025 e das Portarias 5.663, 6.656 e 7.495.

**O que faz:** IPM Atende.Net (PostgreSQL) → Bundle RAC FHIR R4 (BR Core) → RNDS

**O que já funciona:**
- 18 recursos FHIR R4 por atendimento (Composition, Patient, Encounter, Conditions, Allergies, VitalSigns, DUM, Obstetric History, Medications)
- Perfis BR Core conformes (CPF, CNS, raça/cor, CID-10, CIAP-2, LOINC, UCUM, BRMedicamento/CATMAT)
- Validação local + validação CPF (algoritmo Receita Federal)
- 175 testes automatizados passando
- Demo funcional do cenário "Maria" — gestante de alto risco

## Cenário Maria (demo real)

Maria, 39 anos, G3P1, gestante de alto risco no pré-natal da UBS Vila Nova (IPM):
- Diabetes gestacional (O24.4) + Hipertensão gestacional (O13)
- Alergia a penicilina (gravidade alta, reação anafilaxia)
- Insulina NPH 10UI 2x/dia + Metildopa 250mg 3x/dia
- PA 130/85 mmHg, glicemia capilar 135 mg/dL, IG 32 semanas
- DUM: 10/04/2025

**Com o Ponte:** Esse pré-natal gera um Bundle RAC FHIR R4 enviado à RNDS. Quando Maria chegar à maternidade, o obstetra terá TUDO em 30 segundos.

## O que Precisamos

1. **Município parceiro** no Vale do Itajaí que use IPM e queira ser piloto
2. **Credenciamento RNDS** (CNES do município + certificado ICP-Brasil)
3. **Acesso ao banco PostgreSQL** do IPM para mapear tabelas reais

## Regulação que Sustenta

| Regulação | Impacto |
|-----------|---------|
| Decreto 12.560/2025 | RNDS = política de Estado, CPF = chave única |
| Portaria 5.663/2024 | Thrift descontinuado (set/2025), FHIR obrigatório para vacinação |
| Portaria 6.656/2025 | Regulação assistencial → RNDS diário |
| Portaria 7.495/2025 | Sistemas devem ser interoperáveis com RNDS |
| Portaria 8.025/2025 | SAO (Sumário de Alta Obstétrico) na RNDS |

## Stack Técnico

- TypeScript 5.x + Node.js
- @medplum/fhirtypes (tipagem FHIR R4)
- Zero dependências de infraestrutura
- Licença MIT (gratuito, sem restrições)

---

*O Ponte não substitui o IPM — complementa, conectando-o à RNDS para que nenhuma gestante chegue a uma emergência sem histórico clínico.*
