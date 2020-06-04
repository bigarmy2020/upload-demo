import store from '@/store';

export const ICache = {
	addItem (key, value) {
		store.dispatch('addItem', { key, value });
	},
	getItem (key) {
		return store.getters.cache[key];
	},
	removeItem (key) {
		store.dispatch('removeItem', key);
	},
	removeAll () {
		store.dispatch('removeAll');
	}
};
