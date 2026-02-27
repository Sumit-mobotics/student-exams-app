import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { class: classNum, subjects } = await req.json()

    if (!classNum || !subjects || subjects.length === 0) {
      return NextResponse.json({ error: 'Class and subjects are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('profiles')
      .update({ class: classNum, subjects })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
