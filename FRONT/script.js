var ctx = document.getElementById('myChartindex').getContext('2d');
var myChart;

const uri = 'https://localhost:7242/';
const uriFECHA='https://localhost:7242/api/2024/'
const uriPred='http://localhost:8000/api/flower'
function downloadDocument() {
    // Crear un elemento <a> temporal
    var downloadLink = document.createElement('a');
    console.log(downloadLink);
    // Establecer el atributo href del enlace para apuntar al archivo que deseas descargar
    downloadLink.href = 'predicciones_2024.csv'; // Reemplaza con la ruta de tu documento

    // Establecer el atributo download para especificar el nombre del archivo descargado
    downloadLink.download = 'predicciones.csv'; // Reemplaza con el nombre deseado para el archivo descargado

    // Ocultar el enlace
    downloadLink.style.display = 'none';

    // Añadir el enlace al cuerpo del documento
    document.body.appendChild(downloadLink);

    // Simular un clic en el enlace para iniciar la descarga
    downloadLink.click();

    // Limpiar después de la descarga
    document.body.removeChild(downloadLink);
}

function uploadDocument() {
    // Seleccionar el archivo CSV desde el input de tipo file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    // Escuchar el evento de cambio en el input de archivo
    fileInput.addEventListener('change', async function() {
        const file = fileInput.files[0];
        
        // Crear un objeto FormData para enviar el archivo al backend
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Realizar la solicitud POST al endpoint de carga de archivos en el backend
            const response = await fetch(uri+'api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Manejar la respuesta del servidor

            } else {
                console.error('Error al cargar el archivo:', response.statusText);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error al cargar el archivo!',
                  })
            }
        } catch (error) {
            Swal.fire({
                icon: 'Success',
                text: 'Exito al cargar el archivo!',
              })
            
        }
    });

    // Disparar el evento de clic en el input de archivo
    fileInput.click();
}

function predecir() {
    Swal.fire({title: 'Realizando predicciones...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    didOpen:()=>{
        Swal.showLoading()
    }
    });
    fetch(uriPred).then(response => response.json()).then(data => {
        Swal.close();
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Predicciones realizadas con éxito!',
          })
          location.reload();
    }).catch(error => {
        console.error('Error al realizar las predicciones:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al realizar las predicciones!',
          })
    });
}

// Función para obtener los datos de la API
async function getDataFromAPI(columnName) {
    try {
        const response = await fetch(uri + columnName);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
    }
}
async function getDAteFromAPI(columnName) {
    try {
        const response = await fetch(uriFECHA + columnName);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
    }
}


// Función para generar el gráfico
async function generateChart() {
   
    var columnName = document.getElementById('columnName').value.trim();
    if (columnName === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes ingresar un nombre de variable de flor!',
          })
        return;
    }
    columnName = columnName.toUpperCase();
    try {
        // Obtener los datos de la API
        const data = await getDataFromAPI(columnName);
        const fecha = await getDAteFromAPI(columnName);
        if (data.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se encontraron datos para la variable especificada!',
              })
            return;
        }
        // Configurar el objeto del gráfico
        var chartConfig = {
            type: 'line',
            data: {
                labels: fecha,
                datasets: [{
                    label: 'Predicción ventas 2024 ' + columnName,
                    data: data, // Utilizar los datos obtenidos de la API
                    backgroundColor: 'rgba(89, 60, 143, 0.5)',
                    borderColor: 'rgba(89, 60, 143, 1)',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
        if (myChart) {
            myChart.destroy();
        }

        // Crear un nuevo gráfico con el contexto especificado y la configuración
        myChart = new Chart(ctx, chartConfig);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'VARIEDAD NO ENCONTRADA!',
          })
        console.error('Error al generar el gráfico:', error);
    }
}
async function generateChart1() {
    columnName ='MONDIAL';
    try {
        // Obtener los datos de la API
        const data = await getDataFromAPI(columnName);
        const fecha = await getDAteFromAPI(columnName);
        // Configurar el objeto del gráfico
        console.log(data);
        var chartConfig = {
            type: 'line',
            data: {
                labels: fecha,
                datasets: [{
                    label: 'Predicción ventas 2024 ' + columnName,
                    data: data, // Utilizar los datos obtenidos de la API
                    backgroundColor: 'rgba(89, 60, 143, 0.5)',
                    borderColor: 'rgba(89, 60, 143, 1)',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
        if (myChart) {
            myChart.destroy();
        }

        // Crear un nuevo gráfico con el contexto especificado y la configuración
        myChart = new Chart(ctx, chartConfig);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'VARIEDAD NO ENCONTRADA!',
          })
        console.error('Error al generar el gráfico:', error);
    }
}
generateChart1();
Chart.defaults.animation = {
    duration: 1000, // Duración de la animación en milisegundos
    easing: 'easeInOutQuart', // Función de interpolación para la animación
    onProgress: null, // Función que se llama en cada cuadro de la animación
    onComplete: null // Función que se llama al finalizar la animación
};
