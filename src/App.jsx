import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const AvatarScene = lazy(() => import('./components/AvatarScene'))
import ChatPanel from './components/ChatPanel'
import { ask } from './lib/assistant'
import { about, education, experience, pillars, profile, projects, skills } from './data/profile'

const seed = {
  id: 'hello',
  role: 'assistant',
  text: "Hi — I'm Sakshi's AI twin. Ask me about her projects, skills, experience, or how to reach her.",
  source: 'Welcome',
}

const chapterLabel = ['Now', 'Previously', 'Before that']

const writingHighlights = [
  {
    number: '01',
    area: 'Compliance AI',
    title: 'From policy text to measurable controls',
    text: 'Guardiance turns HIPAA, financial, and security rules into semantic matches, entity checks, risk scores, and deterministic validations.',
  },
  {
    number: '02',
    area: 'Agent Systems',
    title: 'Making model routing useful in production',
    text: 'IntelliConnect routes tasks across models, tools, memory, and retrieval so enterprise workflows can move without manual handoffs.',
  },
  {
    number: '03',
    area: 'Healthcare Automation',
    title: 'Five agents for one appointment workflow',
    text: 'The Google ADK system handles patient intake, symptom mapping, scheduling, and follow-up automation with Sheets, Gmail, MCP, and n8n.',
  },
]

