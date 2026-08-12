import Paper, { type PaperProps } from '@mui/material/Paper'
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'

const HANDLE_ATTR = 'data-app-dialog-drag-handle'

/** Min visible edge of the paper that must stay inside the viewport. */
const EDGE_MARGIN = 48

export const APP_DIALOG_DRAG_HANDLE_ATTR = HANDLE_ATTR

type DragSession = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}

function clampOffset(x: number, y: number, el: HTMLElement | null) {
  if (!el) {
    return { x, y }
  }

  const rect = el.getBoundingClientRect()
  // Strip current translate so clamp is relative to the resting layout box.
  const layoutLeft = rect.left - x
  const layoutTop = rect.top - y
  const { width, height } = rect

  const minX = EDGE_MARGIN - width - layoutLeft
  const maxX = window.innerWidth - EDGE_MARGIN - layoutLeft
  const minY = EDGE_MARGIN - height - layoutTop
  const maxY = window.innerHeight - EDGE_MARGIN - layoutTop

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  }
}

export type DraggablePaperProps = PaperProps & {
  /** When this becomes true (dialog open), offset resets. */
  resetKey: boolean
}

/**
 * Dialog Paper dragged from an element marked with `data-app-dialog-drag-handle`.
 * Buttons / links inside the handle do not start a drag.
 *
 * Drag offset uses an **inline** `transform` so `stylis-plugin-rtl` cannot mirror it.
 */
export const DraggablePaper = forwardRef<HTMLDivElement, DraggablePaperProps>(
  function DraggablePaper({ resetKey, sx, style, onPointerDown, ...props }, ref) {
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const paperRef = useRef<HTMLDivElement | null>(null)
    const dragRef = useRef<DragSession | null>(null)

    useEffect(() => {
      if (resetKey) {
        setOffset({ x: 0, y: 0 })
      }
    }, [resetKey])

    useEffect(() => {
      const onMove = (event: PointerEvent) => {
        const session = dragRef.current
        if (!session || event.pointerId !== session.pointerId) {
          return
        }

        setOffset(
          clampOffset(
            session.originX + (event.clientX - session.startX),
            session.originY + (event.clientY - session.startY),
            paperRef.current,
          ),
        )
      }

      const onUp = (event: PointerEvent) => {
        if (dragRef.current?.pointerId === event.pointerId) {
          dragRef.current = null
        }
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }
    }, [])

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented || event.button !== 0) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      if (!target.closest(`[${HANDLE_ATTR}]`)) {
        return
      }

      if (target.closest('button, a, [href], [role="button"], input, textarea, select')) {
        return
      }

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      }
      event.preventDefault()
    }

    const dragStyle: CSSProperties = {
      ...style,
      transform: `translate(${offset.x}px, ${offset.y}px)`,
    }

    return (
      <Paper
        {...props}
        ref={(node) => {
          paperRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        style={dragStyle}
        onPointerDown={handlePointerDown}
        sx={sx}
      />
    )
  },
)
