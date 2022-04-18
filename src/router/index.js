import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`../components/${path}.vue`);
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
                // Role
                {
                    path: '/role',
                    name: 'Role',
                    meta: { title: 'Role'},
                    component: importComponent('DataMaster/Roles'),
                },
                // {
                //     path: '/promo',
                //     name: 'Promo',
                //     meta: { title: 'Promo'},
                //     component: importComponent('DataMaster/Promos'),
                // },
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

export default router
