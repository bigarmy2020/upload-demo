/* ===================================
 * base64加解密工具类
 *  Base64Crypt.encrypt(message);
 *  Base64Crypt.decrypt(message);
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */

// private property
const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; // 默认加密key

/**
 * private method for UTF-8 encoding
 * @param {String} str
 * @returns {string} str
 * @private
 */
const utf8Encode = (str) => {
	str = str.replace(/\r\n/g, '\n');
	let utfText = '';
	for (let n = 0; n < str.length; n++) {
		const c = str.charCodeAt(n);
		if (c < 128) {
			utfText += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utfText += String.fromCharCode((c >> 6) | 192);
			utfText += String.fromCharCode((c & 63) | 128);
		} else {
			utfText += String.fromCharCode((c >> 12) | 224);
			utfText += String.fromCharCode(((c >> 6) & 63) | 128);
			utfText += String.fromCharCode((c & 63) | 128);
		}
	}
	return utfText;
};

/**
 * private method for UTF-8 decoding
 * @param { String } utfText
 * @returns {string} str
 * @private
 */
const utf8Decode = (utfText) => {
	let str = '';
	let i = 0;
	let c = 0, c2 = 0, c3 = 0;
	while (i < utfText.length) {
		c = utfText.charCodeAt(i);
		if (c < 128) {
			str += String.fromCharCode(c);
			i++;
		} else if ((c > 191) && (c < 224)) {
			c2 = utfText.charCodeAt(i + 1);
			str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utfText.charCodeAt(i + 1);
			c3 = utfText.charCodeAt(i + 2);
			str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return str;
};

export const Base64Crypt = {

	/**
	 * 对字符串进行base64加密
	 * @param {String | Number} input 要转码的字符串
	 * @return String
	 */
	encrypt (input) {
		// public method for encoding
		let output = '';
		let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		let i = 0;
		input = utf8Encode(String(input));
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
		}
		return output;
	},

	/**
	 * 对base64字符串进行解密
	 * @param {String} input base64字符串
	 * @return String
	 */
	decrypt (input) {
		// public method for decoding
		let output = '';
		let chr1, chr2, chr3;
		let enc1, enc2, enc3, enc4;
		let i = 0;
		if (!input) input = '';
		input = input.replace(/[^A-Za-z0-9+/=]/g, '');
		while (i < input.length) {
			enc1 = key.indexOf(input.charAt(i++));
			enc2 = key.indexOf(input.charAt(i++));
			enc3 = key.indexOf(input.charAt(i++));
			enc4 = key.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 !== 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 !== 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = utf8Decode(output);
		return output;
	}
};
