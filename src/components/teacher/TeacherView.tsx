'use client'
import { useState } from 'react'
import { Lang } from '@/lib/data'
import { t } from '@/lib/i18n'
import {
  TEACHER_STUDENTS, TEACHER_SESSIONS, MATERIALS, MESSAGES, NOTIFICATIONS, COURSES
} from '@/lib/data'
import {
  BookOpen, Users, Calendar, FileText, CheckSquare,
  MessageCircle, Bell, Upload, Send, X, TrendingUp, AlertTriangle
} from 'lucide-react'

type Section = 'dashboard' | 'courses' | 'students' | 'attendance' | 'materials' | 'messages' | 'notifications'

export default function TeacherView({ lang }: { lang: Lang }) {
  const [section, setSection] = useState<Section>('dashboard')
  const [messageText, setMessageText] = useState('')
  const [msgs, setMsgs] = useState<ChatMsg[]>([...MESSAGES].map(m => ({
    id: m.id,
    from: m.fromRole === 'student' ? 'Fatima Al-Zahra' : 'Moi',
    fromRole: (m.fromRole === 'student' ? 'teacher' : 'student') as 'student' | 'teacher',
    content: m.content,
    time: m.time,
    unread: m.unread,
  })))
  const [cancelModal, setCancelModal] = useState<string | null>(null)
  const [cancelledSessions, setCancelledSessions] = useState<string[]>([])
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({})

  const navItems: { key: Section; label: string }[] = [
    { key: 'dashboard', label: t('dashboard', lang) },
    { key: 'courses', label: t('courses', lang) },
    { key: 'students', label: t('students', lang) },
    { key: 'attendance', label: t('markAttendance', lang) },
    { key: 'materials', label: t('materials', lang) },
    { key: 'messages', label: t('messaging', lang) },
    { key: 'notifications', label: t('notifications', lang) },
  ]

  const icons: Record<Section, React.ReactNode> = {
    dashboard: <BookOpen size={16} />,
    courses: <Calendar size={16} />,
    students: <Users size={16} />,
    attendance: <CheckSquare size={16} />,
    materials: <FileText size={16} />,
    messages: <MessageCircle size={16} />,
    notifications: <Bell size={16} />,
  }

  const sendMessage = () => {
    if (!messageText.trim()) return
    setMsgs(prev => [{ id: `m${Date.now()}`, from: 'Moi', fromRole: 'teacher' as const, content: messageText, time: 'À l\'instant' }, ...prev])
    setMessageText('')
  }

  const cancelSession = (id: string) => {
    setCancelledSessions(prev => [...prev, id])
    setCancelModal(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <nav style={{ width: 220, flexShrink: 0, background: 'var(--surface)', borderInlineEnd: '1px solid var(--border)', padding: '20px 0' }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setSection(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 20px', textAlign: 'start',
            background: section === item.key ? '#f3f0ff' : 'transparent',
            color: section === item.key ? '#7c3aed' : 'var(--text-2)',
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: section === item.key ? 500 : 400,
            borderInlineStart: section === item.key ? '3px solid #7c3aed' : '3px solid transparent',
          }}>
            {icons[item.key]}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {section === 'dashboard' && <TeacherDashboard lang={lang} cancelledSessions={cancelledSessions} onCancel={setCancelModal} />}
        {section === 'courses' && <TeacherCourses lang={lang} cancelledSessions={cancelledSessions} onCancel={setCancelModal} />}
        {section === 'students' && <TeacherStudents lang={lang} attendance={attendance} setAttendance={setAttendance} />}
        {section === 'attendance' && <TeacherAttendance lang={lang} attendance={attendance} setAttendance={setAttendance} />}
        {section === 'materials' && <TeacherMaterials lang={lang} />}
        {section === 'messages' && <TeacherMessaging lang={lang} msgs={msgs as ChatMsg[]} messageText={messageText} setMessageText={setMessageText} sendMessage={sendMessage} />}
        {section === 'notifications' && <TeacherNotifications lang={lang} />}
      </main>

      {/* Cancel Modal */}
      {cancelModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, maxWidth: 400, width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: '#dc2626' }}>
              <AlertTriangle size={22} />
              <h3 style={{ fontSize: 17, fontWeight: 500 }}>Annuler le cours</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
              Voulez-vous annuler cette séance ? Les élèves inscrits seront notifiés automatiquement.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setCancelModal(null)} style={{
                padding: '9px 20px', border: '1px solid var(--border)', borderRadius: 8,
                cursor: 'pointer', background: 'var(--surface)', fontSize: 14
              }}>Annuler</button>
              <button onClick={() => cancelSession(cancelModal)} style={{
                padding: '9px 20px', background: '#dc2626', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14
              }}>Confirmer l'annulation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────
function TeacherDashboard({ lang, cancelledSessions, onCancel }: {
  lang: Lang; cancelledSessions: string[]; onCancel: (id: string) => void
}) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 500 }}>{t('welcomeTeacher', lang)}</h2>
        <p style={{ color: 'var(--text-2)', marginTop: 4 }}>Vos cours cette semaine</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Cours actifs', value: '4', color: '#7c3aed' },
          { label: 'Élèves total', value: '39', color: '#0d7a5f' },
          { label: 'Séances / sem.', value: '7', color: '#0891b2' },
          { label: 'Taux présence', value: '87%', color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Prochaines séances</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TEACHER_SESSIONS.map(s => (
          <SessionRow key={s.id} session={s} cancelled={cancelledSessions.includes(s.id)} onCancel={() => onCancel(s.id)} lang={lang} />
        ))}
      </div>
    </div>
  )
}

