import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Terms of Service</h1>
        <p style={{ lineHeight: 1.75, marginBottom: '1.25rem', color: '#475569' }}>
          CitizenTest (citizentest.me) is a free U.S. citizenship civics exam practice tool. These terms describe the basic conditions for using the service.
        </p>
        <ul style={{ lineHeight: 1.75, margin: '0 0 1rem 1.25rem', color: '#334155' }}>
          <li>CitizenTest is a free educational tool and does not guarantee passing the U.S. citizenship test.</li>
          <li>SMS reminders are optional and require your voluntary opt-in.</li>
          <li>We may discontinue or change the service, features, or reminders at any time without notice.</li>
        </ul>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem', color: '#475569' }}>
          By using CitizenTest, you agree that reminders and study tools are provided for practice and informational purposes only.
        </p>
        <h2 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: '#0f172a' }}>Contact</h2>
        <p style={{ lineHeight: 1.75, marginBottom: '1.5rem', color: '#475569' }}>
          For questions about these terms or the service, contact us at <a href="mailto:info@citizentest.me" style={{ color: '#2563eb', textDecoration: 'underline' }}>info@citizentest.me</a>.
        </p>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>Return to home</Link>
      </div>
    </div>
  )
}
