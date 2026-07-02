'use client'
import { useState } from 'react'
import { Lang } from '@/lib/data'
import { t } from '@/lib/i18n'
import { ADMIN_STATS, ADMIN_COURSES, TEACHERS, TEACHER_STUDENTS, COURSES } from '@/lib/data'
import { BarChart3, Users, BookOpen, TrendingUp, X, AlertTriangle } from 'lucide-react'

type Section = 'overview' | 'courses' | 'teachers' | 'students' | 'progress'

export default function AdminView({ lang }: { lang: Lang }) {
  const [section, setSection] = useState<Section>('overview')
  const [cancelModal, setCancelModal] = useState<string | null>(null)
  const [cancelledCourses, setCancelledCourses] = useState<string[]>([])

  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 size={16} /> },
    { key: 'courses', label: 'Gestion des cours', icon: <BookOpen size={16} /> },
    { key: 'teachers', label: 'Professeurs', icon: <Users size={16} /> },
    { key: 'students', label: 'Élèves', icon: <Users size={16} /> },
    { key: 'progress', label: 'Progressions', icon: <TrendingUp size={16} /> },
  ]

  const cancelCourse = (id: string) => {
    setCancelledCourses(prev => [...prev, id])
    setCancelModal(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <nav style={{ width: 220, flexShrink: 0, background: 'var(--surface)', borderInlineEnd: '1px solid var(--border)', padding: '20px 0' }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setSection(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 20px', textAlign: 'start', border: 'none', cursor: 'pointer', fontSize: 14,
            background: section === item.key ? '#eff6ff' : 'transparent',
            color: section === item.key ? '#2563eb' : 'var(--text-2)',
            fontWeight: section === item.key ? 500 : 400,
            borderInlineStart: section === item.key ? '3px solid #2563eb' : '3px solid transparent',
          }}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {section === 'overview' && <OverviewSection lang={lang} />}
        {section === 'courses' && <CoursesSection lang={lang} cancelledCourses={cancelledCourses} onCancel={setCancelModal} />}
        {section === 'teachers' && <TeachersSection lang={lang} />}
        {section === 'students' && <StudentsSection lang={lang} />}
        {section === 'progress' && <ProgressSection lang={lang} />}
      </main>

      {cancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, maxWidth: 400, width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: '#dc2626' }}>
              <AlertTriangle size={22} />
              <h3 style={{ fontSize: 17, fontWeight: 500 }}>Annuler le cours</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
              Confirmer l'annulation ? Tous les élèves et le professeur seront notifiés.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setCancelModal(null)} style={{ padding: '9px 20px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', background: 'var(--surface)', fontSize: 14 }}>Retour</button>
              <button onClick={() => cancelCourse(cancelModal)} style={{ padding: '9px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── OVERVIEW ─────────────────────────────────────────────────
function OverviewSection({ lang }: { lang: Lang }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 500 }}>{t('welcomeAdmin', lang)}</h2>
        <p style={{ color: 'var(--text-2)', marginTop: 4 }}>Tableau de bord — Juillet 2025</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {ADMIN_STATS.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px 20px',
            borderTop: `3px solid ${s.color}`
          }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2, fontWeight: 500 }}>
              {lang === 'ar' ? s.labelAr : s.label}
            </div>
            <div style={{ fontSize: 12, color: s.up ? '#059669' : '#dc2626', marginTop: 6 }}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 500, fontSize: 14 }}>Professeurs</div>
          {TEACHERS.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
              borderBottom: i < TEACHERS.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <MiniAvatar initials={t.initials} color="#2563eb" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.courses} cours · {t.students} élèves</div>
              </div>
              <span style={{ fontSize: 13, color: '#d97706', fontWeight: 500 }}>★ {t.rating}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 500, fontSize: 14 }}>Cours populaires</div>
          {COURSES.slice(0, 5).map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px',
              borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13 }}>{lang === 'ar' ? c.nameAr : c.name}</div>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.students} élèves</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── COURSES ─────────────────────────────────────────────────
