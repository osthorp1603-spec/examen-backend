const contenedor = document.getElementById("contenedor");

function obtenerRespuestas() {
  fetch("https://examen-backend-jyf6.onrender.com/api/ver-respuestas")
    .then((res) => res.json())
    .then((datos) => {
      if (!Array.isArray(datos)) {
        contenedor.innerHTML = "<p>No hay respuestas disponibles.</p>";
        return;
      }

      let tabla = `
        <table border="1" cellspacing="0" cellpadding="8">
          <tr>
            <th>Nombre</th>
            <th>Materia</th>
            <th>Sede</th>
            <th>Jornada</th>
            <th>Puntaje</th>
            <th>Respuestas</th>
          </tr>
      `;

      datos.forEach((r) => {
        tabla += `
          <tr>
            <td>${r.nombre}</td>
            <td>${r.materia}</td>
            <td>${r.sede}</td>
            <td>${r.jornada}</td>
            <td>${r.puntaje}</td>
            <td>${r.respuestas}</td>
          </tr>
        `;
      });

      tabla += "</table>";
      contenedor.innerHTML = tabla;
    })
    .catch((error) => {
      contenedor.innerHTML = `<p>Error al obtener respuestas: ${error}</p>`;
    });
}

// Botón de descarga CSV
document.getElementById('descargar').addEventListener('click', () => {
  fetch('https://examen-backend-jyf6.onrender.com/api/ver-respuestas')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error('Respuesta inesperada del servidor:', data);
        return;
      }

      // Convertir a formato CSV
      let csv = 'id,nombre,puntaje,materia,sede,jornada,respuestas\n';
      data.forEach(row => {
        csv += `${row.id},"${row.nombre}",${row.puntaje},"${row.materia}","${row.sede}","${row.jornada}","${row.respuestas}"\n`;
      });

      // Crear archivo descargable
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'respuestas.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('Error al descargar CSV:', error);
    });
});


// 🔁 Cargar las respuestas cada 10 segundos
setInterval(obtenerRespuestas, 10000);
obtenerRespuestas(); // cargar la primera vez

// 🔁 Mantener activo Render cada 1 minuto
setInterval(() => {
  fetch("https://examen-backend-jyf6.onrender.com/api/ver-respuestas")
    .then(() => console.log("⏳ Render activo"))
    .catch(() => console.log("⚠️ No se pudo mantener activo Render"));
}, 60000);
