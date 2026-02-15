# R018 -- Formato LEDI/Thrift do e-SUS APS: Especificacao Tecnica para Via B

> Pesquisa executada em 2026-02-14
> Ponte (pesquisa autonoma #18)

---

## 1. Resumo Executivo

**Pergunta central:** Como funciona o formato LEDI (Layout e-SUS APS de Dados e Interface) usado pelo IPM Atende.Net para exportar dados clinicos ao e-SUS APS? Podemos ler esses arquivos diretamente (Via B) em vez de acessar o banco PostgreSQL (Via A)?

**Resposta:** SIM, a Via B e VIAVEL e potencialmente SUPERIOR a Via A.

O LEDI e um formato binario baseado em Apache Thrift (ou XML alternativo) que define a estrutura de TODOS os dados que sistemas terceiros como o IPM exportam ao e-SUS APS/SISAB. O formato e 100% documentado publicamente pela UFSC (Laboratorio Bridge), com schemas Thrift disponiveis em GitHub, codigo gerado para Node.js ja existente, e uma API de transmissao via HTTP disponivel desde a versao 5.3.19 do PEC.

**Descobertas criticas:**
1. Os schemas Thrift (.thrift files) estao publicados no GitHub: `laboratoriobridge/esusab-integracao`
2. Codigo Node.js gerado (gen-nodejs/) ja existe no mesmo repositorio -- 15 arquivos de tipos
3. Um projeto de exemplo em Node.js existe: `dgldaniel/esusab-integracao-thrift-nodejs`
4. A biblioteca `thrift` no npm (v0.22.0) suporta TBinaryProtocol para serializar/deserializar
5. A biblioteca `@creditkarma/thrift-typescript` gera TypeScript a partir de .thrift files
6. Cada arquivo `.esus` contem UM DadoTransporte serializado via TBinaryProtocol
7. O campo `tipoDadoSerializado` identifica o tipo de ficha (2=cadastro individual, 4=atendimento individual, etc.)
8. Existe uma API REST para enviar fichas LEDI diretamente ao PEC via POST

---

## 2. O que e LEDI

### 2.1 Definicao

LEDI = **Layout e-SUS APS de Dados e Interface**. E a especificacao tecnica que define como sistemas terceiros (como IPM Atende.Net, MV SIGSS, Tasy, etc.) devem estruturar e enviar dados de saude da Atencao Primaria para o sistema e-SUS APS (PEC ou Centralizador Municipal).

O LEDI:
- E **obrigatorio** para todos os sistemas de saude da APS que nao usam o PEC nativo
- Define a estrutura de **15 tipos de fichas** (formularios de dados)
- Pode ser implementado via **Apache Thrift** (binario, `.esus`) ou **XML** (`.xml`)
- E **independente de linguagem de programacao** -- Thrift suporta C#, Delphi, Go, Java, PHP, Python, Node.js e Ruby
- Versao atual: **7.3.7** (compativel com PEC e-SUS APS 5.4.29+)

### 2.2 Documentacao oficial

| Recurso | URL |
|---------|-----|
| Portal de integracao UFSC (atual) | https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/index.html |
| Portal de integracao UFSC (legado) | https://integracao.esusab.ufsc.br/ |
| Repositorio GitHub oficial | https://github.com/laboratoriobridge/esusab-integracao |
| Dicionario de dados FAI | https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fai.html |
| Dicionario de dados FCI | https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fci.html |
| Dicionario de referencias | https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/referencias/dicionario.html |
| API de transmissao LEDI | https://sisaps.saude.gov.br/sistemas/esusaps/docs/manual/APOIO/API_transmissao/ |
| Thrift/XSD por ficha | https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/thrift-xsd.html |

### 2.3 Quem mantem

O LEDI e mantido pelo **Laboratorio Bridge** da UFSC (Universidade Federal de Santa Catarina), em Florianopolis -- a mesma cidade onde fica a sede administrativa do IPM Sistemas. O Bridge e responsavel pelo desenvolvimento do e-SUS APS para o Ministerio da Saude/DATASUS.

---

## 3. Formato Tecnico: Apache Thrift

### 3.1 Estrutura de arquivos

O formato LEDI organiza dados em **lotes** (batches). Cada lote e um conjunto de arquivos de dados. Cada arquivo de dados representa **uma ficha** (formulario de saude).

```
lote.zip
  |-- 0000001-uuid-ficha-1.esus     (DadoTransporte serializado)
  |-- 0000001-uuid-ficha-2.esus     (DadoTransporte serializado)
  |-- 0000001-uuid-ficha-3.esus     (DadoTransporte serializado)
  |-- ...
```

- Extensao: `.esus` (desde v2.0; antes era `.esus13`)
- Formato: binario serializado via **TBinaryProtocol** do Apache Thrift
- Cada arquivo `.esus` contem exatamente **um DadoTransporte**
- O nome do arquivo segue o padrao: `{numLote}-{uuid}.esus`
- O lote pode ser compactado em ZIP para envio

### 3.2 Camada de Transporte: DadoTransporteThrift

Todo arquivo `.esus` e um `DadoTransporteThrift` serializado. Esta struct encapsula qualquer tipo de ficha:

```thrift
struct DadoTransporteThrift {
    1: required string  uuidDadoSerializado;     // UUID da ficha (36-44 chars)
    2: required i64     tipoDadoSerializado;      // Tipo da ficha (enum, ver tabela)
    3: required string  cnesDadoSerializado;      // CNES do estabelecimento (7 chars)
    4: required string  codIbge;                  // Codigo IBGE do municipio (7 chars)
    5: optional string  ineDadoSerializado;       // Codigo INE da equipe (10 chars)
    6: optional i64     numLote;                  // Numero do lote
    7: required binary  dadoSerializado;          // Ficha serializada via TBinaryProtocol
    8: required DadoInstalacaoThrift remetente;   // Instalacao que ENVIA
    9: required DadoInstalacaoThrift originadora; // Instalacao que ORIGINOU
   10: required VersaoThrift versao;              // Versao do e-SUS APS
}
```

### 3.3 TipoDadoSerializado -- Mapeamento de Codigos

Este enum mapeia o numero ao tipo de ficha contida no `dadoSerializado`:

| Codigo | Ficha | Thrift Master Struct |
|--------|-------|---------------------|
| **2** | Ficha de Cadastro Individual (FCI) | `CadastroIndividualThrift` |
| **3** | Ficha de Cadastro Domiciliar e Territorial | `CadastroDomiciliarThrift` |
| **4** | **Ficha de Atendimento Individual (FAI)** | `FichaAtendimentoIndividualMasterThrift` |
| **5** | Ficha de Atendimento Odontologico | `FichaAtendimentoOdontologicoMasterThrift` |
| **6** | Ficha de Atividade Coletiva | `FichaAtividadeColetivaThrift` |
| **7** | Ficha de Procedimentos | `FichaProcedimentoMasterThrift` |
| **8** | Ficha de Visita Domiciliar e Territorial | `FichaVisitaDomiciliarMasterThrift` |
| **10** | Ficha de Atendimento Domiciliar | `FichaAtendimentoDomiciliarMasterThrift` |
| **11** | Ficha de Avaliacao de Elegibilidade | `FichaAvaliacaoElegibilidadeThrift` |
| **12** | Marcadores de Consumo Alimentar | `FichaConsumoAlimentarThrift` |
| **13** | Ficha Complementar - Sindrome Neurologica por Zika/Microcefalia | `FichaComplementarZikaMicrocefaliaThrift` |
| **14** | Ficha de Vacinacao | `FichaVacinacaoMasterThrift` |
| **16** | Ficha de Cuidado Compartilhado | `CuidadoCompartilhadoThrift` |

**Para o Ponte, os tipos mais relevantes sao:**
- **2** (Cadastro Individual) -- dados do paciente, condicoes de saude
- **4** (Atendimento Individual) -- consultas, diagnosticos, medicamentos, sinais vitais, encaminhamentos

### 3.4 DadoInstalacaoThrift

Identifica o software e a instalacao que gerou/enviou os dados:

```thrift
struct DadoInstalacaoThrift {
    1: required string contraChave;          // "NomeSoftware - Versao" (ex: "IPM Atende.Net - 5.2.1")
    2: required string uuidInstalacao;       // UUID da instalacao
    3: required string cpfOuCnpj;            // CPF ou CNPJ do responsavel (11-15 chars)
    4: required string nomeOuRazaoSocial;    // Nome ou razao social
    5: optional string fone;                 // Telefone (10-11 chars)
    6: optional string email;                // Email
}
```

### 3.5 VersaoThrift

```thrift
struct VersaoThrift {
    1: required i64 major;
    2: required i64 minor;
    3: required i64 revision;
}
```

---

## 4. Schemas Thrift Detalhados

### 4.1 Repositorio oficial: laboratoriobridge/esusab-integracao

**URL:** https://github.com/laboratoriobridge/esusab-integracao

**Estrutura do repositorio:**
```
esusab-integracao/
  |-- XSD/                              # 58 arquivos XSD (schemas XML)
  |   |-- dadotransporte.xsd
  |   |-- dadoinstalacao.xsd
  |   |-- fichaatendimentoindividualchild.xsd
  |   |-- fichaatendimentoindividualmaster.xsd
  |   |-- cadastroindividual.xsd
  |   |-- condicoesdesaude.xsd
  |   |-- medicamento.xsd
  |   |-- medicoes.xsd
  |   |-- problemacondicao.xsd
  |   |-- ... (58 total)
  |
  |-- thrift/
  |   |-- layout-ras/                   # Registros de Atendimento Simplificado
  |   |   |-- thrift/                   # 15 arquivos .thrift (IDL definitions)
  |   |   |   |-- common.thrift
  |   |   |   |-- cadastro_individual.thrift
  |   |   |   |-- ficha_atendimento_individual.thrift
  |   |   |   |-- ficha_atendimento_domiciliar.thrift
  |   |   |   |-- ficha_atendimento_odonto.thrift
  |   |   |   |-- ficha_atendimento_procedimento.thrift
  |   |   |   |-- ficha_atividade_coletiva.thrift
  |   |   |   |-- ficha_avaliacao_elegibilidade.thrift
  |   |   |   |-- ficha_complementar_zika_microcefalia.thrift
  |   |   |   |-- ficha_consumo_alimentar.thrift
  |   |   |   |-- ficha_vacinacao.thrift
  |   |   |   |-- ficha_visita_domiciliar.thrift
  |   |   |   |-- cadastro_domiciliar.thrift
  |   |   |   |-- cuidado_compartilhado.thrift
  |   |   |   |-- solicitacao_oci.thrift
  |   |   |
  |   |   |-- gen-nodejs/              # 15 arquivos JS gerados
  |   |   |   |-- common_types.js
  |   |   |   |-- cadastro_individual_types.js
  |   |   |   |-- ficha_atendimento_individual_types.js
  |   |   |   |-- ficha_atendimento_procedimento_types.js
  |   |   |   |-- ... (15 total)
  |   |   |
  |   |   |-- gen-csharp/              # C# gerado
  |   |   |-- gen-delphi/              # Delphi gerado
  |   |   |-- gen-go/                  # Go gerado
  |   |   |-- gen-javabean/            # Java gerado
  |   |   |-- gen-php/                 # PHP gerado
  |   |   |-- gen-py/                  # Python gerado
  |   |   |-- gen-rb/                  # Ruby gerado
  |   |
  |   |-- layout-cidadao/              # Cadastro de cidadaos
  |       |-- thrift/
  |       |   |-- cidadao_transport.thrift
  |       |-- gen-nodejs/
  |       |-- gen-csharp/
  |       |-- ...
  |
  |-- thrift-exemplo/                  # Exemplos
  |   |-- delphi/
  |   |-- java/
  |
  |-- xml-exemplo/                     # Exemplos XML
```

### 4.2 Ficha de Atendimento Individual (FAI) -- Schema Completo

Esta e a ficha mais relevante para o Ponte. Contem os dados de cada consulta/atendimento.

**Struct Master:**
```thrift
struct FichaAtendimentoIndividualMasterThrift {
    1: optional VariasLotacoesHeaderThrift headerTransport;
    2: optional list<FichaAtendimentoIndividualChildThrift> atendimentosIndividuais; // 1-99 items
    3: required string uuidFicha;     // UUID unico (36-44 chars)
    4: optional i32 tpCdsOrigem;      // Tipo origem (3 = sistema terceiro)
}
```

**Struct Child (dados de cada atendimento):**

| # | Campo | Tipo | Obrigatorio | Descricao |
|---|-------|------|-------------|-----------|
| 1 | numeroProntuario | string | Nao | Numero do prontuario (0-30 chars) |
| 2 | cnsCidadao | string | Condicional | CNS do paciente (15 chars) |
| 3 | dataNascimento | i64 | Sim | Data nascimento (epoch ms) |
| 4 | localDeAtendimento | i64 | Sim | Local (1-10) |
| 5 | sexo | i64 | Sim | Sexo (0=M, 1=F, 4=ignorado, 5=indeterminado) |
| 6 | turno | i64 | Sim | Turno (1=manha, 2=tarde, 3=noite) |
| 7 | tipoAtendimento | i64 | Sim | Tipo (1,2,4,5,6) |
| 8 | pesoAoNascer | double | Nao | Peso ao nascer (kg) |
| 9 | dumDaGestante | i64 | Nao | DUM - Data Ultima Menstruacao (epoch ms) |
| 10 | idadeGestacional | i32 | Nao | Idade gestacional (1-42 semanas) |
| 11 | aleitamentoMaterno | i64 | Nao | Aleitamento materno (codigo) |
| 12 | stGravidezPlanejada | bool | Nao | Gravidez planejada |
| 13 | nuGestasPrevias | i32 | Nao | Gestacoes previas (0-2 digitos) |
| 14 | nuPartos | i32 | Nao | Partos (0-2 digitos) |
| 15 | medicoes | MedicoesThrift | Nao | Sinais vitais / medicoes |
| 16 | problemasCondicoes | list\<ProblemaCondicaoThrift\> | Sim | Problemas/condicoes avaliados |
| 17 | exame | list\<ExameThrift\> | Nao | Exames solicitados/avaliados (0-100) |
| 18 | medicamentos | list\<MedicamentoThrift\> | Nao | Medicamentos prescritos (0-15) |
| 19 | encaminhamentos | list\<EncaminhamentoExternoThrift\> | Nao | Encaminhamentos (0-10) |
| 20 | resultadosExames | list\<ResultadosExameThrift\> | Nao | Resultados de exames (0-10) |
| 21 | condutas | list\<i64\> | Sim | Condutas (1-12 items) |
| 22 | atencaoDomiciliarModalidade | i64 | Nao | Modalidade atencao domiciliar (1-3) |
| 23 | racionalidadeSaude | i64 | Nao | Racionalidade de saude |
| 24 | vacinaEmDia | bool | Nao | Vacina em dia |
| 25 | ficouEmObservacao | bool | Nao | Ficou em observacao |
| 26 | dataHoraInicialAtendimento | i64 | Sim | Inicio atendimento (epoch ms) |
| 27 | dataHoraFinalAtendimento | i64 | Sim | Fim atendimento (epoch ms) |
| 28 | cpfCidadao | string | Condicional | CPF do paciente (11 chars) |
| 29 | ivcf | IvcfThrift | Nao | Indice de Vulnerabilidade Clinico-Funcional (60+) |
| 30 | tipoParticipacaoCidadao | i64 | Nao | Tipo participacao (1-7) |
| 31 | tipoParticipacaoProfissionalConvidado | i64 | Nao | Tipo participacao profissional (1-7) |
| - | emultis | list\<i64\> | Nao | Acoes multiprofissionais (0-3) |
| - | solicitacoesOci | list\<SolicitacaoOciThrift\> | Nao | Solicitacoes OCI |
| - | profissionalFinalizadorObservacao | struct | Nao | Profissional que finalizou observacao |

### 4.3 Structs aninhadas da FAI

**MedicoesThrift (Sinais Vitais):**
```thrift
struct MedicoesThrift {
    1: optional double circunferenciaAbdominal;     // cm (0-99999, 1 decimal)
    2: optional double perimetroPanturrilha;        // cm (10-99, 1 decimal)
    3: optional i32    pressaoArterialSistolica;    // mmHg (0-999)
    4: optional i32    pressaoArterialDiastolica;   // mmHg (0-999)
    5: optional i32    frequenciaRespiratoria;      // MPM (0-200)
    6: optional i32    frequenciaCardiaca;           // BPM (0-999)
    7: optional double temperatura;                  // Celsius (20.0-45.0, 1 decimal)
    8: optional i32    saturacaoO2;                  // % (0-100)
    9: optional i32    glicemiaCapilar;              // mg/dL (0-800)
   10: optional i64    tipoGlicemiaCapilar;         // 0-3 (jejum, pos-prandial, etc)
   11: optional double peso;                         // kg (0.5-500, 3 decimais)
   12: optional double altura;                       // cm (20-250, 1 decimal)
   13: optional double perimetroCefalico;            // cm (10-200, 1 decimal)
}
```

**MedicamentoThrift (Prescricao):**
```thrift
struct MedicamentoThrift {
    1: optional string codigoCatmat;                 // Codigo CATMAT (ate 20 chars)
    2: optional i64    viaAdministracao;              // Via (codigo)
    3: optional string dose;                          // Dose (ate 100 chars)
    4: optional bool   doseUnica;                     // Dose unica?
    5: optional bool   usoContinuo;                   // Uso continuo?
    6: optional i64    doseFrequenciaTipo;            // Tipo frequencia (1-3)
    7: optional string doseFrequencia;                // Frequencia
    8: optional i32    doseFrequenciaQuantidade;      // Periodicidade
    9: optional i64    doseFrequenciaUnidadeMedida;   // Unidade medida
   10: optional i64    dtInicioTratamento;            // Inicio tratamento (epoch ms)
   11: optional i32    duracaoTratamento;             // Duracao
   12: optional i64    duracaoTratamentoMedida;       // Unidade duracao
   13: optional i32    quantidadeReceitada;           // Quantidade (1-999)
   15: optional string qtDoseManha;                   // Doses pela manha
   16: optional string qtDoseTarde;                   // Doses pela tarde
   17: optional string qtDoseNoite;                   // Doses pela noite
}
```

**ProblemaCondicaoThrift (Diagnostico/Condicao):**
```thrift
struct ProblemaCondicaoThrift {
    1: optional string uuidProblema;                 // UUID do problema
    2: optional string uuidEvolucaoProblema;         // UUID da evolucao
    3: optional i64    coSequencialEvolucao;          // Sequencial (1+)
    4: optional string ciap;                          // Codigo CIAP-2 ou AB
    5: optional string cid10;                         // Codigo CID-10
    6: optional i64    situacao;                       // 0=Latente, 1=Ativo, 2=Resolvido
    7: optional i64    dataInicioProblema;            // Inicio do problema (epoch ms)
    8: optional i64    dataFimProblema;               // Fim do problema (epoch ms)
    9: optional bool   isAvaliado;                     // Avaliado neste atendimento?
}
```

**EncaminhamentoExternoThrift (Encaminhamento):**
```thrift
struct EncaminhamentoExternoThrift {
    1: optional i64    especialidade;                 // Codigo especialidade (1-62)
    2: optional string hipoteseDiagnosticoCID10;      // Hipotese CID-10
    3: optional string hipoteseDiagnosticoCIAP2;      // Hipotese CIAP-2
    4: optional i64    classificacaoRisco;             // Classificacao de risco
}
```

### 4.4 Ficha de Cadastro Individual (FCI) -- Schema Resumido

**CadastroIndividualThrift:**
- `headerTransport` (UnicaLotacaoHeaderThrift) -- profissional e data
- `identificacaoUsuarioCidadao` (IdentificacaoUsuarioCidadaoThrift) -- dados pessoais
- `condicoesDeSaude` (CondicoesDeSaudeThrift) -- condicoes de saude
- `informacoesSocioDemograficas` (InformacoesSocioDemograficasThrift) -- dados sociodemograficos
- `emSituacaoDeRua` (EmSituacaoDeRuaThrift) -- situacao de rua
- `saidaCidadaoCadastro` (SaidaCidadaoCadastroThrift) -- saida/obito
- `uuid`, `uuidFichaOriginadora`, `tpCdsOrigem`, `fichaAtualizada`

**IdentificacaoUsuarioCidadaoThrift (27 campos):**
- `nomeCidadao` (string 3-70) -- nome completo
- `nomeSocial` (string) -- nome social
- `cpfCidadao` (string 11) -- CPF
- `cnsCidadao` (string 15) -- CNS
- `dataNascimentoCidadao` (i64 epoch ms) -- data nascimento
- `sexoCidadao` (i64) -- sexo
- `racaCorCidadao` (i64) -- raca/cor
- `nacionalidadeCidadao` (i64) -- nacionalidade
- `codigoIbgeMunicipioNascimento` (string) -- municipio nascimento
- `nomeMaeCidadao` (string) -- nome da mae
- `nomePaiCidadao` (string) -- nome do pai
- `telefoneCelular` (string 10-11) -- telefone
- `emailCidadao` (string) -- email
- `etnia` (i64) -- etnia (se indigena)
- `microarea` (string 2) -- microarea
- ...

**CondicoesDeSaudeThrift (31 campos):**
- `statusEhGestante` (bool) -- gestante?
- `statusTemDiabetes` (bool) -- diabetes?
- `statusTemHipertensaoArterial` (bool) -- hipertensao?
- `maternidadeDeReferencia` (string 0-100) -- maternidade de referencia
- `statusEhFumante` (bool) -- fumante?
- `statusTeveInfarto` (bool) -- infarto previo?
- `statusTeveAvcDerrame` (bool) -- AVC?
- `statusTemDoencaRespiratoria` (bool) -- doenca respiratoria?
- `statusTemTuberculose` (bool) -- tuberculose?
- `statusTemHanseniase` (bool) -- hanseniase?
- `statusDiagnosticoMental` (bool) -- diagnostico de saude mental?
- `statusEhDependenteAlcool` (bool) -- dependente de alcool?
- `statusEhDependenteOutrasDrogas` (bool) -- dependente de drogas?
- `statusTeveInternadoem12Meses` (bool) -- internado nos ultimos 12 meses?
- `doencaCardiaca` (list\<i64\>) -- codigos doenca cardiaca (ate 3)
- `doencaRespiratoria` (list\<i64\>) -- codigos doenca respiratoria (ate 4)
- `doencaRins` (list\<i64\>) -- codigos doenca renal (ate 3)
- ...

### 4.5 Headers de transporte

```thrift
struct VariasLotacoesHeaderThrift {
    1: optional LotacaoHeaderThrift lotacaoFormPrincipal;
    2: optional LotacaoHeaderThrift lotacaoFormCuidadoCompartilhado;
    3: optional i64 dataAtendimento;     // epoch ms
    4: optional string codigoIbgeMunicipio; // 7 chars
}

struct LotacaoHeaderThrift {
    1: optional string profissionalCNS;   // CNS do profissional (15 chars)
    2: optional string cboCodigo_2002;    // CBO (6 chars)
    3: optional string cnes;              // CNES do estabelecimento (7 chars)
    4: optional string ine;               // INE da equipe (10 chars)
}

struct UnicaLotacaoHeaderThrift {
    1: optional string profissionalCNS;
    2: optional string cboCodigo_2002;
    3: optional string cnes;
    4: optional string ine;
    5: optional i64 dataAtendimento;
    6: optional string codigoIbgeMunicipio;
}
```

---

## 5. Mapeamento LEDI -> Tipos do Ponte (adapter/src/types/ipm.ts)

### 5.1 Cadastro Individual (tipo 2) -> IpmPaciente

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmPaciente) | Status |
|---------------------|------|---------------------------|--------|
| identificacao.cpfCidadao | string(11) | cpf | OK |
| identificacao.cnsCidadao | string(15) | cns | OK |
| identificacao.nomeCidadao | string(3-70) | nome | OK |
| identificacao.nomeSocial | string | nome_social | OK |
| identificacao.dataNascimentoCidadao | i64 (epoch ms) | data_nascimento | OK (converter epoch->ISO) |
| identificacao.sexoCidadao | i64 (0/1/4/5) | sexo ('M'/'F') | OK (mapear codigo) |
| identificacao.racaCorCidadao | i64 (1-5) | raca_cor | OK (mapear codigo) |
| identificacao.telefoneCelular | string(10-11) | telefone | OK |
| identificacao.codigoIbgeMunicipioNascimento | string(7) | municipio_ibge | OK |
| identificacao.nomeMaeCidadao | string | -- | FALTA no Ponte |
| identificacao.nomePaiCidadao | string | -- | FALTA no Ponte |
| identificacao.emailCidadao | string | -- | FALTA no Ponte |
| identificacao.etnia | i64 | -- | FALTA no Ponte |
| identificacao.nacionalidadeCidadao | i64 | -- | FALTA no Ponte |
| condicoesDeSaude.statusEhGestante | bool | gestante | OK |
| condicoesDeSaude.maternidadeDeReferencia | string | maternidade_referencia | OK |
| condicoesDeSaude.statusTemDiabetes | bool | -- | FALTA (usar como condicao) |
| condicoesDeSaude.statusTemHipertensaoArterial | bool | -- | FALTA (usar como condicao) |
| condicoesDeSaude.statusEhFumante | bool | -- | FALTA no Ponte |
| condicoesDeSaude.statusTeveInfarto | bool | -- | FALTA no Ponte |

