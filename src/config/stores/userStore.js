import Vue from 'vue';

const Api = {
    getVerCodeImg() {
        return Vue.http.get("/api/base/vercode");
    },
    login(loginParam) {
        return Vue.http.post("/api/login", loginParam);
    },
    sendMobileVerCode(mobile) {
        return Vue.http.post("/api/base/mobileVerCode/send", {mobile});
    },
    checkMobileVerCode(params) {
        return Vue.http.post("/api/base/mobileVerCode/check", params);
    },
    setPassByMobileCheck(params) {
        return Vue.http.put("/api/base/pass/mobile", params);
    }
};

const store = {
    namespaced: true,
    state: {
        userInfo: {},
        token: ""
    },
    mutations: {
        updateToken(state, token) {
            state.token = token;
            Vue.$util.setItem("user_token", token);//设置缓存
        },
        updateUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            Vue.$util.setItem("user_info", userInfo);//设置缓存
        }
    },
    actions: {},
    getters: {
        api() {
            return Api;
        }
    }
};
const operator = (store) => {
    return {
        getUserInfo() {
            return store.state.base_user.userInfo;
        }
    }
};

export default {
    store, operator, name: "base_user"
}