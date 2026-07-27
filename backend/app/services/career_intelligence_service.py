import json
import logging
import re
from typing import Dict, Any, List
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)


class CareerIntelligenceService:
    """
    Advanced AI Service handling Company-Specific Roadmaps,
    Resume-tailored Interview Question Generation & Answer Evaluation,
    and 30/60/90-Day Daily Study Planners.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key and self.api_key != "your-gemini-api-key-here":
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client in CareerIntelligenceService: {e}")

    def generate_company_roadmap(self, company_name: str, target_role: str = "Software Engineer") -> Dict[str, Any]:
        """
        Generates company-specific interview preparation roadmap for top tech companies
        (e.g., TCS, Infosys, Accenture, Amazon, Google, Microsoft, Meta).
        """
        prompt = f"""
You are a Principal Tech Recruiter and Engineering Manager specializing in interview preparation for {company_name}.
Generate a comprehensive, company-specific preparation strategy for the role of "{target_role}" at "{company_name}".

Return VALID JSON ONLY with NO markdown wrapping. Adhere to this exact schema:

{{
  "company_name": "{company_name}",
  "target_role": "{target_role}",
  "rounds": [
    {{
      "round_number": 1,
      "title": "Online Aptitude & Coding Assessment (OA)",
      "duration": "90 mins",
      "format": "Aptitude, Logical Reasoning & 2 Coding Problems",
      "tips": "Focus on speed and accuracy. Practice previous years' test papers."
    }},
    {{
      "round_number": 2,
      "title": "Technical Round 1 (Data Structures & Core CS)",
      "duration": "60 mins",
      "format": "Live coding, Data Structures (Arrays, Strings, Trees), SQL queries",
      "tips": "Verbalize your thought process while coding. Explain time and space complexity."
    }},
    {{
      "round_number": 3,
      "title": "Technical Round 2 & System Design",
      "duration": "60 mins",
      "format": "Architecture, API Design, Object Oriented Principles & Resume Deep Dive",
      "tips": "Be ready to defend project architecture choices on your resume."
    }},
    {{
      "round_number": 4,
      "title": "HR & Culture Fit Round",
      "duration": "30 mins",
      "format": "Behavioral questions based on STAR method (Situation, Task, Action, Result)",
      "tips": "Align your answers with {company_name}'s core values and leadership principles."
    }}
  ],
  "key_topics": [
    "Arrays & Hashing (High Priority)",
    "SQL Joins & Indexing",
    "Object Oriented Design Patterns",
    "Rest API Design & Fast Execution"
  ],
  "preparation_steps": [
    {{
      "phase": "30 Days Plan",
      "focus": "Core DSA & Speed Coding",
      "tasks": ["Solve top 50 tagged questions for {company_name}", "Master SQL Querying"]
    }},
    {{
      "phase": "60 Days Plan",
      "focus": "System Design & Resume Projects",
      "tasks": ["Design URL Shortener / E-commerce cart", "Refine project architecture explanations"]
    }},
    {{
      "phase": "90 Days Plan",
      "focus": "Mock Interviews & Speed Optimization",
      "tasks": ["Conduct 5 timed mock interviews", "Review company core values and behavioral scenarios"]
    }}
  ],
  "courses": [
    {{
      "name": "Data Structures & Algorithms Masterclass",
      "platform": "GeeksforGeeks / YouTube",
      "type": "Free",
      "url": "https://www.geeksforgeeks.org/data-structures/"
    }},
    {{
      "name": "Complete System Design & Microservices",
      "platform": "Coursera / Udemy",
      "type": "Paid",
      "url": "https://www.coursera.org"
    }}
  ]
}}
"""

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3,
                        response_mime_type="application/json"
                    )
                )
                clean_json = re.sub(r'^```json\s*|\s*```$', '', response.text.strip(), flags=re.MULTILINE).strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API company roadmap generation failed: {e}")

        # Fallback generator
        return self._fallback_company_roadmap(company_name, target_role)

    def generate_interview_questions(self, resume_text: str, target_role: str = "Software Engineer", company_name: str = "Tech Company") -> List[Dict[str, Any]]:
        """
        Generates 5 tailored technical & behavioral interview questions based on the candidate's resume content.
        """
        prompt = f"""
