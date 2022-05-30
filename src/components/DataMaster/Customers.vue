<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Customer </h3>

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
            </v-card-title>
        </v-card>
        
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="customers" :search="search">
                <template v-slot:[`item.no_tanda_pengenal`]="{item}">
                    <v-icon v-if="item.no_tanda_pengenal !== null" color="blue darken-4">mdi-check-decagram</v-icon>
                    <v-icon v-else color="red darken-4">mdi-alert-decagram</v-icon>
                    <!-- <v-img @click="OverlayTandaPreview(item)" :src="$baseUrl+'/storage/'+item.no_tanda_pengenal" height="100px" width="100px" style="object-fit:cover"/>   -->
                </template>
                <template v-slot:[`item.no_sim`]="{item}">
                    <v-icon v-if="item.no_sim !== null" color="blue darken-4">mdi-check-decagram</v-icon>
                    <v-icon v-else color="red darken-4">mdi-alert-decagram</v-icon>
                    <!-- <v-img @click="OverlaySimPreview(item)" :src="$baseUrl+'/storage/'+item.no_sim" height="100px" width="100px" style="object-fit:cover"/>   -->
                </template>
                <template v-slot:[`item.status_berkas`]="{item}">
                    <span v-if="item.status_berkas == 'Verified'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                    <span v-else-if="item.status_berkas == 'Not Verified'"><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Not Verified</strong></v-chip> </span>
                    <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Verified! must with driver</strong></v-chip></span>
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
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="verifyBerkasHandler(item)"> Verifikasi </v-btn></v-list-item-title>
                            <!-- <v-list-item-title><v-btn style="min-width: 100px;" small @click="editHandler(item)"> Edit </v-btn></v-list-item-title> -->
                            <!-- <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_pegawai)"> Delete </v-btn></v-list-item-title> -->
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card>

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

        <!-- DRAWER BUAT DETAIL -->
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
                overlay_tanda: false,
                overlay_sim: false,
                BANTUPENGENAL: '',
                BANTUSIM: '',
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
                    { text: "Nomor Telepon", value: 'no_telp_customer' },
                    { text: "Tanda Pengenal", value: 'no_tanda_pengenal' },
                    { text: "SIM", value: 'no_sim' },
                    { text: "Status Berkas", value: 'status_berkas' },
                    { text: "Action", value: 'actions' },
                ],

                customer: new FormData,
                customers: [
                ],
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
                var url = this.$api + '/customer';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            verifyBerkasHandler(item){
                this.editId = item.id_customer;
                this.no_sim = item.no_sim;
                this.form.status_berkas = item.status_berkas;
                this.dialogVerifikasi = true;
            },

            verifyBerkas(){
                if((this.no_sim === null && this.form.status_berkas == 'Not Verified') || 
                    (this.no_sim !== null && this.form.status_berkas == 'Verified! must with driver') || 
                    (this.no_sim !== null && this.form.status_berkas == 'Not Verified')){
                    if(this.no_sim !== null){
                        this.customer.append('status_berkas', 'Verified');
                    }
                    else{
                        this.customer.append('status_berkas', 'Verified! must with driver');
                    }
                    var url = this.$api + '/updateberkascustomer/' + this.editId;
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
                    if(this.form.status_berkas == 'Verified! must with driver' && this.no_sim === null){
                        this.error_message = 'Sudah Verifikasi Tanda Pengenal, tapi SIM belum';
                    }
                    else{
                        this.error_message = 'Anda Sudah Verifikasi Customer ini';
                    }
                    this.dialogVerifikasi = false;
                }
            },

            detailScreen(item){
                this.data.nama_customer = item.nama_customer;
                this.data.tanggal_lahir_customer = item.tanggal_lahir_customer;
                this.data.jenis_kelamin = item.jenis_kelamin;
                this.data.no_tanda_pengenal = item.no_tanda_pengenal;
                this.data.no_sim = item.no_sim;
                this.data.status_berkas = item.status_berkas;
                this.drawer = !this.drawer;
                if(this.drawer == false){
                    this.resetForm();
                }
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
            // this.isAktifOn();
        },
    };
</script>

<style scoped>
    .fullheight {
        /* min-height: 100vh !important; */
        min-width: 70vh !important;
    }
</style>