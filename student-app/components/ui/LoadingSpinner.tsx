import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ className, size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-indigo-200 border-t-indigo-600 animate-spin',
          sizeClasses[size]
        )}
        style={{ borderWidth: size === 'sm' ? 2 : size === 'md' ? 3 : 4 }}
      />
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  )
}
