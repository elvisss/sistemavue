<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Roles</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda"></v-text-field>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="roles"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
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
                roles: [],
                dialog: false,
                headers: [
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Descripcion', value: 'descripcion', sortable: false },
                    { text: 'Estado', value: 'condicion', sortable: false }
                ],
                search: ''
            }
        },

        computed: { },

        watch: { },

        created () {
            this.list();
        },

        methods: {
            list() {
                axios.get('api/Roles/Listar').then( res => {
                    this.roles = res.data;
                }).catch(err => {
                    console.log(err)
                });
            }
        }
    }
</script>