import { useRef, useState, useEffect } from 'react'

/**
 * Unified mouse + touch drag-to-sort hook via Pointer Events API.
 *
 * @param {(sourceId: string, targetId: string) => void} onReorder
 * @returns {{ activeId, overId, startDrag }}
 *
 * Usage:
 *   const { activeId, overId, startDrag } = usePointerSort(callback)
 *   <div data-sort-foo={id} onPointerDown={(e) => startDrag(e, id, e.currentTarget, '[data-sort-foo]', 'sortFoo')} />
 */
export function usePointerSort(onReorder) {
  // Keep callback in a ref so closures always call the latest version
  const cbRef = useRef(onReorder)
  useEffect(() => { cbRef.current = onReorder }, [onReorder])

  const [activeId, setActiveId] = useState(null)
  const [overId, setOverId] = useState(null)
  const ghostRef = useRef(null)
  const dragRef = useRef(null)

  function startDrag(e, sourceId, itemEl, targetSel, dataKey) {
    // Only primary button (mouse) or touch pointer
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()

    const rect = itemEl.getBoundingClientRect()

    // ── Ghost clone ──
    const g = itemEl.cloneNode(true)
    const cs = window.getComputedStyle(itemEl)
    Object.assign(g.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      zIndex: '9999',
      opacity: '0.9',
      pointerEvents: 'none',
      transform: 'scale(1.04)',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      borderRadius: cs.borderRadius,
      transition: 'none',
      margin: '0',
    })
    document.body.appendChild(g)
    ghostRef.current = g

    // Prevent scroll and text-selection during drag
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.touchAction = 'none'

    dragRef.current = {
      sourceId,
      targetSel,
      dataKey,
      overId: null,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }

    setActiveId(sourceId)
    setOverId(null)

    // ── Listeners ──
    function onMove(ev) {
      if (!ghostRef.current || !dragRef.current) return

      ghostRef.current.style.left = `${ev.clientX - dragRef.current.offsetX}px`
      ghostRef.current.style.top  = `${ev.clientY - dragRef.current.offsetY}px`

      // Find drop target under pointer (hide ghost so it's not in the way)
      ghostRef.current.style.visibility = 'hidden'
      const under = document.elementFromPoint(ev.clientX, ev.clientY)
      ghostRef.current.style.visibility = ''

      const targetEl = under?.closest(dragRef.current.targetSel)
      const newOverId = targetEl ? (targetEl.dataset[dragRef.current.dataKey] ?? null) : null
      if (newOverId !== dragRef.current.overId) {
        dragRef.current.overId = newOverId
        setOverId(newOverId)
      }
    }

    function onEnd() {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onEnd)
      document.removeEventListener('pointercancel', onEnd)
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.touchAction = ''

      if (!dragRef.current) return
      const { sourceId, overId } = dragRef.current
      dragRef.current = null

      if (ghostRef.current) {
        document.body.removeChild(ghostRef.current)
        ghostRef.current = null
      }

      setActiveId(null)
      setOverId(null)

      if (overId && overId !== sourceId) cbRef.current(sourceId, overId)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onEnd)
    document.addEventListener('pointercancel', onEnd)
  }

  return { activeId, overId, startDrag }
}
