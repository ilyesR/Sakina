'use client'
import { useState } from 'react'
import { Role, Lang } from '@/lib/data'
import { t } from '@/lib/i18n'
import StudentView from '@/components/student/StudentView'
import TeacherView from '@/components/teacher/TeacherView'
import AdminView from '@/components/admin/AdminView'
import CourseCatalog from '@/components/catalog/CourseCatalog'
import { BookOpen, GraduationCap, LayoutDashboard, ChevronDown, Globe, Star } from 'lucide-react'

type MainSection = 'app' | 'catalog'

const roleConfig = {
  student: { label: 'Élève', labelAr: 'طالبة', color: '#0d7a5f', icon: <GraduationCap size={16} /> },
  teacher: { label: 'Professeur', labelAr: 'أستاذة', color: '#7c3aed', icon: <BookOpen size={16} /> },
  admin: { label: 'Admin', labelAr: 'مدير', color: '#2563eb', icon: <LayoutDashboard size={16} /> },
}

export default function Home() {
  const [role, setRole] = useState<Role>('student')
  const [lang, setLang] = useState<Lang>('fr')
  const [mainSection, setMainSection] = useState<MainSection>('app')
  const [roleOpen, setRoleOpen] = useState(false)

  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const cfg = roleConfig[role]

  const toggleLang = () => setLang(l => l === 'fr' ? 'ar' : 'fr')

  return (
    <div dir={dir} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar — Demo banner */}
      <div style={{
        background: 'var(--primary)', color: '#fff', textAlign: 'center',
        padding: '6px 16px', fontSize: 13
      }}>
        {lang === 'ar'
          ? '🌟 عرض تجريبي — بيانات وهمية لأغراض العرض'
          : '🌟 Démo — données fictives à des fins de présentation'}
      </div>

      {/* Header */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px',
        gap: 16, position: 'sticky', top: 0, zIndex: 40
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginInlineEnd: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Star size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary)' }}>
            {lang === 'ar' ? 'سكينة' : 'Sakina'}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {([['app', lang === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'], ['catalog', lang === 'ar' ? 'الدورات' : 'Catalogue']] as [MainSection, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setMainSection(key)} style={{
              padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: 14, borderRadius: 8,
              background: mainSection === key ? 'var(--primary-light)' : 'transparent',
              color: mainSection === key ? 'var(--primary)' : 'var(--text-2)',
              fontWeight: mainSection === key ? 500 : 400,
            }}>{label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Lang toggle */}
        <button onClick={toggleLang} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', border: '1px solid var(--border)',
          borderRadius: 8, cursor: 'pointer', background: 'var(--surface)',
          fontSize: 13, color: 'var(--text-2)'
        }}>
          <Globe size={15} />
          {lang === 'fr' ? 'عربي' : 'Français'}
        </button>

        {/* Role switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setRoleOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', border: `1.5px solid ${cfg.color}`,
              borderRadius: 8, cursor: 'pointer',
              background: cfg.color + '14', color: cfg.color,
              fontSize: 14, fontWeight: 500
            }}
          >
            {cfg.icon}
            <span>{lang === 'ar' ? cfg.labelAr : cfg.label}</span>
            <ChevronDown size={14} style={{ opacity: 0.7, transform: roleOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {roleOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', insetInlineEnd: 0,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              minWidth: 180, zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: '8px', fontSize: 11, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                {lang === 'ar' ? 'اختر الدور' : 'Changer de vue'}
              </div>
              {(Object.entries(roleConfig) as [Role, typeof roleConfig.student][]).map(([r, c]) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '11px 14px', border: 'none',
                    cursor: 'pointer', textAlign: 'start', fontSize: 14,
                    background: role === r ? c.color + '12' : 'transparent',
                    color: role === r ? c.color : 'var(--text)',
                    fontWeight: role === r ? 500 : 400,
                  }}
                >
                  {c.icon}
                  <span>{lang === 'ar' ? c.labelAr : c.label}</span>
                  {role === r && <span style={{ marginInlineStart: 'auto', fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: cfg.color + '22', color: cfg.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>
          {role === 'student' ? 'FZ' : role === 'teacher' ? 'HY' : 'AD'}
        </div>
      </header>

      {/* Close dropdown on outside click */}
      {roleOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 39 }}
          onClick={() => setRoleOpen(false)}
        />
      )}

      {/* Main content */}
      {mainSection === 'catalog' ? (
        <div style={{ padding: '28px 32px' }}>
          <CourseCatalog lang={lang} />
        </div>
      ) : (
        <>
          {role === 'student' && <StudentView lang={lang} />}
          {role === 'teacher' && <TeacherView lang={lang} />}
          {role === 'admin' && <AdminView lang={lang} />}
        </>
      )}
    </div>
  )
}
