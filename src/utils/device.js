import enquireJs from 'enquire.js';

const isFunction = input => typeof input === 'function';

const enquireScreen = (callback) => {
	// tablet
	const tabletHandler = {
		match: () => {
			isFunction(callback) && callback(0);
		},
		unMatch: () => {
			isFunction(callback) && callback(-1);
		}
	};
	// mobile
	const mobileHandler = {
		match: () => {
			isFunction(callback) && callback(1);
		}
	};
	enquireJs.register('screen and (max-width: 1087.99px)', tabletHandler);
	enquireJs.register('screen and (max-width: 767.99px)', mobileHandler);
};

export default enquireScreen;
