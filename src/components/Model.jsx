import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce } from 'three'
import { COLOURS, LENSCOLOURS } from './ConfiguratorPanel/colours'

function Model({ colour, lensColour, attach1Visible, ...modelProps }) {
  const { scene, animations } = useGLTF('/spectra_test.glb')
  const { actions, mixer } = useAnimations(animations, scene)
  const originalLensColours = useRef(new Map())

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
    const selectedLensColour = LENSCOLOURS.find((item) => item.name === lensColour)

    scene.traverse((object) => {
      if (!object.isMesh) return

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials
        .filter((material) => material.name === 'Material.001')
        .forEach((material) => {
          if (!originalLensColours.current.has(material)) {
            originalLensColours.current.set(material, material.color.clone())
          }

          if (selectedLensColour?.name === 'original') {
            material.color.copy(originalLensColours.current.get(material))
          } else {
            material.color.set(selectedLensColour?.hex ?? '#ffffff')
          }
        })
    })
  }, [lensColour, scene])

  useEffect(() => {
    const attach1 = scene.getObjectByName('Attach_1_Hinge')

    if (attach1) attach1.visible = attach1Visible
  }, [attach1Visible, scene])

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

    const finishedActions = new Set()
    let phase = 'forward'

    const playReverse = () => {
      phase = 'reverse'
      finishedActions.clear()

      activeActions.forEach((action) => {
        action.time = action.getClip().duration
        action.timeScale = -1
        action.paused = false
        action.play()
      })
    }

    const handleFinished = (event) => {
      if (!activeActions.includes(event.action)) return

      finishedActions.add(event.action)

      if (finishedActions.size !== activeActions.length) return

      if (phase === 'forward') {
        playReverse()
      }
    }

    mixer.addEventListener('finished', handleFinished)

    activeActions.forEach((action) => {
      action
        .reset()
        .setLoop(LoopOnce, 1)
      action.clampWhenFinished = true
      action.play()
    })

    return () => {
      mixer.removeEventListener('finished', handleFinished)
      activeActions.forEach((action) => action.stop())
    }
  }, [actions, mixer])

  return <primitive object={scene} {...modelProps} />
}

export default Model