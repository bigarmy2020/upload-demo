/**
 * 验证是否为身份证号
 * @param idCard
 * @returns {boolean}
 */
export const isCarId = (idCard) => {
	let reg, S, Y, M, JYM;
	const idCardList = idCard.split('');
	const len = idCard.length;
	let result = false;
	if (len === 15) {
		if ((parseInt(idCard.substr(6, 2), 10) + 1900) % 4 === 0 || ((parseInt(idCard.substr(6, 2), 10) + 1900) % 100 === 0 && (parseInt(idCard.substr(6, 2), 10) + 1900) % 4 === 0)) {
			reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; // 测试出生日期的合法性
		} else {
			reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; // 测试出生日期的合法性
		}
		result = !!reg.test(idCard);
	} else if (len === 18) {
		if (parseInt(idCard.substr(6, 4), 10) % 4 === 0 || (parseInt(idCard.substr(6, 4), 10) % 100 === 0 && parseInt(idCard.substr(6, 4), 10) % 4 === 0)) {
			reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的 合法性正则表达式
		} else {
			reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日 期的合法性正则表达式
		}
		// 测试出生日期的合法性
		if (reg.test(idCard)) {
			// 计算校验位
			S = (parseInt(idCardList[0], 10) + parseInt(idCardList[10], 10)) * 7 +
				(parseInt(idCardList[1], 10) + parseInt(idCardList[11], 10)) * 9 +
				(parseInt(idCardList[2], 10) + parseInt(idCardList[12], 10)) * 10 +
				(parseInt(idCardList[3], 10) + parseInt(idCardList[13], 10)) * 5 +
				(parseInt(idCardList[4], 10) + parseInt(idCardList[14], 10)) * 8 +
				(parseInt(idCardList[5], 10) + parseInt(idCardList[15], 10)) * 4 +
				(parseInt(idCardList[6], 10) + parseInt(idCardList[16], 10)) * 2 +
				parseInt(idCardList[7], 10) +
				parseInt(idCardList[8], 10) * 6 +
				parseInt(idCardList[9], 10) * 3;
			Y = S % 11;
			JYM = '10X98765432';
			M = JYM.substr(Y, 1); // 判断校验位
			// 检测ID的校验位
			result = M === idCardList[17].toUpperCase();
		} else {
			result = false;
		}
	} else {
		result = false;
	}
	return result;
};
