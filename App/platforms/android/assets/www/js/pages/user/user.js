define(['app',
	'hbs!js/hbs/userTool'
], function(app, toolTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//用户积分排名接口
	var userPath = app.basePath + '/mobile/political/score/board/';
	//保存扫描记录
	var userRecordPath = app.basePath + '/mobile/scan/record/save';
	//用户工具接口
	var userToolPath = app.basePath + '/mobile/menu/tools';
	var userInfo = '';
	var allInfo = '';
	var lat = 0.0;
	var lng = 0.0;
	var scanInfo = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		var loginCB = app.myApp.onPageBack('login', function(backPage) {
			//console.log('用户更改');
			//获取用户信息
			loadUserInfo();
		});
		var userInfoCB = app.myApp.onPageBack('user/userInfo', function(backPage) {
			//console.log('检查头像');
			//获取用户信息
			var oldHeadPic = $$('.user-header img').attr('src');
			if(oldHeadPic != localStorage.getItem('headPic')  && oldHeadPic != null && oldHeadPic != '') {
				$$('.user-header img').attr('src', localStorage.getItem('headPic'));
			}
		});
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
		
		// $$('.branchStyle').on('click',function(){
		// 	app.myApp.getCurrentView().loadPage('myBranch.html');
		// });
		
		$$('.carousel-top-title2').on('click',function(){
			app.myApp.getCurrentView().loadPage('myBranch.html');
		});
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		userInfo = '';
		allInfo = '';
		lat = 0.0;
		lng = 0.0;
		scanInfo = '';
		loadUserInfo();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		setPageStorageClear(pageDataStorage['pageStorageClear']);
		if(app.userId > 0) {
			$$('.userName').css('display','block');
			$$('.userName').html(app.user.userName);
			//console.log(app.user.userName)	
			$$('.user-header img').attr('src', app.headPic);
	
			$$('.login-out').show();
			$$('.login-in').hide();
			//用户信息
			handleUserInfo(pageDataStorage['userInfo']);
			//用户工具
			handleUserTool(pageDataStorage['userTool']);
		} else {
			$$('.userName').html('---');
			$$('.login-out').hide();
			$$('.score').html('--');
			$$('.rank').html('--');
			$$('.login-in').show();
			$$('.row.toolList').html("");
		}
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.user-header img').attr('src', app.headPic);
		$$('#sp_version').html(app.version);
		if(app.userId <= 0) {
			$$('.login-out').hide();
		} else {
			$$('.login-in').hide();
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		// $$('.setting').on('click', function() {
		// 	app.myApp.getCurrentView().loadPage('setting.html');
		// });
		$$('.carousel-top-title1').on('click', function() {
			app.myApp.getCurrentView().loadPage('setting.html');
		});
		$$('.user-header img').on('click', userInformation);
		$$('.login-out').on('click', function() {
			app.myApp.confirm('是否退出此账号？', function() {
				app.userId = -1;
				app.user = '';
				app.roleId = -1;
				app.headPic = 'img/icon/icon-user_d.png';
				$$('.user-header img').attr('src', app.headPic);
				// $$('.user-header1 img').attr('src', '../../../img/newIcon/home_title.png');
				// $$('.user-header1 img').attr('alt', 'user.js');
				localStorage.setItem('headPic', 0);
				localStorage.setItem('userId', -1);
				localStorage.setItem('user', '-1');
				localStorage.setItem('userDetail', '-1');
				localStorage.setItem('access_token', null);
				//localStorage.setItem('loginName', null);
				localStorage.setItem('password', null);
				localStorage.setItem('verify', '1');
				localStorage.setItem('roleId', -1);
				//把主题设置为默认的，移除css
				app.removejscssfile('blue.css','css');
				app.removejscssfile('green.css','css');
				app.myApp.getCurrentView().loadPage('login.html');
				//新闻速递只给管理员，党组织管理员和乡镇管理员（3，4，5）
				// if(app.roleId == 4 || app.roleId == 5 || app.roleId ==6){
				// 	$$('.homeCamera').css('display','block');
				// }else{
				// 	$$('.homeCamera').css('display','none');
				// }
				// $$('.homeCamera').css('display','block');
				$$('.homeCamera').css('display','none');
			})
		});
		$$('.login-in').on('click', function() {
			app.myApp.getCurrentView().loadPage('login.html');
		});
		//用户积分明细
		$$('.userScore').on('click', function() {
			if(app.userId <= 0) {
				toLogin();
				return;
			}
			app.myApp.getCurrentView().loadPage('userScoreInfo.html');
		});

		//用户排名
		$$('.userRank').on('click', function() {
			if(app.userId <= 0) {
				toLogin();
				return;
			}
			app.myApp.getCurrentView().loadPage('userRank.html');
		});

		//用户收藏
		$$('.userFavorite').on('click', function() {
			if(app.userId <= 0) {
				toLogin();
				return;
			}
			app.myApp.getCurrentView().loadPage('userFavorite.html');
		});

		//用户留言
		$$('.userMsg').on('click', function() {
			if(app.userId <= 0) {
				toLogin();
				return;
			}
			app.myApp.getCurrentView().loadPage('userMessage.html');
		});
	}

	function toLogin() {
		app.myApp.toast('请登陆', 'none').show(true);
		app.myApp.getCurrentView().loadPage('login.html');
	}

	function loadUserInfo() {
		// console.log(app.user.userId+'app.userId')
		if(app.userId > 0 ) {
			$$('.branchStyle').css('display','block');
			$$('.userName').css('display','block');
			$$('.userName').html(app.user.userName);
			$$('.userDeptName').html(app.userDetail.deptName);
			$$('.user-header img').attr('src', app.headPic);
			// $$('.user-header1 img').attr('src', app.headPic);
			// $$('.user-header1 img').attr('alt', 'user-load.js');
			// $$('.user-header1 img').attr('src', '../../../img/newIcon/home_title.png');
			$$('.login-out').show();
			$$('.login-in').hide();
			//用户信息
			getUserInfo();
			//用户工具
			getUserTool();
		} else {
			$$('.branchStyle').css('display','none');
			$$('.userName').html('---');
			$$('.userDeptName').html('---');
			$$('.login-out').hide();
			$$('.score').html('--');
			$$('.rank').html('--');
			$$('.login-in').show();
			$$('.row.toolList').html("");
		}
	}

	/**
	 * 用户信息
	 */
	function userInformation() {
		if(app.userId > 0) {
			app.myApp.getCurrentView().loadPage('userInfo.html');
		}
	}

	//用户信息
	function getUserInfo() {
		app.ajaxLoadPageContent(userPath+app.userId, {
			
		}, function(data) {
			//console.log(data);
			pageDataStorage['userInfo'] = data;
			handleUserInfo(data);
		},
		{
			type:'GET'
		});
	}

	/**
	 * 加载用户信息 
	 * @param {Object} data
	 */
	function handleUserInfo(data) {
		userInfo = data.data;
//		if(infoData && infoData.length > 0) {
//			/*
//			 * 修改为用userId判断
//			 */
//			userInfo = {};
//			$$.each(infoData, function(index, item) {
//				if(item.userId == app.userId) {
//					userInfo = item;
//				}
//			});
//		}
		console.log('userInfo')
		console.log(userInfo)
		if(userInfo.totalScore > 0) {
			$$('.score').html(userInfo.totalScore);
		} else {
			$$('.score').html(0);

		}
		if(userInfo.scoreRank > 0) {
			$$('.rank').html(userInfo.scoreRank);
		} else {
			$$('.rank').html('--');
		}
		allInfo = infoData;
		//console.log(userInfo);
	}

	//用户工具
	function getUserTool() {
		app.ajaxLoadPageContent(userToolPath, {
			// userId: app.userId
		}, function(data) {
			//console.log(data);
			var pageArr = [
				'login',
				'userScoreInfo',
				'userRank',
				'userFavorite',
				'userMessage',
				'userInfo',
				'setting',
			];
			$$.each(data.data, function(_, item) {
				if(item.toolUrl.indexOf('.') != -1) {
					pageArr.push(item.toolUrl.split('.')[0]);
				}

				
			});
			setPageStorageClear(pageArr);
			pageDataStorage['userTool'] = data.data;
			handleUserTool(data);
		});
	}

	/**
	 * 设置页面缓存清理
	 * @param {Object} pageArr 页面数组
	 */
	function setPageStorageClear(pageArr) {
		pageDataStorage['pageStorageClear'] = pageArr;
		app.pageStorageClear('user', pageArr);
	}

	function handleUserTool(data) {
		if(data.data && data.data.length > 0) {
			$$.each(data.data, function(_, item) {
				item.toolBasePath = app.filePath;
			});
			$$('.row.toolList').html(toolTemplate(data.data));
			$$('.row.toolList .grid').on('click', function() {
				var appId = $$(this).data('id');
				if(appId == 'villageCheck') {
					// 暂时注释
					userScan();
					// app.myApp.getCurrentView().loadPage('scanPage.html'+'?title='+'志愿服务'+'&id=23'+'&type=' + 'ZYFW');
					// app.myApp.getCurrentView().loadPage('scanPage.html'+'?title='+'会议'+'&id=13'+'&type=' + 'MEETING');
				}else if(appId == '/app/KeDaXunFei.apk'){
					//下载科大讯飞
					app.myApp.confirm('确定要下载吗？', function(e) {
						open(app.filePath+appId, '_system');
					});
				}else {
					app.myApp.getCurrentView().loadPage(appId);
				}
			});
		}
	}

	function userScan() {
		cordova.plugins.barcodeScanner.scan(
			function(result) {
				// alert(1);
				result = JSON.parse(result.text);
				// alert(result);
				// alert(result.type);
				// alert(result.desc);
				// alert(result.id);
				if(result){
					var meetingTitle = result.desc;
					var meetingId = result.id;
					app.myApp.getCurrentView().loadPage('scanPage.html'+'?title='+meetingTitle+'&id='+meetingId+'&type=' + result.type);
				}
				// if(result.type=='MEETING'){
					
				// }else{
				// 	var VolunteerService = result.desc;
				// 	var VolunteerServiceId = result.id;
				// 	app.myApp.getCurrentView().loadPage('scanPage.html'+'?title='+VolunteerService+'&id='+VolunteerServiceId);
				// }
				// if(result.text.type && result.text.id) {
				// 	scanInfo = result.text;
				// 	app.myApp.showPreloader("登记中...");
				// 	sendUserRecord();
				// } else if(result.cancelled == "1") {
				// 	app.myApp.toast('取消扫描', 'none').show(true);
				// } else {
				// 	app.myApp.alert("扫描出错，请检查二维码是否正确");
				// }
			},
			function(error) {

			}, {
				"preferFrontCamera": false, // iOS and Android
				"showFlipCameraButton": false, // iOS and Android
				"formats": "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
			}
		);
	}

	//扫描成功后上传记录
	function sendUserRecord() {
		//开启定位服务
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
				timeout: 3000
			});
		}
	}

	/*
	 * 定位
	 */
	function onErrorPosition() {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			app.myApp.alert('请开启"GPS"定位功能');
		}
	}

	function onSuccessPosition(position) {
		var _lng = position.coords.longitude;
		var _lat = position.coords.latitude;
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
			renderReverse(data);
		}, {
			type: 'GET',
		});
	}

	function renderReverse(response) {
		if(response.status) {
			//			app.myApp.toast('自动获取地址失败!', 'error').show(true);
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			app.ajaxLoadPageContent(userRecordPath, {
				userId: app.userId,
				userName: app.user.userName,
				longitude: lng,
				latitude: lat,
				userPosition: userPosition,
				scanType: scanInfo.type,
				scanId: scanInfo.id,
				vlTime: app.utils.getCurTime()
			}, function(data) {
				app.myApp.hidePreloader();
				if(data.data.success == true) {
					app.myApp.alert('登记成功');
				} else {
					app.myApp.alert('登记出错<br />请检查网络状态！');
				}
			},{
				type:'POST'
			});
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
		getUserInfo:getUserInfo,
		resetFirstIn: resetFirstIn,
	}
});