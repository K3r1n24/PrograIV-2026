const docentes = {
    props:['forms'],
    data(){
        return{
            docente:{
                idDocente:0,
                codigo:"",
                nombre:"",
                direccion:"",
                email:"",
                telefono:"",
                escalafon:""
            },
            accion:'nuevo',
            idDocente:0,
            data_docentes:[]
        }
    },
    methods:{
        buscarDocente(){
            this.forms.busqueda_docentes.mostrar = !this.forms.busqueda_docentes.mostrar;
            this.$emit('buscar');
        },
        modificarDocente(docente){
            this.accion = 'modificar';
            this.idDocente = docente.idDocente;
            this.docente.codigo = docente.codigo;
            this.docente.nombre = docente.nombre;
            this.docente.direccion = docente.direccion;
            this.docente.email = docente.email;
            this.docente.telefono = docente.telefono;
            this.docente.escalafon = docente.escalafon;
        },
        async guardarDocente() {
            let idActual = this.accion == 'modificar' ? this.idDocente : this.getId();

            try {
                // 1. Verificar si el código ya existe (solo si es nuevo)
                if (this.accion == 'nuevo') {
                    const existente = db_sqlite.selectObjects(
                        "SELECT nombre FROM docentes WHERE codigo = ?", 
                        [this.docente.codigo]
                    );
                    if (existente.length > 0) {
                        alertify.error(`El código ya existe, pertenece al docente: ${existente[0].nombre}`);
                        return;
                    }
                }

                // 2. Ejecutar el GUARDAR con SQL (INSERT OR REPLACE)
                db_sqlite.exec({
                    sql: `INSERT OR REPLACE INTO docentes (idDocente, codigo, nombre, direccion, email, telefono, escalafon) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    bind: [
                        idActual,
                        this.docente.codigo,
                        this.docente.nombre,
                        this.docente.direccion,
                        this.docente.email,
                        this.docente.telefono,
                        this.docente.escalafon
                    ]
                });

                alertify.success(`${this.docente.nombre} guardado correctamente en SQLite`);
                this.limpiarFormulario();
                
            } catch (error) {
                console.error("Error en SQLite Docentes:", error);
                alertify.error("No se pudo guardar el docente localmente");
            }
        },
        getId(){
            return new Date().getTime(); 
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idDocente = 0;
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.direccion = '';
            this.docente.email = '';
            this.docente.telefono = '';
            this.docente.escalafon = '';
        },
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                        <div class="card-header">REGISTRO DE DOCENTES</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">CODIGO:</div>
                                <div class="col-3">
                                    <input placeholder="codigo" required v-model="docente.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">NOMBRE:</div>
                                <div class="col-6">
                                    <input placeholder="nombre" required v-model="docente.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">DIRECCION:</div>
                                <div class="col-9">
                                    <input placeholder="direccion" required v-model="docente.direccion" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">EMAIL:</div>
                                <div class="col-6">
                                    <input placeholder="email" required v-model="docente.email" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">TELEFONO:</div>
                                <div class="col-4">
                                    <input placeholder="telefono" required v-model="docente.telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">ESCALAFON:</div>
                                <div class="col-5">
                                    <select required v-model="docente.escalafon" class="form-select">
                                        <option value="tecnico">Tecnico</option>
                                        <option value="profesor">Profesor</option>
                                        <option value="ingeniero">Licenciado/Ingeniero</option>
                                        <option value="maestria">Maestria</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <button type="submit" class="btn btn-primary m-1">GUARDAR</button>
                            <button type="reset" class="btn btn-warning m-1">NUEVO</button>
                            <button type="button" @click="buscarDocente" class="btn btn-success m-1">BUSCAR</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};