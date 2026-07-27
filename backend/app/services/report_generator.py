import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from typing import Dict, Any


def generate_career_report_pdf(user_name: str, user_email: str, target_role: str, analysis_data: Dict[str, Any]) -> bytes:
    """
    Generates a professional downloadable PDF Career Analysis Report using ReportLab.
    Returns PDF binary bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#4F46E5")  # Indigo
    secondary_color = colors.HexColor("#06B6D4") # Cyan
    dark_bg = colors.HexColor("#1E293B")        # Dark Slate
    text_dark = colors.HexColor("#0F172A")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=primary_color,
        fontName='Helvetica-Bold',
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=15
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=primary_color,
        fontName='Helvetica-Bold',
        spaceBefore=12,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=text_dark
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=text_dark,
        leftIndent=12,
        spaceAfter=3
    )

    elements = []

    # 1. Document Header
    elements.append(Paragraph("AI CAREER MENTOR - EXECUTIVE REPORT", title_style))
    meta_text = f"<b>Candidate:</b> {user_name} ({user_email}) &nbsp;|&nbsp; <b>Target Role:</b> {target_role} &nbsp;|&nbsp; <b>Date:</b> {datetime.now().strftime('%B %d, %Y')}"
    elements.append(Paragraph(meta_text, subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=15))

    # 2. Executive Scorecards Table
    elements.append(Paragraph("1. Executive Readiness Scores", section_heading))
    
    score_data = [
        [
            Paragraph("<b>Overall Score</b>", body_style),
            Paragraph("<b>ATS Score</b>", body_style),
            Paragraph("<b>Formatting</b>", body_style),
            Paragraph("<b>Impact</b>", body_style)
        ],
        [
            Paragraph(f"<font size=16 color='#4F46E5'><b>{analysis_data.get('resume_score', 0)}/100</b></font>", body_style),
            Paragraph(f"<font size=16 color='#06B6D4'><b>{analysis_data.get('ats_score', 0)}/100</b></font>", body_style),
            Paragraph(f"<font size=16 color='#10B981'><b>{analysis_data.get('formatting_score', 0)}/100</b></font>", body_style),
            Paragraph(f"<font size=16 color='#F59E0B'><b>{analysis_data.get('impact_score', 0)}/100</b></font>", body_style)
        ]
    ]

    score_table = Table(score_data, colWidths=[130, 130, 130, 130])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TEXTCOLOR', (0, 0), (-1, 0), text_dark),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(score_table)
    elements.append(Spacer(1, 12))

    # 3. AI Summary & Evaluation
    summary_text = analysis_data.get('summary_feedback', 'No summary evaluation available.')
    elements.append(Paragraph("<b>Summary Assessment:</b> " + summary_text, body_style))
    elements.append(Spacer(1, 10))

    # 4. Strengths & Improvements
    elements.append(Paragraph("2. Strengths & Actionable Improvements", section_heading))
    
    strengths = analysis_data.get('strengths', [])
    improvements = analysis_data.get('improvements', [])

    elements.append(Paragraph("<b>Key Strengths:</b>", body_style))
    for s in strengths:
        elements.append(Paragraph(f"• {s}", bullet_style))

    elements.append(Spacer(1, 6))
    elements.append(Paragraph("<b>Recommended Improvements:</b>", body_style))
    for imp in improvements:
        elements.append(Paragraph(f"• {imp}", bullet_style))

    elements.append(Spacer(1, 10))

    # 5. ATS Keyword Analysis
    elements.append(Paragraph("3. ATS Keyword Match Matrix", section_heading))
    found_kw = ", ".join(analysis_data.get('ats_keywords_found', [])) or "None identified"
    missing_kw = ", ".join(analysis_data.get('ats_keywords_missing', [])) or "None missing"

    ats_data = [
        [Paragraph("<b>Keywords Detected</b>", body_style), Paragraph(f"<font color='#10B981'>{found_kw}</font>", body_style)],
        [Paragraph("<b>Missing Keywords</b>", body_style), Paragraph(f"<font color='#EF4444'>{missing_kw}</font>", body_style)]
    ]
    ats_table = Table(ats_data, colWidths=[150, 370])
    ats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(ats_table)
    elements.append(Spacer(1, 12))

    # 6. Skill Gap & Roadmap
    elements.append(Paragraph("4. Personalized Learning Roadmap", section_heading))
    roadmap = analysis_data.get('learning_roadmap', [])

    for step in roadmap:
        phase_title = step.get('phase', 'Phase')
        goal = step.get('goal', '')
        topics = ", ".join(step.get('topics', []))
        
        step_content = f"<b>{phase_title}</b> - <i>{goal}</i> (Est. {step.get('estimated_hours', 10)} Hours)<br/>"
        step_content += f"<b>Topics:</b> {topics}"
        elements.append(Paragraph(step_content, body_style))
        
        for act in step.get('action_items', []):
            elements.append(Paragraph(f"→ {act}", bullet_style))
        elements.append(Spacer(1, 6))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
