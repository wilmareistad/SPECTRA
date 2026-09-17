import { useEffect, useRef } from 'react'
import { LoopOnce } from 'three'

const ATTACHMENT_PREFIXES = [
  'attach_laser_',
  'attach_top_',
  'attach_zoom_',
  'attach_solarpanel_',
  'attach_scope_',
  'attach_tactical_rails_',
]

const ANIMATION_NAMES = {
  laser: ['attach_laser_animation'],
  lidar: ['top_attach_animation'],
  zoom: ['zoom_attach_animation'],
  solar: ['Animation'],
  scope: [
    'Attach_Animation_Hinge',
    'Attatch_Animation_Scope_1',
    'Attach_SCOPE_Animation_Dials',
    'Attach_Animation_SCOPE_ring',
  ],
}

function useModelAttachments(scene, actions, selectedAttachments) {
  const previousAttachments = useRef([])

  useEffect(() => {
    const selectedPrefixes = selectedAttachments.map((attachment) => {
      if (attachment === 'solar') {
        return ['attach_solarpanel_', 'attach_tactical_rails_']
      }

      if (attachment === 'lidar') {
        return ['attach_top_']
      }

      if (attachment === 'laser') {
        return ['attach_laser_', 'attach_tactical_rails_']
      }

      return [`attach_${attachment}_`]
    })

    scene.traverse((object) => {
      const objectName = object.name.toLowerCase()
      const isAttachment = ATTACHMENT_PREFIXES.some((prefix) => objectName.startsWith(prefix))

      if (isAttachment) {
        object.visible = selectedPrefixes.flat().some((prefix) => objectName.startsWith(prefix))
      }
    })
  }, [selectedAttachments, scene])

  useEffect(() => {
    const newlySelected = selectedAttachments.filter(
      (attachment) => !previousAttachments.current.includes(attachment),
    )

    newlySelected.forEach((attachment) => {
      ANIMATION_NAMES[attachment]?.forEach((animationName) => {
        const action = actions[animationName]
        if (!action) return

        action.reset().setLoop(LoopOnce, 1)
        action.clampWhenFinished = true
        action.play()
      })
    })

    previousAttachments.current
      .filter((attachment) => !selectedAttachments.includes(attachment))
      .forEach((attachment) => {
        ANIMATION_NAMES[attachment]?.forEach((animationName) => actions[animationName]?.stop())
      })

    previousAttachments.current = selectedAttachments
  }, [actions, selectedAttachments])

  useEffect(() => () => {
    Object.values(actions).forEach((action) => action.stop())
  }, [actions])
}

export default useModelAttachments