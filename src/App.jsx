import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene'

function App() {
  const [colour, setColour] = useState('white')
  const [lensColour, setLensColour] = useState('original')
  const [selectedAttachments, setSelectedAttachments] = useState([])

  function resetConfiguration() {
    setColour('white')
    setLensColour('original')
    setSelectedAttachments([])
  }

  return (
    <>
    <main className={styles.app}>
      <header className={styles.header}>
        <h1>SPECTRA</h1>
        <button
          className={styles.resetButton}
          type="button"
          onClick={resetConfiguration}
          aria-label="Reset configuration"
          title="Reset configuration"
        >
          &#8634;
        </button>
      </header>

      <div className={styles.modelContainer}>
        <Scene
          colour={colour}
          lensColour={lensColour}
          selectedAttachments={selectedAttachments}
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
