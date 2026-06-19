import sqlite3
import csv
import os
import tkinter as tk
from tkinter import ttk, messagebox

ARCHIVO_CSV = os.path.join(os.path.dirname(__file__), "respuestas.csv")
BASE_DATOS = os.path.join(os.path.dirname(__file__), "resultados_local.db")

# Crear tabla si no existe
def crear_base_datos():
    conexion = sqlite3.connect(BASE_DATOS)
    cursor = conexion.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS respuestas (
            id INTEGER PRIMARY KEY AUTOINCREMENT ,
            nombre TEXT,
            puntaje INTEGER,
            materia TEXT,
            sede TEXT,
            jornada TEXT,
            respuestas TEXT,
            UNIQUE(nombre, materia, sede, jornada)
        )
    ''')
    conexion.commit()
    conexion.close()

# Insertar solo registros nuevos
def importar_csv_a_sqlite():
    conexion = sqlite3.connect(BASE_DATOS)
    cursor = conexion.cursor()
    with open(ARCHIVO_CSV, newline='', encoding='utf-8') as archivo:
        lector = csv.DictReader(archivo)
        for fila in lector:
            cursor.execute('''
                INSERT OR IGNORE INTO respuestas (nombre, puntaje, materia, sede, jornada, respuestas)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                fila['nombre'],
                fila['puntaje'],
                fila['materia'],
                fila['sede'],
                fila['jornada'],
                fila['respuestas'].replace('"', '\\"')
            ))
    conexion.commit()
    conexion.close()

# Mostrar ventana con filtros
def mostrar_datos():
    def aplicar_filtros():
        materia = combo_materia.get()
        sede = combo_sede.get()
        jornada = combo_jornada.get()

        query = "SELECT * FROM respuestas WHERE 1=1"
        params = []

        if materia != "Todos":
            query += " AND materia = ?"
            params.append(materia)
        if sede != "Todos":
            query += " AND sede = ?"
            params.append(sede)
        if jornada != "Todos":
            query += " AND jornada = ?"
            params.append(jornada)

        for item in tabla.get_children():
            tabla.delete(item)

        conexion = sqlite3.connect(BASE_DATOS)
        cursor = conexion.cursor()
        cursor.execute(query, params)
        filas = cursor.fetchall()
        conexion.close()

        for fila in filas:
            tabla.insert('', 'end', values=fila)

    ventana = tk.Tk()
    ventana.title("Resultados del Examen")

    frame_filtros = tk.Frame(ventana)
    frame_filtros.pack(pady=10)

    # Obtener valores únicos
    conexion = sqlite3.connect(BASE_DATOS)
    cursor = conexion.cursor()
    cursor.execute("SELECT DISTINCT materia FROM respuestas")
    materias = ["Todos"] + [fila[0] for fila in cursor.fetchall()]
    cursor.execute("SELECT DISTINCT sede FROM respuestas")
    sedes = ["Todos"] + [fila[0] for fila in cursor.fetchall()]
    cursor.execute("SELECT DISTINCT jornada FROM respuestas")
    jornadas = ["Todos"] + [fila[0] for fila in cursor.fetchall()]
    conexion.close()

    # Combobox de filtros
    combo_materia = ttk.Combobox(frame_filtros, values=materias, state="readonly")
    combo_materia.set("Todos")
    combo_materia.grid(row=0, column=0, padx=5)

    combo_sede = ttk.Combobox(frame_filtros, values=sedes, state="readonly")
    combo_sede.set("Todos")
    combo_sede.grid(row=0, column=1, padx=5)

    combo_jornada = ttk.Combobox(frame_filtros, values=jornadas, state="readonly")
    combo_jornada.set("Todos")
    combo_jornada.grid(row=0, column=2, padx=5)

    btn_filtrar = tk.Button(frame_filtros, text="Aplicar Filtros", command=aplicar_filtros)
    btn_filtrar.grid(row=0, column=3, padx=5)

    # Tabla
    columnas = ['ID', 'Nombre', 'Puntaje', 'Materia', 'Sede', 'Jornada', 'Respuestas']
    tabla = ttk.Treeview(ventana, columns=columnas, show='headings')
    for col in columnas:
        tabla.heading(col, text=col)
        tabla.column(col, width=120)
    tabla.pack(expand=True, fill='both')

    aplicar_filtros()
    ventana.mainloop()

# Flujo principal
if __name__ == "__main__":
    if not os.path.exists(ARCHIVO_CSV):
        messagebox.showerror("Error", f"No se encontró el archivo {ARCHIVO_CSV}")
    else:
        crear_base_datos()
        importar_csv_a_sqlite()
        mostrar_datos()
