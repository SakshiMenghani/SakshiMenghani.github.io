// A tiny, fully client-side retrieval engine over Sakshi's profile.
// No API keys, no servers: answers are ranked by weighted keyword overlap.

const knowledge = [
  {
    id: 'intro',
    keywords: ['who', 'yourself', 'about', 'introduce', 'sakshi', 'summary', 'background', 'tell'],
    answer:
      "I'm Sakshi's AI twin! Sakshi is an AI/ML Engineer at Ccube Inc who builds production GenAI, RAG and multi-agent systems for financial and regulated-industry clients. Before that she worked in healthcare data analytics at CRISP and data engineering at Infosys, and she holds an M.S. in Information Systems (Data Science & AI) from UMBC.",
    source: 'About',
  },
  {
    id: 'current',
    keywords: ['current', 'now', 'ccube', 'job', 'work', 'role', 'doing', 'present', 'company'],
    answer:
      "Right now Sakshi is an AI/ML Engineer at Ccube Inc (since Aug 2024). She ships GenAI and RAG apps using OpenAI models, GPT-OSS and Llama-3 via OpenRouter, Google ADK and the OpenAI SDK, with Weaviate for retrieval. She also built MCP integrations and paired agents with n8n and Camunda, cutting manual processing time by about 40%.",
    source: 'Experience · Ccube',
  },
  {
    id: 'experience',
    keywords: ['experience', 'career', 'history', 'previous', 'worked', 'years', 'journey', 'jobs'],
    answer:
      "Sakshi has 4+ years across AI, data and engineering: AI/ML Engineer at Ccube Inc (2024–now), Data Analyst at CRISP Shared Services working with healthcare data (2023–2024), and System Data Engineer at Infosys analyzing wearable data (2021–2022).",
    source: 'Experience',
  },
  {
    id: 'crisp',
    keywords: ['crisp', 'healthcare', 'analyst', 'hospital', 'patient', 'databricks', 'infosphere', 'phi'],
    answer:
      "At CRISP Shared Services, Sakshi worked as a Data Analyst on healthcare data across DC, Maryland and Virginia hospitals. She used Databricks SQL for transformation and quality analysis, and IBM InfoSphere for data integration, keeping 98% accuracy across 1,500+ patient records.",
    source: 'Experience · CRISP',
  },
  {
    id: 'infosys',
    keywords: ['infosys', 'fitbit', 'smartwatch', 'india', 'engineer', 'retention', 'monitoring', 'embedded'],
    answer:
      "At Infosys, Sakshi was a System Data Engineer. She analyzed Fitbit data for 200+ users (helping lift retention by 22%), built a real-time monitoring utility that reduced duplicate bugs by 35%, and worked on embedded data capture from smartwatches that cut latency by 20%.",
    source: 'Experience · Infosys',
  },
  {
    id: 'projects',
    keywords: ['project', 'projects', 'built', 'portfolio', 'showcase', 'build', 'made'],
    answer:
      'Four highlights: VeriArm, a voice checkout robot arm built in two days at the Viam hackathon; Guardiance, an AI compliance intelligence platform (~70% less manual review); IntelliConnect, an enterprise multi-agent orchestration platform (~60% faster turnaround); and a five-agent Google ADK healthcare appointment system (~65% less scheduling effort). Ask me about any of them!',
    source: 'Projects',
  },
  {
    id: 'veriarm',
    keywords: ['veriarm', 'robot', 'robotics', 'arm', 'viam', 'hackathon', 'checkout', 'package', 'voice', 'camera', 'pick'],
    answer:
      'VeriArm is a voice checkout robot arm Sakshi built with Sandy Zhao and Yixin in two days at the Viam "Code That Moves" hackathon. The arm finds a package with a depth camera, reads its QR label, checks payment and shipping in the inventory, talks the customer through payment and an email notification by voice (ElevenLabs speech plus Claude to understand answers), then picks the box and places it in the Standard or Express shipping zone. Sakshi built the label inspection and verification, the inventory with payments and email notifications, the control panel and the main loop. The code is on GitHub at SakshiMenghani/VeriArm.',
    source: 'Projects · VeriArm',
  },
  {
    id: 'guardiance',
    keywords: ['guardiance', 'compliance', 'hipaa', 'guardrails', 'policy', 'risk', 'ner', 'regulated'],
    answer:
      'Guardiance is an AI-powered compliance intelligence platform. It layers semantic policy matching, entity extraction (NER), contextual risk scoring and deterministic validation across 38+ HIPAA, financial and security controls, built with OpenAI models, GPT-OSS, Guardrails AI and Pinecone. It reduced manual review effort by about 70%.',
    source: 'Projects · Guardiance',
  },
  {
    id: 'intelliconnect',
    keywords: ['intelliconnect', 'orchestration', 'multi', 'agent', 'agents', 'routing', 'memory', 'rbac', 'enterprise'],
    answer:
      'IntelliConnect is a model-agnostic multi-agent orchestration layer with contextual memory, role-based access control, dynamic agent/model routing and retrieval-backed execution. It serves customer support, healthcare, banking and finance, using MCP, OpenRouter, Pinecone and Weaviate, and reduced workflow turnaround time by about 60%.',
    source: 'Projects · IntelliConnect',
  },
  {
    id: 'adk',
    keywords: ['adk', 'google', 'appointment', 'booking', 'scheduling', 'symptom', 'gmail', 'sheets', 'five'],
    answer:
      'The Google ADK healthcare project is a five-agent system for patient intake, symptom mapping, scheduling and communication. It connects Google Sheets and Gmail via MCP, automates downstream steps with n8n, and routes model calls through OpenRouter to balance cost and latency, cutting manual scheduling effort by about 65%.',
    source: 'Projects · Healthcare agents',
  },
  {
    id: 'rag',
    keywords: ['rag', 'retrieval', 'vector', 'weaviate', 'pinecone', 'faiss', 'embedding', 'knowledge', 'search'],
    answer:
      "RAG is Sakshi's bread and butter. She builds retrieval over enterprise knowledge bases with Weaviate, Pinecone and FAISS, and orchestrates OpenAI, GPT-OSS and Llama-3 on top. Fun fact: I'm a tiny RAG system myself; I retrieve answers from her resume right inside your browser.",
    source: 'Skills · RAG',
  },
  {
    id: 'mcp',
    keywords: ['mcp', 'model', 'context', 'protocol', 'tool', 'tools', 'calling', 'api'],
    answer:
      'Sakshi implemented Model Context Protocol (MCP) integrations at Ccube to standardize multi-model tool-calling, connecting LLM agents to internal APIs and data sources. She also used MCP to wire agents to Google Sheets and Gmail in her healthcare project.',
    source: 'Experience · MCP',
  },
  {
    id: 'automation',
    keywords: ['n8n', 'camunda', 'bpmn', 'automation', 'workflow', 'automate', 'manual'],
    answer:
      'Sakshi pairs LLM agents with n8n and Camunda (BPMN) automation to replace manual handoffs in document intake and case routing. That cut manual processing time by about 40% at Ccube.',
    source: 'Experience · Automation',
  },
  {
    id: 'skills',
    keywords: ['skills', 'stack', 'tech', 'technologies', 'tools', 'languages', 'frameworks', 'know', 'python', 'langchain', 'langgraph'],
    answer:
      'Her stack: Python, Java, C++, JavaScript and SQL; LangChain, LangSmith, LangGraph, Hugging Face, Guardrails AI, Google ADK and OpenAI SDK; PostgreSQL, MySQL, Oracle, MongoDB, Pinecone, Weaviate and FAISS; plus AWS, Azure, GCP, Databricks, Spark, n8n and Camunda.',
    source: 'Skills',
  },
  {
    id: 'cloud',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'spark', 'etl', 'warehouse', 'warehousing', 'data', 'engineering', 'pipeline'],
    answer:
      'On the data side Sakshi works with AWS, Azure, GCP, Databricks (and Databricks SQL) and Apache Spark, covering ETL, data integration, data modeling and data warehousing.',
    source: 'Skills · Cloud & Data',
  },
  {
    id: 'education',
    keywords: ['education', 'degree', 'university', 'umbc', 'masters', 'study', 'studied', 'college', 'school', 'coursework'],
    answer:
      'Sakshi earned an M.S. in Information Systems with a specialization in Data Science and AI from the University of Maryland, Baltimore County (May 2024). Coursework included Advanced AI, Data Mining, Advanced Database Projects, Data Analysis in Healthcare and Social Media Analytics.',
    source: 'Education',
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'linkedin', 'github', 'connect', 'touch', 'message'],
    answer:
      'You can email Sakshi at sakshi.menghani03@gmail.com, or connect on LinkedIn (linkedin.com/in/sakshi-menghani) and GitHub (github.com/SakshiMenghani). The contact section at the bottom has quick links too.',
    source: 'Contact',
  },
  {
    id: 'hire',
    keywords: ['hire', 'hiring', 'available', 'opportunity', 'opportunities', 'open', 'why', 'fit', 'recruiter', 'role'],
    answer:
      "Sakshi is open to conversations about AI/ML engineering roles, especially GenAI, RAG, agentic systems and AI for regulated industries. Why her? She ships: production RAG apps, MCP-based agents and automations with measurable wins like 40–70% less manual work. Email sakshi.menghani03@gmail.com to start the conversation.",
    source: 'Contact',
  },
  {
    id: 'resume',
    keywords: ['resume', 'cv', 'download', 'pdf'],
    answer: 'You can download Sakshi\'s resume with the "Resume" button in the top navigation bar.',
    source: 'Resume',
  },
  {
    id: 'avatar',
    keywords: ['avatar', 'twin', 'bot', 'chatbot', 'ai', 'three', '3d', 'free', 'site', 'website'],
    answer:
      "I'm a 3D avatar rendered with Three.js, and my brain is a small keyword-retrieval engine that runs entirely in your browser over Sakshi's resume. No servers and no API keys, so this portfolio costs nothing to host on GitHub Pages.",
    source: 'This site',
  },
]

