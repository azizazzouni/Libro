export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
  return (
    <div className={`${sz} animate-spin rounded-full border-2 border-ink-200 border-t-ink-700`} />
  );
}
