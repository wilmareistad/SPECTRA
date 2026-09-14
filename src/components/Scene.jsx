import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import Model from './Model'


const DEFAULT_CAMERA_POSITION = [-2.5, 2, 5.8]
const DEFAULT_CAMERA_TARGET = [0, 0.7, 0]

function Scene({ colour, lensColour, selectedAttachments, cameraResetKey }) {
    const controlsRef = useRef(null)

    useEffect(() => {
        const controls = controlsRef.current
        if (!controls) return

        controls.object.position.set(...DEFAULT_CAMERA_POSITION)
        controls.target.set(...DEFAULT_CAMERA_TARGET)
        controls.update()
    }, [cameraResetKey])
    
    return (
    <Canvas
        gl={{ antialias: true }}
        camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }}
    >
        <Environment preset="studio" />
        <ambientLight intensity={0.12} />

        <directionalLight
            position={[4, 5, 5]}
            intensity={1.6}
            color="#fff7e8"
        />
        <directionalLight
            position={[-5, 2, 3]}
            intensity={0.7}
            color="#b9d8ff"
        />
        <directionalLight
            position={[0, 4, -5]}
            intensity={1.1}
            color="#ffffff"
        />

        <Center position={[0, 0.7, 0]}>
            <Model
                colour={colour}
                lensColour={lensColour}
                selectedAttachments={selectedAttachments}
            />
        </Center>

        <OrbitControls
            ref={controlsRef}
            minDistance={3}
            maxDistance={8}
            enablePan={false}
        />

    </Canvas>
  )
}

export default Scene