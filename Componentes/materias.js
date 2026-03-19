const materias = {
    props:['forms'],
    data(){
        return{
            materia:{
                idMateria:0,
                codigo:"",
                nombre:"",
                uv:'',
            },
            accion:'nuevo',
            idMateria:0,
            data_materias:[]
        }
    },
    methods:{
        cerrarFormularioMateria(){
            this.forms.materias.mostrar = false;
        },
        buscarMateria(){
            this.forms.busqueda_materias.mostrar = !this.forms.busqueda_materias.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia){
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            this.materia.codigo = materia.codigo;
            this.materia.nombre = materia.nombre;
            this.materia.uv = materia.uv;
        },
        async guardarMateria() {
            // 1. Definimos el ID (UUID o el existente)
            let idActual = this.accion == 'modificar' ? this.idMateria : this.getId();

            try {
                // 2. Verificar si el código ya existe (solo en registros nuevos)
                if (this.accion == 'nuevo') {
                    const existente = db_sqlite.selectObjects(
                        "SELECT nombre FROM materias WHERE codigo = ?", 
                        [this.materia.codigo]
                    );
                    if (existente.length > 0) {
                        alertify.error(`El código de materia ya existe: ${existente[0].nombre}`);
                        return;
                    }
                }

                // 3. Ejecutar el INSERT OR REPLACE en SQLite
                db_sqlite.exec({
                    sql: `INSERT OR REPLACE INTO materias (idMateria, codigo, nombre, uv) 
                          VALUES (?, ?, ?, ?)`,
                    bind: [
                        idActual,
                        this.materia.codigo,
                        this.materia.nombre,
                        this.materia.uv
                    ]
                });

                alertify.success(`Materia ${this.materia.nombre} guardada con éxito en SQLite`);
                this.limpiarFormulario();
                
            } catch (error) {
                console.error("Error en SQLite Materias:", error);
                alertify.error("No se pudo guardar la materia localmente");
            }
        },
        getId(){
            return uuid.v4();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idMateria = 0;
            this.materia.codigo = '';
            this.materia.nombre = '';
            this.materia.uv = '';
        },
    },
    template: `
    <div v-draggable>
        <form id="frmMaterias" @submit.prevent="guardarMateria" @reset.prevent="limpiarFormulario">
            <div class="card text-bg-dark">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">
                            REGISTRO DE MATERIAS
                        </div>
                        <div>
                            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioMateria"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-3">CODIGO:</div>
                        <div class="col-3">
                            <input placeholder="codigo" required v-model="materia.codigo" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">NOMBRE:</div>
                        <div class="col-6">
                            <input placeholder="nombre" required v-model="materia.nombre" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">UV:</div>
                        <div class="col-3">
                            <input placeholder="uv" required v-model="materia.uv" type="number" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col text-center">
                            <button type="submit" id="btnGuardarMateria" class="btn btn-primary">GUARDAR</button>
                            <button type="reset" id="btnCancelarMateria" class="btn btn-warning">NUEVO</button>
                            <button type="button" @click="buscarMateria" id="btnBuscarMateria" class="btn btn-success">BUSCAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    `
};