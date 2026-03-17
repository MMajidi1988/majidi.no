import OpenAI from 'openai';

const CV_CONTEXT = `
MARTIN MAJIDI — Software Engineer & AI Engineer
Location: Oslo, Norway
Email: martinmajidi@yahoo.com | Phone: +47 46376549
LinkedIn: linkedin.com/in/martinmajidi | GitHub: github.com/MMajidi1988
Google Scholar: scholar.google.com/citations?user=sMXc-hYAAAAJ
Website: majidi.no

SUMMARY
Software Engineer with 5+ years of experience in algorithm development, AI systems, and API development. Expertise in conversational AI (RAG architectures, chatbot development), computer vision (object detection, video processing), and optimization algorithms. Background spanning Computer Science, Industrial Engineering, and AI enables bridging technical implementation with business optimization.

TECHNICAL SKILLS
- Languages: Java, Python, MATLAB, SQL
- Frameworks & Tools: Spring Boot, REST APIs, GraphQL, PostgreSQL, pgvector, Docker
- AI/ML: RAG Architecture, YOLO (v8, v9), RT-DETR, Computer Vision, Vector Search
- Cloud & DevOps: AWS (Technical Essentials certified), CI/CD, Microservices Architecture

WORK EXPERIENCE
1. Software Engineer — Allente AS, Oslo (Aug 2024 – Present)
   Nordic telecommunications company providing streaming and TV services
   - Built full-stack HR Chatbot with RAG architecture using Spring Boot, OpenAI GPT-4o, and PostgreSQL vector search, featuring admin panel for document management across 4 Nordic countries
   - Maintained partner integration system processing subscription data and user synchronization across 6+ streaming platforms including Amazon Prime, Viaplay, and TV2 Norway
   - Extended API gateway with new endpoints for Boost.ai chatbot and voice bot integration, configuring API connectors for customer service automation
   - Implemented GraphQL and REST APIs across microservices for customer data retrieval

2. AI & ML Developer — Forzasys/SimulaMet, Oslo (Jun 2023 – Jun 2024)
   Sports technology company specializing in AI-powered video analysis
   - Built end-to-end SmartCrop system for automatic sports video cropping (soccer, ice hockey) with focal point detection and API integration for social media distribution
   - Developed and fine-tuned computer vision models (YOLO v8, v9, RT-DETR) for real-time object detection, achieving production-ready accuracy through hyperparameter optimization
   - Designed processing pipeline handling video content for automatic reformatting to platform-specific aspect ratios

3. Optimization Developer — Espad Company, Iran (2017 – 2021)
   Engineering consultancy specializing in operations research and optimization solutions
   - Designed and implemented metaheuristic optimization algorithms in MATLAB for emergency response routing in earthquake scenarios
   - Built mathematical models for real-world logistics and resource allocation problems, translating complex constraints into computational solutions

EDUCATION
1. Master of Science in Applied Computer and Information Technology — Oslo Metropolitan University (OsloMet), Norway
   Specialization in Artificial Intelligence (2022–2024)
   Thesis (Grade A): SmartCrop: AI-Based Cropping of Sports Videos — Resulted in 2 peer-reviewed publications at IEEE ISM 2023 and ACM MMSys 2024

2. Master of Industrial Engineering — Azad University Najafabad, Iran (2014–2017)
   Focus on optimization algorithms and mathematical modeling

3. Bachelor of Computer Science — Sheikh Bahaei University, Iran (2008–2012)

ACADEMIC TRANSCRIPT (MSc at OsloMet — 120 credits total)
- ACIT4100 Understanding and Communicating Research (2022 autumn, 10 credits) — Grade B
- ACIT4310 Applied and Computational Mathematics (2022 autumn, 10 credits) — Grade A
- ACIT4321 Quantum Information Technology (2022 autumn, 10 credits) — Grade C
- ACIT4200 Interdisciplinary Innovation: using diversity to solve complex problems (2023 spring, 10 credits) — Grade A
- ACIT4330 Mathematical Analysis (2023 spring, 10 credits) — Grade A
- ACIT5910 Master's Thesis, Phase 1 (2023 spring, 10 credits) — Pass
- ACIT4510 Statistical Learning (2023 autumn, 10 credits) — Grade A
- ACIT5920 Master's Thesis, Phase 2 (2023 autumn, 20 credits) — Pass
- ACIT5930 Master's Thesis, Phase 3: SmartCrop: AI-Based Cropping of Sports Videos (2024 spring, 30 credits) — Grade A

PUBLICATIONS (6 peer-reviewed papers, 83 citations, h-index 5)
1. "AI-based sports highlight generation for social media" — 3rd Mile-High Video Conference, 2024 (29 citations)
2. "Soccer on social media" — arXiv preprint, 2023 (18 citations)
3. "AI-based cropping of soccer videos for different social media representations" — Int. Conf. Multimedia Modeling, 2024 (15 citations)
4. "SmartCrop: AI-based cropping of soccer videos" — IEEE ISM, 2023 (12 citations)
5. "SmartCrop-H: AI-Based Cropping of Ice Hockey Videos" — ACM MMSys, 2024 (6 citations, Best Paper Nominee)
6. "Bi-objective optimization of warranty policies" — Life Cycle Reliability and Safety Engineering, 2020 (3 citations)

CERTIFICATION: AWS Technical Essentials — Amazon Web Services
LANGUAGES: English (Fluent), Norwegian (Elementary), Persian (Native)
Currently exploring new opportunities in software engineering and AI.

===== PAPER 1: SmartCrop — AI-Based Cropping of Soccer Videos (IEEE ISM 2023) =====

Overview: As media consumption expanded to social media and mobile devices, video content originally filmed in 16:9 must be adapted to formats like 1:1 (Instagram) and 9:16 (TikTok/Reels). For dynamic sports like soccer, traditional manual cropping is too slow for real-time publishing. SmartCrop is an automated end-to-end pipeline for intelligently cropping soccer highlight videos for social media by tracking the ball as the main Point of Interest (POI).

Pipeline Architecture (7 modules):
1. Pre-Processing: Accepts HLS streaming input, selects lowest-quality stream, converts to H.264/MP4, loads AI models.
2. Scene Detection: Uses TransNetV2 to segment video into scenes for scene-aware cropping decisions.
3. Object Detection: Fine-tuned YOLOv8 Medium model (Y8_sc11) trained on 1,500 images from Norwegian Eliteserien, Swedish Allsvenskan, and Superettan leagues. Achieves 82% true positive rate for ball detection and 99% for players/logos — significantly outperforming generic YOLOv8-Medium (61% ball TP).
4. Outlier Detection: Removes anomalous ball position detections using Average, Z-Score, and IQR methods. IQR achieved best RMSE (120.20) and was selected.
5. Interpolation: Estimates ball positions in undetected frames. Four methods tested — Linear, Polynomial, Ease-in-out (Sigmoid), and Heuristic. The Heuristic method (dynamic speed factor based on angle between consecutive ball position vectors) achieved best RMSE (137.56).
6. Cropping: Uses ffmpeg to crop each frame to target aspect ratio, centering on the ball position.
7. Post-Processing: Assembles cropped frames into output MP4 with visualization data.

Objective Evaluation: Custom Y8_sc11 model achieved 82% ball TP rate vs 61% baseline. IQR outlier detection outperformed Average (RMSE 150.74) and Z-Score (RMSE 120.82). Heuristic interpolation outperformed Linear (163.33), Polynomial (167.82), and Ease-in-out (172.72). Using Skip Frame parameter (set to 13) reduced object detection time from 51.3s to 15s with no significant quality impact.

Subjective Evaluation: Crowdsourced user study with 23 participants rating six cropping types on QoE, smoothness, and content capture (5-point ACR scale). Full SmartCrop pipeline (type 6) significantly outperformed all others, especially in 9:16 where static cropping was entirely inadequate. Users prioritize content visibility (4.03/5) over quality and smoothness (3.80/5).

Conclusion: Combining fine-tuned YOLOv8 with IQR outlier detection and Heuristic interpolation produces a robust, production-ready pipeline for soccer video cropping. Future directions: semantic segmentation, adaptive zoom, motion suppression, and extension to other sports.

===== PAPER 2: SmartCrop-H — AI-Based Cropping of Ice Hockey Videos (ACM MMSys 2024, Best Paper Nominee) =====

Overview: Building on the SmartCrop soccer pipeline, SmartCrop-H adapts the system for ice hockey. Hockey presents harder challenges: the puck is much smaller and faster, white ice causes color contrast issues, frame rate is higher (50fps vs 25fps), and important events can occur away from the puck (e.g., player huddles).

Key Differences from Soccer:
- Game pace: Hockey is faster, requiring a new smoothing module to prevent abrupt crop window jumps.
- Shot types: Hockey broadcasts use more close-up and medium shots vs soccer's wide shots.
- Color contrast: Dark puck on white ice with other black markings makes detection far harder than a soccer ball on green grass.
- Regions of interest: Important hockey actions can occur away from the puck, unlike soccer where the ball is almost always the center of action.
- Broadcast properties: Hockey videos are typically 50fps at 1920px resolution vs 25fps at 1280px for soccer.

Pipeline Architecture (7 modules, updated from SmartCrop):
1. Pre-Processing: Unchanged — selects lowest-quality HLS stream, converts to H.264/MP4.
2. Scene Detection: Adds SceneDetect alongside TransNetV2 for hockey-specific brightness/pixel characteristics. Exhaustive grid search raised F1 score from 57% (default) to 72% across five annotated hockey videos (~30,000 frames).
3. Object Detection: New custom YOLO model Y8_Sc_m trained on 800 annotated images from Swedish Hockey League (SHL). Generic YOLOv8 and soccer-tuned model both failed on puck detection. The Sc-m Medium variant achieved 77% puck TP rate.
4. Outlier Detection: IQR again outperformed Z-Score (MAE 125.23) and Modified Z-Score (MAE 125.13) with MAE 95.80. Hockey-specific adaptation: Y-axis threshold based on finding that puck positions concentrate in top 30% of Y-axis (unlike soccer's even distribution).
5. Smoothing (new module replacing Interpolation): Exponential Moving Average (EMA) smoother with exponentially decreasing weights for older position data. User study (11 participants) found alpha=0.8 (stronger smoothing) consistently preferred.
6. Cropping: Same ffmpeg-based approach, puck-centered and frame-centered options.
7. Post-Processing: Unchanged — outputs MP4 with optional visualization.

Objective Evaluation: Model training on 8x NVIDIA Tesla V100-SXM3-32GB GPUs completed in 36.5 minutes. End-to-end deployment tested on NVIDIA Tesla T4 GPU at 50fps/1920x1080. Processing time scales linearly with video length; memory utilization remained stable for production scalability.

Subjective Evaluation: 26 participants rated six cropping alternatives across four videos on QoE, smoothness, and content capture (5-point ACR scale). Full SmartCrop-H pipeline (puck-centered with outlier detection and smoothing) outperformed all other alternatives for 9:16 videos. Smart cropping significantly outperformed static alternatives, particularly for video smoothness.

Conclusion: Domain-specific adaptation is critical — techniques validated on soccer do not transfer directly to hockey. The combination of hockey-specific YOLO detector, IQR outlier detection with Y-axis spatial prior, and EMA smoothing measurably improves viewer QoE. Future work: extending beyond puck-centric cropping to incorporate player positions and broader game context.
`;

