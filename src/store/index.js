import Vue from 'vue';
import Vuex from 'vuex';

import spin from './modules/spin';
import storage from './modules/storage';

import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		spin,
		storage
	},
	state: {},
	mutations: {},
	actions: {},
	getters
});
