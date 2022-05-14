<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Driver </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Driver </v-btn>
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
        
        <!-- <v-overlay :value="overlay"><v-img @click="overlay = !overlay" :src="$baseUrl+'/storage/'+this.form.url_foto_driver" height="100px" width="200px" style="object-fit:cover"/> </v-overlay> -->
        <v-overlay :value="overlay">
            <v-app-bar color="#00396c" max-height="50" max-width="550">
                <h2 style="color: white; margin-bottom: 8px;">Foto Profil Driver </h2> <v-icon @click="overlay = !overlay" style="margin-bottom: 10px; margin-left: 310px;">mdi-close-thick</v-icon>
            </v-app-bar>
            <v-img :src="$baseUrl+'/storage/'+this.BUATBANTUFOTO" height="550px" width="550px" />
        </v-overlay> 
        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="drivers" :search="search">
                <template v-slot:[`item.url_foto_driver`]="{item}">
                    <v-avatar>
                        <v-img @click="OverlayPreview(item)" :src="$baseUrl+'/storage/'+item.url_foto_driver" height="100px" width="200px" style="object-fit:cover"/> 
                    </v-avatar>
                    <!-- <v-overlay :value="overlay">
                        <v-app-bar color="#00396c" max-height="50">
                            <v-icon @click="overlay = !overlay" style="margin-bottom: 10px; margin-left: 550px;">mdi-close-thick</v-icon>
                        </v-app-bar>
                        <v-img :src="$baseUrl+'/storage/'+item.url_foto_driver" height="400px" width="610px" /> 
                    </v-overlay> -->
                </template>
                <template v-slot:[`item.tarif_sewa_driver`]="{item}">
                    <span>
                        Rp. {{ item.tarif_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.") }}</span>
                </template>
                <template v-slot:[`item.rerata_rating_driver`]="{item}">
                    <span v-for="rerata in rata2s" :key="rerata.id_driver">
                        <span v-if="item.id_driver == rerata.id_driver">
                            <span v-if="rerata.rata_rating != null">{{ rerata.rata_rating }} </span>
                            <span v-else>0</span>
                            <v-icon color="yellow darken-2"> mdi-star </v-icon>
                        </span>
                    </span>
                </template>
                <!-- <template v-slot:[`item.berkas_bebas_napza`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.berkas_bebas_napza" height="100px" width="200px" style="object-fit:cover"/> 
                </template>
                <template v-slot:[`item.berkas_sim`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.berkas_sim" height="100px" width="200px" style="object-fit:cover"/> 
                </template>
                <template v-slot:[`item.berkas_sehat_jiwa`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.berkas_sehat_jiwa" height="100px" width="200px" style="object-fit:cover"/> 
                </template>
                <template v-slot:[`item.berkas_sehat_jasmani`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.berkas_sehat_jasmani" height="100px" width="200px" style="object-fit:cover"/> 
                </template>
                <template v-slot:[`item.berkas_skck`]="{item}">
                    <v-img :src="$baseUrl+'/storage/'+item.berkas_skck" height="100px" width="200px" style="object-fit:cover"/> 
                </template> -->
                <template v-slot:[`item.isEnglish`]="{item}">
                    <span v-if="item.isEnglish == 1">
                        <v-icon color="blue darken-4">mdi-check-decagram</v-icon></span>
                    <!-- <span v-else><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>Tidak Bisa</strong></v-chip> </span> -->
                </template>
                <template v-slot:[`item.status_ketersediaan_driver`]="{item}">
                    <span v-if="item.status_ketersediaan_driver == 'Tersedia'">
                        <v-chip label color="green lighten-4" text-color="green darken-4"><strong>Tersedia</strong></v-chip></span>
                    <span v-else>
                        <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Tersedia</strong></v-chip> </span>
                </template>
                <template v-slot:[`item.isAktif`]="{item}">
                    <span v-if="item.isAktif == 1">
                        <v-chip label color="green lighten-4" text-color="green darken-4"><strong>Aktif</strong></v-chip></span>
                    <span v-else>
                        <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Aktif</strong></v-chip> </span>
                </template>
                <template v-slot:[`item.status_berkas`]="{item}">
                    <span v-if="item.status_berkas == 'Verified'">
                        <v-chip label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                    <span v-else>
                        <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Not Verified</strong></v-chip> </span>
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
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="editHandler(item)"> Edit </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_driver)"><strong> Delete </strong> </v-btn></v-list-item-title>
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
                        <span class="h6, white--text" style="justify-content: center;">{{ formTitle }} Driver</span>
                    </v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-text-field :rules="messageRules" v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
                            <v-textarea :rules="messageRules" v-model="form.alamat_driver" label="Alamat Driver" required></v-textarea>
                            <v-text-field :rules="messageRules" v-model="form.no_telp_driver" label="No. Telp Driver" required></v-text-field>
                            <v-text-field :rules="messageRules" type="date" v-model="form.tanggal_lahir_driver" label="Tanggal Lahir Driver" required></v-text-field>
                            <v-text-field :rules="messageRules" v-model="form.email_driver" label="Email Driver" required></v-text-field>
                            <v-select :rules="messageRules" :items="jenisKelamin" v-model="form.jenis_kelamin" label="Jenis Kelamin" item-value="value" item-text="text"></v-select>
                            <v-text-field :rules="messageRules" v-model="form.tarif_sewa_driver" label="Tarif Driver" required prefix="Rp. "></v-text-field>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Foto Driver" id="file" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Berkas Napza" id="berkasNapza" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Berkas SIM" id="sim" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Berkas Sehat Jiwa" id="sehatJiwa" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Berkas Sehat Jasmani" id="sehatJasmani" ref="fileGambar"></v-file-input>
                            <v-file-input rounded filled prepend-icon="mdi-camera" label="Berkas SKCK" id="skck" ref="fileGambar"></v-file-input>
                            <v-select :rules="messageRules" :items="bisaEnglish" v-model="form.isEnglish" label="Bisa Bahasa Inggris?" item-value="value" item-text="text"></v-select>
                            <v-select :rules="messageRules" :items="statusDriver" v-model="form.status_ketersediaan_driver" label="Status Tersedia Driver" item-value="value" item-text="text"></v-select>
                            <v-select :rules="messageRules" :items="statusAktifDriver" v-model="form.isAktif" label="Status Driver" item-value="value" item-text="text"></v-select>
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
                <v-card-title class="justify-center">
                    <span><v-chip label color="red lighten-4" text-color="red darken-4"><strong>WARNING</strong></v-chip> </span>
                    <!-- <span class="headline">Warning!</span> -->
                </v-card-title>

                <v-card-text>
                    Anda Yakin Ingin menghapus Driver ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="red darken-1" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogVerifikasi" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda ingin Verifikasi Berkas Driver ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogVerifikasi = false"> No </v-btn>
                    <v-btn color="blue darken-1" text @click="verifyBerkas"> Yes </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <v-overlay :value="overlay">
            <img @click="overlay = !overlay" :src="$baseUrl+'/storage/'+this.url_foto_driver" height="100px" width="200px" style="object-fit:cover"> 
        </v-overlay> -->
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
                            <h2 style="color: white;">Detail Driver : <span style="margin-left: 230px"><v-icon color="white" @click="closeDrawerDetail">mdi-close-thick </v-icon></span></h2> 
                            <!-- <h6>Name: </h6> -->
                        </v-app-bar>
                    </template>
                    

                    <v-divider></v-divider>

                    <v-list style="padding-left: 20px;">
                        <v-list-item-content>
                            <v-list-item-title style="margin-top: 60px; margin-bottom: 20px;"><strong> Nama Driver <span style="margin-left: 70px;"> :</span> </strong> {{this.data.nama_driver}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Email <span style="margin-left: 119px;"> :</span> </strong> {{this.data.email_driver}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Tanggal Lahir<span style="margin-left: 61px;"> :</span> </strong> {{this.data.tanggal_lahir_driver}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Alamat <span style="margin-left: 107px;"> :</span> </strong> {{this.data.alamat_driver}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 20px;"><strong> Jenis Kelamin <span style="margin-left: 56px;"> :</span> </strong> {{this.data.jenis_kelamin}}</v-list-item-title>
                            <v-list-item-title style="margin-bottom: 10px;"><strong> Berkas Bebas Napza <span style="margin-left: 10px;"> :</span> </strong> </v-list-item-title>
                            <v-list-item-title>
                                <v-img :src="$baseUrl+'/storage/'+this.data.berkas_bebas_napza" height="500px" width="400px" style="object-fit:cover"/> 
                            
                            </v-list-item-title>

                            <v-list-item-title style="margin-top: 20px; margin-bottom: 10px;"><strong> Berkas SIM <span style="margin-left: 75px;"> :</span> </strong> </v-list-item-title>
                            <v-list-item-title>
                                <v-img :src="$baseUrl+'/storage/'+this.data.berkas_sim" height="500px" width="400px" style="object-fit:cover"/>
                                <!-- <v-overlay :value="overlay_sim">
                                    <v-app-bar color="#00396c" max-height="50">
                                        <v-icon @click="overlay_sim = !overlay_sim" style="margin-bottom: 10px; margin-left: 350px;">mdi-close-thick</v-icon>
                                    </v-app-bar>
                                    <v-img :src="$baseUrl+'/storage/'+this.data.berkas_sim" height="400px" width="410px" />
                                </v-overlay>  -->
                            </v-list-item-title>
                            <v-list-item-title style="margin-top: 20px; margin-bottom: 10px;"><strong> Berkas Sehat Jiwa <span style="margin-left: 25px;"> :</span> </strong> </v-list-item-title>
                            <v-list-item-title>
                                <v-img :src="$baseUrl+'/storage/'+this.data.berkas_sehat_jiwa" height="500px" width="400px" style="object-fit:cover"/>
                                <!-- <v-overlay :value="overlay_jiwa">
                                    <v-app-bar color="#00396c" max-height="50">
                                        <v-icon @click="overlay_jiwa = !overlay_jiwa" style="margin-bottom: 10px; margin-left: 350px;">mdi-close-thick</v-icon>
                                    </v-app-bar>
                                    <v-img :src="$baseUrl+'/storage/'+this.data.berkas_sehat_jiwa" height="400px" width="410px" />
                                </v-overlay>  -->
                            </v-list-item-title>
                            <v-list-item-title style="margin-top: 20px; margin-bottom: 10px;"><strong> Berkas Sehat Jasmani : </strong> </v-list-item-title>
                            <v-list-item-title><v-img :src="$baseUrl+'/storage/'+this.data.berkas_sehat_jasmani" height="500px" width="400px" style="object-fit:cover"/> </v-list-item-title>
                            <v-list-item-title style="margin-top: 20px; margin-bottom: 10px;"><strong> Berkas SKCK <span style="margin-left: 65px;"> :</span> </strong> </v-list-item-title>
                            <v-list-item-title><v-img :src="$baseUrl+'/storage/'+this.data.berkas_skck" height="500px" width="400px" style="object-fit:cover"/> </v-list-item-title>
                            <span style="margin-top: 20px;" v-if="this.data.status_berkas == 'Verified'">
                                <strong>Status Berkas <span style="margin-left: 60px;"> :</span></strong><v-chip style="margin-left: 20px" label color="green lighten-4" text-color="green darken-4"><strong>Verified</strong></v-chip></span>
                            <span style="margin-top: 20px;" v-else>
                                <strong>Status Berkas <span style="margin-left: 60px;"> :</span></strong><v-chip style="margin-left: 20px" label color="red lighten-4" text-color="red darken-4"><strong>Not verified</strong></v-chip> </span>
                        </v-list-item-content>
                    </v-list>
                </v-navigation-drawer>
        <!-- <v-overlay :value="overlay_napza">
            <v-img :src="$baseUrl+'/storage/'+this.BANTUNAPZA" height="400px" width="610px" />
        </v-overlay>

        <v-overlay :value="overlay_sim">
            <v-img :src="$baseUrl+'/storage/'+this.BANTUSIM" height="400px" width="410px" />
        </v-overlay>  -->

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

        <v-snackbar v-model="snackbarSudahVerifikasi" :color="color" timeout="2000" top>
            Anda Sudah Verifikasi Driver ini
        </v-snackbar>
    </v-main>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                inputType: 'Tambah',
                rata2s: [],
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
                BANTUNAPZA: '',
                BANTUSIM: '',
                BANTUJIWA: '',
                BANTUJASMANI: '',
                BANTUSKCK: '',
                drawer: null,
                previewImageUrl: '',
                overlay: false,
                overlay_napza: null,
                overlay_sim: null,
                overlay_jiwa: null,
                overlay_jasmani: null,
                overlay_skck: null,
                valid: false,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                items: [
                { title: 'Home', icon: 'mdi-view-dashboard' },
                { title: 'About', icon: 'mdi-forum' },
                ],
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogVerifikasi: false,
                jenisKelamin: [
                    {text: "Laki - Laki", value: "laki-laki"},
                    {text: "Perempuan", value: "perempuan"},
                ],
                bisaEnglish:[
                    {text: "Bisa", value: 1},
                    {text: "Tidak Bisa", value: 2},
                ],
                statusDriver:[
                    {text: "Tersedia", value: "Tersedia"},
                    {text: "Tidak Tersedia", value: "Tidak Tersedia"},
                ],
                statusAktifDriver: [
                    {text: "Aktif", value: 1},
                    {text: "Tidak Aktif", value: 2},
                ],
                statusBerkas:[
                    {text: "Verified", value: "Verified"},
                    {text: "Not Verified", value: "Not Verified"},
                ],
                headers: [
                    { text: " ", value: 'url_foto_driver' },
                    { text: "Nama Driver", value: 'nama_driver', width: '150px'},
                    // { text: "Alamat", value: 'alamat_driver' },
                    // { text: "Email", value: 'email_driver' },
                    // { text: "Tanggal Lahir", value: 'tanggal_lahir_driver' },
                    // { text: "Jenis Kelamin", value: 'jenis_kelamin' },
                    { text: "No. Telp Driver", value: 'no_telp_driver' },
                    { text: "Tarif Sewa", value: 'tarif_sewa_driver', width: '120px' },
                    // { text: "Berkas Bebas Napza", value: 'berkas_bebas_napza' },
                    // { text: "Berkas SIM", value: 'berkas_sim' },
                    // { text: "Berkas Sehat Jiwa", value: 'berkas_sehat_jiwa' },
                    // { text: "Berkas Sehat Jasmani", value: 'berkas_sehat_jasmani' },
                    // { text: "Berkas SKCK", value: 'berkas_skck' },
                    { text: "Rerata Driver", value: 'rerata_rating_driver', width: '90px' },
                    { text: "Status Ketersediaan", value: 'status_ketersediaan_driver' },
                    { text: "Status Berkas", value: 'status_berkas' },
                    { text: "Bahasa Inggris", value: 'isEnglish' },
                    { text: "Status Aktif", value: 'isAktif' },
                    { text: "Action", value: 'actions' },
                ],

                driver: new FormData,
                drivers: [
                ],
                form: {
                    nama_driver: null,
                    alamat_driver: null,
                    email_driver: null,
                    status_ketersediaan_driver: null,
                    status_berkas: null,
                    isEnglish: null,
                    tanggal_lahir_driver: null,
                    jenis_kelamin: null,
                    no_telp_driver: null,
                    url_foto_driver: null,
                    password: null,
                    tarif_sewa_driver: null,
                    berkas_bebas_napza: null,
                    berkas_sim: null,
                    berkas_sehat_jiwa: null,
                    berkas_sehat_jasmani: null,
                    berkas_skck: null,
                    rerata_rating_driver: null,
                    isAktif: null,
                },
                data: {
                    nama_driver: null,
                    alamat_driver: null,
                    email_driver: null,
                    status_ketersediaan_driver: null,
                    status_berkas: null,
                    isEnglish: null,
                    tanggal_lahir_driver: null,
                    jenis_kelamin: null,
                    no_telp_driver: null,
                    url_foto_driver: null,
                    password: null,
                    tarif_sewa_driver: null,
                    berkas_bebas_napza: null,
                    berkas_sim: null,
                    berkas_sehat_jiwa: null,
                    berkas_sehat_jasmani: null,
                    berkas_skck: null,
                    rerata_rating_driver: null,
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
            },
            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
                
            },
            // Read Data Drivers
            readData() {
                var url = this.$api + '/driver';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            readDataRerataDriver() {
                // ini di TransaksiController
                var url = this.$api + '/getreratadriverfortable';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.rata2s = response.data.data;
                })
            },

            isAktifOn () {
                var url = this.$api + '/showbyaktifdriver';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.drivers = response.data.data;
                })
            },

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            save(){
                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver',this.form.alamat_driver);
                this.driver.append('email_driver',this.form.email_driver);
                this.driver.append('status_ketersediaan_driver',this.form.status_ketersediaan_driver);
                this.driver.append('isEnglish',this.form.isEnglish);
                this.driver.append('tanggal_lahir_driver',this.form.tanggal_lahir_driver);
                this.driver.append('jenis_kelamin',this.form.jenis_kelamin);
                this.driver.append('no_telp_driver',this.form.no_telp_driver);
                this.driver.append('tarif_sewa_driver',this.form.tarif_sewa_driver);
                this.driver.append('isAktif',this.form.isAktif);

                var temp_napza = document.getElementById("berkasNapza");
                this.driver.append('berkas_bebas_napza', temp_napza.files[0]);

                var temp_sim = document.getElementById("sim");
                this.driver.append('berkas_sim', temp_sim.files[0]);

                var temp_jiwa = document.getElementById("sehatJiwa");
                this.driver.append('berkas_sehat_jiwa', temp_jiwa.files[0]);
                // console.log(temp_jiwa.files[0]);

                var temp_jasmani = document.getElementById("sehatJasmani");
                this.driver.append('berkas_sehat_jasmani', temp_jasmani.files[0]);

                var temp_skck = document.getElementById("skck");
                this.driver.append('berkas_skck', temp_skck.files[0]);

                var temp_foto = document.getElementById("file");
                this.driver.append('url_foto_driver', temp_foto.files[0]);

                // this.driver.append('rerata_rating_driver',this.form.rerata_rating_driver);
                this.driver.append('isAktif',this.form.isAktif);

                var url = this.$api + '/driver/'
                this.load = true;
                this.$http.post(url, this.driver, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    location.reload();
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
                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver',this.form.alamat_driver);
                this.driver.append('email_driver',this.form.email_driver);
                this.driver.append('status_ketersediaan_driver',this.form.status_ketersediaan_driver);
                this.driver.append('isEnglish',this.form.isEnglish);
                this.driver.append('tanggal_lahir_driver',this.form.tanggal_lahir_driver);
                this.driver.append('jenis_kelamin',this.form.jenis_kelamin);
                this.driver.append('no_telp_driver',this.form.no_telp_driver);
                this.driver.append('password',this.form.password);
                this.driver.append('tarif_sewa_driver',this.form.tarif_sewa_driver);
                this.driver.append('isAktif',this.form.isAktif);

                var temp_napza = document.getElementById("berkasNapza");
                var temp_sim = document.getElementById("sim");
                var temp_jiwa = document.getElementById("sehatJiwa");
                var temp_jasmani = document.getElementById("sehatJasmani");
                var temp_skck = document.getElementById("skck");
                var temp_foto = document.getElementById("file");
                if(temp_foto.files[0]){
                    this.driver.append('url_foto_driver', temp_foto.files[0]);
                }
                if(temp_napza.files[0]){
                    this.driver.append('berkas_bebas_napza', temp_napza.files[0]);
                }
                if(temp_sim.files[0]){
                    this.driver.append('berkas_sim', temp_sim.files[0]);
                }
                if(temp_jiwa.files[0]){
                    this.driver.append('berkas_sehat_jiwa', temp_jiwa.files[0]);
                }
                if(temp_jasmani.files[0]){
                    this.driver.append('berkas_sehat_jasmani', temp_jasmani.files[0]);
                }
                if(temp_skck.files[0]){
                    this.driver.append('berkas_skck', temp_skck.files[0]);
                }

                var url = this.$api + '/driver/' + this.editId;
                this.load = true;
                this.$http.post(url, this.driver, {
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
                    this.inputType = 'Tambah';
                    if(temp_foto.files[0] || temp_napza.files[0] || temp_sim.files[0] || temp_jiwa.files[0]
                        || temp_jasmani.files[0] || temp_skck.files[0]){
                        location.reload();
                    }
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/driver/' + this.deleteId;
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
                    // this.snackbar = true;
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id_driver;
                this.form.id_driver = item.id_driver;
                this.form.nama_driver = item.nama_driver;
                this.form.alamat_driver = item.alamat_driver;
                this.form.email_driver = item.email_driver;
                this.form.status_ketersediaan_driver = item.status_ketersediaan_driver;
                this.form.isEnglish = item.isEnglish;
                this.form.tanggal_lahir_driver = item.tanggal_lahir_driver;
                this.form.jenis_kelamin = item.jenis_kelamin;
                this.form.no_telp_driver = item.no_telp_driver;
                this.form.url_foto_driver = item.url_foto_driver;
                this.form.password = item.password;
                this.form.tarif_sewa_driver = item.tarif_sewa_driver;
                this.form.berkas_bebas_napza = item.berkas_bebas_napza;
                this.form.berkas_sim = item.berkas_sim;
                this.form.berkas_sehat_jiwa = item.berkas_sehat_jiwa;
                this.form.berkas_sehat_jasmani = item.berkas_sehat_jasmani;
                this.form.berkas_skck = item.berkas_skck;
                this.form.rerata_rating_driver = item.rerata_rating_driver;
                this.form.isAktif = item.isAktif;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },

            verifyBerkasHandler(item){
                this.editId = item.id_driver;
                this.form.status_berkas = item.status_berkas;
                this.dialogVerifikasi = true;
            },

            verifyBerkas(){
                if(this.form.status_berkas == 'Not Verified'){
                    this.driver.append('status_berkas', 'Verified');
                    var url = this.$api + '/updateberkasdriver/' + this.editId;
                    this.load = true;
                    this.$http.post(url, this.driver, {
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
                    this.error_message = 'Anda Sudah Verifikasi Driver ini';
                    this.dialogVerifikasi = false;
                    // this.snackbarSudahVerifikasi = true;
                }
            },

            detailScreen(item){
                this.data.berkas_bebas_napza = item.berkas_bebas_napza;
                this.data.berkas_sim = item.berkas_sim;
                this.data.berkas_sehat_jiwa = item.berkas_sehat_jiwa;
                this.data.berkas_sehat_jasmani = item.berkas_sehat_jasmani;
                this.data.berkas_skck = item.berkas_skck;
                this.data.status_berkas = item.status_berkas;
                this.data.nama_driver = item.nama_driver;
                this.data.alamat_driver = item.alamat_driver;
                this.data.jenis_kelamin = item.jenis_kelamin;
                this.data.email_driver = item.email_driver;
                this.data.tanggal_lahir_driver = item.tanggal_lahir_driver;
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
                // this.inputType = 'Tambah';
                var temp_napza = document.getElementById("berkasNapza");
                var temp_sim = document.getElementById("sim");
                var temp_jiwa = document.getElementById("sehatJiwa");
                var temp_jasmani = document.getElementById("sehatJasmani");
                var temp_skck = document.getElementById("skck");
                var temp_foto = document.getElementById("file");
                if(temp_foto.files[0] || temp_napza.files[0] || temp_sim.files[0] || temp_jiwa.files[0]
                    || temp_jasmani.files[0] || temp_skck.files[0]){
                    location.reload();
                }
            },

            resetForm(){
                this.form = {
                    nama_driver: null,
                    alamat_driver: null,
                    email_driver: null,
                    status_ketersediaan_driver: null,
                    status_berkas: null,
                    isEnglish: null,
                    tanggal_lahir_driver: null,
                    jenis_kelamin: null,
                    no_telp_driver: null,
                    url_foto_driver: null,
                    password: null,
                    tarif_sewa_driver: null,
                    berkas_bebas_napza: null,
                    berkas_sim: null,
                    berkas_sehat_jiwa: null,
                    berkas_sehat_jasmani: null,
                    berkas_skck: null,
                    rerata_rating_driver: null,
                    isAktif: null,
                };
            },

            closeDrawerDetail(){
                this.drawer = !this.drawer;
                this.overlay_napza = !this.overlay_napza;
                this.overlay_sim = !this.overlay_sim;
                this.overlay_jiwa = !this.overlay_jiwa;
                this.overlay_jasmani = !this.overlay_jasmani;
                this.overlay_skck = !this.overlay_skck;
            },

            OverlayPreview(item){
                this.BUATBANTUFOTO = item.url_foto_driver;
                this.overlay = !this.overlay;
            },

            OverlayNapza(item){
                this.BANTUNAPZA = item.berkas_bebas_napza;
                this.overlay_napza = !this.overlay_napza;
            },

            OverlaySim(item){
                this.BANTUSIM = item.berkas_sim;
                this.overlay_napza = !this.overlay_napza;
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
            this.readDataRerataDriver();
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