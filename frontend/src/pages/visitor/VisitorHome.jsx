import { Link } from 'react-router'
import {
  Wifi, Waves, UtensilsCrossed, Dumbbell, Car, Sparkles,
  ArrowRight, Star, MapPin, Phone, Mail
} from 'lucide-react'

const s = {
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #3B82F6 100%)',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 70% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)',
  },
  heroInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 60,
    alignItems: 'center',
    width: '100%',
  },
  heroText: {
    color: '#fff',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 9999,
    padding: '8px 20px',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 16,
  },
  heroTagline: {
    fontSize: '1.15rem',
    opacity: 0.85,
    marginBottom: 32,
    lineHeight: 1.7,
  },
  heroActions: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  heroStats: {
    display: 'flex',
    gap: 40,
    marginTop: 48,
  },
  heroStatNum: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  heroStatLabel: {
    fontSize: '0.82rem',
    opacity: 0.7,
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
  },
  heroCard: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 420,
  },
  heroCardTitle: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: 20,
  },
  heroCardField: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 12,
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.85rem',
  },
  section: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '80px 24px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSub: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 48,
    fontSize: '0.95rem',
  },
  roomCard: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  roomImg: {
    height: 200,
    background: 'linear-gradient(135deg, #EAF3FF 0%, #DBEAFE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
  },
  roomBody: {
    padding: 20,
  },
  roomType: {
    fontWeight: 700,
    fontSize: '1.05rem',
    marginBottom: 8,
  },
  roomMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  roomPrice: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#3B82F6',
  },
  facilityCard: {
    textAlign: 'center',
    padding: 32,
    borderRadius: 16,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s',
  },
  facilityIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  serviceCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s',
    borderLeft: '4px solid #3B82F6',
  },
}

const ROOMS = [
  { type: 'Deluxe King', price: 250, capacity: 2, icon: '🛏️', amenities: ['WiFi', 'AC', 'Mini Bar'] },
  { type: 'Executive Suite', price: 650, capacity: 4, icon: '🏨', amenities: ['WiFi', 'Balcony', 'Jacuzzi'] },
  { type: 'Penthouse', price: 1200, capacity: 6, icon: '👑', amenities: ['WiFi', 'Pool', 'Butler'] },
]

const FACILITIES = [
  { name: 'Free WiFi', icon: Wifi, color: '#EFF6FF', iconColor: '#3B82F6' },
  { name: 'Swimming Pool', icon: Waves, color: '#ECFDF5', iconColor: '#22C55E' },
  { name: 'Restaurant', icon: UtensilsCrossed, color: '#FEF9C3', iconColor: '#CA8A04' },
  { name: 'Spa & Wellness', icon: Sparkles, color: '#F3E8FF', iconColor: '#9333EA' },
  { name: 'Fitness Center', icon: Dumbbell, color: '#FEF2F2', iconColor: '#EF4444' },
  { name: 'Free Parking', icon: Car, color: '#F0FDF4', iconColor: '#16A34A' },
]

const SERVICES = [
  { title: 'Room Service', desc: 'Enjoy gourmet meals delivered to your room, available 24 hours a day with an extensive menu.' },
  { title: 'Airport Transfer', desc: 'Complimentary luxury airport pickup and drop-off in our premium vehicles.' },
  { title: 'Concierge', desc: 'Our dedicated concierge team handles everything from restaurant reservations to city tours.' },
  { title: 'Laundry & Dry Clean', desc: 'Same-day laundry and dry cleaning service for guests who value convenience.' },
]

