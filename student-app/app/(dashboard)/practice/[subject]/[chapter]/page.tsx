import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSubjectInfo, getChapterInfo } from '@/lib/curriculum'
import PracticeSession from '@/components/practice/PracticeSession'
import { UserProfile } from '@/types'

interface Props {
  params: Promise<{ subject: string; chapter: string }>
}

export default async function PracticePage({ params }: Props) {
  const { subject, chapter } = await params
  const chapterId = parseInt(chapter)
  if (isNaN(chapterId)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.class) redirect('/onboarding')

  const p = profile as UserProfile
  const subjectInfo = getSubjectInfo(p.class, subject)
  const chapterInfo = getChapterInfo(p.class, subject, chapterId)

  if (!subjectInfo || !chapterInfo) notFound()

  return (
    <PracticeSession
      classNum={p.class}
      subject={subject}
      subjectName={subjectInfo.name}
      chapterId={chapterId}
      chapterName={chapterInfo.name}
      topics={chapterInfo.topics}
      sessionsUsed={p.sessions_used}
      isPremium={p.is_premium}
    />
  )
}
