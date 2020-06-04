import Vue from 'vue';
import VueRouter from 'vue-router';
import { constantRouterMap } from '@/router/config';
import { message } from 'ant-design-vue';

const errorHandler = (err) => {
	if (err?.message?.includes('Cannot find module')) {
		message.error('功能模块未找到，请确认此功能是否正常，或者权限配置是否正确!');
	}
};

// 解决 vue-router 3.1.0+路由，重新进入相同路由时报错的问题 Uncaught(in Promise)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(errorHandler);
};

Vue.use(VueRouter);

export default new VueRouter({
	routes: constantRouterMap,
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior: () => ({ y: 0 })
});
