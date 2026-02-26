"""Generate professional PDF for municipal health managers (gestores)."""
from fpdf import FPDF

FONT = 'CalibriPonte'

class PontePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font(FONT, '', 'C:/Windows/Fonts/calibri.ttf', uni=True)
        self.add_font(FONT, 'B', 'C:/Windows/Fonts/calibrib.ttf', uni=True)
        self.add_font(FONT, 'I', 'C:/Windows/Fonts/calibrii.ttf', uni=True)

    def header(self):
        self.set_font(FONT, 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, 'PROJETO PONTE \u2014 Solu\u00e7\u00e3o Gratuita para Conectar seu Munic\u00edpio \u00e0 RNDS', align='C')
        self.ln(4)
        self.set_draw_color(0, 120, 180)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font(FONT, 'I', 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 10, f'Projeto Ponte \u2014 Open-Source (MIT) \u2014 github.com/Moser007/ponte \u2014 P\u00e1g. {self.page_no()}/{{nb}}', align='C')

    def section_title(self, title):
        self.set_font(FONT, 'B', 14)
        self.set_text_color(0, 90, 150)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(0, 120, 180)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 80, self.get_y())
        self.ln(4)

    def subsection_title(self, title):
        self.set_font(FONT, 'B', 11)
        self.set_text_color(50, 50, 50)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def body_text(self, text):
        self.set_font(FONT, '', 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bold_text(self, text):
        self.set_font(FONT, 'B', 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def highlight_box(self, text, color=(230, 242, 255)):
        self.set_fill_color(*color)
        self.set_font(FONT, 'B', 10)
        self.set_text_color(30, 30, 30)
        x = self.get_x()
        y = self.get_y()
        self.multi_cell(0, 6, text, fill=True)
        self.ln(3)

    def alert_box(self, text):
        self.set_fill_color(255, 240, 240)
        self.set_draw_color(200, 60, 60)
        self.set_line_width(0.3)
        self.set_font(FONT, 'B', 10)
        self.set_text_color(160, 30, 30)
        x = self.get_x()
        y = self.get_y()
        self.multi_cell(0, 6, text, fill=True, border=1)
        self.ln(3)

    def success_box(self, text):
        self.set_fill_color(235, 250, 235)
        self.set_font(FONT, 'B', 10)
        self.set_text_color(30, 100, 30)
        self.multi_cell(0, 6, text, fill=True)
        self.ln(3)

    def bullet(self, text):
        self.set_font(FONT, '', 10)
        self.set_text_color(40, 40, 40)
        self.set_x(self.l_margin)
        self.multi_cell(self.w - self.l_margin - self.r_margin, 5.5, '  - ' + text)

    def table_row(self, col1, col2, bold=False, header=False):
        if header:
            self.set_fill_color(0, 90, 150)
            self.set_text_color(255, 255, 255)
            self.set_font(FONT, 'B', 9)
        elif bold:
            self.set_fill_color(245, 248, 255)
            self.set_text_color(30, 30, 30)
            self.set_font(FONT, 'B', 9)
        else:
            self.set_fill_color(255, 255, 255)
            self.set_text_color(40, 40, 40)
            self.set_font(FONT, '', 9)
        self.cell(60, 7, col1, border=1, fill=True)
        self.set_font(FONT, '' if not header else 'B', 9)
        self.cell(130, 7, col2, border=1, fill=True, new_x="LMARGIN", new_y="NEXT")


pdf = PontePDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Title
pdf.set_font(FONT, 'B', 22)
pdf.set_text_color(0, 80, 140)
pdf.cell(0, 12, 'PONTE', new_x="LMARGIN", new_y="NEXT")
pdf.set_font(FONT, '', 13)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, 'Solução Gratuita para Conectar seu Município à RNDS', new_x="LMARGIN", new_y="NEXT")
pdf.ln(2)

pdf.set_font(FONT, 'I', 10)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 6, 'Documento para Gestores Municipais de Saúde — Fevereiro 2026', new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)

