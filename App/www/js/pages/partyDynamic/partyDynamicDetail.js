define(['app',
	'hbs!js/hbs/partyDynamicWorkLog',
	'hbs!js/hbs/partyDynamicAssessment'
], function(app, workLogTemplate, assessmentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//工作简报查询日志详情  按照周月季度查询
	var loadDymicMessageLogPath = app.basePath + '/mobile/partyAm/loadDymicMessageLogByDate';
	//var loadDymicMessageLogPath = app.basePath + 'dynamic/loadDymicMessageLog';
	//工作简报查询考核详情  按照周月季度查询
	var loadDymicMessageAssessPath = app.basePath + '/mobile/partyAm/loadDymicMessageAssessmentByDate';
	//var loadDymicMessageAssessPath = app.basePath + 'dynamic/loadDymicMessageAssessment';
	var deptId = 0;
	var dateType = 0;
	var loadPath = '';
	var loadType = 0;
	
	var startDate = '';
	var endDate = '';
	var params = {};

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('partyDynamic/partyDynamicDetail', [
//			'rank/rankAssessDetail',
//			'record/recordDetail'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
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
		deptId = pageData.deptId;
		dateType = pageData.dateType;
		datekhpl = pageData.khpl;
		startDate = pageData.startDate;
		endDate = pageData.endDate;

		params = {};
		console.log(pageData);
		if(pageData.detailType == 'workLog') {
			console.log(loadDymicMessageLogPath);
			loadPath = loadDymicMessageLogPath;
			loadType = 0;
			params = {
				// dateType: dateType,
				deptId: deptId,
				current: pageNo,
				startDate:startDate,
				endDate:endDate,
			}

		} else if(pageData.detailType == 'assessment') {
			console.log(loadDymicMessageLogPath);
			loadPath = loadDymicMessageAssessPath;
			loadType = 1;
			params = {
				khpl: datekhpl,
				deptId: deptId,
				current: pageNo,
				startDate:startDate,
				endDate:endDate,
			}
		}
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleContent(pageDataStorage['data'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.dynamicDetailCenter').html(page.query.deptName);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isloadMore) {
		console.log(startDate);
		console.log(endDate);
		app.ajaxLoadPageContent(loadPath,params , function(data) {
			var data = data.data.records;
			console.log(data);
			if(isloadMore) {
				pageDataStorage['data'] = pageDataStorage['data'].concat(data);
			} else {
				pageDataStorage['data'] = data;
			}
			handleContent(data, isloadMore);
		});
	}

	/**
	 * 加载数据 
	 * @param {Object} data
	 */
	function handleContent(data, isLoadMore) {
		if(data) {
			if(isLoadMore) {
				if(loadType) {
					$$('.dynamicDetailList ul').append(assessmentTemplate(data));
				} else {
					$$('.dynamicDetailList ul').append(workLogTemplate(data));
				}
			} else {
				if(loadType) {
					console.log(assessmentTemplate)
					$$('.dynamicDetailList ul').html(assessmentTemplate(data));
				} else {
					console.log(workLogTemplate)
					$$('.dynamicDetailList ul').html(workLogTemplate(data));
				}
			}
			$$('.dynamicDetailList .item-content').on('click', contentClick);
			if(data.length == 20) {
				loading = false;
			}
		} else {
			
		}
	}

	/**
	 * 列表点击事件  
	 */
	function contentClick() {
		if(loadType) {
			var id = $$(this).data('id');
			var userName = $$(this).data('userName');
			var deptName = $$(this).data('deptName');
			var score = $$(this).data('score');
			var title = $$(this).data('title');
			var name = $$(this).find('.reportName').html();
			var memo = $$(this).data('memo') || "";
			var reportState = 0;
			app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState +'&deptName=' + deptName + '&userName=' + userName);
		} else {
			var recordId = $$(this).data('id');
			var userId = $$(this).data('userId');
			var state = -1;
			var reviewName = $$(this).data('userName');
			var workType = $$(this).data('logType');
			console.log(userId);
			console.log(workType);
			app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName);
		}
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			ajaxLoadContent(true);
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