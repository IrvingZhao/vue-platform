import Vue from 'vue';
import VueRouter from 'vue-router';
import StoreConfig from './store';

Vue.use(VueRouter);

const Page404 = () => import(/* webpackChunkName: "error/404" */ '../page/public/404');
const Page401 = () => import(/* webpackChunkName: "error/401" */ '../page/public/401');
const MainPage = () => import(/* webpackChunkName: "base" */ "../page/main/pages/Main");
const Login = () => import(/* webpackChunkName: 'login/pass'*/ "../page/login");
const ForgetPassValid = () => import(/* webpackChunkName:'login/reset' */ "../page/forgetPass");
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
    },
    {
        name: "ForgetPass",
        path: "/forget",
        component: ForgetPassValid,
        meta: {
            auth: false
        }
    }
];

let rootRouteConfig = {
    name: "root",
    path: "/",
    component: MainPage,
    children: [
        {
            name: "Page401",
            path: "/no-auth",
            component: Page401,
            meta: {
                auth: true
            }
        },
        {
            name: "main404",
            path: "*",
            component: Page404,
            meta: {
                auth: true
            }
        }
    ]
};

let router;

function initRouter(routes) {
    let routerConfig = [...baseRouteConfig];

    routes.forEach((item) => {
        rootRouteConfig.children.push(item);
    });

    routerConfig.push(rootRouteConfig);

    router = new VueRouter({
        mode: "hash",
        routes: routerConfig
    });
}

function setRouterGuards() {
    if (process.env.NODE_ENV !== 'production') {
        router.beforeEach(loggerGuard);
    }
    let enableAuth = store.getters["base_config/enableAuth"];
    if (enableAuth) {// 启用权限检查
        router.beforeEach(loginCheckGuard);
        router.beforeEach(authCheckGuard);
    }
}

function loggerGuard(to, from, next) {
    console.info("======================== router - info ================");
    console.info(to);
    console.info(from);
    next();
}

function loginCheckGuard(to, from, next) {
    let token = store.getters["base_user/token"];
    if (token) {
        if (to.name === "Login") {
            next("/");
        } else {
            next();
        }
    } else {
        if (to.meta.auth !== false) {
            store.commit("base_user/setPrePath", to.path);
            next("/login");
        } else {
            next();
        }
    }
}

function authCheckGuard(to, from, next) {
    let pageKey = to.meta.key;
    if (pageKey) {
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
}

const getRouter = (routes) => {
    if (!router) {
        //初始化router
        initRouter(routes);
        //设置路由拦截器
        setRouterGuards();
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
