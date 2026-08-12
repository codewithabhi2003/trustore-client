import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md rounded-full',

  secondary:
    'border-2 border-accent text-text-primary bg-transparent hover:bg-accent-soft hover:scale-[1.02] active:scale-[0.98] rounded-full',

  onDark:
    'border-2 border-white/80 text-white bg-white/5 hover:bg-white/15 hover:border-white hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm rounded-full',

  ghost:
    'bg-transparent text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg',

  danger:
    'bg-accent-red text-white hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-sm rounded-full',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold font-body transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}