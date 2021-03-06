<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Proveedores</v-toolbar-title>
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
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-select v-model="tipo_documento" :items="documentos" label="Tipo Documento"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="num_documento" label="Número Documento"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field v-model="email" label="Email"></v-text-field>
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
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="proveedores"
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
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.tipo_persona }}</td>
                    <td>{{ props.item.tipo_documento }}</td>
                    <td>{{ props.item.num_documento }}</td>
                    <td>{{ props.item.direccion }}</td>
                    <td>{{ props.item.telefono }}</td>
                    <td>{{ props.item.email }}</td>
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
                proveedores: [],
                dialog: false,
                headers: [
                    { text: 'Acciones', value: 'acciones', sortable: false },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Tipo Persona', value: 'tipo_persona' },
                    { text: 'Tipo documento', value: 'tipo_documento' },
                    { text: 'Número documento', value: 'num_documento', sortable: false },
                    { text: 'Dirección', value: 'direccion', sortable: false },
                    { text: 'Teléfono', value: 'telefono', sortable: false },
                    { text: 'Email', value: 'email', sortable: false }
                ],
                search: '',
                editedIndex: -1,
                id: '',
                nombre: '',
                documentos: ['DNI', 'RUC', 'PASAPORTE', 'CÉDULA'],
                num_documento: '',
                tipo_documento: '',
                direccion: '',
                telefono: '',
                email: '',
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
                return this.editedIndex === -1 ? 'Nuevo Proveedor' : 'Actualizar Proveedor'
            }
        },

        watch: {
            dialog (val) {
                val || this.close()
            }
        },

        created () {
            this.list();
        },

        methods: {
            list() {
                axios.get('api/Personas/ListarProveedores').then( res => {
                    this.proveedores = res.data;
                }).catch(err => {
                    console.log(err)
                });
            },

            editItem (item) {
                this.id = item.idpersona;
                this.nombre = item.nombre;
                this.tipo_documento = item.tipo_documento;
                this.num_documento = item.num_documento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.editedIndex = 1;
                this.dialog = true;
            },

            close () {
                this.dialog = false;
                this.clean();
            },

            clean() {
                this.id = '';
                this.nombre = '';
                this.tipo_documento = '';
                this.num_documento = '';
                this.direccion = '';
                this.telefono = '';
                this.email = '';
                this.editedIndex = -1;
            },

            save () {
                if (this.validar()) {
                    return;
                }

                if (this.editedIndex > -1) {
                    // Edit
                    axios.put('api/Personas/Actualizar', {
                        idpersona: this.id,
                        tipo_persona: 'Proveedor',
                        nombre: this.nombre,
                        tipo_documento: this.tipo_documento,
                        num_documento: this.num_documento,
                        direccion: this.direccion,
                        telefono: this.telefono,
                        email: this.email
                    }).then( res => {
                        this.close();
                        this.list();
                        this.clean();
                    }).catch( err => {
                        console.log(err)
                    });
                } else {
                    // Add
                    axios.post('api/Personas/Crear', {
                        tipo_persona: 'Proveedor',
                        nombre: this.nombre,
                        tipo_documento: this.tipo_documento,
                        num_documento: this.num_documento,
                        direccion: this.direccion,
                        telefono: this.telefono,
                        email: this.email
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
                if ( !this.tipo_documento ) {
                    this.validaMensaje.push('Ingrese un documento válido');
                }
                if ( this.validaMensaje.length ) {
                    this.valida = 1;
                }
                return this.valida;
            }
        }
    }
</script>