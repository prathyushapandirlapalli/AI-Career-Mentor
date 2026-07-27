"""
API Testing Script for Module 3 (AI Career Intelligence Engine & Tools)
Run this script with: py test_api_module3.py (while backend server is running)
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_module3_tests():
    print("\n--- 1. Authenticating User ---")
    auth_res = requests.post(f"{BASE_URL}/api/v1/auth/register", json={
        "email": "career_tool_tester@example.com",
        "full_name": "Jordan Smith",
        "password": "Password123!",
        "target_role": "Senior Software Engineer"
    })
    
    if auth_res.status_code == 201:
        token = auth_res.json()["access_token"]
    else:
        login_res = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": "career_tool_tester@example.com",
            "password": "Password123!"
        })
        token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Authentication successful.")

    print("\n--- 2. Testing Company-Specific Preparation Roadmap (e.g., TCS / Amazon) ---")
    roadmap_res = requests.post(f"{BASE_URL}/api/v1/career/company-roadmap", headers=headers, json={
        "company_name": "Amazon",
        "target_role": "Backend Engineer"
    })
    print(f"Status Code: {roadmap_res.status_code}")
    assert roadmap_res.status_code == 201 or roadmap_res.status_code == 200
    roadmap_data = roadmap_res.json()
    print(f"Company: {roadmap_data['company_name']}")
    print(f"Interview Rounds: {len(roadmap_data['rounds'])}")
    print(f"Priority Topics: {roadmap_data['key_topics']}")
    print(f"Recommended Courses: {len(roadmap_data['courses'])}")

    print("\n--- 3. Testing AI Mock Interview Question Generation ---")
    interview_req = requests.post(f"{BASE_URL}/api/v1/interview/generate-questions", headers=headers, json={
        "target_role": "Backend Engineer",
        "company_name": "Amazon"
    })
    print(f"Status Code: {interview_req.status_code}")
    assert interview_req.status_code == 201
    session_data = interview_req.json()
    session_id = session_data["id"]
    questions = session_data["questions"]
    print(f"Generated Session ID: {session_id}")
    print(f"Questions Generated ({len(questions)}):")
    for q in questions:
        print(f"  - [{q.get('category')}] {q.get('question')}")

    print("\n--- 4. Submitting Interview Answers & Evaluating ---")
    sample_answers = [
        {
            "question_id": q.get("id", idx + 1),
            "answer": "I use FastAPI for building async REST endpoints, with Redis caching layer and MySQL indexing for performance optimization."
        } for idx, q in enumerate(questions)
    ]
    
    eval_res = requests.post(f"{BASE_URL}/api/v1/interview/submit-answers", headers=headers, json={
        "session_id": session_id,
        "answers": sample_answers
    })
    print(f"Status Code: {eval_res.status_code}")
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    print(f"Overall Interview Score: {eval_data['overall_score']}/100")
    print(f"AI Feedback: {eval_data['evaluation'].get('summary_feedback')}")

    print("\n--- 5. Generating 30/60/90 Days Study Planner Tasks ---")
    planner_res = requests.post(f"{BASE_URL}/api/v1/planner/generate-plan", headers=headers, json={
        "target_role": "Backend Engineer",
        "timeline_days": 30
    })
    print(f"Status Code: {planner_res.status_code}")
    assert planner_res.status_code == 201
    tasks = planner_res.json()
    print(f"Generated {len(tasks)} daily study tasks.")
    task_to_toggle = tasks[0]["id"]

    print("\n--- 6. Marking Task as Completed ---")
    patch_res = requests.patch(f"{BASE_URL}/api/v1/planner/task/{task_to_toggle}", headers=headers, json={
        "is_completed": True
    })
    print(f"Status Code: {patch_res.status_code}")
    assert patch_res.status_code == 200
    print(f"Task '{patch_res.json()['title']}' completed state: {patch_res.json()['is_completed']}")

    print("\n--- 7. Testing Progress & Analytics Dashboard Endpoint ---")
    dash_res = requests.get(f"{BASE_URL}/api/v1/progress/dashboard", headers=headers)
    print(f"Status Code: {dash_res.status_code}")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    print(f"\n--- PROGRESS DASHBOARD SUMMARY ---")
    print(f"Overall Career Readiness Score: {dash_data['overall_readiness_score']}/100")
    print(f"Mock Interviews Completed: {dash_data['mock_interviews_completed']}")
    print(f"Average Interview Score: {dash_data['average_interview_score']}")
    print(f"Tasks Completed: {dash_data['completed_study_tasks']}/{dash_data['total_study_tasks']} ({dash_data['completion_percentage']}%)")
    print(f"Study Streak: {dash_data['study_streak_days']} Days")

    print("\n[SUCCESS] ALL MODULE 3 API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        run_module3_tests()
    except Exception as e:
        print(f"\n[ERROR] Error during Module 3 testing: {e}")
