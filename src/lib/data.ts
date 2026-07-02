export type Role = 'student' | 'teacher' | 'admin'
export type Lang = 'fr' | 'ar'

export interface Course {
  id: string
  name: string
  nameAr: string
  teacher: string
  teacherId: string
  category: 'arabic' | 'quran'
  level: string
  students: number
  schedule: string
  nextSession: string
  color: string
  description: string
}

export interface Student {
  id: string
  name: string
  initials: string
  course: string
  courseId: string
  attendance: number
  level: string
  joined: string
}

export interface Session {
  id: string
  courseId: string
  courseName: string
  date: string
  time: string
  duration: string
  status: 'upcoming' | 'completed' | 'cancelled'
  attendees?: number
  total?: number
}

export interface ProgressItem {
  label: string
  labelAr: string
  value: number
  max: number
  unit: string
  color: string
}

export interface AttendanceRecord {
  date: string
  status: 'present' | 'absent' | 'excused'
  courseName: string
}

export interface Message {
  id: string
  from: string
  fromRole: 'student' | 'teacher'
  content: string
  contentAr?: string
  time: string
  unread?: boolean
}

export interface Notification {
  id: string
  type: 'session' | 'material' | 'message' | 'system' | 'progress'
  title: string
  titleAr: string
  body: string
  bodyAr: string
  time: string
  unread: boolean
}

export interface Material {
  id: string
  name: string
  type: 'pdf' | 'audio' | 'video'
  course: string
  date: string
  size: string
}

export interface TeacherStudent {
  id: string
  name: string
  initials: string
  course: string
  attendance: number
  progress: number
  lastSeen: string
  level: string
}

export interface AdminStat {
  label: string
  labelAr: string
  value: number | string
  change: string
  up: boolean
  color: string
}

// ─── COURSES CATALOG ────────────────────────────────────────
export const COURSES: Course[] = [
  {
    id: 'arabe-debutant',
    name: 'Arabe 100% débutant pour femmes',
    nameAr: 'عربي للمبتدئات',
    teacher: 'Ustadha Hanan Youssef',
    teacherId: 'teacher-1',
    category: 'arabic',
    level: 'Débutant',
    students: 12,
    schedule: 'Lun & Jeu 18h',
    nextSession: 'Lundi 7 juil. 18h00',
    color: '#c4907a',
    description: 'Apprendre l\'alphabet, la lecture et les bases de la langue arabe dans un cadre bienveillant.',
  },
  {
    id: 'arabe-enfants',
    name: 'Arabe pour enfants',
    nameAr: 'عربي للأطفال',
    teacher: 'Ustadha Leila Mansouri',
    teacherId: 'teacher-3',
    category: 'arabic',
    level: 'Enfants 6-12 ans',
    students: 8,
    schedule: 'Sam 10h',
    nextSession: 'Samedi 5 juil. 10h00',
    color: '#a07858',
    description: 'Méthode ludique et interactive pour initier les enfants à la langue arabe.',
  },
  {
    id: 'lecture-fluide',
    name: 'Fluidifier la lecture',
    nameAr: 'تحسين القراءة',
    teacher: 'Ustadha Hanan Youssef',
    teacherId: 'teacher-1',
    category: 'arabic',
    level: 'Intermédiaire',
    students: 9,
    schedule: 'Mar & Ven 19h',
    nextSession: 'Mardi 8 juil. 19h00',
    color: '#9a7888',
    description: 'Consolider la lecture et gagner en fluidité pour lire sans hésitation.',
  },
  {
    id: 'conversation',
    name: 'Conversation pratique',
    nameAr: 'محادثة يومية',
    teacher: 'Ustadha Hanan Youssef',
    teacherId: 'teacher-1',
    category: 'arabic',
    level: 'Intermédiaire',
    students: 7,
    schedule: 'Mer 20h',
    nextSession: 'Mercredi 9 juil. 20h00',
    color: '#b89080',
    description: 'S\'exprimer avec aisance dans les situations courantes de la vie quotidienne.',
  },
  {
    id: 'grammaire-coran',
    name: 'Grammaire & conjugaison selon le Coran',
    nameAr: 'نحو وصرف قرآني',
    teacher: 'Ustadha Hanan Youssef',
    teacherId: 'teacher-1',
    category: 'arabic',
    level: 'Avancé',
    students: 11,
    schedule: 'Dim 15h',
    nextSession: 'Dimanche 6 juil. 15h00',
    color: '#c4907a',
    description: 'Comprendre la grammaire arabe à travers les versets coraniques.',
  },
  {
    id: 'memorisation',
    name: 'Mémorisation du Coran',
    nameAr: 'حفظ القرآن',
    teacher: 'Sheikh Ibrahim Al-Fassi',
    teacherId: 'teacher-2',
    category: 'quran',
    level: 'Tous niveaux',
    students: 15,
    schedule: 'Lun, Mer & Ven 17h',
    nextSession: 'Lundi 7 juil. 17h00',
    color: '#a07858',
    description: 'Programme structuré de mémorisation avec révision et correction du cheikh.',
  },
  {
    id: 'tajwid',
    name: 'Tajwid',
    nameAr: 'تجويد القرآن',
    teacher: 'Sheikh Ibrahim Al-Fassi',
    teacherId: 'teacher-2',
    category: 'quran',
    level: 'Débutant à avancé',
    students: 18,
    schedule: 'Mar & Sam 16h',
    nextSession: 'Mardi 8 juil. 16h00',
    color: '#0d7a5f',
    description: 'Maîtriser les règles de récitation du Coran selon les règles du Tajwid.',
  },
  {
    id: 'tafsir',
    name: 'Tafsir',
    nameAr: 'تفسير القرآن',
    teacher: 'Sheikh Ibrahim Al-Fassi',
    teacherId: 'teacher-2',
    category: 'quran',
    level: 'Intermédiaire',
    students: 10,
    schedule: 'Jeu 20h',
    nextSession: 'Jeudi 10 juil. 20h00',
    color: '#b06868',
    description: 'Comprendre le sens profond des versets coraniques avec les sources authentiques.',
  },
  {
    id: 'tawhid',
    name: 'Tawhid',
    nameAr: 'علم التوحيد',
    teacher: 'Sheikh Ibrahim Al-Fassi',
    teacherId: 'teacher-2',
    category: 'quran',
    level: 'Tous niveaux',
    students: 14,
    schedule: 'Dim 10h',
    nextSession: 'Dimanche 6 juil. 10h00',
    color: '#7a8a9a',
    description: 'Étudier les fondements de la croyance islamique et l\'unicité d\'Allah.',
  },
  {
    id: 'noms-allah',
    name: 'Les noms d\'Allah',
    nameAr: 'أسماء الله الحسنى',
    teacher: 'Sheikh Ibrahim Al-Fassi',
    teacherId: 'teacher-2',
    category: 'quran',
    level: 'Tous niveaux',
    students: 13,
    schedule: 'Mer 18h',
    nextSession: 'Mercredi 9 juil. 18h00',
    color: '#9a7888',
    description: 'Découvrir les 99 noms d\'Allah et leur signification profonde.',
  },
]

