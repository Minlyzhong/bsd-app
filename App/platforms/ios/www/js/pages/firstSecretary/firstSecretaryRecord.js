define(['app',
	'hbs!js/hbs/recordCard'
], function(app, recordCardTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载工作日志
	var loadLogPath = app.basePath + 'extWorkLog/checkOwnWorkLog';
	var userId = 0;
	var query = '';
	var endTime = '';
	var startTime = '';
	var calendarEnd = '';
	var calendarStart = '';
	var recordId = '';
	var userName = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('firstSecretary/firstSecretaryRecord', [
			'record/recordDetail',
		]);
		var recordDetailCB = app.myApp.onPageBack('record/recordDetail', function(backPage) {
			var backContainer = $$(backPage.container);
			$$.each($$('.recordCard'), function(index, item) {
				if($$(item).data('id') == recordId) {
					var likeLength = backContainer.find('.recLikeTotal').html();
					$$(item).find('.likeTotal').html(likeLength);
					var commentLength = backContainer.find('.recCommentTotal').html();
					$$(item).find('.commentTotal').html(commentLength);
				}
			});
		});
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
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
		query = '';
		startTime = '';
		endTime = '';
		calendarEnd = '';
		calendarStart = '';
		userId = pageData.userId;
		userName = pageData.userName;
		loadRecord(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleRecord(pageDataStorage['record'], false);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#recordSearchOpen').on('click', recordSearchOpen);
		$$('.recordSearchClose').on('click', recordSearchClose);
		$$('.searchBtn').on('click', function() {
			query = $$('#logName').val();
			startTime = $$('#beginDate').val();
			endTime = $$('#finishDate').val();
			recordSearchClose();
			calendarStart.destroy();
			calendarEnd.destroy();
			pageNo = 1;
			loading = true;
			loadRecord(false);
		});
		$$('.resetBtn').on('click', function() {
			$$('#logName').val('');
			$$('#beginDate').val('');
			$$('#finishDate').val('');
		});
	}

	/**
	 *  读取工作日志 
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function loadRecord(isLoadMore) {
		app.ajaxLoadPageContent(loadLogPath, {
			userId: userId,
			pageNo: pageNo,
			loadType: 0,
			logTitle: query,
			startDate: startTime,
			endDate: endTime,
		}, function(result) {
			var data = result;
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['record'] = pageDataStorage['record'].concat(data);
			} else {
				pageDataStorage['record'] = data;
			}
			handleRecord(data, isLoadMore);
		});
	}

	/**
	 * 加载工作日志
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
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
		} else {
			if(!isLoadMore) {
				$$('.recordList').html('');
			}
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		recordId = $$(this).data('id');
		var loadTypeId = $$(this).data('loadTypeId');
		var userId = 0;
		var state = -1;
		var reviewName = userName;
		var workType = $$(this).find('.workType').html().split('：')[1].trim();
		app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName);
	}

	/**
	 * 打开搜索框
	 */
	function recordSearchOpen() {
		calendarStart = app.myApp.calendar({
			input: '#beginDate',
			dateFormat: 'yyyy-mm-dd',
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			closeOnSelect: true
		});
		calendarEnd = app.myApp.calendar({
			input: '#finishDate',
			dateFormat: 'yyyy-mm-dd',
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			closeOnSelect: true
		});
		$$('.recordSearch').css('display', 'block');
	}

	/**
	 * 关闭搜索框 
	 */
	function recordSearchClose() {
		if(calendarStart) {
			calendarStart.destroy();
		}
		if(calendarEnd) {
			calendarEnd.destroy();
		}
		$$('.recordSearch').css('display', 'none');
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			recordSearchClose();
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadRecord(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			recordSearchClose();
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadRecord(true);
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