<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Transaksi Baru </h3>

        <v-card>
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <template v-for="n in steps">
                    <v-stepper-step
                        :key="`${n}-step`"
                        :complete="e1 > n"
                        :step="n"
                        editable
                    >
                    
                        <!-- Step {{ n }} -->
                        <span v-if="n === 1">
                            Pilih Mobil<span>: <strong>{{temp_nama_mobil}}</strong></span>
                        </span>
                        <span v-if="n === 2">
                            Pilih Driver <span>: <strong>{{temp_nama_driver}}</strong></span>
                            <small>Optional</small>
                        </span>
                        <span v-if="n === 3">
                            Pilih Promo <span>: <strong>{{temp_jenis}}</strong></span> 
                            <small>Optional</small
                        ></span>
                        <span v-if="n === 4">Tanggal Pinjam</span>
                        <!-- <span v-if="n === 5">Pilih Driver</span> -->
                    </v-stepper-step>

                    <v-divider
                        v-if="n !== steps"
                        :key="n"
                    ></v-divider>
                    </template>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content
                    v-for="n in steps"
                    :key="`${n}-content`"
                    :step="n"

                    >
                    <v-card v-if="n === 2" class="mb-12" elevation="0">
                        <v-card-title> Pilihan Driver yang Tersedia </v-card-title>
                        <v-row>
                        <v-col md="3" :items="drivers" v-for="(driver, i) in drivers" :key="driver.id_driver">
                            <v-card class="white--text" color="#00396c">
                                <v-avatar style="margin-left: 35%; margin-top: 5%" height="100px" width="100px">
                                    <v-img @click="OverlayPreview(item)" :src="$baseUrl+'/storage/'+driver.url_foto_driver" height="200px" width="300px" style="object-fit:cover;"/> 
                                </v-avatar>
                                <v-card-title class="justify-center">
                                    {{driver.nama_driver}}
                                </v-card-title>
                                <v-row align="center" class="justify-center" style="margin-bottom: 10px;">
                                    <v-rating
                                    :value="rata2s[i].rata_rating" color="amber" dense half-increments readonly size="14"></v-rating>
                                    <div class="white--text ms-4" style="margin-left: 15px; font-size: 15px;">
                                        <span v-if="rata2s[i].rata_rating != null">{{rata2s[i].rata_rating}}</span>
                                        <span v-else>0</span>
                                    </div>
                                </v-row>
                                <v-card-subtitle class="white--text">Tarif Sewa<span style="margin-left: 13%"> : Rp {{driver.tarif_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}} </span></v-card-subtitle>
                                <v-card-text class="white--text">
                                    Bahasa Inggris : 
                                    <span v-if="driver.isEnglish == 1">Bisa</span>
                                    <span v-if="driver.isEnglish == 2">Tidak Bisa</span>
                                </v-card-text>
                                <v-card-text class="white--text"><v-icon color="white"> mdi-phone </v-icon> {{driver.no_telp_driver}}</v-card-text>
                                <v-btn class="white--text" color="yellow darken-4" style="margin-left: 40%; margin-bottom: 5%;" small @click="pilihDriver(driver)">Pilih</v-btn>
                            </v-card>
                        </v-col>
                        </v-row>
                    </v-card>

                    <v-card v-if="n === 1" class="mb-12">
                        <v-card-title> Pilihan Mobil yang Tersedia </v-card-title>
                        <v-row>
                        <v-col md="3" :items="mobils" v-for="mobil in mobils" :key="mobil.id_mobil">
                            <v-card class="white--text" color="#00396c">
                                <!-- <v-avatar style="margin-left: 30%; margin-top: 5%" height="100px" width="100px"> -->
                                    <v-card  class="white">
                                        <v-img @click="OverlayPreview(item)" :src="$baseUrl+'/storage/'+mobil.url_foto_mobil" height="155px" width="300px"/> 
                                    </v-card>
                                <!-- </v-avatar> -->
                                <v-card-title class="justify-center">
                                    {{mobil.nama_mobil}}
                                </v-card-title>
                                <v-card-text class="white--text">Harga Sewa <span style="margin-left: 1%"> : </span> Rp {{mobil.harga_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</v-card-text>
                                <v-card-actions>
                                    <v-btn color="blue lighten-2" text >
                                        More Info
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn icon @click="show = !show" color="white">
                                        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                    </v-btn>
                                </v-card-actions>

                                <v-expand-transition>
                                <div v-show="show">
                                    <v-divider></v-divider>
                                    <v-card-text class="white--text">Tipe Mobil <span style="margin-left: 7%">  : </span> {{mobil.tipe_mobil}}</v-card-text>
                                    <v-card-text class="white--text">Bahan Bakar <span> : </span> {{mobil.jenis_bahan_bakar}}</v-card-text>
                                    <v-card-text class="white--text">Kapasitas <span style="margin-left: 8%"> : </span> {{mobil.kapasitas_penumpang}} Orang</v-card-text>
                                    <v-card-text class="white--text">Fasilitas <span style="margin-left: 11%"> : </span> {{mobil.fasilitas}}</v-card-text>
                                </div>
                                </v-expand-transition>
                                
                                <v-btn class="white--text" color="yellow darken-4" style="margin-left: 40%; margin-bottom: 5%;" small @click="pilihMobil(mobil)">Pilih</v-btn>
                            </v-card>
                        </v-col>
                        </v-row>
                    </v-card>

                    <!-- PROMO -->
                    <v-card v-if="n === 3" class="mb-12" elevation="0">
                        <v-row>
                        <v-col md="3" :items="promos" v-for="promo in promos" :key="promo.id_promo">
                            <v-card class="white--text" color="#00396c" outlined>
                                <v-card-title class="justify-center">
                                    {{promo.jenis_promo}}
                                </v-card-title>
                                <v-card-subtitle  class="white--text" style="text-align: center;">
                                    Diskon {{promo.besar_diskon_promo}}%
                                </v-card-subtitle>
                                <v-card-text style="text-align: center;" class="white--text">{{promo.keterangan}}</v-card-text>
                                <!-- <v-row justify="space-around"> -->
                                    <v-btn
                                        class="white--text"
                                        color="yellow darken-4"
                                        style="margin-bottom: 10px; margin-left: 40%"
                                        small @click="pilihPromo(promo)">
                                        Pilih
                                    </v-btn>
                                <!-- </v-row> -->
                            </v-card>
                        </v-col>
                        </v-row>
                    </v-card>

                    <v-card v-if="n === 4" class="mb-6" elevation="0">
                        <v-row>
                            <v-col>
                                <v-text-field :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                    clearable type="date" v-model="temp_mulai" label="Tanggal Mulai Pinjam" required>
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field id="time_mulai"
                                    clearable type="time" v-model="temp_mulai_waktu" label="Waktu Mulai Pinjam" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-col>
                                <v-text-field :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                    clearable type="date" v-model="temp_selesai" label="Tanggal Selesai Pinjam" required>
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field id="time_selesai"
                                    clearable type="time" v-model="temp_selesai_waktu" label="Waktu Selesai Pinjam" required>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card>

                    <v-btn v-if="n === 3 || n === 2" @click="clearSelected(n)">
                        Clear
                    </v-btn>
                    <v-btn v-if="n === 3 || n ===2 || n === 1" color="primary" @click="nextStep(n)">
                        Continue
                    </v-btn>

                    <v-btn v-if="n === 4" class="white--text" color="yellow darken-4" @click="showPreview()">
                        Save
                    </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-card>

        <v-dialog v-model="dialogTransaksi" persistent max-width="700px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-card-title style="color: white;">
                        RINCIAN TRANSAKSI ANDA
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-icon color="white" @click="cancel">
                        mdi-close-thick
                    </v-icon>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <v-card-text class="black--text">Tanggal Mulai <span style="margin-left: 16px;"> : </span> {{merge_mulai_sewa}}</v-card-text>
                        <v-card-text class="black--text">Tanggal Selesai <span style="margin-left: 5px;"> : </span> {{merge_selesai_sewa}}</v-card-text>
                        <v-card-text class="black--text">Durasi <span style="margin-left: 63px;"> : </span> 
                            <span v-if="Difference_In_Days > 1">{{Difference_In_Days}} Hari</span>
                            <span v-else>0 Hari</span>
                        </v-card-text>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> MOBIL </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Mobil</v-card-text>
                                <v-card-text class="black--text">Harga Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{temp_nama_mobil}}</v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="temp_sewa_mobil > 1">{{temp_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
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
                                    <span v-if="totalSewaMobil > 1">{{totalSewaMobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
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
                                    <span v-if="temp_nama_driver === ''"> - </span>
                                    <span v-else> {{temp_nama_driver}} </span>
                                </v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="temp_sewa_driver > 1">{{temp_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
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
                                    <span v-if="totalSewaDriver > 1">{{totalSewaDriver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
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
                                <v-card-text class="black--text">: {{temp_jenis}}</v-card-text>
                                <v-card-text class="black--text">:
                                    <span v-if="potonganPromo > 1">{{potonganPromo}}%</span>
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
                                    <span v-if="totalHarga > 1">{{totalHarga.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="8">
                                <v-card-text class="black--text">Diskon </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="totalPromo > 1">({{totalPromo.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}})</span>
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
                                    <span v-if="hargaTotalsetelahPromo > 1">
                                        <strong>
                                            {{hargaTotalsetelahPromo.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}
                                        </strong>
                                    </span>
                                    <span v-else><strong>0</strong></span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn> -->
                    <v-btn v-if="this.$route.params.items != null" class="white--text" color="#00396c" @click="dialogConfirmUpdate = true"> EDIT </v-btn>
                    <v-btn v-else class="white--text" color="#00396c" @click="save"> SEWA </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmUpdate" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Apakah Kamu Yakin ingin Mengupdate Data Transaksi Kamu?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirmUpdate = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="getValueRating"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRatingAJR" persistent max-width="400px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-spacer></v-spacer>
                        <v-card-title style="color: white;">
                            APAKAH ANDA PUAS?
                        </v-card-title>
                    <v-spacer></v-spacer>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <div class="red" align="center" style="top: 50%; ">
                            <v-img :src="logo" height="200" width="200" style="object-fit:cover;left: 25%; position: absolute; opacity: 0.3;"></v-img>
                        </div>
                        <v-rating
                            background-color="warning"
                            v-model="rating"
                            color="warning"
                            size="48"
                            value="3"
                        ></v-rating>
                        <v-card-text style="text-align: center; color: black; font-size: 15px;position: relative;">
                            <strong>
                                Penilaian yang kalian berikan akan sangat berguna bagi pelayanan kami kedepannya
                            </strong>
                        </v-card-text>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="#00396c" @click="getValueRating()">Save</v-btn>
                    <v-spacer></v-spacer>
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
                logo: require('@/assets/logo_ajr.png'),
                e1: 1,
                steps: 4,
                show: false,
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
                colorbtn: '',
                count: 0,
                countDone: 0,
                temp_sisa: '',
                temp_jenis: '',
                temp_nama_driver: '',
                temp_nama_mobil: '',
                temp_mulai: '',
                temp_mulai_waktu: '',
                temp_selesai: '',
                temp_selesai_waktu: '',
                merge_mulai_sewa: '',
                merge_selesai_sewa: '',
                temp_sewa_mobil: 0,
                temp_sewa_driver: 0,
                totalHarga: 0,
                totalSewaMobil: 0,
                totalSewaDriver: 0,
                totalPromo: 0,
                potonganPromo: 0,
                hargaTotalsetelahPromo: 0,
                Difference_In_Days: 0,
                temp_id_transk: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogTransaksi: false,
                dialogRatingAJR: false,
                dialogConfirmUpdate: false,
                rating: 0,
                drawer: false,
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                headers: [
                    // { text: "", value: 'url_foto_mobil' },
                    { text: "Nama Mobil", value: 'nama_mobil', width: '150px' },
                    { text: "Tipe Mobil", value: 'tipe_mobil' },
                    { text: "Transmisi", value: 'jenis_transmisi' },
                    { text: "Bahan Bakar", value: 'jenis_bahan_bakar' },
                    { text: "Warna ", value: 'warna_mobil' },
                    { text: "Volume Bahan Bakar", value: 'volume_bahan_bakar' },
                    { text: "Kapasitas", value: 'kapasitas_penumpang' },
                    { text: "Harga Mobil", value: 'harga_sewa_mobil', width: '125px' },
                    // { text: "Plat Nomor", value: 'plat_nomor' },
                    { text: "Fasilitas Mobil", value: 'fasilitas', width: '150px' },
                    // { text: "Mulai Kontrak Mobil", value: 'mulai_kontrak' },
                    // { text: "Selesai Kontrak Mobil", value: 'selesai_kontrak' },
                    // { text: "Tanggal servis Terakhir", value: 'tanggal_servis_terakhir' },
                    { text: "Kategori Aset", value: 'kategori_aset' },
                    { text: "Status Mobil", value: 'status_ketersediaan' },
                    // { text: "Sisa Hari Kontrak", value: 'sisa_hari'},
                    { text: "Action", value: 'actions' },
                ],

                transaksi: new FormData,
                promos: [],
                drivers: [],
                mobils: [],
                customers: [],
                transaksis: [],
                transaksis_pass: [],
                rata2s: [],
                form: {
                    id_mitra: [],
                    nama_mobil: null,
                    tipe_mobil: null,
                    jenis_transmisi: null,
                    jenis_bahan_bakar: null,
                    warna_mobil: null,
                    volume_bahan_bakar: null,
                    kategori_aset: null,
                    kapasitas_penumpang: null,
                    harga_sewa_mobil: null,
                    plat_nomor: null,
                    nomor_stnk: null,
                    status_ketersediaan: null,
                    url_foto_mobil: null,
                    fasilitas: null,
                    mulai_kontrak: [],
                    selesai_kontrak: [],
                    tanggal_servis_terakhir: null,
                },
                data: {
                    id_mitra: [],
                    nama_mobil: null,
                    tipe_mobil: null,
                    jenis_transmisi: null,
                    jenis_bahan_bakar: null,
                    warna_mobil: null,
                    volume_bahan_bakar: null,
                    kategori_aset: null,
                    kapasitas_penumpang: null,
                    harga_sewa_mobil: null,
                    plat_nomor: null,
                    nomor_stnk: null,
                    status_ketersediaan: null,
                    url_foto_mobil: null,
                    fasilitas: null,
                    mulai_kontrak: null,
                    selesai_kontrak: null,
                    tanggal_servis_terakhir: null,
                },
                deleteId: '',
                editId: '',
                selectedId: '',
                selectedId_driver: '',
                selectedId_mobil: '',
                previousSelectedId: '',
                previousSelectedId_driver: '',
                previousSelectedId_mobil: '',
                id_trans_coba: '',
            };
        },

        // STEPPERS
        watch: {
            steps (val) {
                if (this.e1 > val) {
                    this.e1 = val
                }
            },
        },
        methods: {

            gotoOnProgress(){
                this.$router.push({
                    name: 'OnProgressCustomer',
                });
            },

            getValueRating(){
                // this.transaksi.append('rating_ajr', this.rating);
                // this.transaksi.append('id_driver', localStorage.getItem('id'));
                if(this.customers.no_sim == null && this.selectedId_driver == ''){
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Anda Belum Memiliki SIM, silakan Sewa dengan driver';
                }
                else{
                    this.transaksi.append('id_customer', sessionStorage.getItem('id_customer'));
                    if(this.selectedId_driver !== null){
                        this.transaksi.append('id_driver', this.selectedId_driver);
                        console.log('id_driver', this.selectedId_driver);
                    }
                    else{
                        this.transaksi.append('id_driver', []);
                        console.log('else ', this.selectedId_driver);
                    }
                    // else{
                    //     this.transaksi.append('id_driver', '');
                    //     console.log('else ', this.selectedId);
                    // }

                    if(this.selectedId > 0){
                        this.transaksi.append('id_promo', this.selectedId);
                       console.log('if promo', this.selectedId);
                    }
                    else{
                        this.transaksi.append('id_promo', '');
                        console.log('else promo', this.selectedId);
                    }
    
                    this.transaksi.append('id_mobil', this.selectedId_mobil);
                    this.transaksi.append('tanggal_mulai', this.merge_mulai_sewa);
                    this.transaksi.append('tanggal_selesai', this.merge_selesai_sewa);
                    this.transaksi.append('total_sewa_mobil', this.totalSewaMobil);
                    this.transaksi.append('total_sewa_driver', this.totalSewaDriver);
                    this.transaksi.append('total_harga', this.totalHarga);
                    this.transaksi.append('potongan_promo', this.totalPromo);
                    var url;
                    if(this.$route.params.items != null){
                        url = this.$api + '/transaksi/' + this.id_trans_coba
                        this.load = true;
                        this.$http.post(url, this.transaksi, {
                            headers: {
                                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                            }
                        }).then(response => {
                            this.error_message = response.data.data;
                            this.error_message = 'Berhasil Edit Transaksi Anda!';
                            this.snackbar = {
                                color: "success",
                                icon: "mdi-check-circle",
                                mode: "multi-line",
                                position: "top",
                                timeout: 2000,
                                title: "Success",
                                visible: true
                            };
                            this.dialogTransaksi = false;
                            this.gotoOnProgress();
                            this.resetData();
                        })
                        .catch(error => {
                            this.error_message = error.response.data.message;
                            this.color = "red";
                            this.snackbar1 = true;
                            this.load = false;
                        });
                    }else{
                        this.transaksi.append('rating_ajr', this.rating);
                        url = this.$api + '/transaksi'
                        this.load = true;
                        this.$http.post(url, this.transaksi, {
                            headers: {
                                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                            }
                        }).then(response => {
                            this.error_message = response.data.data;
                            this.error_message = 'Terimakasih Atas FeedBack Anda ';
                            this.snackbar = {
                                color: "success",
                                icon: "mdi-check-circle",
                                mode: "multi-line",
                                position: "top",
                                timeout: 2000,
                                title: "Success",
                                visible: true
                            };
                            this.dialogRatingAJR = false;
                            this.gotoOnProgress();
                            this.resetData();
                        })
                        .catch(error => {
                            this.error_message = error.response.data.message;
                            this.color = "red";
                            this.snackbar1 = true;
                            this.load = false;
                        });
                    }
                }
            },

            clearSelected(n){
                if(n === 3){
                    this.temp_jenis = '';
                    this.potonganPromo = 0;
                    this.selectedId = 'null';
                    this.previousSelectedId = null;
                }
                else if(n === 2){
                    this.temp_nama_driver = '';
                    this.temp_sewa_driver = 0;
                    this.selectedId_driver = [];
                    this.previousSelectedId_driver = null;
                }
            },

            pilihMobil(mobil){
                this.selectedId_mobil = mobil.id_mobil;
                this.temp_nama_mobil = mobil.nama_mobil;
                this.temp_sewa_mobil = mobil.harga_sewa_mobil;
                if(this.previousSelectedId_mobil === this.selectedId_mobil){
                    this.error_message = 'Anda Sudah Memilih Mobil ini';
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    
                }
                else{
                    this.error_message = 'Berhasil Memilih Mobil ' + mobil.nama_mobil;
                    this.snackbar = {
                        color: "success",
                        icon: "mdi-check-circle",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Success",
                        visible: true
                    };
                    this.previousSelectedId_mobil = this.selectedId_mobil;
                }
            },

            pilihDriver(driver){
                this.selectedId_driver = driver.id_driver;
                this.temp_nama_driver = driver.nama_driver;
                this.temp_sewa_driver = driver.tarif_sewa_driver;
                if(this.previousSelectedId_driver === this.selectedId_driver){
                    this.error_message = 'Anda Sudah Memilih Driver ini';
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                }
                else{
                    this.error_message = 'Berhasil Memilih Driver ' + driver.nama_driver;
                    this.snackbar = {
                        color: "success",
                        icon: "mdi-check-circle",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Success",
                        visible: true
                    };
                    this.previousSelectedId_driver = this.selectedId_driver;
                }
            },

            pilihPromo(promo){
                this.selectedId = promo.id_promo;
                this.temp_jenis = promo.jenis_promo;
                this.potonganPromo = promo.besar_diskon_promo;
                if(this.previousSelectedId === this.selectedId){
                    this.error_message = 'Anda Sudah Memilih Promo ini';
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                }
                else{
                    this.error_message = 'Berhasil Memilih Promo ' + this.temp_jenis;
                    this.snackbar = {
                        color: "success",
                        icon: "mdi-check-circle",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Success",
                        visible: true
                    };
                    this.previousSelectedId = this.selectedId;
                }
            },

            showPreview(){
                if(this.customers.status_berkas == 'Not Verified'){
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Akun Anda Belom di Verifikasi oleh CS, silakan Tunggu';
                }
                else{
                    var datediff11 = Date.parse(this.temp_selesai) - Date.parse(this.temp_mulai)
                    this.Difference_In_Days = datediff11 / (1000 * 3600 * 24)
                    this.totalSewaMobil = this.temp_sewa_mobil * this.Difference_In_Days;
                    this.totalSewaDriver = this.temp_sewa_driver * this.Difference_In_Days;
                    this.totalHarga = this.totalSewaMobil + this.totalSewaDriver;
                    this.totalPromo = this.totalHarga * this.potonganPromo/100;
                    this.hargaTotalsetelahPromo = this.totalHarga - this.totalPromo;
                    var timeMulai = document.getElementById("time_mulai").value;
                    var timeSelesai = document.getElementById("time_selesai").value;
                    // this.merge_mulai_sewa = timeMulai+ ' ' + this.temp_mulai;
                    // this.merge_selesai_sewa = timeSelesai+ ' ' + this.temp_selesai;
                    this.merge_mulai_sewa = this.temp_mulai+ ' ' + timeMulai;
                    this.merge_selesai_sewa = this.temp_selesai+ ' ' + timeSelesai;
                    this.dialogTransaksi = true;
                }
            },

            // STEPPERS
            nextStep (n) {
                if (n === this.steps) {
                    this.dialogTransaksi = true;
                } else {
                    this.e1 = n + 1
                }
            },

            clear(){
                this.$refs.form.reset();
            },

            isMitra(){
                // this.clear();
                if(this.form.kategori_aset == 1){
                    return true;
                }
                return false;
            },

            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            
            // Read Data Mobils
            // readData() {
            //     var url = this.$api + '/mobil';
            //     this.$http.get(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.mobils = response.data.data;
            //     })
            // },

            readDataPromo() {
                var url = this.$api + '/showbystatuspromo';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promos = response.data.data;
                })
            },

            readDataRerataDriver() {
                var url = this.$api + '/getreratadriver';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.rata2s = response.data.data;
                })
            },
            
            readDataDriver() {
                var url = this.$api + '/showbystatusketersediaan';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            readDataMobil() {
                var url = this.$api + '/showbystatusmobil';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mobils = response.data.data;
                })
            },

            readDataCustomer() {
                var url = this.$api + '/customer/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            readDataTransaksi() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransaction/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transaksis = response.data.data;
                })
            },

            readDataBanyakTransaksi() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransaction/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.count = response.data.data;
                })
            },

            readDataTransaksiDone() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransactionDone/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.countDone = response.data.data;
                })
            },

            save(){
                if(this.customers.no_sim == null && this.selectedId_driver == ''){
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Anda Belum Memiliki SIM, silakan Sewa dengan driver';
                }else{
                        if(this.selectedId_mobil == ''){
                            this.error_message = 'Silakan Pilih Mobil yang Diinginkan';
                            this.snackbar = {
                                color: "error",
                                icon: "mdi-alert-circle",
                                mode: "multi-line",
                                position: "top",
                                timeout: 2000,
                                title: "Error",
                                visible: true
                            };
                        }
                        else if(this.temp_mulai == ''){
                            this.error_message = 'Pastikan Waktu Mulai Sewa Terisi';
                            this.snackbar = {
                                color: "error",
                                icon: "mdi-alert-circle",
                                mode: "multi-line",
                                position: "top",
                                timeout: 2000,
                                title: "Error",
                                visible: true
                            };
                        }
                        else if(this.temp_selesai == ''){
                            this.error_message = 'Pastikan Waktu Selesai Sewa Terisi';
                            this.snackbar = {
                                color: "error",
                                icon: "mdi-alert-circle",
                                mode: "multi-line",
                                position: "top",
                                timeout: 2000,
                                title: "Error",
                                visible: true
                            };
                        }
                        else{
                            if(this.$route.params.items != null){
                                this.error_message = 'Berhasil Edit Transaksi Anda';
                                this.snackbar = {
                                    color: "success",
                                    icon: "mdi-check-circle",
                                    mode: "multi-line",
                                    position: "top",
                                    timeout: 2000,
                                    title: "Success",
                                    visible: true
                                };
                                this.dialogTransaksi = false;
                            }
                            else{
                                this.error_message = 'Berhasil Menyewa, Silakan Tunggu Verifikasi Customer Service';
                                this.snackbar = {
                                    color: "success",
                                    icon: "mdi-check-circle",
                                    mode: "multi-line",
                                    position: "top",
                                    timeout: 2000,
                                    title: "Success",
                                    visible: true
                                };
                                this.dialogTransaksi = false;
                                this.dialogRatingAJR = true;
                            }
                        }
                }
            },

            goToTransaksi(){
                this.$router.push({
                    name: 'Transaksi',
                });
            },

            created(){
                if(this.$route.params.items != null){
                    var object = this.$route.params.items;
                    this.id_trans_coba = object.id_transaksi
                    if(this.id_trans_coba != null){
                        this.temp_mulai = object.tanggal_mulai.substring(0,10);
                        this.temp_selesai = object.tanggal_selesai.substring(0,10);
                        this.temp_mulai_waktu = object.tanggal_mulai.substring(11,19);
                        this.temp_selesai_waktu = object.tanggal_selesai.substring(11,19);
                    }
                    this.temp_sewa_mobil = object.harga_sewa_mobil;
                    console.log(this.id_trans_coba);
                    this.temp_sewa_driver = object.tarif_sewa_driver;
                    this.merge_mulai_sewa = object.tanggal_mulai;
                    this.merge_selesai_sewa = object.tanggal_selesai;
                    this.selectedId_mobil =  object.id_mobil;
                    this.selectedId =  object.id_promo;
                    this.selectedId_driver =  object.id_driver;
                    this.totalSewaMobil =  object.total_sewa_mobil;
                    this.totalSewaDriver =  object.total_sewa_driver;
                    this.totalHarga =  object.total_harga;
                    this.totalPromo =  object.potongan_promo;
                    this.potonganPromo = object.besar_diskon_promo;
                    this.temp_nama_mobil = object.nama_mobil;
                    this.temp_nama_driver = object.nama_driver;
                    this.temp_jenis = object.jenis_promo;
                }
            },

            update(){
                var object = this.$route.params.items;
                this.transaksi.append('id_customer', sessionStorage.getItem('id_customer'));
                if(this.selectedId_driver !== ''){
                    this.transaksi.append('id_driver', this.selectedId_driver);
                }
                else{
                    this.transaksi.append('id_driver', []);
                }
                
                if(this.selectedId !== ''){
                    this.transaksi.append('id_promo', this.selectedId);
                }
                else{
                    this.transaksi.append('id_promo', '');
                }
                this.transaksi.append('id_mobil', this.selectedId_mobil);
                this.transaksi.append('tanggal_mulai', this.merge_mulai_sewa);
                this.transaksi.append('tanggal_selesai', this.merge_selesai_sewa);
                this.transaksi.append('total_sewa_mobil', this.totalSewaMobil);
                this.transaksi.append('total_sewa_driver', this.totalSewaDriver);
                this.transaksi.append('total_harga', this.totalHarga);
                this.transaksi.append('potongan_promo', this.totalPromo);
                var url = this.$api + '/transaksi/' + object.id_transaksi
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.data;
                    this.error_message = 'Terimakasih Atas FeedBack Anda ';
                    this.snackbar = {
                        color: "success",
                        icon: "mdi-check-circle",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Success",
                        visible: true
                    };
                    this.dialogRatingAJR = false;
                    this.resetData();
                })
                .catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                console.log(this.inputType);
                this.editId = item.id_mobil;
                this.form.id_mitra = item.id_mitra;
                this.form.nama_mobil = item.nama_mobil;
                this.form.tipe_mobil = item.tipe_mobil;
                this.form.jenis_transmisi = item.jenis_transmisi;
                this.form.jenis_bahan_bakar = item.jenis_bahan_bakar;
                this.form.warna_mobil = item.warna_mobil;
                this.form.volume_bahan_bakar = item.volume_bahan_bakar;
                this.form.kategori_aset = item.kategori_aset;
                // fungsiTampilValueRadio(item);
                this.form.kapasitas_penumpang = item.kapasitas_penumpang;
                this.form.harga_sewa_mobil = item.harga_sewa_mobil;
                this.form.plat_nomor = item.plat_nomor;
                this.form.nomor_stnk = item.nomor_stnk;
                this.form.status_ketersediaan = item.status_ketersediaan;
                this.form.url_foto_mobil = item.url_foto_mobil;
                this.form.fasilitas = item.fasilitas;
                this.form.mulai_kontrak = item.mulai_kontrak;
                this.form.selesai_kontrak = item.selesai_kontrak;
                this.form.tanggal_servis_terakhir = item.tanggal_servis_terakhir;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogTransaksi = false;
                this.dialogConfirmUpdate = false;
                this.readData();
            },

            cancel() {
                // this.resetForm();
                // this.readData();
                // this.clear();
                this.dialogConfirmUpdate = false;
                this.dialogTransaksi = false;
            },

            resetData(){
                this.e1 = 1,
                this.temp_sisa = '',
                this.temp_jenis= '',
                this.temp_nama_driver= '',
                this.temp_nama_mobil= '',
                this.temp_mulai= '',
                this.temp_mulai_waktu= '',
                this.temp_selesai= '',
                this.temp_selesai_waktu= '',
                this.merge_mulai_sewa= '',
                this.merge_selesai_sewa= '',
                this.temp_sewa_mobil= 0,
                this.temp_sewa_driver= 0,
                this.totalHarga= 0,
                this.totalSewaMobil= 0,
                this.totalSewaDriver= 0,
                this.totalPromo= 0,
                this.potonganPromo= 0,
                this.hargaTotalsetelahPromo= 0,
                this.Difference_In_Days= 0,
                this.selectedId = '',
                this.selectedId_driver = '',
                this.selectedId_mobil = '',
                this.previousSelectedId = '',
                this.previousSelectedId_driver = '',
                this.previousSelectedId_mobil = ''
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            // this.readData();
            this.readDataPromo();
            this.readDataDriver();
            this.readDataRerataDriver();
            this.readDataMobil();
            this.readDataCustomer();
            this.readDataTransaksi();
            this.readDataBanyakTransaksi();
            this.readDataTransaksiDone();
            this.created();
        },
        
    };
</script>

<style scoped>
    .fullheight {
        /* min-height: 100vh !important; */
        min-width: 65vh !important;
    }
</style>