### 5.2 Atendimento Individual (tipo 4) -> IpmAtendimento + IpmProblema + IpmSinalVital + IpmMedicamento

**Atendimento:**

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmAtendimento) | Status |
|---------------------|------|------------------------------|--------|
| numeroProntuario | string(30) | id | OK (precisa converter) |
| cpfCidadao | string(11) | paciente_id | MAPEAR via CPF |
| header.profissionalCNS | string(15) | profissional_id | MAPEAR via CNS |
| header.cnes | string(7) | estabelecimento_id | MAPEAR via CNES |
| dataHoraInicialAtendimento | i64 (epoch ms) | data_inicio | OK (converter epoch->ISO) |
| dataHoraFinalAtendimento | i64 (epoch ms) | data_fim | OK (converter epoch->ISO) |
| tipoAtendimento | i64 (1,2,4,5,6) | tipo | OK (mapear codigo) |
| dumDaGestante | i64 (epoch ms) | -- | CRITICO: DUM no Ponte esta em IpmPaciente.dum |
| idadeGestacional | i32 (1-42) | -- | Via IpmSinalVital.semanas_gestacionais |
| nuGestasPrevias | i32 | -- | Via IpmPaciente.gestas_previas |
| nuPartos | i32 | -- | Via IpmPaciente.partos |

