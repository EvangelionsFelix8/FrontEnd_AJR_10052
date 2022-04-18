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
                <template v-slot:[`item.url_foto_mobil`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.url_foto_mobil" height="100px" width="200px" style="object-fit:cover"/> 
                </template>
                <template v-slot:[`item.kategori_aset`]="{item}">
                    <span v-if="item.id_mitra == null"><v-chip label color="blue lighten-4" text-color="blue darken-4"><strong>Perusahaan</strong></v-chip></span>
                    <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Mitra</strong></v-chip> </span>
                </template>
                <template v-slot:[`item.status_ketersediaan`]="{item}">
                    <span v-if="item.status_ketersediaan == 'Tersedia'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Tersedia</strong></v-chip></span>
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
                        <v-select :items="mitras" clearable v-model="form.id_mitra" label="Mitra" item-value="id_mitra" item-text="nama_mitra"></v-select>
                        <v-select :items="tipeMobils" v-model="form.tipe_mobil" label="Tipe Mobil" item-value="tipe_mobil" item-text="text"></v-select>
                        <v-select :items="jenisTransmisis" v-model="form.jenis_transmisi" label="Jenis Transmisi" item-value="value" item-text="text"></v-select>
                        <v-select :items="jenisBahanBakars" v-model="form.jenis_bahan_bakar" label="Jenis Bahan Bakar" item-value="value" item-text="text"></v-select>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                        <!-- <v-select :items="kategoriAsets" v-model="form.kategori_aset" label="Kategori Aset" item-value="value" item-text="text"></v-select> -->
                        <v-text-field v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang Mobil" required></v-text-field>
                        <v-text-field v-model="form.harga_sewa_mobil" label="Harga sewa Mobil" required></v-text-field>
                        <v-text-field v-model="form.plat_nomor" label="Plat Nomor Mobil" required></v-text-field>
                        <v-text-field v-model="form.nomor_stnk" label="Nomor STNK Mobil" required></v-text-field>
                        <v-select :items="statusKetersediaans" v-model="form.status_ketersediaan" label="Status Tersedia" item-value="value" item-text="text"></v-select>
                        <v-file-input rounded filled prepend-icon="mdi-camera" label="Foto Mobil" id="file" ref="fileGambar"></v-file-input>
                        <v-text-field v-model="form.fasilitas" label="Fasilitas Mobil" required></v-text-field>
                        <v-text-field type="date" v-model="form.mulai_kontrak" label="Mulai Kontrak Mobil" required></v-text-field>
                        <v-text-field type="date" v-model="form.selesai_kontrak" label="Selesai Kontrak Mobil" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_servis_terakhir" label="Tanggal Service terakhir Mobil" required></v-text-field>
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

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
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
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                headers: [
                    { text: "", value: 'url_foto_mobil' },
                    { text: "Nama Mobil", value: 'nama_mobil' },
                    { text: "Tipe Mobil", value: 'tipe_mobil' },
                    { text: "Transmisi", value: 'jenis_transmisi' },
                    { text: "Bahan Bakar", value: 'jenis_bahan_bakar' },
                    { text: "Warna ", value: 'warna_mobil' },
                    { text: "Volume Bahan Bakar (L)", value: 'volume_bahan_bakar' },
                    { text: "Kapasitas", value: 'kapasitas_penumpang' },
                    { text: "Harga Mobil", value: 'harga_sewa_mobil' },
                    { text: "Plat Nomor", value: 'plat_nomor' },
                    { text: "Fasilitas Mobil", value: 'fasilitas' },
                    { text: "Mulai Kontrak Mobil", value: 'mulai_kontrak' },
                    { text: "Selesai Kontrak Mobil", value: 'selesai_kontrak' },
                    { text: "Tanggal servis Terakhir", value: 'tanggal_servis_terakhir' },
                    { text: "Kategori Aset", value: 'kategori_aset' },
                    { text: "Status Mobil", value: 'status_ketersediaan' },
                    { text: "Action", value: 'actions' },
                ],

                mobil: new FormData,
                mobils: [
                ],
                mitras:[],
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

            save(){
                if(this.form.id_mitra > 0){
                    this.mobil.append('id_mitra', this.form.id_mitra);
                }
                else{
                    this.mobil.append('id_mitra', []);
                }
                
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
                this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
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
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
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
                this.mobil.append('mulai_kontrak', this.form.mulai_kontrak);
                this.mobil.append('selesai_kontrak', this.form.selesai_kontrak);
                this.mobil.append('tanggal_servis_terakhir', this.form.tanggal_servis_terakhir);

                var url = this.$api + '/mobil/' + this.editId;
                this.load = true;
                this.$http.post(url, this.mobil, {
                    headers: {
                        'Authorization' : 'Bearer ' +localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
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
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

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
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    kode_promo : null,
                    jenis_promo : null,
                    besar_diskon_promo : null,
                    status_promo : null,
                    keterangan : null,
                };
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
                var url = this.$api + '/getmobilbyexpiredsoon';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mobils = response.data.data;
                })
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