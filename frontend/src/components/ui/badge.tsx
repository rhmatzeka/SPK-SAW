import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'border border-border text-foreground',
      success: 'bg-primary text-primary-foreground',
      warning: 'bg-secondary text-secondary-foreground',
      danger: 'bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
