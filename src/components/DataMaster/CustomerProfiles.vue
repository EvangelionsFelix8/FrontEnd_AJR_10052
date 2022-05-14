<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Profile Saya </h3>

        <v-overlay :value="overlay_tanda">
            <v-app-bar color="#00396c" max-height="50" max-width="550">
                <h2 style="color: white; margin-bottom: 8px;">Foto Tanda Pengenal </h2> <v-icon @click="overlay_tanda = !overlay_tanda" style="margin-bottom: 10px; margin-left: 51%;">mdi-close-thick</v-icon>
            </v-app-bar>
            <v-img :src="$baseUrl+'/storage/'+customers.no_tanda_pengenal" height="550px" width="550px" />
        </v-overlay> 

        <v-overlay :value="overlay_sim">
            <v-app-bar color="#00396c" max-height="50" max-width="550">
                <h2 style="color: white; margin-bottom: 8px;">Foto SIM </h2> <v-icon @click="overlay_sim = !overlay_sim" style="margin-bottom: 10px; margin-left: 76%;">mdi-close-thick</v-icon>
            </v-app-bar>
            <v-img :src="$baseUrl+'/storage/'+customers.no_sim" height="550px" width="550px" />
        </v-overlay> 

    <v-row>
        <v-col cols="6">
            <v-card outlined class="info" style="position: relative; margin-bottom: 15px;">
                <v-icon class="idinformasi" size="115">mdi-information-outline</v-icon>
                <v-card-title class="cardtitle1" style="padding-left: -20%;"> Banyak Transaksi Yang Sudah Anda Lakukan</v-card-title>
                <v-card-text class="cardtext"> {{this.count}}</v-card-text>
            </v-card>
            <v-row>
                <v-col>
                    <!-- <v-hover v-slot="{ hover }"> -->
                        <v-card outlined class="success" style="position: relative;">
                            <v-icon class="idinformasi" size="115">mdi-check-circle-outline</v-icon>
                            <v-card-title class="cardtitle">Transaksi Selesai</v-card-title>
                            <v-card-text class="cardtext">{{this.countDone}}</v-card-text>
                        </v-card>
                    <!-- </v-hover> -->
                </v-col>
                <v-col>
                    <v-card class="amber darken-1" style="position: relative;">
                        <v-icon class="idinformasi" size="115">mdi-progress-clock</v-icon>
                        <v-card-title class="cardtitle" style="padding-left: 40%;"> On Progress </v-card-title>
                        <v-card-text class="cardtext">{{this.count - this.countDone}}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="red darken-1" style="position: relative;">
                        <v-icon class="idinformasi" size="115">mdi-alert-circle-outline</v-icon>
                        <v-card-title class="cardtitle"> Transaksi Gagal </v-card-title>
                        <v-card-text class="cardtext">0</v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                </v-col>
            </v-row>
                
        </v-col>
        <v-col cols="6">
            <!-- <v-col cols="5"> -->
                <v-card>
                    <v-app-bar color="#00396c">
                        <h2 style="color: white; ">Profil Saya</h2> 
                        <v-spacer></v-spacer>
                        <v-icon class="white--text" size="30px" @click="editHandler(customers)">mdi-cog</v-icon>
                    </v-app-bar>
                    <v-card-text class="textinformasi"><strong>Nama<span style="margin-left: 97px;"> : </span> </strong>{{customers.nama_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Alamat<span style="margin-left: 85px;"> : </span></strong>{{customers.alamat_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Nomor Telepon<span style="margin-left: 10px;"> : </span></strong>{{customers.no_telp_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Tanggal Lahir<span style="margin-left: 25px;"> : </span></strong>{{customers.tanggal_lahir_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Jenis Kelamin<span style="margin-left: 20px;"> : </span></strong>{{customers.jenis_kelamin}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Email<span style="margin-left: 97px;"> : </span></strong>{{customers.email_customer}}</v-card-text>            
                    <v-card-text class="textinformasi">
                        <strong>Foto Tanda Pengenal : </strong>
                        <v-img v-if="customers.no_tanda_pengenal !== null" @click="overlay_tanda = !overlay_tanda" :src="$baseUrl+'/storage/'+customers.no_tanda_pengenal" height="150px" width="300px" style="object-fit:cover; margin-top: 15px;">
                        </v-img>
                        <v-img v-else :src="noimage" height="150px" width="300px" style="object-fit:cover; margin-top: 15px;">
                        </v-img>
                    </v-card-text>
                    <v-card-text class="textinformasi"><strong>Foto SIM <span style="margin-left: 102px;"> : </span> </strong>
                        <v-img v-if="customers.no_sim !== null" @click="overlay_sim = !overlay_sim" :src="$baseUrl+'/storage/'+customers.no_sim" height="150px" width="300px" style="object-fit:cover; margin-top: 15px;">
                        </v-img>
                        <v-img v-else :src="noimage" height="150px" width="300px" style="object-fit:cover; margin-top: 15px;">
                        </v-img>
                    </v-card-text>
                    <v-card-text class="textinformasi"><strong>Status Berkas <span style="margin-left: 55px;"> : </span> </strong>
                        <span v-if="customers.status_berkas == 'Verified'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                        <span v-else-if="customers.status_berkas == 'Not Verified'"><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Not Verified</strong></v-chip> </span>
                        <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Verified! must with driver</strong></v-chip></span>
                    </v-card-text>
                </v-card>
            <!-- </v-col> -->
            <!-- <v-col> -->
                <!-- <v-card class="yellow lighten-5">
                    <v-app-bar color="#00396c">
                        <h2 style="color: white;">Informasi Pribadi </h2>
                        <v-spacer></v-spacer>
                        <v-icon class="white--text" size="30px" @click="editHandler(customers)">mdi-cog</v-icon>
                        <v-card-title class="text-h5"> Informasi Pribadi</v-card-title>
                    </v-app-bar>                    
                    <v-card-text class="textinformasi"><strong>Nama<span style="margin-left: 97px;"> : </span> </strong>{{customers.nama_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Alamat<span style="margin-left: 85px;"> : </span></strong>{{customers.alamat_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Nomor Telepon<span style="margin-left: 10px;"> : </span></strong>{{customers.no_telp_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Tanggal Lahir<span style="margin-left: 25px;"> : </span></strong>{{customers.tanggal_lahir_customer}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Jenis Kelamin<span style="margin-left: 20px;"> : </span></strong>{{customers.jenis_kelamin}}</v-card-text>
                    <v-card-text class="textinformasi"><strong>Email<span style="margin-left: 97px;"> : </span></strong>{{customers.email_customer}}</v-card-text>
                </v-card> -->
            <!-- </v-col> -->
        </v-col>
    </v-row>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-toolbar color="#00396c">
                    <v-card-title>
                        <div style="text-align: center;" class="h6, white--text">
                            Edit Profile Anda
                        </div>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-icon color="white" @click="cancel">
                        mdi-close-thick
                    </v-icon>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-text-field :rules="messageRules" v-model="form.nama_customer" label="Nama Customer" required></v-text-field>
                            <v-textarea :rules="messageRules" v-model="form.alamat_customer" label="Alamat Customer" required></v-textarea>
                            <v-select :rules="messageRules" :items="jenisKelamins" v-model="form.jenis_kelamin" label="Jenis Kelamin" item-value="value" item-text="text"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.email_customer" label="Email Customer" required></v-text-field>
                            <v-text-field :rules="messageRules" type="date" v-model="form.tanggal_lahir_customer" label="Tanggal Lahir" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.no_telp_customer" label="No. Telp Customer" required></v-text-field>
                            <v-file-input :rules="messageRules" type="file" rounded filled prepend-icon="mdi-camera" label="Tanda Pengenal" id="foto_no_tanda_pengenal" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Surat Izin Mengemudi" id="foto_sim" ref="fileSim"></v-file-input>
                        </v-form>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="blue darken-1" text @click="dialog = false"> Cancel </v-btn> -->
                    <v-btn color="blue darken-1" text @click="update"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogVerifikasi" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda ingin Verifikasi Berkas Customer ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogVerifikasi = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="verifyBerkas"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- DRAWER BUAT DETAIL
        <v-navigation-drawer absolute temporary hide-overlay right v-model="drawer" height="550" class="fullheight">
            <template>
                <v-app-bar fixed color="#00396c">
                    <h2 style="color: white;">Detail Customer : <span style="margin-left: 200px"><v-icon color="white" @click="closeDrawerDetail">mdi-close-thick </v-icon></span></h2> 
                </v-app-bar>
            </template>
            <v-divider></v-divider>
            <v-list style="padding-left: 20px;">
                <v-list-item-content>
                    <v-list-item-title style="margin-top: 60px; margin-bottom: 20px;"><strong> Nama Customer <span style="margin-left: 10px;"> :</span> </strong> {{this.data.nama_customer}}</v-list-item-title>
                    <v-list-item-title style="margin-bottom: 20px;"><strong> Tanggal Lahir <span style="margin-left: 29px;"> :</span> </strong> {{this.data.tanggal_lahir_customer}}</v-list-item-title>
                    <v-list-item-title style="margin-bottom: 20px;"><strong> Jenis Kelamin <span style="margin-left: 24px;"> :</span> </strong> {{this.data.jenis_kelamin}}</v-list-item-title>
                    <v-list-item-title style="margin-bottom: 10px;"><strong> Tanda Pengenal <span style="margin-left: 10px;"> :</span> </strong> </v-list-item-title>
                    <v-list-item-title>
                        <v-img :src="$baseUrl+'/storage/'+this.data.no_tanda_pengenal" height="500px" width="400px" style="object-fit:cover"/> 
                    
                    </v-list-item-title>

                    <v-list-item-title style="margin-top: 20px; margin-bottom: 10px;"><strong> SIM <span style="margin-left: 95px;"> :</span> </strong> </v-list-item-title>
                    <v-list-item-title>
                        <v-img :src="$baseUrl+'/storage/'+this.data.no_sim" height="500px" width="400px" style="object-fit:cover"/>
                    </v-list-item-title>
                    <span style="margin-top: 20px;" v-if="this.data.status_berkas == 'Verified'">
                        <strong>Status Berkas <span style="margin-left: 60px;"> :</span></strong><v-chip style="margin-left: 20px" label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                    <span style="margin-top: 20px;" v-else>
                        <strong>Status Berkas <span style="margin-left: 60px;"> :</span></strong><v-chip style="margin-left: 20px" label color="red lighten-4" text-color="red darken-4"><strong>Not verified</strong></v-chip> </span>
                </v-list-item-content>
            </v-list>
        </v-navigation-drawer> -->

        <v-snackbar v-model="snackbar.visible" auto-height :color="snackbar.color" :multi-line="snackbar.mode === 'multi-line'" :timeout="snackbar.timeout" :top="snackbar.position === 'bottom'">
            <v-layout align-center pr-4>
                <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
                <v-layout column>
                <div>
                    <strong>{{ snackbar.title }}</strong>
                </div>
                <div>
                    {{ error_message }}
                </div>
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
                noimage: require('@/assets/noimage.jpg'),
                overlay_tanda: false,
                overlay_sim: false,
                inputType: 'Tambah',
                load: false,
                count: 0,
                countDone: 0,
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
                BANTUPENGENAL: '',
                BANTUSIM: '',
                temp_banyak: '',
                search: null,
                drawer: false,
                dialog: false,
                dialogConfirm: false,
                dialogVerifikasi: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                headers: [
                    { text: "Nama Customer", value: 'nama_customer' },
                    { text: "Alamat Customer", value: 'alamat_customer', width: "150px" },
                    { text: "Email Customer", value: 'email_customer' },
                    // { text: "Tanggal Lahir", value: 'tanggal_lahir_customer', width: "110px" },
                    // { text: "Jenis Kelamin", value: 'jenis_kelamin' },
                    { text: "No. Telp Customer", value: 'no_telp_customer' },
                    // { text: "Tanda Pengenal Customer", value: 'no_tanda_pengenal' },
                    // { text: "SIM Customer", value: 'no_sim' },
                    { text: "Status Berkas", value: 'status_berkas' },
                    { text: "Action", value: 'actions' },
                ],
                jenisKelamins: [
                    {text: "Laki - Laki", value: "Laki-laki"},
                    {text: "Perempuan", value: "Perempuan"},
                ],
                customer: new FormData,
                customers: [],
                transaksis: [],
                form: {
                    nama_customer: null,
                    alamat_customer: null,
                    tanggal_lahir_customer: null,
                    jenis_kelamin: null,
                    email_customer: null,
                    no_telp_customer: null,
                    status_berkas: null,
                    no_tanda_pengenal: null,
                    no_sim: null,
                },
                data: {
                    nama_customer: null,
                    alamat_customer: null,
                    tanggal_lahir_customer: null,
                    jenis_kelamin: null,
                    email_customer: null,
                    no_telp_customer: null,
                    status_berkas: null,
                    no_tanda_pengenal: null,
                    no_sim: null,
                },
                deleteId: '',
                editId: '',
            };
        },
        methods: {
            clear(){
                this.$refs.form.reset();
            },

            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            // Read Data Customers
            readData() {
                var url = this.$api + '/customer/' + 'CUS220506-010';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            readDataBanyakTransaksi() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransaction/' + 'CUS220506-010';
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
                var url = this.$api + '/countTransactionDone/' + 'CUS220506-010';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.countDone = response.data.data;
                    console.log(this.countDone);
                })
            },

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            // verifyBerkasHandler(item){
            //     this.editId = item.id_customer;
            //     this.no_sim = item.no_sim;
            //     this.form.status_berkas = item.status_berkas;
            //     this.dialogVerifikasi = true;
            // },

            // verifyBerkas(){
            //     if(this.form.status_berkas == 'Not Verified' || this.form.status_berkas == 'Verified! must with driver'){
            //         console.log(this.no_sim);
            //         if(this.no_sim !== null){
            //             this.customer.append('status_berkas', 'Verified');
            //         }
            //         else{
            //             this.customer.append('status_berkas', 'Verified! must with driver');
            //         }
            //         var url = this.$api + '/updateberkascustomer/' + this.editId;
            //         this.load = true;
            //         this.$http.post(url, this.customer, {
            //             headers: {
            //                 'Authorization' : 'Bearer ' +localStorage.getItem('token')
            //             }
            //         }).then(response => {
            //             this.error_message = response.data.message;
            //             this.snackbar = {
            //                 color: "success",
            //                 icon: "mdi-check-circle",
            //                 mode: "multi-line",
            //                 position: "top",
            //                 timeout: 2000,
            //                 title: "Success",
            //                 visible: true
            //             };
            //             this.load = false;
            //             this.close();
            //             this.readData();
            //             this.resetForm();
            //         }).catch(error => {
            //             this.error_message = error.response.data.message;
            //             this.color = "red";
            //             this.snackbar = true;
            //             this.load = false;
            //         });
            //     }
            //     else{
            //        this.snackbar = {
            //             color: "info",
            //             icon: "mdi-information-outline",
            //             mode: "multi-line",
            //             position: "top",
            //             timeout: 2000,
            //             title: "Information",
            //             visible: true
            //         };
            //         this.error_message = 'Anda Sudah Verifikasi Driver ini';
            //         this.dialogVerifikasi = false;
            //     }
            // },

            // detailScreen(item){
            //     this.data.nama_customer = item.nama_customer;
            //     this.data.tanggal_lahir_customer = item.tanggal_lahir_customer;
            //     this.data.jenis_kelamin = item.jenis_kelamin;
            //     this.data.no_tanda_pengenal = item.no_tanda_pengenal;
            //     this.data.no_sim = item.no_sim;
            //     this.data.status_berkas = item.status_berkas;
            //     this.drawer = !this.drawer;
            //     if(this.drawer == false){
            //         this.resetForm();
            //     }
            // },

            editHandler(customers) {
                this.inputType = 'Ubah';
                this.editId = customers.id_customer;
                this.form.nama_customer = customers.nama_customer;
                this.form.alamat_customer = customers.alamat_customer;
                this.form.tanggal_lahir_customer = customers.tanggal_lahir_customer;
                this.form.jenis_kelamin = customers.jenis_kelamin;
                this.form.email_customer = customers.email_customer;
                this.form.no_telp_customer = customers.no_telp_customer;
                this.form.no_tanda_pengenal = customers.no_tanda_pengenal;
                this.form.no_sim = customers.no_sim;
                this.dialog = true;
            },

            update() {
                var temp_tanda = document.getElementById("foto_no_tanda_pengenal");
                var temp_sim = document.getElementById("foto_sim");

                if(temp_tanda.files[0]){
                    this.customer.append('no_tanda_pengenal', temp_tanda.files[0]);
                }
                if(temp_sim.files[0]){
                    this.customer.append('no_sim', temp_sim.files[0]);
                }
                this.customer.append('nama_customer', this.form.nama_customer);
                this.customer.append('alamat_customer', this.form.alamat_customer);
                this.customer.append('email_customer', this.form.email_customer);
                this.customer.append('tanggal_lahir_customer', this.form.tanggal_lahir_customer);
                this.customer.append('jenis_kelamin', this.form.jenis_kelamin);
                this.customer.append('no_telp_customer', this.form.no_telp_customer);

                var url = this.$api + '/customer/' + this.editId;
                this.load = true;
                this.$http.post(url, this.customer, {
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
                    if(temp_tanda.files[0] || temp_sim.files[0]){
                        location.reload();
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

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogVerifikasi = false;
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.dialogVerifikasi = false;
            },

            resetForm(){
                this.form = {
                    nama_customer: null,
                    alamat_customer: null,
                    tanggal_lahir_customer: null,
                    jenis_kelamin: null,
                    email_customer: null,
                    no_telp_customer: null,
                    status_berkas: null,
                    no_tanda_pengenal: null,
                    no_sim: null,
                };
            },

            closeDrawerDetail(){
                this.drawer = !this.drawer;
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
            this.readDataBanyakTransaksi();
            this.readDataTransaksiDone();
            // this.isAktifOn();
        },
    };
</script>

<style scoped>
    .v-card .textinformasi{
        font-size: 20px;
        color: black;
    }
    .cardtitle{
        color: white;
        padding-left: 35%;
        position: relative;
    }
    .cardtitle1{
        color: white;
        padding-left: 20%;
        position: relative;
    }
    .cardtext{
        font-size: 40px;
        position: relative;
        padding-left: 55%;
        color: white;
    }
    .idinformasi{
        transform: rotate(20deg);
        top: -7px;
        left:-8px;
        position: absolute;
        opacity: 0.5;
        margin-bottom: 100px;
        /* background-color: red; */
    }
    .fullheight {
        /* min-height: 100vh !important; */
        min-width: 70vh !important;
    }

    /* .v-card {
        transition: opacity .4s ease-in-out;
        background-color: yellow;
    } */

    /* .v-card:not(.on-hover) {
        opacity: 0.6;
        background-color: yellow;
    } */
</style>