const smallTalk = [
  { test: /^(hi|hey|hello|hola|yo|namaste|good (morning|afternoon|evening))\b/, answer: "Hi there! I'm Sakshi's AI twin. Ask me about her experience, projects, skills or how to reach her." },
  { test: /\b(thanks|thank you|thx|cool|awesome|great|nice)\b/, answer: 'Happy to help! Anything else you want to know about Sakshi?' },
  { test: /\b(bye|goodbye|see you)\b/, answer: "Bye! Don't forget to say hi to Sakshi at sakshi.menghani03@gmail.com." },
]

const stop = new Set('a an the is are was were be to of in on for and or with at by from her she his he it its what which do does did can could would should tell me about please any your my i me some more'.split(' '))

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !stop.has(t))
    .map((t) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t))
}

const docFreq = {}
for (const k of knowledge) {
  for (const w of new Set(k.keywords)) docFreq[w] = (docFreq[w] || 0) + 1
}

export function ask(question) {
  const q = question.trim().toLowerCase()
  for (const s of smallTalk) {
    if (s.test.test(q) && q.split(/\s+/).length <= 4) return { text: s.answer, source: 'Small talk' }
  }

  const tokens = tokenize(q)
  let best = null
  let bestScore = 0
  for (const k of knowledge) {
    let score = 0
    for (const t of tokens) {
      for (const w of k.keywords) {
        if (t === w || (t.length > 3 && (w.startsWith(t) || t.startsWith(w)))) {
          score += Math.log(1 + knowledge.length / docFreq[w])
          break
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = k
    }
  }

  if (!best || bestScore < 0.5) {
    return {
      text: "Hmm, that one isn't in my memory yet. Try asking about Sakshi's current role, her projects (VeriArm, Guardiance, IntelliConnect), RAG, skills, education or how to contact her.",
      source: 'Fallback',
    }
  }
  return { text: best.answer, source: best.source }
}

export const suggestions = [
  'Who is Sakshi?',
  'What does she do at Ccube?',
  'Tell me about Guardiance',
  'What is her tech stack?',
  'Is she open to roles?',
  'How does this AI twin work?',
]
