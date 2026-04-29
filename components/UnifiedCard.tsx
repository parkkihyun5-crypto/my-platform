import { ReactNode } from "react";

type UnifiedCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
};

export default function UnifiedCard({
  title,
  description,
  children,
  className = "",
  interactive = true,
}: UnifiedCardProps) {
  const cardClassName = [
    "group relative overflow-hidden rounded-[30px] border bg-white p-6 md:p-8",
    "transition-all duration-500 ease-out",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[30px] before:content-['']",
    "before:bg-[radial-gradient(circle_at_top,rgba(201,169,107,0.10),transparent_46%)] before:opacity-0 before:transition-opacity before:duration-500",
    interactive
      ? [
          "border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)]",
          "hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] hover:before:opacity-100",
          "focus-within:-translate-y-1 focus-within:border-[#0B1F35]/25 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:before:opacity-100",
        ].join(" ")
      : "border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)]",
    className,
  ].join(" ");

  return (
    <div className={cardClassName}>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold leading-[1.2] tracking-[-0.02em] text-[#0B1F35] md:text-3xl">
          {title}
        </h3>

        {description ? (
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}