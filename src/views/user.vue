<template>
    <div class="home clearfix">
        <v-head></v-head>
        <el-col class="menu">
            <el-menu index="1">
                <el-menu-item index="2">
                    <span slot="title">
                        <router-link to="/admin">角色</router-link>
                    </span>
                </el-menu-item>
                <el-menu-item index="3">
                    <router-link to="/user">用户</router-link>
                </el-menu-item>
            </el-menu>
        </el-col>
        <div class="main">
            <el-button type="primary" @click="newUser = true">添加用户</el-button>
            <el-button type="success" @click="reload()">刷新</el-button>
            <el-table :data="tableData" border style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column prop="op" label="操作" width="150">
                    <template slot-scope="scope">
                        <span class="modify" @click="edit(scope.row)">修改</span>
                        <span class="delete" @click="deleted(scope.row)">删除</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名" header-align="center" width="100">
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="90">
                </el-table-column>
                <el-table-column prop="phoneNumber" align="center" label="手机号码" width="110">
                </el-table-column>
                <el-table-column prop="emailAddress" header-align="center" label="电子邮箱" width="200">
                </el-table-column>
                <el-table-column label="性别" align="center" width="50">
                    <template slot-scope="scope">
                        {{(0=== scope.row.profile.gender)?"女":"男" }}
                    </template>
                </el-table-column>
                <el-table-column label="生日" align="center" width="100">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.profile && scope.row.profile.birthday, "yyyy-MM-dd" ) }}
                    </template>
                </el-table-column>
                <el-table-column label="身份证" align="center" prop="profile.idCardNumber" width="120">
                </el-table-column>
                <el-table-column label="公司" align="center" prop="profile.department" width="100">
                </el-table-column>
                <el-table-column label="地址" align="center" prop="profile.address" width="150">
                </el-table-column>
                <el-table-column label="职位" align="center" prop="profile.position" width="80">
                </el-table-column>
                <el-table-column label="职称" align="center" prop="profile.title" width="80">
                </el-table-column>
                <el-table-column label="入职时间" align="center" width="100">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.profile && scope.row.profile.entryDate, "yyyy-MM-dd" ) }}
                    </template>
                </el-table-column>
                <el-table-column label="离职时间" align="center" width="100">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.profile && scope.row.profile.leaveDate, "yyyy-MM-dd" ) }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="90">
                    <template slot-scope="scope">
                        {{(true=== scope.row.isActive)?"已激活":"未激活" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否验证邮箱" width="100">
                    <template slot-scope="scope">
                        {{(true=== scope.row.isEmailConfirmed)?"是":"否" }}
                    </template>
                </el-table-column>
                <el-table-column label="最后登录时间" align="center" width="175">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.lastLoginTime,"yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" width="175">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.creationTime,"yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column prop="profile.remark" align="center" label="备注" width="100">
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="新增用户" :visible.sync="newUser" width="50%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-tabs type="border-card">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="ruleForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phoneNumber">
                            <el-input v-model="ruleForm.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="emailAddress">
                            <el-input v-model="ruleForm.emailAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="passwordRepeat">
                            <el-input type="password" v-model="ruleForm.passwordRepeat"></el-input>
                        </el-form-item>
                        <el-form-item prop="send">
                            <el-checkbox label="发送激活邮件" v-model="ruleForm.send"></el-checkbox>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="角色信息">
                        <el-form-item label=" 请勾选此用户所属角色:" prop="types">
                            <el-checkbox-group v-model="ruleForm.types">
                                <el-checkbox v-for="item in adminData" :checked="item.isAssigned" :label="item.roleName" :key="item.roleId">{{item.roleDisplayName}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="详细信息">
                        <el-form-item label="性别" prop="sex">
                            <el-radio label="1" v-model="ruleForm.sex">男</el-radio>
                            <el-radio label="0" v-model="ruleForm.sex">女</el-radio>
                        </el-form-item>
                        <el-form-item label="生日" required>
                            <el-col :span="18">
                                <el-form-item prop="birthday">
                                    <el-date-picker type="date" placeholder="请选择生日" v-model="ruleForm.birthday" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idcardnumber">
                            <el-input v-model="ruleForm.idcardnumber"></el-input>
                        </el-form-item>
                        <el-form-item label="公司" prop="company">
                            <el-input v-model="ruleForm.company"></el-input>
                        </el-form-item>
                        <el-form-item label="职称" prop="title">
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="ruleForm.position"></el-input>
                        </el-form-item>
                        <el-form-item label="入职时间" required>
                            <el-col :span="18">
                                <el-form-item prop="entrydate">
                                    <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForm.entrydate" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="离职时间">
                            <el-col :span="18">
                                <el-form-item prop="leavedate">
                                    <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForm.leavedate" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="地址" prop="adress">
                            <el-input v-model="ruleForm.adress"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="ruleForm.remark"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
                <el-form-item>
                    <el-button type="primary" @click="sub()">保存</el-button>
                    <el-button @click="newUser=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="editUser" width="50%">
            <el-form :model="ruleForms" :rules="rules" ref="ruleForm">
                <el-tabs type="border-card">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="ruleForms.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="ruleForms.name"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phoneNumber">
                            <el-input v-model="ruleForms.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="emailAddress">
                            <el-input v-model="ruleForms.emailAddress"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="角色信息">
                        <el-form-item label=" 请勾选此用户所属角色：" prop="types">
                            <el-checkbox-group v-model="ruleForms.types">
                                <el-checkbox v-for="item in editAdminData" :checked="item.isAssigned" :label="item.roleName" :key="item.roleId">{{item.roleDisplayName}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="详细信息">
                        <el-form-item label="性别" prop="sex">
                            <el-radio label="1" v-model="ruleForms.sex">男</el-radio>
                            <el-radio label="0" v-model="ruleForms.sex">女</el-radio>
                        </el-form-item>
                        <el-form-item label="生日" required>
                            <el-col :span="18">
                                <el-form-item prop="birthday">
                                    <el-date-picker type="date" placeholder="请选择生日" v-model="ruleForms.birthday" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idcardnumber">
                            <el-input v-model="ruleForms.idcardnumber"></el-input>
                        </el-form-item>
                        <el-form-item label="公司" prop="company">
                            <el-input v-model="ruleForms.company"></el-input>
                        </el-form-item>
                        <el-form-item label="职称" prop="title">
                            <el-input v-model="ruleForms.title"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="ruleForms.position"></el-input>
                        </el-form-item>
                        <el-form-item label="入职时间" required>
                            <el-col :span="18">
                                <el-form-item prop="entrydate">
                                    <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForms.entrydate" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="离职时间">
                            <el-col :span="18">
                                <el-form-item prop="leavedate">
                                    <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForms.leavedate" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="地址" prop="adress">
                            <el-input v-model="ruleForms.adress"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="ruleForms.remark"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
                <el-form-item>
                    <el-button type="primary" @click="subs()">保存</el-button>
                    <el-button @click="editUser=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
var userId = -1;
import head from '@/views/head'

export default {
    name: "user",
    components: { 'v-head': head },
    data () {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.passwordRepeat !== "") {
                    this.$refs.ruleForm.validateField("passwordRepeat");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                userName: "",
                name: "",
                phoneNumber: "",
                emailAddress: "",
                types: [],
                password: "",
                send: false,
                passwordRepeat: "",
                sex: "",
                birthday: "",
                idcardnumber: "",
                company: "",
                title: "",
                position: "",
                entrydate: "",
                leavedate: "",
                adress: "",
                remark: ""
            },
            ruleForms: {
                userName: "",
                name: "",
                phoneNumber: "",
                emailAddress: "",
                types: [],
                type: true,
                active: true,
                sex: "",
                birthday: "",
                idcardnumber: "",
                company: "",
                title: "",
                position: "",
                entrydate: "",
                leavedate: "",
                adress: "",
                remark: ""
            },
            rules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
                phoneNumber: [
                    { required: true, message: "请输入手机号码", trigger: "blur" }
                ],
                emailAddress: [
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
                password: [
                    { required: true, validator: validatePass, trigger: "blur" },
                    { min: 6, message: "长度至少为6位", trigger: "blur" }
                ],
                passwordRepeat: [
                    { required: true, validator: validatePass2, trigger: "blur" }
                ],
                sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
                adress: [{ required: true, message: "请输入地址", trigger: "blur" }],
                birthday: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择生日",
                        trigger: "blur"
                    }
                ],
                idcardnumber: [
                    { required: true, message: "请输入身份证号", trigger: "blur" }
                ],
                company: [{ required: true, message: "请输入公司", trigger: "blur" }],
                title: [{ required: true, message: "请输入职称", trigger: "blur" }],
                position: [{ required: true, message: "请输入职位", trigger: "blur" }],
                entrydate: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择日期",
                        trigger: "blur"
                    }
                ],
            },
            tableData: [],
            adminData: [],
            editAdminData: [],
            newUser: false,
            editUser: false,
        }
    },
    beforeCreate () {
        // 获取用户
        this.axios
            .post(`/api/services/app/user/GetUsers`, {})
            .then(response => {
                this.tableData = response.data.result.items;
            })
            .catch(function (error) {
                console.log(error);
            });
        // 获取角色所属信息
        this.axios
            .post(`/api/services/app/user/GetUserForEdit`, {
                id: null
            })
            .then(response => {
                this.adminData = response.data.result.roles
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        reload () {
            window.location.reload();
        },
        dateFormat (datetime, fmt) {
            if (parseInt(datetime) == datetime) {
                if (datetime.length == 10) {
                    datetime = parseInt(datetime) * 1000;
                } else if (datetime.length == 13) {
                    datetime = parseInt(datetime);
                }
            }
            datetime = new Date(datetime);
            var o = {
                "M+": datetime.getMonth() + 1,
                "d+": datetime.getDate(),
                "h+": datetime.getHours(),
                "m+": datetime.getMinutes(),
                "s+": datetime.getSeconds(),
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        // 新增用户
        sub () {
            this.axios
                .post(`/api/services/app/user/CreateOrUpdateUser`, {
                    user: {
                        name: this.ruleForm.name,
                        surname: "",
                        userName: this.ruleForm.userName,
                        emailAddress: this.ruleForm.emailAddress,
                        phoneNumber: this.ruleForm.phoneNumber,
                        password: this.ruleForm.password,
                        passwordRepeat: this.ruleForm.passwordRepeat,
                        isActive: true,
                        shouldChangePasswordOnNextLogin: true,
                        isTwoFactorEnabled: false,
                        isLockoutEnabled: true,
                        userType: 0,
                        profile: {
                            gender: this.ruleForm.sex,
                            birthday: this.ruleForm.birthday,
                            headImgURL: "",
                            department: this.ruleForm.company,
                            position: this.ruleForm.position,
                            title: this.ruleForm.title,
                            entryDate: this.ruleForm.entrydate,
                            leaveDate: this.ruleForm.leavedate,
                            remark: this.ruleForm.remark,
                            idCardNumber: this.ruleForm.idcardnumber,
                            address: this.ruleForm.adress
                        }
                    },
                    assignedRoleNames: this.ruleForm.types,
                    sendActivationEmail: this.ruleForm.send,
                    setRandomPassword: false
                })
                .then(response => {
                    window.location.reload();

                })
                .catch(() => {
                    this.$message({
                        showClose: true,
                        message: '创建失败',
                        type: 'error'
                    });
                });
        },
        // 删除用户
        deleted (row) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.axios
                        .post(`/api/services/app/user/DeleteUser`, {
                            id: row.id
                        })
                        .then(response => {
                            window.location.reload();
                        })
                        .catch(() => {
                            this.$message({
                                showClose: true,
                                message: '你不能删除自己账户!',
                                type: 'error'
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        edit (row) {
            userId = row.id;
            this.editUser = true;
            this.axios
                .post(`/api/services/app/user/GetUserForEdit`, {
                    id: row.id
                })
                .then(response => {
                    this.editAdminData = response.data.result.roles;
                    let user = response.data.result.user;
                    this.ruleForms.name = user.name;
                    this.ruleForms.userName = user.userName;
                    this.ruleForms.phoneNumber = user.phoneNumber;
                    this.ruleForms.emailAddress = user.emailAddress;
                    this.ruleForms.birthday = user.profile.birthday;
                    this.ruleForms.company = user.profile.department;
                    this.ruleForms.position = user.profile.position;
                    this.ruleForms.title = user.profile.title;
                    this.ruleForms.sex = (user.profile.gender).toString();
                    this.ruleForms.idcardnumber = user.profile.idCardNumber;
                    this.ruleForms.entrydate = user.profile.entryDate;
                    this.ruleForms.leavedate = user.profile.leaveDate;
                    this.ruleForms.adress = user.profile.address;
                    this.ruleForms.remark = user.profile.remark;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        subs () {
            this.axios
                .post(`/api/services/app/user/CreateOrUpdateUser`, {
                    user: {
                        id: userId,
                        name: this.ruleForms.name,
                        surname: "",
                        userName: this.ruleForms.userName,
                        emailAddress: this.ruleForms.emailAddress,
                        phoneNumber: this.ruleForms.phoneNumber,
                        password: null,
                        passwordRepeat: "",
                        isActive: true,
                        shouldChangePasswordOnNextLogin: true,
                        isTwoFactorEnabled: false,
                        isLockoutEnabled: true,
                        userType: 0,
                        profile: {
                            id: userId,
                            gender: this.ruleForms.sex,
                            birthday: this.ruleForms.birthday,
                            headImgURL: "",
                            department: this.ruleForms.company,
                            position: this.ruleForms.position,
                            title: this.ruleForms.title,
                            entryDate: this.ruleForms.entrydate,
                            leaveDate: this.ruleForms.leavedate,
                            remark: this.ruleForms.remark,
                            idCardNumber: this.ruleForms.idcardnumber,
                            address: this.ruleForms.adress
                        }
                    },
                    assignedRoleNames: this.ruleForms.types,
                    sendActivationEmail: false,
                    setRandomPassword: false
                })
                .then(response => {
                    window.location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
}
</script>
<style>
.main {
  width: 90%;
  float: left;
}
.modify,
.delete {
  display: inline-block;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #3a8ee6;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.delete {
  background: #f56c6c;
  margin-left: 20px;
}
.main button {
  width: 97px;
  font-size: 14px;
  margin: 20px 0 10px 12px;
  padding: 6px 12px;
}
.el-input {
  width: 90%;
  float: right;
}
.el-input__inner {
  height: 28px;
}
.el-form-item {
  margin-bottom: 10px;
}
.el-col-18 {
  width: 90%;
  float: right;
}
</style>
