type SectionTitleProps = {
  badge?: string;
  title: string;
  desc?: string;
  center?: boolean;
};

export default function SectionTitle({
  badge,
  title,
  desc,
  center = false,
}: SectionTitleProps) {
  return (
    <div className={center ? "text-center" : "text-left"}>
      {badge ? (
        <div
          className={`inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B] md:text-base ${
            center ? "justify-center" : "justify-start"
          }`}
        >
          <span className="h-px w-8 bg-[#C9A96B]/60" />
          <span>{badge}</span>
          <span className="h-px w-8 bg-[#C9A96B]/60" />
        </div>
      ) : null}

      <h2 className="mt-5 text-3xl font-bold leading-[1.14] tracking-[-0.03em] text-[#0B1F35] md:text-5xl">
        {title}
      </h2>

      {desc ? (
        <p
          className={`mt-6 text-sm leading-7 text-slate-600 md:text-lg md:leading-8 ${
            center ? "mx-auto max-w-3xl" : "max-w-3xl"
          }`}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
}