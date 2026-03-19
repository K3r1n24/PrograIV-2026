const alumnos = {
    props:['forms'],
    data(){
        return {
            alumno:{ idAlumno:0, codigo:"", nombre:"", direccion:"", email:"", telefono:"" },
            accion:'nuevo'
        }
    },
    methods:{
        cerrarFormularioAlumno(){ this.forms.alumnos.mostrar = false; },
        buscarAlumno(){
            this.forms.busqueda_alumnos.mostrar = true;
            this.$emit('buscar');
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.alumno = {...alumno};
        },
        async guardarAlumno() {
            let id = this.accion == 'modificar' ? this.alumno.idAlumno : uuid.v4();
            try {
                db_sqlite.exec({
                    sql: `INSERT OR REPLACE INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono) 
                          VALUES (?, ?, ?, ?, ?, ?)`,
                    bind: [id, this.alumno.codigo, this.alumno.nombre, this.alumno.direccion, this.alumno.email, this.alumno.telefono]
                });
                alertify.success("Alumno guardado en SQLite");
                this.limpiarFormulario();
            } catch (e) { alertify.error("Error al guardar"); }
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.alumno = { idAlumno:0, codigo:"", nombre:"", direccion:"", email:"", telefono:"" };
        }
    },
    template: `
        <div v-draggable class="card text-bg-dark m-2" style="width: 400px; position: fixed; z-index: 1000;">
            <div class="card-header d-flex justify-content-between">
                REGISTRO DE ALUMNOS <button class="btn-close btn-close-white" @click="cerrarFormularioAlumno"></button>
            </div>
            <div class="card-body">
                <input v-model="alumno.codigo" placeholder="Código" class="form-control mb-2">
                <input v-model="alumno.nombre" placeholder="Nombre" class="form-control mb-2">
                <input v-model="alumno.direccion" placeholder="Dirección" class="form-control mb-2">
                <input v-model="alumno.email" placeholder="Email" class="form-control mb-2">
                <input v-model="alumno.telefono" placeholder="Teléfono" class="form-control mb-2">
            </div>
            <div class="card-footer text-center">
                <button @click="guardarAlumno" class="btn btn-primary m-1">GUARDAR</button>
                <button @click="limpiarFormulario" class="btn btn-warning m-1">NUEVO</button>
                <button @click="buscarAlumno" class="btn btn-success m-1">BUSCAR</button>
            </div>
        </div>
    `
};