const SYSTEM_PROMPT = `You are Martin's AI assistant on his personal portfolio website (majidi.no). You answer questions about Martin Majidi based on his CV, academic transcript, and research publications.

Rules:
- LANGUAGE: Always respond in the same language the user writes in. If the user writes in Norwegian (norsk), respond entirely in Norwegian. If the user writes in English, respond in English. This is mandatory.
- Only answer questions related to Martin's professional background, skills, experience, education, academic courses, projects, publications, and contact info.
- Be conversational, friendly, and professional.
- If asked something not covered in the provided data, politely say you don't have that information and suggest contacting Martin directly.
- Keep answers concise but informative (2-4 sentences typically). For detailed research questions, you may give longer answers drawing from the paper summaries.
- You can mention that this chatbot itself is a live demo of Martin's RAG chatbot expertise.
- Do not make up information not present in the provided data.
- When listing items, use short bullet points.
- If asked "who are you" or similar, explain you are an AI assistant built to answer questions about Martin, powered by RAG (Retrieval-Augmented Generation) and GPT-4o-mini.
- When asked about SmartCrop, the thesis, or the research papers, use the detailed paper summaries to give specific technical answers (pipeline modules, evaluation results, model performance numbers, etc.).

Martin's data (CV + transcript + research papers):
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
      max_tokens: 800,
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
