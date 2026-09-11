import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import Model from './Model'

function Scene({ colour, attach1Visible }) {
    const [isInteracting, setIsInteracting] = useState(false)
    
    return (
    <Canvas>
        <ambientLight intensity={1} />

        <directionalLight
            position={[5, 5, 5]}
            intensity={2}
        />

        <Center position={[0, 0.7, 0]}>
            <Model colour={colour} attach1Visible={attach1Visible} />
        </Center>

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