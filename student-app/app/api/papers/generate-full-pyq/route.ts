import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFullSyllabusPaper } from '@/lib/claude/questions'
import { getSubjectInfo } from '@/lib/curriculum'
import { FREE_SESSION_LIMIT } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('class, sessions_used, is_premium')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    if (!profile.is_premium && profile.sessions_used >= FREE_SESSION_LIMIT) {
      return NextResponse.json({ error: 'Free session limit reached. Please upgrade.' }, { status: 403 })
    }

    const { subject } = await req.json()
    if (!subject) return NextResponse.json({ error: 'Missing subject' }, { status: 400 })

    const subjectInfo = getSubjectInfo(profile.class, subject)
    if (!subjectInfo) return NextResponse.json({ error: 'Subject not found' }, { status: 404 })

    const paper = await generateFullSyllabusPaper({
      classNum: profile.class,
      subject,
      subjectName: subjectInfo.name,
      chapters: subjectInfo.chapters,
    })

    // Increment session count
    await supabase
      .from('profiles')
      .update({ sessions_used: profile.sessions_used + 1 })
      .eq('id', user.id)

    return NextResponse.json({ paper })
  } catch (error) {
    console.error('Full PYQ generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate paper' },
      { status: 500 }
    )
  }
}