export default function VisitorHome() {
  return (
    <div>
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <div style={s.heroText}>
            <div style={s.heroBadge}>
              <Star size={14} style={{ color: '#FACC15' }} /> Rated #1 in Metro City
            </div>
            <h1 style={s.heroTitle}>
              Welcome to<br />
              <span style={{ color: '#60A5FA' }}>Hasmir Hotels</span>
            </h1>
            <p style={s.heroTagline}>
              Comfort &bull; Luxury &bull; Smart Hospitality<br />
              Experience world-class service in the heart of Metro City.
            </p>
            <div style={s.heroActions}>
              <Link to="/rooms" className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: 12, background: '#3B82F6' }}>
                Book Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                Learn More
              </Link>
            </div>
            <div style={s.heroStats}>
              <div>
                <div style={s.heroStatNum}>150+</div>
                <div style={s.heroStatLabel}>Luxury Rooms</div>
              </div>
              <div>
                <div style={s.heroStatNum}>50k+</div>
                <div style={s.heroStatLabel}>Happy Guests</div>
              </div>
              <div>
                <div style={s.heroStatNum}>4.9</div>
                <div style={s.heroStatLabel}>Guest Rating</div>
              </div>
            </div>
          </div>
          <div style={s.heroVisual}>
            <div style={s.heroCard}>
              <div style={s.heroCardTitle}>Quick Booking</div>
              <div style={s.heroCardField}><MapPin size={14} style={{ marginRight: 8 }} /> 123 Luxury Avenue, Metro City</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={s.heroCardField}>Check-in</div>
                <div style={s.heroCardField}>Check-out</div>
              </div>
              <div style={s.heroCardField}>2 Adults, 1 Room</div>
              <Link to="/rooms" style={{
                display: 'block',
                textAlign: 'center',
                background: '#3B82F6',
                color: '#fff',
                padding: '14px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.95rem',
                marginTop: 8,
                transition: 'background 0.2s',
              }}>
                Search Availability
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <h2 style={s.sectionTitle}>Featured Rooms</h2>
        <p style={s.sectionSub}>Discover our handpicked selection of premium rooms and suites</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {ROOMS.map(room => (
            <div key={room.type} style={s.roomCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div style={s.roomImg}>{room.icon}</div>
              <div style={s.roomBody}>
                <div style={s.roomType}>{room.type}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {room.amenities.map(a => (
                    <span key={a} style={{ background: '#F3F4F6', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', color: '#6B7280' }}>{a}</span>
                  ))}
                </div>
                <div style={s.roomMeta}>
                  <div>
                    <span style={s.roomPrice}>${room.price}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}> / night</span>
                  </div>
                  <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>{room.capacity} Guests</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/rooms" className="btn-primary" style={{ padding: '12px 32px', borderRadius: 12 }}>
            View All Rooms <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section style={{ background: '#F7F9FC', padding: '80px 0' }}>
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Hotel Facilities</h2>
          <p style={s.sectionSub}>Everything you need for a perfect stay</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
            {FACILITIES.map(f => (
              <div key={f.name} style={s.facilityCard}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ ...s.facilityIcon, background: f.color, color: f.iconColor }}>
                  <f.icon size={28} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{f.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.section}>
        <h2 style={s.sectionTitle}>Our Services</h2>
        <p style={s.sectionSub}>Premium services to enhance your stay</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {SERVICES.map(svc => (
            <div key={svc.title} style={s.serviceCard}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{svc.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)', padding: '80px 0' }}>
        <div style={s.section}>
          <h2 style={{ ...s.sectionTitle, color: '#fff' }}>Get in Touch</h2>
          <p style={{ ...s.sectionSub, color: 'rgba(255,255,255,0.6)' }}>We'd love to hear from you</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MapPin size={24} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Address</h4>
              <p style={{ fontSize: '0.88rem', opacity: 0.7 }}>123 Luxury Avenue<br />Metro City, MC 10001</p>
            </div>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Phone size={24} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Phone</h4>
              <p style={{ fontSize: '0.88rem', opacity: 0.7 }}>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
            </div>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={24} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Email</h4>
              <p style={{ fontSize: '0.88rem', opacity: 0.7 }}>info@hasmirhotels.com<br />reservations@hasmirhotels.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
