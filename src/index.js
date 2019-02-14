import './config/api';
// import XlbPlugin from 'xlb-plugin';

import StoreConfig from './config/store';
import RouterConfig from './config/router';
import App from './App';

import './assets/style/index.scss';
import './assets/style/iconfont.scss';

let platformOption;

export default {
    getVueConfig(routes) {
        const router = RouterConfig.getRouter(routes);
        const store = StoreConfig.getStore();
        if (platformOption) {
            store.commit("config/setEnableAuth", platformOption.enableAuth);
        }
        return {
            router,
            store,
            render: h => h(App),
        }
    },
    install(Vue, options) {
        Vue.use(StoreConfig);
        platformOption = options;
    }
}
