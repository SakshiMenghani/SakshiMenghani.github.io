export const profile = {
  name: 'Sakshi Menghani',
  firstName: 'Sakshi',
  role: 'AI/ML Engineer',
  location: 'United States',
  tagline: 'I build GenAI, RAG and multi-agent systems that turn messy workflows into reliable, measurable products.',
  email: 'sakshi.menghani03@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sakshi-menghani',
  github: 'https://github.com/SakshiMenghani',
  resume: 'Sakshi_Menghani_Resume.pdf',
}

export const about = {
  intro:
    "I'm an AI/ML Engineer at Ccube Inc, where I architect and ship production GenAI and RAG applications for financial and regulated-industry clients. My path runs through data engineering at Infosys and healthcare data analytics at CRISP, which is why I care about the whole journey, from clean data to agents that people can actually trust.",
  focus:
    "I'm happiest in the messy middle, where a promising model has to become a dependable workflow: retrieval that finds the right context, agents that call the right tools, and guardrails that keep everything compliant.",
  stats: [
    { value: '4+', label: 'years across AI, data & engineering' },
    { value: '~40%', label: 'less manual processing with agent automation' },
    { value: '38+', label: 'compliance controls automated in Guardiance' },
    { value: '5', label: 'agents orchestrated in one healthcare system' },
  ],
}

export const pillars = [
  {
    no: '01',
    kicker: 'retrieve · ground · answer',
    title: 'GenAI & RAG applications',
    text: 'Production retrieval systems over enterprise knowledge bases with Weaviate, Pinecone and FAISS, orchestrating OpenAI, GPT-OSS and Llama-3.',
  },
  {
    no: '02',
    kicker: 'plan · call tools · hand off',
    title: 'Multi-agent orchestration',
    text: 'Model-agnostic agents with Google ADK, OpenAI SDK, LangGraph and MCP, wired to real APIs and data sources with routing, memory and RBAC.',
  },
  {
    no: '03',
    kicker: 'automate · validate · comply',
    title: 'Workflow automation & guardrails',
    text: 'n8n and Camunda (BPMN) pipelines plus Guardrails AI that replace manual handoffs while staying audit-ready for regulated industries.',
  },
]

export const experience = [
  {
    role: 'AI/ML Engineer',
    company: 'Ccube Inc',
    period: 'Aug 2024 – Present',
    place: 'California, USA',
    points: [
      'Architected and shipped production GenAI and RAG applications for financial and regulated-industry clients, orchestrating OpenAI models, GPT-OSS and Llama-3 via OpenRouter, Google ADK and OpenAI SDK, with Weaviate powering retrieval.',
      'Standardized multi-model tool-calling with Model Context Protocol (MCP) integrations, pairing agents with n8n and Camunda (BPMN) automation to cut manual processing time by ~40%.',
      'Scoped AI use cases with technical and business stakeholders and turned them into microservice-based AI applications, reducing workflow turnaround time by ~25%.',
    ],
    tags: ['RAG', 'MCP', 'Google ADK', 'Weaviate', 'n8n', 'Camunda'],
  },
  {
    role: 'Data Analyst',
    company: 'CRISP Shared Services',
    period: 'Jun 2023 – May 2024',
    place: 'Maryland, USA',
    points: [
      'Used Databricks SQL for transformation, validation and quality analysis of large healthcare datasets across hospital sources in DC, Maryland and Virginia.',
      'Ran large-scale data integration with IBM InfoSphere, resolving false positives, overlays and duplicates while keeping 98% accuracy across 1,500+ patient records.',
      'Built dashboards with stakeholders using Agile, increasing data understanding by 20% and decision-making efficiency by 15%.',
    ],
    tags: ['Databricks SQL', 'IBM InfoSphere', 'Healthcare data', 'Dashboards'],
  },
  {
    role: 'System Data Engineer',
    company: 'Infosys',
    period: 'Jun 2021 – Aug 2022',
    place: 'India',
    points: [
      'Analyzed weekly Fitbit user and device data for 200+ users, surfacing behavioral insights that contributed to a 22% lift in user retention.',
      'Built a real-time monitoring utility for user feedback and system issues, reducing duplicate bugs by 35%.',
      'Contributed to embedded data systems for real-time test-data capture from smartwatches and phones, cutting acquisition latency by 20%.',
    ],
    tags: ['Data analysis', 'Monitoring', 'Embedded data', 'IoT'],
  },
]

