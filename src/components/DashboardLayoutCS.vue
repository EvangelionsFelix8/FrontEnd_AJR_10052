<template>
    <div class="dashboard">
        <v-navigation-drawer v-model="drawer" class="fullheight, blue darken-4" color="#00396c" width="256" app>
            <!-- <v-toolbar color="yellow darken-1"> -->
            <v-list-item class="blue darken-4">
                <v-list-item-content>
                    <v-list-item-title class="title"> {{ pegawais.nama_pegawai }} </v-list-item-title>
                    <v-list-item-subtitle> Login as: Customer Service </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <!-- </v-toolbar> -->

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
        </v-navigation-drawer>
        <v-app-bar app fixed height="75px" class="yellow darken-3">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <VSpacer />
            <!-- <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon >mdi-power</v-icon></v-btn>
            </v-toolbar-items> -->
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            drawer: true,
            pegawais: [],
            items: [
                // { icon: 'mdi-view-dashboard',title: "Dashboard", to: "/dashboard"},
                // { icon: 'mdi-account-tie', title: 'Role', to: '/role'},
                // { icon: 'mdi-sack-percent', title: 'Promo', to: '/promo'},
                // { icon: 'mdi-calendar-blank', title: 'Jadwal', to: '/jadwal'},
                // { icon: 'mdi-calendar-multiple', title: 'Penjadwalan', to: '/detailjadwal'},
                // { icon: 'mdi-account-hard-hat', title: 'Pegawai', to: '/pegawai'},
                // { icon: 'mdi-account', title: 'Driver', to: '/driver'},
                // { icon: 'mdi-account-group', title: 'Mitra', to: '/mitra'},
                // { icon: 'mdi-car', title: 'Mobil', to: '/mobil'},
                { icon: 'mdi-account', title: 'List Customer', to: '/datacustomer'},
                { icon: 'mdi-cash-multiple', title: 'Transaksi', to: '/transaksi'},
                // { title: 'User', to: '/user'},
            ],
        };
    },
    methods: {
        readData() {
            var url = this.$api + '/pegawai/' + sessionStorage.getItem('id_pegawai');
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.pegawais = response.data.data;
            })
        },

        logout(){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("id_pegawai");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("nama_pegawai");
            sessionStorage.removeItem("id_role");
            this.$router.push({
                name: 'LandingPage',
            });
        }
    },

    mounted(){
        this.readData();
    }
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