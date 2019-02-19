import Vue from 'vue';
import VueResource from 'vue-resource';
import StoreConfig from './store';

Vue.use(VueResource);

const store = StoreConfig.getStore();
const UserInfo = store.state.base_user;

Vue.http.interceptors.push((request) => {
    if (UserInfo.token) {
        request.headers.set("access_token", UserInfo.token);
    }
    return (response) => {
        //TODO 添加 Token
        if (response.status === 200) {
            const {code, msg} = response.body;
            if ("000000" !== code) {
                //TODO 未登录检查
                //TODO 弹出请求错误提示
            }
        }
    }
});