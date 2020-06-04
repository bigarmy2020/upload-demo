/**
 * 走菜单，走权限控制
 */
export const asyncRouterMap = [
	{
		path: '*', redirect: '/404', hidden: true
	}
];

/**
 * 基础路由
 */
export const constantRouterMap = [
	{
		path: '/',
		component: () => import(/* webpackChunkName: "upload" */ '@/views/upload')
	},
	{
		path: '/404',
		component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
	}
];
