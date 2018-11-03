<template>
    <div class="header clearfix">
        <header class="clearfix">
            <img src="../../public/logo.png" alt="">
            <router-link to="/">中国航空油品质量检测实验室信息管理平台权限管理系统</router-link>
            <el-dropdown trigger="click">
                <i class="user"></i><span class="el-dropdown-link" id="userName"> {{adminName}}</span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="account=true">我的账户</el-dropdown-item>
                    <el-dropdown-item @click.native=" password=true">修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="logOut()">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </header>
        <el-dialog title="我的账户" :visible.sync="account" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="ruleForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="account = false">取 消</el-button>
                    <el-button type="primary" @click=" myAccount()">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="password" width="30%">
            <el-form :model="ruleForms" :rules="rules" ref="ruleForms" label-width="100px">
                <el-form-item label="原密码" prop="currentPassword">
                    <el-input type="password" v-model="ruleForms.currentPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForms.pass"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkpass">
                    <el-input type="password" v-model="ruleForms.checkpass"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="password = false">取 消</el-button>
                    <el-button type="primary" @click="changePassword()">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "head",
    data () {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForms.checkpass !== "") {
                    this.$refs.ruleForms.validateField("checkpass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForms.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                name: "",
                userName: "",
                email: ""
            },
            ruleForms: {
                currentPassword: "",
                pass: "",
                checkpass: ""
            },
            rules: {
                name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                currentPassword: [
                    { required: true, min: 6, message: "长度至少为6位", trigger: "blur" }
                ],
                pass: [
                    { required: true, validator: validatePass, trigger: "blur" },
                    { min: 6, message: "长度至少为6位", trigger: "blur" }
                ],
                checkpass: [
                    { required: true, validator: validatePass2, trigger: "blur" }
                ]
            },
            account: false,
            password: false,
            adminName: "",
        };
    },
    beforeCreate () {
        // 获取当前用户信息
        this.axios
            .post(`/api/services/app/session/GetCurrentLoginInformations`, {})
            .then(response => {
                let user = response.data.result.user;
                this.adminName = user.name;
                this.ruleForm.name = user.name;
                this.ruleForm.userName = user.userName;
                this.ruleForm.email = user.emailAddress;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        myAccount () {
            this.axios
                .post(`/api/services/app/profile/UpdateCurrentUserProfile`, {
                    emailAddress: this.ruleForm.email,
                    name: this.ruleForm.name,
                    surname: this.ruleForm.name,
                    userName: this.ruleForm.userName
                })
                .then(response => {
                    this.$message({
                        showClose: true,
                        message: "保存成功",
                        type: "success"
                    });
                    this.account = false;
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        changePassword () {
            this.axios
                .post(`/api/services/app/profile/ChangePassword`, {
                    currentPassword: this.ruleForms.currentPassword,
                    newPassword: this.ruleForms.checkpass
                })
                .then(response => {
                    this.$message({
                        showClose: true,
                        message: "修改成功",
                        type: "success"
                    });
                    this.password = false;
                })
                .catch(() => {
                    this.$message({
                        showClose: true,
                        message: '密码错误！',
                        type: 'error'
                    });
                });
        },
        logOut () {
            localStorage.clear();
            this.$router.push(this.$route.query.redirect || "/login");
        }
    },
};
</script>
<style>
header {
  width: 100%;
  height: 40px;
  background: #354052;
}
header img {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 30px;
}
header a {
  font-size: 18px;
  font-weight: 600;
  float: left;
  color: white;
  margin-top: 11px;
  margin-left: 5px;
}
#userName {
  color: #f5f5f5;
  font-size: 16px;
  cursor: pointer;
  vertical-align: middle;
  padding-left: 5px;
}
.home .user {
  display: inline-block;
  width: 35px;
  height: 35px;
  background: url("../../public/user.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  cursor: pointer;
}
.el-dropdown {
  float: right;
  margin-right: 60px;
}
</style>
