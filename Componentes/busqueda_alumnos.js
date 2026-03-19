const buscar_alumnos = {
    props: ['forms'],
    data() {
        return { buscar: '', alumnos: [] }
    },
    methods: {
        obtenerAlumnos() {
            try {
                const term = `%${this.buscar}%`;
                const sql = "SELECT * FROM alumnos WHERE nombre LIKE ? OR codigo LIKE ? ORDER BY nombre ASC";
                this.alumnos = db_sqlite.selectObjects(sql, [term, term]);
            } catch (e) { console.error(e); }
        },
        eliminarAlumno(alumno, e) {
            e.stopPropagation(); // IMPORTANTE: evita que se abra el formulario al hacer clic en eliminar
            
            alertify.confirm("Eliminar Alumno", `¿Está seguro de eliminar a ${alumno.nombre}?`, () => {
                try {
                    // EJECUTAR EL DELETE EN SQLITE
                    db_sqlite.exec({
                        sql: "DELETE FROM alumnos WHERE idAlumno = ?",
                        bind: [alumno.idAlumno]
                    });
                    
                    // MENSAJE DE EXITO
                    alertify.error("Alumno eliminado de la base de datos");
                    
                    // REFRESCAR LA TABLA DE INMEDIATO
                    this.obtenerAlumnos();
                } catch (error) {
                    alertify.error("Error al eliminar");
                }
            }, () => { });
        }
    },
    mounted() {
        this.obtenerAlumnos();
    },
    template: `
        <div v-draggable class="card text-bg-dark m-2" style="width: 1000px; position: fixed; right: 20px; top: 100px; z-index: 999;">
            <div class="card-header d-flex justify-content-between">
                <span>BUSQUEDA DE ALUMNOS</span>
                <button type="button" class="btn-close btn-close-white" @click="forms.busqueda_alumnos.mostrar=false"></button>
            </div>
            <div class="card-body">
                <input v-model="buscar" @keyup="obtenerAlumnos" placeholder="Buscar por nombre o código..." class="form-control mb-3">
                <div class="table-responsive">
                    <table class="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th>CODIGO</th><th>NOMBRE</th><th>DIRECCION</th><th>EMAIL</th><th>TELEFONO</th><th>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="a in alumnos" :key="a.idAlumno" @click="$emit('modificar', a)" style="cursor:pointer">
                                <td>{{ a.codigo }}</td>
                                <td>{{ a.nombre }}</td>
                                <td>{{ a.direccion }}</td>
                                <td>{{ a.email }}</td>
                                <td>{{ a.telefono }}</td>
                                <td class="text-center">
                                    <button @click.stop="eliminarAlumno(a, $event)" class="btn btn-danger btn-sm">ELIMINAR</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};