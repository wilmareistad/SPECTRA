import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import Model from './Model'


const DEFAULT_CAMERA_POSITION = [-2.5, 2, 5.8]
const DEFAULT_CAMERA_TARGET = [0, 0.7, 0]
const CAMERA_FOCUSES = {
    laser: { position: [3.6, 1.7, 5.2], target: [0.15, 0.75, 0] },
    top: { position: [0, 3.1, 5.2], target: [0, 0.95, 0] },
    zoom: { position: [2.9, 1.9, 5.4], target: [0.1, 0.8, 0] },
}

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
            minDistance={3}
            maxDistance={8}
            enablePan={false}
        />
    )
}

function Scene({ colour, lensColour, selectedAttachments, cameraResetKey }) {
    
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

        {/* ta bort sen */}

        <mesh position={[4, 5, 5]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#fff7e8" />
        </mesh>
        <mesh position={[-5, 2, 3]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#b9d8ff" />
        </mesh>
        <mesh position={[0, 2.5, -5]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
        </mesh>
{/* hit */}
        <Center position={[0, 0.7, 0]}>
            <Model
                colour={colour}
                lensColour={lensColour}
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