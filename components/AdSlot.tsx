type AdSlotProps = {
  variant: 'banner' | 'sidebar' | 'in-content';
  className?: string;
};

const sizeClasses = {
  banner: 'h-[90px]',
  sidebar: 'h-[250px]',
  'in-content': 'h-[250px] md:h-[280px]',
};

export function AdSlot({ variant, className = '' }: AdSlotProps) {
  return (
    <div className={`my-8 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 text-center">
        Advertisement
      </p>
      <div className={`w-full ${sizeClasses[variant]} bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs font-semibold`}>
        Ad Slot ({variant})
      </div>
    </div>
  );
}