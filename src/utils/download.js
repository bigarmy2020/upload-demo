import { isBase64, browserIsIe } from '@/utils';

export const Download = {
	/**
	 * 下载文件
	 * @param {String} content   文件数据 blob or base64
	 * @param {String} fileName  文件名
	 * @param {String} type      文件类型 类型为null时，表示自动识别文件类型
	 */
	async downloadFile (content, fileName, type) {
		let dataUrl = '';
		if (/^https?/.test(content)) { // 远程图片地址
			dataUrl = await Download.imgUrlToBase64(content, type);
		} else {
			if (isBase64(content)) { // base64链接
				dataUrl = String(content);
			} else {
				// Blob转化为链接
				let blobData = null;
				if (type) {
					blobData = new Blob([content], { type: type || 'application/json;charset=utf-8' });
				} else {
					blobData = new Blob([content]);
				}
				dataUrl = window.URL.createObjectURL(blobData);
			}
		}

		if (browserIsIe()) { // 是IE浏览器
			// 判断是否是base64
			if (isBase64(dataUrl) && window.navigator && window.navigator.msSaveOrOpenBlob) { // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片/文件
				const bStr = atob(dataUrl.split(',')[1]);
				let n = bStr.length;
				const u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bStr.charCodeAt(n);
				}
				const blob = new Blob([u8arr]);
				window.navigator.msSaveOrOpenBlob(blob, fileName);
			} else {
				// 调用创建iframe的函数
				Download.createIframe(dataUrl);
			}
		} else {
			// 这里就按照chrome等新版浏览器来处理,支持download,添加属性.
			const aDom = document.createElement('a');
			aDom.setAttribute('href', dataUrl);
			aDom.setAttribute('download', fileName);
			aDom.setAttribute('display', 'none');
			document.body.appendChild(aDom);
			aDom.click();
			window.URL.revokeObjectURL(dataUrl);
		}
	},

	/**
	 * 将远程图片转化成base64
	 * @param {String} url 远程图片地址
	 * @param {String} outputFormat    输出格式,默认: image/png
	 */
	imgUrlToBase64 (url, outputFormat) {
		// url = url.replace(/https:\/\/demo\.oss-cn-beijing\.aliyuncs\.com/, '/download/test');
		return new Promise((resolve, reject) => {
			let canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = () => {
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.drawImage(img, 0, 0);
				const dataURL = canvas.toDataURL(outputFormat || 'image/png');
				canvas = null;
				resolve(String(dataURL));
			};
			img.onerror = e => reject(e);
			img.src = url;
		});
	},

	/**
	 * 下载图片/文件的函数
	 */
	openDownload () {
		// iframe的src属性不为空,调用execCommand(),保存图片/文件
		const iframeEle = window.document.body.querySelector('#iframeEle');
		if (iframeEle.getAttribute('src') !== 'about:blank') {
			window.frames['iframeEle'].document.execCommand('SaveAs'); // 浏览器是不允许JS跨域操作。在两个页面中加上 document.domain="xxx.com"; 把它指向同一域，就可以操作了。
		}
	},

	/**
	 * 创建iframe并赋值的函数,传入参数为图片/文件的src属性值
	 * @param {String} url
	 */
	createIframe (url) {
		// 如果隐藏的iframe不存在则创建
		let iframeEle = window.document.body.querySelector('#iframeEle');
		if (!iframeEle) {
			iframeEle = window.document.createElement('iframe');
			iframeEle.setAttribute('id', 'iframeEle');
			iframeEle.setAttribute('name', 'iframeEle');
			iframeEle.setAttribute('width', '0');
			iframeEle.setAttribute('height', '0');
			iframeEle.setAttribute('src', 'about:blank');
			iframeEle.addEventListener('load', () => Download.openDownload(), false);
			window.document.body.appendChild(iframeEle);
		}
		// iframe的src属性如不指向图片/文件地址,则手动修改,加载图片/文件
		if (iframeEle.getAttribute('src') !== url) {
			iframeEle.setAttribute('src', url);
		} else {
			// 如指向图片/文件地址,直接调用下载方法
			Download.openDownload();
		}
	}
};
