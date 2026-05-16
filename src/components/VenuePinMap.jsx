import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon broken by bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DEFAULT_LAT = 48.8648
const DEFAULT_LNG = 2.3490
const DEFAULT_ZOOM = 17

export default function VenuePinMap({ initialPin, onSave, onClose }) {
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const markerRef = useRef(null)
  const [pin, setPin] = useState(initialPin || { lat: DEFAULT_LAT, lng: DEFAULT_LNG })
  const [address, setAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (leafletMap.current) return

    const map = L.map(mapRef.current, {
      center: [pin.lat, pin.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([pin.lat, pin.lng], { draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      setPin({ lat, lng })
      reverseGeocode(lat, lng)
    })

    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      setPin({ lat, lng })
      reverseGeocode(lat, lng)
    })

    markerRef.current = marker
    leafletMap.current = map

    reverseGeocode(pin.lat, pin.lng)

    return () => {
      map.remove()
      leafletMap.current = null
    }
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
      }
    } catch {}
    setSearching(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#1A1816', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2E2B28', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 10, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580' }}>
            DROP A PIN — VENUE LOCATION
          </p>
          <button
            onClick={onClose}
            style={{ fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888580', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            CANCEL
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search address..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid #3A3632',
              borderRadius: 6, padding: '8px 10px', fontSize: 13,
              fontFamily: 'Inter, system-ui', color: '#F0EDE8', outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              fontSize: 9, fontFamily: 'Inter, system-ui', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
              padding: '0 12px', background: 'none', cursor: 'pointer', flexShrink: 0,
            }}
          >
            {searching ? '...' : 'GO'}
          </button>
        </form>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1 }} />

      {/* Footer — address + save */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #2E2B28', flexShrink: 0 }}>
        {address ? (
          <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'Inter, system-ui', color: '#888580', lineHeight: 1.4 }}>
            {address}
          </p>
        ) : null}
        <button
          onClick={() => onSave({ ...pin, address })}
          style={{
            width: '100%', padding: '12px', fontSize: 10, fontFamily: 'Inter, system-ui',
            letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0EDE8',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'none', cursor: 'pointer',
          }}
        >
          Save Pin
        </button>
      </div>
    </div>
  )
}