# Alert box
pdf.alert_box(
    '  Seu município usa IPM Atende.Net?\n'
    '  Então os dados clínicos dos seus pacientes NÃO estão chegando à RNDS.\n'
    '  O município está em desconformidade com o Decreto 12.560/2025.'
)

# === SECTION: O Problema ===
pdf.section_title('O Problema')

pdf.body_text(
    'O Decreto 12.560/2025 tornou a RNDS (Rede Nacional de Dados em Saúde) política de Estado. '
    'As Portarias 5.663/2024, 6.656/2025 e 7.495/2025 exigem que todos os sistemas de saúde '
    'enviem dados clínicos à RNDS.'
)

pdf.bold_text(
    'Porém: O IPM Atende.Net, usado por mais de 120 municípios em SC, '
    'não envia dados clínicos à RNDS. Só envia vacinação.'
)

pdf.body_text('Isso significa que:')
pdf.bullet('Quando uma gestante do seu município chega a uma maternidade de referência, o médico não tem acesso ao pré-natal, diagnósticos, alergias ou medicamentos')
pdf.bullet('92% das mortes maternas no Brasil são evitáveis (Fiocruz)')
pdf.bullet('SC registrou 43 mortes maternas em 2024 — pior resultado em duas décadas')
pdf.bullet('75% dos municípios de SC ainda não enviam dados clínicos à RNDS')
pdf.ln(4)

# === SECTION: A Solução ===
pdf.section_title('A Solução: Projeto Ponte')

pdf.body_text(
    'O Ponte é um software gratuito e de código aberto que faz a conexão entre o IPM Atende.Net e a RNDS. '
    'Ele lê os dados que já existem no sistema do município e os envia à RNDS no formato exigido '
    'pelo Ministério da Saúde.'
)

pdf.highlight_box(
    '  Como funciona:\n'
    '  Dados no IPM  →  Ponte (traduz para o formato da RNDS)  →  RNDS\n\n'
    '  O Ponte NÃO substitui o IPM. Complementa, fazendo a tradução que o IPM ainda não faz.\n'
    '  Os profissionais de saúde continuam usando o sistema normalmente.'
)

pdf.subsection_title('O que o Ponte já envia à RNDS por atendimento:')
pdf.bullet('Dados do paciente (CPF, nome, data de nascimento, raça/cor)')
pdf.bullet('Diagnósticos (CID-10, CIAP-2)')
pdf.bullet('Alergias e reações adversas')
pdf.bullet('Medicamentos em uso')
pdf.bullet('Sinais vitais (pressão arterial, peso, glicemia)')
pdf.bullet('Dados obstétricos (idade gestacional, DUM, histórico de gestações)')
pdf.bullet('Identificação do profissional e estabelecimento (CNS, CNES)')
pdf.ln(4)

# === SECTION: Benefícios ===
pdf.section_title('O que o Município Ganha')

pdf.table_row('Benefício', 'Detalhes', header=True)
pdf.table_row('Conformidade regulatória', 'Atende o Decreto 12.560 e as Portarias 5.663, 6.656 e 7.495', bold=True)
pdf.table_row('Custo zero', 'Licença MIT — gratuito, sem mensalidade, sem taxa de implantação')
pdf.table_row('Segurança dos pacientes', 'Dados clínicos disponíveis quando o paciente for atendido em outro município')
pdf.table_row('Sem mudança operacional', 'Profissionais continuam usando o IPM normalmente')
pdf.table_row('Sem dependência', 'Código aberto — município não fica preso a nenhum fornecedor')
pdf.ln(5)

# === SECTION: Piloto ===
pdf.section_title('O que Precisamos para o Piloto')

pdf.body_text('Para testar o Ponte no seu município, precisamos de 3 coisas simples:')
pdf.ln(1)

