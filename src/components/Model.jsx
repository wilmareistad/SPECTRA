import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { COLOURS, LENSCOLOURS } from './ConfiguratorPanel/colours'
import useModelAttachments from './useModelAttachments'

async function getMaterialByName(parser, name) {
  const materialIndex = parser.json.materials?.findIndex((material) => material.name === name)
  if (materialIndex === undefined || materialIndex < 0) return null
  return parser.getDependency('material', materialIndex)
}

function Model({ colour, lensColour, selectedAttachments, ...modelProps }) {
  const { scene, animations, parser } = useGLTF('/spectra_david_v5.glb')
  const { actions } = useAnimations(animations, scene)
  const originalLensMaterial = useRef(null)
  const glassesLensMaterial = useRef(null)

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

    const isFrameMesh = (object) => {
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
      return object.name.toLowerCase().includes('glasses_frame') || objectMaterials.some(
        (material) => material?.name?.startsWith('texture_frame_combined_'),
      )
    }

    const applyFrameMaterial = (frameMaterial) => {
      if (!frameMaterial || cancelled) return

      scene.traverse((object) => {
        if (!object.isMesh || (!isFrameMesh(object) && object.name.toLowerCase() !== 'attach_top_case')) return
        object.material = frameMaterial
      })

      if (colour !== 'black') {
        frameMaterial.color.set(selectedColour?.hex ?? '#ffffff')
        frameMaterial.needsUpdate = true
      }
    }

    const updateFrameMaterial = async () => {
      const materialName = colour === 'black'
        ? 'texture_frame_combined_black'
        : 'texture_frame_combined_white'
      const baseMaterial = await getMaterialByName(parser, materialName)

      if (cancelled || !baseMaterial) return

      applyFrameMaterial(colour === 'green' ? baseMaterial.clone() : baseMaterial)
    }

    updateFrameMaterial()

    return () => {
      cancelled = true
    }
  }, [colour, parser, scene])

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