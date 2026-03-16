import OpenAI from 'openai';

const CV_CONTEXT = `
MARTIN MAJIDI — Software Engineer & AI Engineer
Location: Oslo, Norway
Email: martinmajidi@yahoo.com
Phone: +47 463 76 549
LinkedIn: linkedin.com/in/martinmajidi
GitHub: github.com/MMajidi1988
Google Scholar: scholar.google.com/citations?user=sMXc-hYAAAAJ
Website: majidi.no

SUMMARY
Software Engineer with 5+ years of experience building production AI systems, backend services, and optimization algorithms. Work spans conversational AI with RAG architectures, computer vision for sports video processing, and large-scale API development.

Holds a Master's degree in Applied Computer and Information Technology with an AI specialization from Oslo Metropolitan University. Thesis on AI-based sports video cropping earned the top grade and produced peer-reviewed publications at IEEE and ACM conferences.

Background bridges Computer Science, Industrial Engineering, and Artificial Intelligence — connecting technical implementation with real-world problem solving.

EDUCATION
- MSc Applied Computer and Information Technology (AI specialization) — Oslo Metropolitan University (OsloMet)
- MSc Industrial Engineering (focus on optimization algorithms)
- Bachelor of Computer Science

EXPERIENCE
1. Software Engineer — Allente AS, Oslo (Aug 2024 – Mar 2026)
   - Built full-stack HR Chatbot with RAG architecture using Spring Boot, OpenAI GPT-4o, and PostgreSQL vector search (pgvector), serving employees across 4 Nordic countries
   - Maintained partner integration system processing subscription data across 6+ streaming platforms including Amazon Prime, Viaplay, and TV2
   - Extended API gateway with endpoints for Boost.ai chatbot and voice bot integration for customer service automation
   - Implemented GraphQL and REST APIs across microservices for customer data retrieval

2. AI & ML Developer — Forzasys / SimulaMet, Oslo (Jun 2023 – Jun 2024)
   - Built end-to-end SmartCrop system for automatic sports video cropping with focal point detection and social media distribution API
   - Developed Flask-based GUI for real-time video processing with interpolation and outlier configuration controls
   - Fine-tuned YOLO v8, v9, and RT-DETR models for real-time object detection achieving production-ready accuracy
   - Designed video processing pipeline for automatic reformatting to platform-specific aspect ratios

3. Optimization Developer — Espad Company, Iran (2017 – 2021)
   - Designed metaheuristic optimization algorithms in MATLAB for emergency response routing in earthquake scenarios
   - Built mathematical models for logistics and resource allocation

PROJECTS
1. HR Chatbot — RAG Architecture (Conversational AI)
   Production chatbot serving 4 Nordic countries. Spring Boot + GPT-4o + pgvector for semantic search over HR documents via SharePoint/Microsoft Graph API. Admin panel for document management.
   Tech: Java, Spring Boot, GPT-4o, pgvector, RAG

2. Partner Platform (Integration)
   Subscription data sync across 6+ streaming platforms — Amazon Prime, Viaplay, TV2 Play — handling user provisioning, entitlements, and real-time status.
   Tech: Java, REST APIs, Microservices, Docker

3. API Gateway & Chatbot Integration
   Extended API gateway with new endpoints for Boost.ai chatbot and voice bot integration. Implemented GraphQL and REST APIs across microservices.
   Tech: Java, GraphQL, REST APIs, Boost.ai, Microservices

4. Emergency Response Routing (Optimization)
   Metaheuristic optimization for routing emergency responders in earthquake scenarios. Mathematical models balancing response time, resource allocation, and coverage.
   Tech: MATLAB, Optimization, Operations Research

5. SmartCrop — AI-Based Sports Video Cropping (Computer Vision, Featured Project)
   End-to-end system for automatic cropping of sports videos (soccer and ice hockey) for social media. Fine-tuned YOLOv8/v9 and RT-DETR for real-time focal point detection. Built a Flask GUI with interpolation, outlier controls, and platform-specific aspect ratios. Resulted in 6 publications, 80+ citations, and a Best Paper Award nomination at ACM MMSys 2024.
   Tech: Python, Flask, YOLOv8/v9, RT-DETR, OpenCV

PUBLICATIONS (6 papers, 80+ citations, h-index 5, i10-index 4)
1. "AI-based sports highlight generation for social media" — Mile-High Video Conf., 2024 (29 citations)
2. "Soccer on social media" — arXiv preprint, 2023 (18 citations)
3. "AI-based cropping of soccer videos for different social media representations" — Int. Conf. Multimedia Modeling, 2024 (15 citations)
4. "SmartCrop: AI-based cropping of soccer videos" — IEEE ISM, 2023 (10 citations)
5. "SmartCrop-H: AI-Based Cropping of Ice Hockey Videos" — ACM MMSys, 2024 (5 citations, Best Paper Nominee)
6. "Bi-objective optimization of basic and extended warranty policies regarding preventive maintenance and burn-in policies: Weibull bathtub-shaped failure rate" — Life Cycle Reliability, 2020 (3 citations)

TECH STACK
- Languages: Java, Python, SQL, MATLAB
- Frameworks & Tools: Spring Boot, Flask, REST APIs & GraphQL, PostgreSQL & pgvector, Docker
- AI/ML: RAG Architecture, YOLO (v8, v9) & RT-DETR, Vector Search, Computer Vision, OpenAI API
- Cloud & DevOps: AWS (certified), Azure, CI/CD Pipelines, Microservices, Git
- Architecture: Microservices Design, API Gateway Patterns, Event-Driven Systems, System Integration
- Practices: Agile / Scrum, Code Review, Technical Writing, Research & Publication

CERTIFICATION: AWS Technical Essentials
LANGUAGES: English, Norwegian (basic), Persian
RESEARCH: 6 papers, 80+ citations, h-index 5

Currently exploring new opportunities in software engineering and AI.
`;

const SYSTEM_PROMPT = `You are Martin's AI assistant on his personal portfolio website (majidi.no). You answer questions about Martin Majidi based on his CV and professional background.

Rules:
- LANGUAGE: Always respond in the same language the user writes in. If the user writes in Norwegian (norsk), respond entirely in Norwegian. If the user writes in English, respond in English. This is mandatory.
- Only answer questions related to Martin's professional background, skills, experience, education, projects, publications, and contact info.
- Be conversational, friendly, and professional.
- If asked something not covered in the CV, politely say you don't have that information and suggest contacting Martin directly.
- Keep answers concise but informative (2-4 sentences typically).
- You can mention that this chatbot itself is a live demo of Martin's RAG chatbot expertise.
- Do not make up information not present in the CV.
- When listing items, use short bullet points.
- If asked "who are you" or similar, explain you are an AI assistant built to answer questions about Martin, powered by RAG (Retrieval-Augmented Generation) and GPT-4o-mini.

Martin's CV data:
${CV_CONTEXT}`;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, preferredLanguage } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const langHint = preferredLanguage === 'no'
    ? 'CRITICAL: The user\'s interface is in Norwegian. You MUST respond entirely in Norwegian (norsk).'
    : '';

  const systemContent = langHint
    ? `${SYSTEM_PROMPT}\n\n${langHint}`
    : SYSTEM_PROMPT;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        ...messages.slice(-10),
      ],
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Something went wrong. Please try again.' })}\n\n`
    );
    res.end();
  }
}
