<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Consulta Ventas</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    Desde:&nbsp;
                    <v-text-field type="date" v-if="verNuevo==0" class="text-xs-center" v-model="fechaInicio"></v-text-field>
                    Hasta:&nbsp;
                    <v-text-field type="date" v-if="verNuevo==0" class="text-xs-center" v-model="fechaFin"></v-text-field>
                    <v-btn v-if="verNuevo==0" @click="listar()" color="primary" dark class="mb-2">Buscar</v-btn>
                    <v-dialog v-model="comprobanteModal" max-width="1000px">
                        <v-card>
                            <v-card-text>
                                <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                                <div id="factura">
                                    <header>
                                        <div id="logo">
                                            <img src="./../assets/logo2.png" id="imagen">
                                        </div>
                                        <div id="datos">
                                            <p id="encabezado">
                                                <b>IncanatoIT</b><br>José Gálvez 1368, Chongoyape - Chiclayo, Perú<br>Telefono:(+51)931742904<br>Email:jcarlos.ad7@gmail.com
                                            </p>
                                        </div>
                                        <div id="fact">
                                            <p>{{ tipo_comprobante }}<br>
                                            {{ serie_comprobante }}<br>
                                            {{ fecha_hora }}</p>
                                        </div>
                                    </header>
                                    <br>
                                    <section>
                                        <div>
                                            <table id="facliente">
                                                <tbody>
                                                    <tr>
                                                        <td id="cliente">
                                                            <strong>Sr(a). {{ cliente }}</strong><br>
                                                            <strong>Documento:</strong> {{ num_documento }}<br>
                                                            <strong>Dirección:</strong> {{ direccion }}<br>
                                                            <strong>Teléfono:</strong> {{ telefono }}<br>
                                                            <strong>Email:</strong> {{ email }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                    <br>
                                    <section>
                                        <div>
                                            <table id="facarticulo">
                                                <thead>
                                                    <tr id="fa">
                                                        <th>CANT</th>
                                                        <th>DESCRIPCION</th>
                                                        <th>PRECIO UNIT</th>
                                                        <th>DESC.</th>
                                                        <th>PRECIO TOTAL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="det in detalles" :key="det.iddetalle_venta">
                                                        <td style="text-align:center;">{{ det.cantidad }}</td>
                                                        <td>{{ det.articulo }}</td>
                                                        <td style="text-align:right;">{{ det.precio.toFixed(2) }}</td>
                                                        <td style="text-align:right;">{{ det.descuento.toFixed(2) }}</td>
                                                        <td style="text-align:right;">{{ (det.cantidad * det.precio - det.descuento).toFixed(2) }}</td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th style="text-align:right;">SUBTOTAL</th>
                                                        <th style="text-align:right;">{{ (totalParcial = (total - totalImpuesto)).toFixed(2) }}</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th style="text-align:right;">IGV ({{ impuesto }}%)</th>
                                                        <th style="text-align:right;">$ {{ totalImpuesto = (( total*impuesto )/(100 + impuesto)).toFixed(2) }}</th>
                                                    </tr>
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th style="text-align:right;">TOTAL</th>
                                                        <th style="text-align:right;">$ {{ total = (calcularTotal).toFixed(2) }}</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </section>
                                    <br>
                                    <br>
                                    <footer>
                                        <div id="gracias">
                                            <p><b>Gracias por su compra!</b></p>
                                        </div>
                                    </footer>
                                </div>
                                <v-btn @click="ocultarComprobante" color="blue darken-1" flat>Cancelar</v-btn>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="ventas"
                class="elevation-1"
                v-if="verNuevo==0"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="verDetalles(props.item)"
                        >
                        tab
                        </v-icon>
                        <v-icon
                        small
                        class="mr-2"
                        @click="mostrarComprobante(props.item)"
                        >
                        print
                        </v-icon>
                    </td>
                    <td>{{ props.item.usuario }}</td>
                    <td>{{ props.item.proveedor}}</td>
                    <td>{{ props.item.tipo_comprobante }}</td>
                    <td>{{ props.item.serie_comprobante }}</td>
                    <td>{{ props.item.num_comprobante }}</td>
                    <td>{{ props.item.fecha_hora }}</td>
                    <td>{{ props.item.impuesto }}</td>
                    <td>{{ props.item.total }}</td>
                    <td>
                        <div v-if="props.item.estado=='Aceptado'">
                            <span class="blue--text">Aceptado</span>
                        </div>
                        <div v-else>
                            <span class="red--text">{{props.item.estado}}</span>
                        </div>
                    </td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="tipo_comprobante" 
                        :items="comprobantes" label="Tipo Comprobante">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="serie_comprobante" label="Serie Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="num_comprobante" label="Número Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-select v-model="idcliente"
                        :items="clientes" label="Cliente">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="impuesto" label="Impuesto">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-text-field @keyup.enter="buscarCodigo()" v-model="codigo" label="Código">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn @click="mostrarArticulos()" small fab dark color="teal">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-if="errorArticulo">
                        <div class="red--text" v-text="errorArticulo">
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-data-table
                            :headers="cabeceraDetalles"
                            :items="detalles"
                            hide-actions
                            class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.articulo }}</td>
                                <td><v-text-field type="number" v-model="props.item.cantidad"></v-text-field></td>
                                <td><v-text-field type="number" v-model="props.item.precio"></v-text-field></td>
                                <td><v-text-field type="number" v-model="props.item.descuento"></v-text-field></td>
                                <td>$ {{ props.item.cantidad * props.item.precio - props.item.descuento}}</td>
                            </template>
                            <template slot="no-data">
                                <h3>No hay artículos agregados al detalle.</h3>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total Parcial: </strong>$ {{totalParcial=(total-totalImpuesto).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Total Impuesto: </strong>$ {{totalImpuesto=((total*impuesto)/(100+impuesto)).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Total Neto: </strong>$ {{total=(calcularTotal).toFixed(2)}}
                        </v-flex>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn @click="ocultarNuevo()" color="blue darken-1" flat>Cancelar</v-btn>
                        <v-btn v-if="verDet==0" @click="guardar()" color="success">Guardar</v-btn>
                    </v-flex>
		        </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import html2canvas from 'html2canvas'

    export default {
        data() {
            return {
                ventas: [],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Cliente', value: 'cliente' },
                    { text: 'Tipo Comprobante', value: 'tipo_comprobante' },
                    { text: 'Serie Comprobante', value: 'serie_comprobante', sortable: false  },
                    { text: 'Número Comprobante', value: 'num_comprobante', sortable: false  },
                    { text: 'Fecha', value: 'fecha_hora', sortable: false  },
                    { text: 'Impuesto', value: 'impuesto', sortable: false  },
                    { text: 'Total', value: 'total', sortable: false  },
                    { text: 'Estado', value: 'estado', sortable: false  }                
                ],
                cabeceraDetalles: [
                    { text: 'Artículo', value: 'articulo', sortable: false },
                    { text: 'Cantidad', value: 'cantidad', sortable: false  },
                    { text: 'Precio', value: 'precio', sortable: false  },
                    { text: 'Descuento', value: 'descuento', sortable: false  },
                    { text: 'Subtotal', value: 'subtotal', sortable: false  }                
                ],
                detalles:[                    
                ],
                search: '',
                id: '',
                idcliente:'',
                clientes: [],
                tipo_comprobante: '',
                comprobantes: ['FACTURA','BOLETA','TICKET','GUIA'],
                serie_comprobante: '',
                num_comprobante: '',
                impuesto: 18,
                codigo:'',
                verNuevo:0,
                errorArticulo:null,
                totalParcial:0,
                totalImpuesto:0,
                total:0,
                cabeceraArticulos: [
                    {text: 'Seleccionar', value: 'seleccionar', sortable: false },
                    { text: 'Artículo', value: 'articulo'},
                    { text: 'Categoría', value: 'categoria' },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Stock', value: 'stock', sortable: false  },
                    { text: 'Precio Venta', value: 'precio_venta', sortable: false  }            
                ],
                articulos:[],
                texto:'',
                verArticulos:0,
                verDet: 0,
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: '',
                comprobanteModal: 0,
                cliente: '',
                fecha_hora: '',
                num_documento: '',
                direccion: '',
                telefono: '',
                email: '',
                fechaInicio: '',
                fechaFin: ''
            }
        },

        computed: {
            calcularTotal: function() {
                var resultado=0.0;
                for(var i=0;i<this.detalles.length;i++){
                    resultado = resultado + (this.detalles[i].precio*this.detalles[i].cantidad - this.detalles[i].descuento);
                }
                return resultado;
            }
        },

        watch: {
            dialog (val) {
                val || this.close()
            }
        },

        created () {
            this.listar();
            this.select();
        },

        methods: {
            crearPDF() {
                var quotes = document.querySelector("#factura");
                html2canvas(quotes)
                    .then( canvas => {
                        var imgData = canvas.toDataURL('image/png');
                        var imgWith = 210;
                        var pageHeight = 295;
                        var imgHeight = canvas.height * imgWith / canvas.width;
                        var heightLeft = imgHeight;
                        var doc = new jsPDF();
                        var position = 0;

                        doc.addImage(imgData, 'PNG', 0, position, imgWith, imgHeight);
                        doc.save('ComprobanteVenta.pdf');
                    });
            },
            mostrarComprobante(item) {
                this.limpiar();
                this.tipo_comprobante = item.tipo_comprobante;
                this.serie_comprobante = item.serie_comprobante;
                this.num_comprobante = item.num_comprobante;
                this.cliente = item.cliente;
                this.num_documento = item.num_documento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.fecha_hora = item.fecha_hora;
                this.impuesto = item.impuesto;
                this.listarDetalles(item.idventa);
                this.comprobanteModal = 1;
            },
            ocultarComprobante() {
                this.comprobanteModal = 0;
                this.limpiar();
            },
            mostrarNuevo(){
                this.verNuevo=1;
            },
            ocultarNuevo(){
                this.verNuevo=0;
                this.limpiar();
            },
            agregarDetalle(data = []){
                this.errorArticulo = null;
                if (this.encuentra(data['idarticulo'])){
                    this.errorArticulo="El artículo ya ha sido agregado."
                }
                else{
                    this.detalles.push(
                        {
                            idarticulo: data['idarticulo'],
                            articulo: data['nombre'],
                            cantidad: 1,
                            precio: data['precio_venta'],
                            descuento: 0
                        }
                    );
                }
            },
            encuentra(id){
                var sw = 0;
                for(var i=0; i<this.detalles.length; i++){
                    if (this.detalles[i].idarticulo==id) {
                        sw = 1;
                    }
                }
                return sw;
            },
            listar() {
                let url = '';
                if (!this.fechaInicio || !this.fechaFin) {
                    url = 'api/Ventas/Listar';
                }
                else {
                    url = 'api/Ventas/ConsultarFechas/' + this.fechaInicio + '/' + this.fechaFin;
                }
                axios.get(url)
                    .then(response => {
                        this.ventas = response.data;
                    }).catch(error => {
                        console.log(error);
                    });
            },
            listarDetalles(id){
                axios.get('api/Ventas/ListarDetalles/' + id)
                    .then(response => {
                        this.detalles = response.data;
                    }).catch(error => {
                        console.log(error);
                    });
            },
            verDetalles(item){
                this.limpiar();
                this.tipo_comprobante = item.tipo_comprobante;
                this.serie_comprobante = item.serie_comprobante;
                this.num_comprobante = item.num_comprobante;
                this.idcliente = item.idcliente;
                this.impuesto = item.impuesto;
                this.listarDetalles(item.idventa);
                this.verNuevo = 1;
                this.verDet = 1;
            },
            select() {
                axios.get('api/Personas/SelectClientes').then( res => {
                    this.clientes = res.data.map( cliente => (
                        { text: cliente.nombre, value: cliente.idpersona }
                    ));
                }).catch(err => {
                    console.log(err)
                });
            },
            limpiar(){
                this.id = "";
                this.idcliente = "";
                this.tipo_comprobante = "";
                this.serie_comprobante = "";
                this.num_comprobante = "";
                this.impuesto = "18";
                this.codigo = "";
                this.detalles = [];
                this.total = 0;
                this.totalImpuesto = 0;
                this.totalParcial = 0;
                this.verDet = 0;
            }
        }
    }
</script>

<style>
    #factura {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 16px ;
    }

    #logo {
        float: left;
        margin-left: 2%;
        margin-right: 2%;
    }
    #imagen {
        width: 100px;
    }

    #fact {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }   

    #datos {
        float: left;
        margin-top: 0%;
        margin-left: 2%;
        margin-right: 2%;
        /*text-align: justify;*/
    }

    #encabezado {
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
    }

    section {
        clear: left;
    }

    #cliente {
        text-align: left;
    }

    #facliente {
        width: 40%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 15px;
    }

    #fa {
        color: #FFFFFF;
        font-size: 14px;
    }

    #facarticulo {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }

    #facarticulo thead {
        padding: 20px;
        background: #2183E3;
        text-align: center;
        border-bottom: 1px solid #FFFFFF;
    }

    #gracias {
        text-align: center;
    }
</style>