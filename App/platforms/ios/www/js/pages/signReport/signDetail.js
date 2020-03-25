define(['app',
	'hbs!js/hbs/signDetail'
], function(app, signDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var resultData = [];
	var title = '';
	var signType ='';
	var peopleType ='';
	var result = [];
	//查看正常打卡人员、出差人员、请假人员
	var getTypePeoplePath = app.basePath + '/mobile/sign/register/statistics/detail/';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('signReport/signDetail', [
//			'signReport/signPeople',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		// clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		console.log(pageData)
		signType = pageData.signType;
		peopleType = pageData.peopleType;

		result = [];
		if(peopleType =='good'){
			peopleType = 1
		}else if(peopleType =='late'){
			peopleType = 2
		}else{
			peopleType = 0
		}

		title = pageData.title.trim();
		if(title != '正常打卡') {
			title = title.substring(0, 2);
		}
		resultData = [];
		handleDetail(title);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.signDetailList ul').html(signDetailTemplate(resultData));
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.signDetailTitle').html(title);
	}

	/**
	 * 点击事件
	 */
	// function clickEvent(page) {
	// 	$$('.signDetailContent').on('click', function() {
	// 		var id = parseInt($$(this).data('id'));
	// 		var clickable = 1;
	// 		var name = $$(this).data('name');
	// 		if(title == '缺勤') {
	// 			clickable = 0;
	// 		}
	// 		console.log(id);
	// 		console.log(name);
	// 		console.log(result);
	// 		var data = JSON.parse(result);
	// 		app.myApp.getCurrentView().loadPage('signPeople.html?item=' + JSON.stringify(data[id]) + '&name=' + name + '&clickable=' + clickable);
	// 	});
	// }

	
	/**
	 * 加载考勤明细 
	 * type统计周期类型：day是日统计, week是周统计, month是月统计
	 */
	function handleDetail(title) {

				app.ajaxLoadPageContent1(getTypePeoplePath + app.user.deptId+'/'+signType,{
					// date:signDate,
					// userId:app.userId,
					// deptId:app.user.deptId,
					// roleId:app.roleId,

					code:peopleType,
					
					// peopleType:peopleType,
				},function(data){
					
					result = data.data.records;
					console.log(result);
					if(result && result.length>0){
						$$.each(result, function(index,item) {
							var peopleObj = {};
							peopleObj.id = item.userId;
							peopleObj.name = item.username;
							peopleObj.title = title + '次数';
							peopleObj.count = item.count;
							resultData.push(peopleObj);
						});

					console.log(resultData);
						
					$$('.signDetailList ul').html(signDetailTemplate(resultData));
						
					
						$$('.signDetailContent').on('click', function() {
							var id = parseInt($$(this).data('id'));
							var clickable = 1;
							var name = $$(this).data('name');
							if(title == '缺勤') {
								clickable = 0;
							}
							console.log(id);
							console.log(name);
							console.log(result);
							var data = result;
							app.myApp.getCurrentView().loadPage('signPeople.html?item=' + JSON.stringify(data) + '&name=' + name + '&clickable=' + clickable+ '&peopleType=' + peopleType + '&signType=' + signType + '&id=' + id);
						});
					}else{}
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