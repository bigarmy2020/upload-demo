import { pcaa } from 'area-data';

/**
 * 省市区3级联动数据处理
 */
export const AreaTool = {

	/**
	 * 获取省份列表
	 */
	getProvinceList (hasChildren) {
		const provinceList = [];
		const province = pcaa['86'];
		Object.keys(province).map(provinceCode => {
			provinceList.push({ id: provinceCode, text: province[provinceCode], children: hasChildren ? this.getCityList(provinceCode, hasChildren) : null });
		});
		return provinceList;
	},

	/**
	 * 获取城市列表
	 * @param provinceCode
	 * @param hasChildren
	 */
	getCityList (provinceCode, hasChildren) {
		const cityList = [];
		const city = pcaa[provinceCode] || [];
		Object.keys(city).map(cityCode => {
			cityList.push({ id: cityCode, text: city[cityCode], children: hasChildren ? this.getCountryList(cityCode) : null });
		});
		return cityList;
	},

	/**
	 * 获取市区列表
	 * @param cityCode
	 */
	getCountryList (cityCode) {
		const countyList = [];
		const county = pcaa[cityCode] || [];
		Object.keys(county).map(countyCode => {
			countyList.push({ id: countyCode, text: county[countyCode] });
		});
		return countyList;
	},

	/**
	 * 通过文本获取城市code
	 */
	getRealCodeByText (textList) {
		const codeList = [];
		textList.forEach(text => {
			const code = AreaTool.findItemCode(text);
			codeList.push(code);
		});
		return codeList;
	},

	findItemCode (text) {
		if (!text || !text.length) {
			return '';
		}
		const dataList = AreaTool.getAllData();
		for (let data of dataList) {
			if (data.text === text) {
				return data.id;
			}
		}
	},

	/**
	 * 通过城市code获取文本
	 */
	getTextByRealCode (codeList) {
		const textList = [];
		codeList.forEach(code => {
			const text = AreaTool.findItemText(code);
			textList.push(text);
		});
		return textList;
	},

	findItemText (code) {
		if (!code || !code.length) {
			return '';
		}
		const dataList = AreaTool.getAllData();
		for (let data of dataList) {
			if (data.id === code) {
				return data.text;
			}
		}
	},

	getAllData () {
		const areaAllData = [];
		const province = pcaa['86'];
		Object.keys(province).map(provinceCode => {
			const city = pcaa[provinceCode];
			areaAllData.push({ id: provinceCode, text: province[provinceCode] });
			Object.keys(city).map(cityCode => {
				const country = pcaa[cityCode];
				areaAllData.push({ id: cityCode, text: city[cityCode] });
				Object.keys(country).map(countryCode => {
					areaAllData.push({ id: countryCode, text: country[countryCode] });
				});
			});
		});
		return areaAllData;
	}
};
