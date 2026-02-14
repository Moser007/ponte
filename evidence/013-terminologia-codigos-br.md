# R013 — Pesquisa de Códigos Reais nas Terminologias Brasileiras de Saúde

> **Data:** 2026-02-14
> **Objetivo:** Encontrar códigos reais nos CodeSystems brasileiros para uso nos builders FHIR R4 do adaptador IPM → RNDS.
> **Método:** Consulta a terminologia.saude.gov.br, rnds-fhir.saude.gov.br, kyriosdata/rnds-ig, InfoSUS-SC, documentação LEDI/CATMAT.

---

## 1. CodeSystem BRMedicamento — Códigos para Alérgenos (AllergyIntolerance.code)

### System URI canônico
```
http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento
```
**NOTA:** O servidor terminologia.saude.gov.br também usa `https://terminologia.saude.gov.br/fhir/CodeSystem/BRMedicamento`. Ambos referem-se ao mesmo CodeSystem. O URI canônico histórico (e usado no ValueSet BRMedicamento-1.0 da RNDS) é o `http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento`.

### Característica importante
O CodeSystem BRMedicamento tem `content: not-present` na representação FHIR, ou seja, os códigos individuais não estão embutidos no JSON/XML do CodeSystem publicado. Os códigos são os mesmos do **CATMAT** (Catálogo de Materiais do Governo Federal), com prefixo `BR` seguido de números.

### Códigos de Penicilina/Beta-lactâmicos encontrados

| Code | Display | Uso como alérgeno |
|------|---------|-------------------|
| **BR0270616U0118** | BENZILPENICILINA POTÁSSICA 5.000.000 UI PÓ PARA SOLUÇÃO INJETÁVEL | **Recomendado para "alergia a penicilina"** |
| **BR0270612U0118** | BENZILPENICILINA BENZATINA 1.200.000 UI PÓ PARA SUSPENSÃO INJETÁVEL | Alternativa (penicilina benzatina) |
| BR0270615 | BENZILPENICILINA POTÁSSICA 1.000.000 UI SOLUÇÃO INJETÁVEL FRASCO-AMPOLA 2 ML | Alternativa |
| BR0267515-1 | AMPICILINA 500 MG CÁPSULA | Beta-lactâmico relacionado |
| BR0267515-2 | AMPICILINA 500 MG COMPRIMIDO | Beta-lactâmico relacionado |
| BR0268207 | AMPICILINA 1000 MG PÓ PARA SOLUÇÃO INJETÁVEL | Beta-lactâmico relacionado |
| BR0271089U0041 | AMOXICILINA 500 MG CÁPSULA | Beta-lactâmico relacionado |
| BR0271089U0042 | AMOXICILINA 500 MG COMPRIMIDO | Beta-lactâmico relacionado |

### Recomendação para o builder `allergy.ts`

Para o cenário Maria (alergia a penicilina), usar:
```json
{
  "system": "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
  "code": "BR0270616U0118",
  "display": "BENZILPENICILINA POTÁSSICA 5.000.000 UI PÓ PARA SOLUÇÃO INJETÁVEL"
}
```

**Observação:** O BRMedicamento codifica medicamentos com apresentação específica (dose, forma farmacêutica). Não existe um código genérico "penicilina" — os códigos são para formas farmacêuticas específicas. Para alergia, qualquer código de benzilpenicilina serve como representante da classe.

---

## 2. Códigos CATMAT para Medicamentos do SUS (MedicationStatement)

### System URI para MedicationStatement
```
http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento
```
Os códigos CATMAT são os mesmos do BRMedicamento. O CodeSystem é unificado.

### Insulina NPH (Humana)

| Code | Display | Apresentação |
|------|---------|-------------|
| **BR0271157U0063** | INSULINA HUMANA NPH 100 UI/ML SUSPENSÃO INJETÁVEL 10 ML ELENCO ESTADUAL | Frasco 10 mL, 100 UI/mL |
| BR0271157U0137 | INSULINA HUMANA NPH 100 UI/ML SUSPENSÃO INJETÁVEL (variante) | Confirmado em nota informativa CE |

**Recomendação para builder `medication.ts` (insulina NPH):**
```json
{
  "system": "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
  "code": "BR0271157U0063",
  "display": "INSULINA HUMANA NPH 100 UI/ML SUSPENSÃO INJETÁVEL 10 ML"
}
```

### Metildopa 250mg

| Code | Display | Apresentação |
|------|---------|-------------|
| **BR0267689U0042** | METILDOPA 250 MG COMPRIMIDO | Comprimido revestido |
| BR0267688 | METILDOPA 500 MG COMPRIMIDO | Alternativa (dose maior) |

**Recomendação para builder `medication.ts` (metildopa):**
```json
{
  "system": "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
  "code": "BR0267689U0042",
  "display": "METILDOPA 250 MG COMPRIMIDO"
}
```

---

## 3. CID-10 — System URI Brasileiro

