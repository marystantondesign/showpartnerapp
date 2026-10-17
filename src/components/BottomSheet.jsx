import { useEffect, useRef, useState } from 'react'
import { useIsTablet } from '../hooks/useIsTablet'

export default function BottomSheet({ open, onClose, children, height = '85%', noPadding = false, footer }) {
  const isTablet   = useIsTablet()
  const sheetRef   = useRef(null)
  const isDragging = useRef(false)
  const startY     = useRef(0)
  const startTime  = useRef(0)
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  // ── Tablet: centered modal ─────────────────────────────────────────────
  if (isTablet) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      >
        <div
          className="relative bg-greige dark:bg-greige-dark rounded-2xl overflow-hidden flex flex-col"
          style={{ width: '90vw', maxWidth: 560, maxHeight: '82dvh' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 z-10 outline-none"
            style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            CLOSE
          </button>
          {/* min-h-0 lets the flex child shrink so overflow-y-auto actually scrolls */}
          <div className={`flex-1 overflow-y-auto min-h-0 ${noPadding ? '' : 'px-6 pt-6 pb-8'}`}>
            {children}
          </div>
          {footer && (
            <div className="flex-shrink-0 border-t border-[#E0DDD8] dark:border-[#2E2B28] px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Mobile: slide-up sheet ─────────────────────────────────────────────
  function onHandlePointerDown(e) {
    isDragging.current = true
    startY.current = e.clientY
    startTime.current = Date.now()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onHandlePointerMove(e) {
    if (!isDragging.current) return
    const delta = e.clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  function onHandlePointerUp(e) {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientY - startY.current
    const elapsed = Math.max(1, Date.now() - startTime.current)
    const velocity = delta / elapsed

    const sheetHeight = sheetRef.current?.offsetHeight ?? 300
    if (delta > sheetHeight * 0.25 || velocity > 0.5) {
      onClose()
      return
    }
    setDragY(0)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0 }}
    >
      {/* Full-size dimmed backdrop — tap anywhere outside the sheet to close */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={sheetRef}
        className="relative bg-greige dark:bg-greige-dark rounded-t-2xl flex flex-col"
        style={{
          height,
          maxHeight: '92dvh',
          transform: `translateY(${dragY}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.2s ease-out',
          willChange: 'transform',
        }}
      >
        {/* Drag handle — swipe down to dismiss */}
        <div
          className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab"
          style={{ touchAction: 'none' }}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
        >
          <div className="w-8 h-1 rounded-full bg-[#C8C4BF] dark:bg-[#3A3632]" />
        </div>
        <div className={`flex-1 overflow-y-auto min-h-0 ${noPadding ? '' : 'px-4 pb-6'}`}>
          {children}
        </div>
        {footer && (
          <div className="flex-shrink-0 border-t border-[#E0DDD8] dark:border-[#2E2B28] px-4 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
