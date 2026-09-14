import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import Model from './Model'


function Scene({ colour, lensColour, attach1Visible }) {
    
    return (
    <Canvas
        gl={{ antialias: true }}
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