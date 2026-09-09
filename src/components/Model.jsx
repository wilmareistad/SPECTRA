import { useEffect } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'

function Model() {
  const { scene, animations } = useGLTF('/spectra_test.glb')
  const { actions } = useAnimations(animations, scene)

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

  return <primitive object={scene} />
}

export default Model