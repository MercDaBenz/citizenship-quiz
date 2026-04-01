import { useState, useEffect } from 'react'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || 'mdapeqqy'

const styles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: 'linear-gradient(135deg, #1a237e, #0d0d2b)',
    minHeight: '100vh',
    padding: '2rem 1rem',
    color: '#1f2937',
  },
  container: { maxWidth: 680, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '2rem', color: 'white' },
  headerEmoji: { fontSize: '3rem', display: 'block', marginBottom: '0.5rem' },
  headerH1: { fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', margin: 0 },
  headerP: { color: '#93c5fd', fontSize: '0.95rem', marginTop: '0.25rem' },
  progressBarWrap: {
    height: 4,
    background: '#e5e7eb',
    borderRadius: 999,
    marginBottom: '1.5rem',
    overflow: 'hidden',
  },
  progressFill: (pct) => ({
    height: '100%',
    background: 'linear-gradient(90deg, #1d4ed8, #b91c1c)',
    borderRadius: 999,
    width: pct + '%',
    transition: 'width 0.3s',
  }),
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  sectionTitle: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#1d4ed8',
    marginBottom: '1.25rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #eff6ff',
  },
  question: { marginBottom: '1.5rem' },
  questionLast: { marginBottom: 0 },
  questionLabel: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '0.6rem',
    lineHeight: 1.4,
  },
  req: { color: '#ef4444', marginLeft: 2 },
  input: {
    width: '100%',
    border: '2px solid #e5e7eb',
    borderRadius: '0.6rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    border: '2px solid #e5e7eb',
    borderRadius: '0.6rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    outline: 'none',
    resize: 'vertical',
    minHeight: 80,
    boxSizing: 'border-box',
  },
  options: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  option: (checked) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.55rem 0.75rem',
    border: `2px solid ${checked ? '#1d4ed8' : '#e5e7eb'}`,
    borderRadius: '0.6rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: checked ? '#1d4ed8' : '#374151',
    fontWeight: checked ? 600 : 400,
    background: checked ? '#eff6ff' : 'white',
    userSelect: 'none',
  }),
  optionInput: { width: '1rem', height: '1rem', accentColor: '#1d4ed8', flexShrink: 0 },
  scale: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  scaleBubble: (selected) => ({
    width: '2.4rem',
    height: '2.4rem',
    borderRadius: '50%',
    border: `2px solid ${selected ? '#1d4ed8' : '#e5e7eb'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    color: selected ? 'white' : '#6b7280',
    background: selected ? '#1d4ed8' : 'white',
    userSelect: 'none',
  }),
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginTop: '0.3rem',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #1d4ed8, #b91c1c)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.05rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 4px 14px rgba(29,78,216,0.4)',
  },
  thankyou: {
    background: 'white',
    borderRadius: '1rem',
    padding: '3rem 1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
}

function ScaleInput({ name, max, value, onChange }) {
  return (
    <div style={styles.scale}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <div
          key={n}
          style={styles.scaleBubble(value === String(n))}
          onClick={() => onChange(name, String(n))}
          role="radio"
          aria-checked={value === String(n)}
          tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(name, String(n))}
        >
          {n}
        </div>
      ))}
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={styles.options}>
      {options.map(opt => (
        <label key={opt.value} style={styles.option(value === opt.value)}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(name, opt.value)}
            style={styles.optionInput}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

function CheckboxGroup({ name, options, values, onChange }) {
  return (
    <div style={styles.options}>
      {options.map(opt => {
        const checked = values.includes(opt.value)
        return (
          <label key={opt.value} style={styles.option(checked)}>
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              style={styles.optionInput}
            />
            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

const REQUIRED_FIELDS = ['preparing', 'device', 'clarity', 'ease', 'speed', 'readability', 'explanations', 'difficulty', 'would_use', 'recommend', 'rating']

export default function Survey() {
  const [form, setForm] = useState({
    name: '', email: '',
    preparing: '', device: '',
    clarity: '', ease: '', speed: '', readability: '',
    explanations: '', incorrect: '', difficulty: '',
    features: [],
    translation: '',
    would_use: '', recommend: '', bugs: '', suggestion: '', rating: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const filled = REQUIRED_FIELDS.filter(f => form[f] !== '').length
    setProgress(Math.round((filled / REQUIRED_FIELDS.length) * 100))
  }, [form])

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleFeature(value) {
    setForm(prev => {
      const features = prev.features.includes(value)
        ? prev.features.filter(v => v !== value)
        : [...prev.features, value]
      return { ...prev, features }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const body = { ...form, features: form.features.join(', ') }
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.body}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.headerEmoji}>🗽</span>
            <h1 style={styles.headerH1}>Help Us Improve!</h1>
          </div>
          <div style={styles.thankyou}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>Thank you!</h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Your feedback means a lot and will help us make citizentest.me better for everyone preparing for their citizenship test.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <a href="/" style={{ color: '#1d4ed8', fontWeight: 700 }}>← Back to citizentest.me</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.headerEmoji}>🗽</span>
          <h1 style={styles.headerH1}>Help Us Improve!</h1>
          <p style={styles.headerP}>Share your experience with citizentest.me — takes about 3 minutes</p>
        </div>

        <div style={styles.progressBarWrap}>
          <div style={styles.progressFill(progress)} />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: About You */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>About You</div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Your name <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Maria"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Your email <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — only if you want a follow-up)</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Are you currently preparing for the U.S. citizenship test? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="preparing"
                value={form.preparing}
                onChange={setField}
                options={[
                  { value: 'yes', label: 'Yes, actively preparing' },
                  { value: 'soon', label: 'Not yet but planning to' },
                  { value: 'helping', label: 'Helping someone else prepare' },
                  { value: 'curious', label: 'Just curious / testing the app' },
                ]}
              />
            </div>

            <div style={styles.questionLast}>
              <label style={styles.questionLabel}>
                What device did you use? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="device"
                value={form.device}
                onChange={setField}
                options={[
                  { value: 'phone', label: 'Phone' },
                  { value: 'tablet', label: 'Tablet' },
                  { value: 'desktop', label: 'Desktop / Laptop' },
                ]}
              />
            </div>
          </div>

          {/* Section 2: Usability */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Usability</div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Was it clear what the app does when you first arrived? <span style={styles.req}>*</span>
              </label>
              <ScaleInput name="clarity" max={5} value={form.clarity} onChange={setField} />
              <div style={styles.scaleLabels}><span>Not clear at all</span><span>Very clear</span></div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                How easy was it to start a quiz? <span style={styles.req}>*</span>
              </label>
              <ScaleInput name="ease" max={5} value={form.ease} onChange={setField} />
              <div style={styles.scaleLabels}><span>Very confusing</span><span>Very easy</span></div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Did the app feel fast and responsive? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="speed"
                value={form.speed}
                onChange={setField}
                options={[
                  { value: 'yes', label: 'Yes, very fast' },
                  { value: 'mostly', label: 'Mostly, with minor delays' },
                  { value: 'slow', label: 'No, it felt slow' },
                ]}
              />
            </div>

            <div style={styles.questionLast}>
              <label style={styles.questionLabel}>
                Were the answer options easy to read and tap? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="readability"
                value={form.readability}
                onChange={setField}
                options={[
                  { value: 'yes', label: 'Yes, very easy' },
                  { value: 'mostly', label: 'Mostly' },
                  { value: 'no', label: 'No, hard to read or tap' },
                ]}
              />
            </div>
          </div>

          {/* Section 3: Content & Accuracy */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Content &amp; Accuracy</div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Were the explanations after each answer helpful? <span style={styles.req}>*</span>
              </label>
              <ScaleInput name="explanations" max={5} value={form.explanations} onChange={setField} />
              <div style={styles.scaleLabels}><span>Not helpful</span><span>Very helpful</span></div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Did any questions or answers seem incorrect or confusing?
              </label>
              <textarea
                name="incorrect"
                placeholder="If yes, please describe..."
                value={form.incorrect}
                onChange={e => setField('incorrect', e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.questionLast}>
              <label style={styles.questionLabel}>
                Did the difficulty feel appropriate for a citizenship test? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="difficulty"
                value={form.difficulty}
                onChange={setField}
                options={[
                  { value: 'easy', label: 'Too easy' },
                  { value: 'right', label: 'Just right' },
                  { value: 'hard', label: 'Too hard' },
                ]}
              />
            </div>
          </div>

          {/* Section 4: Features */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Features</div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Which features did you try? <span style={{ color: '#9ca3af', fontWeight: 400 }}>(select all that apply)</span>
              </label>
              <CheckboxGroup
                name="features"
                values={form.features}
                onChange={toggleFeature}
                options={[
                  { value: 'email', label: 'Email Results' },
                  { value: 'sms', label: 'SMS Reminder' },
                  { value: 'continue', label: 'Continue with 10 More Questions' },
                  { value: 'language', label: 'Different Language' },
                ]}
              />
            </div>

            <div style={styles.questionLast}>
              <label style={styles.questionLabel}>
                If you used another language, was the translation accurate?
              </label>
              <RadioGroup
                name="translation"
                value={form.translation}
                onChange={setField}
                options={[
                  { value: 'na', label: 'I only used English' },
                  { value: 'yes', label: 'Yes, very accurate' },
                  { value: 'mostly', label: 'Mostly, minor issues' },
                  { value: 'no', label: 'No, significant errors' },
                ]}
              />
            </div>
          </div>

          {/* Section 5: Overall */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Overall</div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Would you use this app to actually study for the citizenship test? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="would_use"
                value={form.would_use}
                onChange={setField}
                options={[
                  { value: 'yes', label: 'Yes definitely' },
                  { value: 'maybe', label: 'Maybe' },
                  { value: 'no', label: 'No' },
                ]}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Would you recommend it to someone preparing for the test? <span style={styles.req}>*</span>
              </label>
              <RadioGroup
                name="recommend"
                value={form.recommend}
                onChange={setField}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'maybe', label: 'Maybe' },
                  { value: 'no', label: 'No' },
                ]}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                Did you encounter any bugs or errors?
              </label>
              <textarea
                name="bugs"
                placeholder="Please describe any issues you experienced..."
                value={form.bugs}
                onChange={e => setField('bugs', e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                What is the ONE thing you would change or add?
              </label>
              <textarea
                name="suggestion"
                placeholder="Your most important suggestion..."
                value={form.suggestion}
                onChange={e => setField('suggestion', e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.questionLast}>
              <label style={styles.questionLabel}>
                Overall rating <span style={styles.req}>*</span>
              </label>
              <ScaleInput name="rating" max={10} value={form.rating} onChange={setField} />
              <div style={styles.scaleLabels}><span>Terrible</span><span>Amazing</span></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Submitting...' : 'Submit Review 🗽'}
          </button>
        </form>
      </div>
    </div>
  )
}
