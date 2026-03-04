const libros = {
    data() {
        return {
            libro: { idLibro: 0, idAutor: "", isbn: "", titulo: "", editorial: "", edicion: "" },
            accion: 'nuevo',
            buscar: "",
            libros: [],
            autores: [] 
        }
    },
    methods: {
        async listarTodo() {
            this.autores = await db.autor.toArray();
            this.libros = await db.libros
                .filter(l => 
                    l.titulo.toLowerCase().includes(this.buscar.toLowerCase()) || 
                    l.isbn.toLowerCase().includes(this.buscar.toLowerCase())
                ).toArray();
        },
        async guardarLibro() {
            if (this.accion === 'nuevo') {
                await db.libros.add({ ...this.libro, idLibro: undefined });
            } else {
                await db.libros.update(this.libro.idLibro, { ...this.libro });
            }
            this.limpiar();
            this.listarTodo();
        },
        modificarLibro(datos) { this.accion = 'modificar'; this.libro = { ...datos }; },
        async eliminarLibro(id) { if(confirm("¿Eliminar libro?")) { await db.libros.delete(id); this.listarTodo(); } },
        limpiar() { 
            this.accion = 'nuevo'; 
            this.libro = { idLibro:0, idAutor:"", isbn:"", titulo:"", editorial:"", edicion:"" }; 
        }
    },
    mounted() { this.listarTodo(); },
    template: `
    <div class="row">
        <div class="col-md-4">
            <div class="card shadow-sm border-success">
                <div class="card-body">
                    <h5>Registro de Libros</h5>
                    <select v-model="libro.idAutor" class="form-select mb-2">
                        <option value=""> Seleccione Autor</option>
                        <option v-for="a in autores" :value="a.idAutor">{{a.nombre}}</option>
                    </select>
                    <input v-model="libro.isbn" placeholder="ISBN (Código)" class="form-control mb-2">
                    <input v-model="libro.titulo" placeholder="Título" class="form-control mb-2">
                    <input v-model="libro.editorial" placeholder="Editorial" class="form-control mb-2">
                    <input v-model="libro.edicion" placeholder="Edición" class="form-control mb-2">
                    <button @click="guardarLibro" class="btn btn-success w-100">Guardar Libro</button>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <input v-model="buscar" @keyup="listarTodo" placeholder="Buscar por título o ISBN..." class="form-control mb-3">
            <table class="table table-sm">
                <thead><tr><th>Título</th><th>ISBN</th><th>Editorial</th><th>Acciones</th></tr></thead>
                <tbody>
                    <tr v-for="l in libros" :key="l.idLibro">
                        <td>{{l.titulo}}</td><td>{{l.isbn}}</td><td>{{l.editorial}}</td>
                        <td>
                            <button @click="modificarLibro(l)" class="btn btn-sm btn-info">E</button>
                            <button @click="eliminarLibro(l.idLibro)" class="btn btn-sm btn-danger">X</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`
};