// ─── UPCOMING SESSIONS (student view) ───────────────────────
export const STUDENT_SESSIONS: Session[] = [
  { id: 's1', courseId: 'arabe-debutant', courseName: 'Arabe débutant', date: 'Lun 7 juil.', time: '18:00', duration: '1h30', status: 'upcoming' },
  { id: 's2', courseId: 'tajwid', courseName: 'Tajwid', date: 'Mar 8 juil.', time: '16:00', duration: '1h', status: 'upcoming' },
  { id: 's3', courseId: 'arabe-debutant', courseName: 'Arabe débutant', date: 'Jeu 10 juil.', time: '18:00', duration: '1h30', status: 'upcoming' },
  { id: 's4', courseId: 'tajwid', courseName: 'Tajwid', date: 'Sam 12 juil.', time: '16:00', duration: '1h', status: 'upcoming' },
]

// ─── PROGRESS (student view) ─────────────────────────────────
export const STUDENT_PROGRESS: ProgressItem[] = [
  { label: 'Modules complétés', labelAr: 'وحدات مكتملة', value: 3, max: 10, unit: 'modules', color: '#0d7a5f' },
  { label: 'Makhraj maîtrisés', labelAr: 'مخارج محسنة', value: 9, max: 17, unit: 'makhraj', color: '#7c3aed' },
  { label: 'Sourates mémorisées', labelAr: 'سور محفوظة', value: 6, max: 30, unit: 'sourates', color: '#d97706' },
  { label: 'Règles de Tajwid', labelAr: 'أحكام التجويد', value: 12, max: 20, unit: 'règles', color: '#0891b2' },
]

// ─── ATTENDANCE (student view) ────────────────────────────────
export const STUDENT_ATTENDANCE: AttendanceRecord[] = [
  { date: '30 juin', status: 'present', courseName: 'Arabe débutant' },
  { date: '28 juin', status: 'present', courseName: 'Tajwid' },
  { date: '26 juin', status: 'absent', courseName: 'Arabe débutant' },
  { date: '24 juin', status: 'present', courseName: 'Tajwid' },
  { date: '23 juin', status: 'present', courseName: 'Arabe débutant' },
  { date: '21 juin', status: 'excused', courseName: 'Tajwid' },
  { date: '19 juin', status: 'present', courseName: 'Arabe débutant' },
  { date: '17 juin', status: 'present', courseName: 'Tajwid' },
  { date: '16 juin', status: 'present', courseName: 'Arabe débutant' },
  { date: '14 juin', status: 'present', courseName: 'Tajwid' },
  { date: '12 juin', status: 'present', courseName: 'Arabe débutant' },
  { date: '10 juin', status: 'absent', courseName: 'Tajwid' },
]

