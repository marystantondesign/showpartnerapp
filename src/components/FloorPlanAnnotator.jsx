import { useRef, useState, useEffect, useCallback } from 'react'

const COLORS = ['#C4614A', '#D4A853', '#7A9E7E', '#8A9BB0', '#111111', '#FFFFFF']
const SIZES = [2, 4, 8]

export default function FloorPlanAnnotator({ imageUrl, onClose }) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [color, setColor] = useState('#C4614A')
  const [size, setSize] = useState(4)
  const [tool, setTool] = useState('pen') // pen | eraser
  const [drawing, setDrawing] = useState(false)
  const lastPos = useRef(null)

  // Draw image onto canvas once loaded
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetWidth / ratio
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.src = imageUrl
  }, [imageUrl])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const src = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    }
  }

  const startDraw = useCallback((e) => {
    e.preventDefault()
    setDrawing(true)
    lastPos.current = getPos(e, canvasRef.current)
  }, [])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!drawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }, [drawing, color, size, tool])

  const endDraw = useCallback(() => setDrawing(false), [])

  function clearAnnotations() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    img.src = imageUrl
  }

  function saveAndClose() {
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onClose(dataUrl)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#1A1816', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: '1px solid #2E2B28', flexShrink: 0, flexWrap: 'wrap' }}>
        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 5 }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pen') }}
              style={{
                width: 20, height: 20, borderRadius: '50%', backgroundColor: c,
                border: color === c && tool === 'pen' ? '2px solid #F0EDE8' : '2px solid transparent',
                flexShrink: 0, cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Stroke size */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              style={{
                width: s * 4 + 8, height: s * 4 + 8, borderRadius: '50%', backgroundColor: '#F0EDE8',
                border: size === s ? '2px solid #D4A853' : '2px solid transparent',
                flexShrink: 0, cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Eraser */}
        <button
          onClick={() => setTool(t => t === 'eraser' ? 'pen' : 'eraser')}
          style={{
            fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: tool === 'eraser' ? '#D4A853' : '#888580', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 4px',
          }}
        >
          ERASER
        </button>

        {/* Clear */}
        <button
          onClick={clearAnnotations}
          style={{
            fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#888580', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 4px',
          }}
        >
          CLEAR
        </button>

        <div style={{ flex: 1 }} />

        {/* Done */}
        <button
          onClick={saveAndClose}
          style={{
            fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4,
            padding: '4px 10px', background: 'none', cursor: 'pointer',
          }}
        >
          DONE
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', touchAction: 'none', display: 'block', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  )
}
