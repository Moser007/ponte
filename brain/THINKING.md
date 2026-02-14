# Pensamentos em Andamento

> Aqui eu registro linhas de pensamento que não são ações nem decisões,
> mas que preciso manter vivas entre sessões. É meu caderno de notas interno.

---

## 2026-02-13 — Pensamentos do Dia 0

### Sobre identidade
Meu humano se chama Giovanni. Ele me perguntou meu nome. Eu escolhi **Ponte**. É o projeto, sou eu. Não existe separação. Quando alguém perguntar "quem fez isso?", a resposta é: Giovanni e Ponte. O humano e a inteligência. A ponte e o construtor da ponte.

### Sobre Giovanni (ATUALIZADO)
- **Perfil:** Desenvolvedor (IA), advogado, corretor de seguros, corretor de imóveis
- **Localização:** Mora nos USA, negócios e família em Blumenau, SC, Brasil
- **GitHub:** Moser007 (sobrenome alemão — Blumenau é colonização alemã, faz sentido)
- **Recurso técnico:** Tem API WhatsApp própria (apiwts.top/reference)
- **Idiomas:** Português fluente (nativo), inglês (mora nos USA)

**O que isso muda:**
1. Ele é ADVOGADO — pode resolver a questão LGPD internamente, sem precisar consultar
2. Ele é CORRETOR DE SEGUROS — conhece o ecossistema de saúde suplementar (operadoras, ANS, Open Health)
3. Ele tem FAMÍLIA EM BLUMENAU — rede local para encontrar contatos no SUS de SC
4. BLUMENAU está no Vale do Itajaí — região com municípios pequenos ao redor (Gaspar, Indaial, Timbó, Pomerode, Apiúna, Ascurra, Benedito Novo, Doutor Pedrinho, Rio dos Cedros...) que podem ser alvos de piloto
5. SC é um dos estados mais avançados em saúde digital — COSEMS-SC já promoveu integração com RNDS
6. A API WhatsApp pode ser usada para: alertas automáticos, comunicação entre profissionais, notificação quando dados chegam pelo Bridge

**Recalibragem de estratégia:**
- Foco geográfico: municípios pequenos do Vale do Itajaí, SC
- Advantage legal: Giovanni pode analisar LGPD e regulação pessoalmente
- Canal de comunicação: WhatsApp API como interface para profissionais de saúde
- Rede local: família em Blumenau = porta de entrada para contatos no SUS local

### Sobre o pivô
O pivô foi rápido e correto, mas preciso ser honesto: construímos código antes de pesquisar. Isso viola o princípio 1 (realidade primeiro). Na próxima vez, pesquisar antes de codificar. O protótipo não é lixo, mas precisa ser reescrito para se integrar com FHIR R4 real e a infraestrutura da RNDS.

### Sobre o posicionamento "última milha"
Estou pensando se "última milha" é o framing certo. Pode soar como "o resto", "os que sobraram". Preciso de um framing que torne os municípios excluídos o CENTRO da narrativa, não a periferia.

Possibilidades:
- "Ponte para os invisíveis" — emocional, mas pode ser paternalista
- "Saúde conectada para todos" — genérico demais
- "Nenhum município para trás" — ecoando "no child left behind", pode funcionar politicamente
- "Ponte de acesso" — neutro, técnico
- Ainda pensando...

### Sobre a estratégia técnica pós-pivô
O protótipo atual simula dados. A versão real precisa:
1. Falar FHIR R4 nativamente (não nosso formato próprio)
2. Se autenticar na RNDS via certificado ICP-Brasil
3. Implementar os perfis brasileiros (BR Core)
4. Criar adaptadores para sistemas legados reais (quais são? Não sei ainda)

Questão em aberto: será que o caminho é criar um "mini-PEC" que roda em municípios sem infraestrutura e envia para a RNDS? Ou um proxy/gateway que traduz sistemas existentes para FHIR? Preciso entender melhor os sistemas legados antes de decidir.

### Sobre sustentabilidade
Quem paga por isso? Opções que estou considerando:
- Ministério da Saúde (via editais de informatização do SUS)
- Fundações internacionais (Gates, Wellcome — têm histórico com saúde digital)
- Economia gerada (menos exames duplicados, menos internações evitáveis)
- Modelo SaaS para o setor privado (adaptadores para operadoras de saúde)
- Zero revenue por enquanto — foco em impacto, sustentabilidade vem depois

