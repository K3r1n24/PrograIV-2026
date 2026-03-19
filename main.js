const { createApp } = Vue,
    sha256 = CryptoJS.SHA256,
    uuid = window.uuid;

// Variable global para que tus componentes usen la base de datos
let db_sqlite;

const app = createApp({
    components: {
        alumnos,
        buscar_alumnos,
        materias,
        buscar_materias,
        docentes,
        buscar_docentes
    },
    data() {
        return {
            forms: {
                alumnos: { mostrar: false },
                busqueda_alumnos: { mostrar: false },
                materias: { mostrar: false },
                busqueda_materias: { mostrar: false },
                docentes: { mostrar: false },
                busqueda_docentes: { mostrar: false },
                matriculas: { mostrar: false },
                inscripciones: { mostrar: false }
            }
        }
    },
    methods: {
        buscar(ventana, metodo) {
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana) {
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data) {
            this.$refs[ventana][metodo](data);
        }
    },
    async mounted() {
        try {
            // 1. Inicializamos el módulo de SQLite
            const sqlite3 = await window.sqlite3InitModule();
            const oo = sqlite3.oo1;

            // 2. Creamos/Abrimos la base de datos persistente (OPFS)
            // Esta versión funciona en cualquier navegador de una vez
            db_sqlite = new oo.DB();('/db_academica.db');

            // 3. Creamos las tablas con SQL puro si no existen
            db_sqlite.exec(`
                CREATE TABLE IF NOT EXISTS alumnos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    idAlumno TEXT UNIQUE,
                    codigo TEXT,
                    nombre TEXT,
                    direccion TEXT,
                    email TEXT,
                    telefono TEXT
                );
                CREATE TABLE IF NOT EXISTS materias (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    idMateria TEXT UNIQUE,
                    codigo TEXT,
                    nombre TEXT,
                    uv INTEGER
                );
                CREATE TABLE IF NOT EXISTS docentes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    idDocente TEXT UNIQUE,
                    codigo TEXT,
                    nombre TEXT,
                    direccion TEXT,
                    email TEXT,
                    telefono TEXT,
                    escalafon TEXT
                );
            `);

            console.log("¡SQLite WASM inicializado correctamente!");
        } catch (err) {
            console.error("Error al cargar SQLite:", err.message);
        }
    }
});

app.directive('draggable', vDraggable).mount("#app");