import json
import logging
import re
from typing import Dict, Any
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Service wrapper around Google Gemini API for AI Resume Analysis,
    ATS scoring, Skill Gap evaluation, and Career Roadmap generation.
    """
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key and self.api_key != "your-gemini-api-key-here":
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    def analyze_resume(self, resume_text: str, target_role: str = "Software Engineer") -> Dict[str, Any]:
        """
        Analyzes extracted resume text against a target job role using Gemini AI.
        Returns detailed structured analysis dictionary.
        """
        prompt = f"""
You are an expert Executive Career Coach and ATS (Applicant Tracking System) Specialist.
Analyze the following resume for the target job role: "{target_role}".

RESUME TEXT:
\"\"\"
{resume_text[:4000]}
\"\"\"

Produce a comprehensive, rigorous assessment in VALID JSON ONLY. Do not include markdown code block formatting like ```json.
Your output MUST adhere strictly to the following JSON structure:

{{
  "resume_score": 82,
  "ats_score": 78,
  "formatting_score": 85,
  "impact_score": 80,
  "summary_feedback": "Detailed overall summary evaluation of candidate profile...",
  "strengths": [
    "Strong experience with full-stack web development",
    "Good use of action verbs in project descriptions"
  ],
  "improvements": [
    "Quantify achievements with measurable metrics (e.g. % performance gain)",
    "Include more cloud deployment keywords"
  ],
  "ats_keywords_found": ["React", "FastAPI", "Python", "SQL", "Git"],
  "ats_keywords_missing": ["Docker", "CI/CD", "Kubernetes", "Redis", "System Design"],
  "skill_gap_analysis": [
    {{
      "skill": "Docker & Containerization",
      "category": "DevOps",
      "gap_level": "High",
      "recommendation": "Learn Docker basics, build multi-stage Dockerfiles for Python/React apps"
    }},
    {{
      "skill": "System Design Architecture",
      "category": "Backend",
      "gap_level": "Medium",
      "recommendation": "Study microservices, caching strategies, and load balancing principles"
    }}
  ],
  "job_recommendations": [
    {{
      "title": "Full Stack Engineer",
      "match_percentage": 88,
      "reason": "Strong synergy across frontend React and Python backend services."
    }},
    {{
      "title": "Backend Python Developer",
      "match_percentage": 82,
      "reason": "Solid backend API construction experience with relational databases."
    }}
  ],
  "learning_roadmap": [
    {{
      "phase": "Phase 1: Immediate Gap Closing (Weeks 1-2)",
      "goal": "Master Containerization & Deployment",
      "estimated_hours": 20,
      "topics": ["Docker Fundamentals", "Docker Compose", "Cloud Deployment (AWS/GCP)"],
      "action_items": [
        "Containerize FastAPI backend and React frontend app",
        "Deploy demo project on cloud instance with HTTPS"
      ]
    }},
    {{
      "phase": "Phase 2: System Architecture & Performance (Weeks 3-4)",
      "goal": "Advance Backend & Database Performance",
      "estimated_hours": 25,
      "topics": ["Redis Caching", "Database Indexing & Query Optimization", "Async Processing"],
      "action_items": [
        "Integrate Redis caching layer into backend API",
        "Write unit tests and setup GitHub Actions CI pipeline"
      ]
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
                
                raw_response = response.text.strip()
                # Remove possible markdown fences if returned despite mime type constraint
                clean_json_str = re.sub(r'^```json\s*|\s*```$', '', raw_response, flags=re.MULTILINE).strip()
                parsed_result = json.loads(clean_json_str)
                return parsed_result

            except Exception as e:
                logger.error(f"Gemini API request failed: {e}. Falling back to rule-based fallback analysis.")

        # Fallback intelligent analyzer when Gemini API Key is unconfigured or encounters quota issues
        return self._generate_rule_based_fallback(resume_text, target_role)

    def _generate_rule_based_fallback(self, text: str, target_role: str) -> Dict[str, Any]:
        """
        Rule-based intelligence engine that extracts skills and calculates realistic metrics
        when live LLM calls are disabled or unavailable.
        """
        lower_text = text.lower()
        
        common_tech_skills = [
            "python", "javascript", "react", "fastapi", "sql", "mysql", "postgresql",
            "git", "html", "css", "tailwind", "node", "docker", "aws", "rest api",
            "java", "c++", "linux", "typescript", "mongodb", "graphql", "redis"
        ]
        
        found_skills = [skill.title() for skill in common_tech_skills if skill in lower_text]
        missing_skills = [skill.title() for skill in common_tech_skills if skill not in lower_text][:5]
        
        word_count = len(text.split())
        resume_score = min(92, max(60, int(65 + (len(found_skills) * 3) + (10 if word_count > 250 else 0))))
        ats_score = min(95, max(55, int(60 + (len(found_skills) * 3.5))))
        formatting_score = 85 if "\n" in text else 70
        impact_score = 80 if any(char.isdigit() for char in text) else 65

        return {
            "resume_score": resume_score,
            "ats_score": ats_score,
            "formatting_score": formatting_score,
            "impact_score": impact_score,
            "summary_feedback": f"Strong candidate foundation identified for target role of '{target_role}'. Demonstrates proficiency in core technical skills with room for expanding DevOps and metrics presentation.",
            "strengths": [
                f"Solid background with identified core competencies: {', '.join(found_skills[:4]) if found_skills else 'Technical fundamentals'}",
                "Clear structural layout and readable section organization",
                "Relevant project and experience highlights"
            ],
            "improvements": [
                "Quantify project outcomes with measurable metric KPIs (e.g. '% efficiency increase')",
                f"Incorporate missing industry key terms: {', '.join(missing_skills[:3])}",
                "Include direct links to live demo projects or GitHub repositories"
            ],
            "ats_keywords_found": found_skills if found_skills else ["Python", "JavaScript", "SQL"],
            "ats_keywords_missing": missing_skills if missing_skills else ["Docker", "CI/CD", "AWS"],
            "skill_gap_analysis": [
                {
                    "skill": missing_skills[0] if len(missing_skills) > 0 else "Docker",
                    "category": "Infrastructure",
                    "gap_level": "High",
                    "recommendation": f"Acquire practical experience with {missing_skills[0] if len(missing_skills) > 0 else 'Docker'} and add containerized deployment to portfolio."
                },
                {
                    "skill": missing_skills[1] if len(missing_skills) > 1 else "CI/CD Pipelines",
                    "category": "DevOps",
                    "gap_level": "Medium",
                    "recommendation": "Configure automated GitHub Actions workflow for testing and code building."
                }
            ],
            "job_recommendations": [
                {
                    "title": target_role,
                    "match_percentage": ats_score,
                    "reason": f"Profile matches {ats_score}% of core competency criteria for {target_role}."
                },
                {
                    "title": "Full Stack Web Developer",
                    "match_percentage": max(70, ats_score - 5),
                    "reason": "Versatile skill combination across database, backend logic, and frontend rendering."
                }
            ],
            "learning_roadmap": [
                {
                    "phase": "Phase 1: Key Skill Integration (Week 1-2)",
                    "goal": f"Master {missing_skills[0] if len(missing_skills) > 0 else 'Docker'} & Modern Tooling",
                    "estimated_hours": 15,
                    "topics": [missing_skills[0] if len(missing_skills) > 0 else "Docker", "REST API Optimization"],
                    "action_items": [
                        f"Build and containerize a project using {missing_skills[0] if len(missing_skills) > 0 else 'Docker'}",
                        "Add quantified metrics to resume bullet points"
                    ]
                },
                {
                    "phase": "Phase 2: Career Readiness & Portfolio Polish (Week 3-4)",
                    "goal": "System Architecture & Mock Interview Practice",
                    "estimated_hours": 20,
                    "topics": ["System Design Basics", "Technical Behavioral Interviews"],
                    "action_items": [
                        "Complete 2 AI Mock Interview sessions on technical scenario handling",
                        "Refine resume with target ATS keywords"
                    ]
                }
            ]
        }


gemini_service = GeminiService()
