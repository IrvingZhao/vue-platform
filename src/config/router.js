import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Page404 = () => import(/* webpackChunkName: "error/404" */ '../page/public/404');
const MainPage = () => import(/* webpackChunkName: "base" */ "../page/main/pages/Main");
// import Page404 from '../page/public/404';
// import MainPage from '../page/main/pages/Main';
const enableAuth = Vue.enableAuth;

let baseRouteConfig = [
    {
        name: "404",
        path: "/404",
        component: Page404
    },
];

let rootRouteConfig = {
    name: "root",
    path: "/",
    component: MainPage,
    children: []
};

let router;

const getRouter = (routes) => {
    if (!router) {
        let routerConfig = [...baseRouteConfig];

        routes.forEach((item) => {
            rootRouteConfig.children.push(item);
        });

        rootRouteConfig.children.push({
            name: "main404",
            path: "*",
            component: Page404
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
            if (enableAuth) {
                let pageKey = to.meta.key;
                let page = Vue.$menu.getPageByKey(pageKey);
                let lastMatched = to.matched[to.matched.length - 1];
                if (lastMatched) {
                    if (page) {
                        if (page.path === lastMatched.path) {
                            next();//页面找到，并地址匹配，执行跳转
                        } else {
                            //TODO 地址不匹配，跳转401
                        }
                    } else {
                        //TODO 跳转401
                    }
                } else {
                    next();
                }
            } else {
                next();
            }
            // if (!to.matched || to.matched.length === 0) {
            //     router.push({name: "main404"});
            // } else {
            //     next();
            // }
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
