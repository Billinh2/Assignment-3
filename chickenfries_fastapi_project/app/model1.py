import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# AI Model 
class WeatherPredictionModel:
    def __init__(self):
        # Initialize the model (Random Forest Regressor)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()

    def train(self):
        # Load dataset (provided weather dataset)
        data = pd.read_csv('./weatherAUSRaw.csv')
        
        # Drop rows with missing values
        data = data.dropna()
        
        # Convert categorical target to numerical (0 for No, 1 for Yes)
        label_encoder = LabelEncoder()
        data['RainTomorrow'] = label_encoder.fit_transform(data['RainTomorrow'])
        
        # Define features and target variable
        X = data[['MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine',
                  'WindGustSpeed', 'WindSpeed9am', 'WindSpeed3pm', 'Humidity9am', 'Humidity3pm',
                  'Pressure9am', 'Pressure3pm', 'Temp9am', 'Temp3pm', 'Cloud9am', 'Cloud3pm']]
        y = data['RainTomorrow']
        
        # Scale features
        X = self.scaler.fit_transform(X)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        self.model.fit(X_train, y_train)

        # Save the model and scaler
        joblib.dump(self.model, 'model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')

        # Evaluation
        predictions = self.model.predict(X_test)
        mse = mean_squared_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)

        print(f"Model trained. MSE: {mse}, R²: {r2}")

    def predict(self, min_temp, max_temp, rainfall, evaporation, sunshine, wind_gust_speed,
                wind_speed_9am, wind_speed_3pm, humidity_9am, humidity_3pm, pressure_9am,
                pressure_3pm, temp_9am, temp_3pm, cloud_9am, cloud_3pm):
        # Load the model and scaler
        model = joblib.load('model.pkl')
        scaler = joblib.load('scaler.pkl')
        
        # Make a prediction based on input
        input_features = np.array([[
            min_temp, max_temp, rainfall, evaporation, sunshine, wind_gust_speed,
            wind_speed_9am, wind_speed_3pm, humidity_9am, humidity_3pm, pressure_9am,
            pressure_3pm, temp_9am, temp_3pm, cloud_9am, cloud_3pm
        ]])
        input_features = scaler.transform(input_features)
        return model.predict(input_features)[0]

# Example usage (for initial training)
if __name__ == "__main__":
    model = WeatherPredictionModel()
    model.train()
