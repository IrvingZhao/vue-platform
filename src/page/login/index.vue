<template>
    <el-form ref="form" :model="form" :rules="formRules" class="login-form-area">
        <div class="main">
            <div class="login-form">
                <div class="form-title">欢迎使用修乐巴</div>
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名/手机号" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item prop="vercode">
                    <div class="vercode">
                        <el-input width="100" placeholder="请输入验证码" v-model="form.vercode"></el-input>
                        <div class="vercode-area" @click="updateVerCode">
                            <img :src="verCodeData"/>
                        </div>
                        <el-button type="text" @click="updateVerCode">看不清楚？</el-button>
                    </div>
                </el-form-item>
                <div class="operator-area">
                    <el-button type="text">忘记密码？</el-button>
                </div>
                <div class="login-button-area">
                    <el-button type="primary" class="login-button" @click="login">登录</el-button>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "index",
        computed: {
            ...mapGetters("base_user", ["api", "prePath"])
        },
        data() {
            return {
                verCodeData: "",
                form: {
                    username: "",
                    password: "",
                    verCodeKey: "",
                    vercode: ""
                },
                formRules: {
                    username: {required: true, message: "请输入用户名/手机号"},
                    password: {required: true, message: "请输入密码"},
                    vercode: {required: true, message: "请输入验证码"}
                }
            }
        },
        created() {
            this.updateVerCode();//加载验证码
        },
        methods: {
            login() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.api.login(this.form).then(({body}) => {
                            const {code, data} = body;
                            if ("000000" === code) {
                                //设置用户信息
                                this.updateUserInfo(data);
                                if (data.redirect) {//如果返回带有重定向参数，执行重定向操作
                                    this.$router.push(data.redirect);
                                } else if (this.prePath) {//如果登录页为 访问某个页面后跳转，则登录成功后，跳转相关页面
                                    this.$router.push(this.prePath);
                                } else {
                                    this.$router.push("/")
                                }
                            }
                        })
                    }
                })
            },
            updateVerCode() {
                this.api.getVerCodeImg().then(({body}) => {
                    const {code, data} = body;
                    if ("000000" === code) {
                        this.form.verCodeKey = data.key;
                        this.verCodeData = data.img;
                    }
                })
            },
            ...mapActions("base_user", ["updateUserInfo"]),
        }
    }
</script>

<style lang="less" scoped>
    .login-form-area {
        width: 100%;
        height: 100%;
    }

    .main {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
    }

    .login-form {
        flex: 0 0 500px;

        .form-title {
            color: #fff;
            font-size: 40px;
            line-height: 56px;
            margin-bottom: 26px;
            text-align: center;
        }

        .form-item-area {
            margin: 10px 0;
        }

        .vercode {
            display: flex;
            justify-content: space-between;

            .el-input {
                flex: 0 0 200px;
            }

            .vercode-area {
                flex: 0 0 160px;
                height: 40px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .operator-area {
            text-align: right;
        }

        .login-button-area {
            text-align: center;

            .login-button {
                width: 200px;
            }
        }

    }
</style>