You are a Senior Tech Lead conducting a technical interview for the role "{target_role}" at "{company_name}".
Based on the candidate's resume below, generate 5 targeted interview questions (3 technical deep-dives on their skills/projects, 2 behavioral/system scenario questions).

RESUME:
\"\"\"
{resume_text[:3000]}
\"\"\"

Return VALID JSON ONLY with NO markdown fences:
[
  {{
    "id": 1,
    "question": "Can you explain how you designed the API layer in your recent project and handled high concurrent traffic?",
    "category": "Technical Deep Dive",
    "difficulty": "Medium",
    "hint": "Mention framework choice (e.g. FastAPI/Node), database indexing, caching strategies, and load balancing.",
    "ideal_answer_points": [
      "Asynchronous request handling",
      "Redis caching layer",
      "Database connection pooling"
    ]
  }}
]
"""
        if self.client:
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.4,
                        response_mime_type="application/json"
                    )
                )
                clean_json = re.sub(r'^```json\s*|\s*```$', '', response.text.strip(), flags=re.MULTILINE).strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API question generation failed: {e}")

        return self._fallback_interview_questions(target_role)

    def evaluate_interview_responses(self, questions: List[Dict[str, Any]], user_answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates candidate's interview answers against questions using Gemini AI.
        Computes score (0-100), key feedback, strengths, and missing points per question.
        """
        prompt = f"""
You are an expert Interview Evaluator. Evaluate the candidate's responses to the technical interview questions.

QUESTIONS & CANDIDATE ANSWERS:
{json.dumps({"questions": questions, "candidate_answers": user_answers}, indent=2)}

Return VALID JSON ONLY:
{{
  "overall_score": 82,
  "summary_feedback": "Great technical clarity and clear communication. Could expand more on database query optimization.",
  "strengths": ["Structured answers using STAR method", "Good understanding of REST API principles"],
  "areas_for_growth": ["Add concrete numbers to quantify impact", "Mention caching strategies when asked about scalability"],
  "question_evaluations": [
    {{
      "question_id": 1,
      "score": 85,
      "feedback": "Solid explanation of API endpoints, but missed mentioning caching.",
      "ideal_points_covered": 2,
      "total_ideal_points": 3
    }}
  ]
}}
"""
        if self.client:
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3,
                        response_mime_type="application/json"
                    )
                )
                clean_json = re.sub(r'^```json\s*|\s*```$', '', response.text.strip(), flags=re.MULTILINE).strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API interview evaluation failed: {e}")

        return self._fallback_interview_evaluation(user_answers)

    def generate_daily_study_plan(self, target_role: str, timeline_days: int = 30) -> List[Dict[str, Any]]:
        """
        Generates daily study plan tasks (Days 1 to timeline_days) with free and paid learning recommendations.
        """
        prompt = f"""
Generate a structured {timeline_days}-day daily study curriculum for a candidate aiming to become a "{target_role}".
Include 1 task per day for Days 1 to 10 with clear titles, descriptions, categories (DSA, Backend, System Design, Frontend), recommended resources (Coursera, GeeksforGeeks, YouTube, freeCodeCamp), and duration in minutes.

Return VALID JSON ONLY:
[
  {{
    "day_number": 1,
    "title": "Master Array & Hash Map Operations",
    "description": "Solve Two Sum, Group Anagrams, and Top K Frequent Elements. Focus on O(N) time complexity.",
    "category": "Data Structures",
    "resource_name": "LeetCode / GeeksforGeeks Array Track",
    "resource_url": "https://leetcode.com/explore/featured/card/leetcodes-interview-crash-course-data-structures-and-algorithms/",
    "is_free": true,
    "duration_minutes": 60
  }}
]
"""
        if self.client:
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3,
                        response_mime_type="application/json"
                    )
                )
                clean_json = re.sub(r'^```json\s*|\s*```$', '', response.text.strip(), flags=re.MULTILINE).strip()
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini API study plan generation failed: {e}")

        return self._fallback_study_plan(target_role)

    # --- FALLBACK IMPLEMENTATIONS ---
    def _fallback_company_roadmap(self, company_name: str, target_role: str) -> Dict[str, Any]:
        return {
            "company_name": company_name,
            "target_role": target_role,
            "rounds": [
                {
                    "round_number": 1,
                    "title": "Online Aptitude & Coding Round",
                    "duration": "90 mins",
                    "format": "Quantitative Aptitude, Logical Reasoning & 2 Coding Problems",
                    "tips": f"Practice speed solving on standard {company_name} test patterns."
                },
                {
                    "round_number": 2,
                    "title": "Technical Round 1 (Core CS & Problem Solving)",
                    "duration": "60 mins",
                    "format": "Data Structures (Arrays, Linked Lists, Trees) & SQL",
                    "tips": "Explain your approach before typing code."
                },
                {
                    "round_number": 3,
                    "title": "Technical Round 2 (System Design & Projects)",
                    "duration": "60 mins",
                    "format": "Resume Deep Dive & High-Level System Design",
                    "tips": "Be ready to explain architecture decisions on past projects."
                },
                {
                    "round_number": 4,
                    "title": "HR & Leadership Values Round",
                    "duration": "30 mins",
                    "format": "Behavioral scenarios",
                    "tips": f"Review {company_name}'s culture guidelines."
                }
            ],
            "key_topics": [
                "Arrays, Strings & Hash Tables",
                "SQL Querying & Indexing",
                "RESTful API Design Principles",
                "Object Oriented Programming (OOP)"
            ],
            "preparation_steps": [
                {
                    "phase": "30 Days Plan",
                    "focus": "DSA & Core CS Fundamentals",
                    "tasks": [f"Solve top 30 coding problems for {company_name}", "Revise SQL joins & indexes"]
                },
                {
                    "phase": "60 Days Plan",
                    "focus": "Full Stack Projects & System Design",
                    "tasks": ["Build 1 full-stack CRUD application with JWT", "Practice API design"]
                },
                {
                    "phase": "90 Days Plan",
                    "focus": "Mock Interviews & Behavioral Polish",
                    "tasks": ["Complete 3 timed AI mock interviews", "Prepare STAR method stories"]
                }
            ],
            "courses": [
                {
                    "name": "Data Structures & Algorithms Course",
                    "platform": "GeeksforGeeks",
                    "type": "Free",
                    "url": "https://www.geeksforgeeks.org/data-structures/"
                },
                {
                    "name": "System Design Primer & Microservices",
                    "platform": "YouTube / freeCodeCamp",
                    "type": "Free",
                    "url": "https://www.youtube.com"
                },
                {
                    "name": "Complete Web Developer Masterclass",
                    "platform": "Udemy",
                    "type": "Paid",
                    "url": "https://www.udemy.com"
                }
            ]
        }

    def _fallback_interview_questions(self, target_role: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": 1,
                "question": "Walk me through how you architected your most complex web project from database schema to user interface.",
                "category": "Architecture Deep Dive",
                "difficulty": "Medium",
                "hint": "Discuss database choice, API layer setup, state management, and deployment.",
                "ideal_answer_points": ["Database normalization", "REST endpoint design", "Frontend component isolation"]
            },
            {
                "id": 2,
                "question": "How do you ensure application security and authenticate user sessions in a modern Web application?",
                "category": "Security & Auth",
                "difficulty": "Medium",
                "hint": "Discuss JWT tokens, password hashing with bcrypt, HTTPS, and CORS policies.",
                "ideal_answer_points": ["Bcrypt hashing", "JWT access tokens", "HTTP-only cookies & CORS configuration"]
            },
            {
                "id": 3,
                "question": "Describe a scenario where a database query was performing slowly. How did you diagnose and resolve it?",
                "category": "Database Optimization",
                "difficulty": "Hard",
                "hint": "Mention query execution plans (EXPLAIN), indexing, caching, and connection pooling.",
                "ideal_answer_points": ["EXPLAIN query plan", "Creating targeted DB indexes", "Redis caching"]
            },
            {
                "id": 4,
                "question": "Tell me about a time you faced a critical bug right before deployment. How did you handle it?",
                "category": "Behavioral STAR",
                "difficulty": "Medium",
                "hint": "Use Situation, Task, Action, Result framework.",
                "ideal_answer_points": ["Root cause analysis", "Hotfix deployment", "Post-mortem prevention"]
            },
            {
                "id": 5,
                "question": "How do you keep your technical skills updated in the fast-evolving tech landscape?",
                "category": "Continuous Learning",
                "difficulty": "Easy",
                "hint": "Mention building side projects, reading documentation, open source contributions.",
                "ideal_answer_points": ["Hands-on project creation", "Tech blogs & official docs"]
            }
        ]

    def _fallback_interview_evaluation(self, user_answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        answered_count = len([a for a in user_answers if len(a.get("answer", "").strip()) > 10])
        score = min(90, max(50, 60 + (answered_count * 6)))
        return {
            "overall_score": score,
            "summary_feedback": "Demonstrates clear understanding of fundamental web concepts. Answers are coherent, with room to add specific performance metrics and architectural trade-offs.",
            "strengths": [
                "Good technical vocabulary and clear communication structure",
                "Relevant project experience examples"
            ],
            "areas_for_growth": [
                "Quantify technical impact (e.g., % latency reduction)",
                "Mention scalability techniques like caching and indexing"
            ],
            "question_evaluations": [
                {
                    "question_id": a.get("question_id", 1),
                    "score": score,
                    "feedback": "Solid answer with core points covered.",
                    "ideal_points_covered": 2,
                    "total_ideal_points": 3
                } for a in user_answers
            ]
        }

    def _fallback_study_plan(self, target_role: str) -> List[Dict[str, Any]]:
        return [
            {
                "day_number": 1,
                "title": "Data Structures - Arrays & Strings Masterclass",
                "description": "Solve Two Sum, Sliding Window Maximum, and Valid Anagram. Understand O(1) space complexity tricks.",
                "category": "Data Structures",
                "resource_name": "GeeksforGeeks Array Track",
                "resource_url": "https://www.geeksforgeeks.org/array-data-structure/",
                "is_free": True,
                "duration_minutes": 60
            },
            {
                "day_number": 2,
                "title": "Relational Databases & Advanced SQL Queries",
                "description": "Master INNER JOIN, LEFT JOIN, GROUP BY, and Indexing optimizations in MySQL/PostgreSQL.",
                "category": "Database",
                "resource_name": "SQLZoo / Mode Analytics SQL Tutorial",
                "resource_url": "https://sqlzoo.net/",
                "is_free": True,
                "duration_minutes": 60
            },
            {
                "day_number": 3,
                "title": "REST API Architecture & Authentication",
                "description": "Build secure JWT authentication, input validation with Pydantic, and error handling in FastAPI.",
                "category": "Backend",
                "resource_name": "FastAPI Official Documentation",
                "resource_url": "https://fastapi.tiangolo.com/",
                "is_free": True,
                "duration_minutes": 75
            },
            {
                "day_number": 4,
                "title": "React Core & Custom Hooks Mastery",
                "description": "Build custom hooks for data fetching, state management with Context API, and form handling.",
                "category": "Frontend",
                "resource_name": "React Official Docs & freeCodeCamp",
                "resource_url": "https://react.dev/",
                "is_free": True,
                "duration_minutes": 60
            },
            {
                "day_number": 5,
                "title": "System Design Fundamentals - Caching & Load Balancing",
                "description": "Learn Redis caching strategies (Cache-Aside, Write-Through) and Nginx reverse proxy load balancing.",
                "category": "System Design",
                "resource_name": "System Design Primer GitHub",
                "resource_url": "https://github.com/donnemartin/system-design-primer",
                "is_free": True,
                "duration_minutes": 90
            }
        ]


career_intelligence_service = CareerIntelligenceService()
