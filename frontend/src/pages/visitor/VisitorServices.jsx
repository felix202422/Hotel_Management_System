import {
  UtensilsCrossed, Sparkles, Monitor, Plane, Shirt, ConciergeBell,
  Dumbbell, Waves, Clock, Star
} from 'lucide-react'

const SERVICES = [
  { name: 'Restaurant', icon: UtensilsCrossed, desc: 'Savor exquisite cuisine prepared by our world-class chefs. From local delicacies to international favorites, our restaurant offers a dining experience that delights every palate.', color: '#FEF9C3', iconColor: '#CA8A04' },
  { name: 'Spa & Wellness', icon: Sparkles, desc: 'Indulge in rejuvenating treatments at our luxury spa. Our skilled therapists use premium products to help you unwind and restore balance.', color: '#F3E8FF', iconColor: '#9333EA' },
  { name: 'Conference Rooms', icon: Monitor, desc: 'State-of-the-art meeting spaces equipped with the latest audio-visual technology. Perfect for corporate events, seminars, and business presentations.', color: '#EFF6FF', iconColor: '#3B82F6' },
  { name: 'Airport Transfer', icon: Plane, desc: 'Complimentary luxury airport pickup and drop-off service in our premium fleet of vehicles. Travel in comfort from the moment you land.', color: '#ECFDF5', iconColor: '#22C55E' },
  { name: 'Laundry & Dry Clean', icon: Shirt, desc: 'Same-day laundry and dry cleaning service available seven days a week. Fresh, perfectly pressed garments returned to your door.', color: '#FEF2F2', iconColor: '#EF4444' },
  { name: 'Room Service', icon: ConciergeBell, desc: 'Enjoy gourmet meals delivered to your room around the clock. Our extensive menu features dishes for every taste and dietary need.', color: '#FFF7ED', iconColor: '#EA580C' },
  { name: 'Fitness Center', icon: Dumbbell, desc: 'Stay active in our fully equipped gym with personal trainers available. Features the latest cardio and strength training equipment.', color: '#F0FDF4', iconColor: '#16A34A' },
  { name: 'Swimming Pool', icon: Waves, desc: 'Relax in our temperature-controlled infinity pool with stunning city views. Poolside service available for refreshments and light bites.', color: '#F0F9FF', iconColor: '#0284C7' },
]

const s = {
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    padding: '80px 24px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: { fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 },
  heroSub: { fontSize: '1.05rem', opacity: 0.75, maxWidth: 600, margin: '0 auto' },
  section: { maxWidth: 1200, margin: '0 auto', padding: '80px 24px' },
  sectionTitle: { fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 8 },
  sectionSub: { textAlign: 'center', color: '#6B7280', marginBottom: 48, fontSize: '0.95rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  card: {
    background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default',
  },
  iconWrap: {
    width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20,
  },
  name: { fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 },
  desc: { color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.7 },
  hoursBar: {
    background: '#F9FAFB', borderRadius: 16, padding: '24px 32px',
    display: 'flex', justifyContent: 'center', gap: 48, marginTop: 48, flexWrap: 'wrap',
  },
  hourItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' },
}

export default function VisitorServices() {
  return (
    <div>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Our Services</h1>
        <p style={s.heroSub}>
          From fine dining to spa treatments, we provide everything you need for an unforgettable stay.
        </p>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>What We Offer</h2>
        <p style={s.sectionSub}>Premium services designed for your comfort and convenience</p>
        <div style={s.grid}>
          {SERVICES.map(svc => (
            <div key={svc.name} style={s.card}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div style={{ ...s.iconWrap, background: svc.color, color: svc.iconColor }}>
                <svc.icon size={28} />
              </div>
              <h3 style={s.name}>{svc.name}</h3>
              <p style={s.desc}>{svc.desc}</p>
            </div>
          ))}
        </div>

        <div style={s.hoursBar}>
          <div style={s.hourItem}><Clock size={18} style={{ color: '#3B82F6' }} /> <strong>Spa:</strong>&nbsp; 9:00 AM - 9:00 PM</div>
          <div style={s.hourItem}><Clock size={18} style={{ color: '#3B82F6' }} /> <strong>Gym:</strong>&nbsp; 5:00 AM - 11:00 PM</div>
          <div style={s.hourItem}><Clock size={18} style={{ color: '#3B82F6' }} /> <strong>Pool:</strong>&nbsp; 6:00 AM - 10:00 PM</div>
          <div style={s.hourItem}><Star size={18} style={{ color: '#FACC15' }} /> Room Service: 24/7</div>
        </div>
      </div>
    </div>
  )
}
