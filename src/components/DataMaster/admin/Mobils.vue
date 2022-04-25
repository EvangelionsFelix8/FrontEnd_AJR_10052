<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Mobil </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Mobil </v-btn>
            </v-card-title>
        </v-card>

        <v-chip-group active-class="white--text">
            <v-chip
                filter
                color="white"
                style="margin-top: 20px"
                text-color="primary"
                @click="readData"
            > All </v-chip>

            <v-chip
                filter
                color="white"
                style="margin-top: 20px; margin-left: 10px"
                text-color="primary"
                @click='isAktifOn'
            > Active only</v-chip>

            <v-chip
                filter
                color="white"
                style="margin-top: 20px; margin-left: 10px"
                text-color="primary"
                @click='getExpireSoon'
            > Expire Soon</v-chip>
        </v-chip-group>
        
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="mobils" :search="search">
                <!-- <template v-slot:[`item.url_foto_mobil`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.url_foto_mobil" height="100px" width="200px" style="object-fit:cover"/> 
                </template> -->
                <template v-slot:[`item.jenis_bahan_bakar`]="{item}">
                    <span v-if="item.jenis_bahan_bakar == 'Pertalite'"><strong style="color: green">Pertalite</strong></span>
                    <span v-else><strong style="color: blue">Pertamax</strong> </span>
                </template>
                <template v-slot:[`item.volume_bahan_bakar`]="{item}">
                    <span>
                        {{ item.volume_bahan_bakar }} L</span>
                </template>
                <template v-slot:[`item.kapasitas_penumpang`]="{item}">
                    <span>
                        {{ item.kapasitas_penumpang }} Orang</span>
                </template>
                <template v-slot:[`item.harga_sewa_mobil`]="{item}">
                    <span>
                        Rp. {{ item.harga_sewa_mobil }}</span>
                </template>
                <template v-slot:[`item.kategori_aset`]="{item}">
                    <span v-if="item.id_mitra == null"><v-chip label color="blue lighten-4" text-color="blue darken-4"><strong>Perusahaan</strong></v-chip></span>
                    <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Mitra</strong></v-chip> </span>
                </template>
                <template v-slot:[`item.status_ketersediaan`]="{item}">
                    <span v-if="item.status_ketersediaan == 'Tersedia'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Tersedia</strong></v-chip></span>
                    <span v-else><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Tersedia</strong></v-chip> </span>
                </template>
                <template v-if="temp_sisa" v-slot:[`item.sisa_hari`]="{item}">
                    <span v-if="item.sisa_hari < 30 || item.sisa_hari > 0"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Tersedia</strong></v-chip></span>
                    <span v-else><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Tersedia</strong></v-chip> </span>
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
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="editHandler(item)"> Edit </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn class="red--text" red style="min-width: 100px;" small @click="deleteHandler(item.id_mobil)"> Delete </v-btn></v-list-item-title>
                        </v-list>
                    </v-menu>
                   
                </template>
            </v-data-table>
        </v-card>

        <!-- <v-btn small class="mr-2" @click="editHandler(item)"> Edit </v-btn>
        <v-btn small @click="deleteHandler(item.id)"> Delete </v-btn> -->

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-toolbar color="#00396c">
                    <v-card-title style="margin-left: 200px">
                        <span class="h6, white--text">{{ formTitle }} Mobil</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-radio-group v-model="form.kategori_aset">
                                <v-radio v-bind:value="0" label="Perusahaan"></v-radio>
                                <v-radio v-bind:value="1" label="Mitra"></v-radio>
                            </v-radio-group>
                            <v-select v-if="isMitra()" :rules="messageRules" :items="mitras" clearable v-model="form.id_mitra" label="Mitra" item-value="id_mitra" item-text="nama_mitra"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
                            <v-select :rules="messageRules" :items="tipeMobils" v-model="form.tipe_mobil" label="Tipe Mobil" item-value="tipe_mobil" item-text="text"></v-select>
                            <v-select :rules="messageRules" :items="jenisTransmisis" v-model="form.jenis_transmisi" label="Jenis Transmisi" item-value="value" item-text="text"></v-select>
                            <v-select :rules="messageRules" :items="jenisBahanBakars" v-model="form.jenis_bahan_bakar" label="Jenis Bahan Bakar" item-value="value" item-text="text"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                            <!-- <v-select :items="kategoriAsets" v-model="form.kategori_aset" label="Kategori Aset" item-value="value" item-text="text"></v-select> -->
                            <v-text-field :rules="messageRules" v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang Mobil" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.harga_sewa_mobil" label="Harga sewa Mobil" required prefix="Rp. "></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.plat_nomor" label="Plat Nomor Mobil" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.nomor_stnk" label="Nomor STNK Mobil" required></v-text-field>
                            <v-select :rules="messageRules" :items="statusKetersediaans" v-model="form.status_ketersediaan" label="Status Tersedia" item-value="value" item-text="text"></v-select>
                            <v-file-input :rules="messageRules" rounded filled prepend-icon="mdi-camera" label="Foto Mobil" id="file" ref="fileGambar"></v-file-input>
                            <v-text-field :rules="messageRules" v-model="form.fasilitas" label="Fasilitas Mobil" required></v-text-field>
                            <v-text-field v-if="isMitra()" :rules="messageRules" clearable type="date" v-model="form.mulai_kontrak" label="Mulai Kontrak Mobil" required></v-text-field>
                            <v-text-field v-if="isMitra()" :rules="messageRules" clearable type="date" v-model="form.selesai_kontrak" label="Selesai Kontrak Mobil" required></v-text-field>
                            <!-- <span v-if="id_mitra == null"></span> -->
                            <v-text-field :rules="messageRules" type="date" v-model="form.tanggal_servis_terakhir" label="Tanggal Service terakhir Mobil" required></v-text-field>
                        </v-form>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda Yakin Ingin menghapus Mobil ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- DRAWER BUAT DETAIL -->
                <v-navigation-drawer absolute temporary hide-overlay right v-model="drawer" height="550" class="fullheight">
                    <template>
                        <!-- <v-list-item two-line>
                        <v-list-item-avatar>
                            <v-img :src="$baseUrl+'/storage/'+this.form.url_foto_driver" height="100px" width="200px" style="object-fit:cover"/> 
                        </v-list-item-avatar>-->
<!-- 
                        <v-list-item-content>
                            <v-list-item-title>Name: {{this.form.nama_driver}}</v-list-item-title>
                        </v-list-item-content> -->
                        <!-- </v-list-item>  -->
                        <v-app-bar fixed color="#00396c">
                            <h2 style="color: white;">Detail Mobil : <span style="margin-left: 205px"><v-icon color="white" @click="drawer = !drawer">mdi-close-thick </v-icon></span></h2> 
                            <!-- <h6>Name: </h6> -->
                        </v-app-bar>
                    </template>
                    

                    <v-divider></v-divider>

                    <v-list style="padding-left: 20px;">
                        <v-list-item-content>
                            <v-list-item-title style="margin-top: 60px; margin-left: 40px;">
                                <!-- <v-overlay> -->
                                    <v-img @click="overlay = !overlay" :src="$baseUrl+'/storage/'+this.data.url_foto_mobil" height="150px" width="300px" style="object-fit:cover"/> 
                                <!-- </v-overlay> -->
                            </v-list-item-title>
                            <v-list-item-title style="margin-top: 20px; margin-bottom: 20px;"><strong> Nama Mobil <span style="margin-left: 97px;"> :</span> </strong> {{this.data.nama_mobil}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Plat Nomor <span style="margin-left: 103px;"> :</span> </strong> {{this.data.plat_nomor}}</v-list-item-title>
                                <!-- <v-list-item-title style="margin-bottom: 20px;">
                                    <strong> Fasilitas<span style="margin-left: 123px;"> :</span> </strong> {{this.data.fasilitas}}</v-list-item-title> -->
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Tanggal Mulai Kontrak <span style="margin-left: 23px;"> :</span> </strong> 
                                <span v-if="this.data.mulai_kontrak !== null"> {{this.data.mulai_kontrak}} </span>
                                <span v-else> - </span>
                            </v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Tanggal Selesai Kontrak <span style="margin-left: 10px;"> :</span> </strong> 
                                <span v-if="this.data.selesai_kontrak !== null"> {{this.data.selesai_kontrak}} </span>
                                <span v-else> - </span>
                            </v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Tanggal Servis Terakhir <span style="margin-left: 15px;"> :</span> </strong> {{this.data.tanggal_servis_terakhir}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Sisa Kontrak <span style="margin-left: 95px;"> :</span> </strong> 
                                <span v-if="this.data.sisa_hari > 0"> <span  style="color: red; font-weight: bold;"> {{this.data.sisa_hari}}</span> Hari Lagi  </span>
                                <span v-else-if="this.data.sisa_hari == null"> <v-chip style="margin-left: 20px" label color="green lighten-4" text-color="green darken-4"> <strong> Unlimited </strong> </v-chip></span>
                                <span v-else> <v-chip style="margin-left: 20px" label color="red lighten-4" text-color="red darken-4"> <strong> Expired </strong> </v-chip></span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list>
                </v-navigation-drawer>

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
                temp_sisa: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
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

                mobil: new FormData,
                mobils: [
                ],
                mitras:[],
                kategorieAsets: [
                    {text: 'Perusahaan', value: 1},
                    {text: 'Mitra', value: 2},
                ],
                tipeMobils: [
                    {text: "Sedan", value: 'sedan'},
                    {text: "City Car", value: 'City car'},
                    {text: "SUV", value: 'suv'},
                    {text: "MPV", value: 'mpv'},
                ],
                jenisTransmisis: [
                    {text: "AT", value: 'AT'},
                    {text: "CVT", value: 'CVT'},
                    {text: "MT", value: 'MT'},
                ],
                jenisBahanBakars:[
                    {text: "Pertalite", value: 'Pertalite'},
                    {text: "Pertamax", value: 'Pertamax'},
                ],
                kategoriAsets:[
                    {text: "Perusahaan", value: 0},
                    {text: "Mitra", value: 1},
                ],
                statusKetersediaans:[
                    {text: "Tersedia", value: 'Tersedia'},
                    {text: "Tidak Tersedia", value: 'Tidak Tersedia'},
                ],
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
                tags: [
                    'All',
                    'Active only',
                ],
            };
        },
        methods: {
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
            readData() {
                var url = this.$api + '/mobil';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mobils = response.data.data;
                })
            },

            readDataMitra() {
                var url = this.$api + '/mitrabystatusmitra';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mitras = response.data.data;
                })
            },

            isAktifOn () {
                var url = this.$api + '/showbystatusmobil';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mobils = response.data.data;
                })
            },

            getExpireSoon () {
                this.temp_sisa = true;
                var url = this.$api + '/getmobilbyexpiredsoon';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mobils = response.data.data;
                })
            },

            save(){
                if(this.form.id_mitra > 0){
                    this.mobil.append('id_mitra', this.form.id_mitra);
                }
                else{
                    this.mobil.append('id_mitra', []);
                }

                this.mobil.append('kategori_aset', this.form.kategori_aset);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('tipe_mobil', this.form.tipe_mobil);
                this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
                this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                this.mobil.append('warna_mobil', this.form.warna_mobil);
                this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                this.mobil.append('kategori_aset', this.form.kategori_aset);
                this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                this.mobil.append('harga_sewa_mobil', this.form.harga_sewa_mobil);
                this.mobil.append('plat_nomor', this.form.plat_nomor);
                this.mobil.append('nomor_stnk', this.form.nomor_stnk);
                this.mobil.append('status_ketersediaan', this.form.status_ketersediaan);
                this.mobil.append('fasilitas', this.form.fasilitas);
                if(this.form.mulai_kontrak !== null){
                    this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                }
                // else{
                //     this.mobil.append('mulai_kontrak', null);
                // }
                // this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                if(this.form.selesai_kontrak !== null){
                   this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
                }
                // else{
                //     this.mobil.append('selesai_kontrak', null);
                // }
                // this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
                this.mobil.append('tanggal_servis_terakhir', this.form.tanggal_servis_terakhir);

                var temp_foto = document.getElementById("file");
                this.mobil.append('url_foto_mobil', temp_foto.files[0]);

                var url = this.$api + '/mobil/'
                this.load = true;
                this.$http.post(url, this.mobil, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
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
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                    location.reload();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            update() {
                var temp_foto = document.getElementById("file");
                
                if(temp_foto.files[0]){
                    this.mobil.append('url_foto_mobil', temp_foto.files[0]);
                }

                if(this.form.id_mitra > 0){
                    this.mobil.append('id_mitra', this.form.id_mitra);
                }
                else{
                    this.mobil.append('id_mitra', []);
                }

                this.mobil.append('kategori_aset', this.form.kategori_aset);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('tipe_mobil', this.form.tipe_mobil);
                this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
                this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                this.mobil.append('warna_mobil', this.form.warna_mobil);
                this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                this.mobil.append('kategori_aset', this.form.kategori_aset);
                this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                this.mobil.append('harga_sewa_mobil', this.form.harga_sewa_mobil);
                this.mobil.append('plat_nomor', this.form.plat_nomor);
                this.mobil.append('nomor_stnk', this.form.nomor_stnk);
                this.mobil.append('status_ketersediaan', this.form.status_ketersediaan);
                // this.mobil.append('url_foto_mobil', this.form.url_foto_mobil);
                this.mobil.append('fasilitas', this.form.fasilitas);
                if(this.form.mulai_kontrak !== null){
                    this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                }
                else{
                    this.mobil.append('mulai_kontrak', []);
                }
                // this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                if(this.form.selesai_kontrak !== null){
                   this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
                }
                else{
                    this.mobil.append('selesai_kontrak', []);
                }
                // this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                // this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
                this.mobil.append('tanggal_servis_terakhir', this.form.tanggal_servis_terakhir);

                var url = this.$api + '/mobil/' + this.editId;
                this.load = true;
                this.$http.post(url, this.mobil, {
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
                    this.clear();
                    var temp_foto = document.getElementById("file");
                
                    if(temp_foto.files[0]){
                        this.mobil.append('url_foto_mobil', temp_foto.files[0]);
                    }
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/mobil/' + this.deleteId;
                this.load = true;
                this.$http.delete(url, {
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
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.snackbar = {
                        color: "error",
                        icon: "mdi-alert-circle",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Error",
                        visible: true
                    };
                    this.load = false;
                    this.clear();
                });
            },

            // fungsiTampilValueRadio(item){
            //     if(item.id_mitra == null){
            //         this.kategori_aset = 0;
            //     }
            //     else{
            //         this.kategori_aset = 1;
            //     }
            // },

            editHandler(item) {
                this.inputType = 'Ubah';
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
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                var temp_foto = document.getElementById("file");
                
                if(temp_foto.files[0]){
                    this.mobil.append('url_foto_mobil', temp_foto.files[0]);
                }
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    checkIsPerusahaan: null,
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
                };
            },

            detailScreen(item){
                this.data.url_foto_mobil = item.url_foto_mobil;
                this.data.nama_mobil = item.nama_mobil;
                this.data.plat_nomor = item.plat_nomor;
                this.data.fasilitas = item.fasilitas;
                this.data.mulai_kontrak = item.mulai_kontrak;
                this.data.selesai_kontrak = item.selesai_kontrak;
                this.data.tanggal_servis_terakhir = item.tanggal_servis_terakhir;
                this.data.sisa_hari = item.sisa_hari;
                this.drawer = !this.drawer;
                if(this.drawer == false){
                    this.resetForm();
                }
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
            this.readDataMitra();
        },
    };
</script>

<style scoped>
    .fullheight {
        /* min-height: 100vh !important; */
        min-width: 65vh !important;
    }
</style>