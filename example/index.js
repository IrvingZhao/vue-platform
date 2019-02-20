import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/packages/theme-chalk/src/index.scss';
import Plugin from 'xlb-plugin';
import Platform from "../src/index";

Vue.use(ElementUI);
Vue.use(Plugin);
Vue.use(Platform, {enableAuth: true});

let vueConfig = Platform.getVueConfig([]);

new Vue(vueConfig).$mount("#app");