**Sinais Vitais (MedicoesThrift -> IpmSinalVital):**

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmSinalVital) | Status |
|---------------------|------|------------------------------|--------|
| medicoes.pressaoArterialSistolica | i32 | pa_sistolica | OK |
| medicoes.pressaoArterialDiastolica | i32 | pa_diastolica | OK |
| medicoes.peso | double | peso | OK |
| medicoes.altura | double | altura | OK |
| medicoes.temperatura | double | temperatura | OK |
| medicoes.frequenciaCardiaca | i32 | freq_cardiaca | OK |
| medicoes.frequenciaRespiratoria | i32 | freq_respiratoria | OK |
| medicoes.saturacaoO2 | i32 | saturacao_o2 | OK |
| medicoes.glicemiaCapilar | i32 | glicemia_capilar | OK |
| medicoes.circunferenciaAbdominal | double | -- | FALTA no Ponte |
| medicoes.perimetroCefalico | double | -- | FALTA no Ponte |
| medicoes.perimetroPanturrilha | double | -- | FALTA no Ponte |

**Problemas/Condicoes (ProblemaCondicaoThrift -> IpmProblema):**

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmProblema) | Status |
|---------------------|------|---------------------------|--------|
| ciap | string | ciap | OK |
| cid10 | string | cid | OK |
| situacao | i64 (0-2) | ativo | OK (mapear: 1=true, 0/2=false) |
| dataInicioProblema | i64 (epoch ms) | data_inicio | OK (converter) |
| dataFimProblema | i64 (epoch ms) | -- | FALTA no Ponte |
| uuidProblema | string | -- | FALTA no Ponte (util p/ tracking) |
| isAvaliado | bool | -- | FALTA no Ponte |

