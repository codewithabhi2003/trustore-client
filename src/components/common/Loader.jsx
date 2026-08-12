import { Loader2 } from 'lucide-react';

export default function Loader({ label, fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-text-secondary">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow animate-pulse">
          <span className="text-white text-lg">🛒</span>
        </div>

        <span className="text-xl font-heading font-extrabold text-text-primary tracking-tight">
          Trustore
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />

        {label && (
          <p className="text-sm font-medium text-text-secondary">
            {label}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-base">
        {content}
      </div>
    );
  }

  return content;
}