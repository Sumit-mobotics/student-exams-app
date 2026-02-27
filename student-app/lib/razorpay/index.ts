import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const PLAN_PRICES: Record<string, number> = {
  monthly: 9900,     // ₹99 in paise
  half_yearly: 49900, // ₹499 in paise
  annual: 79900,      // ₹799 in paise
}

export const PLAN_DURATIONS: Record<string, number> = {
  monthly: 30,
  half_yearly: 180,
  annual: 365,
}

export async function createOrder(planId: string) {
  const amount = PLAN_PRICES[planId]
  if (!amount) throw new Error('Invalid plan')

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    notes: { planId },
  })

  return order
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}
