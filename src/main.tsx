import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/open-sans/latin-400.css'
import '@fontsource/open-sans/latin-600.css'
import '@fontsource/open-sans/latin-700.css'
import '@fontsource/open-sans/latin-800.css'
import './styles.css'

type Task = {
  instruction: string
  prototypeUrl: string
}

type View = 'welcome' | 'task-intro' | 'prototype' | 'feedback' | 'complete'

// Reemplaza únicamente estos valores cuando tengas los datos de la Tarea 2.
const TASKS: Task[] = [
  {
    instruction:
      'Cambia a $5,000.00 el límite diario para Depósito del comisionista con ID 663542.',
    prototypeUrl: 'https://limitesoperativos.vercel.app/',
  },
  {
    instruction: '[PEGA AQUÍ LA SEGUNDA TAREA]',
    prototypeUrl: '[PEGA AQUÍ LA SEGUNDA URL DE VERCEL]',
  },
]

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5h6M9 3h6v4H9V3Z" />
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
  </svg>
)

const FlagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 21V4m0 0c5-3 8 3 14 0v10c-6 3-9-3-14 0" />
  </svg>
)

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button className="primary-button" type="button" onClick={onClick}>
      {children}
      <ArrowIcon />
    </button>
  )
}

function Progress({ taskIndex }: { taskIndex: number }) {
  return (
    <div className="progress" aria-label={`Tarea ${taskIndex + 1} de ${TASKS.length}`}>
      <span>Tarea {taskIndex + 1} de {TASKS.length}</span>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${((taskIndex + 1) / TASKS.length) * 100}%` }} />
      </div>
    </div>
  )
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="centered-screen welcome-screen">
      <section className="welcome-content" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Bienvenido/a <span aria-hidden="true">👋</span></h1>
        <p className="welcome-lead">
          En esta prueba te pediremos realizar <strong>2 tareas dentro de un prototipo</strong>.
        </p>
        <p>
          Queremos conocer qué tan fácil resulta completar algunas acciones dentro de la plataforma.{' '}
          <strong>No estamos evaluando tus conocimientos ni tus respuestas</strong>, sino la experiencia del producto.
        </p>
        <p>
          Navega como lo harías normalmente. Si en algún momento algo no es claro, continúa de la manera que te parezca más natural.
        </p>
        <p className="duration"><strong>Duración aproximada: 5–10 minutos.</strong></p>
        <PrimaryButton onClick={onStart}>Comenzar prueba</PrimaryButton>
      </section>
    </main>
  )
}

function TaskIntro({ task, taskIndex, onStart }: { task: Task; taskIndex: number; onStart: () => void }) {
  return (
    <main className="centered-screen task-intro-screen">
      <div className="intro-progress"><Progress taskIndex={taskIndex} /></div>
      <section className="task-intro" aria-labelledby="task-title">
        <h1 id="task-title">{task.instruction}</h1>
        <p>Cuando estés listo/a, inicia la tarea y realiza la acción dentro del prototipo.</p>
        <PrimaryButton onClick={onStart}>Iniciar tarea</PrimaryButton>
      </section>
    </main>
  )
}

function isValidPrototypeUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function PrototypeSurface({ task, onFinish }: { task: Task; onFinish: () => void }) {
  const hasUrl = isValidPrototypeUrl(task.prototypeUrl)

  return (
    <main className="prototype-screen">
      {hasUrl ? (
        <iframe
          key={task.prototypeUrl}
          src={task.prototypeUrl}
          title="Prototipo interactivo"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      ) : (
        <div className="prototype-empty">
          <ClipboardIcon />
          <strong>El prototipo aparecerá aquí</strong>
          <p>Agrega la URL de Vercel en la configuración de esta tarea.</p>
        </div>
      )}

      <div className="task-reminder">
        <button type="button" aria-label={`Recordatorio de la tarea: ${task.instruction}`}>
          <ClipboardIcon />
        </button>
        <div className="task-tooltip" role="tooltip">
          <span>Tu tarea</span>
          <p>{task.instruction}</p>
        </div>
      </div>

      <button className="finish-button" type="button" onClick={onFinish}>
        <FlagIcon />
        Finalizar tarea
      </button>
    </main>
  )
}

function FeedbackModal({
  isLastTask,
  onContinue,
  onReturn,
}: {
  isLastTask: boolean
  onContinue: () => void
  onReturn: () => void
}) {
  const [rating, setRating] = useState<number | null>(null)
  const [comments, setComments] = useState('')

  return (
    <div className="modal-layer" role="presentation">
      <section className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        <button className="return-button" type="button" onClick={onReturn}>
          ← Volver al prototipo
        </button>
        <h2 id="feedback-title">Cuéntanos cómo te fue</h2>
        <p className="feedback-intro">Tu respuesta nos ayuda a mejorar la experiencia.</p>

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
          <PrimaryButton onClick={onContinue}>
            {isLastTask ? 'Finalizar prueba' : 'Siguiente tarea'}
          </PrimaryButton>
        </div>
      </section>
    </div>
  )
}

function CompletionScreen() {
  return (
    <main className="centered-screen completion-screen">
      <section className="completion-card">
        <div className="completion-mark" aria-hidden="true">✓</div>
        <h1>Prueba completada</h1>
        <p>Gracias por compartir tu experiencia. Tus respuestas fueron registradas.</p>
      </section>
    </main>
  )
}

function App() {
  const [view, setView] = useState<View>('welcome')
  const [taskIndex, setTaskIndex] = useState(0)
  const task = TASKS[taskIndex]

  const continueTest = () => {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex((current) => current + 1)
      setView('task-intro')
      return
    }
    setView('complete')
  }

  if (view === 'welcome') return <WelcomeScreen onStart={() => setView('task-intro')} />
  if (view === 'task-intro') {
    return <TaskIntro task={task} taskIndex={taskIndex} onStart={() => setView('prototype')} />
  }
  if (view === 'complete') return <CompletionScreen />

  return (
    <>
      <PrototypeSurface task={task} onFinish={() => setView('feedback')} />
      {view === 'feedback' ? (
        <FeedbackModal
          key={taskIndex}
          isLastTask={taskIndex === TASKS.length - 1}
          onContinue={continueTest}
          onReturn={() => setView('prototype')}
        />
      ) : null}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
