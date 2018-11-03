<template>
    <div class="login">
        <div style="background:#354052">
            <div>
                <h3> <i></i>中国航空油品质量检测实验室信息管理平台权限管理系统</h3>
            </div>
        </div>
        <div class="bg">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loginbox">
                <h4>权限管理平台</h4>
                <el-form-item>
                    <div class="icon">
                        <i class="lab"></i>
                    </div>
                    <el-cascader :options="options" v-model="selectedOptions" @change="handleChange" placeholder="请选择实验室" class="content" :props="props" :show-all-levels="false" filterable change-on-select>
                    </el-cascader>
                </el-form-item>
                <el-form-item prop="name">
                    <div class="icon">
                        <i class="accound"></i>
                    </div>
                    <el-input v-model="ruleForm.name" placeholder="用户名或邮箱地址" class="content"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <div class="icon">
                        <i class="password"></i>
                    </div>
                    <el-input v-model="ruleForm.password" placeholder="密码" class="content" type="password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: "login",
    data () {
        return {
            ruleForm: {
                lab: "",
                name: "",
                password: ""
            },
            rules: {
                name: [
                    { required: true, message: "请输入用户名或邮箱地址", trigger: "blur" }
                ],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }]
            },
            options: [],
            props: {
                value: "name",
                label: "name",
                children: "items"
            },
            selectedOptions: []
        };
    },
    beforeCreate () {
        this.axios
            .post(`/api/services/app/tenant/GetTreeTenant`)
            .then(response => {
                this.options = this.setoptions(response.data.result);
            })
            .catch(function (error) { });
    },
    destroyed () { window.location.reload(); },
    methods: {
        handleChange (value) { },
        submitForm (formName) {
            this.axios
                .post(`/api/Account`, {
                    tenancyName: this.selectedOptions[this.selectedOptions.length - 1],
                    usernameOrEmailAddress: this.ruleForm.name,
                    password: this.ruleForm.password
                })
                .then(response => {
                    this.$message({
                        showClose: true,
                        message: '登录成功',
                        type: 'success'
                    });
                    localStorage.setItem("token", response.data.result.authToken);
                    this.$router.push(this.$route.query.redirect || "/");
                })
                .catch(() => {
                    this.$message({
                        showClose: true,
                        message: '用户名或密码错误',
                        type: 'error'
                    });
                });
        },
        setoptions (ops) {
            for (var i = 0; i < ops.length; i++) {
                if (ops[i].items.length > 0) {
                    this.setoptions(ops[i].items);
                } else {
                    ops[i].items = null;
                }
            }
            return ops;
        }
    }
};
</script>
<style>
body {
  background: url("../assets/bg.jpg") no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  position: relative;
}
.login > div:first-child > div {
  width: 1200px;
  margin: auto;
  height: 60px;
  line-height: 60px;
}
.login > div:first-child > div i {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url("../../public/logo.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  margin-right: 5px;
}
.login h3 {
  font-size: 20px;
  font-weight: bolder;
  color: white;
  vertical-align: middle;
}
.login .bg {
  width: 100%;
}
.loginbox {
  width: 500px;
  padding: 20px 50px;
  background: white;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -176px;
  border-radius: 5px;
}
.bg .loginbox h4 {
  width: 100%;
  height: 35px;
  text-align: left;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: normal;
  color: #444;
}
.icon {
  display: inline-block;
  width: 50px;
  height: 40px;
  background-color: #f5f7fa;
  position: relative;
  border: 1px solid #d8dce5;
  vertical-align: middle;
  position: relative;
}
.lab,
.accound,
.password {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("../../public/lab.png") no-repeat;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -8px;
  margin-top: -8px;
}
.accound {
  background: url("../../public/accound.png") no-repeat;
}
.password {
  background: url("../../public/password.png") no-repeat;
}
.content {
  width: 350px;
  border-radius: none;
}
button {
  width: 100%;
  background: -webkit-linear-gradient(left top, #346bbe, #3c9ee7) !important;
  background: -moz-linear-gradient(left top, #346bbe, #3c9ee7) !important;
  background: -ms-linear-gradient(left top, #346bbe, #3c9ee7) !important;
  background: -o-linear-gradient(left top, #346bbe, #3c9ee7) !important;
  background: linear-gradient(left top, #346bbe, #3c9ee7) !important;
  color: #fff !important;
  font-size: 16px !important;
  border-radius: 40px !important;
}
.el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  vertical-align: middle;
}
</style>
