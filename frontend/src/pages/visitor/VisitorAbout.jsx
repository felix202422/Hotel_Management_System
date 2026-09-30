import { Award, Heart, Shield, Leaf, Users, Target } from 'lucide-react'

const TEAM = [
  { name: 'Ahmad Fizzo', role: 'Founder & CEO', bio: 'With over 20 years in hospitality, Ahmad founded Fizzo Hotels with a vision to redefine luxury accommodation.', avatar: 'AH' },
  { name: 'Sarah Mitchell', role: 'General Manager', bio: 'Sarah brings 15 years of international hotel management experience, ensuring every guest receives exceptional service.', avatar: 'SM' },
  { name: 'David Chen', role: 'Head of Operations', bio: 'David oversees day-to-day operations with a focus on efficiency, sustainability, and guest satisfaction.', avatar: 'DC' },
  { name: 'Elena Rodriguez', role: 'Executive Chef', bio: 'Award-winning chef Elena curates menus that celebrate local flavors while showcasing international culinary excellence.', avatar: 'ER' },
]

const VALUES = [
  { icon: Heart, title: 'Guest First', desc: 'Every decision we make starts with our guests. Your comfort and satisfaction drive everything we do.', color: '#FEF2F2', iconColor: '#EF4444' },
  { icon: Award, title: 'Excellence', desc: 'We pursue the highest standards in service, cleanliness, and hospitality at every touchpoint.', color: '#FEF9C3', iconColor: '#CA8A04' },
  { icon: Shield, title: 'Trust & Integrity', desc: 'We operate with transparency and honesty, building lasting relationships with guests and partners.', color: '#EFF6FF', iconColor: '#3B82F6' },
  { icon: Leaf, title: 'Sustainability', desc: 'We are committed to eco-friendly practices, reducing waste, and supporting our local community.', color: '#ECFDF5', iconColor: '#22C55E' },
]

const s = {
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    padding: '100px 24px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: { fontSize: '2.8rem', fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: '1.1rem', opacity: 0.75, maxWidth: 650, margin: '0 auto', lineHeight: 1.7 },
  section: { maxWidth: 1000, margin: '0 auto', padding: '80px 24px' },
  wideSection: { maxWidth: 1200, margin: '0 auto', padding: '80px 24px' },
  sectionTitle: { fontSize: '2rem', fontWeight: 800, marginBottom: 8 },
  sectionSub: { color: '#6B7280', fontSize: '0.95rem', marginBottom: 36, lineHeight: 1.7 },
  storyGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
  storyImg: {
    height: 350, borderRadius: 20, background: 'linear-gradient(135deg, #EAF3FF, #DBEAFE)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
  },
  storyText: { fontSize: '0.95rem', color: '#374151', lineHeight: 1.8 },
  mvGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 },
  mvCard: {
    background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  mvIcon: {
    width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 },
  teamCard: {
    background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    textAlign: 'center', transition: 'transform 0.3s',
  },
  avatar: {
    width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', fontWeight: 700, margin: '0 auto 16px',
  },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 },
  valueCard: {
    background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s',
  },
}

export default function VisitorAbout() {
  return (
    <div>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>About Fizzo Hotels</h1>
        <p style={s.heroSub}>
          A legacy of excellence in hospitality, built on passion, dedication, and an unwavering commitment to our guests.
        </p>
      </div>

      <div style={s.section}>
        <div style={s.storyGrid}>
          <div style={s.storyImg}>🏨</div>
          <div>
            <h2 style={s.sectionTitle}>Our Story</h2>
            <div style={s.storyText}>
              <p style={{ marginBottom: 16 }}>
                Founded in 2005, Fizzo Hotels began as a small family-run boutique hotel with a big dream: to create a place where every guest feels at home while experiencing the finest in luxury hospitality.
              </p>
              <p style={{ marginBottom: 16 }}>
                Over the past two decades, we have grown from a single property to a respected name in the hospitality industry. Our journey has been defined by an unwavering commitment to quality, innovation, and genuine warmth.
              </p>
              <p>
                Today, Fizzo Hotels stands as a symbol of modern luxury blended with timeless hospitality values. We continue to evolve, embracing new technologies and sustainable practices while never losing sight of what matters most: our guests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#F7F9FC', padding: '80px 0' }}>
        <div style={s.section}>
          <h2 style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: 8 }}>Mission & Vision</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 40, fontSize: '0.95rem' }}>What drives us forward</p>
          <div style={s.mvGrid}>
            <div style={s.mvCard}>
              <div style={{ ...s.mvIcon, background: '#EFF6FF', color: '#3B82F6' }}><Target size={26} /></div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Our Mission</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>
                To provide exceptional hospitality experiences that exceed expectations, while fostering a culture of warmth, respect, and continuous improvement. We strive to be the preferred choice for travelers seeking comfort and luxury.
              </p>
            </div>
            <div style={s.mvCard}>
              <div style={{ ...s.mvIcon, background: '#ECFDF5', color: '#22C55E' }}><Users size={26} /></div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Our Vision</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>
                To be recognized globally as a leader in innovative hospitality, setting new standards for guest satisfaction, sustainability, and community engagement while creating memorable experiences for every visitor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={s.wideSection}>
        <h2 style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: 8 }}>Meet Our Team</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 40, fontSize: '0.95rem' }}>
          The passionate people behind Fizzo Hotels
        </p>
        <div style={s.teamGrid}>
          {TEAM.map(m => (
            <div key={m.name} style={s.teamCard}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={s.avatar}>{m.avatar}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{m.name}</h3>
              <div style={{ color: '#3B82F6', fontWeight: 600, fontSize: '0.85rem', marginBottom: 12 }}>{m.role}</div>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#F7F9FC', padding: '80px 0' }}>
        <div style={s.wideSection}>
          <h2 style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: 8 }}>Our Values</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 40, fontSize: '0.95rem' }}>
            The principles that guide every decision
          </p>
          <div style={s.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} style={s.valueCard}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: v.color, color: v.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <v.icon size={24} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
