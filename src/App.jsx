import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene' 
import { COLOURS, LENSCOLOURS } from './components/ConfiguratorPanel/colours'
import { ATTACHMENTS } from './components/ConfiguratorPanel/pricing'

function App() {
  const [colour, setColour] = useState('white')
  const [lensColour, setLensColour] = useState('original')
  const [selectedAttachments, setSelectedAttachments] = useState([])
  const [cameraResetKey, setCameraResetKey] = useState(0)

  function resetConfiguration() {
    setColour('white')
    setLensColour('original')
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

  return (
    <>
    <main className={styles.app}>
      <header className={styles.header}>
        <img className={styles.logo} src="/assets/Logo_SVG.svg" alt="SPECTRA" />

        <div className={styles.headerActions}>
          <button
            className={styles.iconButton}
            type="button"
            onClick={resetConfiguration}
            aria-label="Reset configuration"
            title="Reset configuration"
          >
            <img src="/assets/Refresh_button.svg" alt="" />
          </button>

          <button
            className={styles.iconButton}
            type="button"
            onClick={shuffleConfiguration}
            aria-label="Shuffle configuration"
            title="Shuffle configuration"
          >
            <img src="/assets/Shuffle_button.svg" alt="" />
          </button>
        </div>
      </header>

      <div className={styles.modelContainer}>
        <Scene
          colour={colour}
          lensColour={lensColour}
          selectedAttachments={selectedAttachments}
          cameraResetKey={cameraResetKey}
        />
      </div>

      <div className={styles.componentsContainer}>
        <ConfiguratorPanel
          colour={colour}
          onColourChange={setColour}
          lensColour={lensColour}
          onLensColourChange={setLensColour}
          selectedAttachments={selectedAttachments}
          onAttachmentSelect={setSelectedAttachments}
        />
      </div>
    </main>
    </>
  )
}

export default App
