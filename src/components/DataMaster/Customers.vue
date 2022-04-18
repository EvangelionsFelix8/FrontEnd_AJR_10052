<template>
    <v-main class="list">
        <h3 style="font-size: 50px; text-align: center" mb-5> Customer </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Customer </v-btn>
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
        </v-chip-group>
        
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="customers" :search="search">
                <!-- <template v-slot:[`item.url_foto_pegawai`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.url_foto_pegawai" height="100px" width="100px" style="object-fit:cover"/>  
                </template> -->
                <template v-slot:[`item.status_berkas`]="{item}">
                    <span v-if="item.status_berkas == 'Verified'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                    <span v-else><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Not Verified</strong></v-chip> </span>
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
                            <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_pegawai)"> Delete </v-btn></v-list-item-title>
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
                        <span class="h6, white--text">{{ formTitle }} Customer</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-select :items="roles" v-model="form.id_role" label="Jabatan" item-value="id_role" item-text="nama_role"></v-select>
                        <v-text-field v-model="form.nama_pegawai" label="Nama Customer" required></v-text-field>
                        <v-textarea v-model="form.alamat_pegawai" label="Alamat Customer" required></v-textarea>
                        <v-text-field v-model="form.email_pegawai" label="No. Telp Customer" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_lahir_pegawai" label="Tanggal Lahir" required></v-text-field>
                        <v-text-field v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin" required></v-text-field>
                        <v-text-field v-model="form.no_telp_pegawai" label="No. Telp Customer" required></v-text-field>
                        <v-text-field v-model="form.url_foto_pegawai" label="Foto" required></v-text-field>
                        <v-select :items="statusPegawai" v-model="form.isAktif" label="Status Customer" item-value="value" item-text="text"></v-select>
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
                    Anda Yakin Ingin menghapus Customer ini?
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
                statusPegawai: [
                    {text: "Aktif", value: 1},
                    {text: "Tidak Aktif", value: 0},
                ],
                previewImageUrl: '',
                headers: [
                    { text: "Nama Customer", value: 'nama_customer' },
                    { text: "Alamat Customer", value: 'alamat_customer' },
                    { text: "Email Customer", value: 'email_customer' },
                    { text: "Tanggal Lahir", value: 'tanggal_lahir_customer' },
                    { text: "Jenis Kelamin", value: 'jenis_kelamin' },
                    { text: "No. Telp Customer", value: 'no_telp_customer' },
                    { text: "Berkas Customer", value: 'berkas_customer' },
                    { text: "Tanda Pengenal Customer", value: 'no_tanda_pengenal' },
                    { text: "SIM Customer", value: 'no_sim' },
                    { text: "Status Berkas", value: 'status_berkas' },
                    { text: "Action", value: 'actions' },
                ],
                roles:[],
                customer: new FormData,
                customers: [],
                form: {
                    id_role: null,
                    nama_pegawai: null,
                    alamat_pegawai: null,
                    email_pegawai: null,
                    tanggal_lahir_pegawai: null,
                    jenis_kelamin_pegawai: null,
                    no_telp_pegawai: null,
                    password_pegawai: null,
                    url_foto_pegawai: null,
                    isAktif: null,
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

            readDataRole() {
                var url = this.$api + '/role';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.roles = response.data.data;
                })
            },

            isAktifOn () {
                var url = this.$api + '/showbystatuspegawai';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data;
                })
            },

            save(){
                this.customer.append('id_role', this.form.id_role);
                this.customer.append('nama_pegawai', this.form.nama_pegawai);
                this.customer.append('email_pegawai', this.form.email_pegawai);
                this.customer.append('tanggal_lahir_pegawai', this.form.tanggal_lahir_pegawai);
                this.customer.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.customer.append('no_telp_pegawai', this.form.no_telp_pegawai);
                this.customer.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.customer.append('url_foto_pegawai', this.form.url_foto_pegawai);
                this.customer.append('isAktif', this.form.isAktif);


                var url = this.$api + '/customer/'
                this.load = true;
                this.$http.post(url, this.customer, {
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

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            update() {
                let newData = {
                    id_role: this.form.id_role,
                    nama_pegawai: this.form.nama_pegawai,
                    alamat_pegawai: this.form.alamat_pegawai,
                    email_pegawai: this.form.email_pegawai,
                    tanggal_lahir_pegawai: this.form.tanggal_lahir_pegawai,
                    jenis_kelamin_pegawai: this.form.jenis_kelamin_pegawai,
                    no_telp_pegawai: this.form.no_telp_pegawai,
                    password_pegawai: this.form.password_pegawai,
                    url_foto_pegawai: this.form.url_foto_pegawai,
                    isAktif: this.form.isAktif,
                };
                var url = this.$api + '/customer/' + this.editId;
                this.load = true;
                this.$http.put(url, newData, {
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
                var url = this.$api + '/customer/' + this.deleteId;
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
                this.editId = item.id_pegawai;
                console.log(this.editId);
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.alamat_pegawai = item.alamat_pegawai;
                this.form.email_pegawai = item.email_pegawai;
                this.form.tanggal_lahir_pegawai = item.tanggal_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
                this.form.no_telp_pegawai = item.no_telp_pegawai;
                this.form.url_foto_pegawai = item.url_foto_pegawai;
                this.form.isAktif = item.isAktif;
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
                    id_role: null,
                    nama_pegawai: null,
                    alamat_pegawai: null,
                    email_pegawai: null,
                    tanggal_lahir_pegawai: null,
                    jenis_kelamin_pegawai: null,
                    no_telp_pegawai: null,
                    password_pegawai: null,
                    url_foto_pegawai: null,
                    isAktif: null,
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
            this.readDataRole();
        },
    };
</script>