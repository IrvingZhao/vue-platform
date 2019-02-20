<template>
    <el-form v-if="formStatus==='valid'" ref="form" :model="validForm" :rules="validFormRule" class="form-area">
        <div class="main">
            <div class="login-form">
                <div class="form-title">忘记密码</div>
                <el-form-item prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="validForm.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="validCode">
                    <el-input placeholder="请输入验证码" v-model="validForm.validCode">
                        <el-button type="text" slot="suffix" @click="sendMobileVerCode"
                                   :disabled="validCodeButton.time>0">{{validCodeButton.text}}
                        </el-button>
                    </el-input>
                </el-form-item>
                <div class="login-button-area">
                    <el-button type="primary" class="login-button" @click="validSubmit">下一步</el-button>
                </div>
            </div>
        </div>
    </el-form>
    <el-form v-else-if="formStatus==='changePass'" ref="setPassForm" :model="changeForm" :rules="changeFormRule"
             class="form-area">
        <div class="main">
            <div class="login-form">
                <div class="form-title">设置密码</div>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入新密码" v-model="changeForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="repeatPassword">
                    <el-input type="password" placeholder="请再次输入新密码"
                              v-model="changeForm.repeatPassword"></el-input>
                </el-form-item>
                <div class="login-button-area">
                    <el-button type="primary" class="login-button" @click="setPassSubmit">确定</el-button>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    const intervalFunc = (params) => {
        params.time = 60;
        let exec = () => {
            params.time -= 1;
            if (params.time > 0) {
                params.text = params.timeFormat.replace("{time}", params.time);
            } else {
                params.text = params.baseText;
                clearTimeout(params.interval);
            }
        };
        exec();
        params.interval = setInterval(exec, 1000);
    };

    export default {
        name: "valid",
        created() {
            console.info(this);
        },
        computed: {
            ...mapGetters("base_user", ["api"]),
        },
        data() {
            let passwordValid = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请输入新密码"));
                } else {
                    callback();
                }
                this.$refs.setPassForm.validateField(["repeatPassword"])
            };
            let changeFormRepeatValid = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请再次输入新密码"));
                } else if (value !== this.changeForm.password) {
                    callback(new Error("两次输入密码不一致"));
                } else {
                    callback();
                }
            };

            return {
                formStatus: "valid",
                validCodeButton: {
                    baseText: "发送验证码",
                    text: "发送验证码",
                    time: 0,
                    timeFormat: "{time}秒后重试",
                    interval: 0,
                },
                validForm: {
                    mobile: "",
                    validCode: "",
                    accessCode: "",
                },
                validFormRule: {
                    mobile: {required: true, message: "请输入手机号"},
                    validCode: {required: true, message: "请输入验证码"}
                },
                changeForm: {
                    password: "",
                    repeatPassword: "",
                    validResult: ""
                },
                changeFormRule: {
                    password: {validator: passwordValid, trigger: "blur"},
                    repeatPassword: {validator: changeFormRepeatValid, trigger: "blur"}
                }
            }
        },
        methods: {
            sendMobileVerCode() {
                if (this.validCodeButton.time > 0) {
                    return;
                }
                this.$refs.form.validateField(["mobile"], (message) => {
                    if (!message) {
                        intervalFunc(this.validCodeButton);
                        this.api.sendMobileVerCode(this.validForm.mobile).then(({body}) => {
                            const {code, data} = body;
                            if ("000000" === code) {
                                this.validForm.accessCode = data.accessCode;
                                this.$message({
                                    type: "success",
                                    message: "验证码发送成功"
                                });
                            }
                        })
                    }
                });
            },
            validSubmit() {
                if (!this.validForm.accessCode) {
                    this.$message({
                        type: "error",
                        message: "请发送验证码后再试"
                    });
                    return;
                }
                this.$refs.form.validate().then((valid) => {
                    if (valid) {
                        this.api.checkMobileVerCode(this.validForm).then(({body}) => {
                            const {code, data} = body;
                            if ("000000" === code) {
                                this.changeForm.validResult = data.checkResult;
                                this.formStatus = 'changePass';
                            } else if ("010102" === code) {

                            }
                        });
                    }
                })
            },
            setPassSubmit() {
                if (!this.changeForm.validResult) {
                    this.$message({
                        type: "error",
                        message: "请验证手机号后再试"
                    });
                    return;
                }
                this.$refs.setPassForm.validate().then((valid) => {
                    if (valid) {
                        this.api.setPassByMobileCheck({
                            mobile: this.validForm.mobile,
                            password: this.changeForm.password,
                            valid: this.changeForm.validResult
                        }).then(({body}) => {
                            const {code, data} = body;
                            if ("000000" === code) {
                                this.$message({
                                    type: "success",
                                    message: "密码修改成功"
                                });
                                //设置用户信息
                                this.updateUserInfo(data);
                                if (data.redirect) {//如果返回带有重定向参数，执行重定向操作
                                    this.$router.push(data.redirect);
                                } else if (this.prePath) {//如果登录页为 访问某个页面后跳转，则登录成功后，跳转相关页面
                                    this.$router.push(this.prePath);
                                }else{
                                    this.$router.push("/")
                                }
                            } else if ("010200" === code) {
                                //手机验证码验证失败
                                this.formStatus = "valid";
                            }
                        });
                    }
                });
            },
            ...mapActions("base_user", ["updateUserInfo"])
        }
    }
</script>

<style lang="less" scoped>
    .form-area {
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

        .login-button-area {
            text-align: center;

            .login-button {
                width: 200px;
            }
        }

    }
</style>