import { Link } from 'react-router-dom'

const h2Style = { fontSize: '1.05rem', margin: '1.25rem 0 0.4rem', color: '#0f172a' }
const pStyle  = { lineHeight: 1.75, marginBottom: '0.75rem', color: '#475569' }

export default function SmsTerms() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>SMS Terms</h1>
        <p style={{ ...pStyle, marginBottom: '1.25rem' }}>
          These terms apply to the CitizenTest SMS reminder program operated at citizentest.me.
        </p>

        <h2 style={h2Style}>Program Name</h2>
        <p style={pStyle}>
          CitizenTest Study Reminders — daily automated SMS messages to help you practice for the U.S. citizenship civics exam.
        </p>

        <h2 style={h2Style}>Message Type &amp; Frequency</h2>
        <p style={pStyle}>
          You will receive approximately 1 automated SMS message per day containing a civics practice question or study tip. Message frequency may vary.
        </p>

        <h2 style={h2Style}>How to Opt Out</h2>
        <p style={pStyle}>
          Reply <strong>STOP</strong>, <strong>CANCEL</strong>, or <strong>UNSUBSCRIBE</strong> to any message at any time. After opting out you will receive one final confirmation message and no further messages will be sent.
        </p>

        <h2 style={h2Style}>Help</h2>
        <p style={pStyle}>
          Reply <strong>HELP</strong> to any message, or contact us at{' '}
          <a href="mailto:info@citizentest.me" style={{ color: '#2563eb', textDecoration: 'underline' }}>info@citizentest.me</a>.
        </p>

        <h2 style={h2Style}>Message &amp; Data Rates</h2>
        <p style={pStyle}>
          Message and data rates may apply. Contact your wireless provider for details about your plan.
        </p>

        <h2 style={h2Style}>Carrier Liability</h2>
        <p style={pStyle}>
          Carriers are not liable for delayed or undelivered messages.
        </p>

        <h2 style={h2Style}>Privacy</h2>
        <p style={pStyle}>
          Your phone number is used only to send CitizenTest study reminders and will not be sold or shared with third parties. Numbers are retained until you opt out. See our{' '}
          <Link to="/privacy" style={{ color: '#2563eb', textDecoration: 'underline' }}>Privacy Policy</Link> for full details.
        </p>

        <h2 style={h2Style}>Support</h2>
        <p style={pStyle}>
          For support, email{' '}
          <a href="mailto:info@citizentest.me" style={{ color: '#2563eb', textDecoration: 'underline' }}>info@citizentest.me</a>.
        </p>

        <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>← Return to home</Link>
      </div>
    </div>
  )
}
