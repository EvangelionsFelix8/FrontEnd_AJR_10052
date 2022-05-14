import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes:[
        // {
        //     path: "/",
        //     component: importComponent("DashboardLayout"),
        //     children: [
        //         {
        //             path: "/dashboard",
        //             name: "Dashboard",
        //             meta: { title: 'Dashboard'},
        //             component: importComponent("Dashboard"),
        //         },
        //         // // Role - 1
        //         {
        //             path: '/role',
        //             name: 'role',
        //             meta: { title: 'Roles'},
        //             component: importComponent('DataMaster/Roles'),
        //         },
        //         // Promo - 2
        //         {
        //             path: '/promo',
        //             name: 'Promo',
        //             meta: { title: 'Promo'},
        //             component: importComponent('DataMaster/manager/Promos'),
        //         },
        //         // Mitra - 3
        //         {
        //             path: '/mitra',
        //             name: 'Mitra',
        //             meta: { title: 'Mitra'},
        //             component: importComponent('DataMaster/admin/Mitras'),
        //         },
        //         // // Driver - 4
        //         {
        //             path: '/driver',
        //             name: 'Driver',
        //             meta: { title: 'Driver'},
        //             component: importComponent('DataMaster/admin/Drivers'),
        //         },
        //         // // Pegawai - 5
        //         {
        //             path: '/pegawai',
        //             name: 'Pegawai',
        //             meta: { title: 'Pegawai'},
        //             component: importComponent('DataMaster/admin/Pegawais'),
        //         },
        //         // Jadwal - 6
        //         {
        //             path: '/jadwal',
        //             name: 'Jadwal',
        //             meta: { title: 'Jadwal'},
        //             component: importComponent('DataMaster/manager/Jadwals'),
        //         },
        //         // Customer 7
        //         {
        //             path: '/customer',
        //             name: 'Customer',
        //             meta: { title: 'Customer'},
        //             component: importComponent('DataMaster/Customers'),
        //         },
        //         // // Mobil - 8
        //         {
        //             path: '/mobil',
        //             name: 'Mobil',
        //             meta: { title: 'Mobil'},
        //             component: importComponent('DataMaster/admin/Mobils'),
        //         },
        //         // Mobil - 9
        //         {
        //             path: '/detailjadwal',
        //             name: 'DetailJadwal',
        //             meta: { title: 'DetailJadwal'},
        //             component: importComponent('DataMaster/manager/DetailJadwals'),
        //         },
        //     ],
        // },
        {
            path: "/manager",
            name: "manager",
            component: importComponent("DashboardLayoutManager"),
            children: [
                {
                    path: '/promo',
                    name: 'Promo',
                    meta: { title: 'AJR • Promo'},
                    component: importComponent('DataMaster/manager/Promos'),
                },
                {
                    path: '/jadwal',
                    name: 'Jadwal',
                    meta: { title: 'AJR • Jadwal'},
                    component: importComponent('DataMaster/manager/Jadwals'),
                },
                {
                    path: '/detailjadwal',
                    name: 'DetailJadwal',
                    meta: { title: 'AJR • DetailJadwal'},
                    component: importComponent('DataMaster/manager/DetailJadwals'),
                },
            ],

            
        },
        {
            path: "/admin",
            name: "admin",
            component: importComponent("DashboardLayoutAdmin"),
            children: [
                {
                    path: '/mitra',
                    name: 'Mitra',
                    meta: { title: 'AJR • Mitra'},
                    component: importComponent('DataMaster/admin/Mitras'),
                },
                {
                    path: '/driver',
                    name: 'Driver',
                    meta: { title: 'AJR • Driver'},
                    component: importComponent('DataMaster/admin/Drivers'),
                },
                {
                    path: '/pegawai',
                    name: 'Pegawai',
                    meta: { title: 'AJR • Pegawai'},
                    component: importComponent('DataMaster/admin/Pegawais'),
                },
                {
                    path: '/mobil',
                    name: 'Mobil',
                    meta: { title: 'AJR • Mobil'},
                    component: importComponent('DataMaster/admin/Mobils'),
                },
            ],
        },
        {
            path: "/cs",
            name: "customerservice",
            component: importComponent("DashboardLayoutCS"),
            children: [
                {
                    path: '/datacustomer',
                    name: 'DataCustomer',
                    meta: { title: 'AJR (CS) • Data Customer'},
                    component: importComponent('DataMaster/Customers'),
                },
                {
                    path: '/transaksi',
                    name: 'TransaksiCS',
                    meta: { title: 'AJR (CS) • Transaksi'},
                    component: importComponent('DataMaster/Transaksis'),
                },
            ],
        },

        {
            path: "/customer",
            name: "customer",
            component: importComponent("DashboardLayoutCustomer"),
            children: [
                {
                    path: '/profilecustomer',
                    name: 'ProfileCustomer',
                    meta: { title: 'AJR • Your Profile'},
                    component: importComponent('DataMaster/CustomerProfiles'),
                },
                {
                    path: '/transaksi-customer',
                    name: 'TransaksiCustomer',
                    meta: { title: 'AJR • Transaksi Anda'},
                    component: importComponent('DataMaster/TransaksiCustomers'),
                },
                {
                    path: '/new-transaksi',
                    name: 'TransaksiBaru',
                    meta: { title: 'AJR • Transaksi Baru'},
                    component: importComponent('DataMaster/newTransaksi'),
                },
                {
                    path: '/beranda-customer',
                    name: 'BerandaCustomer',
                    meta: { title: 'AJR • Beranda'},
                    component: importComponent('DataMaster/BerandaCustomers'),
                },
                {
                    path: '/onprogress-customer',
                    name: 'OnProgressCustomer',
                    meta: { title: 'AJR • Sedang Berjalan'},
                    component: importComponent('DataMaster/OnProgress'),
                },
            ],
        },
        
        // Login
        {
            path: '/',
            name: 'LandingPage',
            meta: { title: 'Atma Jaya Rental'},
            component: importComponent('LandingPage'),
        },
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

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

export default router;