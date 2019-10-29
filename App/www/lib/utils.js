define(function() {
	var $$ = Dom7;
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	/**
	 * base64编码
	 * @param {Object} str
	 */
	function base64encode(str) {
		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}
	/**
	 * base64解码
	 * @param {Object} str
	 */
	function base64decode(str) {
		var c1, c2, c3, c4;
		var i, len, out;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c1 == -1);
			if(c1 == -1)
				break;
			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c2 == -1);
			if(c2 == -1)
				break;
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			}
			while (i < len && c3 == -1);
			if(c3 == -1)
				break;
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			}
			while (i < len && c4 == -1);
			if(c4 == -1)
				break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}
	/**
	 * utf16转utf8
	 * @param {Object} str
	 */
	function utf16to8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else
			if(c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	}
	/**
	 * utf8转utf16
	 * @param {Object} str
	 */
	function utf8to16(str) {
		var out, i, len, c;
		var char2, char3;
		out = "";
		len = str.length;
		i = 0;
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12:
				case 13:
					// 110x xxxx 10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx10xx xxxx10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}
	//demo
	//function doit(){
	//    var f = document.f;
	//    f.output.value = base64encode(utf16to8(f.source.value));
	//    f.decode.value = utf8to16(base64decode(f.output.value));
	//}

	//	Array.prototype.remove = function(dx) {
	//		if(isNaN(dx) || dx > this.length) {
	//			return false;
	//		}
	//		for(var i = 0, n = 0; i < this.length; i++) {
	//			if(this[i] != this[dx]) {
	//				this[n++] = this[i]
	//			}
	//		}
	//		this.length -= 1
	//	}

	// 

	/**
	 *  base64加密
	 * @param {Object} input 需要加密的字符串
	 */
	function encodebase64(input) {
		var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" +
			"wxyz0123456789+/" + "=";
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
				keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);

		return output;
	}

	/**
	 *  获取随机GUID
	 */
	function generateGUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return(c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function callbackAjaxError() {
		return '网络异常！';
	}

	/**
	 * 获取当前时间 2016-10-10 10:10:10
	 */
	function getCurTime() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}

		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(hour >= 0 && hour <= 9) {
			hour = "0" + hour;
		}
		if(min >= 0 && min <= 9) {
			min = "0" + min;
		}
		if(sec >= 0 && sec <= 9) {
			sec = "0" + sec;
		}

		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min + seperator2 + sec;
		return currentdate;
	}

	/**
	 * 日期加减天数
	 * @param {Object} dd 日期字符串
	 * @param {Object} dadd 加减天数
	 */
	function getSpecialDate(dd, dadd) {
		var date = new Date(dd)
		date = date.valueOf()
		date = date + dadd * 24 * 60 * 60 * 1000
		date = new Date(date)
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}

		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(hour >= 0 && hour <= 9) {
			hour = "0" + hour;
		}
		if(min >= 0 && min <= 9) {
			min = "0" + min;
		}
		if(sec >= 0 && sec <= 9) {
			sec = "0" + sec;
		}

		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min + seperator2 + sec;
		return currentdate;
	}

	/**
	 *  获取当前时间   2016-10-10 星期日
	 */
	function getCurTimeWithDay() {
		var time = getCurTime().split(" ")[0];
		var today = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		return time + ' ' + today[new Date().getDay()];
	}

	/**
	 * 	强行获取两位数 （1 -> 01）
	 */
	function getTwoBitNumber(number) {
		return("0" + number).slice(-2);
	}

	/**
	 * 无敌骚对象数组排序 
	 * @param {Object} key 
	 * @param {Object} desc
	 */
	function keysrt(key, desc) {
		return function(a, b) {
			return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
		}
	}

	/**
	 *  保留小数，四舍五入
	 * @param {Object} decimal 小数
	 * @param {Object} num 保留几位小数
	 */
	function getDecimal(decimal, num) {
		if(isNaN(decimal)) {
			return 0;
		}
		var newDec = decimal.toFixed(num);
		return parseFloat(newDec);
	}

	/**
	 * 定位 转换 地址
	 */
	function getAddressPost() {
//		var baiduMapKey = ['UXTxGY2P3obB5GZ0IBEYBPui0NkUdG0o',
//			'4EbLDZEpOBz82NM3PiRMCe3po6KznDpa',
//			'WaxLw3GXkWYfxey3OXIlxM1i'
//		];
		// 创建一个0-3的随机数
//		var number = Math.floor(Math.random() * 3);
		var baiduMapKey = ['UXTxGY2P3obB5GZ0IBEYBPui0NkUdG0o'];
		
		return "http://api.map.baidu.com/geocoder/v2/?ak=" + baiduMapKey[0] + "&callback=renderReverse&output=json&pois=1";
	}

	/**
	 *  获取数组最大值
	 * @param {Object} arr 数组
	 */
	function getMaxInArr(arr) {
		var max = arr[0];
		for(var i = 1; i < arr.length; i++) {
			if(max < arr[i]) max = arr[i];
		}
		return max;
	}

	/**
	 *  Unicode编码
	 * @param {Object} str 传入的字符串
	 */
	function decToHex(str) {
		var res = [];
		for(var i = 0; i < str.length; i++)
			res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
		return "\\u" + res.join("\\u");
	}

	/**
	 * Unicode解码 
	 * @param {Object} str 传入的字符串
	 */
	function hexToDec(str) {
		str = str.replace(/\\/g, "%");
		return unescape(str);
	}

	/**
	 * jQuery->sort 对象数组降序比较器 
	 * @param {Object} property 需要排序的字段
	 */
	function compareDesc(property) {
		return function(a, b) {
			var value1 = a[property];
			var value2 = b[property];
			return value2 - value1;
		}
	}

	/**
	 * 把秒转化成 00：00：00这种格式的字符串 
	 * @param {Object} seconds 秒
	 */
	function formatTimeBySecond(seconds) {
		return [
				parseInt(seconds / 60 / 60),
				parseInt(seconds / 60 % 60),
				parseInt(seconds % 60)
			]
			.join(":")
			.replace(/\b(\d)\b/g, "0$1");
	}

	/**
	 * 把秒转化成 时分秒 这种格式的字符串 
	 * @param {Object} seconds 秒
	 */
	function formatTimeStrBySecond(seconds) {
		var hh = parseInt(seconds / 60 / 60);
		var mm = parseInt(seconds / 60 % 60);
		var ss = parseInt(seconds % 60);
		var timeStr = '';
		timeStr += hh == 0 ? '' : hh + '时';
		timeStr += mm == 0 ? '' : mm + '分';
		timeStr += ss == 0 ? '' : ss + '秒';
		return timeStr;
	}

	/**
	 * 对象深拷贝 
	 * @param {Object} p
	 * @param {Object} c
	 */
	function deepCopy(p, c) {　　　　
		var c = c || {};　　　　
		for(var i in p) {　　　　　　
			if(typeof p[i] === 'object') {　　　　　　　　
				c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
				deepCopy(p[i], c[i]);　　　　　　
			} else {　　　　　　　　　
				c[i] = p[i];　　　　　　
			}　　　　
		}　　　　
		return c;
	}

	return {
		base64encode: base64encode,
		base64decode: base64decode,
		utf8to16: utf8to16,
		utf16to8: utf16to8,
		generateGUID: generateGUID,
		getRandomInt: getRandomInt,
		getCurTime: getCurTime,
		getCurTimeWithDay: getCurTimeWithDay,
		getDecimal: getDecimal,
		getAddressPost: getAddressPost,
		getMaxInArr: getMaxInArr,
		getSpecialDate: getSpecialDate,
		getTwoBitNumber: getTwoBitNumber,
		callbackAjaxError: callbackAjaxError,
		keysrt: keysrt,
		encodebase64: encodebase64,
		decToHex: decToHex,
		hexToDec: hexToDec,
		compareDesc: compareDesc,
		formatTimeBySecond: formatTimeBySecond,
		formatTimeStrBySecond: formatTimeStrBySecond,
		deepCopy: deepCopy,
	};
});