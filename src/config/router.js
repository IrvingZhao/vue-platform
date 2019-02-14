import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Page404 = () => import(/* webpackChunkName: "error/404" */ '../page/public/404');
const Page401 = () => import(/* webpackChunkName: "error/401" */ '../page/public/401');
const MainPage = () => import(/* webpackChunkName: "base" */ "../page/main/pages/Main");
// import Page404 from '../page/public/404';
// import MainPage from '../page/main/pages/Main';

let baseRouteConfig = [
    {
        name: "Page404",
        path: "/404",
        component: Page404,
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
    const enableAuth = Vue.$platform.config.enableAuth;
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
            path: "no-auth",
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
            if (enableAuth && to.meta.auth !== false) {
                let pageKey = to.meta.key;
                let page = Vue.$menu.getPageByKey(pageKey);
                let lastMatched = to.matched[to.matched.length - 1];
                if (lastMatched) {
                    if (page) {
                        if (lastMatched.regex.test(page.path)) {
                            next();//页面找到，并地址匹配，执行跳转
                        } else {
                            router.push({name: "Page401"});
                        }
                    } else {
                        router.push({name: "Page401"});
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
