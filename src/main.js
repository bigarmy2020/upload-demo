import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/styles/main.less';
import Storage from 'vue-ls';
import '@/filters';     // base filter
import ErrorPlugin from './plugins/errorPlugin';
import { initDirectives } from './directives';
import { initAntDesignComponents } from '@/components/and-design';

initDirectives();
initAntDesignComponents();

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(Storage, {
	namespace: 'pro__',     // key prefix
	name: 'ls',             // name variable Vue.[ls] or this.[$ls],
	storage: 'local'        // storage name session, local, memory
});
Vue.use(ErrorPlugin);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
