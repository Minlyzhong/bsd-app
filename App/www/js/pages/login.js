define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;

	var client_id = 'app';
	var client_secret='app';
	var grant_type='password';
	var scope ='app';
	var word = 'welcome,bestinfo';
	//登陆接口
	var loginPath = app.loginPath+'/auth/oauth/token';
	//设备信息录入接口
	var saveMobileDeviceUserPath = app.basePath + 'mobile/device/saveMobileDeviceUser';
	// 根据 ID查询用户信息
	var getUserInfo = app.basePath + '/mobile/user/getUserInfo/';
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
	//var deviceIP = returnCitySN["cip"];
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
		// $$('backHome').on('click',function(){
		// 	require(['js/pages/home/home'], function(home) {
		// 		console.log('home----')	
		// 		home.colorConfirm();
		// 		home.refreshLogin();
		// 	});
		// })

	}

	
	function logionIn() {

		var userName = $$('.login-form').find('input[name="userName"]').val();
		var password = $$('.login-form').find('input[name="password"]').val();
		console.log(password);
		if(userName == null || userName == '') {
			app.myApp.alert('用户名不能为空!');
			return;
		} else if(password == null || password == '') {
			app.myApp.alert('密码不能为空!');
			return;
		} else {
			app.myApp.showPreloader("正在登陆中...");
			var newPwd = getAesString(password,word);
			console.log(newPwd);
			var headers = makeBasicAuth(client_id,client_secret);
			app.ajaxWithHeader(loginPath, {
				username: userName,
				password: newPwd,
				grant_type:grant_type,
				scope:scope
			},{
				Authorization:headers
			}, function(data) {
				console.log(data);
				if(data) {
					app.isLog = true;
					// var userId = data.userId;
					// var user = data.data[0];
					// user.deptName = data.data[1].deptName;
					// user.partyType = data.data[1].partyType;
					// user.partyTypeVal = data.data[1].partyTypeVal;
					console.log(data.access_token);
					app.access_token = data.access_token;
					console.log('登录-data')
					console.log(data)
					app.user = data;
					app.userId = data.userId;
					app.roleId = data.roleId;
					app.deptId = data.deptId;
					app.tenantId = data.tenantId;
					// app.headPic = data.headPic;
					localStorage.setItem('access_token', data.access_token);
					localStorage.setItem('roleId', data.roleId);
					localStorage.setItem('loginName', data.userName);
					localStorage.setItem('userId', data.userId);
					localStorage.setItem('password', password);
					localStorage.setItem('deptId', data.deptId);
					localStorage.setItem('verify', '1');
					localStorage.setItem('user', JSON.stringify(data));

					// 根据id获取个人信息
					getUserDetail(data.userId, data.access_token)

					
					app.myApp.toast('登陆成功！', 'success').show(true);
					
					app.myApp.getCurrentView().back();

					//查看用户皮肤
					require(['js/pages/home/home'], function(home) {
						console.log('home----')	
						home.colorConfirm();
						home.refreshLogin();
					});

				
					
					$$('.homeCamera').css('display','none');
					//新闻速递只给管理员，党组织管理员和乡镇管理员（3，4，5）
					// if(app.roleId == 4 || app.roleId == 5 || app.roleId ==6){
					// 	$$('.homeCamera').css('display','block');
					// }else{
					// 	$$('.homeCamera').css('display','none');
					// }
					// $$('.homeCamera').css('display','block');

					//上传用户的设备信息
//					if(localStorage.getItem('userId') != '-1'){
//						setTimeout(function() {
//								//deviceInfoFormUser();
//						}, 1500);
//					}
				} else {
					app.myApp.hidePreloader();
					app.myApp.toast('用户名或密码错误！', 'error').show(true);
				}
			},function(error){
				console.log(error)
				app.myApp.hidePreloader();
				var text = JSON.parse(error.responseText)
				if(text.code == 1){
					app.myApp.toast(text.msg, 'error').show(true);
				}else{
					app.myApp.toast('登陆失败', 'error').show(true);
				}
				
			});
			
		}
	}
// 查询用户信息
	function getUserDetail(userId, access_token){
		$.ajax({
			url : getUserInfo+userId,
			method : 'GET',
			headers:{Authorization : "bearer "+ access_token},
			success : function(data){
				if(data.code == 0 && data.data !=null){
					app.myApp.hidePreloader();
					console.log('查询用户信息')
					console.log(data)
					var userDetail = data.data;
					console.log(userDetail)
					app.userDetail = userDetail;
					app.userType = data.data.userType;
					// user.partyType = data.data.partyType;
					// user.partyTypeVal = data.data.partyTypeVal;
					// app.user.deptName = data.data.deptName;
					// $$('.user-header1 img').attr('src', app.headPic);
					// $$('.user-header1 img').attr('alt', 'login.js');
					// $$('.user-header1 img').attr('src', '../../img/newIcon/home_title.png');
					if(userDetail.avatar) {
						var headPic = app.filePath + userDetail.avatar;
					} else {
						var headPic = 'img/icon/icon-user_d.png';
					}
					app.headPic = headPic;
					$$('.userName').html(app.user.nickName);
					$$('.userName').css('display','block');
					$$('.userDeptName').html(app.userDetail.deptName);
					localStorage.setItem('headPic', headPic);
					$$('.user-header img').attr('src', app.headPic);
					localStorage.setItem('headPic', app.headPic);
					
					localStorage.setItem('userType', data.data.userType)
					localStorage.setItem('userDetail', JSON.stringify(userDetail))
				}else{
					app.myApp.hidePreloader();
					app.myApp.toast('登陆失败', 'error').show(true);
				}
				
			},
			error : function(){

				app.myApp.hidePreloader();
				app.myApp.toast('登陆失败', 'error').show(true);
			}
		})
		

					

			
	}

	function getAesString(word,_key){
		var key = CryptoJS.enc.Utf8.parse(_key); //十六位十六进制数作为密钥
		var iv = CryptoJS.enc.Utf8.parse(_key); 
		let srcs = CryptoJS.enc.Utf8.parse(word);
		let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
		return encrypted.toString();//返回的是base64格式的密文
	}

	function makeBasicAuth(client_id,client_secret){
		var tok = client_id + ':' + client_secret;
		var hash = Base64.encode(tok,false);
		return "Basic " + hash;
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