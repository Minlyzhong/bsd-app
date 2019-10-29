define(['app',
	'hbs!js/hbs/rankDetail'
], function(app, empDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//个人考核接口
	var rankInfoPath = app.basePath + 'knowledgeTestpaper/loadKnowledgeReportDetial';
	//考核责任项接口
	//var loadPartyMenuPath = app.basePath + 'knowledgeTestpaper/loadPartyMenu';
	var empId = 0;
	var userName = '';
	var startDate = '';
	var endDate = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessPeopleDetail', [
//			'rank/rankAssessDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		empId = pageData.empId;
		userName = pageData.name;
		startDate = pageData.startDate;
		endDate = pageData.endDate;
		loadRankInfo();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleRankInfo(pageDataStorage['rankInfo']);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.empDetailTitle').html(page.query.name);
	}

	/**
	 * 获取人员考核信息
	 */
	function loadRankInfo() {
		console.log(startDate);
		console.log(endDate);
		app.ajaxLoadPageContent(rankInfoPath, {
			userId: empId,
			startDate:startDate,
			endDate:endDate,
		}, function(data) {
			console.log(data);
			handleRankInfo(data);
			pageDataStorage['rankInfo'] = data;
		});
	}

	/**
	 * 加载人员考核信息 
	 * @param {Object} data
	 */
	function handleRankInfo(data) {
		if(data.data && data.data.length > 0) {
			var currentData = [];
			$$.each(data.data, function(index, item) {
				if(item.reportState == 0) {
					currentData.push(item);
				}
			});
			$$('.empDetailList ul').html(empDetailTemplate(currentData));
			$$('.rankDetail-content').on('click', function() {
				var id = $$(this).data('id');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&reportState=0&userName=' + userName);
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
		resetFirstIn: resetFirstIn,
	}
});