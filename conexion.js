const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function conectar() {
  const rutaBD = path.resolve(__dirname, "db", "respuestas.db");
  return new sqlite3.Database(rutaBD);
}

module.exports = { conectar };
