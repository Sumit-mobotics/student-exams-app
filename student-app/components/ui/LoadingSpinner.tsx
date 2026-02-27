import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ className, size = 'md', message }: LoadingSpinnerProps) {
  const ringSize = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-14 h-14' }[size]
  const borderWidth = { sm: 2, md: 3, lg: 4 }[size]

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative">
        <div
          className={cn('rounded-full border-violet-100 border-t-violet-600 animate-spin', ringSize)}
          style={{ borderWidth }}
        />
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse opacity-60" />
          </div>
        )}
      </div>
      {message && (
        <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}
