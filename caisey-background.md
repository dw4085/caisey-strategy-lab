# CAiSEY: Comprehensive Background Summary

## What is CAiSEY?

**CAiSEY** stands for **Classroom Artificial Intelligence Studio for Engaging You**. It is an AI-powered, voice-based discussion platform created by **Dan Wang** (Lambert Family Professor of Social Enterprise at Columbia Business School) alongside CBS alumni **Jill Cohen** (MBA '20, Technical Lead) and **Johnny Lee** (MBA '23).

CAiSEY engages students in real-time, adaptive voice-to-voice (or text-to-text) conversations with an AI discussion partner about class topics. Its purpose is to deepen student preparation for in-class case discussions by challenging their arguments, presenting counterpoints, and pushing critical thinking — rather than providing easy answers.

The name pays tribute to Prof. Casey Ichniowski, a former faculty chair of the Management Division at CBS, whose spirit of fostering interaction among colleagues lives on through CAiSEY's mission of engaging students in immersive discussion.

---

## Origin Story and Timeline

| Date | Milestone |
|------|-----------|
| **Fall 2022** | ChatGPT launches; Wang observes students using AI to summarize case studies instead of preparing independently, making class discussions shallower |
| **Spring 2023** | Wang runs an experiment tracking AI usage in his Technology Strategy class (~2,200 homework assignments). Finds AI adoption lower than expected; students who used AI still submitted assignments; AI helped ESL students write more clearly |
| **Fall 2023** | Wang takes a risk and creates a text-based "debate chatbot" prototype for his class. Students averaged 8 conversational turns (vs. 5 required) and 500 words per debate. A meaningful proportion of students changed their position after debating the AI |
| **Summer-Fall 2024** | Wang's sabbatical. Teams up with Jill Cohen to build CAiSEY into a full voice-AI platform |
| **Spring 2025** | Full pilot in Wang's Technology Strategy course at CBS: 1,306 conversations across 275 students (76% MBA, 24% EMBA). Average voice conversation: 14 minutes. Feedback: 76% positive sentiment, 4% negative, 20% neutral/mixed |
| **Fall 2025** | CAiSEY expands to UVA Darden's core Strategy course (359 first-year students, 5 sections, 5 of 14 cases). Partnership with Columbia |
| **Spring 2026 (current)** | Used in 20+ courses at CBS (most EMBA, MBA, MS students), 40+ classes across 20+ universities. 3 FTEs plus Wang. Internal venture within CBS with option to spin out |

---

## How CAiSEY Works

### For Students
1. Log in at **caisey.me** (passwordless, email-based one-time codes via WorkOS)
2. Select a CAiSEY assignment from a dropdown menu
3. Choose conversation mode: **Voice** or **Text**
4. For **structured debate** (multiple choice) questions: pick a position, then CAiSEY argues an alternate position in back-and-forth discussion
5. For **open-ended discussion/brainstorming** questions: start from a prompt, CAiSEY helps explore ideas
6. CAiSEY engages for at least 3 conversational turns, then asks if the student wants to continue (additional 3 turns per continuation)
7. Student can end anytime; CAiSEY summarizes the conversation
8. Click "End Discussion & Submit" — student provides reflections, then receives AI-generated feedback on strengths and areas for improvement
9. Processing time: ~2 seconds per 1 minute of conversation
10. Students can view past transcripts and feedback from their homepage

### For Instructors
1. Log in to the **Instructor Dashboard** at caisey.me
2. View registered students and their submissions
3. For each assignment: see submission counts, conversation transcripts, student positions, CAiSEY positions, timestamps, format (voice/text), feedback summaries
4. For multiple-choice questions: see a summary graph of position breakdowns across the class
5. Export all submission data as .csv (includes names, emails, section, date, format, positions, feedback, transcripts)
6. Switch to "Student View" to test assignments as a student
7. Instructors **cannot yet** create their own assignments, customize CAiSEY's tone/style, or manually add students

