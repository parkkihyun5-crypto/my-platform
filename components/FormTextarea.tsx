type FormTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
};

export default function FormTextarea({
  value,
  onChange,
  placeholder = "",
  rows = 6,
  className = "",
  required = false,
}: FormTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full rounded-[20px] border border-slate-300/90 bg-white px-5 py-4 text-sm leading-7 text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-400/80 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] focus:border-[#0B1F35] focus:shadow-[0_16px_36px_rgba(11,31,53,0.08)] focus:ring-4 focus:ring-[#0B1F35]/8 md:text-base ${className}`}
    />
  );
}
