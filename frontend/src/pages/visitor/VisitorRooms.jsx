import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import {
  Search, Users, Wifi, Car, Coffee, Bath, Wind, Star, SlidersHorizontal, X
} from 'lucide-react'
import api from '../../api/axios'

const AMENITY_ICONS = { WiFi: Wifi, Parking: Car, Coffee: Coffee, Spa: Bath, AC: Wind, 'Mini Bar': Coffee }
const ROOM_TYPES = ['All', 'Standard Twin', 'Deluxe King', 'Suite', 'Executive Suite', 'Penthouse']
const CAPACITIES = ['All', '2 Guests', '4 Guests', '6 Guests']

const FALLBACK_ROOMS = [
  { roomId: 1, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, amenities: ['WiFi', 'AC', 'Coffee'], description: 'Comfortable twin beds with modern amenities.', floor: 1 },
  { roomId: 2, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, amenities: ['WiFi', 'AC', 'Mini Bar', 'Coffee'], description: 'Spacious king bed room with city views.', floor: 2 },
  { roomId: 3, roomType: 'Suite', pricePerNight: 450, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Coffee'], description: 'Luxury suite with separate living area.', floor: 3 },
  { roomId: 4, roomType: 'Executive Suite', pricePerNight: 650, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'Premium executive suite with panoramic views.', floor: 4 },
  { roomId: 5, roomType: 'Penthouse', pricePerNight: 1200, capacity: 6, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'Ultimate luxury with private terrace and butler service.', floor: 5 },
  { roomId: 6, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, amenities: ['WiFi', 'AC'], description: 'Cozy room perfect for short stays.', floor: 1 },
  { roomId: 7, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, amenities: ['WiFi', 'AC', 'Mini Bar'], description: 'Elegant room with premium bedding.', floor: 2 },
  { roomId: 8, roomType: 'Suite', pricePerNight: 450, capacity: 4, amenities: ['WiFi', 'AC', 'Spa', 'Coffee'], description: 'Spacious suite ideal for families.', floor: 3 },
  { roomId: 9, roomType: 'Executive Suite', pricePerNight: 650, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking'], description: 'Boardroom-ready suite with workspace.', floor: 4 },
]

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: 32 },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
  sub: { color: '#6B7280', fontSize: '0.92rem' },
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' },
  sidebar: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 100 },
  sidebarTitle: { fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  filterGroup: { marginBottom: 20 },
  filterLabel: { fontWeight: 600, fontSize: '0.82rem', color: '#6B7280', marginBottom: 8, display: 'block' },
  filterBtn: (active) => ({
    display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10,
    border: 'none', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 4,
    background: active ? '#EAF3FF' : 'transparent', color: active ? '#3B82F6' : '#374151',
    fontWeight: active ? 600 : 500, transition: 'all 0.15s',
  }),
  priceRange: {
    width: '100%', appearance: 'none', height: 6, borderRadius: 3,
    background: '#E5E7EB', outline: 'none', cursor: 'pointer',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 },
  card: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardImg: {
    height: 180, background: 'linear-gradient(135deg, #EAF3FF, #DBEAFE)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
    position: 'relative',
  },
  badge: {
    position: 'absolute', top: 12, right: 12, background: '#22C55E', color: '#fff',
    padding: '4px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
  },
  cardBody: { padding: 20 },
  cardType: { fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 },
  cardDesc: { color: '#6B7280', fontSize: '0.82rem', marginBottom: 12, lineHeight: 1.5 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: '0.82rem', color: '#6B7280' },
  cardMetaItem: { display: 'flex', alignItems: 'center', gap: 4 },
  amenityTag: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F3F4F6', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', color: '#6B7280' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #F3F4F6' },
  price: { fontSize: '1.3rem', fontWeight: 800, color: '#3B82F6' },
  priceSub: { fontSize: '0.78rem', color: '#9CA3AF' },
}

