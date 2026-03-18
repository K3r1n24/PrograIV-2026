const alumnos = {
    props:['forms'],
    data(){
        return{
            alumno:{ idAlumno:0, codigo:"", nombre:"", direccion:"", email:"", telefono:"" },
            accion:'nuevo',
            idAlumno:0
        }
    },
    methods:{
        cerrarFormularioAlumno(){ this.forms.alumnos.mostrar = false; },
        buscarAlumno(){ this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar; this.$emit('buscar'); },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.email = alumno.email;
            this.alumno.telefono = alumno.telefono;
        },
        async guardarAlumno() {
            let datos = {
                idAlumno: this.accion=='modificar' ? this.idAlumno : this.getId(),
                codigo: this.alumno.codigo,
                nombre: this.alumno.nombre,
                direccion: this.alumno.direccion,
                email: this.alumno.email,
                telefono: this.alumno.telefono
            };
            const existente = await db.first(
                `SELECT idAlumno, nombre FROM alumnos WHERE codigo = ? AND idAlumno <> ?;`,
                [datos.codigo, this.accion=='modificar' ? this.idAlumno : '']
            );
            if(existente){ alertify.error(`El codigo del alumno ya existe, ${existente.nombre}`); return; }
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
                [datos.idAlumno, datos.codigo, datos.nombre, datos.direccion, datos.email, datos.telefono, null]
            );
            fetch(`private/modulos/alumnos/alumno.php?accion=${this.accion}&alumnos=${JSON.stringify(datos)}`)
                .then(response=>response.json())
                .then(data=>{ if(data!=true) alertify.error(`Error al sincronizar con el servidor: ${data}`); });
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
        },
        getId(){ return uuid.v4(); },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idAlumno = 0;
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.email = '';
            this.alumno.telefono = '';
        },
    },
    template: `
        <div v-draggable>
            <form id="frmAlumnos" @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario">
                <div class="card text-bg-dark">
                    <div class="card-header"><div class="d-flex justify-content-between"><div class="p-1">REGISTRO DE ALUMNOS</div><div><button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioAlumno"></button></div></div></div>
                    <div class="card-body">
                        <div class="row p-1"><div class="col-4">CODIGO:</div><div class="col-5"><input placeholder="codigo" required v-model="alumno.codigo" type="text" class="form-control"></div></div>
                        <div class="row p-1"><div class="col-4">NOMBRE:</div><div class="col-8"><input placeholder="nombre" required v-model="alumno.nombre" type="text" class="form-control"></div></div>
                        <div class="row p-1"><div class="col-4">DIRECCION:</div><div class="col-8"><input placeholder="direccion" required v-model="alumno.direccion" type="text" class="form-control"></div></div>
                        <div class="row p-1"><div class="col-4">EMAIL:</div><div class="col-8"><input placeholder="email" required v-model="alumno.email" type="text" class="form-control"></div></div>
                        <div class="row p-1"><div class="col-4">TELEFONO:</div><div class="col-6"><input placeholder="telefono" required v-model="alumno.telefono" type="text" class="form-control"></div></div>
                    </div>
                    <div class="card-footer"><div class="row"><div class="col text-center"><button type="submit" id="btnGuardarAlumno" class="btn btn-primary">GUARDAR</button><button type="reset" id="btnCancelarAlumno" class="btn btn-warning">NUEVO</button><button type="button" @click="buscarAlumno" id="btnBuscarAlumno" class="btn btn-success">BUSCAR</button></div></div></div>
                </div>
            </form>
        </div>
    `
};