### Question Types
- **Structured debate (multiple choice + discussion)**: Students choose a position up front, then CAiSEY engages them from an alternate position
- **Open-ended discussion / brainstorming**: Students start from a prompt with no fixed choices; CAiSEY helps them explore
- **Role play scenarios**: Also supported for instructors who want to approximate custom scenarios

---

## Underlying Technology

- **Voice conversations**: OpenAI's `gpt-realtime-08-05-2025` (a purely voice-trained model via the Realtime API)
- **Other tasks** (summaries, feedback, text conversations): GPT-5
- **Voice randomization**: Random assignment between female voice (OpenAI 'Coral') and male voice (OpenAI 'Verse')
- **Time limit**: ~60 minutes per voice conversation
- **Architecture**: Closed-loop enterprise API access — no data sent to OpenAI for model training (zero data retention)
- **Authentication**: WorkOS (encrypted cookies, one-time email codes, no passwords)
- **Tech stack includes**: Error logging, LLM integration, cloud/data infrastructure, deployment/codebase management, and administrative/project management tools (as shown in slides)

---

## Key Differentiators vs. Generic AI Chatbots (ChatGPT, Claude, etc.)

1. **Pedagogy**: System instructions developed through years of exhaustive iteration, user testing, research, and Dan Wang's 13 years of discussion-based teaching experience
2. **Instructor visibility**: Full transparency via the instructor dashboard — transcripts, timestamps, position tracking, CSV exports
3. **Voice access at scale**: Enterprise-level API access makes voice conversations available without individual paid subscriptions or interaction limits
4. **IP/Data protection**: Closed-loop architecture ensures no voice or text data is used by external LLM providers for training
5. **Anti-shortcutting by design**: Voice-to-voice format forces students to listen and articulate thoughts deliberately — cannot copy-paste AI answers
6. **Tailored feedback**: Post-conversation summaries and improvement suggestions specific to the student's arguments

---

## Pedagogical Philosophy

### The Problem CAiSEY Solves
- Post-2022, students use AI to shortcut homework (summarize cases, generate opinions without reading)
- Bans are unenforceable and deprive students of AI skills
- AI plagiarism detection technology is unreliable
- Class discussions become shallower when students arrive with generic AI-generated opinions
- At UVA Darden, almost two-thirds of a class got the same wrong answer on a quiz — the answer ChatGPT gave

