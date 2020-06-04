const storage = {
	state: {
		cache: {}
	},
	mutations: {
		ADD_ITEM: (state, { key, value }) => {
			state.cache[key] = value;
		},
		REMOVE_ITEM: (state, key) => {
			delete state.cache[key];
		},
		REMOVE_ALL: (state) => {
			state.cache = {};
		}
	},
	actions: {
		addItem ({ commit }, { key, value }) {
			commit('ADD_ITEM', { key, value });
		},
		removeItem ({ commit }, key) {
			return commit('REMOVE_ITEM', key);
		},
		removeAll ({ commit }) {
			return commit('REMOVE_ALL');
		}
	}
};

export default storage;