**Medicamentos (MedicamentoThrift -> IpmMedicamento):**

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmMedicamento) | Status |
|---------------------|------|------------------------------|--------|
| codigoCatmat | string(20) | codigo_catmat | OK |
| dose | string(100) | dosagem | OK |
| viaAdministracao | i64 | via_administracao | OK (mapear codigo) |
| usoContinuo | bool | ativo | OK (mapear) |
| doseUnica | bool | -- | FALTA no Ponte |
| dtInicioTratamento | i64 (epoch ms) | data_inicio | OK (converter) |
| duracaoTratamento | i32 | -- | FALTA (calcular data_fim) |
| quantidadeReceitada | i32 | -- | FALTA no Ponte |
| doseFrequencia | string | posologia | OK (parcial) |
| qtDoseManha/Tarde/Noite | string | -- | FALTA no Ponte |

**Encaminhamentos (EncaminhamentoExternoThrift -> IpmEncaminhamento):**

| Campo LEDI (Thrift) | Tipo | Campo Ponte (IpmEncaminhamento) | Status |
|---------------------|------|--------------------------------|--------|
| especialidade | i64 (1-62) | especialidade | OK (mapear codigo) |
| hipoteseDiagnosticoCID10 | string | hipotese_diagnostica | OK |
| hipoteseDiagnosticoCIAP2 | string | -- | FALTA no Ponte |
| classificacaoRisco | i64 | classificacao_risco | OK (mapear) |

