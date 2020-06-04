/* ===================================
 * 指令：代码高亮
 * Created by cjking on 2020/05/24.
 * Copyright 2020, Inc.
 * =================================== */
import hlJs from 'highlight.js';

export const HighlightDirective = Vue => Vue.directive('highlightJs', {
	deep: true,
	bind: (el, binding) => {
		const targets = el.querySelectorAll('code');
		targets.forEach((target) => {
			if (binding.value) {
				target.textContent = binding.value;
			}
			hlJs.highlightBlock(target);
		});
	},
	componentUpdated: (el, binding) => {
		const targets = el.querySelectorAll('code');
		targets.forEach((target) => {
			if (binding.value) {
				target.textContent = binding.value;
				hlJs.highlightBlock(target);
			}
		});
	}
});
