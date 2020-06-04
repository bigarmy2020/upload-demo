/* ===================================
 * CryptoJS加解密工具类
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import * as CryptoJS from 'crypto-js';

export const Crypt = {

	/**
	 * sha1加密
	 * @param {String} source   需要加密串
	 * @return {String} 返回加密后的字符串
	 */
	sha1 (source) {
		return CryptoJS.SHA1(source).toString();
	},

	/**
	 * sha256加密
	 * @param {String} source   需要加密串
	 * @return {String} 返回加密后的字符串
	 */
	sha256 (source) {
		return CryptoJS.SHA256(source).toString();
	},

	/**
	 * md5加密
	 * @param {String} source   需要加密串
	 * @return {String} 返回加密后的字符串
	 */
	md5 (source) {
		return CryptoJS.MD5(source).toString();
	},

	/**
	 * AES_ECB加密
	 * @param {Object | String} plaintText
	 * @param {String} key 加密key,长度必须16、32位!
	 * @returns {String}
	 */
	encrypt (plaintText, key) {
		if (typeof plaintText === 'object') {
			plaintText = JSON.stringify(plaintText);
		}
		const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintText), CryptoJS.enc.Utf8.parse(key), {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	},

	/**
	 * AES_ECB解密
	 * @param {String} decryptData
	 * @param {String} key 加密key,长度必须16、32位!
	 * @returns {String}
	 */
	decrypt (decryptData, key) {
		const encrypted = CryptoJS.AES.decrypt(decryptData, CryptoJS.enc.Utf8.parse(key), {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString(CryptoJS.enc.Utf8);
	},

	/**
	 * 获取加密key (WordArray对象)
	 */
	getCryptKey () {
		const str = 'zxcvbnmlkjhgfdsaqwertyuiopQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
		let randomStr = '';
		for (let i = 0; i < 32; i++) {
			const randomIdx = Math.floor(Math.random() * str.length);
			randomStr += str.charAt(randomIdx);
		}
		return CryptoJS.enc.Hex.parse(randomStr); // 将长度为32的字符串转换为WordArray对象
	},

	/**
	 * 获取初始向量
	 */
	getIV () {
		return CryptoJS.lib.WordArray.random(128 / 8).toString(); // 随机生成长度为32的16进制字符串。IV称为初始向量，不同的IV加密后的字符串是不同的，加密和解密需要相同的IV。
	},

	/**
	 * AES_CBC加密
	 * @param {String|Object} message 加密串
	 * @param {String | *} cryptKey 加密key WordArray对象
	 * @param {String} iv 初始向量
	 * @return {String} Base64字符串
	 */
	aesCBCEncrypt (message, cryptKey, iv) {
		const source = typeof message === 'object' ? JSON.stringify(message) : message;
		const cipherText = CryptoJS.AES.encrypt(source, cryptKey, {
			iv: CryptoJS.enc.Hex.parse(iv),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return cipherText.toString(); // Base64字符串
	},

	/**
	 * AES_CBC解密
	 * @param {String} cipherText 必须为Base64编码的字符串
	 * @param {String|*} cryptKey 加密key WordArray对象
	 * @param {String} iv 初始向量
	 * @return {String} WordArray对象转utf8字符串
	 */
	aesCBCDecrypt (cipherText, cryptKey, iv) {
		const decrypted = CryptoJS.AES.decrypt(cipherText, cryptKey, {
			iv: CryptoJS.enc.Hex.parse(iv),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8); // WordArray对象转utf8字符串
	},

	/**
	 * AES_CBC加密(ZeroPadding)
	 * @param {String|Object} word 加密串
	 * @param {String} cryptKey 加密key
	 * @param {String} iv 初始向量
	 * @return {String} Base64字符串
	 */
	aesCBZeroPaddingCEncrypt (word, cryptKey, iv) {
		const plaintText = typeof word === 'object' ? JSON.stringify(word) : word;
		const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintText), CryptoJS.enc.Utf8.parse(cryptKey), {
			iv: CryptoJS.enc.Utf8.parse(iv),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.ZeroPadding
		});
		return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	}
};
