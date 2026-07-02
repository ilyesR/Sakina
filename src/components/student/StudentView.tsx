'use client'
import { useState } from 'react'
import { Lang } from '@/lib/data'
import { t } from '@/lib/i18n'
import {
  STUDENT_SESSIONS, STUDENT_PROGRESS, STUDENT_ATTENDANCE,
  MATERIALS, MESSAGES, NOTIFICATIONS, COURSES
} from '@/lib/data'
import ProgressRing from '@/components/ui/ProgressRing'
import {
  BookOpen, Calendar, TrendingUp, FileText, CheckSquare,
  MessageCircle, Bell, Download, Volume2, Send, Star
} from 'lucide-react'

type Section = 'dashboard' | 'courses' | 'progress' | 'materials' | 'attendance' | 'messages' | 'notifications'

const iconMap: Record<Section, React.ReactNode> = {
  dashboard: <BookOpen size={16} />,
  courses: <BookOpen size={16} />,
  progress: <TrendingUp size={16} />,
  materials: <FileText size={16} />,
  attendance: <CheckSquare size={16} />,
  messages: <MessageCircle size={16} />,
  notifications: <Bell size={16} />,
}

export default function StudentView({ lang }: { lang: Lang }) {
  const [section, setSection] = useState<Section>('dashboard')
  const [messageText, setMessageText] = useState('')
  const [msgs, setMsgs] = useState(MESSAGES)

  const unreadNotifs = NOTIFICATIONS.filter(n => n.unread).length
  const unreadMsgs = msgs.filter(m => m.unread).length

  const sendMessage = () => {
    if (!messageText.trim()) return
    setMsgs(prev => [
      { id: `m${Date.now()}`, from: 'Moi', fromRole: 'student', content: messageText, time: 'À l\'instant' },
      ...prev,
    ])
    setMessageText('')
  }

  const navItems: { key: Section; label: string }[] = [
    { key: 'dashboard', label: t('dashboard', lang) },
    { key: 'courses', label: t('myCourses', lang) },
    { key: 'progress', label: t('progress', lang) },
    { key: 'materials', label: t('materials', lang) },
    { key: 'attendance', label: t('attendance', lang) },
    { key: 'messages', label: t('messaging', lang) },
    { key: 'notifications', label: t('notifications', lang) },
  ]

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <nav style={{
        width: 220, flexShrink: 0, background: 'var(--surface)',
        borderInlineEnd: '1px solid var(--border)', padding: '20px 0'
      }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setSection(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 20px', textAlign: 'start',
            background: section === item.key ? 'var(--primary-light)' : 'transparent',
            color: section === item.key ? 'var(--primary)' : 'var(--text-2)',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: section === item.key ? 500 : 400,
            borderInlineStart: section === item.key ? '3px solid var(--primary)' : '3px solid transparent',
          }}>
            {iconMap[item.key]}
            <span>{item.label}</span>
            {item.key === 'messages' && unreadMsgs > 0 && <Badge n={unreadMsgs} />}
            {item.key === 'notifications' && unreadNotifs > 0 && <Badge n={unreadNotifs} />}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {section === 'dashboard' && <DashboardSection lang={lang} />}
        {section === 'courses' && <CoursesSection lang={lang} />}
        {section === 'progress' && <ProgressSection lang={lang} />}
        {section === 'materials' && <MaterialsSection lang={lang} />}
        {section === 'attendance' && <AttendanceSection lang={lang} />}
        {section === 'messages' && (
          <MessagingSection lang={lang} msgs={msgs} messageText={messageText}
            setMessageText={setMessageText} sendMessage={sendMessage} />
        )}
        {section === 'notifications' && <NotificationsSection lang={lang} />}
      </main>
    </div>
  )
}

