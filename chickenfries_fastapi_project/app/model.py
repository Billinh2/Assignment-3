import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from datetime import datetime

# Load the data set from file into data frame
file_path = './weatherAUSRaw.csv'
data = pd.read_csv(file_path)


#sort data columns into categorical and continuous values
#this will allow seperate functions and processing to be performed on each variable type
categorical_col, continuous_col =[],[]

#iterates through columns and appends column name to relevant list
for i in data.columns:
    
    if data[i].dtype == 'object':
        categorical_col.append(i)
    else:
        continuous_col.append(i)


#replace missing continuous values with mean
for i in continuous_col:
    data[i] = data[i].fillna(data[i].mean())


#replace missing categorical values with mode
for i in categorical_col:
    data[i] = data[i].fillna(data[i].mode()[0])

