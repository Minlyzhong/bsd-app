define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//校验打卡状态
	var checkSignPath = app.basePath + '/mobile/sign/check';
	//保存打卡信息
	var saveSignInfoPath = app.basePath + '/mobile/sign/save';
	//获取信息
	var findSysCityPath = app.basePath + '/mobile/village/map/center';
	var type = -1;
	var lat = 0.0;
	var lng = 0.0;
	var userPosition = '';
	var signType = '';
	var signStatus = 0;
	var sysCity;
	var signCount;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
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
		sysCity = '';
		signCount = 1;
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
		//点击个人统计
		$$('.ownReport').on('click', function() {
			app.myApp.getCurrentView().loadPage('signPersonReport.html?userId=0');
		});
		//点击完成按钮
		$$('.signView .searchBtn').on('click', function() {
			saveSignInfo();
		});
		//点击取消按钮
		$$('.signView .cancelBtn').on('click', function() {
			$$('.signView').hide();
			$$('.signCover').hide();
			signCount == 1;
		});
		//点击完成按钮
		$$('.signViewOther .searchBtn').on('click', function() {
			saveSignOtherInfo();
		});
		//点击取消按钮
		$$('.signViewOther .cancelBtn').on('click', function() {
			$$('.signViewOther').hide();
			$$('.signCover').hide();
		});
		$$('#cardUp').on('click', function() {
			type = 0;
			getPosition();
			if(type==0){
				$$('.signView').css('display','block');
				$$('.signViewOther').css('display','none');
			}
			//showInfo();
		});

		$$('#cardDown').on('click', function() {
			type = 1;
			getPosition();
			if(type==1){
				$$('.signView').css('display','none');
				$$('.signViewOther').css('display','block');
			}
			showOtherInfo();
		});
	}

	//校验打卡状态
	function checkSign() {
		app.ajaxLoadPageContent(checkSignPath, {
			// userId: app.userId
		}, function(data) {
			console.log(data);
			if(data.data.checkState == false) {
				$$('#cardUp').removeAttr('disabled');
				$$('#cardDown').removeAttr('disabled');
			}
		});
		//上线需要注释
//		if(true) {
//			$$('#cardUp').removeAttr('disabled');
//			$$('#cardDown').removeAttr('disabled');
//		}
	}

	/**
	 * 定位 
	 */
	function getPosition() {	
		//开启定位服务		
		if(navigator.geolocation) {
			app.myApp.showPreloader('定位中...');
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true,
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
		app.ajaxLoadPageContent1('https://api.map.baidu.com/ag/coord/convert', {
			from: 0,
			to: 4,
			x: _lng,
			y: _lat
		}, function(data) {
			lng = app.utils.base64decode(data.x);
			lat = app.utils.base64decode(data.y);
			GetAddress();
			if(signCount >= 1 && type==0){
				showInfo();
			}
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
		app.ajaxLoadPageContent1(_SAMPLE_ADDRESS_POST, {
		}, function(data) {
			app.myApp.hidePreloader();
			renderReverse(data);
		}, {
			type: 'GET',
		});
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			$$('#position').val(userPosition);
		}
	}
	
	/*
	 * 地图
	 */
	function getMapCenter(){
		var token = localStorage.getItem('access_token');
		$.ajax({
			url : findSysCityPath,
			headers: {
				Authorization: "bearer "+token
			},
			data : {
				// level : 2,
				// level : queryStr,
				tenantId : app.tenantId
			},
			success : function(data) {
				// var json = $.parseJSON(data);
				if (data.msg=='success' && data.data != null) {
					sysCity = data.data.sysCity;
					loadSignMap();
				}
			},
			error : function() {
			}
		});
	}
	
	function loadSignMap(){
		// 百度地图API功能
		var map = new BMap.Map("allmap");
		map.centerAndZoom(sysCity, 15); 
		map.enableScrollWheelZoom(true);
		var top_left_navigation = new BMap.NavigationControl();
		map.addControl(top_left_navigation); 
		// 添加定位控件
		var geolocationControl = new BMap.GeolocationControl({anchor: BMAP_ANCHOR_TOP_RIGHT});
		map.addControl(geolocationControl);    
		var point, marker, label;
		if(signCount == 1 && lat != 0.0 && lng != 0.0 ){
			map.clearOverlays();
			point = new BMap.Point(lng,lat);
			marker = new BMap.Marker(point);  // 创建标注
			map.centerAndZoom(point, 15); 
			map.addOverlay(marker);              // 将标注添加到地图中
			label = new BMap.Label(app.user.deptName,{offset:new BMap.Size(20,-10)});
			marker.setLabel(label);
			GetAddress();
			signCount += 1;
		}
		map.addEventListener("dragend",function(){
			map.clearOverlays();
			point = new BMap.Point(map.getCenter().lng, map.getCenter().lat);
			lng = map.getCenter().lng;
			lat = map.getCenter().lat;
			marker = new BMap.Marker(point);  // 创建标注
			map.addOverlay(marker);              // 将标注添加到地图中
			label = new BMap.Label(app.user.userName,{offset:new BMap.Size(20,-10)});
			marker.setLabel(label);
			GetAddress();
		});
	}

	//信息查看和上传
	function showInfo() {
		getMapCenter();
		$$('.signView').show();
		$$('.signCover').show();
		//$$('#signType').val(signType);
		$$('#name').val(app.user.nickName);
		$$('#time').val(app.utils.getCurTime());
	}
	//信息查看和上传
	function showOtherInfo() {
		$$('.signViewOther').show();
		$$('.signCover').show();
		//$$('#signType').val(signType);
		$$('#name1').val(app.user.nickName);
		$$('#time1').val(app.utils.getCurTime());
	}

	//上传记录,上班打卡
	function saveSignInfo() {

		var params={
			userId: app.userId,
			deptId:app.user.deptId,
			lng: lng,
			lat: lat,
			address: userPosition,
			types: 1,
			// username: app.user.userName,
			// reportTime: $$('#time').val(),
			memo: $$('#demo').val(),
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveSignInfoPath,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            	if(data.msg == 'success') {
					$$('.signView').hide();
					$$('.signCover').hide();
					app.myApp.toast('打卡成功！', 'success').show(true);
					app.myApp.getCurrentView().back();
				}
            	
            },
            error:function () {
				app.myApp.toast('打卡失败！', 'none').show(true);
            }
        });

	
	}
	//上传记录, 请假出差打卡
	function saveSignOtherInfo() {


		var params={
			userId: app.userId,
			lng: lng,
			lat: lat,
			address: userPosition,
			types: $$('#signType1').val(),
			// reportTime: $$('#time1').val(),
			memo: $$('#demo1').val(),
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveSignInfoPath,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            	if(data.msg == 'success') {
					$$('.signViewOther').hide();
					$$('.signCover').hide();
					app.myApp.toast('打卡成功！', 'success').show(true);
					app.myApp.getCurrentView().back();
				}
            	
            },
            error:function () {
				app.myApp.toast('打卡失败！', 'none').show(true);
            }
        });
	}
	
	function onErrorPosition(e) {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			switch (e.code) {
                case e.TIMEOUT:
	                app.myApp.showPreloader('定位中...');
					signStatus = 2;
					var map = new BMap.Map();
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
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