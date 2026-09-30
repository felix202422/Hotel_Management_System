import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Search, Users, Wifi, Car, Coffee, Bath, Wind, Star, SlidersHorizontal, X } from 'lucide-react'
import api from '../../api/axios'

const AMENITY_ICONS = { WiFi: Wifi, Parking: Car, Coffee: Coffee, Spa: Bath, AC: Wind, 'Mini Bar': Coffee }
const ROOM_TYPES = ['All', 'Standard Twin', 'Deluxe King', 'Suite', 'Executive Suite', 'Penthouse']
const CAPACITIES = ['All', '2 Guests', '4 Guests', '6 Guests']

const FALLBACK_ROOMS = [
  { roomId: 1, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, amenities: ['WiFi', 'AC', 'Coffee'], description: 'Comfortable twin beds with modern amenities.', floor: 1 },
  { roomId: 2, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, amenities: ['WiFi', 'AC', 'Mini Bar', 'Coffee'], description: 'Spacious king bed room with city views.', floor: 2 },
  { roomId: 3, roomType: 'Suite', pricePerNight: 450, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Coffee'], description: 'Luxury suite with separate living area.', floor: 3 },
  { roomId: 4, roomType: 'Executive Suite', pricePerNight: 650, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'Premium executive suite with panoramic views.', floor: 4 },
  { roomId: 5, roomType: 'Penthouse', pricePerNight: 1200, capacity: 6, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'Ultimate luxury with private terrace and butler.', floor: 5 },
  { roomId: 6, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, amenities: ['WiFi', 'AC'], description: 'Cozy room perfect for short stays.', floor: 1 },
  { roomId: 7, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, amenities: ['WiFi', 'AC', 'Mini Bar'], description: 'Elegant room with premium bedding.', floor: 2 },
  { roomId: 8, roomType: 'Suite', pricePerNight: 450, capacity: 4, amenities: ['WiFi', 'AC', 'Spa', 'Coffee'], description: 'Spacious suite ideal for families.', floor: 3 },
]

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: '1.5rem', fontWeight: 800 },
  searchRow: { display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' },
  searchInput: { flex: 1, maxWidth: 360, padding: '10px 14px 10px 40px', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: '0.85rem' },
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
  layout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardImg: {
    height: 160, background: 'linear-gradient(135deg, #EAF3FF, #DBEAFE)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem',
    position: 'relative',
  },
  badge: {
    position: 'absolute', top: 10, right: 10, background: '#22C55E', color: '#fff',
    padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700,
  },
  cardBody: { padding: 16 },
  cardType: { fontWeight: 700, fontSize: '1rem', marginBottom: 4 },
  cardDesc: { color: '#6B7280', fontSize: '0.8rem', marginBottom: 10, lineHeight: 1.5 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontSize: '0.8rem', color: '#6B7280' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F3F4F6' },
  price: { fontSize: '1.15rem', fontWeight: 800, color: '#3B82F6' },
}

const roomIcons = { 'Standard Twin': '🛏️', 'Deluxe King': '👑', 'Suite': '🏨', 'Executive Suite': '🌟', 'Penthouse': '💎' }

export default function GuestRooms() {
  const [rooms, setRooms] = useState(FALLBACK_ROOMS)
  const [filterType, setFilterType] = useState('All')
  const [filterCapacity, setFilterCapacity] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/rooms').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) {
        const available = data.filter(r => r.roomStatus === 'Available')
        setRooms(available.length > 0 ? available : data)
      }
    }).catch(err => console.error(err))
  }, [])

  const filtered = rooms.filter(r => {
    const matchType = filterType === 'All' || r.roomType === filterType
    const matchCap = filterCapacity === 'All' || r.capacity === parseInt(filterCapacity)
    const matchSearch = !search || r.roomType.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCap && matchSearch
  })

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Browse Rooms</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Find the perfect room for your stay</p>
        </div>
      </div>

      <div style={s.searchRow}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input style={s.searchInput} placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={s.layout}>
        <div style={s.sidebar}>
          <div style={s.sidebarTitle}><SlidersHorizontal size={16} /> Filters</div>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Room Type</span>
            {ROOM_TYPES.map(t => (
              <button key={t} style={s.filterBtn(filterType === t)} onClick={() => setFilterType(t)}>{t}</button>
            ))}
          </div>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Capacity</span>
            {CAPACITIES.map(c => (
              <button key={c} style={s.filterBtn(filterCapacity === c)} onClick={() => setFilterCapacity(c)}>{c}</button>
            ))}
          </div>
          <button className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setFilterType('All'); setFilterCapacity('All'); setSearch('') }}>
            Reset
          </button>
        </div>

        <div>
          <div style={{ marginBottom: 12, color: '#6B7280', fontSize: '0.85rem' }}>
            Showing {filtered.length} {filtered.length === 1 ? 'room' : 'rooms'}
          </div>
          <div style={s.grid}>
            {filtered.map((room, i) => (
              <div key={room.roomId} style={{ ...s.card, animationDelay: `${i * 50}ms` }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {room.capacity}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} style={{ color: '#FACC15' }} /> 4.{8 + (room.roomId % 3)}</span>
                  </div>
                  <div style={s.cardFooter}>
                    <div>
                      <span style={s.price}>${room.pricePerNight}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}> /night</span>
                    </div>
                    <Link to={`/rooms/${room.roomId}`} className="btn-primary btn-sm">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: 60 }}>
              <SlidersHorizontal size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No rooms match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
