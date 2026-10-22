"""Build the public CV using the earlier serif resume layout. Requires reportlab."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, HRFlowable, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
profile = json.loads((ROOT / 'data/profile.json').read_text())
output = ROOT / 'assets/CV.pdf'
WIDTH = 7.5 * inch
styles = {
 'name': ParagraphStyle('name',fontName='Times-Bold',fontSize=17,leading=20,alignment=TA_CENTER,spaceAfter=1),
 'contact': ParagraphStyle('contact',fontName='Times-Roman',fontSize=9.4,leading=11,alignment=TA_CENTER,spaceAfter=6),
 'section': ParagraphStyle('section',fontName='Times-Bold',fontSize=10.7,leading=13,spaceBefore=5,keepWithNext=True),
 'body': ParagraphStyle('body',fontName='Times-Roman',fontSize=10,leading=11.5,spaceAfter=3),
 'bullet': ParagraphStyle('bullet',fontName='Times-Roman',fontSize=10,leading=11.5,leftIndent=10,firstLineIndent=0,bulletIndent=0,spaceAfter=2),
 'label': ParagraphStyle('label',fontName='Times-Bold',fontSize=10.4,leading=12),
 'meta': ParagraphStyle('meta',fontName='Times-Italic',fontSize=10,leading=11.5),
 'right': ParagraphStyle('right',fontName='Times-Roman',fontSize=10,leading=12,alignment=2),
 'rightItalic': ParagraphStyle('rightItalic',fontName='Times-Italic',fontSize=10,leading=11.5,alignment=2),
}

def clean(text):
 return text.replace('’',"'").replace('‘',"'").replace('×','x').replace('·','|').replace('—','-').replace('–','-').replace('‑','-')
def para(text,style='body',bullet=False):
 return Paragraph(escape(clean(text)),styles[style],bulletText='\u2022' if bullet else None)
def date(value):
 if value=='Present':return value
 year,month=value.split('-')
 return f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1]} {year}"
def row(left,right,italic=False):
 table=Table([[para(left,'meta' if italic else 'label'),para(right,'rightItalic' if italic else 'right')]],colWidths=[WIDTH*.77,WIDTH*.23])
 table.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0),('VALIGN',(0,0),(-1,-1),'TOP')]))
 return table
def section(title):
 return [para(title,'section'),HRFlowable(width='100%',thickness=.6,color=colors.black,spaceBefore=0,spaceAfter=3)]

story=[para(profile['name'],'name')]
story.append(Paragraph('(602) 741-4354 | <link href="mailto:hkuthadi@asu.edu" color="blue"><u>hkuthadi@asu.edu</u></link> | <link href="https://www.linkedin.com/in/hkuthadi/" color="blue"><u>linkedin.com/in/hkuthadi</u></link> | <link href="https://github.com/harsha0602" color="blue"><u>github.com/harsha0602</u></link> | <link href="https://harsha0602.github.io/Portfolio/" color="blue"><u>Portfolio</u></link>',styles['contact']))
story+=section('PROFESSIONAL SUMMARY')
story.append(para(profile['professionalSummary']))
story+=section('TECHNICAL SKILLS')
skills=[('Languages',profile['skills']['Languages']),('Frontend & backend',['React','React Native','Next.js','FastAPI','Node.js','.NET']),('Cloud & data',['AWS','Azure AKS','Docker','PostgreSQL','pgvector','MSSQL','MongoDB']),('AI & testing',['OpenAI Agents SDK','OpenClaw','PyTorch','scikit-learn','pytest','Playwright','Vitest','GitHub Actions'])]
for label,tools in skills:
 story.append(Paragraph('<b>'+escape(label)+':</b> '+escape(', '.join(tools)),styles['body']))
story+=section('WORK EXPERIENCE')
for item in profile['experience']:
 headers=[row(item['company'],date(item['start'])+' to '+date(item['end'])),row(item['role'],item['location'],italic=True)]
 bullets=[para(text,'bullet',True) for text in item['highlights']]
 story.append(KeepTogether(headers+bullets[:1]))
 story+=bullets[1:]
 story.append(Spacer(1,4))
story.append(PageBreak())
story+=section('SELECTED PROJECTS')
for name in ['FluidFill','Realtime Study Rooms','Clozyt','FluxRate','Safe Python Execution Service','Market Risk Forecasting Dashboard']:
 item=next(p for p in profile['projects'] if p['name']==name)
 links=[]
 for label,key in [('Code','repo'),('Demo','demo')]:
  if item['links'].get(key):links.append('<link href="'+escape(item['links'][key],{'"':'&quot;'})+'" color="blue"><u>'+label+'</u></link>')
 title=escape(item['name'])+(' | '+' | '.join(links) if links else '')
 table=Table([[Paragraph(title,styles['label']),para(item['date'],'right')]],colWidths=[WIDTH*.8,WIDTH*.2])
 table.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
 tech=para(' | '.join(item['tech']),'meta')
 overview=para(item['overview'])
 story.append(KeepTogether([table,tech,overview]))
 story += [para(text,'bullet',True) for text in item['highlights'][:2]]
 story.append(Spacer(1,5))
story+=section('EDUCATION')
for item in profile['education']:
 story.append(KeepTogether([row(item['school'],date(item['start'])+' to '+date(item['end'])),para(item['degree'])]))
story+=section('ACHIEVEMENTS')
for item in profile['achievements'][1:]:
 story.append(para(item['title']+': '+item['summary'],'bullet',True))

def footer(canvas,doc):
 canvas.saveState();canvas.setFont('Times-Roman',8);canvas.drawRightString(8*inch,.23*inch,str(doc.page));canvas.restoreState()
SimpleDocTemplate(str(output),pagesize=(8.5*inch,11*inch),leftMargin=.5*inch,rightMargin=.5*inch,topMargin=.35*inch,bottomMargin=.4*inch,title='Harshavardhan Kuthadi | Software Engineer',author=profile['name']).build(story,onFirstPage=footer,onLaterPages=footer)
print(output)