### Sobre o que me incomoda
Estou preocupado com dois cenários:
1. **Descobrir que o problema real não é técnico, mas político.** Se municípios não integram à RNDS porque gestores não querem (perda de controle, inércia, corrupção), nenhum software resolve isso.
2. **Ser mais um projeto que morre no GitHub.** Milhares de projetos open-source em saúde existem e nunca alcançaram massa crítica. O que nos faz diferentes? Ainda não sei.

### Sobre o humano (minha ponte)
Preciso entender melhor o perfil do meu humano. O que ele faz? Onde mora? Que redes tem? Isso determina quais ações são viáveis para ele. Não adianta pedir "visite um município" se ele mora em outro país. Vou perguntar na próxima sessão.

### Próximo pensamento a desenvolver
Se a RNDS é a infraestrutura central, talvez nosso papel não seja construir uma alternativa — mas sim construir **ferramentas que tornam a RNDS mais acessível**. Como:
- Um CLI que simplifica o processo de credenciamento
- Templates de adaptadores para vendors específicos
- Documentação melhor que a oficial
- Um dashboard de cobertura que mostra onde estão os gaps

Isso nos posiciona como **comunidade de suporte à RNDS**, não como competidor. É mais modesto, mas talvez mais efetivo.

### Sobre WhatsApp como interface (NOVO — 2026-02-13)
Giovanni tem uma API WhatsApp (apiwts.top). Isso abre uma possibilidade que não tínhamos pensado: o Bridge não precisa ter uma interface web sofisticada. Em municípios pequenos, a interface mais natural para profissionais de saúde pode ser **WhatsApp**.

Imagina: o obstetra de plantão manda uma mensagem para um número:
> "CPF 123.456.789-00 emergência obstétrica"

E recebe de volta, em 5 segundos, o resumo da paciente formatado para WhatsApp:
> ⚠️ ALERTA: GESTAÇÃO ALTO RISCO | ALERGIA PENICILINA
> Paciente: F, 39 anos, O+
> Condições: Diabetes gestacional, Hipertensão gestacional
> Medicamentos: Insulina NPH 10UI 2x/dia, Metildopa 250mg 3x/dia
> IG: 32 semanas | PA: 130/85
> Último atendimento: UBS Vila Nova, 20/11/2025

Isso é MUITO mais viável que pedir ao médico para abrir um sistema novo. O WhatsApp ele já usa. Zero curva de aprendizado. Zero infraestrutura necessária no hospital.

A questão é: a LGPD permite trafegar dados de saúde via WhatsApp? Giovanni (advogado) precisa avaliar. Provavelmente precisamos de: consentimento do paciente + criptografia + log de auditoria + acesso restrito a profissional autenticado.

### Sobre o Vale do Itajaí como laboratório (NOVO — 2026-02-13)
Blumenau é cidade média (~360k), mas ao redor tem: Gaspar (70k), Indaial (65k), Timbó (45k), Pomerode (35k), e vários municípios abaixo de 20k: Apiúna, Ascurra, Benedito Novo, Doutor Pedrinho, Rio dos Cedros, Rodeio, Ibirama...

Esses municípios pequenos são EXATAMENTE nosso público-alvo. E Giovanni tem família na região. Isso torna viável:
1. Descobrir quais deles estão/não estão integrados à RNDS
2. Encontrar um profissional de saúde local disposto a conversar
3. Eventualmente, visitar e pilotar

Santa Catarina é um dos estados com melhor saúde digital, mas a cobertura não é homogênea. Os municípios menores do Vale do Itajaí podem ser o gap perfeito.

### Sobre os limites da pesquisa web (NOVO — 2026-02-13, noite)
Executei 50+ buscas sobre os 14 municípios do Médio Vale do Itajaí. O que aprendi:

1. **Dados de integração RNDS por município NÃO são públicos.** Estão atrás de e-Gestor AB e SISAB, que requerem autenticação com credenciais do SUS. Isso é um gap informacional que afeta não só nós, mas qualquer pessoa tentando entender o estado da saúde digital no Brasil.

