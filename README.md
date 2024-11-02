# Weather Analysis Prediction System

This project is a weather prediction system that uses machine learning models to forecast delays based on weather data. It is built with a FastAPI backend and React frontend for data input, processing, and display.

## Project Structure

### 1. Backend

- The `backend` folder is further divided into two main subfolders: `model` and `main`.

  - The **model** folder contains the backend logic for the web application, including the request processing files and three pre-trained Machine Learning models:
    - `model.pkl`
    - `scaler.pkl`

  - The **chickenfries_weather_app** folder has code for processing the input data received from the frontend input form.

### 2. Frontend

The frontend is developed using React, providing the user interface for data entry, interacting with the backend, and displaying the prediction results.

## Dependencies

### Python

- **FastAPI**: The backend framework.
- **joblib**: For loading and saving machine learning models.
- **pandas**, **numpy**: For data processing and manipulation.
- **scikit-learn**: For machine learning utilities.

## Node.js 
- **@tanstack/react-query@v4**: For server-state management.
- **@uidotdev/usehooks**: For utility hooks.
- **@fortawesome/react-fontawesome**: For icons.

## Installation
### Chickenfries_weather_app(Frontend) 

Ensure that the terminal directory is strictly navigated to the right directory of `./Assignment-3/chickenfries_weather_app` 

Run the following command to install all the required dependencies

```
npm install
```

### Chickenfries_fastapi_project (Backend)

Ensure that the terminal directory is strictly navigated to the right directory of `./Assignment-3/chickenfries_fastapi_project/app` 

Run the following command to install all the required dependencies

```
pip install -r requirements.txt
```

## Running

### Chickenfries_weather_app (Frontend)

**Important Note**: Ensure that the terminal directory is strictly navigated to the right directory of `./Assignment-3/chickenfries_weather_app` 

To start the localhost server hosting the website frontend, run the following command

```
npm run dev
```

If successful, the server should be accessible at:

```
http://localhost:5173/
```

This URL will open the React application in your web browser, allowing you to interact with the frontend.


### Backend

To run the FastAPI backend server, follow these steps:

1. Open a new terminal. Make sure to keep this terminal dedicated to the backend so it can run concurrently with the frontend.
2. Navigate to the backend directory. The correct directory path is `./Assignment-3/chickenfries_fastapi_project/app`.
3. Start the backend server using `uvicorn` with the following command:

 ```sh
  uvicorn main:app --reload
