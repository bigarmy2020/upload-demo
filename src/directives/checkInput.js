/* ===================================
 * 指令：验证输入是否纯数字、是否含有中文、是否身份证号码
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
export const CheckInputDirective = Vue => Vue.directive('checkInput', {
	bind (el, binding, vnode) {
		const type = binding.value;
		if (!type) {
			throw Error('CheckInput type Can\'t be empty!');
		}
		const documentHandler = (e) => {
			if (e.target && e.target.value) {
				if (type === 'number') {
					e.target.value = e.target.value.replace(/[^\d]/g, '');
				} else if (type === 'zh_cn') {
					e.target.value = e.target.value.replace(/[^(a-zA-Z\u4e00-\u9fa5)]/g, '');
				} else if (type === 'idCard') {
					e.target.value = e.target.value.replace(/[^(0-9Xx)]/g, '');
				}
				el.dispatchEvent(new Event('input'));
			}
		};
		el.addEventListener('input', documentHandler);
	}
});
