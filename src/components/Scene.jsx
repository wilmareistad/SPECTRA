import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from './Model'

function Scene({ colour }) {
    const [isInteracting, setIsInteracting] = useState(false)
    
    return (
    <Canvas>
        <ambientLight intensity={1} />

        <directionalLight
            position={[5, 5, 5]}
            intensity={2}
        />

        <Model colour={colour} position={[0, 0.8, 0]} />

        <OrbitControls
            autoRotate={!isInteracting}
            autoRotateSpeed={0.8}
            onStart={() => setIsInteracting(true)}
            onEnd={() => setIsInteracting(false)} 
        />

    </Canvas>
  )
}

export default Scene