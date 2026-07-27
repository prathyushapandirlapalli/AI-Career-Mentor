export const companyPrepData = {
  amazon: {
    company_name: 'Amazon',
    tagline: 'Customer Obsession & Scale-Driven Problem Solving',
    difficulty: 'Very Hard (DSA + Leadership Principles)',
    rounds: [
      {
        round_number: 1,
        title: 'Online Assessment (OA)',
        duration: '90 - 120 Mins',
        format: '2 LeetCode Medium/Hard Coding Problems + Work Style / Leadership Survey',
        tips: 'Focus on Arrays, Strings, Hash Maps, and Dynamic Programming. Complete the Work Style Assessment keeping Amazon Leadership Principles in mind.'
      },
      {
        round_number: 2,
        title: 'Technical Screen (Virtual Onsite 1)',
        duration: '60 Mins',
        format: '1-2 Data Structures & Algorithms Problems + 15 Mins Behavioral Questions',
        tips: 'Expect questions on Binary Trees, Graphs (BFS/DFS), and Heaps. Frame behavioral answers using the STAR method (Situation, Task, Action, Result).'
      },
      {
        round_number: 3,
        title: 'System Design / Object-Oriented Design (OOD)',
        duration: '60 Mins',
        format: 'High-Level System Architecture (L2/L3+) or Low-Level OOD (L1/L2)',
        tips: 'Design scalable services (e.g., URL Shortener, Order Fulfillment). Discuss trade-offs: Caching (Redis), Database Choice (DynamoDB vs SQL), and Microservices.'
      },
      {
        round_number: 4,
        title: 'The Loop - Bar Raiser & Behavioral Focus',
        duration: '60 Mins',
        format: 'Deep Dive into Past Engineering Impact + Bar Raiser Interview',
        tips: 'The Bar Raiser evaluates whether you raise the bar for Amazon. Prepare 4-5 distinct STAR stories highlighting "Customer Obsession", "Ownership", "Bias for Action", and "Have Backbone; Disagree and Commit".'
      }
    ],
    priorities: [
      { category: 'DSA & Coding', score: 5, stars: '★★★★★', detail: 'Arrays, Trees, Graphs, DP, Hash Maps' },
      { category: 'Leadership Principles (STAR)', score: 5, stars: '★★★★★', detail: 'Customer Obsession, Ownership, Bias for Action' },
      { category: 'System Architecture & OOD', score: 4, stars: '★★★★☆', detail: 'Scalability, Load Balancing, Database Design' },
      { category: 'Quantitative Aptitude', score: 1, stars: '★☆☆☆☆', detail: 'Not tested in engineering interviews' }
    ],
    key_topics: [
      'Amazon 16 Leadership Principles (STAR Format)',
      'Binary Trees, BST & Lowest Common Ancestor',
      'Graph Traversal (BFS/DFS, Topological Sort)',
      'Dynamic Programming & Greedy Algorithms',
      'Low-Level Object-Oriented Design (OOD)',
      'High-Level System Design (Microservices, Caching)'
    ],
    courses: [
      { name: 'NeetCode 150 - Amazon Targeted DSA List', platform: 'NeetCode / YouTube', type: 'Free', url: 'https://neetcode.io/practice' },
      { name: 'Amazon Leadership Principles Deep Dive', platform: 'Interviewing.io', type: 'Free', url: 'https://interviewing.io/blog/amazon-leadership-principles-interview-questions' },
      { name: 'System Design Primer by Donne Martin', platform: 'GitHub', type: 'Free', url: 'https://github.com/donnemartin/system-design-primer' }
    ]
  },

  google: {
    company_name: 'Google',
    tagline: 'Algorithmic Mastery, Speed, and Technical Rigor',
    difficulty: 'Extremely Hard (Advanced DSA & Optimization)',
    rounds: [
      {
        round_number: 1,
        title: 'Initial Technical Screen',
        duration: '45 Mins',
        format: '1 Medium/Hard Algorithmic Coding Problem on Google Docs / CoderPad',
        tips: 'Communicate your thought process out loud continuously. Focus on optimal time and space complexity (O(N log N), O(N)). Code must be clean and bug-free.'
      },
      {
        round_number: 2,
        title: 'Coding Onsite Round 1 & 2',
        duration: '45 Mins Each',
        format: 'Complex Data Structures, Advanced Graphs, Dynamic Programming & Backtracking',
        tips: 'Expect non-standard problems requiring creative algorithmic approaches. Master Trie, Segment Trees, Disjoint Set Union (DSU), and Graph algorithms.'
      },
      {
        round_number: 3,
        title: 'System Design / System Architecture',
        duration: '45 - 60 Mins',
        format: 'Distributed Infrastructure & High-Throughput System Design (Mid/Senior Level)',
        tips: 'Architect systems handling millions of requests per second (e.g., Google Drive, Global Key-Value Store). Focus on consistency models, replication, and partitioning.'
      },
      {
        round_number: 4,
        title: 'Googleyness & Leadership',
        duration: '45 Mins',
        format: 'Behavioral & Situational Questions on Collaboration, Diversity, and Handling Ambiguity',
        tips: 'Demonstrate humility, intellectual curiosity, ability to navigate ambiguity, and team-first decision making.'
      }
    ],
    priorities: [
      { category: 'DSA & Advanced Algorithms', score: 5, stars: '★★★★★', detail: 'Graphs, Trees, DP, Backtracking, Heaps' },
      { category: 'Algorithmic Efficiency & Math', score: 5, stars: '★★★★★', detail: 'Optimal Time/Space Complexity & Edge Cases' },
      { category: 'System Architecture', score: 4, stars: '★★★★☆', detail: 'Distributed Storage, Consistency, Scalability' },
      { category: 'Quantitative Aptitude', score: 1, stars: '★☆☆☆☆', detail: 'Not tested in software engineering roles' }
    ],
    key_topics: [
      'Advanced Graph Algorithms (Dijkstra, Topological Sort, DSU)',
      'Dynamic Programming (Knapsack, Substring/Subsequence Alignment)',
      'Recursion, Backtracking & Constraint Satisfaction',
      'Binary Search on Answer Space & Two Pointers',
      'Distributed System Infrastructure & CAP Theorem',
      'Googleyness: Navigating Ambiguity & Open Communication'
    ],
    courses: [
      { name: 'LeetCode Google Top 100 Frequent Questions', platform: 'LeetCode', type: 'Freemium', url: 'https://leetcode.com/problemset/all/' },
      { name: 'Grokking the Coding Interview', platform: 'DesignGurus', type: 'Paid', url: 'https://www.designgurus.io/' },
      { name: 'MIT 6.006 Intro to Algorithms', platform: 'MIT OCW', type: 'Free', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/' }
    ]
  },

  microsoft: {
    company_name: 'Microsoft',
    tagline: 'Core CS Fundamentals, Code Clarity, and Engineering Depth',
    difficulty: 'Hard (Coding + CS Fundamentals)',
    rounds: [
      {
        round_number: 1,
        title: 'Online Assessment / Screening',
        duration: '60 - 90 Mins',
        format: '2-3 Coding Questions on Codility / HackerRank',
        tips: 'Clean code structure and edge case handling are critical. Problems test Strings, Matrix Manipulation, LinkedLists, and Array Sorting.'
      },
      {
        round_number: 2,
        title: 'Technical Round 1: Coding & Data Structures',
        duration: '45 - 60 Mins',
        format: 'DSA Problems + Deep Dive into Resume Projects',
        tips: 'Be prepared to write code on whiteboard/CoderPad and explain time/space complexities clearly.'
      },
      {
        round_number: 3,
        title: 'Technical Round 2: Core CS Fundamentals',
        duration: '45 - 60 Mins',
        format: 'Object-Oriented Programming (OOP), OS, DBMS & Computer Networks',
        tips: 'Revise virtual memory, multi-threading/concurrency, deadlock conditions, SQL indexing, ACID properties, and HTTP/TCP protocols.'
      },
      {
        round_number: 4,
        title: 'AA / As-Appropriate Round (Hiring Manager)',
        duration: '60 Mins',
        format: 'High-Level Design + Cultural Alignment & Growth Mindset',
        tips: 'Demonstrate Microsoft\'s "Growth Mindset" principle. Discuss past failures and how you learned from them.'
      }
    ],
    priorities: [
      { category: 'DSA & Problem Solving', score: 4, stars: '★★★★☆', detail: 'LinkedLists, Binary Search Trees, Strings, Arrays' },
      { category: 'Core CS Fundamentals', score: 4, stars: '★★★★☆', detail: 'OOP, Operating Systems, DBMS, Networks' },
      { category: 'System & Object Design', score: 3, stars: '★★★☆☆', detail: 'Low Level Design, Class Diagrams, Microservices' },
      { category: 'Growth Mindset & Culture', score: 3, stars: '★★★☆☆', detail: 'Adaptability, Continuous Learning, Collaboration' }
    ],
    key_topics: [
      'LinkedList Manipulation & Binary Tree Traversals',
      'Object-Oriented Design (SOLID Principles & Design Patterns)',
      'Operating System Concepts (Process vs Thread, Mutex, Deadlocks)',
      'Database Management Systems (SQL Queries, Indexing, Transactions)',
      'Computer Networks (TCP/IP 4-Layer Model, DNS, HTTP/HTTPS)',
      'Microsoft Growth Mindset & Cultural Values'
    ],
    courses: [
      { name: 'Microsoft Technical Interview Preparation Guide', platform: 'GeeksforGeeks', type: 'Free', url: 'https://www.geeksforgeeks.org/microsoft-interview-preparation/' },
      { name: 'CS Fundamentals Mastery Course', platform: 'InterviewBit', type: 'Free', url: 'https://www.interviewbit.com/' },
      { name: 'LeetCode Microsoft Top Curated List', platform: 'LeetCode', type: 'Freemium', url: 'https://leetcode.com/' }
    ]
  },

  meta: {
    company_name: 'Meta',
    tagline: 'High-Speed Coding Execution & Product Infrastructure',
    difficulty: 'Very Hard (Speed Coding + Product Architecture)',
    rounds: [
      {
        round_number: 1,
        title: 'Initial Technical Phone Screen',
        duration: '45 Mins',
        format: '2 LeetCode Medium Coding Questions (Exact 20 mins per problem)',
        tips: 'Meta requires fast, accurate coding execution. Aim to write compilable, optimal code without syntax errors within 15-18 minutes per question.'
      },
      {
        round_number: 2,
        title: 'Coding Onsite Round 1 & 2',
        duration: '45 Mins Each',
        format: '2 Algorithmic Coding Problems per session',
        tips: 'Focus heavily on Meta\'s top tagged questions on LeetCode. Hash Maps, Arrays, Binary Search, Trees, and Graph Traversal (BFS/DFS) dominate.'
      },
      {
        round_number: 3,
        title: 'System / Product Architecture',
        duration: '45 Mins',
        format: 'Product Design (e.g., News Feed, Instagram Stories, Messenger)',
        tips: 'Focus on Data Modeling, API Design, Feed Ranking Architecture, and Caching strategies at Meta scale.'
      },
      {
        round_number: 4,
        title: 'Behavioral & Leadership',
        duration: '45 Mins',
        format: 'Past Engineering Conflicts, Impact & "Move Fast" Philosophy',
        tips: 'Highlight instances where you executed quickly, took calculated risks, resolved conflicts, and pushed code to production.'
      }
    ],
    priorities: [
      { category: 'Coding Speed & Accuracy', score: 5, stars: '★★★★★', detail: '2 Medium Problems Solved Flawlessly in 40 Mins' },
      { category: 'DSA & Algorithms', score: 5, stars: '★★★★★', detail: 'Hash Maps, BFS/DFS, Binary Search, Two Pointers' },
      { category: 'Product & System Design', score: 4, stars: '★★★★☆', detail: 'Feed Architecture, API Specs, Data Sharding' },
      { category: 'Behavioral (Move Fast)', score: 3, stars: '★★★☆☆', detail: 'Execution Speed, Conflict Resolution, Risk Taking' }
    ],
    key_topics: [
      'Meta Tagged LeetCode Questions (Last 6 Months)',
      'Breadth-First Search (BFS) & Depth-First Search (DFS)',
      'Hash Map Lookup & Frequency Counters',
      'Binary Search Variations & Interval Merging',
      'System Design for Social Apps (Newsfeed, Chat, Search)',
      'Meta Core Values: Move Fast, Focus on Impact, Build Awesome Things'
    ],
    courses: [
      { name: 'LeetCode Meta Top 100 Tagged Problems', platform: 'LeetCode', type: 'Freemium', url: 'https://leetcode.com/' },
      { name: 'Grokking System Design for Meta Product Roles', platform: 'Educative.io', type: 'Paid', url: 'https://www.educative.io/' },
      { name: 'Meta Interview Process Breakdown', platform: 'TechInterviewHandBook', type: 'Free', url: 'https://www.techinterviewhandbook.org/' }
    ]
  },

  tcs: {
    company_name: 'TCS',
    tagline: 'National Qualifier Test (NQT) & Service Competency',
    difficulty: 'Moderate (Aptitude + Core Programming)',
    rounds: [
      {
        round_number: 1,
        title: 'TCS NQT Online Test - Foundation Section',
        duration: '75 Mins',
        format: 'Numerical Ability, Verbal Ability & Reasoning Ability',
        tips: 'Practice time management for Quantitative aptitude (Percentages, Profit & Loss, Speed & Distance). Practice syllogisms and reading comprehension.'
      },
      {
        round_number: 2,
        title: 'TCS NQT Online Test - Advanced Section',
        duration: '60 Mins',
        format: 'Advanced Quantitative/Reasoning + 2 Hands-on Coding Problems',
        tips: 'Coding questions test C/C++/Java/Python basics (Arrays, Loops, String Operations, Pattern Printing, Matrix Traversal).'
      },
      {
        round_number: 3,
        title: 'Technical Interview',
        duration: '30 - 45 Mins',
        format: 'Core Programming, OOPs, DBMS SQL Queries, and Resume Projects',
        tips: 'Explain your final year project thoroughly. Expect SQL queries (JOINs, GROUP BY, HAVING), C pointers/memory management, and basic OOP principles.'
      },
      {
        round_number: 4,
        title: 'Managerial & HR Interview',
        duration: '20 Mins',
        format: 'Behavioral Questions, Willingness to Relocate, Shift Flexibility',
        tips: 'Show high enthusiasm, flexibility to work in any technology stack, shift timings, and relocation to TCS campus locations.'
      }
    ],
    priorities: [
      { category: 'Quantitative & Logical Aptitude', score: 5, stars: '★★★★★', detail: 'Foundation & Advanced TCS NQT Aptitude Sections' },
      { category: 'Programming & SQL Basics', score: 3, stars: '★★★☆☆', detail: 'Basic Syntax, Array/String Manipulation, SQL JOINs' },
      { category: 'Core CS Fundamentals', score: 3, stars: '★★★☆☆', detail: 'OOPs Concepts, DBMS, SDLC Life Cycle' },
      { category: 'Advanced DSA & Graph Theory', score: 2, stars: '★★☆☆☆', detail: 'Basic arrays/strings are sufficient for most roles' }
    ],
    key_topics: [
      'TCS NQT Numerical & Verbal Aptitude Patterns',
      'C / C++ / Java / Python Programming Fundamentals',
      'DBMS SQL Queries (JOINs, Aggregate Functions, Indexing)',
      'Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism)',
      'Final Year Project Architecture & Technology Stack',
      'Communication & Professional HR Etiquette'
    ],
    courses: [
      { name: 'TCS NQT Preparation Masterclass', platform: 'IndiaBIX', type: 'Free', url: 'https://www.indiabix.com/' },
      { name: 'PrepInsta TCS NQT Coding & Aptitude Suite', platform: 'PrepInsta', type: 'Freemium', url: 'https://prepinsta.com/' },
      { name: 'GeeksforGeeks TCS Interview Questions', platform: 'GeeksforGeeks', type: 'Free', url: 'https://www.geeksforgeeks.org/tcs-interview-experience/' }
    ]
  },

  infosys: {
    company_name: 'Infosys',
    tagline: 'InfyTQ Assessment, HackWithInfy & Tech Aptitude',
    difficulty: 'Moderate to Hard (InfyTQ / Specialist Programmer Track)',
    rounds: [
      {
        round_number: 1,
        title: 'Online Aptitude & Logical Assessment',
        duration: '100 Mins',
        format: 'Mathematical Ability, Reasoning, Verbal, & Pseudo-code Analysis',
        tips: 'Focus on Data Interpretation, Logical Sequences, Puzzles, and Debugging Pseudo-code snippets for output prediction.'
      },
      {
        round_number: 2,
        title: 'Coding Assessment (Specialist / HackWithInfy Track)',
        duration: '180 Mins',
        format: '3 Algorithmic Coding Problems (Easy, Medium, Hard)',
        tips: 'For System Engineer Specialist (SES) or Power Programmer (PP) roles, prepare Greedy, Dynamic Programming, and Graph algorithms.'
      },
      {
        round_number: 3,
        title: 'Technical Interview',
        duration: '30 - 45 Mins',
        format: 'Programming Concepts, Database SQL, Web Development & Resume Projects',
        tips: 'Be prepared to write code snippets for String Reversal, Palindrome Check, Fibonacci, SQL JOINs, and explain your web project architecture.'
      },
      {
        round_number: 4,
        title: 'HR & Management Discussion',
        duration: '15 - 20 Mins',
        format: 'Career Goals, Shift Flexibility, Learning Willingness',
        tips: 'Demonstrate adaptability to Infosys training programs (Mysore Campus) and commitment to client projects.'
      }
    ],
    priorities: [
      { category: 'Aptitude & Pseudo-code Debugging', score: 4, stars: '★★★★☆', detail: 'InfyTQ Reasoning, Quant, Pseudo-code Analysis' },
      { category: 'Programming & Data Structures', score: 3, stars: '★★★☆☆', detail: 'Array/String Problems, OOPs Principles' },
      { category: 'DBMS & Web Technologies', score: 3, stars: '★★★☆☆', detail: 'SQL Queries, HTML/CSS/JS, Database Normalization' },
      { category: 'Communication & Interpersonal', score: 3, stars: '★★★☆☆', detail: 'Professional Verbal & Written Communication' }
    ],
    key_topics: [
      'InfyTQ Aptitude & Pseudo-code Prediction Questions',
      'Python / Java Programming Fundamentals & OOP',
      'DBMS SQL Queries, Normalization & Primary/Foreign Keys',
      'Basic Data Structures (Arrays, LinkedLists, Stacks, Queues)',
      'HackWithInfy Coding Questions (for Specialist Roles)',
      'Infosys Corporate Values & Service Excellence'
    ],
    courses: [
      { name: 'Infosys InfyTQ & HackWithInfy Prep Guide', platform: 'PrepInsta', type: 'Freemium', url: 'https://prepinsta.com/' },
      { name: 'SQL Query Practice & DBMS Tutorials', platform: 'W3Schools', type: 'Free', url: 'https://www.w3schools.com/sql/' },
      { name: 'GeeksforGeeks Infosys Interview Experiences', platform: 'GeeksforGeeks', type: 'Free', url: 'https://www.geeksforgeeks.org/' }
    ]
  },

  accenture: {
    company_name: 'Accenture',
    tagline: 'Cognitive & Technical Assessment + Communication Mastery',
    difficulty: 'Moderate (Cognitive + Technical + Communication)',
    rounds: [
      {
        round_number: 1,
        title: 'Cognitive & Technical Assessment',
        duration: '90 Mins',
        format: 'Analytical Reasoning, Numerical Ability, English, Pseudo-Code, Networking & Cloud Basics',
        tips: 'Elimination round! Practice pseudo-code output evaluation, basic MS Office/Cloud concepts, and quantitative reasoning.'
      },
      {
        round_number: 2,
        title: 'Coding Assessment',
        duration: '45 Mins',
        format: '2 Hands-on Coding Questions (Fundamental to Intermediate Level)',
        tips: 'Questions test basic loops, arrays, string manipulations, and conditional logic. Make sure all test cases execute properly.'
      },
      {
        round_number: 3,
        title: 'Interactive Communication Assessment',
        duration: '20 Mins',
        format: 'Automated AI Voice Assessment: Reading, Listening, Repeat Sentences & Story Retelling',
        tips: 'Sit in a quiet room with a clear microphone. Speak clearly, at a steady pace, and maintain good pronunciation and grammar.'
      },
      {
        round_number: 4,
        title: 'Technical & HR Discussion',
        duration: '20 - 30 Mins',
        format: 'Combined Technical & Behavioral Interview',
        tips: 'Discuss your resume projects, cloud/tech certifications, teamwork, and client scenario problem-solving.'
      }
    ],
    priorities: [
      { category: 'Cognitive & Aptitude Reasoning', score: 4, stars: '★★★★☆', detail: 'Analytical Ability, Verbal English, Logical Patterns' },
      { category: 'Communication & Pronunciation', score: 4, stars: '★★★★☆', detail: 'AI Voice Assessment: Speaking & Listening' },
      { category: 'Technical & Cloud Fundamentals', score: 3, stars: '★★★☆☆', detail: 'Pseudo-code, Networking, Web Basics, Security' },
      { category: 'Hands-on Coding', score: 3, stars: '★★★☆☆', detail: '2 Basic-to-Intermediate Array/String Problems' }
    ],
    key_topics: [
      'Accenture Cognitive & Technical Test Question Patterns',
      'Pseudo-code Trace & Logic Analysis',
      'AI Communication Assessment Practice (Reading & Retelling)',
      'Fundamentals of Cloud, MS Office & Computer Networks',
      'C / C++ / Java / Python Coding Basics',
      'Project Walkthrough & Client Behavioral Scenarios'
    ],
    courses: [
      { name: 'Accenture Placement Test Practice Series', platform: 'IndiaBIX', type: 'Free', url: 'https://www.indiabix.com/' },
      { name: 'Accenture Communication Test Guide', platform: 'PrepInsta', type: 'Freemium', url: 'https://prepinsta.com/' },
      { name: 'Accenture Coding Questions Collection', platform: 'GeeksforGeeks', type: 'Free', url: 'https://www.geeksforgeeks.org/' }
    ]
  },

  wipro: {
    company_name: 'Wipro',
    tagline: 'NLTH Elite NTH & Talent Hunt Assessment',
    difficulty: 'Moderate (Aptitude + Essay Writing + Programming)',
    rounds: [
      {
        round_number: 1,
        title: 'Aptitude & Verbal Online Test',
        duration: '48 Mins',
        format: 'Logical Ability, Quantitative Ability, and Verbal Ability',
        tips: 'Practice speed math, time & work, data sufficiency, error detection, and vocabulary.'
      },
      {
        round_number: 2,
        title: 'Written Communication (Essay Test)',
        duration: '20 Mins',
        format: 'Online Essay Writing on Current Technological or Social Topics',
        tips: 'Maintain proper paragraph structure (Intro, Body, Conclusion). Avoid grammatical errors and spell check mistakes.'
      },
      {
        round_number: 3,
        title: 'Online Coding Test',
        duration: '60 Mins',
        format: '2 Basic to Intermediate Coding Questions',
        tips: 'Questions test basic DSA (Arrays, Strings, Matrices, Sorting). Ensure code handles edge cases (e.g., negative numbers, empty arrays).'
      },
      {
        round_number: 4,
        title: 'Technical & HR Interview',
        duration: '20 - 30 Mins',
        format: 'Core CS Concepts, OOPs, DBMS, Operating Systems, and HR Discussion',
        tips: 'Revise C/Java basics, OOP principles, SQL queries, and be confident when explaining your academic projects.'
      }
    ],
    priorities: [
      { category: 'Aptitude & Logical Ability', score: 4, stars: '★★★★☆', detail: 'Quantitative, Reasoning, Verbal Aptitude' },
      { category: 'Written Communication & Essay', score: 4, stars: '★★★★☆', detail: 'Grammar, Essay Structure, Vocabulary' },
      { category: 'Programming Fundamentals', score: 3, stars: '★★★☆☆', detail: '2 Hands-on Coding Problems (Arrays/Strings)' },
      { category: 'CS Fundamentals & DBMS', score: 3, stars: '★★★☆☆', detail: 'OOPs, DBMS SQL, OS Basics' }
    ],
    key_topics: [
      'Wipro NLTH Aptitude & Verbal Test Syllabus',
      'Written Communication & Essay Writing Guidelines',
      'Hands-on Coding (Arrays, Strings, Palindromes, Fibonacci)',
      'Object-Oriented Programming (Classes, Objects, Inheritance)',
      'DBMS Basics & SQL Queries',
      'HR Behavioral Questions & Project Discussion'
    ],
    courses: [
      { name: 'Wipro Elite NTH Exam Preparation', platform: 'PrepInsta', type: 'Freemium', url: 'https://prepinsta.com/' },
      { name: 'Quantitative Aptitude & Logical Reasoning', platform: 'IndiaBIX', type: 'Free', url: 'https://www.indiabix.com/' },
      { name: 'Wipro Interview Experiences & Questions', platform: 'GeeksforGeeks', type: 'Free', url: 'https://www.geeksforgeeks.org/' }
    ]
  }
};