### Resultado: **O Brasil usa system URI próprio, NÃO o genérico HL7**

| Aspecto | Valor |
|---------|-------|
| **System URI canônico (antigo/REDS GO)** | `http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10` |
| **System URI canônico (terminologia.saude.gov.br)** | `https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10` |
| **System genérico HL7 (NÃO usar)** | `http://hl7.org/fhir/sid/icd-10` |

### Discrepância de URIs

Foram encontrados **dois URIs** para o BRCID10:
1. `http://www.saude.gov.br/fhir/r4/CodeSystem/BRCID10` — usado no REDS GO (Goiás), versão 1.0.3 (draft, 2020)
2. `https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10` — usado no terminologia.saude.gov.br, versão 1.0.0 (active, 2025)

**Recomendação:** Usar o URI mais recente do servidor oficial de terminologias:
```
https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10
```

Esse é o URI usado pelo ValueSet `BRTerminologiaSuspeitaDiagnostica` na versão publicada em terminologia.saude.gov.br (v1.0.0, 2025-10-23).

### Binding no perfil BRCondicaoSaude (RNDS)

| Aspecto | Valor |
|---------|-------|
| **ValueSet** | BRTerminologiaSuspeitaDiagnostica |
| **Binding strength** | **required** |
| **Consequência** | O CID-10 system genérico (`http://hl7.org/fhir/sid/icd-10`) será **REJEITADO** pela RNDS |

### Códigos CID-10 para o cenário Maria

| Code | Display | Condição |
|------|---------|----------|
| O24.4 | Diabetes mellitus gestacional | Diabetes gestacional da Maria |
| O13 | Hipertensão gestacional sem proteinúria significativa | Hipertensão gestacional da Maria |

**Ação necessária no builder `condition.ts`:**
Trocar o system de `http://hl7.org/fhir/sid/icd-10` para `https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10`.

---

## 4. CodeSystem BRAlergenosCBARA — Penicilina

### System URI
```
https://terminologia.saude.gov.br/fhir/CodeSystem/BRAlergenosCBARA
```

### Resultado: **Códigos NÃO disponíveis publicamente**

O CodeSystem BRAlergenosCBARA tem `content: not-present` no servidor de terminologias. Os códigos reais não estão listados na representação HTML, JSON ou TTL publicada. CBARA provavelmente refere-se à **Classificação Brasileira de Alergias e Reações Adversas** (ou similar), mas a lista completa de códigos não está acessível.

### Estrutura do ValueSet BRAlergenos

O ValueSet `BRAlergenos` inclui códigos de **3 CodeSystems**:

| CodeSystem | URI | Conteúdo |
|-----------|-----|----------|
| **BRMedicamento** | `http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento` | Medicamentos como alérgenos (penicilina, amoxicilina, etc.) |
| **BRImunobiologico** | `https://terminologia.saude.gov.br/fhir/CodeSystem/BRImunobiologico` | Vacinas e imunobiológicos como alérgenos |
| **BRAlergenosCBARA** | `https://terminologia.saude.gov.br/fhir/CodeSystem/BRAlergenosCBARA` | Alérgenos ambientais/alimentares (ex: veneno de vespa) |

### Recomendação para penicilina como alérgeno

Para alergia a penicilina, usar o CodeSystem **BRMedicamento** (NÃO o BRAlergenosCBARA). O BRAlergenosCBARA parece ser destinado a alérgenos não-medicamentosos (ambientais, alimentares, venenos).

---

## 5. CodeSystem BRObmCATMAT (Ontologia Brasileira de Medicamentos)

### Descoberta adicional

Existe um CodeSystem `BRObmCATMAT` (Produto Medicinal Virtual no CATMAT):
- **URI:** `https://terminologia.saude.gov.br/fhir/CodeSystem/BRObmCATMAT`
- **Status:** active (2025-10-23)
- **Content:** not-present
- **Relação com BRMedicamento:** Ambos são referenciados no ValueSet `BRTerminologiaMedicamento`. O BRObmCATMAT parece ser a versão OBM (Ontologia Brasileira de Medicamentos) do CATMAT, potencialmente com mais granularidade.

Para o adaptador Ponte, usar o **BRMedicamento** que é o CodeSystem referenciado no ValueSet BRAlergenos e no perfil BRCoreMedicationStatement.

---

## 6. Resumo de Ações para os Builders

### allergy.ts (AllergyIntolerance)
```typescript
// ANTES (errado):
code: {
  coding: [{
    system: "https://terminologia.saude.gov.br/fhir/ValueSet/BRAlergenos", // ValueSet!
    display: "Penicilina"
    // sem code!
  }]
}

// DEPOIS (correto):
code: {
  coding: [{
    system: "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
    code: "BR0270616U0118",
    display: "BENZILPENICILINA POTÁSSICA 5.000.000 UI PÓ PARA SOLUÇÃO INJETÁVEL"
  }]
}
```

