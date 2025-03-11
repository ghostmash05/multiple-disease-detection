import { Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import BackgroundShapes from "@/components/background-shapes"
import HealthFormSimple from "@/components/health-form-simple"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <BackgroundShapes />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <Activity className={styles.icon} />
          <h1 className={styles.title}>AI Disease Detection System</h1>
        </div>
        <p className={styles.subtitle}>
          Advanced AI-powered system for early detection of diseases using machine learning
        </p>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* How It Works */}
        <div className={styles.cardGrid}>
          <Card title="Input Data" number={1} description="Enter your medical parameters and test results" />
          <Card
            title="AI Analysis"
            number={2}
            description="Our XGBoost model analyzes your data against trained patterns"
          />
          <Card title="Get Results" number={3} description="Receive detailed risk assessment and recommendations" />
        </div>

        {/* Health Form */}
        <Card className={styles.formCard}>
          <h2 className={styles.formTitle}>Health Parameters</h2>
          <p className={styles.formDescription}>
            Please enter your medical test results accurately for the best analysis
          </p>
          <HealthFormSimple />
        </Card>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <h2 className={styles.footerTitle}>Advanced Machine Learning</h2>
        <p>
          Our system uses XGBoost, a powerful machine learning algorithm trained on thousands of medical records to
          provide accurate disease predictions.
        </p>
      </footer>
    </div>
  )
}

