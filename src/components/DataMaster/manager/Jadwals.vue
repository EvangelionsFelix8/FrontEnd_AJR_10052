<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Jadwal </h3>
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

                <v-btn color="success" dark @click="dialog = true"> Tambah Jadwal </v-btn>
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
            <v-data-table :headers="headers" :items="jadwals" :search="search">
                <template v-slot:[`item.jam_kerja`]="{item}">
                    <span v-if="item.shift == 1"><v-chip label color="yellow lighten-4" text-color="yellow darken-4"> <strong> 08.00 - 15.00 </strong> </v-chip></span>
                    <span v-else><v-chip label color="deep-orange lighten-4" text-color="deep-orange darken-4"><strong> 15.00 - 22.00 </strong></v-chip></span>
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
                            <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_jadwal)"> Delete </v-btn></v-list-item-title>
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
                        <span class="h6, white--text">{{ formTitle }} Jadwal</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <!-- <v-text-field v-model="form.hari_kerja" label="Hari Kerja" :rules="messageRules" required></v-text-field> -->
                            <v-select :items="haris" v-model="form.hari_kerja" :rules="messageRules" label="Hari Kerja" item-value="value" item-text="text"></v-select>
                            <v-select :items="shifts" v-model="form.shift" :rules="messageRules" label="Shift" item-value="value" item-text="text"></v-select>
                            <!-- <v-text-field v-model="form.shift" label="Shift" :rules="messageRules" required></v-text-field> -->
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
                    Anda Yakin Ingin menghapus Jadwal ini?
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
                <v-icon>mdi-close</v-icon>
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
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                headers: [
                    { text: "Hari Kerja", value: 'hari_kerja' },
                    { text: "Shift", value: 'shift' },
                    { text: "Jam Kerja", value: 'jam_kerja' },
                    { text: "Action", value: 'actions' },
                ],
                haris: [
                    {text: 'Senin', value: 'Senin'},
                    {text: 'Selasa', value: 'Selasa'},
                    {text: 'Rabu', value: 'Rabu'},
                    {text: 'Kamis', value: 'Kamis'},
                    {text: 'Jumat', value: 'Jumat'},
                    {text: 'Sabtu', value: 'Sabtu'},
                    {text: 'Minggu', value: 'Minggu'},
                ],
                shifts: [
                    {text: 'Shift: 1 (08.00-15.00)', value: 1},
                    {text: 'Shift: 2 (15.00-22.00)', value: 2},
                ],
                jadwal: new FormData,
                jadwals: [],
                pegawais:[],
                form: {
                    hari_kerja: null,
                    shift: null,
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
            // Read Data Jadwals
            readData() {
                var url = this.$api + '/jadwal';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.jadwals = response.data.data;
                })
            },

            save(){
                this.jadwal.append('hari_kerja', this.form.hari_kerja);
                this.jadwal.append('shift', this.form.shift);

                var url = this.$api + '/jadwal'
                this.load = true;
                this.$http.post(url, this.jadwal, {
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
                    this.clear();
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    if(this.error_message == 'Pilihan Jadwal Sudah Ada'){
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
                        this.color = "red";
                        this.snackbar1 = true;
                    }
                    this.load = false;
                });
            },

            update() {
                let newData = {
                    hari_kerja: this.form.hari_kerja,
                    shift: this.form.shift,
                };
                var url = this.$api + '/jadwal/' + this.editId;
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
                    if(this.error_message == 'Pilihan Jadwal Sudah Ada'){
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
                        this.color = "red";
                        this.snackbar1 = true;
                    }
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/jadwal/' + this.deleteId;
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
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id_jadwal;
                this.form.hari_kerja = item.hari_kerja;
                this.form.shift = item.shift;
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
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    hari_kerja : null,
                    shift : null,
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