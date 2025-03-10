"use client"

import type React from "react"
import { useState } from "react"
import styles from "./health-form-simple.module.css"

type HealthParameters = {
  [key: string]: number
}

const parameterGroups = [
  {
    title: "Blood Tests",
    parameters: [
      { id: "glucose", label: "Glucose", unit: "mg/dL" },
      { id: "cholesterol", label: "Cholesterol", unit: "mg/dL" },
      { id: "hemoglobin", label: "Hemoglobin", unit: "g/dL" },
      { id: "platelets", label: "Platelets", unit: "K/µL" },
      { id: "wbc", label: "White Blood Cells", unit: "K/µL" },
      { id: "rbc", label: "Red Blood Cells", unit: "M/µL" },
      { id: "hematocrit", label: "Hematocrit", unit: "%" },
      { id: "mcv", label: "Mean Corpuscular Volume", unit: "fL" },
      { id: "mch", label: "Mean Corpuscular Hemoglobin", unit: "pg" },
      { id: "mchc", label: "Mean Corpuscular Hemoglobin Concentration", unit: "g/dL" },
    ],
  },
  {
    title: "Metabolic Parameters",
    parameters: [
      { id: "insulin", label: "Insulin", unit: "µU/mL" },
      { id: "bmi", label: "BMI", unit: "kg/m²" },
      { id: "systolic", label: "Systolic Blood Pressure", unit: "mmHg" },
      { id: "diastolic", label: "Diastolic Blood Pressure", unit: "mmHg" },
      { id: "triglycerides", label: "Triglycerides", unit: "mg/dL" },
      { id: "hba1c", label: "HbA1c", unit: "%" },
    ],
  },
  {
    title: "Lipids & Enzymes",
    parameters: [
      { id: "ldl", label: "LDL Cholesterol", unit: "mg/dL" },
      { id: "hdl", label: "HDL Cholesterol", unit: "mg/dL" },
      { id: "alt", label: "ALT", unit: "U/L" },
      { id: "ast", label: "AST", unit: "U/L" },
    ],
  },
  {
    title: "Other Parameters",
    parameters: [
      { id: "heartRate", label: "Heart Rate", unit: "bpm" },
      { id: "creatinine", label: "Creatinine", unit: "mg/dL" },
      { id: "troponin", label: "Troponin", unit: "ng/mL" },
      { id: "crp", label: "C-reactive Protein", unit: "mg/L" },
    ],
  },
]

export default function HealthFormSimple() {
  const [values, setValues] = useState<HealthParameters>({})
  const [result, setResult] = useState<{ prediction: number; probability: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Check if all parameters are filled
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
        throw new Error("Prediction failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("An error occurred while processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {parameterGroups.map((group) => (
        <div key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.parameterGrid}>
            {group.parameters.map((param) => (
              <div key={param.id} className={styles.parameter}>
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
          <div className={styles.errorTitle}>Error</div>
          <div className={styles.errorMessage}>{error}</div>
        </div>
      )}

      {result && (
        <div className={result.prediction === 1 ? styles.resultError : styles.resultSuccess}>
          <div className={styles.resultTitle}>Analysis Complete</div>
          <div className={styles.resultMessage}>
            {result.prediction === 1
              ? `Disease detected with ${(result.probability * 100).toFixed(2)}% confidence. Please consult a healthcare professional.`
              : `No disease detected. Probability: ${((1 - result.probability) * 100).toFixed(2)}%`}
          </div>
        </div>
      )}

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze Health Parameters"}
      </button>
    </form>
  )
}

