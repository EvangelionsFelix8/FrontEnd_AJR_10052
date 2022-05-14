<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Transaksi </h3>

        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <!-- <v-btn color="success" dark @click="dialog = true"> Tambah Transaksi </v-btn> -->
            </v-card-title>
        </v-card>
        
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="transaksis" :search="search">
                <template v-slot:[`item.status_transaksi`]="{item}">
                    <span v-if="item.status_transaksi == 'Menunggu Verifikasi'"><v-chip label color="indigo lighten-4" text-color="indigo darken-4"><strong>Menunggu Verifikasi</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'On Progress'"><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>On Progress</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'"><v-chip label color="blue lighten-4" text-color="blue darken-4"><strong>Sudah Bayar, Menunggu Verifikasi</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'Batal'"><v-chip label color="pink lighten-4" text-color="pink darken-4"><strong>Batal</strong></v-chip></span>
                    <span v-else><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Sudah lunas (Selesai)</strong></v-chip> </span>
                </template>
                <template v-slot:[`item.actions`]= "{ item }">
                    <v-menu>
                        <template v-slot:activator="{ on: menu, attrs }">
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                                <v-icon dark color="black" center> mdi-dots-vertical </v-icon> </v-btn>
                            </template>
                            <span>Click me!</span>
                            </v-tooltip>
                        </template>
                        <v-list>
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="detailScreen(item)"> Detail </v-btn></v-list-item-title>
                            <!-- <v-list-item-title><v-btn style="min-width: 100px;" small @click="editHandler(item)"> Edit </v-btn></v-list-item-title> -->
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="batalHandler(item)"> Batal </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="verifyBerkasHandler(item)"> Verifikasi </v-btn></v-list-item-title>
                            <!-- <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_transaksi)"> Delete </v-btn></v-list-item-title> -->
                        </v-list>
                    </v-menu>
                   
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogDetail" persistent max-width="700px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-card-title style="color: white;">
                        DETAIL TRANSAKSI ({{this.data.id_transaksi}})
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-icon color="white" @click="cancel">
                        mdi-close-thick
                    </v-icon>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <v-card-text style="text-align: center; font-size: 20px;" class="black--text">Tanggal Transaksi <span style="margin-left: 6px;"> : </span><strong> {{this.data.tanggal_transaksi}} </strong> </v-card-text>
                        <v-row>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Mulai <span> : </span> {{this.data.tanggal_mulai}}</v-card-text>
                            </v-col>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Selesai <span> : </span> {{this.data.tanggal_selesai}}</v-card-text>
                            </v-col>
                        </v-row>
                        <v-card-text class="black--text">Durasi <span style="margin-left: 80px;"> : </span> 
                            <span v-if="Difference_In_Days > 1">{{Difference_In_Days}} Hari</span>
                            <span v-else>0 Hari</span>
                        </v-card-text>
                        <v-card-text class="black--text">Tanggal Kembali <span style="margin-left: 15px;"> : </span> 
                            <span v-if="this.data.tanggal_pengembalian != null">
                                {{this.data.tanggal_pengembalian}}
                                <span v-if="this.data.tanggal_pengembalian > this.data.tanggal_selesai">
                                    <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Terlambat</strong></v-chip>
                                </span>
                            </span>
                            <span v-else> - </span>
                        </v-card-text>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> CUSTOMER </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama</v-card-text>
                                <v-card-text class="black--text">Nomor Telepon</v-card-text>
                                <v-card-text class="black--text">Status Berkas</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.nama_customer}}</v-card-text>
                                <v-card-text class="black--text">: {{this.data.no_telp_customer}}</v-card-text>
                                <v-card-text class="black--text">: 
                                   <span v-if="this.data.status_berkas == 'Verified'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                                    <span v-else-if="this.data.status_berkas == 'Not Verified'"><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Not Verified</strong></v-chip> </span>
                                    <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Verified! must with driver</strong></v-chip></span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> MOBIL </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Mobil</v-card-text>
                                <v-card-text class="black--text">Harga Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.nama_mobil}}</v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.harga_sewa_mobil > 1">{{this.data.harga_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_mobil > 1">{{this.data.total_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> DRIVER </strong> </span>

                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Driver</v-card-text>
                                <v-card-text class="black--text">Tarif Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.nama_driver === ''"> - </span>
                                    <span v-else> {{this.data.nama_driver}} </span>
                                </v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.tarif_sewa_driver > 1">{{this.data.tarif_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_driver > 1">{{this.data.total_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> PROMO </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Jenis Promo</v-card-text>
                                <v-card-text class="black--text">Diskon Promo</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.jenis_promo}}</v-card-text>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.besar_diskon_promo > 1">{{this.data.besar_diskon_promo}}%</span>
                                    <span v-else>0%</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8" >
                                <v-card-text class="black--text"></v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp
                                    <span v-if="(this.data.total_harga - this.data.total_denda) > 1">{{(this.data.total_harga - this.data.total_denda).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="8">
                                <v-card-text class="black--text">Denda Mobil </v-card-text>
                                <v-card-text class="black--text">Denda Driver </v-card-text>
                                <v-card-text class="black--text">Diskon </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_mobil > 1">{{this.data.biaya_eksten_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_driver > 1">{{this.data.biaya_eksten_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                 <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.potongan_promo > 1">({{this.data.potongan_promo.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}})</span>
                                    <span v-else>( 0 )</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8">
                                <v-card-text style="font-size: 18px;" class="black--text">
                                    <strong>
                                        Total Harga
                                    </strong>
                                </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text style="font-size: 18px;" class="black--text"><strong> Rp </strong>
                                    <span v-if="(this.data.total_harga - this.data.potongan_promo) > 1">
                                        <strong>
                                            {{(this.data.total_harga - this.data.potongan_promo).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}
                                        </strong>
                                    </span>
                                    <span v-else><strong>0</strong></span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Metode Bayar</v-card-text>
                                <v-card-text v-if="this.data.metode_pembayaran != 'Cash'" class="black--text">Bukti Bayar</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: <strong> {{this.data.metode_pembayaran}} </strong></v-card-text>
                                <v-card-text v-if="this.data.metode_pembayaran != 'Cash'" class="black--text">:</v-card-text>
                            </v-col>
                        </v-row>
                        <v-img v-if="this.data.metode_pembayaran != 'Cash'" :src="$baseUrl+'/storage/'+this.data.bukti_bayar" height="575" width="575px" style="object-fit:cover; margin-left: 15px;"/>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- <v-dialog v-model="dialogDetailPembayaran" persistent max-width="400px">
            <v-card>
                <v-app-bar color="#00396c" style="margin-bottom: 15px;">
                    <v-card-title style="color: white;">
                        DETAIL PEMBAYARAN
                    </v-card-title>
                </v-app-bar>

                <v-card-text style="font-size: 20px;" class="black--text">
                    Metode Pembayaran : <strong> {{this.data.metode_pembayaran}} </strong>
                </v-card-text>
                <v-card-text style="font-size: 20px;" class="black--text">
                    Bukti Bayar : 
                    <v-img :src="$baseUrl+'/storage/'+this.data.bukti_bayar" height="350px" width="350px" style="object-fit:cover"/>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="blue darken-4" text @click="dialogDetailPembayaran = false"> Back </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <!-- <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-toolbar color="#00396c">
                    <v-card-title style="margin-left: 200px">
                        <span class="h6, white--text">{{ formTitle }} transaksi</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-text-field :rules="messageRules" v-model="form.nama_transaksi" label="Nama transaksi" required></v-text-field>
                            <v-textarea :rules="messageRules" v-model="form.alamat_transaksi" label="Alamat transaksi" required></v-textarea>
                            <v-text-field :rules="messageRules" v-model="form.no_telp_transaksi" label="No. Telp transaksi" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.no_ktp_transaksi" label="No. KTP transaksi" required></v-text-field>
                            <v-select :rules="messageRules" :items="statustransaksi" v-model="form.isAktif" label="Status transaksi" item-value="value" item-text="text"></v-select>
                        </v-form>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda Yakin Ingin menghapus transaksi ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <!-- <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogVerifikasi" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda ingin Verifikasi Transaksi ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogVerifikasi = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="verifyBerkas"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBatal" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda ingin Membatalkan Transaksi ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogBatal = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="batal"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.visible" auto-height :color="snackbar.color" :multi-line="snackbar.mode === 'multi-line'" :timeout="snackbar.timeout" :top="snackbar.position === 'bottom'">
            <v-layout align-center pr-4>
                <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
                <v-layout column>
                <div>
                    <strong>{{ snackbar.title }}</strong>
                </div>
                <div>{{ error_message }}</div>
                </v-layout>
            </v-layout>
            <v-btn v-if="snackbar.timeout === 0" icon @click="snackbar.visible = false">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbar1" :color="color" timeout="2000" bottom>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message, index) in errorArray" :key="index">
                    {{ error_message }}
                </div>
            </div>
        </v-snackbar>

    </v-main>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                dialogDetailPembayaran: false,
                dialogDetail: false,
                inputType: 'Tambah',
                load: false,
                snackbar1: false,
                snackbar: {
                    color: null,
                    icon: null,
                    mode: null,
                    position: "bottom",
                    timeout: 2000,
                    title: null,
                    visible: false
                },
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogVerifikasi: false,
                dialogBatal: false,
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                headers: [
                    { text: "Nomor Transaksi", value: 'id_transaksi' },
                    { text: "Nama Customer", value: 'nama_customer' },
                    // { text: "Nama Mobil", value: 'nama_mobil' },
                    // { text: "Nama Driver", value: 'nama_driver' },
                    // { text: "Promo", value: 'kode_promo' },
                    { text: "Tanggal Transaksi", value: 'tanggal_transaksi' },
                    { text: "Mulai Sewa", value: 'tanggal_mulai' },
                    { text: "Selesai Sewa", value: 'tanggal_selesai' },
                    { text: "Tanggal Kembali", value: 'tanggal_pengembalian' },
                    { text: "Status transaksi", value: 'status_transaksi' },
                    { text: "Action", value: 'actions' },
                ],
                transaksi: new FormData,
                transaksis: [
                ],
                customers: [],
                promos: [],
                form: {
                    id_driver: null,
                    nama_customer: null,
                    id_customer: null,
                    id_mobil: null,
                    id_pegawai: null,
                    id_promo: 0,
                    tanggal_transaksi: null,
                    tanggal_mulai: null,
                    tanggal_pengembalian: null,
                    tanggal_selesai: null,
                    status_transaksi: null,
                    metode_pembayaran: null,
                    bukti_bayar: null,
                    total_harga: null,
                    total_sewa_mobil: null,
                    total_sewa_driver: null,
                    total_denda: null,
                    potongan_promo: null,
                    rating_driver: null,
                    rating_ajr: null,
                    jenis_promo: null,
                },
                data: {
                    id_driver: null,
                    id_customer: null,
                    nama_customer: null,
                    id_mobil: null,
                    id_pegawai: null,
                    id_promo: 0,
                    tanggal_transaksi: null,
                    tanggal_mulai: null,
                    tanggal_pengembalian: null,
                    tanggal_selesai: null,
                    status_transaksi: null,
                    metode_pembayaran: null,
                    bukti_bayar: null,
                    total_harga: null,
                    total_sewa_mobil: 0,
                    total_sewa_driver: 0,
                    total_denda: 0,
                    potongan_promo: null,
                    rating_driver: null,
                    rating_ajr: null,
                    harga_sewa_mobil : 0,
                    tarif_sewa_driver : 0,
                    nama_mobil : null,
                    nama_driver : null,
                    jenis_promo : null,
                    besar_diskon_promo : null,
                },
                deleteId: '',
                editId: '',
                Difference_In_Days: 0,
            };
        },
        methods: {
            // clear() {
            //     this.$refs.form.reset() // clear form login
            // },

            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            // Read Data transaksis
            readData() {
                var url = this.$api + '/transaksi';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transaksis = response.data.data;
                })
            },

            // readDataPromo() {
            //     var url = this.$api + '/promo';
            //     this.$http.get(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.promos = response.data.data;
            //     })
            // },

            // readDataCustomer() {
            //     var url = this.$api + '/customer';
            //     this.$http.get(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.customers = response.data.data;
            //     })
            // },

            // isAktifOn () {
            //     var url = this.$api + '/transaksibystatustransaksi';
            //     this.$http.get(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.transaksis = response.data.data;
            //     })
            // },

            // save(){
            //     this.transaksi.append('nama_transaksi', this.form.nama_transaksi);
            //     this.transaksi.append('alamat_transaksi', this.form.alamat_transaksi);
            //     this.transaksi.append('no_telp_transaksi', this.form.no_telp_transaksi);
            //     this.transaksi.append('no_ktp_transaksi', this.form.no_ktp_transaksi);
            //     this.transaksi.append('isAktif', this.form.isAktif);


            //     var url = this.$api + '/transaksi/'
            //     this.load = true;
            //     this.$http.post(url, this.transaksi, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token'),
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.snackbar = {
            //             color: "success",
            //             icon: "mdi-check-circle",
            //             mode: "multi-line",
            //             position: "top",
            //             timeout: 2000,
            //             title: "Success",
            //             visible: true
            //         };
            //         this.load = true;
            //         this.close();
            //         this.readData();
            //         this.resetForm();
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar1 = true;
            //         this.load = false;
            //     });
            // },

            // update() {
            //     let newData = {
            //         nama_transaksi: this.form.nama_transaksi,
            //         alamat_transaksi: this.form.alamat_transaksi,
            //         no_telp_transaksi: this.form.no_telp_transaksi,
            //         no_ktp_transaksi: this.form.no_ktp_transaksi,
            //         isAktif: this.form.isAktif
            //     };
            //     var url = this.$api + '/transaksi/' + this.editId;
            //     this.load = true;
            //     this.$http.put(url, newData, {
            //         headers: {
            //             'Authorization' : 'Bearer ' +localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.snackbar = {
            //             color: "success",
            //             icon: "mdi-check-circle",
            //             mode: "multi-line",
            //             position: "top",
            //             timeout: 2000,
            //             title: "Success",
            //             visible: true
            //         };
            //         this.load = false;
            //         this.close();
            //         this.readData();
            //         this.resetForm();
            //         this.inputType = 'Tambah';
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar1 = true;
            //         this.load = false;
            //     });
            // },

            // deleteData(){
            //     // Menghapus Data
            //     var url = this.$api + '/transaksi/' + this.deleteId;
            //     this.load = true;
            //     this.$http.delete(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' +localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.snackbar = {
            //             color: "success",
            //             icon: "mdi-check-circle",
            //             mode: "multi-line",
            //             position: "top",
            //             timeout: 2000,
            //             title: "Success",
            //             visible: true
            //         };
            //         this.load = false;
            //         this.close();
            //         this.readData();
            //         this.resetForm();
            //         this.inputType = "Tambah";
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.snackbar = {
            //             color: "error",
            //             icon: "mdi-alert-circle",
            //             mode: "multi-line",
            //             position: "top",
            //             timeout: 2000,
            //             title: "Error",
            //             visible: true
            //         };
            //         this.load = false;
            //     });
            // },

            // editHandler(item) {
            //     this.inputType = 'Ubah';
            //     this.editId = item.id_transaksi;
            //     this.form.nama_transaksi = item.nama_transaksi;
            //     this.form.alamat_transaksi = item.alamat_transaksi;
            //     this.form.no_telp_transaksi = item.no_telp_transaksi;
            //     this.form.no_ktp_transaksi = item.no_ktp_transaksi;
            //     this.form.isAktif = item.isAktif;
            //     this.dialog = true;
            // },

            // deleteHandler(id) {
            //     this.deleteId = id;
            //     this.dialogConfirm = true;
            // },

            batalHandler(item){
                this.data.id_transaksi = item.id_transaksi;
                this.data.status_transaksi = item.status_transaksi;
                this.dialogBatal = true;
            },

            batal(){
                console.log(this.data.status_transaksi)
                if(this.data.status_transaksi == 'On Progress' || this.data.status_transaksi == 'Menunggu Verifikasi'){
                    this.transaksi.append('status_transaksi', 'Batal');
                    var url = this.$api + '/bataltransaksi/' + this.data.id_transaksi;
                    this.load = true;
                    this.$http.post(url, this.transaksi, {
                        headers: {
                            'Authorization' : 'Bearer ' +localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.snackbar = {
                            color: "success",
                            icon: "mdi-check-circle",
                            mode: "multi-line",
                            position: "top",
                            timeout: 2000,
                            title: "Success",
                            visible: true
                        };
                        this.load = false;
                        this.close();
                        this.readData();
                        this.resetForm();
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    });
                }
                else {
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Transaksi Tidak bisa Dibatalkan';
                    if(this.data.status_transaksi == 'Batal'){
                        this.error_message = 'Transaksi Sudah Dibatalkan';
                    }
                }
            },

            verifyBerkasHandler(item){
                this.editId = item.id_transaksi;
                this.form.status_transaksi = item.status_transaksi;
                this.dialogVerifikasi = true;
            },

            verifyBerkas(){
                if(this.form.status_transaksi == 'Menunggu Verifikasi' || this.form.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'){
                    if(this.form.status_transaksi == 'Menunggu Verifikasi'){
                        this.transaksi.append('status_transaksi', 'On Progress');
                    } else if(this.form.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'){
                        this.transaksi.append('status_transaksi', 'Sudah lunas (Selesai)');
                    }
                    this.transaksi.append('id_pegawai', '4');
                    var url = this.$api + '/setStatus/' + this.editId;
                    this.load = true;
                    this.$http.post(url, this.transaksi, {
                        headers: {
                            'Authorization' : 'Bearer ' +localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.snackbar = {
                            color: "success",
                            icon: "mdi-check-circle",
                            mode: "multi-line",
                            position: "top",
                            timeout: 2000,
                            title: "Success",
                            visible: true
                        };
                        this.load = false;
                        this.close();
                        this.readData();
                        this.resetForm();
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    });
                }
                else{
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    if(this.form.status_transaksi == 'Sudah lunas (Selesai)'){
                        this.error_message = 'Transaksi Sudah Selesai';
                    }
                    else if(this.form.status_transaksi == 'On Progress'){
                        this.error_message = 'Transaksi On Progress';
                    }
                    this.dialogVerifikasi = false;
                }
            },

            detailScreen(item){
                this.data.id_transaksi = item.id_transaksi;
                this.data.id_promo = item.id_promo;
                var datediff11 = Date.parse(item.tanggal_selesai) - Date.parse(item.tanggal_mulai)
                this.Difference_In_Days = datediff11 / (1000 * 3600 * 24);
                this.data.nama_customer = item.nama_customer;
                this.data.no_telp_customer = item.no_telp_customer;
                this.data.status_berkas = item.status_berkas;
                this.data.tanggal_transaksi = item.tanggal_transaksi;
                this.data.tanggal_pengembalian = item.tanggal_pengembalian;
                this.data.tanggal_mulai = item.tanggal_mulai;
                this.data.tanggal_selesai = item.tanggal_selesai;
                this.data.nama_mobil = item.nama_mobil; 
                this.data.total_sewa_mobil = item.total_sewa_mobil;
                this.data.harga_sewa_mobil = item.harga_sewa_mobil;
                this.data.nama_driver = item.nama_driver;
                this.data.total_sewa_driver = item.total_sewa_driver;
                this.data.tarif_sewa_driver = item.tarif_sewa_driver;
                this.data.total_harga = item.total_harga;
                this.data.jenis_promo = item.jenis_promo;
                this.data.besar_diskon_promo = item.besar_diskon_promo;
                this.data.potongan_promo = item.potongan_promo;
                this.data.bukti_bayar = item.bukti_bayar;
                this.data.metode_pembayaran = item.metode_pembayaran;
                this.data.total_denda = item.total_denda;
                this.data.biaya_eksten_mobil = 0;
                this.data.biaya_eksten_driver = 0;
                this.data.total_denda = 0;
                if(this.data.tanggal_pengembalian > this.data.tanggal_selesai){
                    this.data.biaya_eksten_mobil = item.harga_sewa_mobil;
                    this.data.biaya_eksten_driver = item.tarif_sewa_driver;
                    this.data.total_denda = this.data.biaya_eksten_mobil + this.data.biaya_eksten_driver;
                    this.data.total_harga = this.data.total_harga + this.data.total_denda;
                }
                this.dialogDetail = !this.dialogDetail;
                if(this.dialogDetail == false){
                    this.resetForm();
                }
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogVerifikasi = false;
                this.dialogDetail = false;
                this.dialogBatal = false;
                this.readData();
                // this.clear();
            },

            cancel() {
                this.resetForm();
                this.readData();
                // this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.dialogDetail = false;
                this.dialogBatal = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    id_driver: null,
                    nama_customer: null,
                    id_customer: null,
                    id_mobil: null,
                    id_pegawai: null,
                    id_promo: null,
                    tanggal_transaksi: null,
                    tanggal_mulai: null,
                    tanggal_pengembalian: null,
                    tanggal_selesai: null,
                    status_transaksi: null,
                    metode_pembayaran: null,
                    bukti_bayar: null,
                    total_harga: null,
                    total_sewa_mobil: null,
                    total_sewa_driver: null,
                    total_denda: null,
                    potongan_promo: null,
                    rating_driver: null,
                    rating_ajr: null,
                };
            },

            
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
            // this.readDataPromo();
            // this.readDataCustomer();
        },
    };
</script>