### medication.ts (MedicationStatement)
```typescript
// Insulina NPH
medicationCodeableConcept: {
  coding: [{
    system: "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
    code: "BR0271157U0063",
    display: "INSULINA HUMANA NPH 100 UI/ML SUSPENSÃO INJETÁVEL 10 ML"
  }]
}

// Metildopa 250mg
medicationCodeableConcept: {
  coding: [{
    system: "http://www.saude.gov.br/fhir/r4/CodeSystem/BRMedicamento",
    code: "BR0267689U0042",
    display: "METILDOPA 250 MG COMPRIMIDO"
  }]
}
```

### condition.ts (Condition)
```typescript
// ANTES (potencialmente rejeitado):
code: {
  coding: [{
    system: "http://hl7.org/fhir/sid/icd-10",  // genérico HL7
    code: "O24.4",
    display: "Diabetes mellitus gestacional"
  }]
}

// DEPOIS (conforme RNDS):
code: {
  coding: [{
    system: "https://terminologia.saude.gov.br/fhir/CodeSystem/BRCID10",  // brasileiro
    code: "O24.4",
    display: "Diabetes mellitus gestacional"
  }]
}
```

---

## 7. Fontes Consultadas

1. [ValueSet BRAlergenos](https://terminologia.saude.gov.br/fhir/ValueSet-BRAlergenos.html) — 3 CodeSystems incluídos
2. [ValueSet BRMedicamento-1.0 (kyriosdata)](https://kyriosdata.github.io/rnds-ig/ValueSet-BRMedicamento-1.0.html) — expansão com códigos CATMAT reais
3. [CodeSystem BRCID10 (REDS GO)](https://fhir.saude.go.gov.br/r4/reds-go/CodeSystem-BRCID10.html) — URI canônico e versão
4. [CodeSystem BRCID10 (terminologia.saude.gov.br)](https://terminologia.saude.gov.br/fhir/CodeSystem-BRCID10.html) — URI canônico atualizado
5. [ValueSet BRTerminologiaSuspeitaDiagnostica](https://terminologia.saude.gov.br/fhir/ValueSet-BRTerminologiaSuspeitaDiagnostica.html) — inclui BRCID10 com binding required
6. [BRCondicaoSaude (RNDS)](https://rnds-fhir.saude.gov.br/StructureDefinition-BRCondicaoSaude.html) — perfil Condition com binding required
7. [NamingSystem BRCID10 (RNDS)](https://rnds-fhir.saude.gov.br/NamingSystem-BRCID10.html)
8. [CodeSystem BRObmCATMAT](https://terminologia.saude.gov.br/fhir/CodeSystem-BRObmCATMAT.html) — OBM/CATMAT
9. [CodeSystem BRAlergenosCBARA](https://terminologia.saude.gov.br/fhir/CodeSystem-BRAlergenosCBARA.html) — alérgenos não-medicamentosos
10. [CodeSystem BRMedicamento](https://terminologia.saude.gov.br/fhir/CodeSystem-BRMedicamento.html) — content not-present
11. [Tabela CATMAT e-SUS LEDI](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/referencias/tabela_catmat.html) — referência CATMAT
12. [Nota Informativa No 12-2025 Ceará - Insulinas](https://www.saude.ce.gov.br/wp-content/uploads/sites/9/2018/06/Nota-Informativa-No-12-2025-Insulina-NPH-e-Regular-1.pdf) — códigos CATMAT insulina
13. [IPS Brasil](https://ips-brasil.web.app/) — guia de implementação IPS brasileiro

---

## 8. Gaps e Incertezas

1. **Discrepância de URI do BRCID10:** Dois URIs encontrados (`http://www.saude.gov.br/fhir/r4/...` vs `https://terminologia.saude.gov.br/fhir/...`). O mais recente (terminologia.saude.gov.br) parece ser o correto para a versão v1.0.0. Pode ser necessário testar ambos na homologação RNDS.

2. **BRAlergenosCBARA sem códigos visíveis:** Os códigos deste CodeSystem não estão publicados. Para alérgenos medicamentosos, usar BRMedicamento. Para alérgenos ambientais/alimentares (ex: pólen, ácaros), seria necessário obter a lista do CBARA por outro canal (contato com DATASUS ou uso do $expand no servidor).

3. **BRMedicamento content: not-present:** Os códigos não estão embutidos no CodeSystem publicado. A fonte de verdade é a tabela CATMAT. A expansão disponível no kyriosdata/rnds-ig foi fundamental para obter os códigos reais.

4. **Variantes de código CATMAT:** Alguns medicamentos têm múltiplas variantes (ex: `BR0271157U0063` vs `BR0271157U0137` para insulina NPH). As variantes representam diferentes apresentações ou elencos (estadual, municipal). Para o adaptador, usar a variante mais genérica ou mapear de acordo com o que o IPM registra.

5. **IPS Brasil:** Existe um guia de implementação do IPS (International Patient Summary) brasileiro que usa SNOMED CT IPS como terminologia principal, mapeada para terminologias locais. Pode ser relevante como alternativa de codificação no futuro.
