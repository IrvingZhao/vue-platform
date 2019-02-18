import Vue from 'vue';

const getDicByType = (typeKey) => {
    return Vue.http.get("/api/base/dic/" + typeKey);
};

let store = {
    namespaced: true,
    state: {},
    actions: {
        loadDicItem(context, typeKey) {
            getDicByType(typeKey).then(({body}) => {
                const {code, data} = body;
                if ("000000" === code) {
                    context.commit("updateDic", {typeKey, data});
                }
            })
        }
    },
    mutations: {
        updateDic(state, {typeKey, data}) {
            let dicMap = {};
            data.forEach((item) => {
                dicMap[item.key] = item.value;
            });
            Vue.set(state, typeKey, true);
            Vue.set(state, typeKey + "_map", dicMap);
            Vue.set(state, typeKey + "_list", data);
        }
    }
};
let operator = (store) => {
    return {
        /**
         * 重新加载指定key的字典项
         * @param typeKey 字典类别key
         * */
        reloadDicItem(typeKey) {
            store.dispatch("base_dic/loadDicItem", typeKey);
        },
        /**
         * 获取指定key的字典项对象
         * @param typeKey 字典类别key
         * */
        getDicItemMap(typeKey) {
            if (!store.state.base_dic[typeKey]) {
                store.dispatch("base_dic/loadDicItem", typeKey);
            }
            return store.state.base_dic[typeKey + "_map"];
        },
        /**
         * 获取指定key的字典项数组
         * @param typeKey 字典类别key
         * */
        getDicItemArray(typeKey) {
            if (!store.state.base_dic[typeKey]) {
                store.dispatch("base_dic/loadDicItem", typeKey);
            }
            return store.state.base_dic[typeKey + "_list"];
        }
    }
};

export default {
    store, operator, name: "base_dic"
}