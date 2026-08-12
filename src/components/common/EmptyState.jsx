export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-6">
      {Icon && (
        <div className="relative w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-5 shadow-sm">
          <div className="absolute inset-0 rounded-2xl bg-accent/5 animate-pulse" />
          <Icon className="relative w-8 h-8 text-accent" strokeWidth={1.8} />
        </div>
      )}

      <h3 className="text-lg sm:text-xl font-heading font-bold text-text-primary mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-6">
          {description}
        </p>
      )}

      {action && (
        <div className="flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  );
}