define(['app',
	'hbs!js/hbs/signDetail'
], function(app, signDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	//查看正常打卡人员、出差人员、请假人员 缺勤人员
	var getTypePeoplePath = app.basePath + '/mobile/sign/statistics/detail/';
	//查看缺勤人员
	// var absentPeoplePath = app.basePath + '/mobile/sign/statistics/detail/';
	//查询接口
	var signDetailSpecialPath;
	var pageNo = 1;
	var loading = true;
	var resultData = [];
	var title = '';
	var signDate;
	var signType;
	var peopleType;
	var resultSign;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		resultSign=[];
		title = pageData.title.trim();
		signDate = pageData.signDate;
		signType = pageData.signType;
		peopleType = pageData.peopleType;
		console.log('pageData')
		console.log(pageData)
		// if(peopleType == 4){
		// 	signDetailSpecialPath = absentPeoplePath;
		// }else{
		// 	signDetailSpecialPath = getTypePeoplePath;
		// }
		if(title != '正常打卡') {
			title = title.substring(0, 2);
		}
		resultData = [];
		//handleDetail(JSON.parse(pageData.item), title);
		handleDetail(title,false);
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
	function clickEvent(page) {
		
	}

	/**
	 * 加载考勤明细 
	 */
	function handleDetail(title,isLoadMore) {
//		console.log(signDate);
//		console.log(app.userId);
//		console.log(app.user.deptId);
//		console.log(app.roleId);
//		console.log(signType);
//		console.log(peopleType);
		app.ajaxLoadPageContent1(getTypePeoplePath+app.user.deptId+'/'+signType,{
			pageNo:pageNo,
			date:signDate,
			userId:app.userId,
			// deptId:app.user.deptId,
			// roleId:app.roleId,
			code:peopleType
			// type:signType,
			// peopleType:peopleType,
		},function(data){
			console.log(data);
			var result = data.data.records;
			resultSign = data.data;
			if(result && result.length>0){
				$.each(result, function(index,item) {
					var peopleObj = {};
					peopleObj.id = item.userId;
					peopleObj.name = item.username;
					peopleObj.title = title + '次数';
					peopleObj.count = item.count;
					resultData.push(peopleObj);
				});
				if(isLoadMore == true){
					$$('.signDetailList ul').append(signDetailTemplate(resultData));
				}else{
					$$('.signDetailList ul').html(signDetailTemplate(resultData));
				}
				loading = false;
				$$('.signDetailContent').on('click', function() {
					console.log('123');
					var userId = $$(this).data('id');			
					var userName = $$(this).data('name');
					app.myApp.getCurrentView().loadPage('signPeopleSpecial.html?userId=' + userId + '&userName=' + userName + '&signType=' + signType+'&peopleType='+peopleType+'&signDate='+signDate);
				});
			}else{}
		});
		
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
//		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
//		ptrContent.on('refresh', function(e) {
//			setTimeout(function() {
//				pageNo = 1;
//				loading = true;
//				$$('.signDetailList ul').html('');
//				//这里写请求
//				handleDetail(title,false);
//				app.myApp.pullToRefreshDone();
//			}, 500);
//		});

		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			handleDetail(title,true);
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