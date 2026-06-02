import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DEFAULT_LAT = 48.8648
const DEFAULT_LNG = 2.3490
const DEFAULT_ZOOM = 17

export default function VenuePinMap({ initialPin, onSave, onClose, onCapture }) {
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const polygonLayer = useRef(null)
  const markerRef = useRef(null)

  // Draw mode refs (avoid stale closures in map event handler)
  const drawModeRef = useRef(false)
  const drawPointsRef = useRef([])
  const drawMarkersRef = useRef([])
  const drawPolylineRef = useRef(null)

  const [pin, setPin] = useState(initialPin || { lat: DEFAULT_LAT, lng: DEFAULT_LNG })
  const [address, setAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [loadingBuilding, setLoadingBuilding] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [drawPoints, setDrawPoints] = useState([])

  useEffect(() => {
    if (leafletMap.current) return

    const map = L.map(mapRef.current, {
      center: [pin.lat, pin.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    const marker = L.marker([pin.lat, pin.lng], { draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      setPin({ lat, lng })
      reverseGeocode(lat, lng)
    })

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng

      // Draw area mode: accumulate polygon points
      if (drawModeRef.current) {
        const newPoint = { lat, lng }
        drawPointsRef.current = [...drawPointsRef.current, newPoint]
        setDrawPoints([...drawPointsRef.current])

        // Circle marker for each point
        const m = L.circleMarker([lat, lng], {
          radius: 5, color: '#D4A853', fillColor: '#D4A853',
          fillOpacity: 1, weight: 2,
        }).addTo(map)
        drawMarkersRef.current.push(m)

        // Dashed polyline connecting points
        if (drawPolylineRef.current) drawPolylineRef.current.remove()
        const pts = drawPointsRef.current
        if (pts.length > 1) {
          drawPolylineRef.current = L.polyline(
            pts.map(p => [p.lat, p.lng]),
            { color: '#D4A853', weight: 2, dashArray: '5 4' }
          ).addTo(map)
        }
        return
      }

      // Normal mode: detect building + move marker
      await fetchBuilding(lat, lng, map)
      marker.setLatLng([lat, lng])
      setPin({ lat, lng })
      reverseGeocode(lat, lng)
    })

    markerRef.current = marker
    leafletMap.current = map
    reverseGeocode(pin.lat, pin.lng)
    // Auto-highlight building polygon on open (shows the venue building immediately)
    fetchBuilding(pin.lat, pin.lng, map)
  }, [])

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    }
  }

  async function fetchBuilding(lat, lng, map) {
    setLoadingBuilding(true)
    setSelectedBuilding(null)
    try {
      const query = `[out:json][timeout:10];(way["building"](around:30,${lat},${lng});relation["building"](around:30,${lat},${lng}););out geom;`
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      })
      const data = await res.json()

      if (data.elements?.length > 0) {
        const building = data.elements[0]
        const coords = building.geometry || []
        if (coords.length > 0) {
          if (polygonLayer.current) polygonLayer.current.remove()
          const latLngs = coords.map(p => [p.lat, p.lon])
          polygonLayer.current = L.polygon(latLngs, {
            color: '#C4614A', weight: 2.5, fillColor: '#C4614A', fillOpacity: 0.15,
          }).addTo(map || leafletMap.current)
          setSelectedBuilding({ geometry: coords, name: building.tags?.name })
        }
      } else {
        if (polygonLayer.current) { polygonLayer.current.remove(); polygonLayer.current = null }
        setSelectedBuilding(null)
      }
    } catch (e) {
      console.error(e)
    }
    setLoadingBuilding(false)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        leafletMap.current.setView([lat, lng], DEFAULT_ZOOM)
        markerRef.current.setLatLng([lat, lng])
        setPin({ lat, lng })
        setAddress(data[0].display_name)
        await fetchBuilding(lat, lng)
      }
    } catch {}
    setSearching(false)
  }

  function enterDrawMode() {
    // Clear any existing building selection
    if (polygonLayer.current) { polygonLayer.current.remove(); polygonLayer.current = null }
    setSelectedBuilding(null)
    // Clear previous draw state
    clearDrawState()
    setDrawMode(true)
    drawModeRef.current = true
  }

  function exitDrawMode() {
    clearDrawState()
    setDrawMode(false)
    drawModeRef.current = false
  }

  function clearDrawState() {
    drawMarkersRef.current.forEach(m => m.remove())
    drawMarkersRef.current = []
    if (drawPolylineRef.current) { drawPolylineRef.current.remove(); drawPolylineRef.current = null }
    drawPointsRef.current = []
    setDrawPoints([])
  }

  function closeDrawShape() {
    const pts = drawPointsRef.current
    if (pts.length < 3) return
    const map = leafletMap.current

    // Remove draw markers and polyline
    clearDrawState()

    // Finalise as polygon
    if (polygonLayer.current) polygonLayer.current.remove()
    const latLngs = pts.map(p => [p.lat, p.lng])
    polygonLayer.current = L.polygon(latLngs, {
      color: '#C4614A', weight: 2.5, fillColor: '#C4614A', fillOpacity: 0.15,
    }).addTo(map)

    const geometry = pts.map(p => ({ lat: p.lat, lon: p.lng }))
    setSelectedBuilding({ geometry, name: 'Custom area' })
    setDrawMode(false)
    drawModeRef.current = false
  }

  function geometryToSVG(geometry) {
    const lats = geometry.map(p => p.lat)
    const lons = geometry.map(p => p.lon)
    const minLat = Math.min(...lats), maxLat = Math.max(...lats)
    const minLon = Math.min(...lons), maxLon = Math.max(...lons)
    const W = 800, H = 800, PAD = 80

    const scaleX = (lon) => PAD + ((lon - minLon) / (maxLon - minLon || 1)) * (W - PAD * 2)
    const scaleY = (lat) => PAD + ((maxLat - lat) / (maxLat - minLat || 1)) * (H - PAD * 2)
    const points = geometry.map(p => `${scaleX(p.lon)},${scaleY(p.lat)}`).join(' ')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#1A1816"/>
  <line x1="${PAD}" y1="${H/2}" x2="${W-PAD}" y2="${H/2}" stroke="#2E2B28" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="${W/2}" y1="${PAD}" x2="${W/2}" y2="${H-PAD}" stroke="#2E2B28" stroke-width="1" stroke-dasharray="4 4"/>
  <polygon points="${points}" fill="#2A2724" stroke="#4A4642" stroke-width="3" stroke-linejoin="round"/>
  <text x="${W-PAD+10}" y="${PAD}" font-family="Inter,system-ui,sans-serif" font-size="18" fill="#4A4642">N↑</text>
</svg>`
  }

  function handleUseAsFloorPlan() {
    if (!selectedBuilding) return
    const svg = geometryToSVG(selectedBuilding.geometry)
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    onCapture(url, { ...pin, address, area: selectedBuilding })
  }

  const headerStatus = drawMode
    ? `${drawPoints.length} point${drawPoints.length !== 1 ? 's' : ''} placed — keep tapping to draw`
    : selectedBuilding
    ? `✓ ${selectedBuilding.name || 'Building'} selected — tap to change`
    : 'Tap a building to select it, or draw a custom area below'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#1A1816', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2E2B28', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 10, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', flex: 1, paddingRight: 12 }}>
            {headerStatus}
          </p>
          <button
            onClick={onClose}
            style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', border: 'none', background: 'none', cursor: 'pointer', outline: 'none', flexShrink: 0 }}
          >
            CANCEL
          </button>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search venue name or address…"
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid #3A3632',
              borderRadius: 6, padding: '8px 10px', fontSize: 13,
              fontFamily: 'Inter, system-ui', color: '#F0EDE8', outline: 'none',
            }}
          />
          <button type="submit" style={{
            fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
            padding: '0 12px', background: 'none', cursor: 'pointer', flexShrink: 0, outline: 'none',
          }}>
            {searching ? '...' : 'GO'}
          </button>
        </form>
      </div>

      {/* Loading indicator */}
      {loadingBuilding && (
        <div style={{ position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'rgba(26,24,22,0.9)', border: '1px solid #3A3632', borderRadius: 6, padding: '8px 14px' }}>
          <p style={{ margin: 0, fontSize: 10, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580' }}>Finding building…</p>
        </div>
      )}

      {/* Draw mode close-shape button */}
      {drawMode && drawPoints.length >= 3 && (
        <div style={{ position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
          <button
            onClick={closeDrawShape}
            style={{
              fontSize: 10, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#111', backgroundColor: '#D4A853', border: 'none', borderRadius: 6,
              padding: '9px 16px', cursor: 'pointer', outline: 'none', fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            CLOSE SHAPE →
          </button>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #2E2B28', flexShrink: 0 }}>
        {address && (
          <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'Inter, system-ui', color: '#888580', lineHeight: 1.4 }}>
            {address.split(',').slice(0, 2).join(',')}
          </p>
        )}

        {/* Draw area / cancel draw toggle */}
        {!drawMode ? (
          !selectedBuilding && (
            <button
              onClick={enterDrawMode}
              style={{
                width: '100%', padding: '10px', marginBottom: 8, fontSize: 10, fontFamily: 'Inter, system-ui',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580',
                border: '1px solid #3A3632', borderRadius: 8, background: 'none', cursor: 'pointer', outline: 'none',
              }}
            >
              Draw area instead
            </button>
          )
        ) : (
          <button
            onClick={exitDrawMode}
            style={{
              width: '100%', padding: '10px', marginBottom: 8, fontSize: 10, fontFamily: 'Inter, system-ui',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4614A',
              border: '1px solid #C4614A', borderRadius: 8, background: 'none', cursor: 'pointer', outline: 'none',
            }}
          >
            Cancel drawing
          </button>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onSave({ ...pin, address })}
            style={{
              flex: 1, padding: '12px', fontSize: 10, fontFamily: 'Inter, system-ui',
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0EDE8',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'none', cursor: 'pointer', outline: 'none',
            }}
          >
            Save pin only
          </button>

          {selectedBuilding && !drawMode && (
            <button
              onClick={handleUseAsFloorPlan}
              style={{
                flex: 1, padding: '12px', fontSize: 10, fontFamily: 'Inter, system-ui',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111',
                border: 'none', borderRadius: 8, background: '#D4A853', cursor: 'pointer', outline: 'none', fontWeight: 600,
              }}
            >
              Set up floor plan →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
