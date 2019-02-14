import './config/api';
// import XlbPlugin from 'xlb-plugin';

import StoreConfig from './config/store';
import RouterConfig from './config/router';
import App from './App';

import './assets/style/index.scss';
import './assets/style/iconfont.scss';

export default {
    getVueConfig(routes) {
        const router = RouterConfig.getRouter(routes);
        const store = StoreConfig.getStore();
        return {
            router,
            store,
            render: h => h(App),
        }
    },
    install(Vue, options) {
        Vue.use(StoreConfig);
        Vue.$platform = {
            config: {
                enableAuth: options.enableAuth
            }
        }
        // Vue.use(XlbPlugin);
    }
}
