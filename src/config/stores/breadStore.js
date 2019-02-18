let store = {
    namespaced: true,
    state: {
        breadNav: []
    },
    mutations: {
        addBreadNav(state, breads) {
            if (breads instanceof Array) {
                breads.forEach((item) => {
                    state.breadNav.push(item);
                })
            } else {
                state.breadNav.push(breads);
            }
        },
        set(state, breads) {
            state.breadNav = breads || [];
        },
        splice(state, index) {
            state.breadNav.splice(index);
        }
    }
};
let operator = (store) => {
    return {
        /**
         * 设置面包屑导航为传入参数
         * @param breads 导航数据
         * @return 当前对象
         * */
        set(breads) {
            store.commit("bread/set", breads);
            return this;
        },
        /**
         * 追加导航
         * @param breads 单个导航或多个导航数组
         * @return 当前对象
         * */
        push(breads) {
            store.commit("bread/addBreadNav", breads);
            return this;
        },
        /**
         * 清空导航
         * @return 当前对象
         * */
        clear() {
            store.commit("bread/set", []);
            return this;
        },
        /**
         * 截取导航
         * @param index 从index开始，删除后面导航，包含当前
         * @return 当前对象
         * */
        splice(index) {
            store.commit("bread/splice", index);
        },
        /**
         * 获取面包屑导航数据
         * @return 导航数据
         * */
        getBread() {
            return store.state.bread.breadNav;
        }
    }
};
export default {
    store, operator, name: "bread"
}