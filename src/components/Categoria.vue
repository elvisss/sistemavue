<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
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
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
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
                :items="categories"
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
                            @click="deleteItem(props.item)"
                        >
                            delete
                        </v-icon>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.descripcion }}</td>
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
                    <v-btn color="primary" @click="initialize">Resetear</v-btn>
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
                categories: [],

                dialog: false,
                headers: [
                    { text: 'Acciones', value: 'acciones', sortable: false },
                    { text: 'Nomnbre', value: 'nombre' },
                    { text: 'Descripcion', value: 'descripcion', sortable: false },
                    { text: 'Estado', value: 'condicion', sortable: false }
                ],
                search: '',
                desserts: [],
                editedIndex: -1,
                editedItem: {
                    name: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0
                },
                id: '',
                nombre: '',
                descripcion: '',
                valida: 0,
                validaMensaje: []
            }
        },

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nueva categoría' : 'Actualizar categoría'
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
                axios.get('api/Categorias/Listar').then( res => {
                    this.categories = res.data;
                }).catch(err => {
                    console.log(err)
                });
            },

            editItem (item) {
                this.id = item.id;
                this.nombre = item.nombre;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false;
            },

            clean() {
                this.id = '';
                this.nombre = '';
                this.descripcion = '';
            },

            save () {
                if (this.validar()) {
                    return;
                }

                if (this.editedIndex > -1) {
                    // Edit
                    axios.put('api/Categorias/Crear', {
                        nombre: this.nombre,
                        descripcion: this.descripcion
                    }).then( res => {
                        this.close();
                        this.list();
                        this.clean();
                    }).catch( err => {
                        console.log(err)
                    });
                } else {
                    // Add
                    axios.post('api/Categorias/Crear', {
                        nombre: this.nombre,
                        descripcion: this.descripcion
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
                if ( this.nombre.length < 3 || this.nombre.length > 50 ) {
                    this.validaMensaje.push('El nombre debe tener más de 3 caracteres y menos de 50');
                }
                if ( this.validaMensaje.length ) {
                    this.valida = 1;
                }
                return this.valida;
            }
        }
    }
</script>