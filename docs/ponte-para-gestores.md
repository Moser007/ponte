# PONTE — Solução Gratuita para Conectar seu Município à RNDS

**Seu município usa IPM Atende.Net? Então os dados clínicos dos seus pacientes NÃO estão chegando à RNDS.**

---

## O Problema

O Decreto 12.560/2025 tornou a RNDS (Rede Nacional de Dados em Saúde) política de Estado. As Portarias 5.663/2024, 6.656/2025 e 7.495/2025 exigem que todos os sistemas de saúde enviem dados clínicos à RNDS.

**Porém:** O IPM Atende.Net, usado por mais de 120 municípios em SC, **não envia dados clínicos à RNDS**. Só envia vacinação. Isso significa que:

- Quando uma gestante do seu município chega a uma maternidade de referência, o médico **não tem acesso** ao pré-natal, diagnósticos, alergias ou medicamentos
- 92% das mortes maternas no Brasil são evitáveis (Fiocruz)
- SC registrou 43 mortes maternas em 2024 — pior resultado em duas décadas
- 75% dos municípios de SC ainda não enviam dados clínicos à RNDS

**O município está em desconformidade regulatória** e seus pacientes estão em risco quando precisam de atendimento fora do município.

---

## A Solução: Projeto Ponte

O **Ponte** é um software gratuito e open-source que faz a conexão entre o IPM Atende.Net e a RNDS. Ele lê os dados que já existem no sistema do município e os envia à RNDS no formato exigido pelo Ministério da Saúde.

### Como funciona (simplificado)

```
Dados no IPM  →  Ponte (traduz para o formato da RNDS)  →  RNDS
```

O Ponte **não substitui o IPM**. Ele complementa, fazendo a tradução que o IPM ainda não faz. Os profissionais de saúde continuam usando o sistema normalmente.

### O que o Ponte já envia à RNDS por atendimento:
- Dados do paciente (CPF, nome, data de nascimento, raça/cor)
- Diagnósticos (CID-10, CIAP-2)
- Alergias e reações adversas
- Medicamentos em uso
- Sinais vitais (pressão arterial, peso, glicemia)
- Dados obstétricos (idade gestacional, DUM, histórico de gestações)
- Identificação do profissional e do estabelecimento (CNS, CNES)

### Situação técnica atual:
- Software funcional com 343 testes automatizados
- Conforme com os perfis BR Core exigidos pela RNDS
- Duas vias de acesso aos dados do IPM (banco direto ou arquivos LEDI)
- Validado contra as terminologias oficiais brasileiras

---

## O que o Município Ganha

| Benefício | Detalhes |
|-----------|----------|
| **Conformidade regulatória** | Atende o Decreto 12.560 e as Portarias 5.663, 6.656 e 7.495 |
| **Custo zero** | Licença MIT — gratuito, sem mensalidade, sem taxa |
| **Segurança dos pacientes** | Dados clínicos disponíveis quando o paciente for atendido em outro município |
| **Sem mudança operacional** | Profissionais continuam usando o IPM normalmente |
| **Sem dependência** | Código aberto — o município não fica preso a nenhum fornecedor |

---

## O que Precisamos para o Piloto

Para testar o Ponte no seu município, precisamos de **3 coisas simples:**

1. **Autorização do gestor** para fazer o credenciamento na RNDS em nome do município
2. **Certificado digital ICP-Brasil** do estabelecimento (e-CNPJ ou e-CPF de responsável) — muitos municípios já possuem para outros sistemas federais
3. **Acesso ao sistema** para validar que os dados estão sendo traduzidos corretamente

O processo de credenciamento na RNDS é feito pelo portal DATASUS e leva poucos dias. Nós acompanhamos todo o processo técnico.

**O piloto é rápido:** com o credenciamento pronto, o sistema pode começar a enviar dados em questão de dias.

---

## Quem Está por Trás

**Giovanni Moser** — Desenvolvedor de tecnologia e advogado. Família em Blumenau, SC. O projeto nasceu da constatação de que municípios pequenos de SC ficaram para trás na integração com a RNDS, e que o IPM Atende.Net — dominante na região — não oferece essa integração para dados clínicos.

- **Email:** giovanni@moser007.dev
- **Código-fonte:** github.com/Moser007/ponte (público, licença MIT)

---

## Regulação Federal que Exige a Integração

| Regulação | O que diz |
|-----------|-----------|
| **Decreto 12.560/2025** | RNDS é política de Estado. CPF como chave única do cidadão |
| **Portaria 5.663/2024** | Formato antigo (Thrift) descontinuado. FHIR é o novo padrão |
| **Portaria 6.656/2025** | Dados de regulação assistencial devem ir para a RNDS diariamente |
| **Portaria 7.495/2025** | Todos os sistemas de saúde devem ser interoperáveis com a RNDS |
| **Portaria 8.025/2025** | Sumário de Alta Obstétrico (SAO) obrigatório na RNDS |

---

## Próximos Passos

Se o seu município tem interesse em ser piloto:

1. **Fale com Giovanni** (giovanni@moser007.dev) ou com a **Gisele do COSEMS-SC** que encaminhou este documento
2. Nós orientamos o processo de credenciamento na RNDS
3. Configuramos o Ponte para o seu município
4. Acompanhamos a homologação com o Ministério da Saúde
5. Município começa a enviar dados clínicos à RNDS

**Custo total para o município: R$ 0,00**

---

*O Ponte existe para que nenhum paciente chegue a uma emergência sem histórico clínico — especialmente as gestantes dos municípios pequenos de Santa Catarina.*

*Projeto open-source (MIT) | github.com/Moser007/ponte*
