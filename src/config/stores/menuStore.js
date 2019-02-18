import Vue from "vue";

const getUserMenu = () => {
    return Vue.http.get("/api/base/menu");
};

const getUserAuth = () => {
    return Vue.http.get("/api/base/auth");
};

const store = {
    namespaced: true,
    state: {
        menuTreeList: null,
        pageMap: {},
        pageKeyMap: {}
    },
    mutations: {
        updateMenu(state, menus) {
            state.menuTreeList = menus;
        },
        updateUserAuth(state, authObjects) {
            let pageMap = {};
            let operatorMap = {};
            //构建 page key value对象
            authObjects.forEach((item) => {
                if (item.type === "page") {
                    pageMap[item.id] = item;
                    state.pageKeyMap[item.key] = item;
                } else if (item.type === "operator") {
                    operatorMap[item.id] = item;
                }
            });
            for (let operatorKey in operatorMap) {
                if (operatorMap.hasOwnProperty(operatorKey)) {
                    let itemOperator = operatorMap[operatorKey];
                    let page = pageMap[itemOperator.pageId];
                    let refPage = pageMap[itemOperator.refPageId];
                    if (page) {
                        //关联 page 和 operators
                        (page.operators = page.operators || []).push(itemOperator);
                    }
                    if (refPage) {
                        //构建 operator 树
                        itemOperator.children = (refPage.operators = refPage.operators || []);
                    }
                }
            }
            state.pageMap = pageMap;
        }
    },
    actions: {
        loadMenu(context) {
            getUserMenu().then(({body}) => {
                const {code, msg, data} = body;
                if ("000000" === code) {
                    let menuTree = Vue.$util.generateTree(data);
                    context.commit("updateMenu", menuTree);
                }
            });
        },
        loadAuth(context) {
            getUserAuth().then(({body}) => {
                const {code, data} = body;
                if ("000000" === code) {
                    context.commit("updateUserAuth", data);
                }
            });
        },
        initUserAuth(context) {
            context.commit("loadMenu");
            context.commit("loadAuth");
        }
    }
};
const operator = (store) => {
    return {
        reloadMenu() {
            store.dispatch("base_menu/loadMenu");
        },
        getPageById(pageId) {
            return store.state.base_menu.pageMap[pageId];
        },
        getPageByKey(pageKey) {
            return store.state.base_menu.pageKeyMap[pageKey];
        },
        getPageOperatorByKey(pageKey) {
            let page = this.getPageByKey(pageKey);
            if (page) {
                return page.operators;
            } else {
                return [];
            }
        }
    }
};

export default {
    store, operator, name: "base_menu"
}