### 5.3 Header -> IpmProfissional + IpmEstabelecimento

| Campo LEDI (Thrift) | Tipo | Campo Ponte | Status |
|---------------------|------|-------------|--------|
| header.profissionalCNS | string(15) | IpmProfissional.cns | OK |
| header.cboCodigo_2002 | string(6) | IpmProfissional.cbo | OK |
| header.cnes | string(7) | IpmEstabelecimento.cnes | OK |
| header.ine | string(10) | -- | FALTA (codigo equipe) |

---

## 6. Como o IPM Gera LEDI

### 6.1 Fluxo de exportacao

O IPM Atende.Net gera arquivos LEDI para enviar dados ao e-SUS APS/SISAB. O fluxo e:

```
IPM Atende.Net (banco PostgreSQL)
    |
    v
[Exportador LEDI integrado ao IPM]
    |
    v
Fichas Thrift (serializadas via TBinaryProtocol)
    |
    v
Arquivos .esus (um por ficha, nomeados com UUID)
    |
    v
ZIP (lote de fichas compactado)
    |
    v
[Importacao no PEC e-SUS APS ou Centralizador Municipal]
    |
    v
SISAB (Sistema de Informacao em Saude para a Atencao Basica)
```

### 6.2 O que o IPM exporta via LEDI

Com base na analise do sistema IPM e nos modulos disponiveis:

| Tipo de ficha | tipoDadoSerializado | IPM exporta? | Evidencia |
|---------------|---------------------|--------------|-----------|
| Cadastro Individual (FCI) | 2 | SIM (obrigatorio) | Cadastro Unico e modulo base do IPM |
| Cadastro Domiciliar | 3 | SIM (obrigatorio) | ACS app do IPM faz cadastro territorial |
| **Atendimento Individual (FAI)** | **4** | **SIM (obrigatorio)** | **Prontuario SOAP do IPM** |
| Atendimento Odontologico | 5 | SIM | Modulo odontologico do IPM |
| Atividade Coletiva | 6 | SIM | Modulo de atividades |
| Procedimentos | 7 | SIM | Modulo de procedimentos / faturamento |
| Visita Domiciliar | 8 | SIM | App ACS do IPM |
| Vacinacao | 14 | SIM | Modulo de vacinacao integrado ao SI-PNI |

### 6.3 Formato alternativo: XML

Desde a versao 2.0 do e-SUS AB, alem do Thrift, e possivel exportar via **XML**. Os XSD schemas estao no mesmo repositorio (58 arquivos). O XML e uma alternativa mais legivel, porem mais pesada.

O IPM pode usar Thrift OU XML -- nao sabemos qual. Ambos sao parseados da mesma forma logica.

---

## 7. Via B: Lendo Exportacoes LEDI

### 7.1 Conceito

**Via A (atual):** Ler o banco PostgreSQL do IPM diretamente -> converter para FHIR R4 -> enviar a RNDS
- **Problema:** Requer credenciais de banco, IPM e SaaS, schema e privado

**Via B (proposta):** Ler os arquivos LEDI (.esus ou .xml) que o IPM ja exporta -> converter para FHIR R4 -> enviar a RNDS
- **Vantagem:** Nao precisa de acesso ao banco
- **Vantagem:** Schema e 100% publico e documentado
- **Vantagem:** Codigo gerado para Node.js ja existe
- **Vantagem:** Funciona com QUALQUER sistema que exporte LEDI (nao so IPM)

### 7.2 Onde interceptar os arquivos LEDI

Ha tres pontos possiveis para capturar os arquivos LEDI:

**Opcao 1: Ler ZIP de exportacao**
- O IPM gera ZIPs de exportacao para enviar ao PEC/Centralizador
- O Ponte intercepta esse ZIP ANTES de ser enviado ao PEC
- Faz parse dos .esus, converte para FHIR, envia a RNDS
- Os dados TAMBEM vao ao PEC/SISAB normalmente

