let store = {
    namespaced: true,
    state: {
        enableAuth: false
    },
    mutations: {
        setEnableAuth(state, enableAuth) {
            state.enableAuth = enableAuth;
        }
    },
    getters:{
        enableAuth(state){
            return state.enableAuth;
        }
    }
};
let operator = (store) => {
    return {
        getEnableAuth() {
            return store.state.base_config.enableAuth;
        }
    }
};

export default {
    store, operator, name: "base_config"
}