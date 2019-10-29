define(['app',
	'hbs!js/hbs/payDetail'
], function(app, payDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查询党费缴纳记录
	var findPaymentDetailPath = app.basePath + 'payment/findPaymentDetail';

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
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		loadPayDetail();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 读取支付详情 
	 */
	function loadPayDetail() {
		app.ajaxLoadPageContent(findPaymentDetailPath, {
			userId: app.userId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			//需要字段：payDetailMoney 支付额 payDetailDate 支付时间 时分秒
			$$('.payDetailList ul').html(payDetailTemplate(data));
		});
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