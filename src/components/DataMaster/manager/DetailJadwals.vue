<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Pengaturan Jadwal </h3>

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

                <v-btn color="success" dark @click="dialog = true"> Tambah Penjadwalan </v-btn>
            </v-card-title>
        </v-card>
        
        <div class="text-center d-flex pb-4">
            <v-chip-group active-class="white--text">
                <v-chip
                    filter
                    color="white"
                    style="margin-top: 20px"
                    text-color="primary"
                    @click="all"
                > Open All Jadwal </v-chip>

                <v-chip
                    filter
                    color="white"
                    style="margin-top: 20px; margin-left: 10px"
                    text-color="primary"
                    @click='none'
                > Close All Jadwal</v-chip>
            </v-chip-group>
        </div>

        <v-row>
        <!-- HARI SELASA -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c">
                        <strong class="white--text">Selasa</strong>
                        <template v-slot:actions>
                            <v-icon color="white">
                                $expand
                            </v-icon>
                        </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_selasa" :search="search">             
                            <template v-slot:[`item.hari_kerja`]="{item}">
                                <span>{{item.nama_pegawai}} - {{ item.nama_role }} </span>
                                <!-- <span v-else>{{item.hari_kerja}} -  {{ item.shift }} </span> -->
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        <!-- HARI RABU -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel1" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c"><strong class="white--text">Rabu</strong>
                        <template v-slot:actions>
                            <v-icon color="white">
                                $expand
                            </v-icon>
                        </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_rabu" :search="search">             
                            <!-- <template v-slot:[`item.hari_kerja`]="{item}">
                                <span>{{item.nama_pegawai}} - {{ item.nama_role }} </span>
                            </template> -->
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        <!-- HARI KAMIS  -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel2" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c"><strong class="white--text">Kamis</strong>
                    <template v-slot:actions>
                        <v-icon color="white">
                            $expand
                        </v-icon>
                    </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_kamis" :search="search">             
                            <template v-slot:[`item.hari_kerja`]="{item}">
                                <span>{{item.nama_pegawai}} - {{ item.nama_role }} </span>
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        <!-- HARI JUMAT -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel3" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c"><strong class="white--text">Jumat</strong>
                    <template v-slot:actions>
                        <v-icon color="white">
                            $expand
                        </v-icon>
                    </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_jumat" :search="search">             
                            <template v-slot:[`item.hari_kerja`]="{item}">
                                <span>{{item.nama_pegawai}} - {{ item.nama_role }} </span>
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            
                            </template>

                        </v-data-table>
                    </v-expansion-panel-content>
                
                </v-expansion-panel>
                
                </v-expansion-panels>
            </v-col>
        <!-- HARI SABTU -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel4" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c"><strong class="white--text">Sabtu</strong>
                    <template v-slot:actions>
                        <v-icon color="white">
                            $expand
                        </v-icon>
                    </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_sabtu" :search="search">             
                            <!-- <template v-slot:[`item.hari_kerja`]="{item}">
                                <span v-if="item.hari_kerja == 'Selasa'">{{item.nama_pegawai}} - {{ item.nama_role }} </span>
                                <span v-else>{{item.hari_kerja}} -  {{ item.shift }} </span>
                            </template> -->
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            
                            </template>

                        </v-data-table>
                    </v-expansion-panel-content>
                
                </v-expansion-panel>
                
                </v-expansion-panels>
            </v-col>
        <!-- HARI MINGGU -->
            <v-col cols="6">
                <v-expansion-panels v-model="panel6" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header color="#00396c"><strong class="white--text">Minggu</strong>
                    <template v-slot:actions>
                        <v-icon color="white">
                            $expand
                        </v-icon>
                    </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table :headers="headers" :items="detailjadwals_minggu" :search="search">             
                            <!-- <template v-slot:[`item.hari_kerja`]="{item}">
                                <span v-if="item.hari_kerja == 'Selasa'">{{item.nama_pegawai}} - {{ item.nama_role }} </span>
                                <span v-else>{{item.hari_kerja}} -  {{ item.shift }} </span>
                            </template> -->
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
                                        <v-list-item-title><v-btn class="red--text" style="min-width: 100px;" small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn></v-list-item-title>
                                    </v-list>
                                </v-menu>
                            
                            </template>

                        </v-data-table>
                    </v-expansion-panel-content>
                
                </v-expansion-panel>
                
                </v-expansion-panels>
            </v-col>
        </v-row>

        <!-- <v-btn small class="mr-2" @click="editHandler(item)"> Edit </v-btn>
        <v-btn small @click="deleteHandler(item.id_detail_jadwal)"> Delete </v-btn> -->

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-card-title style="margin-left: 135px">
                        <span class="h6, white--text">{{ formTitle }} Penjadwalan Pegawai</span>
                    </v-card-title>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form">
                            <v-select :rules="messageRules" :items="pegawais" v-model="form.id_pegawai" label="Nama Pegawai" item-value="id_pegawai" :item-text="item => item.nama_pegawai +' - '+ item.nama_role"></v-select>
                            <v-select :rules="messageRules" :items="jadwals" v-model="form.id_jadwal" label="Hari Kerja" item-value="id_jadwal" :item-text="item => item.hari_kerja +' - '+ item.shift" ></v-select>
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
                    Anda Yakin Ingin menghapus Detailjadwal ini?
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
                panel: [],
                panel1: [],
                panel2: [],
                panel3: [],
                panel4: [],
                panel5: [],
                panel6: [],
                items: 7,
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
                    { text: "Nama Pegawai", value: 'nama_pegawai' },
                    { text: "Jabatan", value: 'nama_role' },
                    { text: "Shift", value: 'shift' },
                    { text: "Action", value: 'actions' },
                ],
                haris: [
                    {"text": "Selasa"},
                    {"text": "Rabu"},
                    {"text": "Kamis"},
                    {"text": "Jumat"},
                    {"text": "Sabtu"},
                    {"text": "Minggu"},
                ],
                detailjadwal: new FormData,
                detailjadwals: [],
                detailjadwals_selasa: [],
                detailjadwals_rabu: [],
                detailjadwals_kamis: [],
                detailjadwals_jumat: [],
                detailjadwals_sabtu: [],
                detailjadwals_minggu: [],
                jadwals:[],
                pegawais:[],
                form: {
                    id_jadwal: null,
                    id_pegawai: null,
                },
                deleteId: '',
                editId: '',
            };
        },
        methods: {
            all () {
                this.panel = [...Array(this.items).keys()].map((k, i) => i)
                this.panel1 = [...Array(this.items).keys()].map((k, i) => i)
                this.panel2 = [...Array(this.items).keys()].map((k, i) => i)
                this.panel3 = [...Array(this.items).keys()].map((k, i) => i)
                this.panel4 = [...Array(this.items).keys()].map((k, i) => i)
                this.panel5 = [...Array(this.items).keys()].map((k, i) => i)
                this.panel6 = [...Array(this.items).keys()].map((k, i) => i)
            },
            // Reset the panel
            none () {
                this.panel = []
                this.panel1 = []
                this.panel2 = []
                this.panel3 = []
                this.panel4 = []
                this.panel5 = []
                this.panel6 = []
            },

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
            // Read Data detailjadwals
            readData() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals = response.data.data;
                })
            },

            readDataSelasa() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_selasa';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_selasa = response.data.data;
                })
            },

            readDataRabu() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_rabu';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_rabu = response.data.data;
                })
            },

            readDataKamis() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_kamis';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_kamis = response.data.data;
                })
            },

            readDataJumat() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_jumat';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_jumat = response.data.data;
                })
            },

            readDataSabtu() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_sabtu';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_sabtu = response.data.data;
                })
            },

            readDataMinggu() {
                // console.log(detailjadwals['hari_kerja']);
                var url = this.$api + '/detailjadwal_minggu';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.detailjadwals_minggu = response.data.data;
                })
            },

            readDataJadwal() {
                var url = this.$api + '/jadwal';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.jadwals = response.data.data;
                })
            },
            
            readDataPegawai() {
                var url = this.$api + '/pegawai';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.pegawais = response.data.data;
                })
            },

            save(){
                this.detailjadwal.append('id_jadwal', this.form.id_jadwal);
                this.detailjadwal.append('id_pegawai', this.form.id_pegawai);
                // this.detailjadwal.append('hari_kerja', this.form.hari_kerja);
                // this.detailjadwal.append('nama_pegawai', this.form.nama_pegawai);
                // this.detailjadwal.append('nama_role', this.form.nama_role);
                // this.detailjadwal.append('shift', this.form.shift);

                var url = this.$api + '/detailjadwal/'
                this.load = true;
                this.$http.post(url, this.detailjadwal, {
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
                    this.readDataSelasa();
                    this.readDataRabu();
                    this.readDataKamis();
                    this.readDataJumat();
                    this.readDataSabtu();
                    this.readDataMinggu();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    if(this.error_message == 'Pegawai Sudah Mencapai Batas Maksimal Shift' || this.error_message == 'Pegawai Sudah Terjadwal pada jadwal ini'){
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
                    id_jadwal: this.form.id_jadwal,
                    id_pegawai: this.form.id_pegawai,
                };
                var url = this.$api + '/detailjadwal/' + this.editId;
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
                    this.readDataSelasa();
                    this.readDataRabu();
                    this.readDataKamis();
                    this.readDataJumat();
                    this.readDataSabtu();
                    this.readDataMinggu();
                    this.resetForm();
                    this.clear();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    if(this.error_message == 'Pegawai Sudah Terjadwal pada jadwal ini'){
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
                var url = this.$api + '/detailjadwal/' + this.deleteId;
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
                    this.readDataSelasa();
                    this.readDataRabu();
                    this.readDataKamis();
                    this.readDataJumat();
                    this.readDataSabtu();
                    this.readDataMinggu();
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
                this.editId = item.id_detail_jadwal;
                this.form.id_jadwal = item.id_jadwal;
                this.form.id_pegawai = item.id_pegawai;
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
                this.readDataSelasa();
                this.readDataRabu();
                this.readDataKamis();
                this.readDataJumat();
                this.readDataSabtu();
                this.readDataMinggu();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.readDataSelasa();
                this.readDataRabu();
                this.readDataKamis();
                this.readDataJumat();
                this.readDataSabtu();
                this.readDataMinggu();
                this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    id_jadwal : null,
                    id_pegawai : null,
                };
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readDataPegawai();
            this.readDataJadwal();
            this.readData();
            this.readDataSelasa();
            this.readDataRabu();
            this.readDataKamis();
            this.readDataJumat();
            this.readDataSabtu();
            this.readDataMinggu();
        },
    };
</script>

<style>
    .v-select__selection {
        width: 100%;
        justify-content: center;
    }
</style>