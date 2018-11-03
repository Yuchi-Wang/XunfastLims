import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import axios from 'axios'
import Vueaxios from 'vue-axios'
import store from "./store"
import "../public/reset.css"
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"

Vue.use(ElementUI);
Vue.use(Vueaxios, axios)

axios.defaults.baseURL = 'http://47.96.234.246:8088'
axios.defaults.timeout = 5000

Vue.config.productionTip = false;
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    } else {
        // window.location.pathname = '/login'
    }
    return config;
}, function (err) {
    return Promise.reject(err);
})

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        path: '/login',
                    })
            }
        }
        return Promise.reject(error.response.data)
    })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
