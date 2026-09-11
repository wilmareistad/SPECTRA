import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import Model from './Model'


function Scene({ colour, lensColour, attach1Visible }) {
    
    return (
    <Canvas>
        <ambientLight intensity={1} />

        <directionalLight
            position={[5, 5, 5]}
            intensity={2}
        />

        <Center position={[0, 0.7, 0]}>
            <Model
                colour={colour}
                lensColour={lensColour}
                attach1Visible={attach1Visible}
            />
        </Center>

        <OrbitControls
            minDistance={3}
            maxDistance={8}
            enablePan={false}
        />

    </Canvas>
  )
}

export default Scene