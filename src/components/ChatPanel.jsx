import { useEffect, useRef } from 'react'
import { suggestions } from '../lib/assistant'

export default function ChatPanel({ messages, input, setInput, onSend, busy, muted, setMuted, status }) {
  const scroller = useRef(null)
  const field = useRef(null)

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const submit = (event) => {
    event.preventDefault()
    onSend(input)
  }

  return (
    <div className="chat">
      <div className="chat-bar">
        <span className={`chat-status is-${status}`}>
          <i />
          {status === 'thinking' ? 'Thinking' : status === 'speaking' ? 'Speaking' : 'Listening'}
        </span>
        <button type="button" className="ghost" onClick={() => setMuted((m) => !m)} aria-pressed={muted}>
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      </div>

      <div className="chat-log" ref={scroller} aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.role}`}>
            <p>{msg.text || '…'}</p>
            {msg.source && msg.role === 'assistant' && msg.text ? <small>{msg.source}</small> : null}
          </div>
        ))}
      </div>

      <div className="chips">
        {suggestions.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => onSend(s)} disabled={busy}>
            {s}
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={submit}>
        <input
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about her work, projects, stack…"
          disabled={busy}
          aria-label="Ask the AI twin"
        />
        <button type="submit" className="send" disabled={busy || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  )
}