### The Solution
- **Slow students down** rather than speed them up (opposite of most AI tools)
- Force active engagement through voice-based argumentation
- Personalized, adaptive conversations — each one is "entirely novel, entirely generative"
- Rooted in the **Oxbridge tutorship model** (deep, 1-on-1 intellectual exchange) — previously impossible to scale
- Informed by cognitive science: learning requires active engagement; shortcutting leads to mental atrophy (per Stanford's Hari Subramonyam)
- CAiSEY creates a **virtuous cycle**: immersive interaction outside class leads to greater confidence and motivation inside class

### Use Cases
- **Pre-class assignment**: Read material, then debate with CAiSEY to deepen critical thinking before class
- **Post-class debrief**: Reinforce concepts from a class session, explore clarifying questions
- **In-class activity**: 5-minute individual breakout to sharpen thoughts before group discussion

### Research Findings
- Students who used CAiSEY for 2 sessions were **18% more likely to become more comfortable participating in class** than students who used it less (Fall 2025, 760 students)
- Voice-based conversations exhibited **greater semantic diversity** than text-based (measures: associative flexibility, divergent thinking, contextual variation)
- Voice conversations were more verbose and contained more frequent repetition, but also more divergent ideation
- Connects to Walter Ong's *Orality and Literacy* (1982): "Writing restructures consciousness" — different media produce qualitatively different cognition

### Value of Discussions by Partner Type and Medium
| | Human | AI |
|---|---|---|
| **Voice** | Intentional, relational, reserved | Adaptive, generative, meandering |
| **Text** | Deliberative, efficient, contrived | Efficient, casual, shallow |

---

## Adoption and Scale

- **Columbia Business School**: 20+ courses, most EMBA/MBA/MS students
- **External universities**: 40+ classes across 20+ universities (mostly business schools)
- **Named partner schools**: UC Berkeley (Haas), University of Pennsylvania (Wharton), University of Virginia (Darden), and others
- **Disciplines**: Strategy, Leadership, Finance, Ethics, Accounting, Economics, Marketing, Medicine, Engineering, Law
- **Student feedback highlights**:
  - 30.1% specifically praised enhanced critical thinking and argumentation
  - 26.9% praised preparation for class discussion
  - 23.4% praised the engaging and interactive experience
  - 10.6% praised quality feedback and summaries
  - 9.3% praised exposure to different perspectives

---

## Data Privacy, Security, and Compliance

- **No audio data saved**; only transcripts and student data stored on encrypted cloud databases
- **Enterprise API agreements** with OpenAI: zero data retention, no model training on user inputs
- **Database compliance**: ISO 27001:2022 & SOC 2 Type 2 compliant
- **All traffic**: HTTPS encrypted
- **Authentication**: WorkOS with encrypted cookies and one-time login codes
- **FERPA compliance**: Data owned by institutions; instructors can delete student/assignment data; no third-party disclosure; 24-hour breach notification commitment
- **No passwords** stored — login via emailed one-time codes only

---

## Business and Strategy Context (Session 19 Exercise)

The Spring 2026 class session asks students to think about **CAiSEY's own technology strategy**, including:

1. **Intellectual property strategy**: How to protect CAiSEY's pedagogical innovations and system design
2. **Funding approach**: VC vs. non-VC vs. bootstrap
3. **Partnership strategy**: Options include publishers, AI labs, larger ed-tech platforms, or staying within Columbia
4. **Market strategy**: Business schools vs. broader universities vs. K-12 vs. corporate learning
5. **Pricing strategy**: Institutional licenses vs. individual courses vs. student-led pricing
6. **Innovation strategy**: Find other applications for voice AI vs. facilitate additional modes of interaction

### Current Business Status
- Internal venture within Columbia Business School with **option to be spun out**
- Currently 3 FTEs + Dan Wang, with more to be added
- Pricing is semester-by-semester, scaling based on number of courses, students, and assignments
- Support contacts: support@caisey.me (technical bugs), info@caisey.me (general inquiries)

---

## Media Coverage

- **Columbia Business School** (Oct 2025): "How AI Is Changing the Way Students Learn" — profiles CAiSEY as a platform engaging 3,000 students at 10 business schools
- **The Washington Post** (Apr 2026): "ChatGPT fed his students easy answers, so he built an app to argue with them" — profiles CAiSEY alongside similar faculty-designed AI tools at Georgia Tech and Arizona State
- **UVA Darden Report Online** (Nov 2025): "UVA Darden Goes 'All-In' on Use of Generative AI in Core Strategy Course" — details Darden's partnership with Columbia to pilot CAiSEY in all 5 sections of the core Strategy course

---

## Key Quotes

> "A lot of AI tools in education are designed to make things more efficient. Caisey capitalizes on precisely the opposite: the capacity to slow students down, to actually make them focus and to also make them consider very different ways of thinking about questions." — **Dan Wang**

> "When a person has a conversation with an AI partner by voice, that's a personalized discussion — that's really different from having a conversation with 50, 60, or 70 people. That discussion that you have with the AI, it's the first time that that discussion has ever occurred. That's entirely novel, entirely generative." — **Dan Wang**

> "I don't ever remember loving homework. What kid says they love homework?" — **Jill Cohen**, Co-Founder

> "It's not a substitute for the really rich interaction that we have in class in the discussion. But it's helpful in preparing them to have more confidence in class, and to present a more articulate, well-structured argument." — **Rahul Bhandari**, UVA Darden

> "I really loved using CAISEY. It gave me a new way to think through the case and challenged me to verbalize my thoughts rather than write them." — **CBS Student**

> "I am a former high school, special education teacher, and I am sooooo obsessed with CAiSEY as an instructional tool. It has alleviated so much anxiety for me to be able to practice and test my understanding prior to class." — **CBS Student, Spring 2026**