**Opcao 2: Usar API LEDI do PEC**
- Desde a versao 5.3.19, o PEC tem API REST para receber fichas LEDI
- Endpoint: `POST /api/v1/recebimento/ficha`
- O Ponte poderia atuar como proxy: receber a ficha LEDI, converter para FHIR e enviar a RNDS, e tambem repassar ao PEC
- Autenticacao: `POST /api/recebimento/login` (usuario/senha, retorna JSESSIONID)

**Opcao 3: Ler o banco do PEC e-SUS APS**
- O PEC armazena os dados recebidos via LEDI em seu proprio banco PostgreSQL
- O Ponte poderia ler o banco do PEC (que e local, nao SaaS)
- Isso ja e feito por outros sistemas

### 7.3 Vantagens da Via B sobre Via A

| Aspecto | Via A (banco IPM) | Via B (LEDI) |
|---------|-------------------|--------------|
| Acesso | Requer credenciais DB do IPM (SaaS) | Arquivo local, sem credenciais |
| Schema | Privado, desconhecido | 100% publico (UFSC/DATASUS) |
| Compatibilidade | So IPM | Qualquer sistema que exporte LEDI |
| Tempo real | Sim (consulta direta) | Batch (exportacao periodica) |
| Complexidade | Engenharia reversa do schema | Schema documentado com codigo gerado |
| Risco legal | LGPD, acesso nao autorizado | Dados ja exportados legalmente |
| Manutencao | Cada update do IPM pode quebrar | LEDI e estavel (versionado) |

### 7.4 Desvantagens da Via B

1. **Batch, nao tempo real:** Dados so estao disponiveis apos exportacao (pode haver delay de horas/dias)
2. **Dados agregados:** A FAI agrupa ate 99 atendimentos por ficha/profissional, pode haver perda de contexto
3. **Dados limitados:** LEDI tem menos detalhes que o prontuario completo (ex: texto livre SOAP nao e exportado)
4. **Dependencia da exportacao:** Se o municipio nao exportar regularmente, dados ficam defasados

---

## 8. Implementacao Tecnica em TypeScript/Node.js

### 8.1 Bibliotecas disponiveis

| Biblioteca | npm | Versao | Status | Uso |
|-----------|-----|--------|--------|-----|
| **thrift** | `npm i thrift` | 0.22.0 | Ativo (publicado ha ~5 meses) | Serializar/deserializar TBinaryProtocol |
| **thriftrw** | `npm i thriftrw` | ^3.x | Ativo | Parse binario SEM IDL (schemaless) |
| **@creditkarma/thrift-typescript** | `npm i @creditkarma/thrift-typescript` | 3.7.6 | **INATIVO** (6 anos sem update) | Gerar TypeScript de .thrift files |
| **@creditkarma/thrift-parser** | `npm i @creditkarma/thrift-parser` | ^2.x | Inativo | Parser de .thrift IDL em TypeScript |

### 8.2 Abordagem recomendada para o Ponte

**Opcao A: Usar codigo gerado do repositorio oficial**

O repositorio `laboratoriobridge/esusab-integracao` ja tem `gen-nodejs/` com 15 arquivos de tipos gerados. Podemos:
1. Copiar os arquivos de `gen-nodejs/` para o projeto Ponte
2. Usar a lib `thrift` npm para TBinaryProtocol
3. Deserializar `.esus` -> objetos JS -> mapear para FHIR

```typescript
// Exemplo conceitual de deserializacao
import { TBinaryProtocol, TFramedTransport } from 'thrift';
import { DadoTransporteThrift } from './gen-nodejs/dado_transporte_types';
import { FichaAtendimentoIndividualMasterThrift } from './gen-nodejs/ficha_atendimento_individual_types';

function parseLediFile(buffer: Buffer): FichaAtendimentoIndividualMasterThrift {
    // 1. Deserializar DadoTransporte
    const transport = new TFramedTransport(buffer);
    const protocol = new TBinaryProtocol(transport);
    const dadoTransporte = new DadoTransporteThrift();
    dadoTransporte.read(protocol);

    // 2. Verificar tipo
    if (dadoTransporte.tipoDadoSerializado === 4) { // FAI
        // 3. Deserializar ficha interna
        const innerTransport = new TFramedTransport(dadoTransporte.dadoSerializado);
        const innerProtocol = new TBinaryProtocol(innerTransport);
        const ficha = new FichaAtendimentoIndividualMasterThrift();
        ficha.read(innerProtocol);
        return ficha;
    }
    throw new Error(`Tipo nao suportado: ${dadoTransporte.tipoDadoSerializado}`);
}
```

**Opcao B: Gerar TypeScript nativo**

Usar `@creditkarma/thrift-typescript` para gerar codigo TypeScript a partir dos .thrift files:

```bash
# 1. Instalar o gerador
npm i -D @creditkarma/thrift-typescript

# 2. Copiar .thrift files do repositorio oficial
cp -r esusab-integracao/thrift/layout-ras/thrift/ ./thrift-idl/

# 3. Gerar TypeScript
npx thrift-typescript --target apache --sourceDir thrift-idl --outDir src/ledi/generated
```

**AVISO:** `@creditkarma/thrift-typescript` nao e mantido ha 6 anos. Pode haver incompatibilidades com versoes recentes de TypeScript/Node.js.

**Opcao C: thriftrw (schemaless)**

A lib `thriftrw` pode ler binario Thrift SEM precisar de IDL/schema:

```typescript
import { TStruct } from 'thriftrw';

// Le o binario sem saber a estrutura
const struct = TStruct.fromBuffer(buffer);
// Acessa campos por numero
const tipoDado = struct.fields[2]; // tipoDadoSerializado
const dadoSerializado = struct.fields[7]; // payload
```

### 8.3 Exemplo real existente: dgldaniel/esusab-integracao-thrift-nodejs

**URL:** https://github.com/dgldaniel/esusab-integracao-thrift-nodejs

Este projeto Node.js demonstra como serializar e deserializar fichas e-SUS:

**Dependencias:** `thrift@^0.16.0`, `uuidv4@^6.2.13`

**Serializacao (criar .esus):**
```javascript
const { SerializadorThrift } = require('./services/SerializadorThrift');

// 1. Criar ficha
const ficha = getFicha(); // FichaProcedimentoMasterThrift

// 2. Serializar ficha
const fichaBytes = SerializadorThrift.serializar(ficha);

// 3. Criar DadoTransporte
const dadoTransporte = getDadoTransporte();
dadoTransporte.tipoDadoSerializado = 7; // Procedimentos
dadoTransporte.dadoSerializado = fichaBytes;
dadoTransporte.versao = new VersaoThrift({ major: 3, minor: 2, revision: 3 });

// 4. Serializar DadoTransporte
const transporteBytes = SerializadorThrift.serializar(dadoTransporte);

// 5. Escrever arquivo .esus
fs.writeFileSync(`esus/${uuid}.esus`, transporteBytes);
```

