const express = require("express");
const cors = require("cors");
const {
  crearTablaRespuestas,
  insertarRespuesta,
  existeRespuesta
} = require("./dao/respuestasDAO");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Crear tabla al iniciar
crearTablaRespuestas();

app.post("/api/respuestas", async (req, res) => {
  try {
    const { nombre, puntaje, materia, respuestas, sede, jornada} = req.body;

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/api/ver-respuestas", (req, res) => {
  const db = require("./conexion").conectar();
  db.all("SELECT * FROM respuestas", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error al leer la base de datos" });
    } else {
      res.json(rows);
    }
    db.close();
  });
});
