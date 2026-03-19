const buscar_docentes = {
    data() {
        return {
            buscar: '',
            docentes: []
        }
    },
    methods: {
        modificarDocente(docente) {
            this.$emit('modificar', docente);
        },
        obtenerDocentes() {
            try {
                const termino = `%${this.buscar}%`;
                const sql = `
                    SELECT * FROM docentes 
                    WHERE codigo LIKE ? OR nombre LIKE ? 
                    ORDER BY nombre ASC
                `;
                // Usamos la variable global db_sqlite definida en main.js
                this.docentes = db_sqlite.selectObjects(sql, [termino, termino]);
            } catch (error) {
                console.error("Error al buscar docentes:", error);
            }
        },
        async eliminarDocente(docente, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar docentes', `¿Está seguro de eliminar al docente ${docente.nombre}?`, () => {
                try {
                    db_sqlite.exec({
                        sql: "DELETE FROM docentes WHERE idDocente = ?",
                        bind: [docente.idDocente]
                    });
                    alertify.success(`Docente ${docente.nombre} eliminado`);
                    this.obtenerDocentes(); 
                } catch (error) {
                    alertify.error("No se pudo eliminar");
                }
            }, () => {});
        },
    },
    template: `
        <div class="row">
            <div class="col-12">
                <div class="card text-bg-dark">
                    <div class="card-header">BUSQUEDA DE DOCENTES</div>
                    <div class="card-body">
                        <table class="table table-striped table-hover table-dark">
                            <thead>
                                <tr>
                                    <th colspan="7">
                                        <input type="search" @keyup="obtenerDocentes()" v-model="buscar" 
                                               placeholder="Buscar por código o nombre..." class="form-control">
                                    </th>
                                </tr>
                                <tr>
                                    <th>CODIGO</th><th>NOMBRE</th><th>DIRECCION</th>
                                    <th>EMAIL</th><th>TELEFONO</th><th>ESCALAFON</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)" style="cursor:pointer">
                                    <td>{{ docente.codigo }}</td>
                                    <td>{{ docente.nombre }}</td>
                                    <td>{{ docente.direccion }}</td>
                                    <td>{{ docente.email }}</td>
                                    <td>{{ docente.telefono }}</td>
                                    <td>{{ docente.escalafon }}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarDocente(docente, $event)">DEL</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};