import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "accent" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const variantClass = variant === "accent" ? styles.accent : variant === "secondary" ? styles.secondary : styles.primary;
  return (
    <button className={[styles.button, variantClass, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </button>
  );
}
