import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from datetime import datetime,timedelta
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from keras.utils import custom_object_scope
from keras.backend import sqrt, mean, square
import keras.backend as K
from keras.models import load_model
from keras.preprocessing.sequence import TimeseriesGenerator
from fastapi import FastAPI, HTTPException, Query
# Define the custom loss function
def root_mean_squared_error(y_true, y_pred):
    return sqrt(mean(square(y_pred - y_true), axis=-1))

with custom_object_scope({'root_mean_squared_error': root_mean_squared_error}):
    model = load_model('modelo_2023in.h5')


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class flower(BaseModel):
    fecha: str
    variedad: str
    ventas: float
cabeceras = {
    "Content-Type": "application/json"
}
@app.get("/api/flower")
async def get_data():
    try:
        
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.get('https://localhost:7242/api/load') #Cambiar dirección, si es necesario
            
            if response.status_code == 200:
                await client.delete('https://localhost:7242/api/2024/delete') #Cambiar dirección, si es necesario
                data = response.json()
                data = pd.DataFrame(data)
                
                #data = data.loc[fechaInicio:fechaFin]# Filtrar por fechas
                data = data.drop(columns=['id'])
                data = data.set_index(data['fecha'])
                data['fecha'] = pd.to_datetime(data['fecha'], format='%Y-%m-%d')
                data['mes'] = data['fecha'].dt.to_period('M')
                data = data.drop(columns=['fecha'])
                data_grouped = data.groupby(['mes','variedad']).sum().reset_index()
                fecha_max=data['mes'].max()
                fecha_max=datetime.strptime(str(fecha_max), '%Y-%m')
                fecha_min=fecha_max-timedelta(days=3*365)
                fecha_min=fecha_min+timedelta(days=31)
                data_venta = data_grouped.pivot(index='mes',columns='variedad',values='ventas').fillna(0)
                data_produccion = data_grouped.pivot(index='mes',columns='variedad',values='produccion').fillna(0)

                exogena_train=data_produccion[fecha_min.strftime('%Y-%m'):fecha_max.strftime('%Y-%m')]
                endogena_train=data_venta[fecha_min.strftime('%Y-%m'):fecha_max.strftime('%Y-%m')]

                predicciones=[]
                fecha_inicio=fecha_max+timedelta(days=31)
                it=0
                for variedad in data_venta.columns:

                    endogena=endogena_train[variedad]
                    exogena=exogena_train[variedad]
                    serie=TimeseriesGenerator(np.column_stack((exogena,endogena)),endogena,length=1,batch_size=1)
                    model.fit_generator(serie,epochs=100,verbose=0)
                    pred=model.predict(serie,steps=6)
                    pred_lista = pred.flatten().tolist()
                    it=it+1
                    print('Variedad posicion: ',it)
                    fecha_prediccion = pd.date_range(start=fecha_inicio.strftime('%Y-%m'), periods=6, freq='M')

                    for i in range(6):
                        # Formatea la fecha al formato de año y mes
                        
                        fecha_formateada = fecha_prediccion[i].strftime('%Y-%m')
                        prediccion = {"fecha": fecha_formateada, "variedad": variedad, "ventas": pred_lista[i]}
                        predicciones.append(prediccion)
                        await send_data(prediccion)
                return predicciones
            else:
                return {"error": "No se pudo obtener los datos"}
    except Exception as e:
        return {"error": str(e)}

async def send_data(datos: dict):
    try:
        async with httpx.AsyncClient(verify=False) as client:
            flower_data=flower(**datos)
            respose=await client.post('https://localhost:7242/api/pred', json=flower_data.dict(), headers=cabeceras) #Cambiar dirección, si es necesario
            respose.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)