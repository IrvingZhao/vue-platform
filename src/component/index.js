import OperatorAuth from './operatorAuth';

export default {
    install(Vue, options) {
        Vue.component("xlb-operator-auth", OperatorAuth);
    }
}