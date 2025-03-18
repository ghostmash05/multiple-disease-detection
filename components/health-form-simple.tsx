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

const demoDataNormalized = [
  0.739596713,	0.650198388,	0.713630986,	0.868491241,	0.687433028,	0.529895399,	0.290005909,	0.631045018,	0.001327858,	0.79582887,	0.034129122,	
  0.071774199,	0.185595597,	0.07145461,	0.653472376,	0.502664779,	0.215560238,	0.512940563,	0.064187347,	0.61082651,	0.939484854,	0.095511528,	0.465956967,	0.769230075,
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

  const loadDemoData = () => {
    const allParameters = parameterGroups.flatMap((group) => group.parameters)
    const demoValues: HealthParameters = {}

    allParameters.forEach((param, index) => {
      if (index < demoDataNormalized.length) {
        let scaledValue
        switch (param.id) {
          case "Glucose":
            scaledValue = demoDataNormalized[index] 
            break
          case "Cholesterol":
            scaledValue = demoDataNormalized[index]
            break
          case "Hemoglobin":
            scaledValue = demoDataNormalized[index] 
            break
          case "Platelets":
            scaledValue = demoDataNormalized[index] 
            break
          case "White Blood Cells":
            scaledValue = demoDataNormalized[index] 
            break
          case "Red Blood Cells":
            scaledValue = demoDataNormalized[index] 
            break
          case "Hematocrit":
            scaledValue = demoDataNormalized[index] 
            break
          case "Mean Corpuscular Volume":
            scaledValue = demoDataNormalized[index] 
            break
          case "Mean Corpuscular Hemoglobin":
            scaledValue = demoDataNormalized[index] 
            break
          case "Mean Corpuscular Hemoglobin Concentration":
            scaledValue = demoDataNormalized[index]
            break
          case "Insulin":
            scaledValue = demoDataNormalized[index] 
            break
          case "BMI":
            scaledValue = demoDataNormalized[index] 
            break
          case "Systolic Blood Pressure":
            scaledValue = demoDataNormalized[index] 
            break
          case "Diastolic Blood Pressure":
            scaledValue = demoDataNormalized[index] 
            break
          case "Triglycerides":
            scaledValue = demoDataNormalized[index] 
            break
          case "HbA1c":
            scaledValue = demoDataNormalized[index] 
            break
          case "LDL Cholesterol":
            scaledValue = demoDataNormalized[index] 
            break
          case "HDL Cholesterol":
            scaledValue = demoDataNormalized[index] 
            break
          case "ALT":
            scaledValue = demoDataNormalized[index] 
            break
          case "AST":
            scaledValue = demoDataNormalized[index] 
            break
          case "Heart Rate":
            scaledValue = demoDataNormalized[index] 
            break
          case "Creatinine":
            scaledValue = demoDataNormalized[index] 
            break
          case "Troponin":
            scaledValue = demoDataNormalized[index] 
            break
          case "C-reactive Protein":
            scaledValue = demoDataNormalized[index]
            break
          default:
            scaledValue = demoDataNormalized[index] 
        }
        demoValues[param.id] = scaledValue;
      }
    })

    setValues(demoValues)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Health Parameters</h2>
        <button type="button" onClick={loadDemoData} className={styles.demoButton}>
          Load Demo Data
        </button>
      </div>
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

