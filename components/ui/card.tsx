import type React from "react"
import styles from "./card.module.css"

interface CardProps {
  title?: string
  number?: number
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Card({ title, number, description, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      {(title || number) && (
        <div className={styles.cardHeader}>
          {number && <span className={styles.cardNumber}>{number}</span>}
          {title && <h3 className={styles.cardTitle}>{title}</h3>}
        </div>
      )}
      {description && <p className={styles.cardDescription}>{description}</p>}
      {children}
    </div>
  )
}

