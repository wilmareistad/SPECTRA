import { useState } from 'react'
import styles from './App.module.css'
import './App.css'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'
import Scene from './components/Scene'

function App() {
  const [colour, setColour] = useState('white')

  return (
    <>
  
    <main className={styles.app}>
      <div className={styles.modelContainer}>
      <Scene /> 
      </div>

      <div className={styles.componentsContainer}>
        <ConfiguratorPanel colour={colour} onColourChange={setColour} />

        {/* komponenter (lenstypepicker. osv ) kommer här */}
      </div>
    </main>

    </>
  )
}

export default App
