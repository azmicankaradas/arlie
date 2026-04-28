import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants = {
  primary:
    "bg-arlie-charcoal text-arlie-white hover:bg-arlie-charcoal/90 cursor-pointer",
  secondary:
    "border border-arlie-charcoal text-arlie-charcoal hover:bg-arlie-charcoal hover:text-arlie-white cursor-pointer",
  ghost:
    "text-arlie-charcoal/60 hover:text-arlie-charcoal border-b border-arlie-charcoal/20 hover:border-arlie-charcoal cursor-pointer",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-8 py-3 font-sans text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${variants[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
