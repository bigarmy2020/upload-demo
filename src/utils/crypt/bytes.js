/* ===================================
 * url参数加解密工具类
 *  BytesCrypt.stringToBytes(message);
 *  BytesCrypt.bytesToString(message);
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */

// private property
const highSurrogateMin = 0xd800;
const highSurrogateMax = 0xdbff;
const lowSurrogateMin = 0xdc00;
const lowSurrogateMax = 0xdfff;
const surrogateBase = 0x10000;

const isHighSurrogate = (charCode) => highSurrogateMin <= charCode && charCode <= highSurrogateMax;
const isLowSurrogate = (charCode) => lowSurrogateMin <= charCode && charCode <= lowSurrogateMax;
const combineSurrogate = (high, low) => ((high - highSurrogateMin) << 10) + (low - lowSurrogateMin) + surrogateBase;
const chr = (charCode) => {
	let high, low;
	if (charCode < surrogateBase) {
		return String.fromCharCode(charCode);
	}
	// convert to UTF16 surrogate pair
	high = ((charCode - surrogateBase) >> 10) + highSurrogateMin;
	low = (charCode & 0x3ff) + lowSurrogateMin;
	return String.fromCharCode(high, low);
};

export const BytesCrypt = {

	/**
	 * 将字符串转换为一个UTF8 bytes数组
	 * @param {String} str
	 * @return {Array<Number>}
	 */
	stringToBytes (str) {
		const bytes = [],
			strLength = str.length;
		let strIndex = 0,
			charCode, charCode2;

		while (strIndex < strLength) {
			charCode = str.charCodeAt(strIndex++);

			// handle surrogate pair
			if (isHighSurrogate(charCode)) {
				if (strIndex === strLength) {
					throw new Error('Invalid format');
				}
				charCode2 = str.charCodeAt(strIndex++);
				if (!isLowSurrogate(charCode2)) {
					throw new Error('Invalid format');
				}
				charCode = combineSurrogate(charCode, charCode2);
			}

			// convert charCode to UTF8 bytes
			if (charCode < 0x80) {
				// one byte
				bytes.push(charCode);
			} else if (charCode < 0x800) {
				// two bytes
				bytes.push(0xc0 | (charCode >> 6));
				bytes.push(0x80 | (charCode & 0x3f));
			} else if (charCode < 0x10000) {
				// three bytes
				bytes.push(0xe0 | (charCode >> 12));
				bytes.push(0x80 | ((charCode >> 6) & 0x3f));
				bytes.push(0x80 | (charCode & 0x3f));
			} else {
				// four bytes
				bytes.push(0xf0 | (charCode >> 18));
				bytes.push(0x80 | ((charCode >> 12) & 0x3f));
				bytes.push(0x80 | ((charCode >> 6) & 0x3f));
				bytes.push(0x80 | (charCode & 0x3f));
			}
		}
		return bytes;
	},

	/**
	 * 将数组转换为字符串
	 * @param {Array<Number>} bytes
	 * @return {String}
	 */
	bytesToString (bytes) {
		let str = '',
			index = 0,
			byte,
			charCode;
		const length = bytes.length;

		while (index < length) {
			// first byte
			byte = bytes[index++];
			if (byte < 0x80) {
				// one byte
				charCode = byte;
			} else if ((byte >> 5) === 0x06) {
				// two bytes
				charCode = ((byte & 0x1f) << 6) | (bytes[index++] & 0x3f);
			} else if ((byte >> 4) === 0x0e) {
				// three bytes
				charCode = ((byte & 0x0f) << 12) | ((bytes[index++] & 0x3f) << 6) | (bytes[index++] & 0x3f);
			} else {
				// four bytes
				charCode = ((byte & 0x07) << 18) | ((bytes[index++] & 0x3f) << 12) | ((bytes[index++] & 0x3f) << 6) | (bytes[index++] & 0x3f);
			}
			str += chr(charCode);
		}
		return str;
	},

	/**
	 * 将字符串转换成二进制字符串，中间用逗号隔开
	 * @param {String} str
	 * @return {String}
	 */
	strToBinary (str) {
		const result = [];
		const list = str.split('');
		for (const item of list) {
			const binaryStr = item.charCodeAt(0).toString(2);
			result.push(binaryStr);
		}
		return result.join(',');
	},

	/**
	 * 将二进制字符串转换成Unicode字符串
	 * @param {String} binary
	 * @return {String}
	 */
	binaryToStr (binary) {
		const result = [];
		const list = binary.split(',');
		for (const item of list) {
			const asciiCode = parseInt(item, 2);
			const charValue = String.fromCharCode(asciiCode);
			result.push(charValue);
		}
		return result.join('');
	}
};
