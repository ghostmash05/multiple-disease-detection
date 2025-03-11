from flask import Flask, request, jsonify
import xgboost as xgb
import numpy as np
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
model = xgb.Booster()
model.load_model("xgb_model.json")

CONDITION_MAP = {
    0: "Anemia",
    1: "Diabetes",
    2: "Healthy",
    3: "Heart Disease",
    4: "Thalassemia",
    5: "Thrombocytopenia"
}

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        feature_names = [
            "Glucose", "Cholesterol", "Hemoglobin", "Platelets", "White Blood Cells",
            "Red Blood Cells", "Hematocrit", "Mean Corpuscular Volume",
            "Mean Corpuscular Hemoglobin", "Mean Corpuscular Hemoglobin Concentration",
            "Insulin", "BMI", "Systolic Blood Pressure", "Diastolic Blood Pressure",
            "Triglycerides", "HbA1c", "LDL Cholesterol", "HDL Cholesterol",
            "ALT", "AST", "Heart Rate", "Creatinine", "Troponin", "C-reactive Protein"
        ]

        features = [float(data.get(feature, 0)) for feature in feature_names]
        app.logger.debug(f"Features: {features}")

        dmatrix = xgb.DMatrix([features], feature_names=feature_names)
        
        prediction = model.predict(dmatrix)
        app.logger.debug(f"Raw prediction: {prediction}")
        app.logger.debug(f"Prediction shape: {prediction.shape}")


        probabilities = prediction[0].tolist()
        results = {CONDITION_MAP[i]: float(prob) for i, prob in enumerate(probabilities)}
        
        app.logger.debug(f"Processed results: {results}")

        return jsonify(results)
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

