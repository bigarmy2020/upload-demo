/* ===================================
 * 指令：文件下载
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import { Download } from '@/utils';

export const DownloadDirective = Vue => Vue.directive('download', {
	bind (el, binding, vnode) {
		const options = binding.value || {};
		if (options.url || !options.fileName) {
			throw Error('Url or FileName Can\'t Be Empty!');
		}
		const documentHandler = () => {
			Download.downloadFile(options.url, options.fileName, options.type);
		};
		el.addEventListener('click', documentHandler);
	}
});