function CoursesSection({ lang, cancelledCourses, onCancel }: {
  lang: Lang; cancelledCourses: string[]; onCancel: (id: string) => void
}) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Gestion des cours</h2>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['Cours', 'Professeur', 'Élèves', 'Planning', 'Statut', 'Revenus', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'start', fontWeight: 500, color: 'var(--text-2)', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_COURSES.map((c, i) => {
              const isCancelled = cancelledCourses.includes(c.id) || c.status === 'annulé'
              return (
                <tr key={c.id} style={{ borderBottom: i < ADMIN_COURSES.length - 1 ? '1px solid var(--border)' : 'none', opacity: isCancelled ? 0.6 : 1 }}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 500 }}>{lang === 'ar' ? c.nameAr : c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-2)' }}>{c.teacher.split(' ').slice(-1)[0]}</td>
                  <td style={{ padding: '11px 14px' }}>{c.students}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-2)' }}>{c.schedule}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <StatusTag active={!isCancelled} />
                  </td>
                  <td style={{ padding: '11px 14px', fontWeight: 500 }}>{c.revenue}</td>
                  <td style={{ padding: '11px 14px' }}>
                    {!isCancelled && (
                      <button onClick={() => onCancel(c.id)} style={{
                        padding: '5px 10px', background: '#fee2e2', color: '#dc2626',
                        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <X size={11} /> Annuler
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── TEACHERS ─────────────────────────────────────────────────
function TeachersSection({ lang }: { lang: Lang }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Professeurs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '22px 24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <MiniAvatar initials={teacher.initials} color="#2563eb" size={46} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{teacher.name}</div>
                <div style={{ fontSize: 13, color: '#d97706' }}>★ {teacher.rating} / 5</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Cours', value: teacher.courses },
                { label: 'Élèves', value: teacher.students },
                { label: 'Séances/mois', value: teacher.sessions },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--surface-2)', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: '#2563eb' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STUDENTS ─────────────────────────────────────────────────
function StudentsSection({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState('')
  const filtered = TEACHER_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Élèves ({TEACHER_STUDENTS.length})</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un élève..."
          style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, width: 220, outline: 'none' }}
        />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['Élève', 'Cours', 'Présence', 'Progression', 'Niveau', 'Dernière activité'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'start', fontWeight: 500, color: 'var(--text-2)', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MiniAvatar initials={s.initials} color="#0d7a5f" />
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: '11px 14px', color: 'var(--text-2)' }}>{s.course}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ color: s.attendance >= 90 ? '#059669' : s.attendance >= 75 ? '#d97706' : '#dc2626', fontWeight: 500 }}>
                    {s.attendance}%
                  </span>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 70, height: 5, background: 'var(--border)', borderRadius: 3 }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: '#2563eb', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: 6, padding: '3px 8px', fontSize: 12 }}>{s.level}</span>
                </td>
                <td style={{ padding: '11px 14px', color: 'var(--text-2)' }}>{s.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── PROGRESS ─────────────────────────────────────────────────
function ProgressSection({ lang }: { lang: Lang }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Vue d'ensemble des progressions</h2>

      {/* Attendance heatmap */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Taux de présence par cours</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COURSES.slice(0, 6).map(c => {
            const pct = Math.floor(Math.random() * 25 + 74)
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 160, fontSize: 13, color: 'var(--text)' }}>{lang === 'ar' ? c.nameAr : c.name.slice(0, 22)}{c.name.length > 22 ? '…' : ''}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 85 ? '#059669' : pct >= 75 ? '#d97706' : '#dc2626', borderRadius: 4 }} />
                </div>
                <div style={{ width: 40, textAlign: 'end', fontSize: 13, fontWeight: 500 }}>{pct}%</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top students */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Meilleure progression ce mois</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TEACHER_STUDENTS.sort((a, b) => b.progress - a.progress).slice(0, 5).map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ width: 22, fontWeight: 500, color: i < 3 ? '#d97706' : 'var(--text-3)', fontSize: 14 }}>#{i + 1}</span>
              <MiniAvatar initials={s.initials} color="#2563eb" />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.name}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.course}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>{s.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────
function MiniAvatar({ initials, color = '#2563eb', size = 34 }: { initials: string; color?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color + '22',
      color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0
    }}>{initials}</div>
  )
}

function StatusTag({ active }: { active: boolean }) {
  return (
    <span style={{
      background: active ? '#dcfce7' : '#fee2e2',
      color: active ? '#166534' : '#991b1b',
      borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500
    }}>
      {active ? 'Actif' : 'Annulé'}
    </span>
  )
}
