"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

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

export default function HealthForm() {
  const [values, setValues] = useState<HealthParameters>({})
  const [result, setResult] = useState<{ prediction: number; probability: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Check if all parameters are filled
    const allParameters = parameterGroups.flatMap((group) => group.parameters)
    const missingParameters = allParameters.filter((param) => !values[param.id])

    if (missingParameters.length > 0) {
      setError(`Please fill in all parameters. Missing: ${missingParameters.map((p) => p.label).join(", ")}`)
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
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {parameterGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="font-semibold text-lg">{group.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.parameters.map((param) => (
              <div key={param.id} className="space-y-2">
                <Label htmlFor={param.id}>
                  {param.label} ({param.unit})
                </Label>
                <Input
                  id={param.id}
                  type="number"
                  step="any"
                  value={values[param.id] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [param.id]: Number.parseFloat(e.target.value),
                    }))
                  }
                  className="bg-black/30"
                  placeholder={`Enter ${param.label}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert className={result.prediction === 1 ? "border-destructive" : "border-green-500"}>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Analysis Complete</AlertTitle>
          <AlertDescription>
            {result.prediction === 1
              ? `Disease detected with ${(result.probability * 100).toFixed(2)}% confidence. Please consult a healthcare professional.`
              : `No disease detected. Probability: ${((1 - result.probability) * 100).toFixed(2)}%`}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        Analyze Health Parameters
      </Button>
    </form>
  )
}