**Deserializacao (ler .esus):**
```javascript
const { DeserializadorThrift } = require('./services/DeserializadorThrift');

// 1. Ler arquivo
const thriftData = await fs.readFile('./esus/uuid.esus');

// 2. Deserializar DadoTransporte
const dadoTransporte = DeserializadorThrift.deserializar(thriftData, DadoTransporteThrift);

// 3. Deserializar ficha interna
const ficha = DeserializadorThrift.deserializar(
    dadoTransporte.dadoSerializado,
    FichaProcedimentoMasterThrift
);
```

**Implementacao do Serializador:**
```javascript
const { TBinaryProtocol, TFramedTransport } = require('thrift');

const SerializadorThrift = {
    serializar(thriftObj) {
        const buffer = Buffer.from(JSON.stringify(thriftObj));
        let transport = new TFramedTransport(buffer);
        let protocol = new TBinaryProtocol(transport);
        thriftObj.write(protocol);
        // Concatenar buffers de saida
        let source = transport.outBuffers;
        let byteArrayLen = 0;
        for (let i = 0; i < source.length; i++) byteArrayLen += source[i].length;
        let byteArray = Buffer.alloc(byteArrayLen);
        for (let i = 0, pos = 0; i < source.length; i++) {
            source[i].copy(byteArray, pos);
            pos += source[i].length;
        }
        return byteArray;
    }
};
```

**Implementacao do Deserializador:**
```javascript
const { TBinaryProtocol, TFramedTransport } = require('thrift');

const DeserializadorThrift = {
    deserializar(byteArray, ThriftClass) {
        const tTransport = new TFramedTransport(byteArray);
        const tProtocol = new TBinaryProtocol(tTransport);
        const obj = new ThriftClass();
        obj.read(tProtocol);
        return obj;
    }
};
```

### 8.4 Outro exemplo: juliocnsouzadev/esus_thrift_mapped_conversion

**URL:** https://github.com/juliocnsouzadev/esus_thrift_mapped_conversion

Biblioteca Java (GPL-3.0) que demonstra o fluxo completo:
1. Mapear objetos Java -> Thrift structs (via annotations/reflection)
2. Serializar via `ThriftSerializer`
3. Empacotar em `DadoTransporteThrift`
4. Gerar ZIP com multiplos `.esus`
5. Workflow: `Conversor<T>` -> `serializar()` -> `DadoTransporte` -> `ZipWriter.generateZip()`

### 8.5 Outro exemplo: inacioloy/integracao_esusab_serialize

**URL:** https://github.com/inacioloy/integracao_esusab_serialize

Projeto Python que demonstra validacao de fichas via XSD (XML Schema):
- Usa `xmlschema` para validar XML contra XSD
- Valida DadoTransporte e FichaAtendimentoIndividualMaster
- Abordagem alternativa: usar XML em vez de Thrift

---

## 9. API de Transmissao LEDI

### 9.1 Endpoints

Desde a versao 5.3.19 do PEC e-SUS APS, existe uma API REST para enviar fichas LEDI diretamente:

**Autenticacao:**
```
POST /api/recebimento/login
Body: { usuario: "...", senha: "..." }
Response: Cookie JSESSIONID
```

**Envio de ficha:**
```
POST /api/v1/recebimento/ficha
Content-Type: multipart/form-data
Body: arquivo .esus (binario serializado via TBinaryProtocol)
Nome do arquivo: "{uuid}.esus"
Response: 200 OK ou erro com codigo/mensagem
```

### 9.2 Pre-requisitos
- PEC e-SUS APS 5.3.19+ instalado com HTTPS
- Credenciais geradas pelo Administrador da Instalacao
- Credenciais podem ser por pessoa (Nome, CPF, email) ou empresa (Nome, CNPJ, email)
- Multiplas credenciais ativas simultaneamente

### 9.3 Implicacao para o Ponte

O Ponte poderia atuar como **proxy LEDI -> FHIR**:
1. Receber fichas LEDI do sistema terceiro (IPM)
2. Converter para FHIR R4 (Bundle RAC)
3. Enviar a RNDS
4. Opcionalmente, repassar a ficha LEDI ao PEC local

---

## 10. Enums de Referencia Relevantes

### TipoDadoSerializado
| Codigo | Tipo de Ficha |
|--------|---------------|
| 2 | Cadastro Individual |
| 3 | Cadastro Domiciliar e Territorial |
| 4 | Atendimento Individual |
| 5 | Atendimento Odontologico |
| 6 | Atividade Coletiva |
| 7 | Procedimentos |
| 8 | Visita Domiciliar e Territorial |
| 10 | Atendimento Domiciliar |
| 11 | Avaliacao de Elegibilidade |
| 12 | Marcadores de Consumo Alimentar |
| 13 | Complementar - Sindrome Neurologica por Zika/Microcefalia |
| 14 | Vacinacao |
| 16 | Cuidado Compartilhado |

### Sexo
| Codigo | Valor |
|--------|-------|
| 0 | Masculino |
| 1 | Feminino |
| 4 | Ignorado |
| 5 | Indeterminado |

### Raca/Cor
| Codigo | Valor |
|--------|-------|
| 1 | Branca |
| 2 | Preta |
| 3 | Amarela |
| 4 | Parda |
| 5 | Indigena |

### Turno
| Codigo | Valor |
|--------|-------|
| 1 | Manha |
| 2 | Tarde |
| 3 | Noite |

### Nacionalidade
| Codigo | Valor |
|--------|-------|
| 1 | Brasileiro |
| 2 | Naturalizado |
| 3 | Estrangeiro |

### Identidade de Genero
| Codigo | Valor |
|--------|-------|
| 149 | Homem transexual |
| 150 | Mulher transexual |
| 156 | Travesti |
| 200 | Homem cisgenero |
| 201 | Mulher cisgenero |
| 203 | Nao-binario |

---

## 11. Viabilidade da Implementacao

### 11.1 Avaliacao tecnica

| Criterio | Avaliacao | Nota |
|----------|-----------|------|
| Schema disponivel? | SIM -- .thrift files no GitHub | 10/10 |
| Codigo Node.js gerado? | SIM -- gen-nodejs/ no repositorio oficial | 10/10 |
| Exemplo funcional Node.js? | SIM -- dgldaniel/esusab-integracao-thrift-nodejs | 9/10 |
| Biblioteca npm para Thrift? | SIM -- `thrift@0.22.0` (ativo, ~5 meses) | 8/10 |
| TypeScript nativo? | PARCIAL -- gerador existe mas inativo (6 anos) | 5/10 |
| Mapeamento para FHIR viavel? | SIM -- campos mapeiam bem para BR Core | 9/10 |
| Complexidade de implementacao | MEDIA -- precisa lidar com epochs, codigos, structs aninhadas | 7/10 |
| **VIABILIDADE GERAL** | **ALTA** | **8.3/10** |