export default function VisitorRooms() {
  const [rooms, setRooms] = useState(FALLBACK_ROOMS)
  const [filterType, setFilterType] = useState('All')
  const [filterCapacity, setFilterCapacity] = useState('All')
  const [maxPrice, setMaxPrice] = useState(1200)
  const [search, setSearch] = useState('')
  const [mobileFilter, setMobileFilter] = useState(false)

  useEffect(() => {
    api.get('/rooms').then(res => {
      const data = res.data?.length ? res.data : FALLBACK_ROOMS
      setRooms(data)
    }).catch(() => {})
  }, [])

  const filtered = rooms.filter(r => {
    const matchType = filterType === 'All' || r.roomType === filterType
    const matchCapacity = filterCapacity === 'All' || r.capacity === parseInt(filterCapacity)
    const matchPrice = (r.pricePerNight || 0) <= maxPrice
    const matchSearch = !search || r.roomType.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCapacity && matchPrice && matchSearch
  })

  const roomIcons = { 'Standard Twin': '🛏️', 'Deluxe King': '👑', 'Suite': '🏨', 'Executive Suite': '🌟', 'Penthouse': '💎' }

  const Sidebar = () => (
    <div style={s.sidebar}>
      <div style={s.sidebarTitle}><SlidersHorizontal size={18} /> Filters</div>

      <div style={s.filterGroup}>
        <span style={s.filterLabel}>Room Type</span>
        {ROOM_TYPES.map(t => (
          <button key={t} style={s.filterBtn(filterType === t)} onClick={() => setFilterType(t)}>{t}</button>
        ))}
      </div>

      <div style={s.filterGroup}>
        <span style={s.filterLabel}>Price Range: Up to ${maxPrice}/night</span>
        <input type="range" min={100} max={1200} step={50} value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))} style={s.priceRange} />
      </div>

      <div style={s.filterGroup}>
        <span style={s.filterLabel}>Capacity</span>
        {CAPACITIES.map(c => (
          <button key={c} style={s.filterBtn(filterCapacity === c)} onClick={() => setFilterCapacity(c)}>{c}</button>
        ))}
      </div>

      <button className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => { setFilterType('All'); setFilterCapacity('All'); setMaxPrice(1200); setSearch('') }}>
        Reset Filters
      </button>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Our Rooms</h1>
        <p style={s.sub}>Find the perfect room for your stay</p>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text" placeholder="Search room types..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: '0.85rem' }}
          />
        </div>
        <button className="btn-secondary btn-sm" style={{ display: 'none' }} id="filter-toggle" onClick={() => setMobileFilter(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {mobileFilter && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setMobileFilter(false)}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, background: '#fff', padding: 24, overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>Filters</span>
              <button onClick={() => setMobileFilter(false)}><X size={20} /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div style={s.layout}>
        <div className="visitor-sidebar-desktop"><Sidebar /></div>
        <div>
          <div style={{ marginBottom: 16, color: '#6B7280', fontSize: '0.85rem' }}>
            Showing {filtered.length} {filtered.length === 1 ? 'room' : 'rooms'}
          </div>
          <div style={s.grid}>
            {filtered.map(room => (
              <div key={room.roomId} style={s.card}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div style={s.cardImg}>
                  {roomIcons[room.roomType] || '🛏️'}
                  <div style={s.badge}>Available</div>
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardType}>{room.roomType}</div>
                  <div style={s.cardDesc}>{room.description}</div>
                  <div style={s.cardMeta}>
                    <span style={s.cardMetaItem}><Users size={14} /> {room.capacity} Guests</span>
                    <span style={s.cardMetaItem}><Star size={14} style={{ color: '#FACC15' }} /> 4.{8 + (room.roomId % 3)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {(room.amenities || []).slice(0, 4).map(a => {
                      const Icon = AMENITY_ICONS[a] || Coffee
                      return <span key={a} style={s.amenityTag}><Icon size={12} /> {a}</span>
                    })}
                  </div>
                  <div style={s.cardFooter}>
                    <div>
                      <span style={s.price}>${room.pricePerNight}</span>
                      <span style={s.priceSub}> / night</span>
                    </div>
                    <Link to={`/rooms/${room.roomId}`} className="btn-primary btn-sm">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: 80 }}>No rooms match your filters</div>
          )}
        </div>
      </div>
    </div>
  )
}
