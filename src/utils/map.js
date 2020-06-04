/**
 * 初始化定位服务
 * 高德地图的geolocation定位方式说明中提及了整合了浏览器定位、精确IP定位、sdk辅助定位多种手段
 * @param callback
 * @param errorCallback
 */
import { logger } from '@/utils/logger';

export function initPositionService(callback, errorCallback) {
	let geolocation;
	// 加载地图，调用浏览器定位服务
	const mapObj = new window.AMap.Map('container', {
		resizeEnable: true
	});
	mapObj.plugin('AMap.Geolocation', function () {
		geolocation = new window.AMap.Geolocation({
			enableHighAccuracy: true,   // 是否使用高精度定位，默认:true
			timeout: 10000,             // 超过10秒后停止定位，默认：无穷大
			maximumAge: 0,              // 定位结果缓存0毫秒，默认：0
			convert: true,              // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			showButton: true,           // 显示定位按钮，默认：true
			buttonPosition: 'LB',       // 定位按钮停靠位置，默认：'LB'，左下角
			buttonOffset: new window.AMap.Pixel(10, 20),   // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			showMarker: true,           // 定位成功后在定位到的位置显示点标记，默认：true
			showCircle: true,           // 定位成功后用圆圈表示定位精度范围，默认：true
			panToLocation: true,        // 定位成功后将定位到的位置作为地图中心点，默认：true
			zoomToAccuracy: true        // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		});
		mapObj.addControl(geolocation);
		geolocation.getCurrentPosition();
		window.AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		window.AMap.event.addListener(geolocation, 'error', onError);       //返回定位出错信息
	});

	// 解析定位结果
	function onComplete(data) {
		logger.log('解析定位结果 data: ', data);
		callback && callback(data);
	}

	// 解析定位错误信息
	function onError(data) {
		errorCallback && errorCallback(data);
	}
}

// 根据地址获取经纬度
export function getLOngLAtByAddress(address, callback, errorCallback) {
	const geocoder = new window.AMap.Geocoder({
		// city: "010", //城市设为北京，默认：“全国”
	});
	geocoder.getLocation(address, function (status, result) {
		if (status === 'complete' && result.geocodes.length) {
			const lnglat = result.geocodes[0].location;
			callback && callback(lnglat);
		} else {
			errorCallback && errorCallback(result);
		}
	});
}

// 根据地址显示位置
export function markerPositionByLangLat(lng, lat) {
	const mapObj = new window.AMap.Map('container', {
		zoom: 16,
		center: [lng, lat]
	});
	// 创建一个 Icon
	let startIcon = new window.AMap.Icon({
		// 图标尺寸
		size: new window.AMap.Size(23, 23),
		// 图标的取图地址
		image: 'https://webapi.amap.com/theme/v1.3/markers/b/loc.png',
		// 图标所用图片大小
		imageSize: new window.AMap.Size(23, 23)
		// 图标取图偏移量
		// imageOffset: new window.AMap.Pixel(-9, -3)
	});
	let marker = new window.AMap.Marker({
		icon: startIcon
	});
	marker.setMap(mapObj);
}

/**
 * 根据经纬度获取地址
 * @param lnglatXY [x,y] 经纬度坐标
 * @param callback 成功回调
 * @param errorCallback 失败回调
 */
export function getAddressByLOngLAt(lnglatXY, callback, errorCallback) {
	let geocoder = new window.AMap.Geocoder({
		// city: "010", //城市设为北京，默认：“全国”
	});
	geocoder.getAddress(lnglatXY, function (status, result) {
		if (status === 'complete' && result.info === 'OK') {
			//获得了有效的地址
			let address = result.regeocode.formattedAddress;
			let location = {
				province: result.regeocode.addressComponent.province,
				city: result.regeocode.addressComponent.city,
				district: result.regeocode.addressComponent.district
			};
			callback && callback({ address, location });
		} else {
			errorCallback && errorCallback(result);
		}
	});
}

/**
 * 通过微信sdk获取定位
 * @param params
 * @param callback
 * @param errorCallback
 */
export function getWxLocation(params, callback, errorCallback) {
	const debug = process.env.VUE_APP_DEBUG === 'true'; // 是否开启debug
	wx.config({
		debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: params.appId, // 必填，公众号的唯一标识
		timestamp: params.timestamp, // 必填，生成签名的时间戳
		nonceStr: params.nonceStr, // 必填，生成签名的随机串
		signature: params.signature, // 必填，签名
		jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
	});
	wx.ready(function () {
		wx.getLocation({
			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			complete: function (res) {
				if (res.errMsg === 'getLocation:ok') {
					callback && callback(res);
				} else {
					errorCallback && errorCallback(res);
				}
			}
		});
	});
	wx.error(function (res) {
		errorCallback && errorCallback(res);
	});
}

export default {
	initPositionService,
	getLOngLAtByAddress,
	markerPositionByLangLat,
	getWxLocation,
	getAddressByLOngLAt
};