function SessionRow({ session, cancelled, onCancel, lang }: {
  session: typeof TEACHER_SESSIONS[0]; cancelled: boolean; onCancel: () => void; lang: Lang
}) {
  const status = cancelled ? 'cancelled' : session.status
  const statusColors = { upcoming: '#0d7a5f', completed: '#6b6b6b', cancelled: '#dc2626' }
  const statusLabels = { upcoming: 'À venir', completed: 'Terminée', cancelled: 'Annulée' }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '14px 18px',
      opacity: cancelled ? 0.6 : 1
    }}>
      <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{session.courseName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
          {session.date} · {session.time} · {session.duration}
          {session.attendees !== undefined && ` · ${session.attendees}/${session.total} présents`}
        </div>
      </div>
      <span style={{
        borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500,
        background: statusColors[status] + '18', color: statusColors[status]
      }}>{statusLabels[status]}</span>
      {status === 'upcoming' && (
        <button onClick={onCancel} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
          background: '#fee2e2', color: '#dc2626', border: 'none',
          borderRadius: 7, cursor: 'pointer', fontSize: 13
        }}>
          <X size={13} /> Annuler
        </button>
      )}
    </div>
  )
}

// ─── COURSES ─────────────────────────────────────────────────
function TeacherCourses({ lang, cancelledSessions, onCancel }: {
  lang: Lang; cancelledSessions: string[]; onCancel: (id: string) => void
}) {
  const myCourses = COURSES.filter(c => c.teacherId === 'teacher-1')
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Mes cours</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {myCourses.map(c => (
          <div key={c.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px 22px',
            borderTop: `3px solid ${c.color}`
          }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{lang === 'ar' ? c.nameAr : c.name}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip color={c.color}>{c.schedule}</Chip>
              <Chip color="#6b6b6b">{c.students} élèves</Chip>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>{c.description}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1, padding: '8px', background: c.color + '18', color: c.color,
                border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 500
              }}>Voir les élèves</button>
              <button onClick={() => onCancel(c.id)} style={{
                padding: '8px 12px', background: '#fee2e2', color: '#dc2626',
                border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13
              }}>Annuler prochain</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STUDENTS ─────────────────────────────────────────────────
function TeacherStudents({ lang, attendance, setAttendance }: {
  lang: Lang
  attendance: Record<string, 'present' | 'absent'>
  setAttendance: (a: Record<string, 'present' | 'absent'>) => void
}) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Mes élèves</h2>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['Élève', 'Cours', 'Présence', 'Progression', 'Niveau', 'Dernière vue'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 500, fontSize: 13, color: 'var(--text-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEACHER_STUDENTS.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < TEACHER_STUDENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AvatarSmall initials={s.initials} />
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 13 }}>{s.course}</td>
                <td style={{ padding: '12px 16px' }}>
                  <AttBadge pct={s.attendance} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <ProgressBar value={s.progress} />
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  <Chip color="#7c3aed">{s.level}</Chip>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 13 }}>{s.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── ATTENDANCE MARKING ──────────────────────────────────────
function TeacherAttendance({ lang, attendance, setAttendance }: {
  lang: Lang
  attendance: Record<string, 'present' | 'absent'>
  setAttendance: (a: Record<string, 'present' | 'absent'>) => void
}) {
  const [saved, setSaved] = useState(false)
  const toggle = (id: string) => {
    const next = attendance[id] === 'present' ? 'absent' : 'present'
    setAttendance({ ...attendance, [id]: next })
    setSaved(false)
  }
  const saveAll = () => setSaved(true)

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Saisie des présences</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: 20, fontSize: 14 }}>Séance du Lundi 7 juil. — Arabe débutant</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
        {TEACHER_STUDENTS.filter(s => s.course === 'Arabe débutant').map((s, i, arr) => {
          const status = attendance[s.id] ?? 'present'
          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: status === 'absent' ? '#fff8f8' : 'transparent'
            }}>
              <AvatarSmall initials={s.initials} />
              <span style={{ flex: 1, fontWeight: 500 }}>{s.name}</span>
              <button
                onClick={() => toggle(s.id)}
                style={{
                  padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  border: 'none',
                  background: status === 'present' ? '#dcfce7' : '#fee2e2',
                  color: status === 'present' ? '#166534' : '#991b1b',
                }}
              >
                {status === 'present' ? '✓ Présente' : '✗ Absente'}
              </button>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={saveAll} style={{
          padding: '10px 24px', background: '#7c3aed', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500
        }}>Enregistrer les présences</button>
        {saved && <span style={{ color: '#0d7a5f', fontSize: 14 }}>✓ Enregistré avec succès</span>}
      </div>
    </div>
  )
}

