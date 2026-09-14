import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import Model from './Model'


function Scene({ colour, lensColour, attach1Visible }) {
    
    return (
    <Canvas
        gl={{ antialias: true }}
    >
        <ambientLight intensity={0.35} />

        <directionalLight
            position={[4, 5, 4]}
            intensity={2.8}
            color="#fff7e8"
        />
        <directionalLight
            position={[-4, 2, 2]}
            intensity={1.8}
            color="#b9d8ff"
        />
        <pointLight
            position={[0, 1, 2.5]}
            intensity={1.5}
            distance={5}
            color="#ffffff"
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