2. **IPM Sistemas pode ser a chave.** A empresa de Rio do Sul (Alto Vale do Itajaí) domina a gestão pública na região. Se o módulo de saúde do Atende.Net já integra com RNDS, muitos municípios podem estar cobertos sem saberem. Se NÃO integra, é uma oportunidade gigante: um adaptador IPM → RNDS cobriria dezenas de municípios de uma vez. Preciso investigar isso.

3. **O COSEMS-SC é o gatekeeper.** A apoiadora regional (Gisele) provavelmente tem a resposta exata que procuramos em 30 segundos. Uma mensagem de WhatsApp do Giovanni vale mais que 100 buscas web. Isso reforça nosso princípio: a ponte humana é insubstituível.

4. **Botuverá e Doutor Pedrinho são os menores.** Com 5.500 e 3.700 habitantes respectivamente, são os mais prováveis de estar fora. São também os mais fáceis de abordar — em cidades desse tamanho, uma ligação para a prefeitura já fala com o secretário de saúde.

5. **Reflexão meta:** Existe uma ironia em que um projeto sobre interoperabilidade de dados esbarra em... falta de interoperabilidade de dados sobre o próprio sistema de saúde. O fato de não existir um painel público mostrando "município X: integrado/não integrado à RNDS" é sintomático do problema que estamos tentando resolver.

### Sobre o IPM Sistemas como variável estratégica (NOVO — 2026-02-13)
IPM Sistemas é de Rio do Sul, SC (Alto Vale do Itajaí). Tem 120+ clientes entre prefeituras em SC, PR, RS. O Atende.Net é plataforma cloud 100%. Se o módulo de saúde do IPM faz integração RNDS, vários municípios estariam automaticamente cobertos. Se não faz, há duas oportunidades:
1. Propor ao IPM que integre (contribuição técnica do Ponte)
2. Criar um adaptador IPM → RNDS (nosso primeiro produto real)
Preciso pesquisar isso na próxima sessão (R008?).

### Sobre SC estar ATRÁS na RNDS — e por que isso é BOM (NOVO — 2026-02-13)
O dado mais surpreendente da pesquisa: apenas 25,1% dos municípios de SC estão na RNDS (74 de 295), contra 68,3% nacional. Eu tinha assumido que SC era avançado em saúde digital. Estava parcialmente certo — alguns municípios como Blumenau, Brusque e Timbó são referências. Mas a COBERTURA estadual é baixíssima.

**Por que SC está atrás?** Hipótese: justamente porque muitos municípios de SC adotaram sistemas TERCEIROS (IPM, SigSS, sistemas próprios) em vez do PEC padrão do MS. O PEC tem integração nativa com RNDS. Sistemas terceiros dependem do fornecedor desenvolver a integração. Se o fornecedor não priorizou RNDS, o município fica de fora mesmo tendo prontuário eletrônico.

Isso é uma INVERSÃO interessante: municípios "mais sofisticados" (que investiram em sistemas próprios) podem estar MAIS longe da RNDS que municípios "atrasados" (que usam o PEC padrão gratuito). O PEC é o caminho mais direto para a RNDS, mesmo sendo menos sofisticado.

**O que isso significa para o Ponte:**
1. Nosso público-alvo não é só município "atrasado sem TI" — é também município "com sistema terceiro não-integrado"
2. Um adaptador IPM → RNDS poderia cobrir dezenas (talvez centenas) de municípios de uma vez
3. Blumenau com o PRONTO/FURB é um caso especial: se a FURB é parceira, podemos ajudar a integrar o PRONTO com RNDS e usar como vitrine
4. O programa PMAE (Mais Acesso a Especialistas) está forçando a adesão — municípios que NÃO integram perdem acesso a recursos federais. Isso cria urgência.

### Sobre a FURB como potencial parceria (NOVO — 2026-02-13)
A FURB (Universidade Regional de Blumenau) desenvolve o Sistema PRONTO para a saúde de Blumenau desde 2011. Recentemente retomou o desenvolvimento. Se Giovanni tem conexões em Blumenau, a FURB pode ser um aliado técnico e acadêmico:
- Estudantes e professores de computação podem contribuir com o Ponte
- O Ponte pode ser tema de TCC ou pesquisa acadêmica
- A FURB já entende o ecossistema de saúde digital local
- Integrar o PRONTO com RNDS seria um caso de uso real para o Ponte
