const { conectar } = require("../conexion");

function crearTablaRespuestas() {
  const db = conectar();
  db.run(
    `CREATE TABLE IF NOT EXISTS respuestas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      puntaje INTEGER NOT NULL,
      materia TEXT NOT NULL,
      respuestas TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("❌ Error al crear tabla:", err);
      } else {
        console.log("✅ Tabla 'respuestas' verificada/creada");
      }
      db.close();
    }
  );
}

function insertarRespuesta(nombre, puntaje, materia, respuestasJSON) {
  return new Promise((resolve, reject) => {
    const db = conectar();
    db.run(
      `INSERT INTO respuestas (nombre, puntaje, materia, respuestas)
       VALUES (?, ?, ?, ?)`,
      [nombre, puntaje, materia, respuestasJSON],
      function (err) {
        if (err) {
          console.error("❌ Error al insertar respuesta:", err);
          reject(err);
        } else {
          console.log("✅ Respuesta insertada correctamente");
          resolve();
        }
        db.close();
      }
    );
  });
}

function existeRespuesta(nombre, materia) {
  return new Promise((resolve, reject) => {
    const db = conectar();
    db.get(
      `SELECT id FROM respuestas WHERE nombre = ? AND materia = ?`,
      [nombre, materia],
      (err, row) => {
        db.close();
        if (err) {
          console.error("❌ Error al verificar duplicado:", err);
          reject(err);
        } else {
          resolve(!!row); // true si ya existe
        }
      }
    );
  });
}

module.exports = {
  crearTablaRespuestas,
  insertarRespuesta,
  existeRespuesta,
};