function speak(text, onEnd) {
  if (!window.speechSynthesis) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 1.02
  utter.pitch = 1.08
  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find((v) => /samantha|victoria|karen|moira|tessa|google us english/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en') && /female/i.test(v.name))
  if (preferred) utter.voice = preferred
  utter.onend = onEnd
  utter.onerror = onEnd
  window.speechSynthesis.speak(utter)
}

export default function App() {
  const avatarState = useRef({ speaking: false, thinking: false })
  const [status, setStatus] = useState('listening')
  const [messages, setMessages] = useState([seed])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [muted, setMuted] = useState(true)
  const typeTimer = useRef(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = avatarState.current.thinking ? 'thinking' : avatarState.current.speaking ? 'speaking' : 'listening'
      setStatus((current) => (current === next ? current : next))
    }, 180)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => () => window.clearTimeout(typeTimer.current), [])

  const onSend = (raw) => {
    const question = raw.trim()
    if (!question || busy) return
    setInput('')
    setBusy(true)

    const userId = crypto.randomUUID()
    const botId = crypto.randomUUID()
    setMessages((m) => [
      ...m,
      { id: userId, role: 'user', text: question },
      { id: botId, role: 'assistant', text: '', source: '' },
    ])

    avatarState.current.thinking = true
    avatarState.current.speaking = false

    window.setTimeout(() => {
      const { text, source } = ask(question)
      avatarState.current.thinking = false
      avatarState.current.speaking = true

      let i = 0
      const step = () => {
        i = Math.min(text.length, i + 3)
        setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, text: text.slice(0, i), source } : msg)))
        if (i < text.length) {
          typeTimer.current = window.setTimeout(step, 14)
        } else if (muted) {
          typeTimer.current = window.setTimeout(() => {
            avatarState.current.speaking = false
            setBusy(false)
          }, Math.min(2200, 400 + text.length * 18))
        } else {
          speak(text, () => {
            avatarState.current.speaking = false
            setBusy(false)
          })
        }
      }
      step()
    }, 480)
  }

  return (
    <main className="site-shell" id="top">
      <header className="site-header" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label={`${profile.name}, home`}>
          {profile.name}
          <span className="brand-spark" aria-hidden="true">✦</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#focus">Focus</a>
          <a href="#journey">Journey</a>
          <a href="#twin">AI Twin</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
          <a href={`./${profile.resume}`} download>Resume</a>
        </nav>
        <p className="status-note">
          <span className="status-dot" aria-hidden="true"></span>
          GenAI · RAG · Agents
        </p>
      </header>

      <section className="hero personal-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span>{profile.name}</span>
            <span aria-hidden="true">·</span>
            {profile.role}
          </p>
          <h1>
            Hi, I’m {profile.firstName}. I build AI systems that turn messy workflows into
            <span className="word-mark"> measurable products</span>.
          </h1>
          <p className="hero-description">{about.intro}</p>
          <div className="hero-actions">
            <a className="text-link text-link-primary" href={profile.linkedin} target="_blank" rel="noreferrer">
              Meet me on LinkedIn <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#twin">
              Talk to my AI twin <span aria-hidden="true">→</span>
            </a>
          </div>
          <p className="tiny-note">
            research brain, shipping hands <span aria-hidden="true">♡</span>
          </p>
        </div>

        <div className="orbit-stage" id="twin">
          <div className="orbit-decor" aria-hidden="true">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="orbit orbit-three"></div>
            <div className="axis axis-x"></div>
            <div className="axis axis-y"></div>
            <div className="memory-node node-one"><span>retrieve</span></div>
            <div className="memory-node node-two"><span>reason</span></div>
            <div className="memory-node node-three"><span>route</span></div>
            <div className="memory-node node-four"><span>ship</span></div>
            <div className="fish-mark"><span>agents in motion</span></div>
            <div className="spark-cluster spark-one">· · ✦ ·</div>
            <div className="spark-cluster spark-two">✦ · ·</div>
            <p className="diagram-note">data → context → action</p>
          </div>
          <div className="avatar-card">
            <div className="avatar-canvas">
              <Suspense fallback={<div className="stage-fallback">Waking the twin…</div>}>
                <AvatarScene state={avatarState} />
              </Suspense>
            </div>
            <ChatPanel
              messages={messages}
              input={input}
              setInput={setInput}
              onSend={onSend}
              busy={busy}
              muted={muted}
              setMuted={setMuted}
              status={status}
            />
          </div>
        </div>
      </section>

      <section className="now-strip" aria-label="Professional introduction">
        <p className="section-kicker">Now · building</p>
        <p>{profile.tagline}</p>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">Full profile ↗︎</a>
      </section>

      <section className="focus-section" id="focus">
        <div className="section-intro">
          <p className="section-kicker">What I do</p>
          <div>
            <h2>Model work, systems work, and the bridge between them.</h2>
            <p className="section-summary">{about.focus}</p>
          </div>
        </div>
        <div className="focus-grid">
          {pillars.map((pillar) => (
            <article className="focus-card" key={pillar.no}>
              <div className="card-topline">
                <span>{pillar.no}</span>
                <p>{pillar.kicker}</p>
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journey-section" id="journey">
        <div className="journey-title">
          <p className="section-kicker">A short timeline</p>
          <h2>
            The current chapter,
            <br />
            plus just enough backstory.
          </h2>
          <p className="about-handnote">details belong on LinkedIn 〰</p>
        </div>
        <div className="journey-list">
          {experience.map((job, index) => (
            <article key={job.company}>
              <p className="journey-date">{chapterLabel[index] || 'Earlier'}</p>
              <div>
                <h3>{job.role} · {job.company}</h3>
                <p className="journey-meta">{job.period} · {job.place}</p>
                <p>{job.points[0]}</p>
              </div>
            </article>
          ))}
          <article className="journey-personal">
            <p className="journey-date">Education</p>
            <div>
              <h3>{education.degree} · {education.school}</h3>
              <p>{education.focus}. Coursework: {education.coursework.join(', ')}.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="speaking-section" id="featured">
        <div className="speaking-heading">
          <p className="section-kicker">Featured system</p>
          <h2>One AI twin, one resume, zero paid APIs.</h2>
          <p>
            The avatar is a free, browser-only Three.js experience with a tiny retrieval engine over Sakshi's resume.
            It keeps the portfolio interactive while remaining GitHub Pages friendly.
          </p>
        </div>
        <article className="talk-card">
          <div className="talk-cover">
            <Suspense fallback={<div className="stage-fallback">Loading 3D scene…</div>}>
              <AvatarScene state={avatarState} />
            </Suspense>
            <span>Ask the AI twin ↗︎</span>
          </div>
          <div className="talk-copy">
            <div className="talk-meta">
              <span>React</span>
              <span>Three.js</span>
              <span>Client-side RAG</span>
            </div>
            <p className="talk-event">Free to host</p>
            <h3>A portfolio assistant that speaks from the resume.</h3>
            <p>
              Visitors can ask about Guardiance, IntelliConnect, current work, skills, education, and contact details.
              No server, no OpenAI key, and no recurring hosting cost.
            </p>
            <div className="talk-actions">
              <a className="text-link text-link-primary" href="#twin">Try it <span aria-hidden="true">→</span></a>
              <a className="text-link" href={`./${profile.resume}`} download>Download resume <span aria-hidden="true">↗︎</span></a>
            </div>
          </div>
        </article>
      </section>

      <section className="home-topics-section" id="projects">
        <div className="section-intro topics-intro">
          <p className="section-kicker">Selected work</p>
          <div>
            <h2>Follow a problem, not just a project list.</h2>
            <p className="section-summary">
              Each project is framed around the workflow it improved, the stack behind it, and the measurable result.
            </p>
          </div>
        </div>
        <div className="topic-card-grid">
          {projects.map((project, index) => {
            const body = (
              <>
                <div className="topic-card-topline">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{project.subtitle}</p>
                </div>
                <div className="topic-path" aria-hidden="true">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <div key={tag}>
                      <span>{tag}</span>
                      {tagIndex < 2 ? <i>→</i> : null}
                    </div>
                  ))}
                </div>
                <h3>{project.name}</h3>
                <p className="topic-card-copy">{project.text}</p>
                {project.detail ? <p className="topic-card-copy topic-card-detail">{project.detail}</p> : null}
                {project.stack ? (
                  <div className="topic-stack">
                    <span className="topic-stack-label">Tech stack</span>
                    <ul>
                      {project.stack.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}
                <div className="topic-card-footer">
                  <span><strong>{project.metric}</strong> {project.metricLabel}</span>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || 'case study ↗︎'}</a>
                  ) : (
                    <small aria-hidden="true">case study ↗︎</small>
                  )}
                </div>
              </>
            )
            return (
              <article
                className={`topic-card topic-card-${project.tone || 'ink'}${project.featured ? ' topic-card-featured' : ''}`}
                key={project.name}
              >
                {project.featured && project.media ? (
                  <>
                    <div className="topic-card-body">{body}</div>
                    <div className="topic-card-media">
                      <video
                        src={project.media.video}
                        poster={project.media.poster}
                        controls
                        playsInline
                        preload="none"
                        aria-label={project.media.videoLabel}
                      />
                      <img src={project.media.photo} alt={project.media.photoAlt} loading="lazy" />
                    </div>
                  </>
                ) : (
                  body
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="writing-section" id="writing">
        <div className="section-intro writing-intro">
          <p className="section-kicker">Technical notes</p>
          <div>
            <a className="text-link text-link-primary" href={profile.github} target="_blank" rel="noreferrer">
              Explore GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="writing-list">
          {writingHighlights.map((item) => (
            <article className="writing-card" key={item.number}>
              <p className="writing-number">{item.number}</p>
              <div className="writing-meta">
                <span>{item.area}</span>
                <span>Resume-backed</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="card-arrow" aria-hidden="true">↗︎</span>
            </article>
          ))}
        </div>
      </section>

      <section className="little-life-section" id="skills">
        <div className="section-intro">
          <p className="section-kicker">Stack</p>
          <div>
            <h2>The tools I reach for.</h2>
            <p className="section-summary">
              AI frameworks, vector stores, cloud platforms, and data engineering tools used across production systems.
            </p>
          </div>
        </div>
        <div className="little-life-grid">
          {skills.map((group) => (
            <article className="little-life-card" key={group.group}>
              <span className="life-icon" aria-hidden="true">◎</span>
              <p>{group.group}</p>
              <h3>{group.items.slice(0, 4).join(' · ')}</h3>
              <span>{group.items.slice(4).join(' · ') || 'production ready'}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="section-kicker">Let's build</p>
        <h2>Internships, collaborations, and the next hard problem.</h2>
        <p>
          Open to AI/ML engineering conversations, especially GenAI, RAG, agentic systems, automation, and AI for
          regulated industries.
        </p>
        <div className="contact-links">
          <a className="text-link text-link-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗︎</a>
          <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗︎</a>
          <a className="text-link" href="tel:+16673698506">+1 (667) 369-8506</a>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p>Building practical GenAI systems in the United States.</p>
        </div>
        <p className="footer-evolving">
          <span className="mini-fish" aria-hidden="true"></span>
          still learning, still shipping ♡
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  )
}
