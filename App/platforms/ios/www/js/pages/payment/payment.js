define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查询党费缴纳情况
	var loadPaymentStatusPath = app.basePath + 'payment/loadPaymentStatus';
	//本月缴费状态
	var payInThisMonth = -1;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('payment/payment', [
//			'payment/payOrder',
//			'payment/payDetail'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
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
		payInThisMonth = -1;
		loadPaymentStatus();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handlePaymentStatus(pageDataStorage['paymentStatus']);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//缴费明细
		$$('.payDetail').on('click', payDetail);
		//代缴补缴
		$$('.payOther').on('click', function() {
			payOther(0);
		});
	}

	/**
	 * 查询党费缴纳情况
	 */
	function loadPaymentStatus() {
		app.ajaxLoadPageContent(loadPaymentStatusPath, {
			userId: app.userId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			pageDataStorage['paymentStatus'] = data;
			handlePaymentStatus(data);
		});
	}

	/**
	 * 加载党费缴纳情况
	 * @param {Object} data
	 */
	function handlePaymentStatus(data) {
		if(data) {
			$$('.payDate').html(data.payDate);
			$$('.payTime').html(data.payTime);
			$$('.payMoney').html(data.payMoney);
			payInThisMonth = data.payStatus;
			if(data.payStatus == true) {
				$$('.statusBadTitle').css('display', 'none');
				$$('.statusGoodTitle').css('display', 'block');
				$$('.statusClick').css('display', 'none');
			} else {
				$$('.statusBadTitle').css('display', 'block');
				$$('.statusGoodTitle').css('display', 'none');
				$$('.statusClick').css('display', 'block');
				$$('.statusClick').on('click', payPage);
				$$('.statusBadTitle').on('click', payPage);
			}
		} else {
			app.myApp.alert('暂无缴费记录');
		}
	}

	/**
	 * 代缴补缴 
	 */
	function payOther(isOwn) {
		app.myApp.getCurrentView().loadPage('payOrder.html?payOwn=' + isOwn);
	}

	/**
	 * 点击圆形按钮
	 * @param {Object} e 点击对应的标签
	 */
	function payPage(e) {
		//先检测是否点击在圆内
		var circle = $$($$(this).parents());
		var width = circle.width();
		var harf = width / 2;

		// 算点击位置到圆心的距离
		var distance = Math.sqrt(
			Math.pow(e.offsetX - harf, 2) +
			Math.pow(e.offsetY - harf, 2));

		//如果距离大于半径，则返回
		if(distance > harf) {
			return;
		}
		//若本月已交款，则返回
		if(payInThisMonth == true) {
			return;
		}
		//调用事件
		payOther(1);
	}

	/**
	 * 缴费明细
	 */
	function payDetail() {
		app.myApp.getCurrentView().loadPage('payDetail.html');
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