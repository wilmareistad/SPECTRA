import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene'

function App() {
  const [colour, setColour] = useState('white')
  const [attach1Visible, setAttach1Visible] = useState(true)

  function resetConfiguration() {
    setColour('white')
    setAttach1Visible(true)
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
        <Scene colour={colour} attach1Visible={attach1Visible} />
      </div>

      <div className={styles.componentsContainer}>
        <ConfiguratorPanel
          colour={colour}
          onColourChange={setColour}
          attach1Visible={attach1Visible}
          onAttach1VisibilityChange={setAttach1Visible}
        />
      </div>
    </main>
    </>
  )
}

export default App
