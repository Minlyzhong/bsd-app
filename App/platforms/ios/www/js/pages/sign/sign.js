define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//校验打卡状态
	var checkSignPath = app.basePath + 'extApplicationPage/checkSignStatus';
	//保存打卡信息
	var saveSignInfoPath = app.basePath + 'extApplicationPage/signToWork';
	var type = -1;
	var lat = 0.0;
	var lng = 0.0;
	var userPosition = '';
	var signType = '';
	var signStatus = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('sign/sign', [
//			'sign/signPersonReport',
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
		type = -1;
		lat = 0.0;
		lng = 0.0;
		userPosition = '';
		signType = '';
		checkSign();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.ownReport').on('click', function() {
			app.myApp.getCurrentView().loadPage('signPersonReport.html?userId=0');
		});

		$$('.searchBtn').on('click', function() {
			saveSignInfo();
		});

		$$('.cancelBtn').on('click', function() {
			$$('.signView').hide();
			$$('.signCover').hide();
		});

		$$('#cardUp').on('click', function() {
			signType = '上午上班';
			type = 0;
			getPosition();
		});

		$$('#cardDown').on('click', function() {
			signType = '下午上班';
			type = 1;
			getPosition();
		});
	}

	//校验打卡状态
	function checkSign() {
		app.ajaxLoadPageContent(checkSignPath, {
			reportTime: app.utils.getCurTime().split(" ")[0],
			userId: app.userId
		}, function(data) {
			console.log(data);
			if(data.up == 0) {
				$$('#cardUp').removeAttr('disabled');
			}
			if(data.down == 0) {
				$$('#cardDown').removeAttr('disabled');
			}
		});
	}

	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true
				//timeout: 2000,
			});
		}
	}

	function onSuccessPosition(position) {
		app.myApp.hidePreloader();
		if(signStatus == 1){
			var _lng = position.coords.longitude;
			var _lat = position.coords.latitude;
		}else if(signStatus == 2){
			var _lng = position.point.lng;
			var _lat = position.point.lat ;
		}
		//拿到GPS坐标转换成百度坐标
		app.ajaxLoadPageContent('https://api.map.baidu.com/ag/coord/convert', {
			from: 0,
			to: 4,
			x: _lng,
			y: _lat
		}, function(data) {
			lng = app.utils.base64decode(data.x);
			lat = app.utils.base64decode(data.y);
			GetAddress();
		}, {
			type: 'GET',
		});
	}

	/*
	 * 根据坐标获取中心点地址
	 */
	function GetAddress() {
		var _SAMPLE_ADDRESS_POST = app.utils.getAddressPost();
		_SAMPLE_ADDRESS_POST += "&location=" + lat + "," + lng;
		app.ajaxLoadPageContent(_SAMPLE_ADDRESS_POST, {
			
		}, function(data) {
			app.myApp.hidePreloader();
			renderReverse(data);
		}, {
			type: 'GET',
		});
//		app.myApp.hidePreloader();
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			showInfo();
		}
	}

	//信息查看和上传
	function showInfo() {
		$$('.signView').show();
		$$('.signCover').show();
		$$('#signType').val(signType);
		$$('#name').val(app.user.userName);
		//$$('#position').val(userPosition);
		$$('#time').val(app.utils.getCurTime());
	}

	//上传记录
	function saveSignInfo() {
		app.ajaxLoadPageContent(saveSignInfoPath, {
			userId: app.userId,
			lng: lng,
			lat: lat,
			address: userPosition,
			types: type,
			reportTime: app.utils.getCurTime(),
			memo: ""
		}, function(data) {
			if(data.data.success == true) {
				$$('.signView').hide();
				$$('.signCover').hide();
				app.myApp.toast('打卡成功！', 'success').show(true);
//				app.myApp.alert('打卡成功', function() {
//					app.myApp.getCurrentView().back();
//				});
				app.myApp.getCurrentView().back();
			}
		});
	}
	function onErrorPosition(e) {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			app.myApp.showPreloader('定位中...');
			if(e.code == '3'){
				signStatus = 2;
				var map = new BMap.Map();
				var point = new BMap.Point(116.331398,39.897445);
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
						onSuccessPosition(r);
					}
					else {
						app.myApp.alert('failed'+this.getStatus());
					}        
			    },{enableHighAccuracy: true})
			}else{
				app.myApp.alert('请打开GPS定位');
			}
		}
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