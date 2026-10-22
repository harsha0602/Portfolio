"""Build the public CV from profile.json. Requires reportlab."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

ROOT = Path(__file__).resolve().parents[1]
profile = json.loads((ROOT / 'data/profile.json').read_text())
output = ROOT / 'assets/CV.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CVName', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=colors.HexColor('#172f54'), spaceAfter=5))
styles.add(ParagraphStyle(name='CVSection', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=colors.HexColor('#172f54'), spaceBefore=11, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name='CVTitle', fontName='Helvetica-Bold', fontSize=10, leading=13, spaceBefore=7, spaceAfter=2, keepWithNext=True))
styles.add(ParagraphStyle(name='CVBody', fontName='Helvetica', fontSize=9.5, leading=12.5, spaceAfter=4))
styles.add(ParagraphStyle(name='CVMeta', parent=styles['CVBody'], textColor=colors.HexColor('#40516a'), spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle(name='CVBullet', parent=styles['CVBody'], leftIndent=10, firstLineIndent=-8, spaceAfter=3))

def clean(text):
    return text.replace('’', "'").replace('‘', "'").replace('×', 'x').replace('·', '|').replace('—', '-').replace('–', '-').replace('‑', '-')

def para(text, style='CVBody'):
    return Paragraph(escape(clean(text)), styles[style])

months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
def date(value):
    if value == 'Present':
        return 'Present'
    year, month = value.split('-')
    return f'{months[int(month)-1]} {year}'

story=[]
story.append(para(profile['name'], 'CVName'))
story.append(para('Product Engineer | '+profile['location'], 'CVMeta'))
story.append(Paragraph('<link href="mailto:hkuthadi@asu.edu">hkuthadi@asu.edu</link> | <link href="https://github.com/harsha0602">github.com/harsha0602</link> | <link href="https://www.linkedin.com/in/hkuthadi/">linkedin.com/in/hkuthadi</link> | <link href="https://harsha0602.github.io/Portfolio/">Portfolio</link>', styles['CVBody']))
story.append(para(profile['about']['intro']))
story.append(para('EXPERIENCE', 'CVSection'))
for index, item in enumerate(profile['experience']):
    if index == 4:
        story.append(PageBreak())
        story.append(para('EXPERIENCE, CONTINUED', 'CVSection'))
    story.append(para(item['company']+' | '+item['role'], 'CVTitle'))
    story.append(para(f"{date(item['start'])} to {date(item['end'])} | {item['location']}", 'CVMeta'))
    if index == 0:
        story.append(para('Full-time Product Engineer since September 2026; previously an intern from May to August 2026.'))
    for bullet in item['highlights']:
        story.append(para('- '+bullet,'CVBullet'))
story.append(para('SELECTED PROJECTS', 'CVSection'))
for name in ['FluidFill', 'Realtime Study Rooms', 'Clozyt']:
    project=next(p for p in profile['projects'] if p['name']==name)
    story.append(para(project['name']+' | '+project['date'], 'CVTitle'))
    story.append(para(project['summary']))
story.append(para('SKILLS', 'CVSection'))
for group, tools in profile['skills'].items():
    story.append(para(group+': '+', '.join(tools)))
story.append(para('EDUCATION', 'CVSection'))
for education in profile['education']:
    story.append(para(education['school']+' | '+education['degree']))
    story.append(para(date(education['start'])+' to '+date(education['end'])))
story.append(para('ACHIEVEMENTS', 'CVSection'))
for achievement in profile['achievements'][1:]:
    story.append(para(achievement['title']+': '+achievement['summary']))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica',8)
    canvas.setFillColor(colors.HexColor('#40516a'))
    canvas.drawString(0.6*inch,0.35*inch,'Harshavardhan Kuthadi')
    canvas.drawRightString(7.9*inch,0.35*inch,str(doc.page))
    canvas.restoreState()

SimpleDocTemplate(str(output), pagesize=(8.5*inch,11*inch), leftMargin=.6*inch,rightMargin=.6*inch,topMargin=.45*inch,bottomMargin=.6*inch,title='Harshavardhan Kuthadi | Product Engineer',author=profile['name']).build(story,onFirstPage=footer,onLaterPages=footer)
print(output)
