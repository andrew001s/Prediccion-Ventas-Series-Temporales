# Predicción Ventas Series Temporales
 Proyecto de predicción de ventas de una floricola para el 2024 haciendo uso de datos historicos, Modelo desarrollado en Python con Redes Neuronales LSTM para el entendimiento de la serie temporal, FastAPI para realizar las predicciones y .NET para realizar transacciones con Mongo mediante API
 </br>
 <hr />

 # Requerimientos
 
 ![Static Badge](https://img.shields.io/badge/Python-3.11.7-version)
![Static Badge](https://img.shields.io/badge/pip-numpy%2C%20matplotlib%2C%20fastapi%2C%20httpx-8A2BE2)
![Static Badge](https://img.shields.io/badge/Tensoflow%2FKeras-2.15.0-orange)
![Static Badge](https://img.shields.io/badge/uvicorn-blue)


<hr />

 # Imágenes

 <img src="https://imgur.com/WnTjb3e.png" />
 <img src="https://imgur.com/tEi48cY.png" />

 ## SELECCIÓN DE LOS DATOS 

Se seleccionaron dos conjuntos de datos que provienen de una florícola nacional. El primer conjunto de datos contiene información sobre la producción de flores, clasificada por variedad con un total de 100 variedades de tipos de flores, fecha y cantidad de producción. El segundo conjunto de datos contiene información sobre las ventas de flores, también clasificada por variedad, fecha y cantidad, tomando a la variable ventas como variable objetivo para realizar las predicciones. Ambos conjuntos de datos abarcan el periodo desde el año 2019 hasta el año 2023, lo que permite observar la evolución temporal de la producción y las ventas de flores. Con estos datos, se pretende realizar un análisis exploratorio y descriptivo, visualización para identificar patrones y tendencias. 

## ESTRUCTURACIÓN DE LOS DATOS 

Una vez limpios, los datos se organizaron en un archivo .csv, donde se representaban registros individuales de producción y ventas de flores. Las columnas incluían variables como la fecha, y la variedad. Este archivo .csv (Model/flordata.csv) permitió un análisis más fácil y rápido de los datos. 

## FORMATEO DE LOS DATOS 
Finalmente, los datos se formatearon para cumplir con los requisitos de análisis, incluyendo la conversión de las fechas en un formato estándar para el análisis, como YYYY-MM-DD, para facilitar el análisis temporal y evitar posibles errores debido al formato de fechas. Además, para este análisis es importante el nivel de granularidad mensual, implicando una suma de las ventas y producción mensuales para facilitar el análisis de tendencia. Este paso es crucial para poder comparar los datos de diferentes períodos y detectar patrones o anomalías en el comportamiento de las variables. Asimismo, se realizó una limpieza de los datos para eliminar valores faltantes o erróneos que pudieran afectar la calidad del análisis. Por último, se verificó la consistencia y coherencia de los datos, asegurando que no hubiera contradicciones o inconsistencias entre las diferentes fuentes de información.

# FASE MODELADO

## REDES NEURONALES RECURRENTES 
Las redes neuronales recurrentes son una familia de redes neuronales especializadas en el tratamiento de datos secuenciales. El objetivo principal de este modelo de predicción es entregar información al modelo, y que este tenga en cuenta datos históricos desde un pasado lejano a un presente de forma eficiente. Usando el modelo LSTM o Long Short Term Memory networks cual combina la información entrante con datos anteriores, usando 3 puertas. La puerta de entrada que controla la nueva información, la puerta de salida que controla cuánta información se utiliza y la parte que deseche información innecesaria conocida como puerta de olvido. Dada la naturaleza de los datos de ventas tienen tendencias estacionales, siendo las redes LSTM una alternativa a probar para el desarrollo de las predicciones. 

Para empezar a trabajar con redes neuronales recurrentes LSTM hay que tener datos periodicidad, por lo que se requiere estructurar los datos en un agrupamiento mensual, separados por variedades y obtener fechas únicas como índices, obteniendo 2 conjuntos de datos, uno con las ventas y otro con la producción. 

Se decidió dividir el conjunto de datos por periodos, el periodo del 2019 al 2022 para entrenamiento y el periodo correspondiente al 2023 para pruebas tanto en ventas y producción. 

Se utilizo como hiperparámetros unidades LSTM con activación relu, con forma de entrada (1,2) junto una capa Dropout para desactivar el entrenamiento de forma aleatoria y así evitar el sobre ajuste, además de 2 capas ocultas para mejorar el aprendizaje del modelo ambas con activación relu y por último una capa de salida de activación lineal para obtener una salida continua.  

Se estableció como métrica de evaluación principal el error cuadrático medio (MSE), junto al optimizador Adam para tratar el entrenamiento de manera eficiente. 

# Evaluacion del Modelo
Se seleccionaron a raíz del error cuadrático medio (RMSE), error absoluto medio (MAE) y al error porcentual medio como medidas de evaluación del modelo. 
Estas medidas nos permiten comparar las predicciones del modelo con los valores reales, lo que proporciona una medida de cuán cerca están las predicciones del valor real.  
Después de entrenar y probar el modelo LSTM para predecir la demanda de flores, se obtuvieron los siguientes resultados: 
MAE: En promedio, las predicciones del modelo están desviadas de los valores reales por alrededor de 1823 unidades. 
RMSE: En promedio, las predicciones del modelo se desvían del modelo por 2346 unidades de los valores reales. 
MAPE: Las predicciones del modelo tiene un error del 13% en relación con los valores reales. 

Los resultados obtenidos indican que el modelo es capaz de capturar las relaciones temporales en los datos y hacer predicciones precisas en las ventas futuras de las flores, siendo el modelo LSTM una opción adecuada para la predicción del problema planteado.  

<img src="https://imgur.com/uV8riWc.png" />
