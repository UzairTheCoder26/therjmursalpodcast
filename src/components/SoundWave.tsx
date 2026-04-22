interface Props {
  count?: number;
  className?: string;
}

export function SoundWave({ count = 60, className = "" }: Props) {
  return (
    <div
      className={`flex items-center justify-center gap-[3px] h-full w-full ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full bg-gradient-to-t from-neon-red via-gold to-gold-glow"
          style={{
            height: `${20 + ((i * 37) % 80)}%`,
            animationDelay: `${(i * 80) % 1200}ms`,
            animationDuration: `${900 + ((i * 53) % 700)}ms`,
          }}
        />
      ))}
    </div>
  );
}