// ─── MATERIALS ────────────────────────────────────────────────
function TeacherMaterials({ lang }: { lang: Lang }) {
  const [uploaded, setUploaded] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Supports de cours</h2>
        <button onClick={() => setUploaded(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
          background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8,
          cursor: 'pointer', fontSize: 14
        }}>
          <Upload size={15} /> Ajouter un support
        </button>
      </div>
      {uploaded && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', background: '#dcfce7',
          borderRadius: 8, fontSize: 14, color: '#166534'
        }}>
          ✓ "Nouveau support.pdf" téléversé avec succès
        </div>
      )}
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
              color: m.type === 'pdf' ? '#dc2626' : '#2563eb', fontSize: 18
            }}>
              {m.type === 'pdf' ? '📄' : '🎵'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{m.course} · {m.date} · {m.size}</div>
            </div>
            <button style={{
              padding: '7px 12px', background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13
            }}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ChatMsg { id: string; from: string; fromRole: 'student' | 'teacher'; content: string; time: string; unread?: boolean }

// ─── MESSAGING ───────────────────────────────────────────────
function TeacherMessaging({ lang, msgs, messageText, setMessageText, sendMessage }: {
  lang: Lang
  msgs: ChatMsg[]
  messageText: string
  setMessageText: (v: string) => void
  sendMessage: () => void
}) {
  const [selected, setSelected] = useState('ts1')
  const studentNames = ['Fatima Al-Zahra', 'Aisha Benmoussa', 'Khadija Martin']

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Messages</h2>
      <div style={{ display: 'flex', gap: 16, height: 520 }}>
        {/* Contacts list */}
        <div style={{ width: 200, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {TEACHER_STUDENTS.slice(0, 5).map((s, i) => (
            <button key={s.id} onClick={() => setSelected(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 14px',
              textAlign: 'start', border: 'none', cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
              background: selected === s.id ? '#f3f0ff' : 'transparent',
            }}>
              <AvatarSmall initials={s.initials} color="#7c3aed" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name.split(' ')[0]}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.course}</div>
              </div>
            </button>
          ))}
        </div>
        {/* Chat */}
        <div style={{
          flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500, fontSize: 14 }}>
            {TEACHER_STUDENTS.find(s => s.id === selected)?.name ?? 'Fatima Al-Zahra'}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...msgs].reverse().map(m => (
              <div key={m.id} style={{
                display: 'flex', flexDirection: m.fromRole === 'teacher' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end'
              }}>
                <div style={{
                  maxWidth: '70%', padding: '10px 13px', borderRadius: 10, fontSize: 13,
                  background: m.fromRole === 'teacher' ? '#7c3aed' : 'var(--surface-2)',
                  color: m.fromRole === 'teacher' ? '#fff' : 'var(--text)',
                }}>
                  {m.content}
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Écrire un message..."
              style={{ flex: 1, padding: '9px 13px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
            />
            <button onClick={sendMessage} style={{ padding: '9px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer' }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NOTIFICATIONS ───────────────────────────────────────────
function TeacherNotifications({ lang }: { lang: Lang }) {
  const notifs = [
    { type: 'message', title: 'Question d\'élève', body: 'Fatima Al-Zahra a posé une question sur l\'Ikhfaa', time: 'Il y a 2h', unread: true },
    { type: 'session', title: 'Rappel séance', body: 'Arabe débutant — demain à 18h00 (12 élèves inscrits)', time: 'Il y a 4h', unread: true },
    { type: 'system', title: 'Nouveau support partagé', body: 'Sheikh Ibrahim a partagé un document Tajwid', time: 'Hier', unread: false },
    { type: 'system', title: 'Rapport mensuel disponible', body: 'Votre rapport de juin est prêt à télécharger', time: 'Il y a 2 jours', unread: false },
  ]
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Notifications</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, padding: '14px 18px',
            background: n.unread ? '#f3f0ff' : 'var(--surface)',
            border: `1px solid ${n.unread ? '#c4b5fd' : 'var(--border)'}`,
            borderRadius: 'var(--radius)'
          }}>
            <div style={{ fontSize: 20 }}>
              {n.type === 'message' ? '💬' : n.type === 'session' ? '📅' : '🔔'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{n.body}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────
function AvatarSmall({ initials, color = '#0d7a5f' }: { initials: string; color?: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', background: color + '22',
      color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 600, flexShrink: 0
    }}>{initials}</div>
  )
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ background: color + '18', color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
      {children}
    </span>
  )
}

function AttBadge({ pct }: { pct: number }) {
  const color = pct >= 90 ? '#059669' : pct >= 75 ? '#d97706' : '#dc2626'
  return <span style={{ color, fontWeight: 500, fontSize: 13 }}>{pct}%</span>
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: '#7c3aed', borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{value}%</span>
    </div>
  )
}
