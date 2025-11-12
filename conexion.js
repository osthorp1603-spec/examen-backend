import mysql from "mysql2/promise";

export const conectar = async () => {
  const conexion = await mysql.createConnection({
    host: "localhost",
    user: "oscar",
    password: "Bouncing", // ⬅️ tu nueva contraseña aquí
    database: "examenes",
  });
  console.log("✅ Conexión MySQL establecida correctamente");
  return conexion;
};
