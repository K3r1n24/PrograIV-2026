const buscar_alumnos = {
    props:['forms'],
    data(){ return{ buscar:'', alumnos:[] } },
    methods:{
        cerrarFormularioBusquedaAlumnos(){ this.forms.busqueda_alumnos.mostrar = false; },
        modificarAlumno(alumno){ this.$emit('modificar', alumno); },
        async obtenerAlumnos(){
            console.time('obtenerAlumnos');
            const criterio = `%${this.buscar.toLowerCase()}%`;
            this.alumnos = await db.select(
                `SELECT idAlumno, codigo, nombre, direccion, email, telefono, hash
                 FROM alumnos
                 WHERE lower(codigo) LIKE ? OR lower(nombre) LIKE ? OR lower(email) LIKE ?
                 ORDER BY codigo;`,
                [criterio, criterio, criterio]
            );
            console.timeEnd('obtenerAlumnos');
            if( this.alumnos.length<1 && this.buscar.length<=0){
                fetch(`private/modulos/alumnos/alumno.php?accion=consultar`)
                    .then(response=>response.json())
                    .then(async data=>{
                        this.alumnos = data;
                        for (const alumno of data) {
                            await db.exec(
                                `INSERT INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono, hash)
                                 VALUES (?, ?, ?, ?, ?, ?, ?)
                                 ON CONFLICT(idAlumno) DO UPDATE SET
                                    codigo = excluded.codigo,
                                    nombre = excluded.nombre,
                                    direccion = excluded.direccion,
                                    email = excluded.email,
                                    telefono = excluded.telefono,
                                    hash = excluded.hash;`,
                                [alumno.idAlumno, alumno.codigo, alumno.nombre, alumno.direccion, alumno.email, alumno.telefono, alumno.hash ?? null]
                            );
                        }
                    });
            }
        },
        async eliminarAlumno(alumno, e){
            e.stopPropagation();
            alertify.confirm('Elimanar alumnos', `¿Está seguro de eliminar el alumno ${alumno.nombre}?`, async e=>{
                await db.exec(`DELETE FROM alumnos WHERE idAlumno = ?;`, [alumno.idAlumno]);
                fetch(`private/modulos/alumnos/alumno.php?accion=eliminar&alumnos=${JSON.stringify(alumno)}`)
                    .then(response=>response.json())
                    .then(data=>{ if(data!=true) alertify.error(`Error al sincronizar con el servidor: ${data}`); });
                await this.obtenerAlumnos();
                alertify.success(`Alumno ${alumno.nombre} eliminado correctamente`);
            }, () => {});
        },
    },
    template: `
        <div v-draggable>
            <div class="card text-bg-dark mb-3">
                <div class="card-header"><div class="d-flex justify-content-between"><div class="p-1">BUSQUEDA DE ALUMNOS</div><div><button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioBusquedaAlumnos"></button></div></div></div>
                <div class="card-body">
                    <table class="table table-striped table-hover" id="tblAlumnos">
                        <thead>
                            <tr><th colspan="6"><input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="Buscar alumno" class="form-control"></th></tr>
                            <tr><th>CODIGO</th><th>NOMBRE</th><th>DIRECCION</th><th>EMAIL</th><th>TELEFONO</th><th>HASH</th><th></th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)">
                                <td>{{ alumno.codigo }}</td><td>{{ alumno.nombre }}</td><td>{{ alumno.direccion }}</td><td>{{ alumno.email }}</td><td>{{ alumno.telefono }}</td><td>{{ alumno.hash }}</td>
                                <td><button class="btn btn-danger" @click="eliminarAlumno(alumno, $event)">DEL</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};
