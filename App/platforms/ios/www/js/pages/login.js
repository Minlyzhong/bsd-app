define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//登陆接口
	var loginPath = app.basePath + 'auth/authLogin';
	//设备信息录入接口
	var saveMobileDeviceUserPath = app.basePath + 'mobile/device/saveMobileDeviceUser';
	// 设备名称
	var deviceName = '';
	// 设备编号
	var deviceNo = '';
	// 设备标识码
	var deviceEmie = '';
	// 设备类型
	var deviceType = 0;
    // APP版本
    var appVersion = app.version;
    // 用户ID
    var userId1 = app.userId;
    // 设备IP
	var deviceIP = returnCitySN["cip"];
	// 电量
	var battery = 0;
	// 网络信号
	var netSignal = 0;
	// GPS信号
	var gpssignal = 0;
	// 设备Mac地址
	var deviceMac = '';
	// 百度云推送channelId
	var channelId = '';
	
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		var saveLoginName = localStorage.getItem('loginName');
		if(saveLoginName) {
			$$('#userName').val(saveLoginName);
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.logion-button').on('click', function() {
			logionIn();
		});
		$$('.registered-button').on('click', function() {
			app.myApp.getCurrentView().loadPage('userRegistered.html');
		});
	}

	function logionIn() {
		var userName = $$('.login-form').find('input[name="userName"]').val();
		var password = $$('.login-form').find('input[name="password"]').val();
		if(userName == null || userName == '') {
			app.myApp.alert('用户名不能为空!');
			return;
		} else if(password == null || password == '') {
			app.myApp.alert('密码不能为空!');
			return;
		} else {
			app.ajaxLoadPageContent(loginPath, {
				loginName: userName,
				loginPwd: password
			}, function(data) {
				console.log(data);
				if(data.success) {
					var userId = data.data[0].id;
					var user = data.data[0];
					user.deptName = data.data[1].deptName;
					user.partyType = data.data[1].partyType;
					user.partyTypeVal = data.data[1].partyTypeVal;
					var roleId = data.data[1].roleId;
					console.log("roleId:"+roleId);
					var headPic = data.data[0].headPic;
					if(headPic) {
						headPic = app.basePath + headPic;
					} else {
						headPic = 'img/icon/icon-user_d.png';
					}
					app.userId = userId;
					app.user = user;
					app.roleId = roleId;
					app.headPic = headPic;
					localStorage.setItem('headPic', app.headPic);
					localStorage.setItem('roleId', roleId);
					localStorage.setItem('loginName', userName);
					localStorage.setItem('userId', userId);
					console.log(localStorage.getItem('userId'));
					localStorage.setItem('password', password);
					
					localStorage.setItem('verify', '1');
					
					localStorage.setItem('user', JSON.stringify(user));
					console.log(app.user);
					app.myApp.toast('登陆成功！', 'success').show(true);
					$$('.user-header1 img').attr('src', app.headPic);
					app.myApp.getCurrentView().back();
					//查看用户皮肤
//					setTimeout(function() {
						//调用
					require(['js/pages/home/home'], function(home) {	

						home.colorConfirm();
						home.iscrollTitle();
					});
//					}, 1000);
					//上传用户的设备信息
//					console.log(localStorage.getItem('userId') != '-1');
					if(localStorage.getItem('userId') != '-1'){
						setTimeout(function() {
								//deviceInfoFormUser();
						}, 1500);
					}
				} else {
					//app.myApp.toast('登录失败！', 'error').show(true);
					app.myApp.toast('用户名或密码错误！', 'error').show(true);
				}
			});
			
		}
	}
	
	
	/*
	 * 获取用户设备信息
	 */
	function deviceInfoFormUser(){
//		window.addEventListener("batterystatus", onBatteryStatus, false);
		userId1 = localStorage.getItem('userId');
		channelId = '';
//		document.addEventListener("deviceready", function () {
//		window.baidupush.startWork("zQxFGN5M4AyZjU3yjQ8uVmH5", function(info){
//			channelId = info.data.channelId;
//			//app.myApp.alert('channelId:'+channelId);
//		});
////		}, false);
//		window.baidupush.listenNotificationClicked(function(info){
////			setTimeout(function(){
//				//app.myApp.alert(info.data.mid);
//				//app.myApp.getCurrentView().loadPage('login.html');
////			},1000);	
//			var meetingId = info.data.meetingId;
//			app.myApp.getCurrentView().loadPage('notice.html?meetingId='+meetingId);
//		});

//		console.log(userId1)
		// 设备名称
		deviceName = device.model;
		// 设备编号
		deviceNo = device.serial;
		// 设备标识码
		deviceEmie = device.uuid;
//		/*
//		 * 判断设备
//		 */
		if(device.platform == 'Android'){
			deviceType = 0;
		}else{
			deviceType = 1;
		}
//		app.myApp.alert('app.version:'+app.version); 	//获取app的版本号
//		app.myApp.alert('app.userId:'+app.userId); 	//获取用户ID
//		app.myApp.alert('deviceName:'+deviceName);    //返回设备的模型或产品名称   
//		app.myApp.alert('deviceEmie:'+deviceEmie);    //获取设备通用唯一标识uuid 
//		app.myApp.alert('deviceType:'+deviceType);    //获取操作系统名称
//		app.myApp.alert('deviceNo:'+deviceNo);      //获取设备序列号
//		app.myApp.alert('deviceIP:'+deviceIP);		//获取ip
//		//app.myApp.alert('channelId:'+channelId);		//获取channelId
		window.MacAddress.getMacAddress(  
    		function(macAddress) {
    			deviceMac = macAddress //获取mac
 //   			app.myApp.alert(deviceMac);
    		},function(fail) {
    			app.myApp.alert(fail);
    		}
		); 
		setTimeout(function(){
				app.ajaxLoadPageContent(saveMobileDeviceUserPath, {
					deviceName : deviceName,
					deviceNo : deviceNo,
					deviceEmie : deviceEmie,
					deviceType : deviceType,
				    appVersion : appVersion,
				    userId : userId1,
					deviceIP : deviceIP,
					battery : battery,
					netSignal : netSignal,
					gpssignal : gpssignal,
					deviceMac : deviceMac,
					channelId : channelId,
				}, function(data) {
					if(data.success == 'true'){
						window.removeEventListener("batterystatus", onBatteryStatus, false);
					}
				});
		},1000);
	}
	/*
	 * 获取手机电量
	 */
	function onBatteryStatus(info) {
		battery = info.level
//  	app.myApp.alert('电量：'+battery);
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