import { Check } from 'lucide-react';

const STEPS = ['Order Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];

export default function OrderTimeline({ status }) {
  if (status === 'Cancelled') {
    return <p className="text-sm text-accent-red font-medium">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  done ? 'bg-accent text-white' : 'bg-input text-text-muted'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[10px] text-center w-16 ${done ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 -mt-4 ${i < currentIndex ? 'bg-accent' : 'bg-input'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
