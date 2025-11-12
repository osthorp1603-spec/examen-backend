const express = require("express");
const cors = require("cors");
const {
  crearTablaRespuestas,
  insertarRespuesta,
  existeRespuesta
} = require("./dao/respuestasDAO");

const { conectar } = require("./conexion");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Crear tabla al iniciar
crearTablaRespuestas();

app.post("/api/respuestas", async (req, res) => {
  try {
    const { nombre, puntaje, materia, respuestas, sede, jornada } = req.body;

    if (!nombre || typeof puntaje !== "number" || !materia || !respuestas || !sede || !jornada) {
      return res.status(400).json({ error: "❌ Datos incompletos o inválidos." });
    }

    const yaExiste = await existeRespuesta(nombre, materia, sede);
    if (yaExiste) {
      return res.status(409).json({ error: "🔒 Ya has respondido este examen con ese nombre y materia." });
    }

    await insertarRespuesta(nombre, puntaje, materia, sede, jornada, JSON.stringify(respuestas));
    res.json({ mensaje: "✅ Respuestas guardadas correctamente." });
  } catch (error) {
    console.error("❌ Error en /api/respuestas:", error.message);
    res.status(500).json({ error: "Error al guardar respuestas." });
  }
});

// ✅ ADAPTADO A MYSQL
app.get("/api/ver-respuestas", async (req, res) => {
  try {
    const conexion = await conectar();
    const [rows] = await conexion.execute("SELECT * FROM respuestas");
    res.json(rows);
    await conexion.end();
  } catch (err) {
    console.error("❌ Error al leer respuestas:", err);
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
