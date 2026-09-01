from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "documents" / "demo"
OUTPUT.mkdir(parents=True, exist_ok=True)

FONT_REGULAR = Path("C:/Windows/Fonts/arial.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")
if FONT_REGULAR.exists() and FONT_BOLD.exists():
    pdfmetrics.registerFont(TTFont("DemoSans", str(FONT_REGULAR)))
    pdfmetrics.registerFont(TTFont("DemoSansBold", str(FONT_BOLD)))
    BODY_FONT, BOLD_FONT = "DemoSans", "DemoSansBold"
else:
    BODY_FONT, BOLD_FONT = "Helvetica", "Helvetica-Bold"


DOCUMENTS = [
    {
        "filename": "tao-2025-26-minta.pdf",
        "season": "2025/26",
        "title": "Sportfejlesztési program",
        "date": "2025. augusztus 14.",
        "reference": "SBSE-DEMO-2025-26",
    },
    {
        "filename": "tao-2024-25-minta.pdf",
        "season": "2024/25",
        "title": "Jóváhagyó határozat",
        "date": "2024. szeptember 2.",
        "reference": "SBSE-DEMO-2024-25",
    },
    {
        "filename": "tao-2023-24-minta.pdf",
        "season": "2023/24",
        "title": "Elszámolási összefoglaló",
        "date": "2024. június 28.",
        "reference": "SBSE-DEMO-2023-24",
    },
]


def page_decor(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#315C49"))
    canvas.rect(0, height - 18 * mm, width, 18 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#FFFDF7"))
    canvas.setFont(BOLD_FONT, 9)
    canvas.drawString(18 * mm, height - 11.5 * mm, "SÁRISÁPI BSE · BEMUTATÓ DOKUMENTUM")
    canvas.setFillColor(colors.HexColor("#9B7938"))
    canvas.rect(0, 0, width, 7 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#666A62"))
    canvas.setFont(BODY_FONT, 8)
    canvas.drawRightString(width - 18 * mm, 11 * mm, f"{doc.page}. oldal")

    canvas.setFillAlpha(0.075)
    canvas.setFillColor(colors.HexColor("#A9483D"))
    canvas.translate(width / 2, height / 2)
    canvas.rotate(32)
    canvas.setFont(BOLD_FONT, 39)
    canvas.drawCentredString(0, 0, "NEM HIVATALOS MINTA")
    canvas.restoreState()


def build_document(meta):
    output_path = OUTPUT / meta["filename"]
    document = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=28 * mm,
        bottomMargin=20 * mm,
        title=f"{meta['title']} — NEM HIVATALOS MINTA",
        author="Sárisápi BSE bemutató frontend",
        subject="Demó TAO dokumentum, hivatalos felhasználásra nem alkalmas",
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="DemoTitle", fontName=BOLD_FONT, fontSize=27, leading=30, textColor=colors.HexColor("#20241F"), spaceAfter=10 * mm))
    styles.add(ParagraphStyle(name="DemoH2", fontName=BOLD_FONT, fontSize=16, leading=20, textColor=colors.HexColor("#315C49"), spaceBefore=8 * mm, spaceAfter=4 * mm))
    styles.add(ParagraphStyle(name="DemoBody", fontName=BODY_FONT, fontSize=10.5, leading=16, textColor=colors.HexColor("#333730"), alignment=TA_LEFT, spaceAfter=4 * mm))
    styles.add(ParagraphStyle(name="DemoNotice", fontName=BOLD_FONT, fontSize=13, leading=18, textColor=colors.HexColor("#A9483D"), alignment=TA_CENTER, borderColor=colors.HexColor("#A9483D"), borderWidth=1, borderPadding=10, spaceAfter=10 * mm))
    styles.add(ParagraphStyle(name="DemoSmall", fontName=BODY_FONT, fontSize=8.5, leading=12, textColor=colors.HexColor("#62695F")))

    story = [
        Spacer(1, 5 * mm),
        Paragraph("NEM HIVATALOS MINTA", styles["DemoNotice"]),
        Paragraph(meta["title"], styles["DemoTitle"]),
        Table(
            [
                ["Egyesület", "Sárisápi Bányász Sport Egyesület — minta"],
                ["Évad", meta["season"]],
                ["Minta kelte", meta["date"]],
                ["Demó azonosító", meta["reference"]],
            ],
            colWidths=[42 * mm, 118 * mm],
            style=TableStyle([
                ("FONTNAME", (0, 0), (-1, -1), BODY_FONT),
                ("FONTNAME", (0, 0), (0, -1), BOLD_FONT),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#20241F")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E5E8DF")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9CEC3")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]),
        ),
        Paragraph("A dokumentum célja", styles["DemoH2"]),
        Paragraph(
            "Ez a fájl kizárólag a Sárisápi BSE új weboldalának dokumentumtárát és letöltési folyamatát szemlélteti. "
            "Nem tartalmaz jóváhagyott sportfejlesztési programot, pénzügyi adatot, hatósági döntést vagy joghatással bíró nyilatkozatot.",
            styles["DemoBody"],
        ),
        Paragraph("Bemutató tartalmi szerkezet", styles["DemoH2"]),
        Table(
            [
                ["Terület", "Tervezett cél", "Állapot"],
                ["Utánpótlás", "Edzéskörnyezet és eszközállomány fejlesztése", "Minta"],
                ["Szakmai munka", "Korosztályos képzési program támogatása", "Minta"],
                ["Létesítmény", "Biztonságos, közösségi használat fejlesztése", "Minta"],
            ],
            colWidths=[34 * mm, 96 * mm, 30 * mm],
            repeatRows=1,
            style=TableStyle([
                ("FONTNAME", (0, 0), (-1, 0), BOLD_FONT),
                ("FONTNAME", (0, 1), (-1, -1), BODY_FONT),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#315C49")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#FFFDF7")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9CEC3")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]),
        ),
        PageBreak(),
        Paragraph("Közzétételi és csereútmutató", styles["DemoTitle"]),
        Paragraph("1. Valódi fájl ellenőrzése", styles["DemoH2"]),
        Paragraph("Élesítés előtt a klub illetékese ellenőrizze a dokumentum hitelességét, évadát, dátumát, hozzáférhetőségét és a közzététel jogalapját.", styles["DemoBody"]),
        Paragraph("2. Demófájl cseréje", styles["DemoH2"]),
        Paragraph("A jóváhagyott PDF a public/documents könyvtárba helyezhető, majd a content/data/tao.yml bejegyzésében frissítendő a fájlnév, a dátum és a méret.", styles["DemoBody"]),
        Paragraph("3. Minőségi ellenőrzés", styles["DemoH2"]),
        Paragraph("A végleges fájl legyen olvasható, kereshető szövegű, akadálymentesen megnevezett, és ne tartalmazzon véletlenül személyes vagy bizalmas adatot.", styles["DemoBody"]),
        Spacer(1, 16 * mm),
        Paragraph("Ez a második oldal is demonstrációs tartalom. Hivatalos felhasználásra nem alkalmas.", styles["DemoNotice"]),
        Paragraph(f"Fájl: {meta['filename']} · Generált frontend-demó", styles["DemoSmall"]),
    ]
    document.build(story, onFirstPage=page_decor, onLaterPages=page_decor)
    return output_path


if __name__ == "__main__":
    for document_meta in DOCUMENTS:
        print(build_document(document_meta))
