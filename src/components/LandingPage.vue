<template>
    <v-main class="landingPage">
        <v-app-bar hide-on-scroll fixed color="#00396c" height="100">
            <v-toolbar-side-icon>
                <v-img :src="logo" height="65px" width="65" style="object-fit:cover"></v-img>
            </v-toolbar-side-icon>
            <h2 id="judulappbar">Atma Jaya Rental</h2>
            <v-spacer></v-spacer>
            <v-btn @click="scrollMeTo('home')" plain color="white"> HOME </v-btn>
            <v-btn @click="scrollMeTo('howtorent')" plain color="white"> HOW TO RENT </v-btn>
            <v-btn @click="scrollMeTo('joinus')" plain color="white"> JOIN US </v-btn>
            <v-btn @click="scrollMeTo('about')" plain color="white"> ABOUT </v-btn>
            <v-spacer></v-spacer>
            <!-- <v-btn @click="goToLogin()" rounded color="#F9A825"> <span class="white--text"> LOGIN </span></v-btn> -->
            <v-btn @click="dialogLogin = true" rounded color="#F9A825"> <span class="white--text"> LOGIN </span></v-btn>
            <v-btn @click="dialogRegister = true" rounded outlined color="#F9A825" style="margin-left: 10px;"> REGISTER </v-btn>
        </v-app-bar>

        <div style="background-color: rgb(160, 160, 255);">
            <div ref="home" id="con-1">
                <div style="padding: 190px 50px 0px 75px">
                    <v-row>
                        <!-- style="background-color: red" -->
                        <v-col sm="5">
                            <h1 id="doYou">Are You Looking for a Car To Rent?</h1>
                        </v-col>
                        
                        <v-col sm="7">
                            <v-img :src="logo_con1" width="800px" ></v-img>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
        
        <div ref="howtorent" id="con-2" >
            <div style="padding: 140px 50px 0px 75px">
                <div id="judulHowtoRent">
                    <h3>HOW TO RENT</h3>
                </div>
                <v-row>
                    <v-col sm="4">
                        <v-hover v-slot="{ hover }">
                            <v-card style="background-color: #FDD835;" height="325px" class="rounded-xl" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
                                <div class="step">
                                    <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" class="rounded-circle" style="margin-top: 25px; background-color: #00396c">
                                        <v-icon size="125" color="white">mdi-numeric-1</v-icon>
                                    </v-card>
                                </div>
                                <h2 style="text-align: center; padding-top: 10px;">Login to our Website</h2>
                                <h3 style="text-align: center; padding-top: 30px;">dont have an account?</h3>
                                <h3 @click="dialogRegister = true" style="text-align: center; padding-top: 10px; color: white; text-decoration: underline;">Register</h3>
                            </v-card>
                        </v-hover>
                    </v-col>
                    
                    <v-col sm="4">
                        <v-hover v-slot="{ hover }">
                            <v-card style="background-color: #FDD835;" height="325px" class="rounded-xl" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" >
                                <div class="step">
                                    <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" class="rounded-circle" style="margin-top: 25px; background-color: #00396c">
                                        <v-icon size="125" color="white">mdi-numeric-2</v-icon>
                                    </v-card>
                                </div>
                                <h2 style="text-align: center; padding-top: 10px;">Choose the car that you want to rent</h2>
                                <h3 style="text-align: center; padding-top: 30px;">Dont have a driver lincense?</h3>
                                <h3 style="text-align: center; padding-top: 10px;">Choose the driver too</h3>
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col sm="4">
                        <v-hover v-slot="{ hover }">
                            <v-card style="background-color: #FDD835;" height="325px" class="rounded-xl" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
                                <div class="step">
                                    <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" class="rounded-circle" style="margin-top: 25px; background-color: #00396c">
                                        <v-icon size="125" color="white">mdi-numeric-3</v-icon>
                                    </v-card>
                                </div>
                                <h2 style="text-align: center; padding-top: 10px;">Drive your chosen car on the day</h2>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </div>
        </div>

        <div ref="joinus" style="background-color: rgb(160, 160, 255);" >
            <div id="con-3" style="padding: 100px 50px 0px 75px">
                <div id="judulJoinUs">
                    <h3 style="color: rgb(160, 160, 255)">DO YOU WANT TO JOIN US AS MITRA?</h3>
                    <v-img :src="logo_join"></v-img>
                </div>
            </div> 
        </div>

        <div ref="about" style="background-color: white">
            <div id="con-4">
                <div style="padding: 100px 50px 0px 75px">
                    <v-row>
                        <v-col sm="5">
                            <h1 id="doYou">Are You Looking for a Car To Rent?</h1>
                        </v-col>
                        
                        <v-col sm="7">
                            <!-- <v-img :src="logo_con1" width="800px" ></v-img> -->
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>

        <v-dialog v-model="dialogRegister" persistent max-width="600px">
            <v-hover v-slot="{ hover }">
                <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
                    <v-toolbar color="#00396c">
                        <v-card-title>
                            <div style="width: 535px; text-align: center;" class="h6, white--text">
                                REGISTER
                            </div>
                        </v-card-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-form v-model="valid" ref="form">
                                <v-text-field :rules="messageRules" v-model="form.nama_customer" label="Nama" required></v-text-field>
                                <v-textarea :rules="messageRules" v-model="form.alamat_customer" label="Alamat" required></v-textarea>
                                <v-select :rules="messageRules" :items="jenisKelamins" v-model="form.jenis_kelamin" label="Jenis Kelamin" item-value="value" item-text="text"></v-select>
                                <v-text-field :rules="messageRules" v-model="form.email_customer" label="Email" required></v-text-field>
                                <v-text-field :rules="messageRules" type="date" v-model="form.tanggal_lahir_customer" label="Tanggal Lahir" required></v-text-field>
                                <v-text-field :rules="messageRules" v-model="form.no_telp_customer" label="No. Telp" required></v-text-field>
                                <v-file-input :rules="messageRules" type="file" rounded filled prepend-icon="mdi-camera" label="Tanda Pengenal" id="foto_no_tanda_pengenal" ref="fileGambar"></v-file-input>
                                <v-file-input rounded filled prepend-icon="mdi-camera" label="Surat Izin Mengemudi" id="foto_sim" ref="fileSim"></v-file-input>
                            </v-form>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <span>Sudah punya akun?</span><v-btn color="blue darken-1" text @click="goToLogin"> Login </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancelRegis"> Cancel </v-btn>
                        <v-btn class="white--text" color="#00396c" @click="save"> Register </v-btn>
                    </v-card-actions>
                </v-card>
            </v-hover>
        </v-dialog> 

        <v-dialog v-model="dialogLogin" persistent max-width="500px">
            <v-hover v-slot="{ hover }">
                <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
                    <v-toolbar color="#00396c">
                        <v-card-title >
                            <div style="width: 435px; text-align: center;" class="h6, white--text">
                                LOGIN
                            </div>
                        </v-card-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container style="margin-top: 25px;">
                            <v-form v-model="valid" ref="form">
                                <strong>Email Address</strong>
                                <v-text-field outlined :rules="emailRules" required v-model="email"></v-text-field>
                                <strong>Password</strong>
                                <v-text-field v-model="password" outlined @click:append="show1 = !show1" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" :rules="passwordRules" required></v-text-field>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <span>Belom punya akun?</span><v-btn color="blue darken-1" text @click="changedialog1"> Register </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancelLogin"> Cancel </v-btn>
                        <v-btn :class=" { valid, disabled: !valid }" color="blue darken-1" @click="submit"> <span style="color: white;"> Login </span></v-btn>
                    </v-card-actions>
                </v-card>
            </v-hover>
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
            <!-- <div v-for="(errorArray, index) in error_message" :key="index"> -->
                <!-- <div v-for="(error_message, index) in errorArray" :key="index"> -->
                    {{ error_message }}
                <!-- </div> -->
            <!-- </div> -->
        </v-snackbar>

    </v-main>
