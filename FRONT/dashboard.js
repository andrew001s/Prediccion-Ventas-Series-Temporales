var ctx = document.getElementById('myChart2').getContext('2d');
var myChart;
const uri = 'https://localhost:7242/api/2024';
const uri2 = 'https://localhost:7242/api/2024/all';
const uri3 = 'https://localhost:7242/api/2024/top10';
async function getDataFromAPI() {
    try {
        const response = await fetch(uri);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
    }
}
async function getDataFromAPI2() {
    try {
        const response = await fetch(uri2);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
    }
}
async function getDataFromAPI3() {
    try {
        const response = await fetch(uri3);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
    }
}
function gananciasTotales(){
    getDataFromAPI().then(data => {
        console.log(data);
        var gananciasTotales = document.getElementById('gananciasTotales');
        gananciasTotales.innerHTML = data+" "+"unidades";
    });
    getDataFromAPI2().then(data => {
        console.log(data);
        var nombresVariedades = data.map(function(item) {
            return item.variedad;
          });
          var valoresVariedades = data.map(function(item) {
            return item.valor;
          });
        var variedad = document.getElementById('variedad');
        variedad.innerHTML = nombresVariedades;
        var gananciasTotales = document.getElementById('ventas');
        gananciasTotales.innerHTML = valoresVariedades+" "+"unidades";
    });
   
}
function chart(){
    getDataFromAPI3().then(data => {
        console.log(data);
        var nombresVariedades = data.map(function(item) {
            return item.variedad;
          });
          var valoresVariedades = data.map(function(item) {
            return item.valor;
          });
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nombresVariedades,
                datasets: [{
                    label: 'TOP 10 Variedades más vendidas en 2024',
                    data: valoresVariedades,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 20
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}
function load(){
    swal.fire({
        title: 'Cargando...',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          swal.showLoading()
        }
      }).then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
    chart();
    gananciasTotales();
}
function downloadDocument() {
    swal.fire({
        title: 'Descargando...',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          swal.showLoading()
        }
      }).then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
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
load();