function Badge({ n }: { n: number }) {
  return (
    <span style={{
      marginInlineStart: 'auto', background: '#dc2626', color: '#fff',
      borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600
    }}>{n}</span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20, color: 'var(--text)' }}>{children}</h2>
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px', ...style
    }}>
      {children}
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────
function DashboardSection({ lang }: { lang: Lang }) {
  const studentCourses = COURSES.filter(c => ['arabe-debutant', 'tajwid'].includes(c.id))

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 500 }}>{t('welcomeStudent', lang)}</h2>
        <p style={{ color: 'var(--text-2)', marginTop: 4 }}>Votre tableau de bord — semaine du 7 juillet 2025</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Cours suivis', value: '2', color: '#0d7a5f' },
          { label: 'Présences', value: '88%', color: '#7c3aed' },
          { label: 'Modules', value: '3/10', color: '#d97706' },
          { label: 'Messages', value: '1', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '16px 20px'
          }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Next sessions */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Prochaines séances</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STUDENT_SESSIONS.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'var(--surface-2)',
                borderRadius: 'var(--radius)', borderInlineStart: `3px solid var(--primary)`
              }}>
                <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.courseName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.date} · {s.time} · {s.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress rings */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Ma progression</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {STUDENT_PROGRESS.map(p => (
              <div key={p.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <ProgressRing value={p.value} max={p.max} color={p.color} size={72} stroke={6} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: p.color }}>{p.value}<span style={{ fontSize: 13, color: 'var(--text-2)' }}>/{p.max}</span></div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{lang === 'ar' ? p.labelAr : p.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My courses */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Mes cours</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {studentCourses.map(c => (
            <Card key={c.id} style={{ borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{lang === 'ar' ? c.nameAr : c.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>{c.teacher}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill color={c.color}>{c.schedule}</Pill>
                <Pill color="#6b6b6b">{c.level}</Pill>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-2)' }}>
                Prochaine : {c.nextSession}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── COURSES ─────────────────────────────────────────────────
function CoursesSection({ lang }: { lang: Lang }) {
  const studentCourses = COURSES.filter(c => ['arabe-debutant', 'tajwid'].includes(c.id))
  return (
    <div>
      <SectionTitle>{t('myCourses', lang)}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {studentCourses.map(c => (
          <Card key={c.id} style={{ borderInlineStart: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{lang === 'ar' ? c.nameAr : c.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>{c.teacher}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 480 }}>{c.description}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                <InfoRow icon="📅" label="Planning" value={c.schedule} />
                <InfoRow icon="👥" label="Élèves" value={`${c.students} élèves`} />
                <InfoRow icon="📌" label="Niveau" value={c.level} />
                <InfoRow icon="🗓" label="Prochain" value={c.nextSession} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── PROGRESS ────────────────────────────────────────────────
function ProgressSection({ lang }: { lang: Lang }) {
  return (
    <div>
      <SectionTitle>{t('progress', lang)}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {STUDENT_PROGRESS.map(p => (
          <Card key={p.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', gap: 14 }}>
            <ProgressRing value={p.value} max={p.max} color={p.color} size={100} stroke={9} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 500, color: p.color }}>{p.value}<span style={{ fontSize: 14, color: 'var(--text-2)' }}>/{p.max}</span></div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{lang === 'ar' ? p.labelAr : p.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{Math.round(p.value / p.max * 100)}% complété</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Détail — Modules Arabe débutant</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 12, fontWeight: 500,
                background: i <= 3 ? 'var(--primary)' : i === 4 ? '#fef3c7' : 'var(--surface-2)',
                color: i <= 3 ? '#fff' : i === 4 ? '#92400e' : 'var(--text-3)',
                flexShrink: 0,
              }}>
                {i <= 3 ? '✓' : i}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: i <= 3 ? 'var(--text)' : i === 4 ? 'var(--primary)' : 'var(--text-3)', fontWeight: i === 4 ? 500 : 400 }}>
                  {moduleNames[i - 1]}
                </div>
              </div>
              {i <= 3 && <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>Complété</span>}
              {i === 4 && <span style={{ fontSize: 11, color: '#d97706', fontWeight: 500 }}>En cours</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const moduleNames = [
  'Alphabet — lettres isolées',
  'Lettres en position initiale, médiane, finale',
  'Voyelles courtes (Fatha, Kasra, Damma)',
  'Voyelles longues et Sukun',
  'Tanwin et Shadda',
  'Lam Shamsiyya / Qamariyya',
  'Les mots du Coran — vocabulaire 1',
  'Lecture de phrases courtes',
  'Lecture de textes simples',
  'Évaluation finale',
]

// ─── MATERIALS ───────────────────────────────────────────────
function MaterialsSection({ lang }: { lang: Lang }) {
  return (
    <div>
      <SectionTitle>{t('materials', lang)}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MATERIALS.map(m => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '14px 18px'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.type === 'pdf' ? '#fee2e2' : '#dbeafe',
              color: m.type === 'pdf' ? '#dc2626' : '#2563eb',
            }}>
              {m.type === 'pdf' ? <FileText size={18} /> : <Volume2 size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                {m.course} · {m.date} · {m.size}
              </div>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-2)'
            }}>
              <Download size={14} />
              {t('download', lang)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ATTENDANCE ───────────────────────────────────────────────
function AttendanceSection({ lang }: { lang: Lang }) {
  const present = STUDENT_ATTENDANCE.filter(a => a.status === 'present').length
  const total = STUDENT_ATTENDANCE.length
  const rate = Math.round(present / total * 100)

  return (
    <div>
      <SectionTitle>{t('attendance', lang)}</SectionTitle>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <Card style={{ minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: 'var(--primary)' }}>{rate}%</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Taux de présence</div>
        </Card>
        <Card style={{ minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: '#0891b2' }}>{present}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Présences</div>
        </Card>
        <Card style={{ minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: '#dc2626' }}>{total - present}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Absences</div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Historique récent</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STUDENT_ATTENDANCE.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 0',
              borderBottom: i < STUDENT_ATTENDANCE.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <StatusDot status={a.status} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.courseName}</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', marginInlineStart: 8 }}>{a.date}</span>
              </div>
              <StatusBadge status={a.status} lang={lang} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { present: '#c4907a', absent: '#dc2626', excused: '#d97706' }
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status], flexShrink: 0 }} />
}

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const cfg: Record<string, { bg: string; color: string; label: string; labelAr: string }> = {
    present: { bg: '#f9ede8', color: '#8a5040', label: 'Présente', labelAr: 'حاضرة' },
    absent: { bg: '#fee2e2', color: '#991b1b', label: 'Absente', labelAr: 'غائبة' },
    excused: { bg: '#fef3c7', color: '#92400e', label: 'Excusée', labelAr: 'معذورة' },
  }
  const c = cfg[status]
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
      {lang === 'ar' ? c.labelAr : c.label}
    </span>
  )
}

// ─── MESSAGING ────────────────────────────────────────────────
function MessagingSection({ lang, msgs, messageText, setMessageText, sendMessage }: {
  lang: Lang
  msgs: typeof MESSAGES
  messageText: string
  setMessageText: (v: string) => void
  sendMessage: () => void
}) {
  return (
    <div>
      <SectionTitle>{t('messaging', lang)}</SectionTitle>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <Avatar initials="HY" color="#0d7a5f" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Ustadha Hanan Youssef</div>
            <div style={{ fontSize: 12, color: 'var(--primary)' }}>En ligne</div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
          {[...msgs].reverse().map(m => (
            <div key={m.id} style={{
              display: 'flex', flexDirection: m.fromRole === 'student' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end'
            }}>
              {m.fromRole === 'teacher' && <Avatar initials="HY" color="#0d7a5f" size={30} />}
              <div style={{
                maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
                background: m.fromRole === 'student' ? 'var(--primary)' : 'var(--surface-2)',
                color: m.fromRole === 'student' ? '#fff' : 'var(--text)',
                borderEndEndRadius: m.fromRole === 'student' ? 4 : 12,
                borderEndStartRadius: m.fromRole === 'teacher' ? 4 : 12,
              }}>
                <div style={{ fontSize: 14 }}>{lang === 'ar' && m.contentAr ? m.contentAr : m.content}</div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7, textAlign: m.fromRole === 'student' ? 'end' : 'start' }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <input
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={t('typeMessage', lang)}
            style={{
              flex: 1, padding: '10px 14px', border: '1px solid var(--border)',
              borderRadius: 8, fontSize: 14, background: 'var(--surface)',
              color: 'var(--text)', outline: 'none'
            }}
          />
          <button onClick={sendMessage} style={{
            padding: '10px 16px', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Send size={15} />
          </button>
        </div>
      </Card>
    </div>
  )
}

// ─── NOTIFICATIONS ────────────────────────────────────────────
function NotificationsSection({ lang }: { lang: Lang }) {
  const notifColors: Record<string, string> = {
    session: '#0891b2', material: '#7c3aed', message: '#0d7a5f', system: '#6b6b6b', progress: '#d97706'
  }
  return (
    <div>
      <SectionTitle>{t('notifications', lang)}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            background: n.unread ? 'var(--primary-light)' : 'var(--surface)',
            border: `1px solid ${n.unread ? '#a7f3d0' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '14px 18px'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: notifColors[n.type] + '22',
              color: notifColors[n.type],
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>
              {n.type === 'session' ? '📅' : n.type === 'material' ? '📄' : n.type === 'message' ? '💬' : n.type === 'progress' ? '⭐' : '🔔'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{lang === 'ar' ? n.titleAr : n.title}</span>
                {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{lang === 'ar' ? n.bodyAr : n.body}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HELPERS ──────────────────────────────────────────────────
function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color + '22', color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.35, fontWeight: 600
    }}>{initials}</div>
  )
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      background: color + '18', color, borderRadius: 6,
      padding: '3px 10px', fontSize: 12, fontWeight: 500
    }}>{children}</span>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
      <span>{icon}</span>
      <span style={{ color: 'var(--text-2)' }}>{label} :</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}
