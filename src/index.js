import './config/api';
// import XlbPlugin from 'xlb-plugin';

import StoreConfig from './config/store';
import RouterConfig from './config/router';
import App from './App';

import './assets/style/index.scss';
import './assets/style/iconfont.scss';

import PlatformComponent from './component';
import BeforeInit from './utils/BeforeInit'

import {Store, EditPage} from './base';

let platformOption;

export default {
    getVueConfig(routes) {
        const store = StoreConfig.getStore();
        if (platformOption) {
            store.commit("base_config/setEnableAuth", platformOption.enableAuth);
        }
        const router = RouterConfig.getRouter(routes);
        BeforeInit();// 返回Vue配置前，执行相关预处理语句
        return {
            router,
            store,
            render: h => h(App),
        }
    },
    install(Vue, options) {
        Vue.use(PlatformComponent);
        Vue.use(StoreConfig);
        platformOption = options;
    }
}
export {
    Store, EditPage
}
