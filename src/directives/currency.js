import { CurrencyPipe } from '@/filters';

export const CurrencyDirective = Vue => Vue.directive('currency', {
	bind (el, binding, vnode) {
		const places = binding.value;
		if (!places) {
			throw Error('Currency Places Can\'t Be Empty!');
		}
		const documentHandler = function (e) {
			if (e.target && e.target.value) {
				e.target.value = CurrencyPipe(e.target.value, places);
				el.dispatchEvent(new Event('input'));
			}
		};
		el.addEventListener('input', documentHandler);
	}
});
