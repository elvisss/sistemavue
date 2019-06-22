<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda"></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-select v-model="idrol" :items="roles" label="Rol"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-select v-model="tipo_documento" :items="documentos" label="Tipo Documento"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="num_documento" label="Número Documento"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="email" label="Email"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field type="password" v-model="password" label="Password"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 v-show="valida">
                                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290px">
                    <v-card>
                        <v-card-title class="headline">¿{{ adAction ? 'Desa' : 'A' }}ctivar Item?</v-card-title>
                        <v-card-text>
                            Estás a punto de {{ adAction ? 'Des' : '' }}activar el ítem {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat="flat" @click="closeAdModal">Cancelar</v-btn>
                            <v-btn color="orange darken-4" flat="flat" @click="activateDesactivate">{{ adAction ? 'Desa' : 'A' }}ctivar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="usuarios"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                            small
                            @click="openAdModal(props.item)"
                        >
                            {{ props.item.condicion ? 'block' : 'check' }}
                        </v-icon>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.rol }}</td>
                    <td>{{ props.item.tipo_documento }}</td>
                    <td>{{ props.item.num_documento }}</td>
                    <td>{{ props.item.direccion }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>
                        <div v-if="props.item.condicion">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="list">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                usuarios: [],
                dialog: false,
                headers: [
                    { text: 'Acciones', value: 'acciones', sortable: false },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Rol', value: 'rol' },
                    { text: 'Tipo documento', value: 'tipo_documento' },
                    { text: 'Número documento', value: 'num_documento', sortable: false },
                    { text: 'Dirección', value: 'direccion', sortable: false },
                    { text: 'Teléfono', value: 'telefono', sortable: false },
                    { text: 'Email', value: 'email', sortable: false },
                    { text: 'Estado', value: 'condicion', sortable: false }
                ],
                search: '',
                editedIndex: -1,
                id: '',
                idrol: '',
                nombre: '',
                roles: [],
                documentos: ['DNI', 'RUC', 'PASAPORTE', 'CÉDULA'],
                num_documento: '',
                tipo_documento: '',
                direccion: '',
                telefono: '',
                email: '',
                password: '',
                actPassword: false,
                passwordAnt: '',
                valida: 0,
                validaMensaje: [],
                adModal: false,
                adAction: false,
                adNombre: '',
                adId: ''
            }
        },

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Actualizar Usuario'
            }
        },

        watch: {
            dialog (val) {
                val || this.close()
            }
        },

        created () {
            this.list();
            this.select();
        },

        methods: {
            list() {
                axios.get('api/Usuarios/Listar').then( res => {
                    this.usuarios = res.data;
                }).catch(err => {
                    console.log(err)
                });
            },

            select() {
                axios.get('api/Roles/Select').then( res => {
                    this.roles = res.data.map( rol => (
                        { text: rol.nombre, value: rol.idrol }
                    ));
                }).catch(err => {
                    console.log(err)
                });
            },

            editItem (item) {
                this.id = item.idusuario;
                this.idrol = item.idrol;
                this.nombre = item.nombre;
                this.tipo_documento = item.tipo_documento;
                this.num_documento = item.num_documento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.password = item.password_hash;
                this.passwordAnt = item.password_hash;
                this.editedIndex = 1;
                this.dialog = true;
            },

            close () {
                this.dialog = false;
                this.clean();
            },

            clean() {
                this.id = '';
                this.idrol = '';
                this.nombre = '';
                this.tipo_documento = '';
                this.num_documento = '';
                this.direccion = '';
                this.telefono = '';
                this.email = '';
                this.password = '';
                this.passwordAnt = '';
                this.actPassword = false;
                this.editedIndex = -1;
            },

            save () {
                if (this.validar()) {
                    return;
                }

                if (this.editedIndex > -1) {
                    // Edit

                    if ( this.password !== this.passwordAnt ) {
                        this.actPassword = true;
                    }

                    axios.put('api/Usuarios/Actualizar', {
                        idusuario: this.id,
                        idrol: this.idrol,
                        nombre: this.nombre,
                        tipo_documento: this.tipo_documento,
                        num_documento: this.num_documento,
                        direccion: this.direccion,
                        telefono: this.telefono,
                        email: this.email,
                        password: this.password,
                        act_password: this.actPassword
                    }).then( res => {
                        this.close();
                        this.list();
                        this.clean();
                    }).catch( err => {
                        console.log(err)
                    });
                } else {
                    // Add
                    axios.post('api/Usuarios/Crear', {
                        idrol: this.idrol,
                        nombre: this.nombre,
                        tipo_documento: this.tipo_documento,
                        num_documento: this.num_documento,
                        direccion: this.direccion,
                        telefono: this.telefono,
                        email: this.email,
                        password: this.password
                    }).then( res => {
                        this.close();
                        this.list();
                        this.clean();
                    }).catch( err => {
                        console.log(err)
                    });
                }
            },

            validar() {
                this.valida = 0;
                this.validaMensaje = [];
                if ( this.nombre.length < 3 || this.nombre.length > 100 ) {
                    this.validaMensaje.push('El nombre debe tener más de 3 caracteres y menos de 100');
                }
                if ( !this.idrol) {
                    this.validaMensaje.push('Seleccione un rol');
                }
                if ( !this.tipo_documento ) {
                    this.validaMensaje.push('Ingrese un documento válido');
                }
                if ( !this.email ) {
                    this.validaMensaje.push('Ingrese un email válido');
                }
                if ( !this.password ) {
                    this.validaMensaje.push('Ingrese un password válido');
                }
                if ( this.validaMensaje.length ) {
                    this.valida = 1;
                }
                return this.valida;
            },

            openAdModal(item) {
                this.adModal = true;
                this.adNombre = item.nombre;
                this.adId = item.idusuario;
                this.adAction = item.condicion;
            },

            closeAdModal() {
                this.adModal = false;
            },

            activateDesactivate() {
                axios.put(`api/Usuarios/${this.adAction ? 'Desactivar' : 'Activar'}/${this.adId}`, {})
                    .then( res => {
                        this.adModal = 0;
                        this.adAction = 0;
                        this.adNombre = '';
                        this.adId = '';
                        this.list();
                    }).catch( err => {
                        console.log(err)
                    });
            }
        }
    }
</script>