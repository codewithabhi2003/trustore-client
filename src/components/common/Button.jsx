import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-dark hover:scale-[1.03] shadow-sm rounded-full',
  secondary:
    'border-2 border-accent text-text-primary bg-transparent hover:bg-accent-soft rounded-full',
  // For use on dark backgrounds (e.g. the hero) — a separate explicit variant rather
  // than a className override, so it can never silently end up as dark-on-dark.
  onDark:
    'border-2 border-white/70 text-white bg-transparent hover:bg-white/10 rounded-full',
  ghost: 'bg-transparent text-text-secondary hover:bg-elevated rounded-lg',
  danger: 'bg-accent-red text-white hover:brightness-110 rounded-full',
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
      className={`inline-flex items-center justify-center gap-2 font-semibold font-body transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}