import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce } from 'three'
import { COLOURS, LENSCOLOURS } from './ConfiguratorPanel/colours'

function Model({ colour, lensColour, selectedAttachments, ...modelProps }) {
  const { scene, animations, materials, parser } = useGLTF('/spectra_david_v1.glb')
  const { actions } = useAnimations(animations, scene)
  const originalLensMaterial = useRef(null)
  const glassesLensMaterial = useRef(null)
  const frameMaterials = useRef({ white: null, black: null, colour: null })
  const previousAttachments = useRef([])

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
        const objectName = object.name.toLowerCase()
        const isFrame = ['glasses_frame', 'glasses_frame_arms'].includes(objectName)
        const isAttachment = objectName.startsWith('attach_top_')

        if (!isFrame && !isAttachment) return

        object.material = frameMaterial
      })

      if (colour !== 'black') {
        frameMaterial.color.set(selectedColour?.hex ?? '#ffffff')
        frameMaterial.needsUpdate = true
      }
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

      if (colour !== 'black' && !frameMaterials.current.colour) {
        frameMaterials.current.colour = frameMaterials.current.white?.clone()
      }

      const frameMaterial = colour === 'black'
        ? frameMaterials.current.black ?? frameMaterials.current.white
        : frameMaterials.current.colour ?? frameMaterials.current.white

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
          if (!originalLensMaterial.current) {
            originalLensMaterial.current = material
            glassesLensMaterial.current = material.clone()
          }

          if (selectedLensColour?.name === 'original') {
            object.material = originalLensMaterial.current
          } else {
            const glassesMaterial = glassesLensMaterial.current
            object.material = glassesMaterial
            glassesMaterial.color.set(selectedLensColour?.hex ?? '#ffffff')
            glassesMaterial.needsUpdate = true
          }
        })
    })
  }, [lensColour, scene])

  useEffect(() => {
    const attachmentPrefixes = ['attach_laser_', 'attach_top_', 'attach_zoom_']
    const selectedPrefixes = selectedAttachments.map(
      (attachment) => `attach_${attachment}_`,
    )

    scene.traverse((object) => {
      const objectName = object.name.toLowerCase()
      const isAttachment = attachmentPrefixes.some((prefix) => objectName.startsWith(prefix))

      if (isAttachment) {
        object.visible = selectedPrefixes.some((prefix) => objectName.startsWith(prefix))
      }
    })
  }, [selectedAttachments, scene])

  useEffect(() => {
    const animationNames = {
      laser: 'attach_laser_animation',
      top: 'top_attach_animation',
      zoom: 'zoom_attach_animation',
    }
    const newlySelected = selectedAttachments.filter(
      (attachment) => !previousAttachments.current.includes(attachment),
    )

    newlySelected.forEach((attachment) => {
      const action = actions[animationNames[attachment]]
      if (!action) return

      action.reset().setLoop(LoopOnce, 1).play()
    })

    previousAttachments.current
      .filter((attachment) => !selectedAttachments.includes(attachment))
      .forEach((attachment) => actions[animationNames[attachment]]?.stop())

    previousAttachments.current = selectedAttachments
  }, [actions, selectedAttachments])

  useEffect(() => () => {
    Object.values(actions).forEach((action) => action.stop())
  }, [actions])

  return <primitive object={scene} {...modelProps} />
}

export default Model