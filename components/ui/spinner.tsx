import { Loader2Icon } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface SpinnerProps extends React.ComponentProps<'svg'> {
  text?: string
}

function Spinner({ className, text, ...props }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn('w-6 h-6 animate-spin text-black', className)}
        {...props}
      />
      {text && <span className="mt-2 text-gray-500 text-sm capitalize">{text}</span>}
    </div>
  )
}

export { Spinner }
