"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./health-form-simple.module.css"

type HealthParameters = {
  [key: string]: number
}

type PredictionResult = {
  [key: string]: number
}

const parameterGroups = [
  {
    title: "Blood Tests",
    parameters: [
      { id: "Glucose", label: "Glucose", unit: "mg/dL" },
      { id: "Cholesterol", label: "Cholesterol", unit: "mg/dL" },
      { id: "Hemoglobin", label: "Hemoglobin", unit: "g/dL" },
      { id: "Platelets", label: "Platelets", unit: "K/µL" },
      { id: "White Blood Cells", label: "White Blood Cells", unit: "K/µL" },
      { id: "Red Blood Cells", label: "Red Blood Cells", unit: "M/µL" },
      { id: "Hematocrit", label: "Hematocrit", unit: "%" },
      { id: "Mean Corpuscular Volume", label: "Mean Corpuscular Volume", unit: "fL" },
      { id: "Mean Corpuscular Hemoglobin", label: "Mean Corpuscular Hemoglobin", unit: "pg" },
      {
        id: "Mean Corpuscular Hemoglobin Concentration",
        label: "Mean Corpuscular Hemoglobin Concentration",
        unit: "g/dL",
      },
    ],
  },
  {
    title: "Metabolic Parameters",
    parameters: [
      { id: "Insulin", label: "Insulin", unit: "µU/mL" },
      { id: "BMI", label: "BMI", unit: "kg/m²" },
      { id: "Systolic Blood Pressure", label: "Systolic Blood Pressure", unit: "mmHg" },
      { id: "Diastolic Blood Pressure", label: "Diastolic Blood Pressure", unit: "mmHg" },
      { id: "Triglycerides", label: "Triglycerides", unit: "mg/dL" },
      { id: "HbA1c", label: "HbA1c", unit: "%" },
    ],
  },
  {
    title: "Lipids & Enzymes",
    parameters: [
      { id: "LDL Cholesterol", label: "LDL Cholesterol", unit: "mg/dL" },
      { id: "HDL Cholesterol", label: "HDL Cholesterol", unit: "mg/dL" },
      { id: "ALT", label: "ALT", unit: "U/L" },
      { id: "AST", label: "AST", unit: "U/L" },
    ],
  },
  {
    title: "Other Parameters",
    parameters: [
      { id: "Heart Rate", label: "Heart Rate", unit: "bpm" },
      { id: "Creatinine", label: "Creatinine", unit: "mg/dL" },
      { id: "Troponin", label: "Troponin", unit: "ng/mL" },
      { id: "C-reactive Protein", label: "C-reactive Protein", unit: "mg/L" },
    ],
  },
]

export default function HealthFormSimple() {
  const [values, setValues] = useState<HealthParameters>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const allParameters = parameterGroups.flatMap((group) => group.parameters)
    const missingParameters = allParameters.filter((param) => !values[param.id])

    if (missingParameters.length > 0) {
      setError(`Please fill in all parameters. Missing: ${missingParameters.map((p) => p.label).join(", ")}`)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Prediction failed")
      }

      const data = await response.json()
      // Navigate to the results page with the prediction data
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while processing your request. Please try again.",
      )
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>Health Parameters</h2>
      <p className={styles.formDescription}>Please enter your medical test results accurately for the best analysis</p>

      <form onSubmit={handleSubmit}>
        {parameterGroups.map((group) => (
          <div key={group.title} className={styles.section}>
            <h3 className={styles.sectionTitle}>{group.title}</h3>
            <div className={styles.parameterGrid}>
              {group.parameters.map((param) => (
                <div key={param.id} className={styles.parameterItem}>
                  <label htmlFor={param.id} className={styles.label}>
                    {param.label}
                    <span className={styles.unit}>({param.unit})</span>
                  </label>
                  <input
                    id={param.id}
                    type="number"
                    step="any"
                    value={values[param.id] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [param.id]: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={styles.input}
                    placeholder={`Enter ${param.label}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <div className={styles.error}>
            <div className="font-medium">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Health Parameters"}
        </button>
      </form>
    </div>
  )
}

