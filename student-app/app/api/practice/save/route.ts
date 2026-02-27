import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('class')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const body = await req.json()
    const { subject, chapterId, chapterName, mode, questions, answers, score, totalMarks, timeTaken } = body

    const { error } = await supabase.from('practice_sessions').insert({
      user_id: user.id,
      class: profile.class,
      subject,
      chapter: chapterName ?? chapterId.toString(),
      chapter_id: chapterId,
      mode: mode ?? 'quick',
      questions,
      answers,
      score: score ?? 0,
      total_marks: totalMarks ?? 0,
      time_taken: timeTaken ?? 0,
      completed: true,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save session error:', error)
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 })
  }
}
