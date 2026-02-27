import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function deslugify(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatScore(score: number, total: number): string {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  return `${score}/${total} (${percentage}%)`
}

export function getScoreColor(score: number, total: number): string {
  const percentage = total > 0 ? (score / total) * 100 : 0
  if (percentage >= 70) return 'text-emerald-600'
  if (percentage >= 40) return 'text-amber-600'
  return 'text-red-600'
}

export function getScoreBg(score: number, total: number): string {
  const percentage = total > 0 ? (score / total) * 100 : 0
  if (percentage >= 70) return 'bg-emerald-50 border-emerald-200'
  if (percentage >= 40) return 'bg-amber-50 border-amber-200'
  return 'bg-red-50 border-red-200'
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
