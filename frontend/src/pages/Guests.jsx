import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api/axios'

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

export default function Guests() {
  const [guests, setGuests] = useState(FICTIOUS)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/guests').then((res) => { if (res.data.length) setGuests(res.data) }).catch(() => {})
  }, [])

  const filtered = guests.filter(g =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Guests</h1>
        <button className="btn-primary">+ Add Guest</button>
      </div>

      <div className="card">
        <div className="booking-search" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
          <input type="text" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 300 }} />
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
              <tr><td colSpan={5} className="empty-state">No guests found</td></tr>
            ) : filtered.map((guest) => (
              <tr key={guest.guestId}>
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
    </div>
  )
}
