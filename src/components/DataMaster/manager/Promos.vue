<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Promo </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Promo </v-btn>
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
            <v-data-table :headers="headers" :items="promos" :search="search">
                <template v-slot:[`item.besar_diskon_promo`]="{item}">
                    <span>{{item.besar_diskon_promo}}%</span>
                </template>
                <template v-slot:[`item.status_promo`]="{item}">
                    <span v-if="item.status_promo == 'Aktif'"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Aktif</strong></v-chip></span>
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
                            <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_promo)"> Delete </v-btn></v-list-item-title>
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
                        <span class="h6, white--text">{{ formTitle }} Promo</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-text-field v-model="form.kode_promo" label="Kode Promo" :rules="messageRules" required></v-text-field>
                            <v-text-field v-model="form.jenis_promo" label="Jenis Promo" :rules="messageRules" required></v-text-field>
                            <v-text-field v-model="form.besar_diskon_promo" label="Besar Diskon Promo" :rules="messageRules" required></v-text-field>
                            <v-select :items="statusPromo" v-model="form.status_promo" :rules="messageRules" label="Status Promo" item-value="statusPromo" item-text="text"></v-select>
                            <v-textarea v-model="form.keterangan" label="Keterangan" :rules="messageRules" required></v-textarea>
                        </v-form>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn :class=" { valid, disabled: !valid }" color="blue darken-1" text @click="dialogConfirmUpdate = true"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmUpdate" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Apakah Kamu Yakin ingin {{this.inputType}} Data Promo Ini?
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
                    Anda Yakin Ingin menghapus Promo ini?
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
                statusPromo: [
                    {text: "Aktif", value: 'Aktif'},
                    {text: "Tidak Aktif", value: 'Tidak Aktif'},
                ],
                headers: [
                    { text: "Kode Promo", value: 'kode_promo' },
                    { text: "Jenis Promo", value: 'jenis_promo' },
                    { text: "Besar Diskon", value: 'besar_diskon_promo' },
                    { text: "Keterangan", value: 'keterangan' },
                    { text: "Status Promo", value: 'status_promo' },
                    { text: "Action", value: 'actions' },
                ],
                promo: new FormData,
                promos: [],
                form: {
                    kode_promo: null,
                    jenis_promo: null,
                    status_promo: null,
                    keterangan: null,
                    besar_diskon_promo: null,
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
            // Read Data Promos
            readData() {
                var url = this.$api + '/promo';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promos = response.data.data;
                })
            },

            save(){
                this.promo.append('kode_promo', this.form.kode_promo);
                this.promo.append('jenis_promo', this.form.jenis_promo);
                this.promo.append('besar_diskon_promo', this.form.besar_diskon_promo);
                this.promo.append('status_promo', this.form.status_promo);
                this.promo.append('keterangan', this.form.keterangan);

                var url = this.$api + '/promo'
                this.load = true;
                this.$http.post(url, this.promo, {
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
                    // this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    // this.snackbar = {
                    //     color: "error",
                    //     icon: "mdi-alert-circle",
                    //     mode: "multi-line",
                    //     position: "top",
                    //     timeout: 2000,
                    //     title: "Error",
                    //     visible: true
                    // };
                    this.snackbar1 = true;
                    this.color = "red";
                    this.load = false;
                });
            },

            update() {
                let newData = {
                    kode_promo: this.form.kode_promo,
                    jenis_promo: this.form.jenis_promo,
                    besar_diskon_promo: this.form.besar_diskon_promo,
                    status_promo: this.form.status_promo,
                    keterangan: this.form.keterangan
                };
                var url = this.$api + '/promo/' + this.editId;
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
                    this.clear();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    // this.snackbar = {
                    //     color: "error",
                    //     icon: "mdi-alert-circle",
                    //     mode: "multi-line",
                    //     position: "top",
                    //     timeout: 2000,
                    //     title: "Error",
                    //     visible: true
                    // };
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/promo/' + this.deleteId;
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
                    // this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.clear();
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
                    // this.color = "red";
                    // this.snackbar1 = true;
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id_promo;
                this.form.kode_promo = item.kode_promo;
                this.form.jenis_promo = item.jenis_promo;
                this.form.besar_diskon_promo = item.besar_diskon_promo;
                this.form.status_promo = item.status_promo;
                this.form.keterangan = item.keterangan;
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
                    kode_promo : null,
                    jenis_promo : null,
                    besar_diskon_promo : null,
                    status_promo : null,
                    keterangan : null,
                };
            },

            isAktifOn () {
                var url = this.$api + '/showbystatuspromo';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.promos = response.data.data;
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
        },
    };
</script>