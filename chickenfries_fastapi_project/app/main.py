# main.py (FastAPI Backend Server)
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn
from model1 import WeatherPredictionModel  # Import the model script for training/reusing models
from starlette.responses import JSONResponse
from utils import logger
import os

# Create FastAPI app
app = FastAPI()

# Define file paths for model and scaler
model_path =  "model/model.pkl"    
scaler_path = "model/scaler.pkl"

# Load the pre-trained model and scaler
def load_model():
    try:
        loaded_model = joblib.load(model_path)
        loaded_scaler = joblib.load(scaler_path)
        return loaded_model, loaded_scaler
    except FileNotFoundError:
        return None, None



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origins, adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request and response data models
class PredictionRequest(BaseModel):
    min_temp: float
    max_temp: float
    rainfall: float
    evaporation: float
    sunshine: float
    wind_gust_speed: float
    wind_speed_9am: float
    wind_speed_3pm: float
    humidity_9am: float
    humidity_3pm: float
    pressure_9am: float
    pressure_3pm: float
    temp_9am: float
    temp_3pm: float
    cloud_9am: float
    cloud_3pm: float

class PredictionResponse(BaseModel):
    prediction: float

# Define routes
@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI ML Model Server!"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: PredictionRequest):
    
    loaded_model, loaded_scaler = load_model()
    if loaded_model is None or loaded_scaler is None:
        raise HTTPException(status_code=503, detail="Model not available. Please train the model first.")
    
    # Prepare data for prediction
    input_features = np.array([[
        data.min_temp, data.max_temp, data.rainfall, data.evaporation, data.sunshine,
        data.wind_gust_speed, data.wind_speed_9am, data.wind_speed_3pm,
        data.humidity_9am, data.humidity_3pm, data.pressure_9am, data.pressure_3pm,
        data.temp_9am, data.temp_3pm, data.cloud_9am, data.cloud_3pm
    ]])
    input_features = loaded_scaler.transform(input_features)
    prediction = loaded_model.predict(input_features)[0]
    return PredictionResponse(prediction=prediction)

@app.put("/train")
async def train_model():
    try:
        # Train model using the method in model_training_script
        model_instance = WeatherPredictionModel()
        model_instance.train()
        global loaded_model, loaded_scaler
        loaded_model, loaded_scaler = load_model()
        return {"message": "Model trained successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.delete("/delete-model")
async def delete_model():
    try:
        import os
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            os.remove(model_path)
            os.remove(scaler_path)
            global loaded_model, loaded_scaler
            loaded_model = None
            loaded_scaler = None
            return {"message": "Model deleted successfully."}
        else:
            raise HTTPException(status_code=404, detail="Model file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete model: {str(e)}")

# Error handling example
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": str(exc.detail)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
