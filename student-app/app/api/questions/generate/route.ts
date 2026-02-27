import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuestions } from '@/lib/claude/questions'
import { getChapterInfo } from '@/lib/curriculum'
import { FREE_SESSION_LIMIT } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('class, sessions_used, is_premium')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Check freemium gate
    if (!profile.is_premium && profile.sessions_used >= FREE_SESSION_LIMIT) {
      return NextResponse.json({ error: 'Free session limit reached. Please upgrade.' }, { status: 403 })
    }

    const body = await req.json()
    const { classNum, subject, chapterId, topics, mode } = body

    if (!classNum || !subject || !chapterId || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const chapterInfo = getChapterInfo(classNum, subject, chapterId)
    if (!chapterInfo) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const questionCount = mode === 'sample_paper' ? 25 : mode === 'chapter_test' ? 8 : 10
    // Pool size: cache 2.5× more questions so each retry draws a fresh random subset
    const poolSize = mode === 'sample_paper' ? 25 : questionCount * 3

    // Check cache (only for quick/pyq/chapter_test — sample_paper is always fresh)
    if (mode !== 'sample_paper') {
      const { data: cached } = await supabase
        .from('question_cache')
        .select('questions')
        .eq('class_num', classNum)
        .eq('subject', subject)
        .eq('chapter_id', chapterId)
        .eq('mode', mode)
        .single()

      if (cached?.questions && Array.isArray(cached.questions) && cached.questions.length >= questionCount) {
        // Increment session count
        await supabase
          .from('profiles')
          .update({ sessions_used: profile.sessions_used + 1 })
          .eq('id', user.id)

        // Shuffle the cached pool and return a fresh random subset every time
        const shuffled = [...cached.questions].sort(() => Math.random() - 0.5)
        return NextResponse.json({ questions: shuffled.slice(0, questionCount) })
      }
    }

    // Generate with AI — produce a larger pool on first run so future retries vary
    const questions = await generateQuestions({
      classNum,
      subject,
      chapter: chapterInfo.name,
      topics: topics || chapterInfo.topics,
      count: poolSize,
      mode,
    })

    // Cache the full pool (only for quick/pyq/chapter_test)
    if (mode !== 'sample_paper') {
      await supabase.from('question_cache').upsert({
        class_num: classNum,
        subject,
        chapter_id: chapterId,
        mode,
        questions,
      }, { onConflict: 'class_num,subject,chapter_id,mode' })
    }

    // Increment session count
    await supabase
      .from('profiles')
      .update({ sessions_used: profile.sessions_used + 1 })
      .eq('id', user.id)

    // Return a random subset from the generated pool
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return NextResponse.json({ questions: shuffled.slice(0, questionCount) })
  } catch (error) {
    console.error('Question generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    )
  }
}
