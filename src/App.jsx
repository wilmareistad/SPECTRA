import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene'

function App() {
  const [colour, setColour] = useState('white')

  function resetConfiguration() {
    setColour('white')
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
        <Scene colour={colour} />
      </div>

      <div className={styles.componentsContainer}>
        <ConfiguratorPanel colour={colour} onColourChange={setColour} />
      </div>
    </main>
    </>
  )
}

export default App
