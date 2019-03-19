import Vue from 'vue';

const store = {
    namespaced: true,
    state: {
        activeRouterView: true,
    },
    mutations: {
        setActiveRouterView(state, activeRouterView) {
            state.activeRouterView = activeRouterView;
        }
    },
    actions: {
        reload(context) {
            context.commit("setActiveRouterView", false);
            Vue.nextTick(() => {
                context.commit("setActiveRouterView", true);
            })
        }
    }
};

const operator = (store) => {
    return {
        reload() {
            store.dispatch("base_system/reload")
        }
    }
};
export default {
    store, operator, name: "base_system"
}