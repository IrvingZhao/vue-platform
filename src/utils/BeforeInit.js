import Vue from "vue";
import StoreConfig from '../config/store';

const store = StoreConfig.getStore();

export default () => {
    let token = Vue.$util.getItem("user_token");
    let userInfo = Vue.$util.getItem("user_info");
    if (token && userInfo) { //如果缓存中存在用户信息及token，刷新store中的数据
        store.dispatch("base_user/updateUserInfo", {token, userInfo});//设置用户信息
    }
}