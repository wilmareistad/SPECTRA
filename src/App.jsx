import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene'

function App() {
  const [colour, setColour] = useState('white')
  const [lensColour, setLensColour] = useState('original')
  const [size, setSize] = useState('Standard')
  const [selectedAttachments, setSelectedAttachments] = useState([])
  const [cameraResetKey, setCameraResetKey] = useState(0)

  function resetConfiguration() {
    setColour('white')
    setLensColour('original')
    setSize('Standard')
    setSelectedAttachments([])
    setCameraResetKey((value) => value + 1)
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
          size={size}
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
