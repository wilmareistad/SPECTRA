import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { COLOURS, LENSCOLOURS } from './ConfiguratorPanel/colours'
import useModelAttachments from './useModelAttachments'

function Model({ colour, lensColour, selectedAttachments, ...modelProps }) {
  const { scene, animations, materials } = useGLTF('/spectra_david_v2.glb')
  const { actions } = useAnimations(animations, scene)
  const originalLensMaterial = useRef(null)
  const glassesLensMaterial = useRef(null)
  const frameMaterials = useRef({ white: null, black: null, colour: null })

  useModelAttachments(scene, actions, selectedAttachments)

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
        const isTopAttachmentCase = objectName === 'attach_top_case'

        if (!isFrame && !isTopAttachmentCase) return

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

    const updateFrameMaterial = () => {
      if (colour === 'black' && !frameMaterials.current.black) {
        frameMaterials.current.black = materials.texture_frame_combined_black
          ?? frameMaterials.current.white?.clone()

        if (!materials.texture_frame_combined_black && frameMaterials.current.black) {
          frameMaterials.current.black.color.set('#000000')
          frameMaterials.current.black.needsUpdate = true
        }
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
  }, [colour, materials, scene])

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

  return <primitive object={scene} {...modelProps} />
}

export default Model