import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn("rounded-lg border border-zinc-800 bg-zinc-900/50 p-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("mb-2", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn("text-sm font-medium text-zinc-400", className)}>{children}</h3>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardProps) {
  return <div className={cn("mt-2 text-xs text-zinc-500", className)}>{children}</div>;
}
