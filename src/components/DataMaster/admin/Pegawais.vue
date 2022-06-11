<template>
    <v-main class="list">
        <h3 style="font-size: 50px"> Pegawai </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Pegawai </v-btn>
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
        
        <v-overlay :value="overlay">
            <v-app-bar color="#00396c" max-height="50" max-width="550">
                <h2 style="color: white; margin-bottom: 8px;">Foto Profil Pegawai </h2> <v-icon @click="overlay = !overlay" style="margin-bottom: 10px; margin-left: 280px;">mdi-close-thick</v-icon>
            </v-app-bar>
            <v-img :src="$baseUrl+'/storage/'+this.BUATBANTUFOTO" height="550px" width="550px" />
        </v-overlay> 
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.url_foto_pegawai`]="{item}">
                    <v-avatar>
                        <v-img @click="OverlayPreview(item)" :src="$baseUrl+'/storage/'+item.url_foto_pegawai" height="100px" width="100px" style="object-fit:cover"/>
                    </v-avatar> 
                </template>
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
                        <span class="h6, white--text">{{ formTitle }} Pegawai</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-select :rules="messageRules" :items="roles" v-model="form.id_role" label="Jabatan" item-value="id_role" item-text="nama_role"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
                            <v-textarea :rules="messageRules" v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-textarea>
                            <v-text-field :rules="messageRules" v-model="form.email_pegawai" label="Email pegawai" required></v-text-field>
                            <v-text-field :rules="messageRules" :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)" type="date" v-model="form.tanggal_lahir_pegawai" label="Tanggal Lahir" required></v-text-field>
                            <v-select :rules="messageRules" :items="jenisKelamin" v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin" item-value="value" item-text="text"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.no_telp_pegawai" label="No. Telp Pegawai" required></v-text-field>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Foto Pegawai" id="file" ref="fileGambar"></v-file-input>
                            <!-- <input type="file" rounded filled prepend-icon="mdi-camera" label="Foto Pegawai" id="file" ref="fileGambar"><input> -->
                            <v-select :rules="messageRules" :items="statusPegawai" v-model="form.isAktif" label="Status Pegawai" item-value="value" item-text="text"></v-select>
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
                    Apakah Kamu Yakin ingin {{this.inputType}} Data Pegawai Ini?
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
                    Anda Yakin Ingin menghapus Pegawai ini?
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
                BUATBANTUFOTO: '',
                search: null,
                overlay: false,
                dialog: false,
                dialogConfirm: false,
                dialogConfirmUpdate: false,
                urlFoto: null,
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                jenisKelamin: [
                    {text: "Laki - Laki", value: "laki-laki"},
                    {text: "Perempuan", value: "perempuan"},
                ],
                statusPegawai: [
                    {text: "Aktif", value: 1},
                    {text: "Tidak Aktif", value: 2},
                ],
                previewImageUrl: '',
                headers: [
                    { text: "", value: 'url_foto_pegawai' },
                    { text: "Nama Pegawai", value: 'nama_pegawai' },
                    { text: "Jabatan", value: 'nama_role' },
                    { text: "Alamat Pegawai", value: 'alamat_pegawai', width: '225px' },
                    { text: "Email Pegawai", value: 'email_pegawai' },
                    { text: "Tanggal Lahir", value: 'tanggal_lahir_pegawai', width: '105px' },
                    { text: "Jenis Kelamin", value: 'jenis_kelamin_pegawai' },
                    { text: "No. Telp Pegawai", value: 'no_telp_pegawai' },
                    { text: "Status Pegawai", value: 'isAktif' },
                    { text: "Action", value: 'actions' },
                ],
                roles:[],
                pegawai: new FormData,
                pegawais: [],
                form: {
                    id_role: null,
                    nama_role: null,
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
            clear(){
                this.$refs.form.reset();
                // this.$refs.form.value = null;
                // this.$refs.fileGambar.value = null;
                // this.$refs.fileGambar.reset();
            },
            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            // Read Data Pegawais
            readData() {
                var url = this.$api + '/pegawai';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.pegawais = response.data.data;
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
                    this.pegawais = response.data.data;
                })
            },

            save(){
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
                this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
                this.pegawai.append('email_pegawai', this.form.email_pegawai);
                this.pegawai.append('tanggal_lahir_pegawai', this.form.tanggal_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('no_telp_pegawai', this.form.no_telp_pegawai);
                this.pegawai.append('isAktif', this.form.isAktif);

                var temp_foto = document.getElementById("file");
                this.pegawai.append('url_foto_pegawai', temp_foto.files[0]);

                var url = this.$api + '/pegawai/'
                this.load = true;
                this.$http.post(url, this.pegawai, {
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
                    // this.clear();
                });
            },

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            update() {
                var temp_foto = document.getElementById("file");
                
                if(temp_foto.files[0]){
                    this.pegawai.append('url_foto_pegawai', temp_foto.files[0]);
                }
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
                this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
                this.pegawai.append('email_pegawai', this.form.email_pegawai);
                this.pegawai.append('tanggal_lahir_pegawai', this.form.tanggal_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('no_telp_pegawai', this.form.no_telp_pegawai);
                this.pegawai.append('isAktif', this.form.isAktif);

                var url = this.$api + '/pegawai/' + this.editId;
                this.load = true;
                this.$http.post(url, this.pegawai, {
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
                    if(temp_foto.files[0]){
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

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/pegawai/' + this.deleteId;
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
                    // this.color = "red";
                    // this.snackbar1 = true;
                    this.load = false;
                    this.clear();
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id_pegawai;
                this.form.id_role = item.id_role;
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.alamat_pegawai = item.alamat_pegawai;
                this.form.email_pegawai = item.email_pegawai;
                this.form.tanggal_lahir_pegawai = item.tanggal_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
                this.form.no_telp_pegawai = item.no_telp_pegawai;
                this.form.url_foto_pegawai = item.url_foto_pegawai;
                this.form.isAktif = item.isAktif;
                this.dialog = true;
                this.urlFoto = item.url_foto_pegawai;
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

                var temp_foto = document.getElementById("file");
                if(temp_foto.files[0]){
                    location.reload();
                }
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.dialogConfirmUpdate = false;
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
                // this.$refs.form.reset();
                // this.$refs.form.value = null;
                // // this.$refs.fileGambar.value = null;
                // // this.$refs.fileGambar.reset();
            },

            OverlayPreview(item){
                this.BUATBANTUFOTO = item.url_foto_pegawai;
                this.overlay = !this.overlay;
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