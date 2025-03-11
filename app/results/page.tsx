"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"
import styles from "./results.module.css"

type PredictionResult = {
  [key: string]: number
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<PredictionResult | null>(null)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      setResults(JSON.parse(decodeURIComponent(data)))
    }
  }, [searchParams])

  if (!results) {
    return <div>Loading...</div>
  }

  const highestProbability = Math.max(...Object.values(results))
  const mostLikelyCondition = Object.keys(results).find((key) => results[key] === highestProbability)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft className={styles.icon} />
          Back to Form
        </Link>
        <h1 className={styles.title}>
          <Activity className={styles.icon} />
          Health Analysis Results
        </h1>
      </header>

      <main className={styles.main}>
        <div className={styles.resultSummary}>
          <h2 className={styles.summaryTitle}>Analysis Summary</h2>
          <p className={styles.summaryText}>Based on the provided health parameters, the most likely condition is:</p>
          <p className={styles.highlightedCondition}>
            {mostLikelyCondition} ({(highestProbability * 100).toFixed(2)}%)
          </p>
        </div>

        <div className={styles.detailedResults}>
          <h3 className={styles.detailedTitle}>Detailed Probabilities</h3>
          <ul className={styles.probabilityList}>
            {Object.entries(results).map(([condition, probability]) => (
              <li key={condition} className={styles.probabilityItem}>
                <span className={styles.conditionName}>{condition}</span>
                <div className={styles.probabilityBar}>
                  <div className={styles.probabilityFill} style={{ width: `${probability * 100}%` }}></div>
                </div>
                <span className={styles.probabilityValue}>{(probability * 100).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.disclaimer}>
          <p>
            This analysis is based on the provided health parameters and should not be considered as a definitive
            medical diagnosis. Please consult with a healthcare professional for proper medical advice and treatment.
          </p>
        </div>
      </main>
    </div>
  )
}

