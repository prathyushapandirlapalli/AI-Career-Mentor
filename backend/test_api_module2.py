"""
API Testing Script for Module 2 (Resume PDF Extraction, Gemini AI & Report Generator)
Run this script with: py test_api_module2.py (while backend server is running)
"""

import requests
import json
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

BASE_URL = "http://127.0.0.1:8000"

def create_sample_pdf_bytes():
    """Generates a sample resume PDF in memory for testing."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    story = [
        Paragraph("<b>Alex Johnson</b>", styles['Title']),
        Paragraph("alex.johnson@example.com | (555) 123-4567 | San Francisco, CA", styles['Normal']),
        Spacer(1, 12),
        Paragraph("<b>SUMMARY</b>", styles['Heading2']),
        Paragraph("Experienced Full Stack Software Engineer with 4+ years of expertise building web applications using React, Python, FastAPI, and MySQL databases.", styles['Normal']),
        Spacer(1, 10),
        Paragraph("<b>TECHNICAL SKILLS</b>", styles['Heading2']),
        Paragraph("Languages: Python, JavaScript, SQL, HTML/CSS<br/>Frameworks: React, FastAPI, Tailwind CSS, Node.js<br/>Tools: Git, PostgreSQL, REST APIs", styles['Normal']),
        Spacer(1, 10),
        Paragraph("<b>WORK EXPERIENCE</b>", styles['Heading2']),
        Paragraph("<b>Senior Web Developer</b> - TechCorp Inc (2022 - Present)", styles['Heading3']),
        Paragraph("• Architected scalable REST APIs using FastAPI and MySQL handling 100k+ daily requests.<br/>• Built modern dashboard applications with React and Tailwind CSS.", styles['Normal']),
    ]
    
    doc.build(story)
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data


def run_module2_tests():
    print("\n--- 1. Authenticating User ---")
    auth_res = requests.post(f"{BASE_URL}/api/v1/auth/register", json={
        "email": "resume_tester@example.com",
        "full_name": "Alex Johnson",
        "password": "Password123!",
        "target_role": "Senior Full Stack Engineer"
    })
    
    if auth_res.status_code == 201:
        token = auth_res.json()["access_token"]
    else:
        login_res = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": "resume_tester@example.com",
            "password": "Password123!"
        })
        token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Authentication successful.")

    print("\n--- 2. Uploading PDF Resume & Running Gemini AI Analysis ---")
    pdf_bytes = create_sample_pdf_bytes()
    files = {"file": ("Alex_Johnson_Resume.pdf", pdf_bytes, "application/pdf")}
    data = {"target_role": "Full Stack Engineer"}

    res = requests.post(f"{BASE_URL}/api/v1/resume/upload-and-analyze", headers=headers, files=files, data=data)
    print(f"Status Code: {res.status_code}")
    assert res.status_code == 201
    
    result = res.json()
    analysis_id = result["id"]
    print(f"\nAnalysis Report ID: {analysis_id}")
    print(f"Resume Score: {result['resume_score']}/100")
    print(f"ATS Score: {result['ats_score']}/100")
    print(f"Found ATS Keywords: {result['ats_keywords_found']}")
    print(f"Missing ATS Keywords: {result['ats_keywords_missing']}")
    print(f"Job Recommendations: {[j['title'] for j in result['job_recommendations']]}")
    print(f"Skill Gap Items: {len(result['skill_gap_analysis'])}")
    print(f"Roadmap Phases: {len(result['learning_roadmap'])}")

    print("\n--- 3. Fetching User's Past Resume Analyses ---")
    res_list = requests.get(f"{BASE_URL}/api/v1/resume/analyses", headers=headers)
    print(f"Status Code: {res_list.status_code}")
    print(f"Retrieved {len(res_list.json())} past analysis records.")
    assert res_list.status_code == 200

    print("\n--- 4. Testing PDF Report Download Endpoint ---")
    pdf_res = requests.get(f"{BASE_URL}/api/v1/resume/analysis/{analysis_id}/pdf", headers=headers)
    print(f"Status Code: {pdf_res.status_code}")
    print(f"Received PDF Content Length: {len(pdf_res.content)} bytes")
    print(f"Content Type: {pdf_res.headers.get('Content-Type')}")
    assert pdf_res.status_code == 200
    assert pdf_res.headers.get("Content-Type") == "application/pdf"

    print("\n[SUCCESS] ALL MODULE 2 API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        run_module2_tests()
    except Exception as e:
        print(f"\n[ERROR] Error during Module 2 testing: {e}")
