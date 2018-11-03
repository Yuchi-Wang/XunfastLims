<template>
    <div class="home">
        <v-head></v-head>
        <el-menu index="1" class="menu">
            <el-menu-item index="2">
                <span slot="title">
                    <router-link to="/admin">角色</router-link>
                </span>
            </el-menu-item>
            <el-menu-item index="3">
                <router-link to="/user">用户</router-link>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import head from '@/views/head'

export default {
    components: { 'v-head': head },
    name: "home",
    destroyed () { window.location.reload(); },

};
</script>
<style>
.home .menu {
  width: 10%;
  height: 1000px;
  background: #354052;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  float: left;
}
.el-menu-item,
.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}
.home .menu a {
  display: inline-block;
  width: 100%;
  height: 40px;
  color: white;
}
.el-menu-item:hover {
  background-color: #fff !important;
}
.el-menu-item:hover a {
  color: #008cd6;
}
</style>

