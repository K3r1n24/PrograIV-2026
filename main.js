const { createApp } = Vue;
const db = new Dexie("db_codigo_estudiante");
db.version(1).stores({
    autor: '++idAutor, codigo, nombre, pais, telefono',
    libros: '++idLibro, idAutor, titulo, editorial, edicion'
});

const app = createApp({
    data() {
        return {
            forms: {
                autor: { mostrar: true },
                libros: { mostrar: false }
            }
        }
    },
    methods: {
        abrirVentana(ventana) {
            this.forms.autor.mostrar = false;
            this.forms.libros.mostrar = false;
            this.forms[ventana].mostrar = true;
        }
    }
});

app.component('autor', autor);
app.component('libros', libros);
app.mount('#app');