import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Privacy Policy</h1>
        <p style={{ lineHeight: 1.75, marginBottom: '1.25rem', color: '#475569' }}>
          CitizenTest (citizentest.me) is a free U.S. citizenship civics exam practice tool. We take your privacy seriously and only collect the information needed to send reminders and updates.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1.25rem 0 0.5rem', color: '#0f172a' }}>Information We Collect</h2>
        <ul style={{ lineHeight: 1.75, margin: '0 0 1rem 1.25rem', color: '#334155' }}>
          <li>Phone numbers provided for SMS reminders.</li>
          <li>Email addresses provided for email reminders.</li>
        </ul>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>How We Use Your Information</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem', color: '#475569' }}>
          We use phone numbers and email addresses only to send the reminders you request and related notifications about CitizenTest.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>Data Sharing</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem', color: '#475569' }}>
          We do not sell user data to third parties.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>SMS Reminders &amp; Phone Numbers</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '0.5rem', color: '#475569' }}>
          SMS reminders are only sent with your explicit consent. When you provide your phone number to sign up for reminders:
        </p>
        <ul style={{ lineHeight: 1.75, margin: '0 0 1rem 1.25rem', color: '#334155' }}>
          <li>Your number is used <strong>only</strong> to send CitizenTest daily study reminders.</li>
          <li>It is <strong>not sold or shared</strong> with third parties for any purpose.</li>
          <li>It is retained until you opt out by replying <strong>STOP</strong> to any message.</li>
        </ul>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem', color: '#475569' }}>
          See our <a href="/sms-terms" style={{ color: '#2563eb', textDecoration: 'underline' }}>SMS Terms</a> for full program details including message frequency, carrier liability, and opt-out instructions.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>Email Communication</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem', color: '#475569' }}>
          Email reminders include an unsubscribe link so you can stop messages whenever you like.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>Contact</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '1.5rem', color: '#475569' }}>
          If you have questions about privacy, please contact us at <a href="mailto:info@citizentest.me" style={{ color: '#2563eb', textDecoration: 'underline' }}>info@citizentest.me</a>.
        </p>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>Return to home</Link>
      </div>
    </div>
  )
}
