<template>
  <v-main class="v-list">
    <v-card color="#00396c">
        <v-card-title class="white--text" style="font-size: 35px;">
            Selamat Datang, {{customers.nama_customer}}
        </v-card-title>
    </v-card>
  </v-main>
</template>

<script>
export default {
  name: "List",
  data(){
    return{
      customers: [],
    }
  },
  methods: {
    readData() {
        var url = this.$api + '/customer/' + 'CUS220506-010';
        this.$http.get(url, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.customers = response.data.data;
        })
    },
  },
  mounted(){
    this.readData();
  }
}
</script>

<style>

</style>