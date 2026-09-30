import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const FICTIOUS = [
  { guestId: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@email.com', phone: '+1-555-0101', gender: 'Female', nationality: 'American' },
  { guestId: 2, firstName: 'Robert', lastName: 'Chen', email: 'robert@email.com', phone: '+1-555-0102', gender: 'Male', nationality: 'Canadian' },
  { guestId: 3, firstName: 'Maria', lastName: 'Garcia', email: 'maria@email.com', phone: '+1-555-0103', gender: 'Female', nationality: 'Spanish' },
  { guestId: 4, firstName: 'James', lastName: 'Wilson', email: 'james@email.com', phone: '+1-555-0104', gender: 'Male', nationality: 'British' },
  { guestId: 5, firstName: 'Sophie', lastName: 'Turner', email: 'sophie@email.com', phone: '+1-555-0105', gender: 'Female', nationality: 'Australian' },
  { guestId: 6, firstName: 'David', lastName: 'Kim', email: 'david@email.com', phone: '+1-555-0106', gender: 'Male', nationality: 'South Korean' },
  { guestId: 7, firstName: 'Emma', lastName: 'Brown', email: 'emma@email.com', phone: '+1-555-0107', gender: 'Female', nationality: 'British' },
  { guestId: 8, firstName: 'Michael', lastName: 'Davis', email: 'michael@email.com', phone: '+1-555-0108', gender: 'Male', nationality: 'American' },
  { guestId: 9, firstName: 'Olivia', lastName: 'Martinez', email: 'olivia@email.com', phone: '+1-555-0109', gender: 'Female', nationality: 'Mexican' },
  { guestId: 10, firstName: 'William', lastName: 'Taylor', email: 'william@email.com', phone: '+1-555-0110', gender: 'Male', nationality: 'Canadian' },
  { guestId: 11, firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah@email.com', phone: '+1-555-0111', gender: 'Female', nationality: 'American' },
  { guestId: 12, firstName: 'Thomas', lastName: 'Anderson', email: 'thomas@email.com', phone: '+1-555-0112', gender: 'Male', nationality: 'British' },
]

export default function ManagerGuests() {
  const [guests, setGuests] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [selectedGuest, setSelectedGuest] = useState(null)

  useEffect(() => {
    api.get('/guests').then((res) => { setGuests(Array.isArray(res.data) ? res.data : []) }).catch(err => { console.error(err) })
  }, [])

  const filtered = guests.filter(g =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone || '').includes(search)
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Guests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>View and manage guest profiles and information</p>
        </div>
      </div>

      <div className="card">
        <div className="booking-search" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
          <input type="text" placeholder="Search guests by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 300 }} />
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Nationality</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="empty-state"><Users size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No guests found</td></tr>
            ) : filtered.map((guest, i) => (
              <tr key={guest.guestId} onClick={() => setSelectedGuest(guest)} style={{ cursor: 'pointer', animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{guest.firstName?.[0]}{guest.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{guest.firstName} {guest.lastName}</span>
                  </div>
                </td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.gender}</td>
                <td>{guest.nationality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedGuest} onClose={() => setSelectedGuest(null)} title="Guest Details">
        {selectedGuest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div className="guest-avatar-sm" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>
                {selectedGuest.firstName?.[0]}{selectedGuest.lastName?.[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedGuest.firstName} {selectedGuest.lastName}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Guest #{selectedGuest.guestId}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email</label>
                <p style={{ fontSize: '0.9rem', marginTop: 4 }}>{selectedGuest.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone</label>
                <p style={{ fontSize: '0.9rem', marginTop: 4 }}>{selectedGuest.phone}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Gender</label>
                <p style={{ fontSize: '0.9rem', marginTop: 4 }}>{selectedGuest.gender}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nationality</label>
                <p style={{ fontSize: '0.9rem', marginTop: 4 }}>{selectedGuest.nationality}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}