const buscar_materias = {
    data() {
        return {
            buscar: '',
            materias: []
        }
    },
    methods: {
        modificarMateria(materia) {
            this.$emit('modificar', materia);
        },
        obtenerMaterias() {
            try {
                const termino = `%${this.buscar}%`;
                const sql = "SELECT * FROM materias WHERE nombre LIKE ? OR codigo LIKE ? ORDER BY nombre ASC";
                this.materias = db_sqlite.selectObjects(sql, [termino, termino]);
            } catch (error) {
                console.error("Error al buscar materias:", error);
            }
        },
        eliminarMateria(materia, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar Materia', `¿Eliminar ${materia.nombre}?`, () => {
                db_sqlite.exec({
                    sql: "DELETE FROM materias WHERE idMateria = ?",
                    bind: [materia.idMateria]
                });
                this.obtenerMaterias();
                alertify.success("Materia eliminada");
            }, () => {});
        }
    },
    template: `
        <div class="card text-bg-dark">
            <div class="card-header">BUSQUEDA DE MATERIAS</div>
            <div class="card-body">
                <input type="search" v-model="buscar" @keyup="obtenerMaterias()" class="form-control mb-2" placeholder="Buscar materia...">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr><th>CODIGO</th><th>NOMBRE</th><th>UV</th><th></th></tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in materias" @click="modificarMateria(m)" style="cursor:pointer">
                            <td>{{m.codigo}}</td><td>{{m.nombre}}</td><td>{{m.uv}}</td>
                            <td><button class="btn btn-danger btn-sm" @click.stop="eliminarMateria(m, $event)">DEL</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};