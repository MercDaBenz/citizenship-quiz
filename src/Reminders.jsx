import { useState } from 'react'
import { Link } from 'react-router-dom'

const REMINDER_URL =
  import.meta.env.VITE_REMINDER_URL ||
  (import.meta.env.VITE_API_URL || 'http://localhost:3001/quiz').replace(/\/quiz$/, '/reminder')

const inputStyle = {
  width: '100%', border: '2px solid #e5e7eb', borderRadius: '0.65rem',
  padding: '0.5rem 0.75rem', fontSize: '0.9rem', boxSizing: 'border-box',
  marginBottom: '0.75rem',
}

export default function Reminders() {
  const [phone, setPhone]               = useState('')
  const [reminderTime, setReminderTime] = useState('09:00')
  const [smsSent, setSmsSent]           = useState(false)
  const [smsError, setSmsError]         = useState('')
  const [saving, setSaving]             = useState(false)

  async function saveReminder() {
    setSmsError('')
    setSaving(true)
    const [h, m] = reminderTime.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    const utcHour = d.getUTCHours()

    try {
      const res = await fetch(REMINDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, language: 'English', wrongQuestions: [], reminderHour: utcHour }),
      })
      if (!res.ok) throw new Error('Failed')
      setSmsSent(true)
    } catch {
      setSmsError('Could not save reminder. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>📱</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.4rem' }}>
            Daily Study Reminders
          </h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
            Get a free daily text to keep your U.S. citizenship exam practice on track.
          </p>
        </div>

        {smsSent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
            <p style={{ fontWeight: 700, color: '#15803d', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              You're signed up!
            </p>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You'll receive a daily SMS reminder at the time you selected.
            </p>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>
              ← Start practicing
            </Link>
          </div>
        ) : (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                📱 Your phone number
              </label>
              <input
                style={inputStyle} type="tel" placeholder="+1 (555) 000-0000"
                value={phone} onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                ⏰ Daily reminder time
              </label>
              <input
                style={inputStyle} type="time"
                value={reminderTime} onChange={e => setReminderTime(e.target.value)}
              />
            </div>

            {smsError && (
              <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginBottom: '0.5rem' }}>{smsError}</p>
            )}

            <button
              onClick={saveReminder}
              disabled={saving || !phone}
              style={{
                width: '100%', background: '#f59e0b', color: 'white', fontWeight: 700,
                padding: '0.75rem', borderRadius: '0.65rem', border: 'none', fontSize: '1rem',
                cursor: saving || !phone ? 'not-allowed' : 'pointer', marginBottom: '0.75rem',
                opacity: !phone ? 0.7 : 1,
              }}>
              {saving ? 'Saving…' : 'Save Reminder'}
            </button>

            <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              By tapping Save Reminder, you agree to receive recurring automated SMS study reminders
              from CitizenTest. Message frequency: 1 per day. Message &amp; data rates may apply.
              Reply STOP to cancel, HELP for help. See our{' '}
              <Link to="/sms-terms" style={{ color: '#2563eb', textDecoration: 'underline' }}>SMS Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#2563eb', textDecoration: 'underline' }}>Privacy Policy</Link>.
            </p>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', textAlign: 'center' }}>
              <Link to="/" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'underline' }}>
                ← Back to CitizenTest
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
