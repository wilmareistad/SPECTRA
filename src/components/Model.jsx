import { useEffect } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { COLOURS } from './ConfiguratorPanel/colours'

function Model({ colour, ...modelProps }) {
  const { scene, animations } = useGLTF('/spectra_test.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    const modelParts = []

    scene.traverse((object) => {
      if (!object.isMesh) return

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      modelParts.push({
        node: object.name,
        type: object.type,
        visible: object.visible,
        materials: materials.map((material) => ({
          name: material.name,
          type: material.type,
          color: material.color?.getHexString(),
          roughness: material.roughness,
          metalness: material.metalness,
          opacity: material.opacity,
          transparent: material.transparent,
        })),
      })
    })

    console.groupCollapsed('[SPECTRA] GLTF model parameters')
    console.log('Animations:', animations.map(({ name }) => name))
    console.table(modelParts)
    console.log('Raw scene:', scene)
    console.groupEnd()
  }, [animations, scene])

  useEffect(() => {
    const selectedColour = COLOURS.find((item) => item.name === colour)
    const frameColour = selectedColour?.hex ?? '#ffffff'

    scene.traverse((object) => {
      if (!object.isMesh) return

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials
        .filter((material) => material.name === 'white frame')
        .forEach((material) => material.color.set(frameColour))
    })
  }, [colour, scene])

  useEffect(() => {
    const actionNames = [
      'Attach_1_HingeAction',
      'Attach_1Action',
      'CubeAction',
      'CylinderAction',
    ]

    const activeActions = actionNames
      .map((name) => actions[name])
      .filter(Boolean)

    activeActions.forEach((action) => {
      action.reset().play()
    })

    return () => {
      activeActions.forEach((action) => action.stop())
    }
  }, [actions])

  return <primitive object={scene} {...modelProps} />
}

export default Model