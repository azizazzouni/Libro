import { BookOpen } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-parchment rounded-full flex items-center justify-center mb-4 text-ink-400">
        {icon || <BookOpen size={28} />}
      </div>
      <h3 className="font-display text-xl text-ink-800 mb-2">{title}</h3>
      {description && <p className="text-ink-500 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
