import { useState } from 'react'
import { CreditCard, TrendingUp, TrendingDown, Wallet, DollarSign, Download, FileText } from 'lucide-react'

export default function Finance() {
  const [reportGenerated, setReportGenerated] = useState(false)

  const transactions = [
    { desc: 'Room Booking #128 - John Smith', amount: '+$450.00', date: 'Today', type: 'credit' },
    { desc: 'Room Booking #129 - Emma Wilson', amount: '+$320.00', date: 'Today', type: 'credit' },
    { desc: 'Supplier Payment - Linen Co.', amount: '-$1,200.00', date: 'Yesterday', type: 'debit' },
    { desc: 'Room Booking #130 - Mike Brown', amount: '+$580.00', date: 'Yesterday', type: 'credit' },
    { desc: 'Utility Bill - Electricity', amount: '-$890.00', date: '2 days ago', type: 'debit' },
    { desc: 'Room Booking #131 - Sarah Lee', amount: '+$410.00', date: '2 days ago', type: 'credit' },
    { desc: 'Staff Payroll - July 2026', amount: '-$8,500.00', date: '3 days ago', type: 'debit' },
    { desc: 'Conference Room Rental', amount: '+$1,500.00', date: '3 days ago', type: 'credit' },
    { desc: 'Room Booking #132 - David Kim', amount: '+$650.00', date: '4 days ago', type: 'credit' },
    { desc: 'Maintenance - HVAC Repair', amount: '-$450.00', date: '4 days ago', type: 'debit' },
    { desc: 'Room Booking #133 - Olivia P.', amount: '+$720.00', date: '5 days ago', type: 'credit' },
    { desc: 'Marketing - Google Ads', amount: '-$350.00', date: '5 days ago', type: 'debit' },
  ]

  const income = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + parseFloat(t.amount.replace(/[+,$]/g, '')), 0)
  const expenses = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + parseFloat(t.amount.replace(/[-,$]/g, '')), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Finance</h1>
        <button className="btn-primary" onClick={() => setReportGenerated(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} /> {reportGenerated ? 'Regenerate Report' : 'Generate Report'}
        </button>
      </div>

      {reportGenerated && (
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Financial Report - July 2026</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 2 }}>Generated: {new Date().toLocaleDateString()} | Period: July 1-30, 2026</p>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Download
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg, #1e65ff 0%, #1550d0 100%)', color: '#fff' }}>
          <div className="kpi-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}><DollarSign size={20} /></div>
          <div><div className="kpi-value" style={{ color: '#fff' }}>$84,520</div><div className="kpi-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Revenue (MTD)</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#ecfdf5', color: '#059669' }}><TrendingUp size={20} /></div>
          <div><div className="kpi-value">${income.toFixed(2)}</div><div className="kpi-label">Income (7 days)</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><TrendingDown size={20} /></div>
          <div><div className="kpi-value">${expenses.toFixed(2)}</div><div className="kpi-label">Expenses (7 days)</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><Wallet size={20} /></div>
          <div><div className="kpi-value">${(income - expenses).toFixed(2)}</div><div className="kpi-label">Net Profit (7 days)</div></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h3>
        <table className="booking-table">
          <thead>
            <tr><th>Description</th><th>Date</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{t.desc}</td>
                <td style={{ color: 'var(--muted)' }}>{t.date}</td>
                <td style={{ fontWeight: 700, color: t.type === 'credit' ? '#059669' : '#dc2626' }}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
