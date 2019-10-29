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
	//查询日志信箱未审阅条数
	var findLogNotReviewSumPath = app.basePath + 'extWorkLog/findLogNotReviewSum';
	//读取日志类型
	var loadDictPath = app.basePath + 'extWorkLog/loadDict';
	var loadType = 0;
	var pickChoose = 'myRecordPick';
	var query = '';
	var endTime = '';
	var startTime = '';
	var calendarEnd = '';
	var calendarStart = '';
	var recordId = '';
	var logTypeId = 0;
	var userName = ''
	var chooseLogType = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('record/record', [
			'record/recordDetail',
//			'record/recordNew',
//			'record/recordReport'
		]);
		//		var recordNewCB = app.myApp.onPageBack('recordNew', function(backPage) {
		//			findLogNotReviewSum();
		//		});
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
		loadType = 0;
		pickChoose = 'myRecordPick';
		query = '';
		startTime = '';
		logTypeId = 0;
		userName = '';
		endTime = '';
		calendarEnd = '';
		calendarStart = '';
		findLogNotReviewSum();
		loadRecord(false);
	//loadDict(); 
		handleDict();
	}
	
	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.recordBadge').html(pageDataStorage['recordBadge']);
		handleRecord(pageDataStorage['record'], false);
	}
	
	/**
	 *  查看日志类型
	 */
//	function loadDict() {
//		app.ajaxLoadPageContent(loadDictPath, {
//			dictCode: 'RZLX',
//		}, function(result) {
//			var data = result;
//			console.log(data);
//			handleDict(data)
//		});
//	}
	/**
	 *  加载日志类型
	 */
	function handleDict() {
//		$$.each(data, function(index, item) {
//			var selected = '';
//			if(chooseLogType == item.key) {
//				selected = 'selected';
//			}
			/*
			 * 0：党员活动，1：工作日志
			 */
			//console.log("<option value='" + 0 + "'" + selected + ">" + 党员活动 + "</option>");
//			$("#logTypeId").append("<option value='" + item.key + "'" + selected + ">" + item.value + "</option>");
			$("#logTypeId").append("<option value='0' selected>党员活动 </option>");
			$("#logTypeId").append("<option value='1'>工作日志 </option>");
//		});
		$$('#logTypeId').change(function() {
			//var typeVal = $$('#recordType').val();
//			if(chooseLogType != typeVal) {
//				chooseLogType = typeVal;
//				$$('#recordSend').val("");
//				deptList = [];
//				leaderList = [];
//				//app.myApp.alert('温馨提示<br />更换"日志类型"，会清空"接收方"内容');
//			}
		});
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.recordBtnRow').find('a').on('click', function() {
			$$('.recordBtnRow').find('a').removeClass('active');
			$$(this).addClass('active');
			if(pickChoose != $$(this).data('type')) {
				if($$(this).data('type') == 'otherRecordPick'){
					$$('.logTypeId').css('display','block');
					$$('.userName').css('display','block');
					$$('.recordSearch').css('height','330px');
				}else{
					$$('.logTypeId').css('display','none');
					$$('.userName').css('display','none');
					$$('.recordSearch').css('height','255px');
				}
				pickChoose = $$(this).data('type');
				loadType = $$(this).data('load');
				console.log(loadType)
				pageNo = 1;
				loadRecord(false);
			}
		});
		$$('#recordSearchOpen').on('click', recordSearchOpen);
		$$('.recordSearchClose').on('click', recordSearchClose);
		$$('.searchBtn').on('click', function() {
			query = $$('#logName').val();
			startTime = $$('#beginDate').val();
			endTime = $$('#finishDate').val();
			userName = $$('#userName').val();
			logTypeId = $$('#logTypeId').val();
			console.log(logTypeId);
			console.log(userName);
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
			$$('#userName').val('');
			//$$('#logTypeId').val('');
		});
		$$('.recordMenu').on('click', function() {
			var clickedLink = this;
			var popoverHTML = '<div class="popover" style="width: 40%;">' +
				'<div class="popover-inner">' +
				'<div class="list-block recordPopover">' +
				'<ul>' +
				'<li><a href="#" class="newRecord"><i class="icon icon-plan-25" style="margin-right: 5%;"></i>新建日志</a></li>' +
				'<li><a href="#" class="recordReport"><i class="icon icon-count"  style="margin-right: 5%;"></i>日志统计</a></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>'
			var popover = app.myApp.popover(popoverHTML, clickedLink);
			$$('.recordPopover li a').on('click', function() {
				app.myApp.closeModal(popover);
			});
			$$('.newRecord').on('click', newRecord);
			$$('.recordReport').on('click', recordReport);
		});
		$$('.newRecord').on('click', newRecord);
	}

	/**
	 *  查询日志信箱未审阅条数
	 */
	function findLogNotReviewSum() {
		app.ajaxLoadPageContent(findLogNotReviewSumPath, {
			userId: app.userId,
		}, function(result) {
			var data = result;
			console.log(data);
			$$('.recordBadge').html(data.sum);
			pageDataStorage['recordBadge'] = data.sum;
		});
	}

	/**
	 *  读取工作日志 
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function loadRecord(isLoadMore) {
		console.log(loadType);
		console.log(logTypeId);
		app.ajaxLoadPageContent(loadLogPath, {
			userId: app.userId,
			pageNo: pageNo,
			loadType: loadType,
			logTitle: query,
			userName : userName,
			logTypeId :logTypeId,
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
		$$('.recordNotFound').hide();
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
				$$('.recordNotFound').show();
			}
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		recordId = $$(this).data('id');
		var loadTypeId = parseInt($$(this).data('loadTypeId'));
		var userId = 0;
		var state = -1;
		var reviewName = app.user.userName;
		var workType = $$(this).find('.workType').html().split('：')[1].trim();
		if(loadTypeId) {
			userId = $$(this).data('userId');
			state = $$(this).data('state');
			if(state == 0) {
				$$(this).find('.reviewState').html('<div class="reviewed">已审阅</div>');
				$$('.recordBadge').html(parseInt($$('.recordBadge').html()) - 1);
				require(['js/pages/appList/appList'], function(app) {
					app.setRecordBadge();
				})
			}
			reviewName = $$(this).find('.sendName').html().trim();
			console.log(userId + '-' + state + '-' + reviewName);
		}
		app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName);
	}

	/**
	 * 新建工作日志 
	 */
	function newRecord() {
		recordSearchClose();
		app.myApp.getCurrentView().loadPage('recordNew.html');
	}

	/**
	 * 工作日志统计 
	 */
	function recordReport() {
		recordSearchClose();
		app.myApp.getCurrentView().loadPage('recordReport.html');
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
		loadRecord: loadRecord,
		resetFirstIn: resetFirstIn,
	}
});