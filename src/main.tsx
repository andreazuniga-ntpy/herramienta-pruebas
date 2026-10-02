import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Task = {
  instruction: string
  prototypeUrl: string
}

// Reemplaza únicamente estos valores cuando tengas las URLs y la segunda tarea.
const TASKS: Task[] = [
  {
    instruction:
      'Cambia a $5,000.00 el límite diario para Depósito del comisionista con ID 663542.',
    prototypeUrl: '[PEGA AQUÍ TU URL DE VERCEL]',
  },
  {
    instruction: '[PEGA AQUÍ LA SEGUNDA TAREA]',
    prototypeUrl: '[PEGA AQUÍ LA SEGUNDA URL DE VERCEL]',
  },
]

function isValidPrototypeUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function PrototypeFrame({ task }: { task: Task }) {
  const hasUrl = isValidPrototypeUrl(task.prototypeUrl)

  return (
    <section className="prototype" aria-label="Prototipo de la tarea">
      {hasUrl ? (
        <iframe
          key={task.prototypeUrl}
          src={task.prototypeUrl}
          title="Prototipo interactivo"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      ) : (
        <div className="prototype-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 17h8M9 21h6M7 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          </svg>
          <strong>El prototipo aparecerá aquí</strong>
          <p>Agrega la URL de Vercel en la configuración de la tarea.</p>
        </div>
      )}
    </section>
  )
}

function FeedbackForm({
  isLastTask,
  onContinue,
}: {
  isLastTask: boolean
  onContinue: () => void
}) {
  const [rating, setRating] = useState<number | null>(null)
  const [comments, setComments] = useState('')

  return (
    <section className="feedback" aria-labelledby="feedback-title">
      <div className="feedback-heading">
        <span className="feedback-icon" aria-hidden="true">✓</span>
        <div>
          <h2 id="feedback-title">Cuéntanos cómo te fue</h2>
          <p>Tu respuesta nos ayuda a mejorar la experiencia.</p>
        </div>
      </div>

      <fieldset className="rating-field">
        <legend>¿Qué tan fácil o difícil te resultó completar esta tarea?</legend>
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className={rating === value ? 'selected' : ''}>
              <input
                type="radio"
                name="facilidad"
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        <div className="rating-labels" aria-hidden="true">
          <span>Muy difícil</span>
          <span>Muy fácil</span>
        </div>
      </fieldset>

      <label className="comments-field">
        <span>¿Hubo algo que te confundiera o que esperabas que funcionara diferente?</span>
        <textarea
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          placeholder="Escribe aquí tu respuesta"
          rows={4}
        />
      </label>

      <div className="feedback-actions">
        <button className="primary-button" type="button" onClick={onContinue}>
          {isLastTask ? 'Finalizar prueba' : 'Siguiente tarea'}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

function App() {
  const [taskIndex, setTaskIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const task = TASKS[taskIndex]

  const openFeedback = () => {
    setShowFeedback(true)
    window.setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const continueTest = () => {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex((current) => current + 1)
      setShowFeedback(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsComplete(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isComplete) {
    return (
      <main className="completion-page">
        <section className="completion-card">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <h1>Prueba completada</h1>
          <p>Gracias por compartir tu experiencia. Tus respuestas fueron registradas.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">Prueba de usabilidad</p>
          <p className="helper">Completa la actividad dentro del prototipo.</p>
        </div>
        <div className="progress" aria-label={`Tarea ${taskIndex + 1} de ${TASKS.length}`}>
          <span>Tarea {taskIndex + 1} de {TASKS.length}</span>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${((taskIndex + 1) / TASKS.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <section className="task-instruction" aria-labelledby="task-title">
        <div className="task-number" aria-hidden="true">{taskIndex + 1}</div>
        <div>
          <p>Tu tarea</p>
          <h1 id="task-title">{task.instruction}</h1>
        </div>
      </section>

      <PrototypeFrame task={task} />

      {!showFeedback ? (
        <div className="task-actions">
          <p>Realiza la tarea en el prototipo y avísanos cuando termines.</p>
          <button className="primary-button" type="button" onClick={openFeedback}>
            Terminé la tarea
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      ) : null}

      <div ref={feedbackRef}>
        {showFeedback ? (
          <FeedbackForm
            key={taskIndex}
            isLastTask={taskIndex === TASKS.length - 1}
            onContinue={continueTest}
          />
        ) : null}
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
