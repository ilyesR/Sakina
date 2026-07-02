'use client'
import { useState } from 'react'
import { Lang, COURSES } from '@/lib/data'
import { t } from '@/lib/i18n'
import { Search } from 'lucide-react'

type Filter = 'all' | 'arabic' | 'quran'

const prices: Record<string, string> = {
  'arabe-debutant': '120 €',
  'arabe-enfants': '90 €',
  'lecture-fluide': '110 €',
  conversation: '100 €',
  'grammaire-coran': '120 €',
  memorisation: '130 €',
  tajwid: '110 €',
  tafsir: '120 €',
  tawhid: '100 €',
  'noms-allah': '100 €',
}

export default function CourseCatalog({ lang }: { lang: Lang }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [enrolled, setEnrolled] = useState<string[]>([])

  const filtered = COURSES.filter(c => {
    const matchCat = filter === 'all' || c.category === filter
    const matchSearch = (lang === 'ar' ? c.nameAr : c.name).toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const filterLabels: { key: Filter; label: string; labelAr: string }[] = [
    { key: 'all', label: 'Tous les cours', labelAr: 'جميع الدروس' },
    { key: 'arabic', label: 'Arabe', labelAr: 'عربي' },
    { key: 'quran', label: 'Coran & Sciences islamiques', labelAr: 'قرآن وعلوم' },
  ]

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #c4907a 0%, #a07060 100%)',
        borderRadius: 'var(--radius-lg)', padding: '32px 36px', marginBottom: 28, color: '#fff'
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 500, marginBottom: 8 }}>
          {lang === 'ar' ? 'دروس اللغة العربية والعلوم الإسلامية' : 'Cours d\'arabe & Sciences islamiques'}
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 22 }}>
          {lang === 'ar'
            ? 'تعلّم العربية والقرآن مع أساتذة متخصصين — دروس حية عبر الإنترنت'
            : 'Apprenez avec des enseignants qualifiés — cours en ligne en direct'}
        </p>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { v: '10', l: lang === 'ar' ? 'دروس' : 'cours', la: 'actifs' },
            { v: '3', l: lang === 'ar' ? 'أساتذة' : 'enseignants', la: '' },
            { v: '87', l: lang === 'ar' ? 'طالب' : 'élèves', la: '' },
            { v: '★ 4.8', l: lang === 'ar' ? 'تقييم' : 'note', la: 'moyenne' },
          ].map(s => (
            <div key={s.l}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{s.v}</span>
              <span style={{ fontSize: 14, opacity: 0.85, marginInlineStart: 6 }}>{s.l}{s.la ? ` ${s.la}` : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {filterLabels.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '9px 16px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: filter === f.key ? 'var(--primary)' : 'transparent',
              color: filter === f.key ? '#fff' : 'var(--text-2)',
            }}>
              {lang === 'ar' ? f.labelAr : f.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 260, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search', lang)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              border: '1px solid var(--border)', borderRadius: 8, fontSize: 13,
              background: 'var(--surface)', color: 'var(--text)', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
        {filtered.map(c => {
          const isEnrolled = enrolled.includes(c.id)
          return (
            <div key={c.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}>
              {/* Color band */}
              <div style={{ height: 6, background: c.color }} />
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{
                    background: c.category === 'arabic' ? '#e8f5f1' : '#f3f0ff',
                    color: c.category === 'arabic' ? '#0d7a5f' : '#7c3aed',
                    fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6
                  }}>
                    {c.category === 'arabic'
                      ? (lang === 'ar' ? 'عربي' : 'Arabe')
                      : (lang === 'ar' ? 'قرآن' : 'Coran')}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{c.students} élèves</span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>
                  {lang === 'ar' ? c.nameAr : c.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', flex: 1, marginBottom: 14 }}>{c.description}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  <InfoLine icon="👩‍🏫" text={c.teacher} />
                  <InfoLine icon="📅" text={c.schedule} />
                  <InfoLine icon="📌" text={c.level} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 600, color: c.color }}>{prices[c.id]}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', marginInlineStart: 4 }}>{t('perTrimester', lang)}</span>
                  </div>
                  <button
                    onClick={() => setEnrolled(prev => isEnrolled ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                    style={{
                      padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      background: isEnrolled ? '#dcfce7' : c.color,
                      color: isEnrolled ? '#166534' : '#fff',
                      border: isEnrolled ? '1px solid #86efac' : 'none',
                    }}
                  >
                    {isEnrolled ? '✓ Inscrit(e)' : (lang === 'ar' ? 'التسجيل' : 'S\'inscrire')}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InfoLine({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-2)' }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}
