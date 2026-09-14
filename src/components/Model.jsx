import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce } from 'three'
import { COLOURS, LENSCOLOURS } from './ConfiguratorPanel/colours'

function Model({ colour, lensColour, attach1Visible, ...modelProps }) {
  const { scene, animations, materials, parser } = useGLTF('/spectra_david_v1.glb')
  const { actions, mixer } = useAnimations(animations, scene)
  const originalLensColours = useRef(new Map())
  const glassesLensMaterial = useRef(null)
  const frameMaterials = useRef({ white: null, black: null })

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
    let cancelled = false

    const applyFrameMaterial = (frameMaterial) => {
      if (!frameMaterial || cancelled) return

      scene.traverse((object) => {
        if (!object.isMesh) return
        if (!['glasses_frame', 'glasses_frame_arms'].includes(object.name)) return

        object.material = frameMaterial
      })

      frameMaterial.color.set(
        colour === 'black' || colour === 'white'
          ? '#ffffff'
          : selectedColour?.hex ?? '#ffffff',
      )
    }

    scene.traverse((object) => {
      if (!object.isMesh) return
      if (!['glasses_frame', 'glasses_frame_arms'].includes(object.name)) return
      if (!frameMaterials.current.white && object.material) {
        frameMaterials.current.white = object.material
      }
    })

    const updateFrameMaterial = async () => {
      if (colour === 'black' && !frameMaterials.current.black) {
        frameMaterials.current.black = materials.texture_frame_combined_black
          ?? await parser?.getDependency('material', 5)
      }

      const frameMaterial = colour === 'black'
        ? frameMaterials.current.black ?? frameMaterials.current.white
        : frameMaterials.current.white

      applyFrameMaterial(frameMaterial)
    }

    updateFrameMaterial()

    return () => {
      cancelled = true
    }
  }, [colour, materials, parser, scene])

  useEffect(() => {
    const selectedLensColour = LENSCOLOURS.find((item) => item.name === lensColour)

    scene.traverse((object) => {
      if (!object.isMesh || object.name !== 'glasses_glass') return

      const objectMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      objectMaterials
        .filter((material) => material.name === 'glass')
        .forEach((material) => {
          if (!glassesLensMaterial.current) {
            glassesLensMaterial.current = material.clone()
            material.color.set('#ffffff')
            object.material = glassesLensMaterial.current
          }

          const glassesMaterial = glassesLensMaterial.current

          if (!originalLensColours.current.has(glassesMaterial)) {
            originalLensColours.current.set(glassesMaterial, glassesMaterial.color.clone())
          }

          if (selectedLensColour?.name === 'original') {
            glassesMaterial.color.copy(originalLensColours.current.get(glassesMaterial))
          } else {
            glassesMaterial.color.set(selectedLensColour?.hex ?? '#ffffff')
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
      'attach_laser_animation',
      'top_attach_animation',
      'zoom_attach_animation',
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