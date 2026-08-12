export default function AITypingIndicator({ label = 'Trustore AI is thinking...' }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 text-sm text-text-secondary"
      aria-live="polite"
      aria-label={label}
    >
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
      </span>

      <span>{label}</span>
    </div>
  );
}