// ─── MATERIALS ────────────────────────────────────────────────
export const MATERIALS: Material[] = [
  { id: 'm1', name: 'Alphabet arabe — fiche récapitulative', type: 'pdf', course: 'Arabe débutant', date: '1 juil.', size: '2.4 Mo' },
  { id: 'm2', name: 'Exercices module 3 — voyelles courtes', type: 'pdf', course: 'Arabe débutant', date: '28 juin', size: '1.1 Mo' },
  { id: 'm3', name: 'Écoute : lettres emphatiques', type: 'audio', course: 'Tajwid', date: '24 juin', size: '8.7 Mo' },
  { id: 'm4', name: 'Règles du Ghunna — explication', type: 'pdf', course: 'Tajwid', date: '21 juin', size: '3.2 Mo' },
  { id: 'm5', name: 'Récitation Sourate Al-Fatiha (modèle)', type: 'audio', course: 'Tajwid', date: '17 juin', size: '4.5 Mo' },
  { id: 'm6', name: 'Vocabulaire quotidien — liste 1', type: 'pdf', course: 'Arabe débutant', date: '14 juin', size: '890 Ko' },
]

// ─── MESSAGES ─────────────────────────────────────────────────
export const MESSAGES: Message[] = [
  { id: 'msg1', from: 'Ustadha Hanan', fromRole: 'teacher', content: 'As-salamu alaykum Fatima ! Votre prononciation des emphatiques s\'améliore vraiment bien. Continuez les exercices d\'écoute.', contentAr: 'السلام عليكم فاطمة! نطقك للحروف المفخمة يتحسن جداً. واصلي تمارين الاستماع.', time: '14:32', unread: true },
  { id: 'msg2', from: 'Moi', fromRole: 'student', content: 'Jazakillah khayr Ustadha ! J\'ai une question sur la règle de l\'Ikhfaa — pouvez-vous me la réexpliquer ?', time: '13:15' },
  { id: 'msg3', from: 'Ustadha Hanan', fromRole: 'teacher', content: 'Bien sûr ! L\'Ikhfaa est une nasalisation partielle. Lors de la prochaine séance je vous montrerai des exemples concrets dans le Coran.', time: 'Hier 18:42' },
  { id: 'msg4', from: 'Moi', fromRole: 'student', content: 'Merci beaucoup ! Barak Allahu fiki.', time: 'Hier 17:05' },
  { id: 'msg5', from: 'Ustadha Hanan', fromRole: 'teacher', content: 'N\'oubliez pas : séance exceptionnelle samedi à 10h à la place du jeudi cette semaine.', time: 'Lun 14:00' },
]

// ─── NOTIFICATIONS ────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'message', title: 'Nouveau message', titleAr: 'رسالة جديدة', body: 'Ustadha Hanan vous a envoyé un message', bodyAr: 'أرسلت لك الأستاذة حنان رسالة', time: 'Il y a 2h', unread: true },
  { id: 'n2', type: 'session', title: 'Rappel de séance', titleAr: 'تذكير بالدرس', body: 'Arabe débutant — demain à 18h00', bodyAr: 'العربي للمبتدئات — غداً الساعة 18:00', time: 'Il y a 5h', unread: true },
  { id: 'n3', type: 'material', title: 'Nouveau support', titleAr: 'مادة جديدة', body: 'Ustadha Hanan a ajouté "Exercices module 3"', bodyAr: 'أضافت الأستاذة حنان "تمارين الوحدة 3"', time: 'Hier', unread: false },
  { id: 'n4', type: 'progress', title: 'Progression validée', titleAr: 'تقدم مؤكد', body: 'Module 3 complété ! Bien joué 🌟', bodyAr: 'أتممت الوحدة 3! أحسنت!', time: 'Il y a 3 jours', unread: false },
  { id: 'n5', type: 'session', title: 'Séance annulée', titleAr: 'درس ملغى', body: 'La séance du 25 juin a été annulée par l\'Ustadha', bodyAr: 'تم إلغاء درس 25 يونيو', time: 'Il y a 1 sem.', unread: false },
]

