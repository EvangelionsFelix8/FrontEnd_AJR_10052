<template>
    <v-main class="list">
        <h3 style="font-size: 50px" mb-5> Riwayat Transaksi Anda </h3>

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
                
                <!-- <v-btn color="success" dark 
                @click="newTransaksi"> Transaksi Baru </v-btn> -->
            
            </v-card-title>
        </v-card>

        <v-card style='margin-top: 20px'>
            <v-data-table :headers="headers" :items="transaksis" :search="search">
                <template v-if="temp_banyak" v-slot:[`item.jumlah`]="{item}">
                    <span v-if="item.jumlah < 30 || item.jumlah > 0"><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Tersedia</strong></v-chip></span>
                    <span v-else><v-chip label color="red lighten-4" text-color="red darken-4"><strong>Tidak Tersedia</strong></v-chip> </span>
                </template>
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
                <template v-slot:[`item.status_transaksi`]="{item}">
                    <span v-if="item.status_transaksi == 'Menunggu Verifikasi'"><v-chip label color="indigo lighten-4" text-color="indigo darken-4"><strong>Menunggu Verifikasi</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'On Progress'"><v-chip label color="orange lighten-4" text-color="orange darken-4"><strong>On Progress</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'"><v-chip label color="blue lighten-4" text-color="blue darken-4"><strong>Sudah Bayar, Menunggu Verifikasi</strong></v-chip></span>
                    <span v-else-if="item.status_transaksi == 'Batal'"><v-chip label color="pink lighten-4" text-color="pink darken-4"><strong>Batal</strong></v-chip></span>
                    <span v-else><v-chip label color="green lighten-4" text-color="green darken-4"><strong>Sudah lunas (Selesai)</strong></v-chip> </span>
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
                            <v-list-item-title><v-btn style="min-width: 155px;" small @click="detailScreen(item)"> Detail </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn style="min-width: 155px;" small @click="editHandler(item)"> Edit </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn style="min-width: 100px;" small @click="kembaliMobil(item)"> Kembalikan Mobil </v-btn></v-list-item-title>
                            <v-list-item-title><v-btn style="min-width: 155px;" small @click="downloadNota(item)"> Cetak Nota </v-btn></v-list-item-title>
                            <!-- <v-list-item-title><v-btn style="min-width: 100px;" small @click="verifyBerkasHandler(item)"> Verifikasi </v-btn></v-list-item-title> -->
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

        <v-dialog v-model="showdialogKetentuan" persistent max-width="400px">
            <v-card>
                <v-app-bar color="#00396c" style="margin-bottom: 15px;">
                    <v-card-title style="color: white;">
                        Akan Terhitung Terlambat jika: 
                    </v-card-title>
                </v-app-bar>

                <v-card-text class="black--text">
                    1. Mengembalikan Mobil Terlambat 3 jam dari tanggal selesai Sewa
                </v-card-text>
                <v-card-text class="black--text">
                    2. Jika terlambat maka akan didenda harga 1 hari sewa baik mobil dan driver
                </v-card-text>

                <v-card-actions>
                    <v-btn color="blue darken-4" text @click="showdialogKetentuan = false"> Back </v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="blue darken-1" text @click="verifyBerkas"> Yes </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogMetodeBayar" persistent max-width="400px">
            <v-card>
                <v-app-bar color="#00396c" style="margin-bottom: 15px;">
                    <v-spacer></v-spacer>
                        <v-card-title style="color: white;">
                            Metode Pembayaran
                        </v-card-title>
                    <v-spacer></v-spacer>
                    
                </v-app-bar>

                <v-radio-group style="margin-left: 15px;" v-model="metodeBayar">
                    <v-radio value="Cash" label="Cash"></v-radio>
                    <v-radio value="Transfer" label="Transfer"></v-radio>
                </v-radio-group>

                <v-file-input style="margin: 15px;" v-if="metodeBayar == 'Transfer'" rounded filled 
                    prepend-icon="mdi-camera" 
                    label="Bukti Pembayaran" id="foto_bukti" ref="fileGambar">
                </v-file-input>

                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="dialogMetodeBayar = false"> Back </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="blue darken-4" @click="pembayaran"> Kirim </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- DIALOG BUAT DETAIL -->
        <v-dialog v-model="dialogDetail" persistent max-width="700px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-card-title style="color: white;">
                        DETAIL TRANSAKSI ({{this.data.id_transaksi}})
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-icon color="white" @click="cancel">
                        mdi-close-thick
                    </v-icon>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <v-card-text style="text-align: center; font-size: 20px;" class="black--text">Tanggal Transaksi <span style="margin-left: 6px;"> : </span><strong> {{this.data.tanggal_transaksi}} </strong> </v-card-text>
                        <v-row>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Mulai <span> : </span> {{this.data.tanggal_mulai}}</v-card-text>
                            </v-col>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Selesai <span> : </span> {{this.data.tanggal_selesai}}</v-card-text>
                            </v-col>
                        </v-row>
                        <v-card-text class="black--text">Durasi <span style="margin-left: 80px;"> : </span> 
                            <span v-if="Difference_In_Days > 1">{{Difference_In_Days}} Hari</span>
                            <span v-else>0 Hari</span>
                        </v-card-text>
                        <v-card-text class="black--text">Tanggal Kembali <span style="margin-left: 15px;"> : </span> 
                            <span v-if="this.data.tanggal_pengembalian != null">
                                {{this.data.tanggal_pengembalian}}
                                <span v-if="this.data.tanggal_pengembalian > this.data.tanggal_selesai">
                                    <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Terlambat</strong></v-chip>
                                </span>
                            </span>
                            <span v-else> - </span>
                        </v-card-text>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> MOBIL </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Mobil</v-card-text>
                                <v-card-text class="black--text">Harga Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.nama_mobil}}</v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.harga_sewa_mobil > 1">{{this.data.harga_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_mobil > 1">{{this.data.total_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> DRIVER </strong> </span>

                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Driver</v-card-text>
                                <v-card-text class="black--text">Tarif Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.nama_driver === ''"> - </span>
                                    <span v-else> {{this.data.nama_driver}} </span>
                                </v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.tarif_sewa_driver > 1">{{this.data.tarif_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_driver > 1">{{this.data.total_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> PROMO </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Jenis Promo</v-card-text>
                                <v-card-text class="black--text">Diskon Promo</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.jenis_promo}}</v-card-text>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.besar_diskon_promo > 1">{{this.data.besar_diskon_promo}}%</span>
                                    <span v-else>0%</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8" >
                                <v-card-text class="black--text"></v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp
                                    <span v-if="(this.data.total_harga - this.data.total_denda) > 1">{{(this.data.total_harga - this.data.total_denda).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="8">
                                <v-card-text class="black--text">Denda Mobil </v-card-text>
                                <v-card-text class="black--text">Denda Driver </v-card-text>
                                <v-card-text class="black--text">Diskon </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_mobil > 1">{{this.data.biaya_eksten_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_driver > 1">{{this.data.biaya_eksten_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                 <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.potongan_promo > 1">({{this.data.potongan_promo.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}})</span>
                                    <span v-else>( 0 )</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8">
                                <v-card-text style="font-size: 18px;" class="black--text">
                                    <strong>
                                        Total Harga
                                    </strong>
                                </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text style="font-size: 18px;" class="black--text"><strong> Rp </strong>
                                    <span v-if="(this.data.total_harga - this.data.potongan_promo) > 1">
                                        <strong>
                                            {{(this.data.total_harga - this.data.potongan_promo).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}
                                        </strong>
                                    </span>
                                    <span v-else><strong>0</strong></span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-btn style="min-width: 155px;" small @click="downloadNota(item)"> Cetak Nota </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBayar" persistent max-width="700px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-card-title style="color: white;">
                        TRANSAKSI ANDA
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-icon color="white" @click="cancel">
                        mdi-close-thick
                    </v-icon>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <v-card-text style="text-align: center; font-size: 20px;" class="black--text">Tanggal Transaksi <span style="margin-left: 6px;"> : </span><strong> {{this.data.tanggal_transaksi}} </strong> </v-card-text>
                        <v-row>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Mulai <span> : </span> {{this.data.tanggal_mulai}}</v-card-text>
                            </v-col>
                            <v-col>
                            <v-card-text class="black--text">Tanggal Selesai <span> : </span> {{this.data.tanggal_selesai}}</v-card-text>
                            </v-col>
                        </v-row>
                        <v-card-text class="black--text">Durasi <span style="margin-left: 80px;"> : </span> 
                            <span v-if="Difference_In_Days > 1">{{Difference_In_Days}} Hari</span>
                            <span v-else>0 Hari</span>
                        </v-card-text>
                        <v-card-text class="black--text">Tanggal Kembali <span style="margin-left: 15px;"> : </span> 
                            <span v-if="this.data.tanggal_pengembalian != null">
                                {{this.data.tanggal_pengembalian_tampil}}
                                <span v-if="this.data.tanggal_pengembalian > this.data.tanggal_selesai">
                                    <v-chip label color="red lighten-4" text-color="red darken-4"><strong>Terlambat</strong></v-chip>
                                </span>
                            </span>
                            <span v-else> - </span>
                        </v-card-text>
                        <v-btn small color="blue darken-4" text @click="showdialogKetentuan = true">ketentuan terlambat</v-btn>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> MOBIL </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Mobil</v-card-text>
                                <v-card-text class="black--text">Harga Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.nama_mobil}}</v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.harga_sewa_mobil > 1">{{this.data.harga_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_mobil > 1">{{this.data.total_sewa_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> DRIVER </strong> </span>

                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Nama Driver</v-card-text>
                                <v-card-text class="black--text">Tarif Sewa</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.nama_driver === ''"> - </span>
                                    <span v-else> {{this.data.nama_driver}} </span>
                                </v-card-text>
                                <v-card-text class="black--text">: Rp
                                    <span v-if="this.data.tarif_sewa_driver > 1">{{this.data.tarif_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}/hari</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-card-text class="black--text">Sub Total </v-card-text>
                            </v-col>
                            <v-col>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text"> Rp
                                    <span v-if="this.data.total_sewa_driver > 1">{{this.data.total_sewa_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>
                        <br>
                        <span style="margin-left: 15px; color: black;"> <strong> PROMO </strong> </span>
                        <v-row>
                            <v-col cols="3">
                                <v-card-text class="black--text">Jenis Promo</v-card-text>
                                <v-card-text class="black--text">Diskon Promo</v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">: {{this.data.jenis_promo}}</v-card-text>
                                <v-card-text class="black--text">:
                                    <span v-if="this.data.besar_diskon_promo > 1">{{this.data.besar_diskon_promo}}%</span>
                                    <span v-else>0%</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        
                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8" >
                                <v-card-text class="black--text"></v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp
                                    <span v-if="this.data.total_harga > 1">{{(this.data.total_harga - this.data.total_denda).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="8">
                                <v-card-text class="black--text">Denda Mobil </v-card-text>
                                <v-card-text class="black--text">Denda Driver </v-card-text>
                                <v-card-text class="black--text">Diskon </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_mobil > 1">{{this.data.biaya_eksten_mobil.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.biaya_eksten_driver > 1">{{this.data.biaya_eksten_driver.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}</span>
                                    <span v-else>0</span>
                                </v-card-text>
                                 <v-card-text class="black--text">Rp 
                                    <span v-if="this.data.potongan_promo > 1">({{this.data.potongan_promo.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}})</span>
                                    <span v-else>( 0 )</span>
                                </v-card-text>
                            </v-col>
                        </v-row>

                        <v-divider class="grey"></v-divider>

                        <v-row>
                            <v-col cols="8">
                                <v-card-text style="font-size: 18px;" class="black--text">
                                    <strong>
                                        Total Harga
                                    </strong>
                                </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-text style="font-size: 18px;" class="black--text"><strong> Rp </strong>
                                    <span v-if="(this.data.total_harga - this.data.potongan_promo) > 1">
                                        <strong>
                                            {{(this.data.total_harga - this.data.potongan_promo).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")}}
                                        </strong>
                                    </span>
                                    <span v-else><strong>0</strong></span>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-btn color="blue darken-1" text @click="cancel"> BATAL </v-btn> -->
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="#00396c" @click="bayar"> BAYAR </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRatingDriver" persistent max-width="400px">
            <v-card>
                <v-app-bar color="#00396c">
                    <v-spacer></v-spacer>
                        <v-card-title style="color: white;">
                            PUAS DENGAN KINERJA DRIVER?
                        </v-card-title>
                    <v-spacer></v-spacer>
                </v-app-bar>
                <v-card-text>
                    <v-container>
                        <div>
                            <v-img :src="logo" height="300" width="300" style="object-fit:cover; left: 13%; top: 25%; position: absolute; opacity: 0.2;"></v-img>
                        </div>
                        <v-avatar style="margin-left: 35%; margin-top: 5%" height="100px" width="100px">
                            <v-img :src="$baseUrl+'/storage/'+this.data.url_foto_driver" height="200px" width="300px" style="object-fit:cover;"/> 
                        </v-avatar>
                        <v-card-title style="text-align: center; color: black; font-size: 20px; position: relative;" class="justify-center">
                            {{this.data.nama_driver}}
                        </v-card-title>
                        <v-rating
                            background-color="warning"
                            v-model="rating"
                            color="warning"
                            size="48"
                            value="3"
                        ></v-rating>
                        <v-card-text style="text-align: center; color: black; font-size: 15px;position: relative;">
                            <strong>
                                Penilaian yang kalian berikan akan sangat berguna bagi pelayanan kami kedepannya
                            </strong>
                        </v-card-text>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="#00396c" @click="saveRatingDriver">Save</v-btn>
                    <v-spacer></v-spacer>
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
        <div style="height: 1080px;"></div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs"
                    v-on="on"
                    style="position: fixed; bottom: 0; right: 0; margin: 0 20px 30px 0px;"
                    @click="newTransaksi"
                    fab large dark
                    right
                    color="#00396c" >
                    <v-icon size="45px" color="white">mdi-plus</v-icon>
                </v-btn>
            </template>
            <span>Transaksi Baru</span>
        </v-tooltip>
    </v-main>
</template>

<script>
import jspdf from 'jspdf'
    export default {
        name: "List",
        data(){
            return {
                count: 0,
                countDone: 0,
                countBata: 0,
                dialogDetail: false,
                metodeBayar: '',
                dialogBayar: false,
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
                temp_banyak: '',
                overlay_tanda: false,
                overlay_sim: false,
                BANTUPENGENAL: '',
                BANTUSIM: '',
                search: null,
                drawer: false,
                dialog: false,
                dialogConfirm: false,
                dialogVerifikasi: false,
                dialogMetodeBayar: false,
                showdialogKetentuan: false,
                dialogRatingDriver: false,
                logo: require('@/assets/logo_ajr.png'),
                rating: 0,
                messageRules: [
                    (v) => !!v || 'This Field is Required !',
                ],
                headers: [
                    { text: "Nomor Transaksi", value: 'id_transaksi' },
                    { text: "Driver", value: 'nama_driver', width: "100px" },
                    { text: "Mobil", value: 'nama_mobil' },
                    // { text: "Pegawai", value: 'nama_pegawai' },
                    { text: "Tanggal Transaksi", value: 'tanggal_transaksi' },
                    { text: "Mulai Sewa", value: 'tanggal_mulai' },
                    { text: "Selesai Sewa", value: 'tanggal_selesai' },
                    { text: "Status transaksi", value: 'status_transaksi' },
                    { text: "Action", value: 'actions' },
                ],

                transaksi: new FormData,
                transaksis: [
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
                    id_driver: null,
                    id_customer: null,
                    nama_customer: null,
                    id_mobil: null,
                    id_pegawai: null,
                    id_promo: 0,
                    tanggal_transaksi: null,
                    tanggal_mulai: null,
                    tanggal_pengembalian: null,
                    tanggal_selesai: null,
                    status_transaksi: null,
                    metode_pembayaran: null,
                    bukti_bayar: null,
                    total_harga: null,
                    total_sewa_mobil: 0,
                    total_sewa_driver: 0,
                    total_denda: 0,
                    potongan_promo: null,
                    rating_driver: null,
                    rating_ajr: null,
                    harga_sewa_mobil : 0,
                    tarif_sewa_driver : 0,
                    nama_mobil : null,
                    nama_driver : null,
                    jenis_promo : null,
                    besar_diskon_promo : null,
                },
                deleteId: '',
                editId: '',
                Difference_In_Days: 0,
            };
        },
        methods: {

            newTransaksi(){
                if((this.count - this.countDone - this.countBatal) >= 1){
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Hanya Boleh 1x Transaksi saja';
                }
                else{
                    this.$router.push({
                        name: 'TransaksiBaru',
                    });
                }
            },

            isTransfer(){
                // this.clear();
                if(this.metodeBayar == 'Transfer'){
                    return true;
                }
                return false;
            },

            // clear(){
            //     this.$refs.form.reset();
            // },

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
                var url = this.$api + '/showbycustomer/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transaksis = response.data.data;
                })
            },

            // readDataTransaksi() {
            //     this.temp_banyak = true;
            //     var url = this.$api + '/countTransaction/' + sessionStorage.getItem('id_customer');
            //     console.log(url)
            //     this.$http.get(url, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.transaksis = response.data.data;
            //     })
            // },

            readDataBanyakTransaksi() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransaction/' + sessionStorage.getItem('id_customer');
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
                var url = this.$api + '/countTransactionDone/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.countDone = response.data.data;
                })
            },

            readDataTransaksiBatal() {
                this.temp_banyak = true;
                var url = this.$api + '/countTransactionBatal/' + sessionStorage.getItem('id_customer');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.countBatal = response.data.data;
                })
            },

            onPreviewImage(e) {
                this.previewImageUrl = URL.createObjectURL(e)
            },

            editHandler(item){
                if(item.status_transaksi != 'Menunggu Verifikasi'){
                     this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Transaksi Sedang Berjalan, Tidak bisa diedit';
                    if(item.status_transaksi == 'Sudah lunas (Selesai)'){
                        this.error_message = 'Transaksi Sudah Selesai, Tidak bisa diedit';
                    }
                    else if(item.status_transaksi == 'Batal'){
                        this.error_message = 'Transaksi Sudah Dibatalkan, Tidak bisa diedit';
                    }
                }
                else{
                    this.$router.push({
                        name: 'TransaksiBaru',
                        params: {
                            items: item
                        }
                    });
                }
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
                        this.transaksi.append('status_berkas', 'Verified');
                    }
                    else{
                        this.transaksi.append('status_berkas', 'Verified! must with driver');
                    }
                    var url = this.$api + '/updateberkascustomer/' + this.editId;
                    this.load = true;
                    this.$http.post(url, this.transaksi, {
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
                        this.error_message = 'Anda Sudah Verifikasi Driver ini';
                    }
                    this.dialogVerifikasi = false;
                }
            },

            saveRatingDriver(){
                this.transaksi.append('rating_driver', this.rating);
                var url = this.$api + '/ratingdriver/' + this.data.id_transaksi;
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization' : 'Bearer ' +localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.error_message = 'Berhasil Memberikan Rating untuk Driver';
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
                    this.snackbar1 = true;
                    this.load = false;
                });
            },

            downloadNota(item){
                if(item.status_transaksi == 'Sudah lunas (Selesai)' || item.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'){

                    var pdf = new jspdf();
                    var imgLogo = new Image()
                    imgLogo.src = this.logo;
                    pdf.addImage(imgLogo, 'PNG', 20, 3, 24, 24, 0.1)
                    // pdf.addImage(imgLogo, 'PNG', 165, 3, 24, 24)
                    pdf.text('Nota Transaksi', 105, 10, null, null, 'center');
                    pdf.text('Atma Jaya Rental', 105, 20, null, null, 'center');
                    // pdf.setLineWidth(1.0);
                    pdf.line(20, 30, 190, 30);
                    pdf.setFontSize(10);
                    // pdf.setFont(undefined, 'bold');
                    pdf.text(item.id_transaksi, 25, 55).setFontSize(10);
                    pdf.text(item.tanggal_transaksi, 150, 55).setFontSize(10);
                    pdf.line(23, 57, 186, 57);
                    pdf.line(23, 75, 186, 75);
                    pdf.line(23, 112, 186, 112);
                    pdf.line(23, 131, 186, 131);
                    pdf.text('CUST', 25, 62).setFontSize(10);
                    pdf.text(item.nama_customer, 70, 62).setFontSize(10);
                    pdf.text('PRO:', 113, 62).setFontSize(10);
                    if(item.kode_promo == null){
                        pdf.text('-', 150, 62).setFontSize(10);
                    }
                    else{
                        pdf.text(item.kode_promo, 150, 62).setFontSize(10);
                    }
                    pdf.text('CS', 25, 67).setFontSize(10);
                    pdf.text(item.nama_pegawai, 70, 67).setFontSize(10);
                    pdf.text('DRV', 25, 72).setFontSize(10);
                    console.log(item.nama_driver)
                    if(item.nama_driver != null){
                        pdf.text(item.nama_driver, 70, 72).setFontSize(10);
                    }
                    else{
                        pdf.text('-', 70, 72).setFontSize(10);
                    }
                    
                    // Nota Transaksi
                    pdf.text('Tanggal Mulai Sewa', 25, 90).setFontSize(10);
                    pdf.text(item.tanggal_mulai, 70, 90).setFontSize(10);
                    pdf.text('Tanggal Selesai Sewa', 25, 97).setFontSize(10);
                    pdf.text(item.tanggal_selesai, 70, 97).setFontSize(10);
                    pdf.text('Tanggal Pengembalian', 25, 104).setFontSize(10);
                    pdf.text(item.tanggal_pengembalian, 70, 104).setFontSize(10);
    
                    // Data - Data
                    pdf.text('[MBL] ' + item.nama_mobil, 25, 122, null, null);
                    pdf.text('Rp ' +item.harga_sewa_mobil.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 70, 122, null, null);
                    var datediff11 = Date.parse(item.tanggal_selesai) - Date.parse(item.tanggal_mulai)
                    this.Difference_In_Days = datediff11 / (1000 * 3600 * 24);
                    pdf.text(this.Difference_In_Days.toString() + ' hari', 113, 122, null, null);
                    pdf.text('Rp ' +item.total_sewa_mobil.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 122, null, null);
    
                    if(item.nama_driver != null){
                        pdf.text('[DRV] '+item.nama_driver, 25, 127, null, null,);
                        pdf.text('Rp ' +item.tarif_sewa_driver.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 70, 127, null, null);
                        pdf.text(this.Difference_In_Days.toString() + ' hari', 113, 127, null, null);
                        pdf.text('Rp ' +item.total_sewa_driver.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 127, null, null);
                    }
    
                    pdf.text('CUST', 25, 144).setFontSize(10);
                    pdf.text(item.nama_customer, 25, 164).setFontSize(10);
                    pdf.text('CS', 70, 144).setFontSize(10);
                    pdf.text(item.nama_pegawai, 70, 164).setFontSize(10);
    
                    pdf.text('Diskon', 113, 144, null, null);
                    pdf.text('Rp ' +item.potongan_promo.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 144, null, null);
    
                    pdf.text('Denda', 113, 149, null, null);
                    pdf.text('Rp ' +item.total_denda.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 149, null, null);
    
                    pdf.line(111, 152, 175, 152);
    
    
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Nota Transaksi Sewa mobil', 20, 40, null, null);
                    pdf.text('Atma Rental', 105, 50, null, null, 'center');
                    pdf.text('Nota Transaksi', 105, 80, null, null, 'center');
                    pdf.text('Item', 29, 117, null, null, 'center');
                    pdf.text('Satuan', 70, 117);
                    pdf.text('Durasi', 113, 117);
                    pdf.text('Sub Total', 157, 117, null, null, 'center');
    
                    // Total Sub total (dibawah persis table data)
                    pdf.text('Rp ' +item.total_harga.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 136, null, null);
                    
                    pdf.setFontSize(12);
                    pdf.text('Total Harga', 113, 159, null, null);
                    pdf.text('Rp ' +(item.total_harga - item.potongan_promo + item.total_denda).toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.'), 149, 159, null, null);
                    pdf.save('Nota Transaksi.pdf')
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
                    this.error_message = 'Transaksi Anda Sedang Berjalan';
                    if(item.status_transaksi == 'Batal'){
                        this.error_message = 'Transaksi sudah Dibatalkan';
                    }
                }
            },

            pembayaran(){
                var temp_bukti = document.getElementById("foto_bukti");
                if((this.metodeBayar == 'Transfer' && temp_bukti.files[0] != null) || this.metodeBayar == 'Cash'){
                    this.transaksi.append('tanggal_pengembalian', this.data.tanggal_pengembalian_tampil);
                    if(temp_bukti != null){
                        if(temp_bukti.files[0]){
                            this.transaksi.append('bukti_bayar', temp_bukti.files[0]);
                        }
                    }
                    // else{
                    //     console.log(" DI ELSE")
                    //     this.transaksi.append('bukti_bayar', null);
                    // }
                    // this.transaksi.append('bukti_bayar', this.bukti_bayar);
                    this.transaksi.append('status_transaksi', 'Sudah Bayar, Menunggu Verifikasi');
                    this.transaksi.append('metode_pembayaran', this.metodeBayar);
                    this.transaksi.append('total_denda', this.data.total_denda);
                    var url = this.$api + '/bayartransaksi/' + this.data.id_transaksi;
                    this.load = true;
                    this.$http.post(url, this.transaksi, {
                        headers: {
                            'Authorization' : 'Bearer ' +localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.error_message = 'Berhasil Membayar Tagihan Biaya';
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
                        this.metodeBayar = null;
                        if(this.data.id_driver != null){
                            this.dialogRatingDriver = true;
                        }
                        this.downloadNota();
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar1 = true;
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
                    this.error_message = 'Silakan Isi Bukti Pembayaran';
                }
            },

            bayar(){
                if(this.data.tanggal_mulai > this.data.tanggal_pengembalian_tampil){
                    this.snackbar = {
                        color: "info",
                        icon: "mdi-information-outline",
                        mode: "multi-line",
                        position: "top",
                        timeout: 2000,
                        title: "Information",
                        visible: true
                    };
                    this.error_message = 'Anda Belum Memulai Sewa';
                }
                else{
                    this.dialogMetodeBayar = true;
                    // this.snackbar = {
                    //     color: "info",
                    //     icon: "mdi-information-outline",
                    //     mode: "multi-line",
                    //     position: "top",
                    //     timeout: 2000,
                    //     title: "Information",
                    //     visible: true
                    // };
                    // this.error_message = 'MASUK ELSE DONG';
                }
            },

            detailScreen(item){
                this.data.id_transaksi = item.id_transaksi;
                this.data.id_promo = item.id_promo;
                var datediff11 = Date.parse(item.tanggal_selesai) - Date.parse(item.tanggal_mulai)
                this.Difference_In_Days = datediff11 / (1000 * 3600 * 24);
                this.data.nama_customer = item.nama_customer;
                this.data.no_telp_customer = item.no_telp_customer;
                this.data.status_berkas = item.status_berkas;
                this.data.tanggal_transaksi = item.tanggal_transaksi;
                this.data.tanggal_pengembalian = item.tanggal_pengembalian;
                this.data.tanggal_mulai = item.tanggal_mulai;
                this.data.tanggal_selesai = item.tanggal_selesai;
                this.data.nama_mobil = item.nama_mobil; 
                this.data.total_sewa_mobil = item.total_sewa_mobil;
                this.data.harga_sewa_mobil = item.harga_sewa_mobil;
                this.temp_hargaSewaMobil = item.harga_sewa_mobil;
                this.data.nama_driver = item.nama_driver;
                this.data.total_sewa_driver = item.total_sewa_driver;
                this.data.tarif_sewa_driver = item.tarif_sewa_driver;
                this.data.total_harga = item.total_harga;
                this.data.jenis_promo = item.jenis_promo;
                this.data.besar_diskon_promo = item.besar_diskon_promo;
                this.data.potongan_promo = item.potongan_promo;
                this.data.biaya_eksten_mobil = 0;
                this.data.biaya_eksten_driver = 0;
                this.data.total_denda = 0;
                if(this.data.tanggal_pengembalian > this.data.tanggal_selesai){
                    this.data.biaya_eksten_mobil = item.harga_sewa_mobil;
                    this.data.biaya_eksten_driver = item.tarif_sewa_driver;
                    this.data.total_denda = this.data.biaya_eksten_mobil + this.data.biaya_eksten_driver;
                    this.data.total_harga = this.data.total_harga + this.data.total_denda;
                }
                this.dialogDetail = !this.dialogDetail;
                if(this.dialogDetail == false){
                    this.resetForm();
                }
            },

            kembaliMobil(item){
                if(item.status_transaksi != 'Menunggu Verifikasi' && 
                item.status_transaksi != 'Sudah Bayar, Menunggu Verifikasi' && 
                item.status_transaksi != 'Sudah lunas (Selesai)' && item.status_transaksi != 'Batal'){
                    this.data.id_transaksi = item.id_transaksi;
                    this.data.id_promo = item.id_promo;
                    this.data.id_driver = item.id_driver;
                    var datediff11 = Date.parse(item.tanggal_selesai) - Date.parse(item.tanggal_mulai)
                    this.Difference_In_Days = datediff11 / (1000 * 3600 * 24);
                    this.data.nama_customer = item.nama_customer;
                    this.data.no_telp_customer = item.no_telp_customer;
                    this.data.status_berkas = item.status_berkas;
                    this.data.tanggal_transaksi = item.tanggal_transaksi;
                    const today = new Date();
                    const date = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
                    const time = String(today.getHours() - 3).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
                    const timetampil = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
                    const dateTime = date +' '+ time;
                    const dateTimetampil = date +' '+ timetampil;
                    this.data.tanggal_pengembalian_tampil = dateTimetampil;
                    this.data.tanggal_pengembalian = dateTime;
                    
                    this.data.tanggal_mulai = item.tanggal_mulai;
                    this.data.tanggal_selesai = item.tanggal_selesai;
                    this.data.nama_mobil = item.nama_mobil; 
                    this.data.total_sewa_mobil = item.total_sewa_mobil;
                    this.data.harga_sewa_mobil = item.harga_sewa_mobil;
                    this.data.nama_driver = item.nama_driver;
                    this.data.url_foto_driver = item.url_foto_driver;
                    this.data.total_sewa_driver = item.total_sewa_driver;
                    this.data.tarif_sewa_driver = item.tarif_sewa_driver;
                    this.data.total_harga = item.total_harga;
                    this.data.jenis_promo = item.jenis_promo;
                    this.data.besar_diskon_promo = item.besar_diskon_promo;
                    this.data.potongan_promo = item.potongan_promo;
                    this.dialogBayar = !this.dialogBayar;
                    this.data.biaya_eksten_mobil = 0;
                    this.data.biaya_eksten_driver = 0;
                    this.data.total_denda = 0;
                    if(this.data.tanggal_pengembalian > this.data.tanggal_selesai){
                        this.data.biaya_eksten_mobil = item.harga_sewa_mobil;
                        this.data.biaya_eksten_driver = item.tarif_sewa_driver;
                        this.data.total_denda = this.data.biaya_eksten_mobil + this.data.biaya_eksten_driver;
                        this.data.total_harga = this.data.total_harga + this.data.total_denda;
                    }
                    if(this.dialogBayar == false){
                        this.resetForm();
                    }
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
                    this.error_message = 'Transaksi Anda Belum Diverfikasi';
                    if(item.status_transaksi == 'Sudah Bayar, Menunggu Verifikasi'){
                        this.error_message = 'Anda Sudah Melakukan Pembayaran, Mohon Tunggu';
                    }
                    else if(item.status_transaksi == 'Sudah lunas (Selesai)'){
                        this.error_message = 'Transaksi Sudah Selesai';
                    }
                    else if(item.status_transaksi == 'Batal'){
                        this.error_message = 'Transaksi Sudah DiBatalkan';
                    }
                   
                }
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogVerifikasi = false;
                this.dialogBayar = false;
                this.dialogMetodeBayar = false;
                this.dialogRatingDriver = false;
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                // this.clear();
                this.dialog = false;
                this.dialogConfirm = false;
                this.dialogDetail = false;
                this.dialogVerifikasi = false;
                this.dialogBayar = false;
                this.dialogMetodeBayar = false;
                this.dialogRatingDriver = false;
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
            this.readDataTransaksiBatal();
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