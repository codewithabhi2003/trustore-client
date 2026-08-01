export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-accent" />
        </div>
      )}
      <h3 className="text-lg font-heading font-bold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
