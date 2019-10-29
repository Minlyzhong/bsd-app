define(['app',
	'hbs!js/hbs/userRegistered',
	'hbs!js/hbs/userDeptEdit',
	'hbs!js/hbs/userInfo',
	'hbs!js/hbs/userDeptInfo'
], function(app, editTemplate, deptTemplate, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	// 查询'党组织类型'选项值
	var findPT = app.basePath + 'sysEnums/findPartyType';
	// 查询'人员分类'选项值
	var findRYFL = app.basePath + 'sysEnums/findRYFL';
	// 查询'人员编制'选项值
	var findRYBZ = app.basePath + 'sysEnums/findRYBZ';
	// 查询'职业分类'选项值
	var findZY = app.basePath + 'sysEnums/findZYFL';
	// 查询'在职状态'选项值
	var findZZ = app.basePath + 'sysEnums/findZZZT';
	// 查询'行政职务'选项值
	var findXZ = app.basePath + 'sysEnums/findXZZW';
	// 查询'职务级别'选项值
	var findZW = app.basePath + 'sysEnums/findZWJB';
	// 查询'性别'选项值
	var findS = app.basePath + 'sysEnums/findSex';
	// 查询'政治面貌'选项值
	var findZM = app.basePath + 'sysEnums/findZZMM';
	// 查询'学历'选项值
	var findXL = app.basePath + 'sysEnums/findXL';
	// 查询'婚姻状况'选项值
	var findHY = app.basePath + 'sysEnums/findHYZK';
	// 查询'民族'选项值
	var findMZ = app.basePath + 'sysEnums/findMZ';
	//提交个人信息
	var saveEditPath = app.basePath + 'orgUser/updateUser4Mobile';
	//提交支部信息
	var saveDeptPath = app.basePath + 'orgDept/update4Mobile';
	var userData = {};

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('userInfoEdit/userInfoEdit', [
//
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		app.myApp.showPreloader('加载中...');
		window.setTimeout(function() {
			attrDefine(page);
			clickEvent(page);
		}, 500);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		//userData = app.user;
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
//		if(app.user.userType == 2) {
//			ajaxDeptLoad();
//			$$('.editList ul').html(deptTemplate(userData));
//		} else {
			ajaxUserLoad();
			console.log(userData);
			$$('.editList ul').html(editTemplate(userData));
			addCalendar('partyTime');
			addCalendar('birthday');
			addCalendar('workTime');
//		}
		app.myApp.hidePreloader();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//$$('.editSave').on('click', editSave);
	}

	/**
	 * 保存修改 
	 */
	function editSave() {
		var newData = app.myApp.formToJSON('.editList');
		for(var key in newData) {
			if(!newData[key] || !(isNaN(parseInt(newData[key])) || parseInt(newData[key]) >= 0)) {
				app.myApp.alert('请补全个人信息！');
				return;
			}
		}
		if(app.user.userType == 2) {
			newData['id'] = app.user.deptId;
			app.ajaxLoadPageContent(saveDeptPath, {
				json: JSON.stringify(newData)
			}, function(result) {
				console.log(result);
				if(result.success) {
					for(var key in newData) {
						switch(key) {
							case 'partyType':
								newData[key + 'Val'] = userData[key + 'Arr'][parseInt(newData[key])].val;
								break;
							default:
								break;
						}
					}
					$.extend(userData, newData);
					console.log(app.user);
					localStorage.setItem('user', JSON.stringify(app.user));
					var html = $$($$('.userInfoList ul li')[0]).html();
					$$('.userInfoList ul').html(html);
					$$('.userInfoList ul').append(deptInfoTemplate(app.user));
					require(['js/pages/user/userInfo'], function(userInfo) {
						userInfo.clickEvent();
					});
					app.myApp.getCurrentView().back();
				} else {
					app.myApp.alert('修改失败');
				}
			});
		} else {
			newData['id'] = app.userId;
			app.ajaxLoadPageContent(saveEditPath, {
				json: JSON.stringify(newData)
			}, function(result) {
				console.log(result);
				if(result.success) {
					for(var key in newData) {
						switch(key) {
							case 'education':
							case 'marital':
							case 'minority':
							case 'politics':
							case 'rybz':
							case 'ryfl':
							case 'xzzw':
							case 'zwjb':
							case 'zyfl':
							case 'zzzt':
								newData[key + 'Val'] = userData[key + 'Arr'][parseInt(newData[key])].val;
								break;
							case 'sex':
								newData[key + 'Val'] = userData[key + 'Arr'][parseInt(newData[key]) + 1].val;
								break;
							default:
								break;
						}
					}
					$.extend(userData, newData);
					console.log(app.user);
					localStorage.setItem('user', JSON.stringify(app.user));
					var html = $$($$('.userInfoList ul li')[0]).html();
					$$('.userInfoList ul').html(html);
					$$('.userInfoList ul').append(userInfoTemplate(app.user));
					require(['js/pages/user/userInfo'], function(userInfo) {
						userInfo.clickEvent();
					});
					app.myApp.getCurrentView().back();
				} else {
					app.myApp.alert('修改失败');
				}
			});
		}
	}

	/**
	 * 异步请求用户数据 
	 */
	function ajaxUserLoad() {
		ajaxLoadPageContent(findS, function(data) {
			userData['sexArr'] = data;
		});
		ajaxLoadPageContent(findZM, function(data) {
			userData['politicsArr'] = data;
		});
		ajaxLoadPageContent(findMZ, function(data) {
			userData['minorityArr'] = data;
		});
		ajaxLoadPageContent(findXL, function(data) {
			userData['educationArr'] = data;
		});
		ajaxLoadPageContent(findHY, function(data) {
			userData['maritalArr'] = data;
		});
		ajaxLoadPageContent(findRYFL, function(data) {
			userData['ryflArr'] = data;
		});
		ajaxLoadPageContent(findRYBZ, function(data) {
			userData['rybzArr'] = data;
		});
		ajaxLoadPageContent(findZY, function(data) {
			userData['zyflArr'] = data;
		});
		ajaxLoadPageContent(findZZ, function(data) {
			userData['zzztArr'] = data;
		});
		ajaxLoadPageContent(findXZ, function(data) {
			userData['xzzwArr'] = data;
		});
		ajaxLoadPageContent(findZW, function(data) {
			userData['zwjbArr'] = data;
		});
	}

	/**
	 * 异步请求支部数据
	 */
	function ajaxDeptLoad() {
		ajaxLoadPageContent(findPT, function(data) {
			userData['partyTypeArr'] = data;
		});
	}

	/**
	 * 异步请求 
	 * @param {Object} path  接口
	 * @param {Object} callback  回调方法
	 */
	function ajaxLoadPageContent(path, callback) {
		app.ajaxLoadPageContent(path, {

		}, function(data) {
			callback(data.data);
		}, {
			async: false,
		});
	}

	//初始化日历
	function addCalendar(contentID) {
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd',
			closeOnSelect: true,
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