import styles from "./background-shapes.module.css"

export default function BackgroundShapes() {
  return (
    <div className={styles.container}>
      <div className={`${styles.shape} ${styles.shape1}`} />
      <div className={`${styles.shape} ${styles.shape2}`} />
      <div className={`${styles.shape} ${styles.shape3}`} />
    </div>
  )
}

