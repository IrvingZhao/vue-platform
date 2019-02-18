import Vue from 'vue';
import VueRouter from 'vue-router';
import StoreConfig from './store';

Vue.use(VueRouter);

const Page404 = () => import(/* webpackChunkName: "error/404" */ '../page/public/404');
const Page401 = () => import(/* webpackChunkName: "error/401" */ '../page/public/401');
const MainPage = () => import(/* webpackChunkName: "base" */ "../page/main/pages/Main");
const Login = () => import(/* webpackChunkName: 'login/pass'*/ "../page/login");
const store = StoreConfig.getStore();

let baseRouteConfig = [
    {
        name: "Page404",
        path: "/404",
        component: Page404,
        meta: {
            auth: false
        }
    },
    {
        name: "Login",
        path: "/login",
        component: Login,
        meta: {
            auth: false
        }
    }
];

let rootRouteConfig = {
    name: "root",
    path: "/",
    component: MainPage,
    children: []
};

let router;

const getRouter = (routes) => {
    //初始化路由时，检查用户状态
    const config = store.state.base_config;

    let token = Vue.$util.getItem("user_token");
    let userInfo = Vue.$util.getItem("user_info");
    if (token && userInfo) { //如果缓存中存在用户信息及token，刷新store中的数据
        store.commit("base_user/updateToken", token);
        store.commit("base_user/updateUserInfo", userInfo);
        store.commit("base_menu/initUserAuth");//加载用户权限信息
    }
    const stateUserInfo = store.state.base_user;
    if (!router) {
        let routerConfig = [...baseRouteConfig];

        routes.forEach((item) => {
            rootRouteConfig.children.push(item);
        });

        rootRouteConfig.children.push({
            name: "main404",
            path: "*",
            component: Page404,
            meta: {
                auth: false
            }
        }, {
            name: "Page401",
            path: "/no-auth",
            component: Page401,
            meta: {
                auth: false
            }
        });

        routerConfig.push(rootRouteConfig);

        router = new VueRouter({
            mode: "hash",
            routes: routerConfig
        });
        router.beforeEach((to, from, next) => {
            console.info("======================== router - info ================");
            console.info(to);
            console.info(from);
            if (config.enableAuth) {
                if (!stateUserInfo.token) {//跳转页面非 login  并且 store中不包含  token  跳转登录页
                    if (to.name === "Login") {
                        next();
                    } else {
                        next("/login")
                    }
                    return;
                }
                if (to.meta.auth !== false) {
                    let pageKey = to.meta.key;
                    let page = Vue.$menu.getPageByKey(pageKey);
                    let lastMatched = to.matched[to.matched.length - 1];
                    if (lastMatched) {
                        if (page) {
                            if (lastMatched.regex.test(page.path)) {
                                next();//页面找到，并地址匹配，执行跳转
                            } else {
                                //页面地址不匹配，跳转401
                                next("/no-auth");
                            }
                        } else {
                            //页面对象未找到，跳转401
                            next("/no-auth");
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            } else {
                next();
            }

        });
    }
    return router;
};

const push = (path, onComplete, onAbort) => {
    const router = getRouter();
    router.push(path, onComplete, onAbort);
};

export default {
    getRouter,
    push
}