export const projects = [
  {
    name: 'VeriArm',
    subtitle: 'Voice Checkout Robot Arm · Viam Hackathon',
    metric: '2 days',
    metricLabel: 'from idea to a live robot demo',
    text: 'A robot arm that runs a package checkout counter. It finds the box with a depth camera, reads its QR label, checks payment and shipping in the inventory, talks the customer through payment and an email notification by voice, then picks the box and places it in the Standard or Express shipping zone.',
    detail:
      'Built at the Viam “Code That Moves” hackathon with Sandy Zhao and Yixin. I built label inspection and verification, the inventory with payments, shipping and email notifications, the control panel and the main loop, and tuned the voice loop to answer in under a second.',
    tags: ['Viam', 'OpenCV', 'Claude', 'ElevenLabs', 'SQLite', 'Python'],
    accent: '#ffb38f',
    tone: 'ink',
    featured: true,
    link: 'https://github.com/SakshiMenghani/VeriArm',
    linkLabel: 'code ↗︎',
    media: {
      video: 'projects/veriarm/veriarm-demo.mp4',
      poster: 'projects/veriarm/veriarm-demo-poster.jpg',
      videoLabel: 'VeriArm demo: the arm picks a package from the blue checkout zone and places it in the shipping zones',
      photo: 'projects/veriarm/veriarm-team.jpg',
      photoAlt: 'Sakshi with teammates Sandy and Yixin at the VeriArm table: the robot arm, the blue checkout zone, and the green Standard and orange Express shipping zones',
    },
  },
  {
    name: 'Guardiance',
    subtitle: 'AI-Powered Compliance Intelligence Platform',
    metric: '~70%',
    metricLabel: 'less manual review',
    text: 'A multi-layer compliance detection pipeline combining semantic policy matching, entity extraction, contextual risk scoring and deterministic validation across 38+ HIPAA, financial and security controls.',
    tags: ['OpenAI', 'GPT-OSS', 'Guardrails AI', 'NER', 'Pinecone'],
    accent: '#ff8fab',
    tone: 'ink',
  },
  {
    name: 'IntelliConnect',
    subtitle: 'Enterprise Multi-Agent AI Orchestration',
    metric: '~60%',
    metricLabel: 'faster turnaround',
    text: 'A scalable, model-agnostic orchestration layer with contextual memory, role-based access control, dynamic agent and model routing, and retrieval-backed execution across support, healthcare, banking and finance.',
    tags: ['LLMs', 'MCP', 'OpenRouter', 'RAG', 'CoT', 'Weaviate'],
    accent: '#8fb8ff',
    tone: 'sage',
  },
  {
    name: 'CareFlow Agents',
    subtitle: 'Google ADK Healthcare Appointment Booking',
    metric: '~65%',
    metricLabel: 'less scheduling effort',
    text: 'A five-agent system for patient intake, symptom mapping, scheduling and communication, integrating Google Sheets and Gmail via MCP, automating follow-ups with n8n and routing calls through OpenRouter.',
    tags: ['Google ADK', 'MCP', 'OpenRouter', 'n8n', 'Gmail API'],
    accent: '#9ff0c8',
    tone: 'sand',
  },
]

export const skills = [
  { group: 'Languages & Tools', items: ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'Git', 'Postman', 'Jupyter'] },
  {
    group: 'AI Frameworks',
    items: ['LangChain', 'LangSmith', 'LangGraph', 'Hugging Face', 'Guardrails AI', 'Google ADK', 'OpenAI SDK', 'MCP'],
  },
  { group: 'Databases & Vector Stores', items: ['PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Pinecone', 'Weaviate', 'FAISS'] },
  {
    group: 'Cloud & Data Engineering',
    items: ['AWS', 'Azure', 'GCP', 'Databricks', 'Apache Spark', 'ETL', 'Data Modeling', 'Data Warehousing', 'n8n', 'Camunda'],
  },
]

export const education = {
  school: 'University of Maryland, Baltimore County',
  degree: 'M.S. in Information Systems',
  focus: 'Specialization in Data Science and AI',
  period: 'Graduated May 2024',
  place: 'Baltimore, MD',
  coursework: ['Advanced AI', 'Data Mining', 'Advanced Database Projects', 'Data Analysis in Healthcare', 'Social Media Analytics'],
}
