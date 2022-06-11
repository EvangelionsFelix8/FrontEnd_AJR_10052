<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Mitra </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Mitra </v-btn>
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
            <v-data-table :headers="headers" :items="mitras" :search="search">
                <template v-slot:[`item.isAktif`]="{item}">
                    <span v-if="item.isAktif == 1"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Aktif</strong></v-chip></span>
                    <span v-else><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Aktif</strong></v-chip> </span>
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
                            <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_mitra)"> Delete </v-btn></v-list-item-title>
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
                        <span class="h6, white--text">{{ formTitle }} Mitra</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-text-field :rules="messageRules" v-model="form.nama_mitra" label="Nama Mitra" required></v-text-field>
                            <v-textarea :rules="messageRules" v-model="form.alamat_mitra" label="Alamat Mitra" required></v-textarea>
                            <v-text-field :rules="messageRules" v-model="form.no_telp_mitra" label="No. Telp Mitra" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.no_ktp_mitra" label="No. KTP Mitra" required></v-text-field>
                            <v-select :rules="messageRules" :items="statusMitra" v-model="form.isAktif" label="Status Mitra" item-value="value" item-text="text"></v-select>
                        </v-form>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="dialogConfirmUpdate = true"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmUpdate" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Apakah Kamu Yakin ingin {{this.inputType}} Data Mitra Ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirmUpdate = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda Yakin Ingin menghapus Mitra ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
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
                dialogConfirmUpdate: false,
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                statusMitra: [
                    {text: "Aktif", value: 1},
                    {text: "Tidak Aktif", value: 2},
                ],
                headers: [
                    { text: "Nama Mitra", value: 'nama_mitra' },
                    { text: "Alamat Mitra", value: 'alamat_mitra' },
                    { text: "No. Telp Mitra", value: 'no_telp_mitra' },
                    { text: "No. KTP Mitra", value: 'no_ktp_mitra' },
                    { text: "Status Mitra", value: 'isAktif' },
                    { text: "Action", value: 'actions' },
                ],
                mitra: new FormData,
                mitras: [
                ],
                form: {
                    nama_mitra: null,
                    alamat_mitra: null,
                    no_telp_mitra: null,
                    no_ktp_mitra: null,
                    isAktif: null,
                },
                deleteId: '',
                editId: '',
                tags: [
                    'Edit',
                    'Delete',
                ],
            };
        },
        methods: {
            clear() {
                this.$refs.form.reset() // clear form login
            },

            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            // Read Data Mitras
            readData() {
                var url = this.$api + '/mitra';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mitras = response.data.data;
                })
            },

            isAktifOn () {
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
                this.mitra.append('nama_mitra', this.form.nama_mitra);
                this.mitra.append('alamat_mitra', this.form.alamat_mitra);
                this.mitra.append('no_telp_mitra', this.form.no_telp_mitra);
                this.mitra.append('no_ktp_mitra', this.form.no_ktp_mitra);
                this.mitra.append('isAktif', this.form.isAktif);


                var url = this.$api + '/mitra/'
                this.load = true;
                this.$http.post(url, this.mitra, {
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
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            update() {
                let newData = {
                    nama_mitra: this.form.nama_mitra,
                    alamat_mitra: this.form.alamat_mitra,
                    no_telp_mitra: this.form.no_telp_mitra,
                    no_ktp_mitra: this.form.no_ktp_mitra,
                    isAktif: this.form.isAktif
                };
                var url = this.$api + '/mitra/' + this.editId;
                this.load = true;
                this.$http.put(url, newData, {
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
                var url = this.$api + '/mitra/' + this.deleteId;
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
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id_mitra;
                this.form.nama_mitra = item.nama_mitra;
                this.form.alamat_mitra = item.alamat_mitra;
                this.form.no_telp_mitra = item.no_telp_mitra;
                this.form.no_ktp_mitra = item.no_ktp_mitra;
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
                this.dialogConfirmUpdate = false;
                this.readData();
                this.clear();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.dialogConfirmUpdate = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    nama_mitra : null,
                    alamat_mitra : null,
                    no_telp_mitra : null,
                    no_ktp_mitra : null,
                    isAktif : null,
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
        },
    };
</script>