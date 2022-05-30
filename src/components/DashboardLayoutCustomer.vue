<template>
    <div class="dashboard">
        <!-- <v-navigation-drawer v-model="drawer" class="fullheight, blue darken-4" color="#00396c" width="256" app>
            <v-list-item class="blue darken-4">
                <v-list-item-content>
                    <v-list-item-title class="title"> Evangelions Felix Yehdeya GSD </v-list-item-title>
                    <v-list-item-subtitle> Login as: Customer </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to" color="white">
                    <v-list-item-content>
                        <v-list-item-title class="body-1"> <v-icon>{{ item.icon }}</v-icon> {{ item.title }}  </v-list-item-title>
                    </v-list-item-content>
                   
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="logout" color="yellow darken-4">
                        <span class="white--text">
                            <strong>
                                Logout
                            </strong>
                        </span>
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer> -->

        <v-app-bar app fixed height="75px" color="#00396c">
            <v-toolbar-side-icon>
                <v-img :src="logo" height="65px" width="65" style="object-fit:cover"></v-img>
            </v-toolbar-side-icon>
            <v-spacer></v-spacer>
            <v-btn @click="gotoBeranda" plain color="white"> Beranda </v-btn>
            <v-btn @click="scrollMeTo('howtorent')" plain color="white"> Cara Menyewa? </v-btn>
            <v-menu open-on-hover bottom offset-y origin="center center" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn plain color="white" dark v-bind="attrs" v-on="on">
                        Transaksi
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="gotoOnProgress" link>
                    <v-list-item-title><v-icon>mdi-progress-clock</v-icon> On Progress</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="gotoRiwayat" link>
                    <v-list-item-title ><v-icon>mdi-history</v-icon> Riwayat Transaksi</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="newTransaksi" link>
                    <v-list-item-title ><v-icon>mdi-plus</v-icon> Sewa</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-menu bottom offset-y origin="center center" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="show = !show" style="margin-right: 15px;" plain color="white" dark v-bind="attrs" v-on="on">
                        <v-icon size="35">mdi-account-circle</v-icon>
                        <v-icon style="margin-left: 10px;" size="25">{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="gotoProfile" link>
                        <v-list-item-title ><v-icon>mdi-account</v-icon> Profile Saya</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="gotoProfile" link>
                        <v-list-item-title class="red--text">
                            <v-icon color="red">mdi-lock</v-icon> Ganti Password</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout" link>
                        <v-list-item-title class="red--text" >
                            <v-icon color="red">mdi-logout</v-icon>
                            Logout
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <!-- <v-btn @click="gotoProfile" plain color="white"> Profile </v-btn> -->
            <!-- <v-list dense>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to" color="white">
                    <v-row no-gutters>
                        <v-col>
                            <v-list-item-content>
                                <v-list-item-title class="body-1"> <v-icon>{{ item.icon }}</v-icon> {{ item.title }}  </v-list-item-title>
                            </v-list-item-content>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list> -->
            <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
            <!-- <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon >mdi-power</v-icon></v-btn>
            </v-toolbar-items> -->
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>

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

    </div>

    
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            drawer: true,
            show: false,
            count: 0,
            countDone: 0,
            countBatal: 0,
            snackbar: {
                color: null,
                icon: null,
                mode: null,
                position: "bottom",
                timeout: 2000,
                title: null,
                visible: false
            },
            logo: require('@/assets/logo_ajr.png'),
            items: [
                { icon: 'mdi-account', title: 'Your Profile', to: '/profilecustomer'},
                { icon: 'mdi-cash-multiple', title: 'Transaksi', to: '/transaksi-customer'},
                { icon: 'mdi-plus', title: 'New Transaksi', to: '/new-transaksi'},
            ],
        };
    },
    methods: {
        gotoBeranda(){
            this.$router.push({
                name: 'BerandaCustomer',
            });
        },

        gotoProfile(){
            this.$router.push({
                name: 'ProfileCustomer',
            });
        },

        gotoRiwayat(){
            this.$router.push({
                name: 'TransaksiCustomer',
            });
        },

        gotoOnProgress(){
            this.$router.push({
                name: 'OnProgressCustomer',
            });
        },

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
                console.log(this.count, 'inicount');
                console.log(this.countDone, 'countDone');
                console.log(this.countBatal, 'inibatal');
                console.log(this.count - this.countDone - this.countBatal);
                this.error_message = 'Hanya Boleh 1x Transaksi saja';
            }
            else{
                this.$router.push({
                    name: 'TransaksiBaru',
                });
            }
        },

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

        logout(){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("id_customer");
            sessionStorage.removeItem("nama_customer");
            sessionStorage.removeItem("email");
            this.$router.push({
                name: 'LandingPage',
            });
        }
    },

    mounted(){
        this.readDataBanyakTransaksi();
        this.readDataTransaksiDone();
        this.readDataTransaksiBatal();
    },
};
</script>

<style scoped>
    .fullheight {
        min-height: 100vh !important;
    }

    .router{
        text-decoration: none;
        color: white;
    }
</style>