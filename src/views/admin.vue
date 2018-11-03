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
            <el-button type="primary" @click="newAdmin=true">添加角色</el-button>
            <el-button type="success" @click="reload()">刷新</el-button>
            <el-table :data="tableData" border style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column prop="op" label="操作" width="180">
                    <template slot-scope="scope">
                        <span class="modify" @click="edit(scope.row)">修改</span>
                        <span class="delete" @click="deleted(scope.row)">删除</span>
                    </template>
                </el-table-column>
                <el-table-column prop="displayName" label="角色名">
                </el-table-column>
                <el-table-column label="创建时间" width="180">
                    <template slot-scope="scope">
                        {{ dateFormat(scope.row.creationTime,"yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="添加角色" :visible.sync=" newAdmin" width="50%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label="用户名" prop="displayName">
                    <el-input v-model="ruleForm.displayName" placeholder="请创建您的用户名"></el-input>
                </el-form-item>
                <el-form-item prop="type">
                    <el-checkbox label="默认" v-model="ruleForm.type" @click="isselect = !isselect"></el-checkbox>
                </el-form-item>
                <el-form-item label="权限" prop="Jurisdiction" class="select">
                    <el-tree :data="datas" v-model="ruleForm.jurisdiction" show-checkbox node-key="name" :default-expanded-keys="[2, 3]" ref="tree" :default-checked-keys="[5]" :props="props">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button @click=" newAdmin = false">取 消</el-button>
                    <el-button type="primary" @click="sub()">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改角色" :visible.sync="editAdmin" width="50%">
            <el-form :model="ruleForms" :rules="rules" ref="ruleForms" class="loginbox">
                <el-form-item label="用户名" prop="displayName">
                    <el-input v-model="ruleForms.displayName" placeholder="请修改您的用户名"></el-input>
                </el-form-item>
                <el-form-item prop="type">
                    <el-checkbox label="默认" v-model="ruleForms.type"></el-checkbox>
                </el-form-item>
                <el-form-item label="权限" prop="Jurisdiction" class="select">
                    <el-tree :data="datas" v-model="ruleForms.jurisdiction" show-checkbox node-key="name" ref="tree" :default-checked-keys="checked" :props="props">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="subs()">确定</el-button>
                    <el-button @click="editAdmin=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
var adminid = -1;
import head from '@/views/head'

export default {
    name: "admin",
    components: { 'v-head': head },
    data () {
        return {
            ruleForm: {
                displayName: "",
                type: false,
                jurisdiction: "",
            },
            ruleForms: {
                displayName: "",
                type: false,
                jurisdiction: "",
            },
            rules: {
                displayName: [
                    { required: true, message: "请输入角色名", trigger: "blur" }
                ],
            },
            datas: [],
            checked: [],
            tableData: [],
            props: {
                label: "displayName"
            },
            newAdmin: false,
            editAdmin: false,
        }
    },
    beforeCreate () {
        // 获取角色
        this.axios
            .post(`/api/services/app/role/GetRoles`, {
                permission: ""
            })
            .then(response => {
                this.tableData = response.data.result.items;
            })
            .catch(function (error) { });
        // 获取权限
        this.axios
            .post(`/api/services/app/role/GetRoleForEdit`, {})
            .then(response => {
                let rolesTree = [];
                let result = response.data.result.permissions;
                for (let i = 0; i < result.length; i++) {
                    if (null == result[i].parentName) {
                        rolesTree.push(result[i]);
                    }
                }
                for (let ii = 0; ii < result.length; ii++) {
                    if (result[ii].name.split(".").length == 2) {
                        for (let iii = 0; iii < rolesTree.length; iii++) {
                            if (result[ii].parentName == rolesTree[iii].name) {
                                rolesTree[iii].children || (rolesTree[iii].children = []),
                                    rolesTree[iii].children.push(result[ii]);
                            }
                        }
                    }
                }
                for (let t = 0; t < result.length; t++) {
                    if (result[t].name.split(".").length == 3) {
                        for (let s = 0; s < rolesTree.length; s++) {
                            if (rolesTree[s].children != undefined) {
                                for (let ss = 0; ss < rolesTree[s].children.length; ss++) {
                                    if (result[t].parentName == rolesTree[s].children[ss].name) {
                                        rolesTree[s].children[ss].children ||
                                            (rolesTree[s].children[ss].children = []),
                                            rolesTree[s].children[ss].children.push(result[t]);
                                    }
                                }
                            }
                        }
                    }
                }

                this.datas = rolesTree;
            })
            .catch(function (error) {
                // console.log(error);
            });
    },
    destroyed () { window.location.reload(); },
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
        // 删除角色
        deleted (row) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.axios
                        .post(`/api/services/app/role/DeleteRole`, {
                            id: row.id
                        })
                        .then(response => {
                            window.location.reload();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 新建角色发送
        sub () {
            let per = [];
            let nodes = this.$refs.tree.getCheckedNodes(false, true);
            for (let i = 0; i < nodes.length; i++) {
                per.push(nodes[i].name);
            }
            this.axios
                .post(`/api/services/app/role/CreateOrUpdateRole`, {
                    role: {
                        displayName: this.ruleForm.displayName,
                        isDefault: this.ruleForm.type
                    },
                    grantedPermissionNames: per
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
        // 修改角色
        edit (row) {
            adminid = row.id;
            this.editAdmin = true;
            this.axios
                .post(`/api/services/app/role/GetRoleForEdit`, {
                    id: row.id
                })
                .then(response => {
                    this.ruleForms.type = response.data.result.role.isDefault;
                    this.ruleForms.displayName = response.data.result.role.displayName;
                    let ch = response.data.result.grantedPermissionNames;
                    let c2 = [];
                    let c3 = [];
                    let c = [];
                    for (let i = 0; i < ch.length; i++) {
                        if (ch[i].split(".").length == 2) {
                            c2.push(ch[i]);
                        } else if (ch[i].split(".").length > 2) {
                            c3.push(ch[i]);
                        }
                    }
                    c = c3;
                    for (let ii = 0; ii < c2.length; ii++) {
                        let f = true;
                        for (let iii = 0; iii < c3.length; iii++) {
                            if (
                                c2[ii].split(".")[0] == c3[iii].split(".")[0] &&
                                c2[ii].split(".")[1] == c3[iii].split(".")[1]
                            ) {
                                f = false;
                            }
                        }
                        if (f) {
                            c.push(c2[ii]);
                        }
                    }
                    this.checked = c;
                })
                .catch(function (error) {
                    //  console.log(error);
                });
        },
        // 发送修改后角色
        subs () {
            let per = [];
            let nodes = this.$refs.tree.getCheckedNodes(false, true);
            for (let i = 0; i < nodes.length; i++) {
                per.push(nodes[i].name);
            }
            this.axios
                .post(`/api/services/app/role/CreateOrUpdateRole`, {
                    role: {
                        id: adminid,
                        displayName: this.ruleForms.displayName,
                        isDefault: this.ruleForms.type
                    },
                    grantedPermissionNames: per
                })
                .then(response => {
                    window.location.reload();
                })
                .catch(() => {
                    this.$message({
                        showClose: true,
                        message: '修改失败',
                        type: 'error'
                    });
                });
        },
    },
}
</script>
<style>
.main {
  width: 90%;
  float: left;
}
.el-menu {
  background: #354052;
}
.modify,
.delete {
  display: inline-block;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #409eff;
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
.el-form-item__label {
  float: none !important;
}
.select {
  overflow: auto;
  height: 300px;
}
.el-table th {
  background-color: #aeb4c1;
  color: #151515;
}
tbody > .el-table__row:nth-child(even) > td {
  background-color: #e7ebf1;
}
</style>
