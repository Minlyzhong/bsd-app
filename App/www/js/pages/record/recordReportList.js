define(['app',
	'hbs!js/hbs/recordCard'
], function(app, recordCardTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载统计详情
	var findLogReportListPath = app.basePath + '/mobile/worklog/statistics/';
	var query = '';
	var reportType = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('record/recordReportList', [
//			'record/recordReportDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
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
		pageNo = 1;
		loading = false;
		query = '';
		reportType = pageData.type;
		console.log(reportType);
		findLogReportList(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleLogReportList(pageDataStorage['logReportList'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.center').html('工作日志' + page.query.type + '统计');
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		
		$$('.recordSearchOpen2').on('click', recordSearchOpenPage);
		$$('.recordSearchClose').on('click', recordSearchClose);
		$$('.searchBtn').on('click', function() {
			query = $$('#logName').val();
			recordSearchClose();
			pageNo = 1;
			loading = true;
			findLogReportList(false);
		});
		$$('.resetBtn').on('click', function() {
			$$('#logName').val('');
		});
		
	}

	/**
	 * 打开搜索框
	 */
	function recordSearchOpenPage() {
		console.log('recordSearchOpen');
		$$('.recordSearch').css('display', 'block');
	}

	/**
	 * 关闭搜索框 
	 */
	function recordSearchClose() {
		$$('.recordSearch').css('display', 'none');
	}

	/**
	 *   获取统计详情
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function findLogReportList(isLoadMore) {
		var typeDic = {
			'天': 'day',
			'周': 'week',
			'月': 'month',
			'年': 'year',
		};
		var type = typeDic[reportType];
		app.ajaxLoadPageContent(findLogReportListPath+app.userId+'/'+type, {
			// userId: app.userId,
			// reportType: type,
			pageNo: pageNo,
			// query: query,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['logReportList'] = pageDataStorage['logReportList'].concat(data);
			} else {
				pageDataStorage['logReportList'] = data;
			}
			handleLogReportList(data, isLoadMore);
		});
	}

	/**
	 *  加载统计详情
	 */
	function handleLogReportList(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.recordList').append(recordCardTemplate(data));
			} else {
				$$('.recordList').html(recordCardTemplate(data));
			}
			$$('.recordCard').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		app.myApp.getCurrentView().loadPage('recordReportDetail.html?id=' + $$(this).data('id')+'&logTypeId='+ $$(this).data('logTypeId'));
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			recordSearchClose();
			pageNo = 1;
			loading = true;
			setTimeout(function() {
				findLogReportList(false);
				app.myApp.pullToRefreshDone();
			}, 1000);
		});

		//上拉加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			recordSearchClose();
			if(loading) return;
			loading = true;
			pageNo += 1;
			findLogReportList(true);
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