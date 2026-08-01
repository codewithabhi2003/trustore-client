import { Loader2 } from 'lucide-react';

export default function Loader({ label, fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-text-secondary">
      <Loader2 className="w-7 h-7 animate-spin text-accent" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>;
  }
  return content;
}
