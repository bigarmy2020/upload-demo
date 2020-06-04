/**
 * 预览大图
 * @param {String} imgUrl 图片地址
 */
export const previewLargerImg = (imgUrl) => {
	const outer = document.createElement('div');
	const outerStyle = outer.style;
	outer.className = 'viewImagesClass';
	outerStyle.position = 'fixed';
	outerStyle.top = '0px';
	outerStyle.left = '0px';
	outerStyle.zIndex = '999';
	outerStyle.width = '100%';
	outerStyle.cursor = 'pointer';
	outerStyle.height = '100%';
	outerStyle.backgroundColor = 'rgba(0, 0, 0, .6)';
	outerStyle.animation = 'bgMove .6s ease';

	const inner = document.createElement('img');
	const innerStyle = inner.style;
	innerStyle.maxWidth = '90%';
	innerStyle.maxHeight = '90%';
	innerStyle.position = 'absolute';
	innerStyle.zIndex = '998';
	innerStyle.transform = 'translate(-50%, -50%)';
	innerStyle.top = '50%';
	innerStyle.left = '50%';
	innerStyle.border = '8px solid #fff';
	innerStyle.borderRadius = '6px';
	innerStyle.animation = 'myMove .6s ease';
	inner.src = imgUrl;
	outer.appendChild(inner);
	document.body.appendChild(outer);
};
