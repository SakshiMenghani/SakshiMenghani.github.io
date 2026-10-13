import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const AvatarScene = lazy(() => import('./components/AvatarScene'))
import ChatPanel from './components/ChatPanel'
import { ask } from './lib/assistant'
import { about, education, experience, pillars, profile, projects, skills } from './data/profile'

const seed = {
  id: 'hello',
  role: 'assistant',
  text: "Hi — I'm Sakshi's AI twin. I live in this page and know her resume by heart. Ask me about her work, projects, or how to reach her.",
  source: 'Welcome',
}

const chapterLabel = ['Now', 'Previously', 'Before that']

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
  const [menuOpen, setMenuOpen] = useState(false)
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

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip" href="#studio">
        Skip to content
      </a>

      <header className="nav">
        <a className="brand" href="#studio">
          <span>Sakshi Menghani</span>
          <small>AI/ML Engineer</small>
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          Menu
        </button>
        <nav id="site-nav" className={menuOpen ? 'open' : ''} onClick={closeMenu}>
          <a href="#studio">Twin</a>
          <a href="#now">Now</a>
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
          <a className="resume" href={`./${profile.resume}`} download>
            Resume
          </a>
        </nav>
      </header>

      <main>
        <section id="studio" className="hero">
          <div className="hero-copy">
            <p className="kicker">hello from the studio</p>
            <h1>
              Hi, I’m {profile.firstName}. I build GenAI systems that people can actually trust.
            </h1>
            <p className="lede">{profile.tagline}</p>
            <p className="flourish">research brain, shipping hands</p>
            <div className="hero-actions">
              <a className="btn" href="#studio-stage">
                Talk to my twin
              </a>
              <a className="btn ghost" href={`mailto:${profile.email}`}>
                Email Sakshi
              </a>
            </div>
          </div>

          <div id="studio-stage" className="stage">
            <div className="stage-frame">
              <Suspense fallback={<div className="stage-fallback">Waking the twin…</div>}>
                <AvatarScene state={avatarState} />
              </Suspense>
              <div className="stage-vignette" />
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
        </section>

        <section id="now" className="section">
          <div className="section-head">
            <p className="kicker">Now · building</p>
            <h2>The current chapter, plus just enough backstory.</h2>
            <p className="aside">details belong on LinkedIn</p>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>{about.intro}</p>
              <p>{about.focus}</p>
            </div>
            <ul className="stats">
              {about.stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section pillars-wrap">
          <div className="section-head">
            <p className="kicker">the messy middle</p>
            <h2>Model work, systems work, and the bridge between them.</h2>
          </div>
          <ol className="pillars">
            {pillars.map((p) => (
              <li key={p.no}>
                <span className="no">{p.no}</span>
                <p className="meta">{p.kicker}</p>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <p className="kicker">experience</p>
            <h2>Where the work happened.</h2>
          </div>
          <ol className="timeline">
            {experience.map((job, i) => (
              <li key={job.company}>
                <p className="meta">{chapterLabel[i] || 'Earlier'}</p>
                <div className="job-top">
                  <h3>
                    {job.role} · {job.company}
                  </h3>
                  <p className="when">
                    {job.period} · {job.place}
                  </p>
                </div>
                <ul>
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p className="tags">
                  {job.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="section">
          <div className="section-head">
            <p className="kicker">selected work</p>
            <h2>Three systems, three measurable wins.</h2>
          </div>
          <div className="projects">
            {projects.map((p) => (
              <article key={p.name} style={{ '--accent': p.accent }}>
                <p className="metric">
                  <strong>{p.metric}</strong>
                  <span>{p.metricLabel}</span>
                </p>
                <h3>{p.name}</h3>
                <p className="meta">{p.subtitle}</p>
                <p>{p.text}</p>
                <p className="tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section split">
          <div>
            <div className="section-head">
              <p className="kicker">stack</p>
              <h2>The tools I reach for.</h2>
            </div>
            <div className="skill-groups">
              {skills.map((g) => (
                <div key={g.group}>
                  <h3>{g.group}</h3>
                  <p className="tags">
                    {g.items.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="edu">
            <p className="kicker">education</p>
            <h2>{education.degree}</h2>
            <p className="meta">{education.focus}</p>
            <p>
              {education.school}
              <br />
              {education.place} · {education.period}
            </p>
            <p className="tags">
              {education.coursework.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          </aside>
        </section>

        <section id="contact" className="section contact">
          <p className="kicker">let’s talk</p>
          <h2>Internships, collaborations, and the next hard problem.</h2>
          <p className="lede">
            Open to AI/ML engineering conversations — especially GenAI, RAG, agentic systems, and work in regulated
            industries.
          </p>
          <div className="contact-row">
            <a className="btn" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn ghost" href="tel:+16673698506">
              +1 (667) 369-8506
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>React + Three.js · hosted for free on GitHub Pages · no API keys</p>
      </footer>
    </>
  )
}
