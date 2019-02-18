### xlb-platform 基础框架项目

#### 提供功能

##### 整体页面布局

> 整体页面分为三部分，左侧菜单、右侧上部面包屑导航及用户信息操作等内容、右侧主内容区，满屏适配，主内容区超出后，内容区滚动

##### 路由权限控制

> 页面访问时，路由配置拦截，并进行匹配，只有用户具有页面权限时，才可访问页面

##### 操作功能组件

> ``xlb-operator-auth`` 组件提供根据slot进行过滤功能，需传入 ``pageKey`` 作为页面权限获取条件，并可通过设置 ``sort`` 进行操作排序。P.S.：所有为设置slot的内容，将连续展示

##### 面包屑操作

> 注入`Vue.prototype.$bread`，提供`set`、`push`、`clear`、`splice`方法，支持链式调用

##### 字典项操作

> 注入`Vue.prototype.$dic`，提供`getDicItemMap`、`getDicItemArray`方法，由于方法为延迟方法，建议使用`$dic.getDicItemMap('key')||{}`或`$dic.getDicItemArray('key')||[]`方式获取属性

##### 接口拦截器

> 接口拦截器，提供登陆后token自动添加、响应非200并且code!='000000'的请求自动弹出错误提示信息、未登录自动检查、请求加载时的加载条展示与取消。

##### 分页Store

> 提供 `pageInfo{pageIndex,pageSize,total}`、`query`对象的state设置，提供`updatePageIndex`、`updatePageSize`、`updateQuery`的mutations操作。
>
> 使用方法：
>
> ```js
> import {Store} from 'xlb-platform';
> Store.pageStates;
> Store.pageMutations
> ```

##### 简单公共编辑页面

> 提供激活时，自动加载数据、自动重置数据、自动设置面包屑导航信息。
>
> 使用方法：
>
> ```js
> import {EditPage} from 'xlb-platform';
> export default{
>     props:["id"],//编辑时的数据key，必须用id接收，否则会影响id被重新设置时的数据加载
>     mixins:[EditPage],
>     computed:{
>         editBread(){
>             //返回编辑时的面包屑导航信息
>         },
>         addBread(){
>             //返回新增时的面包屑导航信息
>         }
>     },
>     methods:{
>         loadData(){
>             //加载数据方法
>         },
>         reset(){
>             //重置表单方法
>         }
>     }
> }
> ```

#### 全局Store及文件目录占用

##### 全局Store占用

1. menu - 菜单store
2. dic - 字典项store
3. config - 系统配置
4. bread - 面包屑导航

##### 文件目录占用

1. error - 错误提示页面
2. base(文件) - 主页