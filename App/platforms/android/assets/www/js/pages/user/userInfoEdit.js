define(['app',
	'hbs!js/hbs/userEdit',
	'hbs!js/hbs/userDeptEdit',
	'hbs!js/hbs/userInfo',
	'hbs!js/hbs/userDeptInfo'
], function(app, editTemplate, deptTemplate, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	
	//提交个人信息
	var saveEditPath = app.basePath + '/mobile/user';
	//提交支部信息
	var saveDeptPath = app.basePath + '/mobile/political/department';
	var userData = {};
	var departData = {};

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
		userData = Object.assign({},app.userDetail.partyUser);
		departData = Object.assign({},app.departDetail);
		console.log(userData)
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
		if(app.userType != 2) {
			ajaxDeptLoad();
			console.log(departData)
			
			$$('.editList ul').html(deptTemplate(departData));
		} else {
			ajaxUserLoad();
			if(app.userDetail.partyUser.partyTime){
				var time = app.userDetail.partyUser.partyTime.split(' ')[0];
				userData.partyTime = time;
			}
			if(app.userDetail.partyUser.birthday){
				var time1 = app.userDetail.partyUser.birthday.split(' ')[0];
				userData.birthday = time1;		
			}
			if(app.userDetail.partyUser.workTime){
				var time = app.userDetail.partyUser.workTime.split(' ')[0];
				userData.workTime = time;	
			}
			console.log(userData);
			$$('.editList ul').html(editTemplate(userData));
			addCalendar('partyTime');
			addCalendar('birthday');
			addCalendar('workTime');
		}
		app.myApp.hidePreloader();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.editSave').on('click', editSave);
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

		console.log(newData);
		
		
		if(app.userType != 2) {

			var params = app.departDetail;
			params.partyType = newData.partyType;
			console.log(params);
			
			var formDatas= JSON.stringify(params);

			$$.ajax({
				url:saveDeptPath,
				method: 'PUT',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (result) {
					if(result.data == true) {
						// console.log(app.userDetail);
						// app.userDetail.partyUser.partyType = newData.partyType;
						// localStorage.setItem('userDetail', JSON.stringify(app.userDetail));

						var html = $$($$('.userInfoList ul li')[0]).html();
						console.log(html)
						$$('.userInfoList ul').html('<li></li>');
						$$($$('.userInfoList ul li')[0]).html(html);

						var comeData = Object.assign({},app.userDetail);
						comeData['partyTypeArr'] = app.userArr.partyTypeArr;
						comeData['partyType'] = newData.partyType;

						$$('.userInfoList ul').append(deptInfoTemplate(comeData));
						require(['js/pages/user/userInfo'], function(userInfo) {
							userInfo.clickEvent();
						});
						app.myApp.getCurrentView().back();
					}else{
						app.myApp.alert('修改失败');
					}
				},
				error:function(){
					app.myApp.alert('修改失败');
				}
			})
				
		} else {

			var params = app.userDetail;
			var _partyUser = params.partyUser;
			$$.each(newData,function(item){
				if(_partyUser.hasOwnProperty(item)){
					_partyUser[item] = newData[item];
				}
			});

			_partyUser.partyTime=newData.partyTime.split(' ')[0]+' 00:00:00';
			_partyUser.birthday=newData.birthday.split(' ')[0]+' 00:00:00';
			_partyUser.workTime=newData.workTime.split(' ')[0]+' 00:00:00';	

			var formDatas= JSON.stringify(params)
			console.log(params);
			$$.ajax({
				url:saveEditPath,
				method: 'PUT',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (result) {
					if(result.data==true) {
										
						var time = app.userDetail.partyUser.partyTime.split(' ')[0];
						app.userDetail.partyUser.partyTime = time;
						var time1 = app.userDetail.partyUser.workTime.split(' ')[0];
						app.userDetail.partyUser.workTime = time1;
						var time2 = app.userDetail.partyUser.birthday.split(' ')[0];
						app.userDetail.partyUser.birthday = time2;

						console.log(app.userDetail);
						app.userDetail.partyUser = _partyUser;
						localStorage.setItem('userDetail', JSON.stringify(app.userDetail));
						var html = $$($$('.userInfoList ul li')[0]).html();
						console.log(html)	

						
						$$('.userInfoList ul').html('<li></li>');
						$$($$('.userInfoList ul li')[0]).html(html);
						var comeData = Object.assign({},_partyUser);
						
						comeData['sexArr'] = app.userArr.sexArr;
						comeData['politicsArr'] = app.userArr.politicsArr;	
						comeData['minorityArr'] = app.userArr.minorityArr;		
						comeData['educationArr'] = app.userArr.educationArr;	
						comeData['maritalArr'] = app.userArr.maritalArr;
						comeData['ryflArr'] = app.userArr.ryflArr;
						comeData['rybzArr'] = app.userArr.rybzArr;
						comeData['zyflArr'] = app.userArr.zyflArr;
						comeData['zzztArr'] = app.userArr.zzztArr;
						comeData['xzzwArr'] = app.userArr.xzzwArr;
						comeData['zwjbArr'] = app.userArr.zwjbArr;
						$$('.userInfoList ul').append(userInfoTemplate(comeData));
						require(['js/pages/user/userInfo'], function(userInfo) {
							userInfo.clickEvent();
						});
						app.myApp.getCurrentView().back();
					} else {
						app.myApp.alert('修改失败');
					}
					
				},
				error:function () {
					app.myApp.alert('修改失败');
				}
			});


			
		}
	}

	/**
	 * 异步请求用户数据 
	 */
	function ajaxUserLoad() {
			console.log(app.userArr);
			userData['sexArr'] = app.userArr.sexArr;
			userData['politicsArr'] = app.userArr.politicsArr;	
			userData['minorityArr'] = app.userArr.minorityArr;		
			userData['educationArr'] = app.userArr.educationArr;	
			userData['maritalArr'] = app.userArr.maritalArr;
			userData['ryflArr'] = app.userArr.ryflArr;
			userData['rybzArr'] = app.userArr.rybzArr;
			userData['zyflArr'] = app.userArr.zyflArr;
			userData['zzztArr'] = app.userArr.zzztArr;
			userData['xzzwArr'] = app.userArr.xzzwArr;
			userData['zwjbArr'] = app.userArr.zwjbArr;
		
	}
	

	/**
	 * 异步请求支部数据
	 */
	function ajaxDeptLoad() {
		
		departData['partyTypeArr'] = app.userArr.partyTypeArr;
		
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