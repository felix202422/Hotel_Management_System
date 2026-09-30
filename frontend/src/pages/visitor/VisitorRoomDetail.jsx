import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import {
  Users, Star, Wifi, Car, Coffee, Bath, Wind, Check,
  Calendar, ArrowLeft, ChevronRight
} from 'lucide-react'
import api from '../../api/axios'

const FALLBACK = {
  1: { roomId: 1, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, amenities: ['WiFi', 'AC', 'Coffee'], description: 'Comfortable twin beds designed for a relaxing stay. Perfect for business travelers or friends traveling together. Features modern decor, blackout curtains, and a work desk.', floor: 1, roomNumber: '101' },
  2: { roomId: 2, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, amenities: ['WiFi', 'AC', 'Mini Bar', 'Coffee'], description: 'Spacious room featuring a premium king bed with luxury linens. Enjoy stunning city views from your window, a fully stocked mini bar, and a marble bathroom with rainfall shower.', floor: 2, roomNumber: '201' },
  3: { roomId: 3, roomType: 'Suite', pricePerNight: 450, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Coffee'], description: 'Elegant suite with a separate living area, perfect for families. Includes a plush king bed, sofa bed, dining area, and a spa-inspired bathroom with soaking tub.', floor: 3, roomNumber: '301' },
  4: { roomId: 4, roomType: 'Executive Suite', pricePerNight: 650, capacity: 4, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'Premium executive suite for discerning travelers. Features a private workspace, panoramic floor-to-ceiling windows, jacuzzi, and complimentary valet parking.', floor: 4, roomNumber: '401' },
  5: { roomId: 5, roomType: 'Penthouse', pricePerNight: 1200, capacity: 6, amenities: ['WiFi', 'AC', 'Mini Bar', 'Spa', 'Parking', 'Coffee'], description: 'The crown jewel of Fizzo Hotels. A sprawling penthouse with private terrace, infinity pool, personal butler, and 360-degree city views. The ultimate luxury experience.', floor: 5, roomNumber: '501' },
}

const SIMILAR_ROOMS = [
  { roomId: 1, roomType: 'Standard Twin', pricePerNight: 180, capacity: 2, icon: '🛏️' },
  { roomId: 2, roomType: 'Deluxe King', pricePerNight: 250, capacity: 2, icon: '👑' },
  { roomId: 3, roomType: 'Suite', pricePerNight: 450, capacity: 4, icon: '🏨' },
]

const AMENITY_ICONS = { WiFi: Wifi, Parking: Car, Coffee: Coffee, Spa: Bath, AC: Wind, 'Mini Bar': Coffee }

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.85rem', color: '#6B7280' },
  breadcrumbLink: { color: '#3B82F6', fontWeight: 500 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' },
  mainCard: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  imgPlaceholder: {
    height: 360, background: 'linear-gradient(135deg, #EAF3FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', position: 'relative',
  },
  priceOverlay: {
    position: 'absolute', bottom: 20, left: 20, background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)', borderRadius: 14, padding: '12px 20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  body: { padding: 32 },
  roomType: { fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 },
  meta: { display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: '0.88rem' },
  desc: { color: '#374151', lineHeight: 1.7, marginBottom: 28, fontSize: '0.92rem' },
  amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 },
  amenityItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F9FAFB', borderRadius: 12, fontSize: '0.85rem' },
  sidebar: { position: 'sticky', top: 100 },
  bookingCard: { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  priceBig: { fontSize: '2rem', fontWeight: 800, color: '#3B82F6' },
  similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 48 },
  similarCard: { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  similarImg: { height: 120, background: 'linear-gradient(135deg, #EAF3FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' },
}

export default function VisitorRoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  useEffect(() => {
    api.get(`/rooms/${id}`).then(res => {
      setRoom(res.data)
    }).catch(() => {
      setRoom(FALLBACK[id] || FALLBACK[2])
    })
  }, [id])

  if (!room) return <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading room details...</div>

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1
  const total = nights * (room.pricePerNight || 0)

  return (
    <div style={s.page}>
      <div style={s.breadcrumb}>
        <Link to="/rooms" style={s.breadcrumbLink}><ArrowLeft size={14} /> Back to Rooms</Link>
        <ChevronRight size={14} />
        <span>{room.roomType}</span>
      </div>

      <div style={s.layout}>
        <div>
          <div style={s.mainCard}>
            <div style={s.imgPlaceholder}>
              {room.roomType === 'Penthouse' ? '💎' : room.roomType === 'Executive Suite' ? '🌟' : room.roomType === 'Suite' ? '🏨' : room.roomType === 'Deluxe King' ? '👑' : '🛏️'}
              <div style={s.priceOverlay}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6' }}>${room.pricePerNight}</span>
                <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}> / night</span>
              </div>
            </div>
            <div style={s.body}>
              <h1 style={s.roomType}>{room.roomType}</h1>
              <div style={s.meta}>
                <span style={s.metaItem}><Users size={16} /> Up to {room.capacity} guests</span>
                <span style={s.metaItem}><Star size={16} style={{ color: '#FACC15' }} /> 4.9 rating</span>
                <span style={s.metaItem}>Floor {room.floor}</span>
              </div>
              <p style={s.desc}>{room.description}</p>

              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Amenities</h3>
              <div style={s.amenitiesGrid}>
                {(room.amenities || ['WiFi', 'AC']).map(a => {
                  const Icon = AMENITY_ICONS[a] || Coffee
                  return (
                    <div key={a} style={s.amenityItem}>
                      <Icon size={18} style={{ color: '#3B82F6' }} />
                      <span>{a}</span>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ fontWeight: 700, color: '#16A34A' }}>Room Highlights</h4>
                {['Non-smoking room', 'Daily housekeeping', '24/7 room service', 'Express check-in/out'].map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
                    <Check size={16} style={{ color: '#22C55E' }} /> {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={s.similarGrid}>
            <h3 style={{ gridColumn: '1 / -1', fontWeight: 700, fontSize: '1.2rem', marginBottom: 0 }}>Similar Rooms</h3>
            {SIMILAR_ROOMS.filter(r => r.roomId !== room.roomId).map(r => (
              <Link to={`/rooms/${r.roomId}`} key={r.roomId} style={s.similarCard}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={s.similarImg}>{r.icon}</div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.roomType}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#3B82F6' }}>${r.pricePerNight}<span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '0.78rem' }}> /night</span></span>
                    <span style={{ color: '#6B7280', fontSize: '0.82rem' }}>{r.capacity} Guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={s.sidebar}>
          <div style={s.bookingCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span style={s.priceBig}>${room.pricePerNight}</span>
              <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}>/ night</span>
            </div>

            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: '0.88rem' }} />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: '0.88rem' }} />
            </div>

            {checkIn && checkOut && (
              <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                  <span style={{ color: '#6B7280' }}>${room.pricePerNight} x {nights} nights</span>
                  <span style={{ fontWeight: 600 }}>${total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #E5E7EB', fontWeight: 700, fontSize: '1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#3B82F6' }}>${total}</span>
                </div>
              </div>
            )}

            <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', borderRadius: 12 }}>
              <Calendar size={18} /> Book This Room
            </Link>
            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.78rem', marginTop: 12 }}>
              Free cancellation up to 24 hours before check-in
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
