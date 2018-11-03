import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);


export default new Router({
    routes: [
        {
            path: "/",
            component: (resolve) => {
                require(['./views/Home'], resolve)
            }
        },
        {
            path: "/login",
            name: "login",
            component: (resolve) => {
                require(['./views/login'], resolve)
            }
        },
        {
            path: "/admin",
            name: "admin",
            component: (resolve) => {
                require(['./views/admin'], resolve)
            }
        },
        {
            path: "/user",
            name: "user",
            component: (resolve) => {
                require(['./views/user'], resolve)
            }
        },

    ]
});