</template>

<script>
export default {
    name: "landingPage",
    data(){
        return{
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
            color: '',
            error_message: '',
            customer: new FormData,
            dialogLogin: false,
            dialogRegister: false,
            valid: false,
            show1: false,
            email: null,
            password: null,
            logo: require('@/assets/logo_ajr.png'),
            logo_con1: require('@/assets/5230.jpg'),
            logo_join: require('@/assets/imgbin_car-rental-taxi-enterprise-rent-a-car-renting-png.png'),
            jenisKelamins: [
                {text: "Laki-laki", value: "Laki-laki"},
                {text: "Perempuan", value: "Perempuan"},
            ],
            messageRules: [
                (v) => !!v || 'This Field is Required !',
            ],
            passwordRules: [
                (v) => !!v || 'Password tidak boleh kosong',
            ],
            emailRules: [
                (v) => !!v || 'E-mail tidak boleh kosong',
            ],
            form: {
                id_customer: null,
                nama_customer: null,
                alamat_customer: null,
                tanggal_lahir_customer: null,
                jenis_kelamin: null,
                email_customer: null,
                password: null,
                no_telp_customer: null,
                status_berkas: null,
                no_tanda_pengenal: null,
                no_sim: null,
            },
        };
    },
    methods: {
        clear(){
            this.$refs.form.reset();
        },

        scrollMeTo(refName) {
            var element = this.$refs[refName];
            var top = element.offsetTop;

            window.scrollTo(0, top);
        },

        goToLogin(){
             this.$router.push({
                name: 'Login',
            });
        },

        // register(){
        //     this.clear();
        //     this.$router.push({
        //         name: 'Register',
        //     });
        // },

        // clear() {
        //     this.$refs.form.reset();
        //     // this.$refs.form1.reset();
        //     // this.resetForm();
        //     // this.load = true;
        //     // location.reload();
        //     // this.$refs.form.resetForm(); // clear form login
        // },

        cancelLogin() {
            this.clear();
            // this.resetForm();
            this.dialogLogin = false;
            
        },

        cancelRegis(){
            this.clear();
            this.dialogRegister = false;
            location.reload();
            // this.$refs.fileGambar
            // this.$refs.fileGambar.value = null;
            // this.$refs.fileSim = '';
        },

        changedialog (){
            this.clear();
            this.dialogRegister = false;
            this.dialogLogin = true;
        },

        changedialog1 (){
            this.clear();
            this.dialogRegister = true;
            this.dialogLogin = false;
        },

        submit(){
            let url = this.$api + "/login";
            this.$http.post(url, {
                email: this.email,
                password: this.password,
            }).then((response)=> {
                if(response.data.data.id_customer != null) {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("id_customer", response.data.data.id_customer);
                    sessionStorage.setItem("nama_customer", response.data.data.nama_customer);
                    sessionStorage.setItem("email", response.data.data.email_customer);
                    this.$router.push({
                        name: 'ProfileCustomer',
                    });
                }
                else if(response.data.data.id_pegawai != null) {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("id_pegawai", response.data.data.id_pegawai);
                    sessionStorage.setItem("email", response.data.data.email);
                    sessionStorage.setItem("nama_pegawai",response.data.data.nama_pegawai);
                    sessionStorage.setItem("id_role", response.data.data.id_role);
                    if(response.data.data.id_role == 1){
                        this.$router.push({
                            name: 'Promo',
                        });
                    }
                    else if(response.data.data.id_role == 2){
                        this.$router.push({
                            name: 'Mitra',
                        });
                    }
                    else if(response.data.data.id_role == 3){
                        this.$router.push({
                            name: 'DataCustomer',
                        });
                    }
                }
                else{
                    return false;
                }

                // this.$router.push("/dashboard");
                // this.error_message = response.data.message;
                // this.color = "blue";
                // this.snackbar = true;
                // this.clear();
                // this.load = false;
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar1 = true;
                localStorage.removeItem("token");
                this.load = false;
            })
        },

        save(){
            // if(this.$refs.form.validate()) {
                this.customer.append('nama_customer', this.form.nama_customer);
                this.customer.append('alamat_customer', this.form.alamat_customer);
                this.customer.append('tanggal_lahir_customer', this.form.tanggal_lahir_customer);
                this.customer.append('jenis_kelamin', this.form.jenis_kelamin);
                this.customer.append('email_customer', this.form.email_customer);
                this.customer.append('no_telp_customer', this.form.no_telp_customer);

                var temp_tanda = document.getElementById("foto_no_tanda_pengenal");
                this.customer.append('no_tanda_pengenal', temp_tanda.files[0]);
                // this.customer.append('no_tanda_pengenal', this.form.no_tanda_pengenal);
                var temp_sim = document.getElementById("foto_sim");
                if(temp_sim.files[0]){
                    this.customer.append('no_sim', temp_sim.files[0]);
                }

                var url = this.$api + '/customer/'
                this.load = true;
                this.$http.post(url, this.customer, {
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
                    // location.reload();
                    this.close();
                    this.readData();
                    this.clear();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar1 = true;
                    this.load = false;
                });
            // }
        },

        close(){
            this.dialogRegister = false;
            this.clear();
            this.resetForm();
            this.load = true;
        },

        resetForm(){
            this.form = {
                nama_customer: null,
                alamat_customer: null,
                tanggal_lahir_customer: null,
                jenis_kelamin: null,
                email_customer: null,
                password: null,
                no_telp_customer: null,
                status_berkas: null,
                no_tanda_pengenal: null,
                no_sim: null,
            }
        },
    },
}
</script>
    
