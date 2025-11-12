const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Verifica y crea la carpeta 'db/' si no existe
const rutaCarpetaDB = path.resolve(__dirname, "db");
if (!fs.existsSync(rutaCarpetaDB)) {
  fs.mkdirSync(rutaCarpetaDB);
}

function conectar() {
  const rutaBD = path.resolve(rutaCarpetaDB, "resultados.db");
  return new sqlite3.Database(rutaBD);
}

module.exports = { conectar };