pdf.set_font(FONT, 'B', 10)
pdf.set_text_color(40, 40, 40)
pdf.multi_cell(0, 6, '1. Autorizacao do gestor para fazer o credenciamento na RNDS em nome do municipio')
pdf.multi_cell(0, 6, '2. Certificado digital ICP-Brasil do estabelecimento (e-CNPJ ou e-CPF) - muitos municipios ja possuem para outros sistemas federais')
pdf.multi_cell(0, 6, '3. Acesso ao sistema para validar que os dados estao sendo traduzidos corretamente')

pdf.ln(3)
pdf.success_box(
    '  O piloto é rápido: com o credenciamento pronto, o sistema pode começar\n'
    '  a enviar dados em questão de dias. Nós acompanhamos todo o processo técnico.'
)

# === SECTION: Regulação ===
pdf.section_title('Regulação Federal')

pdf.body_text('Estas são as normas federais que exigem a integração com a RNDS:')
pdf.ln(1)

pdf.table_row('Regulação', 'O que diz', header=True)
pdf.table_row('Decreto 12.560/2025', 'RNDS é política de Estado. CPF como chave única do cidadão', bold=True)
pdf.table_row('Portaria 5.663/2024', 'Formato antigo (Thrift) descontinuado. FHIR é o novo padrão')
pdf.table_row('Portaria 6.656/2025', 'Dados de regulação assistencial devem ir para a RNDS diariamente', bold=True)
pdf.table_row('Portaria 7.495/2025', 'Todos os sistemas de saúde devem ser interoperáveis com a RNDS')
pdf.table_row('Portaria 8.025/2025', 'Sumário de Alta Obstétrico (SAO) obrigatório na RNDS', bold=True)
pdf.ln(5)

# === SECTION: Contato ===
pdf.section_title('Próximos Passos')

pdf.body_text('Se o seu município tem interesse em ser piloto:')
pdf.ln(1)

pdf.set_font(FONT, '', 10)
pdf.set_text_color(40, 40, 40)
pdf.multi_cell(0, 6, '1. Fale com Giovanni (giovanni@moser007.dev) ou com a Gisele do COSEMS-SC')
pdf.multi_cell(0, 6, '2. Nos orientamos o processo de credenciamento na RNDS')
pdf.multi_cell(0, 6, '3. Configuramos o Ponte para o seu municipio')
pdf.multi_cell(0, 6, '4. Acompanhamos a homologacao com o Ministerio da Saude')
pdf.multi_cell(0, 6, '5. Municipio comeca a enviar dados clinicos a RNDS')

pdf.ln(4)

pdf.success_box('  Custo total para o município: R$ 0,00')

pdf.ln(4)

# Contact box
pdf.set_fill_color(240, 245, 255)
pdf.set_draw_color(0, 90, 150)
pdf.set_line_width(0.4)
pdf.set_font(FONT, 'B', 11)
pdf.set_text_color(0, 80, 140)
pdf.cell(0, 8, '  Contato', border='LTR', fill=True, new_x="LMARGIN", new_y="NEXT")
pdf.set_font(FONT, '', 10)
pdf.set_text_color(40, 40, 40)
pdf.cell(0, 7, '  Giovanni Moser — Desenvolvedor de tecnologia e advogado', border='LR', fill=True, new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, '  Email: giovanni@moser007.dev', border='LR', fill=True, new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, '  Código-fonte: github.com/Moser007/ponte (público, licença MIT)', border='LBR', fill=True, new_x="LMARGIN", new_y="NEXT")

pdf.ln(6)
pdf.set_font(FONT, 'I', 9)
pdf.set_text_color(100, 100, 100)
pdf.multi_cell(0, 5, 'O Ponte existe para que nenhum paciente chegue a uma emergência sem histórico clínico — especialmente as gestantes dos municípios pequenos de Santa Catarina.')

# Save
output_path = r'D:\superintelligence\docs\Ponte-para-Gestores.pdf'
pdf.output(output_path)
print(f'PDF gerado: {output_path}')
