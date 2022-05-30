<template>
    <v-main>
        <div class="red" style="height: 640px;">
            <v-card max-width="700px" style="bottom: 0; right: 0;">
                <v-toolbar color="#00396c">
                    <v-card-title >
                        <div style="text-align: center;" class="h6, white--text">
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
        </div>

        <v-snackbar v-model="snackbar.visible" auto-height :color="snackbar.color" :multi-line="snackbar.mode === 'multi-line'" :timeout="snackbar.timeout" :top="snackbar.position === 'bottom'">
            <v-layout align-center pr-4>
                <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
                <v-layout column>
                <div>
                    <strong>{{ snackbar.title }}</strong>
                </div>
                <div>
                    {{ error_message }}
                </div>
                </v-layout>
            </v-layout>
            <v-btn v-if="snackbar.timeout === 0" icon @click="snackbar.visible = false">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
    data(){
        return {
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
        }
    },
    methods: {
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
                this.snackbar = {
                    color: "error",
                    icon: "mdi-alert-circle",
                    mode: "multi-line",
                    position: "top",
                    timeout: 2000,
                    title: "Error",
                    visible: true
                };
                localStorage.removeItem("token");
                this.load = false;
            })
        },
    }
}
</script>