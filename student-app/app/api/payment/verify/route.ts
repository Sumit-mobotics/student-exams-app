import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPaymentSignature, PLAN_DURATIONS, PLAN_PRICES } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    // Use regular client just to get the authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } = await req.json()

    // Verify Razorpay signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Calculate expiry
    const durationDays = PLAN_DURATIONS[planId] ?? 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    // Use admin client (service role) to bypass RLS for DB writes
    const admin = createAdminClient()

    const { error: subError } = await admin.from('subscriptions').insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      plan: planId,
      amount: PLAN_PRICES[planId] ?? 0,
      status: 'active',
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    if (subError) throw subError

    const { error: profileError } = await admin
      .from('profiles')
      .update({ is_premium: true, premium_expires_at: expiresAt.toISOString() })
      .eq('id', user.id)
    if (profileError) throw profileError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment verification failed' },
      { status: 500 }
    )
  }
}
