const { createApp } = Vue;

createApp({
    data() {
        return {
            alumno: {
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                email: "",
                telefono: "",
                fecha: "",
                sexo: ""
            },
            accion: 'nuevo',
            id: 0,
            buscar: '',
            alumnos: []
        }
    },
    methods: {
        obtenerAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                // Intentamos leer solo lo que parece un ID numérico nuestro
                if (!isNaN(key)) {
                    try {
                        let data = JSON.parse(localStorage.getItem(key));
                        // Verificamos que sea un objeto válido de alumno
                        if (data && data.codigo) {
                            if (data.nombre.toUpperCase().includes(this.buscar.toUpperCase()) ||
                                data.codigo.toUpperCase().includes(this.buscar.toUpperCase())) {
                                this.alumnos.push(data);
                            }
                        }
                    } catch (e) {
                        console.error("Error leyendo registro:", e);
                    }
                }
            }
        },
        eliminarAlumno(id, e) {
            if (e) e.stopPropagation();
            if (confirm("¿Está seguro de eliminar el alumno?")) {
                localStorage.removeItem(id);
                this.obtenerAlumnos();
            }
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.id = alumno.id;
            // Usamos spread operator para copiar los datos limpiamente
            this.alumno = { ...alumno };
        },
        guardarAlumno() {
            // Validamos que los campos importantes no estén vacíos
            if(!this.alumno.codigo || !this.alumno.nombre) {
                alert("Por favor rellene Código y Nombre");
                return;
            }

            let datos = {
                id: this.accion === 'modificar' ? this.id : this.getId(),
                ...this.alumno
            };

            let codigoDuplicado = this.buscarAlumno(datos.codigo);
            if (codigoDuplicado && this.accion === 'nuevo') {
                alert("El codigo del alumno ya existe, " + codigoDuplicado.nombre);
                return;
            }

            localStorage.setItem(datos.id, JSON.stringify(datos));
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.id = 0;
            for (let key in this.alumno) {
                this.alumno[key] = '';
            }
        },
        buscarAlumno(codigo = '') {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (!isNaN(key)) {
                    let datos = JSON.parse(localStorage.getItem(key));
                    if (datos?.codigo?.trim().toUpperCase() === codigo.trim().toUpperCase()) {
                        return datos;
                    }
                }
            }
            return null;
        }
    },
    mounted() {
        db.version(1).stores({
            "alumnos": "idAlumno, codigo, nombre, direccion, municipio, departamento, email, telefono, fecha, sexo"
        });
        this.obtenerAlumnos();
    }
}).mount("#app");