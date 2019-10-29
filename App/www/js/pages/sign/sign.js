define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//校验打卡状态
	var checkSignPath = app.basePath + '/mobile/sign/register/check';
	//保存打卡信息
	var saveSignInfoPath = app.basePath + '/mobile/sign/register/save';
	var types = -1;
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
		
		//document.addEventListener("deviceready", onDeviceReady, false);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		types = -1;
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
			types = 1;
			getPosition();
		});

		$$('#cardDown').on('click', function() {
			signType = '下午上班';
			types = 4;
			// 暂时注释
			getPosition();

			
		});
	}

	//校验打卡状态
	function checkSign() {
		app.ajaxLoadPageContent(checkSignPath, {
			// reportTime: app.utils.getCurTime().split(" ")[0],
			// userId: app.userId
		}, function(data) {
			
			if(data.data.up == false) {

				$$('#cardUp').removeAttr('disabled');
			}
			if(data.data.down == false) {
				$$('#cardDown').removeAttr('disabled');
			}
		});
	}

	/**
	 * 定位 
	 */
	function getPosition() {	
		//开启定位服务
//		cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
//		    app.myApp.alert("GPS location is " + (enabled ? "enabled" : "disabled"));
//		}, function(error){
//		    app.myApp.alert("The following error occurred: "+error);
//		});
		
		if(navigator.geolocation) {
			app.myApp.showPreloader('定位中...');
			signStatus = 1;
			// 暂时注释
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true,
			});
		}
	}
	function onSuccessPosition(position) {
		console.log('onSuccessPosition')
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
		$$('#name').val(app.user.nickName);
		//$$('#position').val(userPosition);
		$$('#time').val(app.utils.getCurTime());
	}

	//上传记录 打卡类型:1上午上班;4下午上班
	function saveSignInfo() {
		var params = {
			userId: app.userId,
			deptId:app.user.deptId,
			deptName: app.userDetail.deptName,
			lng: lng,
			lat: lat,
			address: userPosition,
			types: types,
			// username: app.user.userName,
			// reportTime: app.utils.getCurTime(),
			memo: $$('#demo').val()
		}
		

	var formDatas= JSON.stringify(params);
	$$.ajax({
		url:saveSignInfoPath,
		method: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset:utf-8',
		data: formDatas,
		cache: false,
		success:function (data) {
			// alert('1')
			// alert(data.code)
			// alert(data.msg)
			if(data.code == 0){
				$$('.signView').hide();
				$$('.signCover').hide();
				app.myApp.toast('打卡成功！', 'success').show(true);
//				app.myApp.alert('打卡成功', function() {
//					app.myApp.getCurrentView().back();
//				});
				app.myApp.getCurrentView().back();
			}else{
				app.myApp.toast('打卡失败！', 'error').show(true);
			}
			
			
		},
		error:function (data) {
			
			app.myApp.toast('打卡失败！', 'error').show(true);
		}
	});

	}
	function onErrorPosition(e) {
		console.log('onErrorPosition')
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			switch (e.code) {
                case e.TIMEOUT:
	                app.myApp.showPreloader('定位中...');
					signStatus = 2;
					var map = new BMap.Map();
	//				var point = new BMap.Point(116.331398,39.897445);
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							//app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
							onSuccessPosition(r);
						}
						else {
							//app.myApp.alert('failed'+this.getStatus());
						}        
				    },{enableHighAccuracy: true});
				break;
               case e.PERMISSION_DENIED:
                   app.myApp.alert('请打开GPS定位');
                   break;
               case e.UNKNOWN_ERROR:
                   app.myApp.alert("发生一个位置错误");
                   break;
            }
//			if(e.code == '3'){
//				app.myApp.showPreloader('定位中...');
//				signStatus = 2;
//				var map = new BMap.Map();
//				var point = new BMap.Point(116.331398,39.897445);
//				var geolocation = new BMap.Geolocation();
//				geolocation.getCurrentPosition(function(r){
//					if(this.getStatus() == BMAP_STATUS_SUCCESS){
//						//app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
//						onSuccessPosition(r);
//					}
//					else {
//						//app.myApp.alert('failed'+this.getStatus());
//					}        
//			    },{enableHighAccuracy: true})
//			}else{
//				app.myApp.alert('请打开GPS定位');
//			}
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