import { conectar } from "../conexion.js";

export async function crearTablaRespuestas() {
  const conexion = await conectar();

  const sql = `
    CREATE TABLE IF NOT EXISTS respuestas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre TEXT NOT NULL,
      puntaje INT NOT NULL,
      materia TEXT NOT NULL,
      sede TEXT NOT NULL,
      jornada TEXT NOT NULL,
      respuestas TEXT NOT NULL
    )
  `;

  try {
    await conexion.execute(sql);
    console.log("✅ Tabla 'respuestas' verificada/creada");
  } catch (err) {
    console.error("❌ Error al crear tabla:", err);
  } finally {
    await conexion.end();
  }
}

export async function insertarRespuesta(nombre, puntaje, materia, sede, jornada, respuestasJSON) {
  const conexion = await conectar();

  const sql = `
    INSERT INTO respuestas (nombre, puntaje, materia, sede, jornada, respuestas)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    await conexion.execute(sql, [nombre, puntaje, materia, sede, jornada, respuestasJSON]);
    console.log("✅ Respuesta insertada correctamente");
  } catch (err) {
    console.error("❌ Error al insertar respuesta:", err);
  } finally {
    await conexion.end();
  }
}

export async function existeRespuesta(nombre, materia, sede) {
  const conexion = await conectar();

  const sql = `
    SELECT id FROM respuestas
    WHERE nombre = ? AND materia = ? AND sede = ?
  `;

  try {
    const [rows] = await conexion.execute(sql, [nombre, materia, sede]);
    return rows.length > 0; // true si ya existe
  } catch (err) {
    console.error("❌ Error al verificar duplicado:", err);
    return false;
  } finally {
    await conexion.end();
  }
}
