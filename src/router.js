import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);


export default new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: () =>
                import("./views/login.vue")
        },
        {
            path: "/admin",
            name: "admin",
            component: () =>
                import("./views/admin.vue")
        },
        {
            path: "/user",
            name: "user",
            component: () =>
                import("./views/user.vue")
        }

    ]
});
