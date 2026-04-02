import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
}

const variants = {
  default: 'bg-ink-100 text-ink-700',
  gold: 'bg-gold-light text-ink-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ children, variant = 'default' }: Props) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {children}
    </span>
  );
}
