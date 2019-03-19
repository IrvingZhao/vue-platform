import Vue from 'vue';
import Vuex from 'vuex';

import DicStore from './stores/dicStore';
import BreadStore from './stores/breadStore';
import MenuStore from './stores/menuStore';
import ConfigStore from './stores/configStore';
import UserStore from './stores/userStore';
import SystemStore from './stores/systemStore';

const StoreArray = [
    BreadStore, ConfigStore, DicStore, MenuStore, UserStore, SystemStore
];

Vue.use(Vuex);

let store;

const getStore = () => {
    if (!store) {
        let modules = {};
        StoreArray.forEach((item) => {
            modules[item.name] = item.store;
        });
        store = new Vuex.Store({
            strict: process.env.NODE_ENV !== 'production',
            modules: modules,
        });
    }
    return store;
};

export default {
    getStore,
    install(Vue) {
        Vue.prototype.$bread = BreadStore.operator(getStore());
        Vue.prototype.$config = ConfigStore.operator(getStore());
        Vue.prototype.$dic = DicStore.operator(getStore());
        Vue.prototype.$menu = MenuStore.operator(getStore());
        Vue.prototype.$user = UserStore.operator(getStore());
        Vue.prototype.$system = SystemStore.operator(getStore());
    }
};
