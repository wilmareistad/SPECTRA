import { useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene' 
import { COLOURS, LENSCOLOURS } from './components/ConfiguratorPanel/colours'
import { ATTACHMENTS } from './components/ConfiguratorPanel/pricing'

const ENABLE_INTRO_VIDEO = true

function App() {
  const [showIntro, setShowIntro] = useState(ENABLE_INTRO_VIDEO)
  const [introExiting, setIntroExiting] = useState(false)
  const [colour, setColour] = useState('white')
  const [lensColour, setLensColour] = useState('original')
  const [size, setSize] = useState('Standard')
  const [selectedAttachments, setSelectedAttachments] = useState([])
  const [cameraResetKey, setCameraResetKey] = useState(0)
  const introVideoRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [showIntro])

  function resetConfiguration() {
    setColour('white')
    setLensColour('original')
    setSize('Standard')
    setSelectedAttachments([])
    setCameraResetKey((value) => value + 1)
  }

  function shuffleConfiguration() {
    const randomColour = COLOURS[Math.floor(Math.random() * COLOURS.length)]
    const randomLensColour = LENSCOLOURS[Math.floor(Math.random() * LENSCOLOURS.length)]
    const shuffledAttachments = [...ATTACHMENTS].sort(() => Math.random() - 0.5)
    const attachmentCount = Math.floor(Math.random() * (ATTACHMENTS.length + 1))

    setColour(randomColour.name)
    setLensColour(randomLensColour.name)
    setSelectedAttachments(
      shuffledAttachments
        .slice(0, attachmentCount)
        .map((attachment) => attachment.name.toLowerCase()),
    )
  }

  function finishIntro() {
    setIntroExiting(true)

    setTimeout(() => {
      setShowIntro(false)
    }, 800)
  }

  function enableIntroSound() {
    const video = introVideoRef.current

    if (!video) return

    video.muted = false
    video.play().catch(() => {})
  }

  const introIsActive = showIntro && !introExiting

  return (
    <>
    {showIntro && (
      <div
        className={`${styles.heroOverlay} ${introExiting ? styles.exiting : ''}`}
        onClick={enableIntroSound}
      >
        <video
          ref={introVideoRef}
          autoPlay
          muted
          preload="auto"
          playsInline
          onEnded={finishIntro}
          onError={finishIntro}
          src="/assets/spectra_header_vid_01.mov"
        />
      </div>
    )}

    <main className={`${styles.app} ${introIsActive ? styles.waitingForIntro : ''}`}>
      <header className={styles.header}>
        <img className={styles.logo} src="/assets/LOGGA.svg" alt="SPECTRA" />

        <div className={styles.headerActions}>
          <button
            className={styles.iconButton}
            type="button"
            onClick={resetConfiguration}
            aria-label="Reset configuration"
            title="Reset configuration"
          >
            <span className={`${styles.buttonIcon} ${styles.refreshIcon}`} />
          </button>

          <button
            className={styles.iconButton}
            type="button"
            onClick={shuffleConfiguration}
            aria-label="Shuffle configuration"
            title="Shuffle configuration"
          >
            <span className={`${styles.buttonIcon} ${styles.shuffleIcon}`} />
          </button>
        </div>
      </header>

      <div className={styles.modelContainer}>
        <Scene
          colour={colour}
          lensColour={lensColour}
          size={size}
          selectedAttachments={selectedAttachments}
          cameraResetKey={cameraResetKey}
          isIntroActive={introIsActive}
        />
      </div>

      <div className={styles.componentsContainer}>
        <ConfiguratorPanel
          colour={colour}
          onColourChange={setColour}
          lensColour={lensColour}
          onLensColourChange={setLensColour}
          size={size}
          onSizeChange={setSize}
          selectedAttachments={selectedAttachments}
          onAttachmentSelect={setSelectedAttachments}
        />
      </div>
    </main>
    </>
  )
}

export default App
