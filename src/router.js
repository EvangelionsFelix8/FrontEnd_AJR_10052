import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes:[
        {
            path: "/",
            component: importComponent("DashboardLayout"),
            children: [
                // Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'Dashboard'},
                    component: importComponent("Dashboard"),
                },
                // Role - 1
                {
                    path: '/role',
                    name: 'role',
                    meta: { title: 'Roles'},
                    component: importComponent('DataMaster/Roles'),
                },
                // Promo - 2
                {
                    path: '/promo',
                    name: 'Promo',
                    meta: { title: 'Promo'},
                    component: importComponent('DataMaster/Promos'),
                },
                // Mitra - 3
                {
                    path: '/mitra',
                    name: 'Mitra',
                    meta: { title: 'Mitra'},
                    component: importComponent('DataMaster/Mitras'),
                },
                // Driver - 4
                {
                    path: '/driver',
                    name: 'Driver',
                    meta: { title: 'Driver'},
                    component: importComponent('DataMaster/Drivers'),
                },
                // Pegawai - 5
                {
                    path: '/pegawai',
                    name: 'Pegawai',
                    meta: { title: 'Pegawai'},
                    component: importComponent('DataMaster/Pegawais'),
                },
                // Jadwal - 6
                {
                    path: '/jadwal',
                    name: 'Jadwal',
                    meta: { title: 'Jadwal'},
                    component: importComponent('DataMaster/Jadwals'),
                },
                // Customer 7
                {
                    path: '/customer',
                    name: 'Customer',
                    meta: { title: 'Customer'},
                    component: importComponent('DataMaster/Customers'),
                },
                // Mobil - 8
                {
                    path: '/mobil',
                    name: 'Mobil',
                    meta: { title: 'Mobil'},
                    component: importComponent('DataMaster/Mobils'),
                },
                // Mobil - 9
                {
                    path: '/detailjadwal',
                    name: 'DetailJadwal',
                    meta: { title: 'DetailJadwal'},
                    component: importComponent('DataMaster/DetailJadwals'),
                },
            ],
        },

        // Login
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login'},
            component: importComponent('Login'),
        },
        // Register
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register'},
            component: importComponent('Register'),
        },
        {
            path: '*',
            redirect: '/'
        },
    ],
});

// set judul
// router.beforeEach((to, from, next) => {
//     document.title = to.meta.title;
//     if(to.name !== "Login" && localStorage.getItem("token") == null && to.name !== "Register"){
//         next({name: 'Login'});
//     }
//     else{
//         next();
//     }
// });

export default router;