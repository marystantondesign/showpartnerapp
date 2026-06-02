import { useEffect, useRef } from 'react'
import { useIsTablet } from '../hooks/useIsTablet'

export default function BottomSheet({ open, onClose, children, height = '85%', noPadding = false }) {
  const overlayRef = useRef(null)
  const isTablet   = useIsTablet()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  // ── Tablet: centered modal ────────────────────────────────────────────────
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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 z-10 outline-none"
            style={{ fontFamily: 'Inter, system-ui', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            CLOSE
          </button>
          <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'px-6 pt-6 pb-8'}`}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  // ── Mobile: slide-up sheet (unchanged) ───────────────────────────────────
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0 }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className="relative bg-greige dark:bg-greige-dark rounded-t-2xl overflow-hidden flex flex-col"
        style={{ height, maxHeight: '92dvh' }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-8 h-1 rounded-full bg-[#C8C4BF] dark:bg-[#3A3632]" />
        </div>
        <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'px-4 pb-6'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