// ─── TEACHER DATA ─────────────────────────────────────────────
export const TEACHER_STUDENTS: TeacherStudent[] = [
  { id: 'ts1', name: 'Fatima Al-Zahra', initials: 'FZ', course: 'Arabe débutant', attendance: 88, progress: 30, lastSeen: 'Aujourd\'hui', level: 'A1' },
  { id: 'ts2', name: 'Aisha Benmoussa', initials: 'AB', course: 'Arabe débutant', attendance: 95, progress: 40, lastSeen: 'Aujourd\'hui', level: 'A1' },
  { id: 'ts3', name: 'Mariam Dubois', initials: 'MD', course: 'Arabe débutant', attendance: 72, progress: 20, lastSeen: '3 jours', level: 'A1' },
  { id: 'ts4', name: 'Khadija Martin', initials: 'KM', course: 'Grammaire Coran', attendance: 91, progress: 65, lastSeen: 'Hier', level: 'B1' },
  { id: 'ts5', name: 'Zainab Lefebvre', initials: 'ZL', course: 'Grammaire Coran', attendance: 100, progress: 80, lastSeen: 'Aujourd\'hui', level: 'B2' },
  { id: 'ts6', name: 'Samira Bouali', initials: 'SB', course: 'Conversation', attendance: 83, progress: 55, lastSeen: 'Hier', level: 'B1' },
  { id: 'ts7', name: 'Nour Essafi', initials: 'NE', course: 'Conversation', attendance: 77, progress: 45, lastSeen: '2 jours', level: 'A2' },
  { id: 'ts8', name: 'Hafsa Ouali', initials: 'HO', course: 'Lecture fluide', attendance: 89, progress: 60, lastSeen: 'Hier', level: 'A2' },
]

export const TEACHER_SESSIONS: Session[] = [
  { id: 'ts1', courseId: 'arabe-debutant', courseName: 'Arabe débutant (12 élèves)', date: 'Lun 7 juil.', time: '18:00', duration: '1h30', status: 'upcoming' },
  { id: 'ts2', courseId: 'grammaire-coran', courseName: 'Grammaire Coran (11 élèves)', date: 'Dim 6 juil.', time: '15:00', duration: '2h', status: 'upcoming' },
  { id: 'ts3', courseId: 'conversation', courseName: 'Conversation (7 élèves)', date: 'Mer 9 juil.', time: '20:00', duration: '1h', status: 'upcoming' },
  { id: 'ts4', courseId: 'lecture-fluide', courseName: 'Lecture fluide (9 élèves)', date: 'Mar 8 juil.', time: '19:00', duration: '1h', status: 'upcoming' },
  { id: 'ts5', courseId: 'arabe-debutant', courseName: 'Arabe débutant — dernière séance', date: 'Jeu 3 juil.', time: '18:00', duration: '1h30', status: 'completed', attendees: 10, total: 12 },
]

// ─── ADMIN DATA ───────────────────────────────────────────────
export const ADMIN_STATS: AdminStat[] = [
  { label: 'Élèves actifs', labelAr: 'طلاب نشطون', value: 87, change: '+5 ce mois', up: true, color: '#0d7a5f' },
  { label: 'Professeurs', labelAr: 'أساتذة', value: 3, change: 'Stables', up: true, color: '#7c3aed' },
  { label: 'Cours actifs', labelAr: 'دروس نشطة', value: 10, change: '+1 ce trimestre', up: true, color: '#0891b2' },
  { label: 'Séances ce mois', labelAr: 'دروس هذا الشهر', value: 48, change: '4 annulées', up: false, color: '#d97706' },
  { label: 'Taux de présence', labelAr: 'نسبة الحضور', value: '86%', change: '+2% vs mois dernier', up: true, color: '#059669' },
  { label: 'Revenus trim.', labelAr: 'إيرادات فصلية', value: '8 700 €', change: '+12% vs T1', up: true, color: '#2563eb' },
]

export const ADMIN_COURSES: Array<Course & { status: string; revenue: string }> = COURSES.slice(0, 8).map((c, i) => ({
  ...c,
  status: i === 3 ? 'annulé' : 'actif',
  revenue: ['1 200 €', '960 €', '1 080 €', '0 €', '1 320 €', '1 800 €', '2 160 €', '1 200 €'][i],
}))

export const TEACHERS = [
  { id: 'teacher-1', name: 'Ustadha Hanan Youssef', initials: 'HY', courses: 4, students: 39, sessions: 18, rating: 4.9 },
  { id: 'teacher-2', name: 'Sheikh Ibrahim Al-Fassi', initials: 'IA', courses: 5, students: 70, sessions: 22, rating: 4.8 },
  { id: 'teacher-3', name: 'Ustadha Leila Mansouri', initials: 'LM', courses: 1, students: 8, sessions: 6, rating: 4.7 },
]
