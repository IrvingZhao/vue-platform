let store = {
    namespaced: true,
    state: {
        enableAuth: false
    },
    mutations: {
        setEnableAuth(state, enableAuth) {
            state.enableAuth = enableAuth;
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