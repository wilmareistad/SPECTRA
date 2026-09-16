import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import Model from './Model'


const DEFAULT_CAMERA_POSITION = [-1.78, 1.25, 4.28]
const DEFAULT_CAMERA_TARGET = [0, 0.1, 0]
const MODEL_SCALES = {
    Small: 0.98,
    Standard: 1,
    Large: 1.02,
}
const CAMERA_FOCUSES = {
    laser: { position: [4, 1.8, 6], target: [0.15, 0.4, 0] },
    top: { position: [0, 3.3, 6], target: [0, 0.65, 0] },
    zoom: { position: [3.2, 2, 6.2], target: [0.1, 0.45, 0] },
    scope: { position: [-2.8, 2.05, 8.2], target: [-0.05, 0.5, 0] },
    'solar panel': { position: [-4.8, 2.3, 8.5], target: [-0.15, 0.55, 0] },
}

// function DisplayCube() {
//     const { scene } = useGLTF('/kub.glb')
//
//     return <primitive object={scene} position={[0, -1.35, 0]} scale={[2.7, 1.35, 2.7]} />
// }
//
// useGLTF.preload('/kub.glb')

function CameraController({ selectedAttachments, cameraResetKey }) {
    const controlsRef = useRef(null)
    const cameraPositionTarget = useRef(new Vector3(...DEFAULT_CAMERA_POSITION))
    const cameraLookTarget = useRef(new Vector3(...DEFAULT_CAMERA_TARGET))
    const isCameraTransitioning = useRef(false)

    useFrame((_, delta) => {
        if (!isCameraTransitioning.current || !controlsRef.current) return

        const controls = controlsRef.current
        const smoothing = 1 - Math.exp(-5 * delta)

        controls.object.position.lerp(cameraPositionTarget.current, smoothing)
        controls.target.lerp(cameraLookTarget.current, smoothing)
        controls.update()

        if (
            controls.object.position.distanceTo(cameraPositionTarget.current) < 0.01
            && controls.target.distanceTo(cameraLookTarget.current) < 0.01
        ) {
            isCameraTransitioning.current = false
        }
    })

    useEffect(() => {
        const controls = controlsRef.current
        if (!controls) return

        cameraPositionTarget.current.set(...DEFAULT_CAMERA_POSITION)
        cameraLookTarget.current.set(...DEFAULT_CAMERA_TARGET)
        isCameraTransitioning.current = true
    }, [cameraResetKey])

    useEffect(() => {
        const selectedAttachment = selectedAttachments.at(-1)
        const focus = CAMERA_FOCUSES[selectedAttachment]

        if (!focus) {
            cameraPositionTarget.current.set(...DEFAULT_CAMERA_POSITION)
            cameraLookTarget.current.set(...DEFAULT_CAMERA_TARGET)
        } else {
            cameraPositionTarget.current.set(...focus.position)
            cameraLookTarget.current.set(...focus.target)
        }

        isCameraTransitioning.current = true
    }, [selectedAttachments])

    return (
        <OrbitControls
            ref={controlsRef}
            minDistance={4.8}
            maxDistance={10}
            enablePan={false}
            onStart={() => {
                isCameraTransitioning.current = false
            }}
        />
    )
}

function Scene({ colour, lensColour, size, selectedAttachments, cameraResetKey }) {
    
    return (
    <Canvas
        gl={{ antialias: true }}
        camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }}
    >
        <Environment preset="studio" environmentIntensity={0.75} />
        <ambientLight intensity={0.1} />

        <directionalLight
            position={[4, 5, 5]}
            intensity={1}
            color="#fff7e8"
        />
        <directionalLight
            position={[-5, 2, 3]}
            intensity={1}
            color="#b9d8ff"
        />
        <directionalLight
            position={[0, 2.5, -5]}
            intensity={1}
            color="#ffffff"
        />

        {/* <DisplayCube /> */}

        <Center position={[0, 0.7, 0]}>
            <Model
                colour={colour}
                lensColour={lensColour}
                scale={MODEL_SCALES[size]}
                selectedAttachments={selectedAttachments}
            />
        </Center>

        <CameraController
            selectedAttachments={selectedAttachments}
            cameraResetKey={cameraResetKey}
        />

    </Canvas>
  )
}

export default Scene