### 11.2 Esforco estimado

| Tarefa | Horas estimadas |
|--------|-----------------|
| Copiar/adaptar gen-nodejs para TypeScript | 4-6h |
| Implementar parser de .esus files | 4-6h |
| Implementar parser de ZIP (lote) | 2-3h |
| Mapear FAI (tipo 4) -> tipos Ponte | 6-8h |
| Mapear FCI (tipo 2) -> tipos Ponte | 4-6h |
| Converter epochs -> datas ISO | 2h |
| Mapear codigos enum -> strings Ponte | 3-4h |
| Conectar ao pipeline FHIR existente | 4-6h |
| Testes unitarios (parser + mapping) | 8-10h |
| Testes com arquivo .esus real | 4-6h |
| **TOTAL** | **~40-55 horas** |

### 11.3 Riscos

| Risco | Probabilidade | Mitigacao |
|-------|---------------|-----------|
| Gen-nodejs desatualizado vs LEDI 7.3.7 | MEDIA | Regenerar de .thrift files |
| `@creditkarma/thrift-typescript` incompativel com TS recente | ALTA | Usar gen-nodejs JS direto ou thriftrw |
| Arquivos .esus reais diferem do esperado | BAIXA | Testar com exportacao real do IPM |
| IPM usa XML em vez de Thrift | MEDIA | Implementar parser XML tambem (XSD disponiveis) |
| Dados batch insuficientes para caso de uso urgente (parto) | ALTA | Via B e complementar, nao substitui tempo real |

### 11.4 Abordagem hibrida recomendada

**Fase 1 (Via B - LEDI):**
- Implementar parser de arquivos .esus usando `thrift` npm + gen-nodejs
- Mapear FAI (tipo 4) e FCI (tipo 2) para tipos Ponte
- Gerar Bundle RAC FHIR R4 a partir dos dados LEDI
- Enviar a RNDS
- **Resultado:** Municipios com IPM podem alimentar RNDS SEM acesso ao banco

**Fase 2 (Via B+ - API LEDI):**
- Implementar endpoint que recebe fichas LEDI via API
- Converter em tempo real para FHIR R4
- Atuar como proxy LEDI -> RNDS
- **Resultado:** Integracao near-real-time sem acesso ao banco

**Fase 3 (Via A - banco, se necessario):**
- Se um municipio tiver acesso ao banco PostgreSQL do IPM
- Implementar queries diretas para dados mais ricos
- **Resultado:** Dados mais completos (texto SOAP, historico detalhado)

---

## 12. Fontes

### Documentacao oficial
- [Integracao e-SUS APS (UFSC/Bridge)](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/index.html)
- [Integracao e-SUS APS (legado)](https://integracao.esusab.ufsc.br/)
- [Dicionario FAI](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fai.html)
- [Dicionario FCI](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/dicionario-fci.html)
- [Registros Thrift/XSD por ficha](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/thrift-xsd.html)
- [Camada de Transporte de Dados](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/estrutura_arquivos/camada-transporte.html)
- [Dicionario de referencias](https://integracao.esusaps.bridge.ufsc.tech/ledi/documentacao/referencias/dicionario.html)
- [API de transmissao LEDI (MS)](https://sisaps.saude.gov.br/sistemas/esusaps/docs/manual/APOIO/API_transmissao/)
- [Manual de Exportacao e-SUS AB v2.0 (PDF)](https://sisaps.saude.gov.br/esus/upload/docs/ManualExportacao_e-SUS-AB-v2.0.pdf)

### Repositorios GitHub
- [laboratoriobridge/esusab-integracao](https://github.com/laboratoriobridge/esusab-integracao) -- Schemas Thrift/XSD oficiais + codigo gerado para 8 linguagens
- [dgldaniel/esusab-integracao-thrift-nodejs](https://github.com/dgldaniel/esusab-integracao-thrift-nodejs) -- Exemplo Node.js de serializacao/deserializacao
- [juliocnsouzadev/esus_thrift_mapped_conversion](https://github.com/juliocnsouzadev/esus_thrift_mapped_conversion) -- Biblioteca Java para conversao mapeada
- [inacioloy/integracao_esusab_serialize](https://github.com/inacioloy/integracao_esusab_serialize) -- Validacao Python via XSD
- [creditkarma/thrift-typescript](https://github.com/creditkarma/thrift-typescript) -- Gerador TypeScript de .thrift (inativo)
- [thriftrw/thriftrw-node](https://github.com/thriftrw/thriftrw-node) -- Parser Thrift binario schemaless

### Bibliotecas npm
- [thrift@0.22.0](https://www.npmjs.com/package/thrift) -- Apache Thrift oficial para Node.js
- [thriftrw](https://www.npmjs.com/package/thriftrw) -- Parser binario sem IDL
- [@creditkarma/thrift-typescript@3.7.6](https://www.npmjs.com/package/@creditkarma/thrift-typescript) -- Gerador TS (inativo)

### Regulamentacao
- [Portaria 5.663/2024](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt5663_04_11_2024.html) -- Descontinuacao Thrift para vacinacao
- [Portal e-SUS APS](https://sisaps.saude.gov.br/sistemas/esusaps/)
- [Portal de integracao APS](https://aps.saude.gov.br/ape/esus/integracao)

---

## 13. Conclusao

A Via B (LEDI) e **tecnicamente viavel e estrategicamente superior** a Via A (banco direto) para a maioria dos cenarios:

1. **Schema 100% publico** -- nao dependemos de engenharia reversa
2. **Codigo Node.js ja existe** -- gen-nodejs no repositorio oficial
3. **Exemplo funcional** -- projeto dgldaniel demonstra o fluxo completo
4. **Biblioteca ativa** -- `thrift@0.22.0` no npm
5. **Universal** -- funciona com QUALQUER sistema que exporte LEDI, nao so IPM
6. **Legalmente seguro** -- dados ja exportados pelo municipio, sem acesso nao autorizado

A principal limitacao e que a Via B e **batch**, nao tempo real. Para o cenario de emergencia obstetrica (gestante chegando a maternidade), os dados precisam ter sido exportados previamente. Porem, para alimentar a RNDS com historico clinico de forma regular, a Via B e ideal.

**Proximos passos concretos:**
1. Clonar `laboratoriobridge/esusab-integracao` e copiar gen-nodejs/ + .thrift files
2. Instalar `thrift@0.22.0` como dependencia
3. Implementar parser LEDI (.esus) -> tipos Ponte
4. Implementar conversor LEDI -> FHIR R4 (reutilizando builders existentes)
5. Testar com arquivo .esus real (solicitar ao municipio parceiro ou gerar de teste)
6. Implementar suporte XML como alternativa ao Thrift
