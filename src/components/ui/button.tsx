import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-5 text-[16px] font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-55";
  const variants = {
    primary:
      "h-14 w-full bg-[#17664f] text-white shadow-[0_10px_24px_rgba(23,102,79,0.18)] hover:bg-[#125842] active:scale-[0.985] focus-visible:outline-[#17664f]",
    ghost:
      "h-12 text-[#17664f] hover:bg-[#17664f]/[0.07] active:bg-[#17664f]/[0.1] focus-visible:outline-[#17664f]",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
