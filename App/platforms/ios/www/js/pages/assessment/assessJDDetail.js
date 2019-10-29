define(['app',
	'hbs!js/hbs/rankDetail'
], function(app, JDDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取考核清单得分明细
	var findCompOfReportDetialPath = app.basePath + 'statHelper/findCompOfReportDetial';
	var queryData = '';
	var title = '';
	var topicId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('assessment/assessJDDetail', [
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
				handleData(queryData, false);
			}
		});
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		//		attrDefine(page);
		//		clickEvent(page);
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
		queryData = '';
		title = pageData.title;
		topicId = pageData.topicId;
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(findCompOfReportDetialPath, {
			topicId: topicId,
			page: pageNo,
			limit: 10,
		}, function(result) {
			var data = result.data;
			console.log(data);
			$$.each(data, function(index, item) {
				item.topicTitle = title;
				item.isUserName = 1;
			});
			queryData = data;
			handleData(data, isLoadMore);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleData(data, isLoadMore) {
		if(data) {
			if(isLoadMore) {
				$$('.JDDList ul').append(JDDetailTemplate(data));
			} else {
				$$('.JDDList ul').html(JDDetailTemplate(data));
			}
			$$('.JDDList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				var memo = $$(this).data('memo') || "";
				var reportState = $$(this).data('reportState') || 1;
				app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState + '&userName=' + userName);
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
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