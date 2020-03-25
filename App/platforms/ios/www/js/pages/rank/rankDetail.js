define(['app',
	'hbs!js/hbs/rankDetail'
], function(app, rankDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//个人考核明细接口
	var rankInfoPath = app.basePath + '/mobile/partyAm/partySpecialResultByMonthAndUserId';
	var queryData = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('rank/rankDetail', [
			'rank/rankAssessDetail',
		]);
		var rankAssessDetailCB = app.myApp.onPageBack('rank/rankAssessDetail', function(backPage) {
			if($$(backPage.container).find('.rankSumbit').html() == '已保存') {
				var reportTitle = $$(backPage.container).find('#assessTitle').val();
				var topicTitle = $$(backPage.container).find('#assessContent').val();
				var reportTs = $$(backPage.container).find('#assessTs').val();
				var id = backPage.query.assessId;
				$$.each(queryData, function(index, item) {
					if(item.id == id) {
						item.reportState = 0;
						item.reportTitle = reportTitle;
						item.topicTitle = topicTitle;
						item.reportTs = reportTs;
					}
				});
				handleRankInfo(queryData);
			}
		});
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		queryData = '';
		loadRankInfo();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleRankInfo(pageDataStorage['rankInfo']);
	}

	/**
	 * 加载个人考核明细
	 */
	function loadRankInfo() {
		app.ajaxLoadPageContent(rankInfoPath, {
			userId: app.userId
		}, function(data) {
			if(data.data && data.data.length > 0) {
				console.log(data);
				queryData = data.data.records;
				handleRankInfo(data.data.records);
				pageDataStorage['rankInfo'] = data.data.records;
			}
		});
	}

	/**
	 * 初始化数据 
	 * @param {Object} data  数据数组
	 */
	function handleRankInfo(data) {
		$$('.rankDetailList ul').html(rankDetailTemplate(data));
		$$('.rankDetail-content').on('click', function() {
			var id = $$(this).data('id');
			var userName = app.user.userName;
			var score = $$(this).find('.rankDetailScore').html();
			var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
			var name = $$(this).find('.rankDetailName').html().split("：")[1];
			var memo = $$(this).data('memo') || "";
			var reportState = $$(this).data('reportState');
			app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState + '&userName=' + userName);
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