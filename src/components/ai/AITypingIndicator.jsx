export default function AITypingIndicator({ label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
      </span>
      {label}
    </div>
  );
}
