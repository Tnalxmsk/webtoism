import { forwardRef, type ButtonHTMLAttributes } from "react"
import styles from "../../styles/button.module.css"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = styles[variant] || styles.default
    const sizeClass = size !== "default" ? styles[size] : ""

    return (
      <button className={`${styles.button} ${variantClass} ${sizeClass} ${className || ""}`} ref={ref} {...props} />
    )
  },
)

Button.displayName = "Button"
