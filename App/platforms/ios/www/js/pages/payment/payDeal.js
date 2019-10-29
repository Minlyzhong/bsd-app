define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//支付宝支付
	var alipayPath = app.basePath + 'alipayClient/userPayment';
	//微信支付
	var wechatPayPath = app.basePath + '';
	var paySum = 0;
	var payPeopleList = '';
	var beginDate = '';
	var endDate = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		paySum = pageData.paySum;
		payPeopleList = pageData.payPeopleList;
		beginDate = pageData.beginDate;
		endDate = pageData.endDate;
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.paySum').html(paySum);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.payCheck').on('click', payMoney);
	}

	/**
	 * 确认支付 
	 */
	function payMoney() {
		var search = $$('.payTypeList').find('input[name="payBox"]:checked');
		var payType = $$(search[0]).val();
		if(payType == 1) {
			alipay();
		} else if(payType == 2) {
			wechatPay();
		}
	}

	/**
	 * 支付宝支付 
	 */
	function alipay() {
		var payInfo = {
			totalAmount: paySum,
			payer: app.userId,
			userId: payPeopleList,
			beginDate: beginDate,
			endDate: endDate,
		};
		var encryptString = app.utils.encodebase64(window.encodeURI(JSON.stringify(payInfo)));
		app.ajaxLoadPageContent(alipayPath, {
			payInfo: encryptString,
		}, function(data) {
			var resultDic = {
				9000: '订单支付成功',
				8000: '正在处理中',
				6002: '网络连接出错',
				6001: '用户中途取消',
				4000: '订单支付失败',
			};
			if(data.data) {
				console.log(data.data);
				cordova.plugins.AliPay.pay(data.data.key, function success(e) {
					//							var status = parseInt(e.resultStatus);
					//							var result = resultDic[status] == undefined ? '支付成功' : resultDic[status];
					//							app.myApp.alert('返回码: ' + status + '<br />' + result);
					var payOrderPage = require('js/pages/payment/payOrder');
					payOrderPage.payCallback('支付成功', true);
					app.myApp.getCurrentView().back();
				}, function error(e) {
					var status = parseInt(e.resultStatus);
					//							var result = resultDic[status] == undefined ? '支付失败' : resultDic[status];
					//							app.myApp.alert('返回码: ' + status + '<br />' + result);
					var result = '支付失败';
					if(status == 6001) {
						result = '取消支付';
					}
					var payOrderPage = require('js/pages/payment/payOrder');
					payOrderPage.payCallback(result, false);
					app.myApp.getCurrentView().back();
				});
			}
		});
	}

	/**
	 * 微信支付 
	 */
	function wechatPay() {

	}

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
	}
});