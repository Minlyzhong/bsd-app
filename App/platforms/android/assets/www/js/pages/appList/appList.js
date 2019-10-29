define(['app',
	'hbs!js/hbs/application',
	'hbs!js/hbs/applicationPage'
], function(app, appTemplate, applicationPageTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载应用信息
	var loadAppInfoPath = app.basePath + '/mobile/menu/byUserMenuList';
	//查询日志信箱未审阅条数
	var findLogNotReviewSumPath = app.basePath + '/mobile/worklog/box/';
	//查询党建考核未完成条数
	var findUnCompletionNumPath = app.basePath + '/mobile/partyAm/findUnCompletionNum/';
	//查询微动态未读的日志数量
	var findNewRecordUnReadPath = app.basePath + 'extWorkOver/findUnReadRows';
	//查询3+x未读的日志数量
	var findShykUnReadPath = app.basePath + '/mobile/partyAm/getUnCompletedTotal';
	//查询一把手考核未完成条数
	var findLeaderPath = app.basePath + '/mobile/partyAm/getLeaderTotal';
	//查询每一日学未学习的数量
	var dailyLearningNumPath = app.basePath + '/mobile/course/content/nostudy/';
	//每日一学最新一条数据
	var studyEveryDayPath = app.basePath + '/mobile/course/content/push/';
	var notReviewSum = 0;
	var UnReadRows = 0;
	var shykReadRows = 0;
	var dailyLearningNum = 0;
	var notAssessSum = {};
	var LeadernotAssessSum = {};
	var lat = 0.0;
	var lng = 0.0;
	var scanInfo = '';
	var alreadyGetStudyData = false;
	var alreadyGetOtherData = false;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		var loginCB = app.myApp.onPageBack('login', function(backPage) {
			//获取用户信息
			//console.log('重新获取应用信息');
			initData(page.query);
			// getStudyEveryDayData();
		});
		app.pageStorageClear('appList/appList', [
			loginCB,
		]);
		if(firstIn) {
			initData(page.query);
		} else {
			loadStorage(page);
		}

		window.filePath=app.filePath;
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		app.back2Home();
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		lat = 0.0;
		lng = 0.0;
		scanInfo = '';
		var user = new Object();
		user.role = app.roleId;
//		app.myApp.alert(app.roleId);
		$$('.app-content').html(applicationPageTemplate(user));
		if(app.roleId == -1) {
			$$('.assessLogin').on('click', function() {
				app.myApp.getCurrentView().loadPage('login.html');
			});
		} else {
			notReviewSum = 0;
			UnReadRows = 0;
			shykReadRows = 0;
			dailyLearningNum = 0;
			notAssessSum = {};
			LeadernotAssessSum = {};
			//查询日志信箱未审阅条数
			findLogNotReviewSum();
			//查询党建考核未完成条数
			// findUnCompletionNum();
			// 查询一把手考核未完成条数 
			findLeaderUnCompletionNum();
			//查询微动态未读状态
//			findUnReadRows();
			//查询三会一课
			findShykReadRows(); 
			//查询每日一学
			findDailyLearningNum(); 
//			setInterval(
//				function(){
//					reSetUnReadRows();
//				}
//				,10000);
			//获取所有app信息
			ajaxLoadContent();
		}
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage(page) {
		setPageStorageClear(pageDataStorage['pageStorageClear']);
		$$('.record').html(pageDataStorage['reviewSum']);
		handleApp(pageDataStorage['app']);
		if(pageDataStorage['assessTotal']) {
			var total = pageDataStorage['assessTotal'];
			var total = total > 99 ? '99+' : total;
			var result = $$($$('.appContentList .appList')[0]).find('.grid');
			$$.each(result, function(index, item) {
				if($$(item).data('name') == '党建考核') {
					$(item).find('img').before('<span class="appBadge bg-red assessmentBadge">' + total + '</span>');
				}
			});
		}
	}

	/**
	 *  查询日志信箱未审阅条数
	 */
	function findLogNotReviewSum() {
		app.ajaxLoadPageContent(findLogNotReviewSumPath+ app.userId+'/unread', {
			// userId: app.userId,
			// tenantId:
		}, function(result) {
			var data = result.data;
			pageDataStorage['reviewSum'] = data;
			notReviewSum = data;
		}, {
			async: false
		});
	}
	
	/**
	 * 查询微动态未读的日志数量
	 */
	function findUnReadRows() {
		app.ajaxLoadPageContent(findNewRecordUnReadPath, {
			userId: app.userId,
		}, function(result) {
			pageDataStorage['UnReadRows'] = result.total;
			UnReadRows = result.total;
		},{
			async: false
		});
	}
	
	/**
	 * 查询3+x未读的日志数量
	 */
	function findShykReadRows() {
		var myDate = new Date();
		var startDate = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-01';
		var endDate =myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-31';
		app.ajaxLoadPageContent(findShykUnReadPath, {
			// deptId:app.user.deptId,
			// startDate:startDate,
			// endDate:endDate,
			khpl:2
		}, function(result) {
			pageDataStorage['shykReadRows'] = result.data;
			shykReadRows = result.data;
		},{
			async: false
		});
	}
	
	/**
	 * 查询每日一学未完成数量
	 */
	function findDailyLearningNum() {
		app.ajaxLoadPageContent(dailyLearningNumPath+app.userId, {
			// userId:app.userId
		}, function(result) {
			pageDataStorage['dailyLearningNum'] = result.data;
			dailyLearningNum = result.data;
		},{
			async: false,
			type:'GET'
		});
	}

	/**
	 * 查询党建考核未完成条数 
	 */
	function findUnCompletionNum() {
		$$.ajax({
			url: findUnCompletionNumPath+app.user.deptId,
			method: 'GET',
			dataType: 'json',
			// data: {
			// 	deptId: app.user.deptId,
			// },
			success: function(result) {
				notAssessSum = result;
				if(notAssessSum.totalNum) {
					pageDataStorage['assessFirstTotal'] = notAssessSum.totalNum;
					var total = notAssessSum.totalNum > 99 ? '99+' : notAssessSum.totalNum;
					var result = $$($$('.appContentList .appList')[0]).find('.grid');
					$$.each(result, function(index, item) {
						if($$(item).data('name') == '党建考核') {
							$(item).find('img').before('<span class="appBadge bg-red assessmentBadge">' + total + '</span>');
						}
					});
				}
			},
			error: function() {
				app.myApp.alert(app.utils.callbackAjaxError());
			}
		});
	}

	/**
	 * 查询一把手考核未完成条数 
	 */
	function findLeaderUnCompletionNum() {
		$$.ajax({
			url: findLeaderPath,
			method: 'GET',
			dataType: 'json',
			// data: {
			// 	deptId: app.user.deptId,
			// },
			success: function(data) {
				if(data.data == null){
					data.data = 0;
				}
				LeadernotAssessSum = data.data;
				if(LeadernotAssessSum) {
					pageDataStorage['assessLeaderTotal'] = LeadernotAssessSum;
					var total = LeadernotAssessSum > 99 ? '99+' : LeadernotAssessSum;
					var result = $$($$('.appContentList .appList')[0]).find('.grid');
					$$.each(result, function(index, item) {
						if($$(item).data('name') == '一把手考核') {
							$(item).find('img').before('<span class="appBadge bg-red assessFirstBadge">' + total + '</span>');
						}
					});
				}
			},
			error: function() {
				app.myApp.alert(app.utils.callbackAjaxError());
			}
		});
	}


	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent(loadAppInfoPath, {
			// userId: app.userId
			userId: app.userId,
		}, function(data) {
			// console.log('应用页图标')
			// console.log(data)
			if(data.data && data.data.length > 0) {
				var pageArr = [];
				$$.each(data.data, function(_, menuItem) {
					// console.log('menuItem')
					// console.log(menuItem)
					// console.log('app.roleId')
					// console.log(app.roleId)
					$$.each(menuItem.children, function(_, appItem) {
						appItem.menuIcon=app.filePath+appItem.menuIcon;
						if(app.roleId < 1 && appItem.menuUrl == "assessTopicList.html") {
							appItem.menuUrl = -1;
							
							return true;
						}
						// console.log(app.roleId);
						if(app.roleId == 1 && appItem.menuUrl == "threePlusStatistics.html") {
							console.log('1----');
							console.log(app.roleId);
							appItem.menuUrl = 'rankTest.html';
							// appItem.menuIcon = app.filePath+'images/threePlusXStatistics.png';
							return true;
						}
						else if(app.roleId == 5 && appItem.menuUrl == "threePlusStatistics.html") {
							console.log('2----')
							appItem.menuUrl = 'shykDUD1.html?deptName='+app.userDetail.deptName;
							// appItem.menuIcon = app.filePath+'images/threePlusXStatistics.png';
							return true;
						}
						else if(app.roleId == 6 && appItem.menuUrl == "threePlusStatistics.html") {
							console.log('3----')
							appItem.menuUrl = 'shykDUD1.html?deptName='+app.userDetail.deptName;
							// appItem.menuIcon = app.filePath+'images/threePlusXStatistics.png';
							return true;
						}
						else if(appItem.menuUrl == "threePlusStatistics.html"){
							console.log(app.roleId);
							appItem.menuUrl = 'rankTest.html';
							// appItem.menuUrl = 'shykDUD1.html?deptName='+app.userDetail.deptName;
							return true;
						}
						
						if(app.roleId == 6 && appItem.menuUrl == "partyEvaluation.html") {
							appItem.menuUrl = 'partyEvaluationLeader.html';
							// appItem.menuIcon = app.filePath+'images/assessment.png';
							return true;
						}
						if(appItem.menuUrl == "assessmentResult.html") {
							appItem.menuUrl = 'assessmentResultEntrance.html';
							// appItem.menuIcon = app.filePath+'images/result.png';
							return true;
						}
						if(appItem.menuUrl.indexOf('.') != -1) {
							if(appItem.menuUrl == 'assessTopicList.html') {
								// appItem.menuIcon=app.filePath+appItem.menuIcon;
								pageArr.push('assessment/' + appItem.menuUrl.split('.')[0]);
							} else {
								pageArr.push(appItem.menuUrl.split('.')[0] + '/' + appItem.menuUrl.split('.')[0]);
							}
						}
						appItem.badgeCount = 0;
						appItem.appLower = appItem.menuUrl.split('.')[0];
						appItem.appBasePath = app.basePath;
					});
				});
				setPageStorageClear(pageArr);
				pageDataStorage['app'] = data.data;
				handleApp(data.data);
			} else {
				app.myApp.alert('还没有添加应用！');
			}
			var result = $$($$('.appContentList .appList')).find('.grid');
			$$.each(result, function(index, item) {
				// console.log('result')
				// console.log(result)
				if($$(item).data('name') == '工作日志') {
					if(notReviewSum != 0) {
						$(item).find('img').before('<span class="appBadge bg-red appRecordBadge1">' + notReviewSum + '</span>');
					}
				}
				if($$(item).data('name') == '微动态') {
					if(UnReadRows != 0) {
						$(item).find('img').before('<span class="appBadge1 bg-red appRecordBadge"></span>');
					}
				}
				if($$(item).data('name') == '三会一课考核统计') {
					if(shykReadRows != '0') {
						$(item).find('img').before('<span class="appBadge bg-red appRecordBadge shykBadge">' + shykReadRows + '</span>');
					}
				}
				// if($$(item).data('name') == '一把手考核') {
				// 	if(LeadernotAssessSum != '0') {
				// 		$(item).find('img').before('<span class="appBadge bg-red assessFirstBadge shykBadge">' + LeadernotAssessSum + '</span>');
				// 	}
				// }
				if($$(item).data('name') == '每日一学') {
					if(dailyLearningNum != '0') {
						$(item).find('img').before('<span class="appBadge bg-red appRecordBadge dlBadge">' + dailyLearningNum + '</span>');
					}
				}
			});
			alreadyGetOtherData = true;
			getStudyEveryDayData();
		});
	}

	/**
	 * 设置页面缓存清理
	 * @param {Object} pageArr 页面数组
	 */
	function setPageStorageClear(pageArr) {
		pageDataStorage['pageStorageClear'] = pageArr;
		app.pageStorageClear('appList/appList', pageArr);
	}

	/**
	 * 加载信息 
	 */
	function handleApp(data) {
		console.log('加载信息')
		console.log(data)
		$$('.app-content').html(appTemplate(data));
		$$('.MenuList').on('click', function() {
			if($$(this).attr("data-option") == "off") {
				$$(this).attr("data-option", "on");
				$(this).parent().children(".appList").slideDown(150);
			} else {
				$$(this).attr("data-option", "off");
				$(this).parent().children(".appList").slideUp(200);
			}
		});
		$$('.app-content .grid').on('click', function() {
			if(app.userId <= 0) {
				toLogin();
				return;
			}
			var appId = $$(this).data('id');
			var menuName = $$(this).data('name');
			if(appId == 'villageCheck') {
				userScan();
			} else if(appId == 'assessment.html') {
				console.log(notAssessSum.child)
				if(!notAssessSum.child) {
					notAssessSum.child = [];
				}
				app.myApp.getCurrentView().loadPage(appId + '?appName=' + menuName + '&notAssess=' + JSON.stringify(notAssessSum.child));
			}else if(appId == 'assessmentFirstHand.html') {
				console.log(LeadernotAssessSum.child);
				if(!LeadernotAssessSum.child) {
					LeadernotAssessSum.child = [];
				}
				app.myApp.getCurrentView().loadPage(appId + '?appName=' + menuName + '&notAssess=' + JSON.stringify(LeadernotAssessSum.child));
			} else {
				app.myApp.getCurrentView().loadPage(appId + '?appName=' + menuName);
			}
		});
	}

	/**
	 * 扫一扫 
	 */
	function userScan() {
		cordova.plugins.barcodeScanner.scan(
			function(result) {
				result.text = JSON.parse(result.text);
				if(result.text.type && result.text.id) {
					scanInfo = result.text;
					app.myApp.showPreloader("加载中...");
					sendUserRecord();
				} else if(result.cancelled == "1") {
					app.myApp.toast('取消扫描', 'error').show(true);
				} else {
					app.myApp.alert("扫描出错，请检查二维码是否正确");
				}
			},
			function(error) {

			}, {
				"preferFrontCamera": false,
				"showFlipCameraButton": false,
				"formats": "QR_CODE,PDF_417",
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
		app.myApp.hidePreloader();
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

	/*
	 * 处理地址信息 
	 */
	function renderReverse(response) {
		if(response.status) {} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			//上传记录
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
			});
		}
	}

	/**
	 * 设置工作日志未读条数 
	 */
	function setRecordBadge() {
		pageDataStorage['reviewSum'] = pageDataStorage['reviewSum'] - 1;

		if(pageDataStorage['reviewSum'] <= 0) {
			$$('.appRecordBadge1').html(0);
		}else{
			$$('.appRecordBadge1').html(pageDataStorage['reviewSum']);
		}
	}
	/**
	 * 设置微动态未读条数 
	 */
	function setUnReadRows() {
		if(pageDataStorage['UnReadRows']>0){
			pageDataStorage['UnReadRows'] = pageDataStorage['UnReadRows'] - 1;
			if(pageDataStorage['UnReadRows'] == 0){
				$$('.appBadge1').css('display','none');
			}
		}else{
			console.log('已经等于0，不能再减了');
		}
	}
	
	/*
	 * 微动态未读条数（定时） 
	 */
	function reSetUnReadRows(){
		app.ajaxLoadPageContent(findNewRecordUnReadPath, {
			userId: app.userId,
		}, function(result) {
			if(result.total>0){
				$$('.appBadge1').css('display','block');
			}else{
				$$('.appBadge1').css('display','none');
			}
		});
	}
	
	/*
	 * 每日一学未读条数（定时） 
	 */
	function reSetDlNum(){
		app.ajaxLoadPageContent(dailyLearningNumPath+app.userId, {
			// userId: app.userId,
		}, function(result) {
			if(result.data != '0'){
				$$('.dlBadge').html(result.data);
			}else{
				$$('.dlBadge').css('display','none');
			}
		});
	}
	
	/*
	 * shyk未读条数
	 */
	function reSetshykReadRows(){
		var myDate = new Date();
		var startDate = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-01';
		var endDate =myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-31';
		app.ajaxLoadPageContent(findShykUnReadPath, {
			// deptId:app.user.deptId,
			// startDate:startDate,
			// endDate:endDate,
			// khpl:3
		}, function(result) {
			console.log(result)
			if(result != '0'){
				$$('.shykBadge').html(result.data);
			}else{
				$$('.shykBadge').css('display','none');
			}
		});
	}

	/**
	 * 获取每日一学最新一条数据
	 */
	function getStudyEveryDayData(){
		if(user == -1 || user ==''|| user == null){
			return;
		}else{
			app.ajaxLoadPageContent(studyEveryDayPath+app.userId, {
				// userId:app.userId
		}, function(data) {
			alreadyGetStudyData = true;
			showStudyEveryDayDialog(data.data);
		});
		}
		
	}
	
	/**
	 * 展示每日一学弹出框
	 */
	function showStudyEveryDayDialog(studyData){
		// var curDay = app.utils.getCurTime().split(" ")[0];
		// if(curDay == localStorage.getItem('lastStudyDay')){
		// 	return;
		// }else if(alreadyGetStudyData && alreadyGetOtherData){
		// 	setTimeout(function(){
		// 		if(studyData != null && studyData != undefined && JSON.stringify(studyData) != "{}"){
		// 			localStorage.setItem('lastStudyDay',curDay);
		// 			app.myApp.alert(studyData.contentTitle, '每日一学',function () {
		// 		       		app.myApp.getCurrentView().loadPage('dailyLearning.html');
		// 			});
		// 		}
		// 	},1000);
		// }else {
		// 	setTimeout(showStudyEveryDayDialog(studyData),1000);
		// }
	}
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	/**
	 * 减少一次未完成的数量
	 */
	function minusAssessNum(tpId) {
		pageDataStorage['assessTotal'] -= 1;
		var total = pageDataStorage['assessTotal'];
		var total = total > 99 ? '99+' : total;
		$$('.assessmentBadge').html(total);
		$$.each(notAssessSum.child, function(index, item2) {
			if(item2.knowledgePaperId == tpId) {
				item2.totalNum = item2.totalNum - 1;
			}
		});
	}
	/**
	 * 减少一次未完成的数量
	 */
	function minusAssessFirstNum() {
		console.log(pageDataStorage['assessLeaderTotal']);
		pageDataStorage['assessLeaderTotal'] -= 1;
		var total = pageDataStorage['assessLeaderTotal'];
		var total = total > 99 ? '99+' : total;
		$$('.assessFirstBadge').html(total);
		// $$.each(LeadernotAssessSum.child, function(index, item2) {
		// 	if(item2.knowledgePaperId == tpId) {
		// 		item2.totalNum = item2.totalNum - 1;
		// 	}
		// });
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
		setRecordBadge: setRecordBadge,
		setUnReadRows :setUnReadRows,
		reSetshykReadRows:reSetshykReadRows,
		reSetDlNum:reSetDlNum,
		minusAssessNum: minusAssessNum,
		minusAssessFirstNum: minusAssessFirstNum
	}
});