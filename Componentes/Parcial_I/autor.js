const autor = {
    props: ['forms'],
    data() {
        return {
            autor: { idAutor: 0, codigo: "", nombre: "", pais: "", telefono: "" },
            accion: 'nuevo',
            buscar: "",
            autores: [] 
        }
    },
    methods: {
        async obtenerAutores() {
            this.autores = await db.autor.filter(
                a => a.nombre.toLowerCase().includes(this.buscar.toLowerCase()) || 
                     a.pais.toLowerCase().includes(this.buscar.toLowerCase()) ||
                     a.codigo.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async guardarAutor() {
            let datos = {
                idAutor: this.accion == 'modificar' ? this.autor.idAutor : new Date().getTime(),
                codigo: this.autor.codigo,
                nombre: this.autor.nombre,
                pais: this.autor.pais,
                telefono: this.autor.telefono
            };
            
            await db.autor.put(datos);
            
            if(typeof alertify !== 'undefined') alertify.success('Autor guardado correctamente');
            
            this.limpiarFormulario();
            
            await this.obtenerAutores(); 
        },
        modificarAutor(datos) {
            this.accion = 'modificar';
            this.autor = { ...datos };
        },
        async eliminarAutor(idAutor, e) {
            e.stopPropagation();
            if (confirm("¿Desea eliminar este autor?")) {
                await db.autor.delete(idAutor);
                await this.obtenerAutores(); 
            }
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.autor = { idAutor: 0, codigo: '', nombre: '', pais: '', telefono: '' };
        }
    },
    mounted() {
        this.obtenerAutores();
    },
    template: `
        <div class="row p-3 g-4">
            <div class="col-12 col-md-5">
                <form @submit.prevent="guardarAutor" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark shadow">
                        <div class="card-header fw-bold">REGISTRO DE AUTORES</div>
                        <div class="card-body">
                            <div class="row mb-2 align-items-center">
                                <div class="col-4 small fw-bold">CODIGO:</div>
                                <div class="col-8"><input required v-model="autor.codigo" type="text" class="form-control form-control-sm"></div>
                            </div>
                            <div class="row mb-2 align-items-center">
                                <div class="col-4 small fw-bold">NOMBRE:</div>
                                <div class="col-8"><input required v-model="autor.nombre" type="text" class="form-control form-control-sm"></div>
                            </div>
                            <div class="row mb-2 align-items-center">
                                <div class="col-4 small fw-bold">PAIS:</div>
                                <div class="col-8"><input required v-model="autor.pais" type="text" class="form-control form-control-sm"></div>
                            </div>
                            <div class="row mb-2 align-items-center">
                                <div class="col-4 small fw-bold">TELEFONO:</div>
                                <div class="col-8"><input required v-model="autor.telefono" type="text" class="form-control form-control-sm"></div>
                            </div>
                        </div>
                        <div class="card-footer text-center px-1">
                            <button type="submit" class="btn btn-primary btn-sm mx-1 px-4">GUARDAR</button>
                            <button type="reset" class="btn btn-warning btn-sm mx-1 px-4 text-white">NUEVO</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-12 col-md-7 bg-white p-3 border rounded shadow-sm">
                <input type="search" @keyup="obtenerAutores" v-model="buscar" placeholder="Buscar por nombre o país..." class="form-control mb-3">
                <table class="table table-striped table-hover table-sm">
                    <thead class="table-light">
                        <tr class="small text-uppercase">
                            <th>CODIGO</th><th>NOMBRE</th><th>PAIS</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in autores" :key="a.idAutor" @click="modificarAutor(a)" style="cursor:pointer">
                            <td class="small">{{ a.codigo }}</td>
                            <td class="small">{{ a.nombre }}</td>
                            <td class="small">{{ a.pais }}</td>
                            <td class="text-end">
                                <button class="btn btn-danger btn-sm py-0" @click.stop="eliminarAutor(a.idAutor, $event)">DEL</button>
                            </td>
                        </tr>
                        <tr v-if="autores.length == 0">
                            <td colspan="4" class="text-center text-muted small">No hay autores registrados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`
};