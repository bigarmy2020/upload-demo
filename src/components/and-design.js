import Vue from 'vue';
import {
	Upload,
	message,
	notification,
	ConfigProvider,
	Icon
} from 'ant-design-vue';

const components = [
	Upload,
	message,
	notification,
	ConfigProvider,
	Icon
];

export const initAntDesignComponents = () => {
	Vue.prototype.$message = message;
	Vue.prototype.$notification = notification;
	components.forEach(component => Vue.use(component));
};

