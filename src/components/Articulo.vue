<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Artículos</v-toolbar-title>
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
                                        <v-text-field v-model="codigo" label="Código"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-select v-model="idcategoria" :items="categorias" label="Categoría"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field type="number" v-model="precio_venta" label="Precio de venta"></v-text-field>
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
                :items="articulos"
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
                    <td>{{ props.item.codigo }}</td>
                    <td>{{ props.item.categoria }}</td>
                    <td>{{ props.item.stock }}</td>
                    <td>{{ props.item.precio_venta }}</td>
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
                articulos: [],
                dialog: false,
                headers: [
                    { text: 'Acciones', value: 'acciones', sortable: false },
                    { text: 'Código', value: 'codigo' },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Categoría', value: 'categoria' },
                    { text: 'Stock', value: 'stock' },
                    { text: 'Precio Venta', value: 'precio_venta' },
                    { text: 'Descripcion', value: 'descripcion', sortable: false },
                    { text: 'Estado', value: 'condicion', sortable: false }
                ],
                search: '',
                desserts: [],
                editedIndex: -1,
                id: '',
                idcategoria: '',
                categorias: [],
                codigo: '',
                nombre: '',
                stock: 0,
                precio_venta: 0,
                descripcion: '',
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
                return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Actualizar Artículo'
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
                axios.get('api/Articulos/Listar').then( res => {
                    this.articulos = res.data;
                }).catch(err => {
                    console.log(err)
                });
            },

            select() {
                axios.get('api/Categorias/Select').then( res => {
                    this.categorias = res.data.map( categoria => (
                        { text: categoria.nombre, value: categoria.idcategoria }
                    ));
                }).catch(err => {
                    console.log(err)
                });
            },

            editItem (item) {
                this.id = item.idarticulo;
                this.idcategoria = item.idcategoria;
                this.codigo = item.codigo;
                this.nombre = item.nombre;
                this.stock = item.stock;
                this.precio_venta = item.precio_venta;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true;
            },

            close () {
                this.dialog = false;
                this.clean();
            },

            clean() {
                this.id = '';
                this.idcategoria = '';
                this.codigo = '';
                this.nombre = '';
                this.stock = 0;
                this.precio_venta = 0;
                this.descripcion = '';
                this.editedIndex = -1;
            },

            save () {
                if (this.validar()) {
                    return;
                }

                if (this.editedIndex > -1) {
                    // Edit
                    axios.put('api/Articulos/Actualizar', {
                        idarticulo: this.id,
                        idcategoria: this.idcategoria,
                        codigo: this.codigo,
                        nombre: this.nombre,
                        stock: this.stock,
                        precio_venta: this.precio_venta,
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
                    axios.post('api/Articulos/Crear', {
                        idcategoria: this.idcategoria,
                        codigo: this.codigo,
                        nombre: this.nombre,
                        stock: this.stock,
                        precio_venta: this.precio_venta,
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
                if ( !this.idcategoria) {
                    this.validaMensaje.push('Seleccione una categoría');
                }
                if ( !this.stock ) {
                    this.validaMensaje.push('Ingrese un stock válido');
                }
                if ( !this.precio_venta ) {
                    this.validaMensaje.push('Ingrese un precio de venta válido');
                }
                if ( this.validaMensaje.length ) {
                    this.valida = 1;
                }
                return this.valida;
            },

            openAdModal(item) {
                this.adModal = true;
                this.adNombre = item.nombre;
                this.adId = item.idarticulo;
                this.adAction = item.condicion;
            },

            closeAdModal() {
                this.adModal = false;
            },

            activateDesactivate() {
                axios.put(`api/Articulos/${this.adAction ? 'Desactivar' : 'Activar'}/${this.adId}`, {})
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