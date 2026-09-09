import { useState } from 'react'
import './App.module.css'
import 'components/ConfigurationPanel'
import ConfiguratorPanel from './components/ConfiguratorPanel/ConfiguratorPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  
    <main className="app">
      <div className="model-container">
      {/* 3D-modellen kommer här */}
      </div>

      <div className="components-container">
        <ConfiguratorPanel colour={colour} onColourChange={setColour} />

        {/* komponenter (lenstypepicker. osv ) kommer här */}
      </div>
    </main>

    </>
  )
}

export default App
