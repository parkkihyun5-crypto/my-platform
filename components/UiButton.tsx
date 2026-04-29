import Link from "next/link";

type UiButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
};

function getButtonClass(
  variant: "primary" | "secondary" | "dark" | "ghost"
): string {
  switch (variant) {
    case "primary":
      return "bg-[#C9A96B] !text-[#0B1F35] hover:scale-105 hover:shadow-2xl";
    case "secondary":
      return "border border-slate-300 bg-white !text-slate-700 hover:scale-105";
    case "dark":
      return "bg-[#0B1F35] !text-white hover:scale-105 hover:shadow-2xl";
    case "ghost":
      return "border border-white/20 bg-white/5 !text-white hover:scale-105";
    default:
      return "bg-[#0B1F35] !text-white hover:scale-105 hover:shadow-2xl";
  }
}

export default function UiButton({
  children,
  href,
  onClick,
  variant = "dark",
  className = "",
  type = "button",
}: UiButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-bold transition duration-300 md:px-8 md:py-4 md:text-lg";
  const finalClass = `${baseClass} ${getButtonClass(variant)} ${className}`;

  if (href) {
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link href={href} className={finalClass}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={finalClass}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={finalClass}>
      {children}
    </button>
  );
}