<style>
    html {
        scroll-behavior: smooth;
    }
    .step{
        display: flex; 
        justify-content: center;
    }
    .rounded-xl {
        background-color: yellow;
    }
    #doYou{
        font-size: 75px;
        color: rgb(160, 160, 255);
    }
    #judulappbar{
        margin-left: 15px;
        color: white;
    }
    #btn-login{
        background-color: #F9A825;
        color: white;
    }
    #btn-register:hover{
        /* background-color: #fff459; */
        color: white;
    }
    #judulHowtoRent{
        margin-bottom: 50px;
        text-align: center;
        font-size: 50px;
        color: white;
    }
    #judulJoinUs{
        /* margin-bottom: 10px; */
        text-align: center;
        font-size: 50px;
        color: white;
    }
    #con-1{
        height: 640px;
        background-color: white;
                /* background-color: #555; */
        clip-path: polygon(100% 100%, 100% 10%, 0% 10%, 0% 85%) ;
    }
    #con-2{
        height: 650px;
        background-color: rgb(160, 160, 255);
    }
    #con-3{
        height: 640px;
        background-color: rgb(255, 255, 255);
        /* background-color: #555; */
        clip-path: polygon(100% 100%, 100% 15%, 0% 0%, 0% 100%) ;
    }
    #con-4{
        height: 480px;
        background-color: rgb(160, 160, 255);
        /* background-color: #555; */
        clip-path: polygon(100% 100%, 100% 15%, 0% 0%, 0% 100%) ;
    }

/* HOVER UNTUK STEP */
    /* .cardLuar {
        border-radius: 50px;
        padding: 20px;
    }
    .v-card {
        transition: opacity .4s ease-in-out;
        background-color: yellow;
    }

    .v-card:not(.on-hover) {
        opacity: 0.6;
    } */
</style>