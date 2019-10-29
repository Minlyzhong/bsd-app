define(['app',
	'hbs!js/hbs/assessDemandDetail',
	'hbs!js/hbs/assessDemandPaper'
], function(app, detailTemplate, paperTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//考核详情
	var loadAssessDetailPath = app.basePath + 'queryKnowledge/loadPointDetial';
	var deptId = 0;
	var tpId = 0;
	var topicId = 0;
	var begin = '';
	var end = '';
	var isCount = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessDemand/assessDemandDetail', [
//			'assessment/assessPaperList',
//			'assessDemand/assessDemandListDetail'
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
		deptId = parseInt(pageData.deptId);
		begin = pageData.begin;
		end = pageData.end;
		tpId = parseInt(pageData.tpId);
		topicId = parseInt(pageData.topicId);
		isCount = parseInt(pageData.isCount);
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleDetail(pageDataStorage['detail'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.assessDD .pageTitle').html(page.query.deptName);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(loadAssessDetailPath, {
			startTime: begin,
			endTime: end,
			deptId: deptId,
			testpaperId: tpId,
			topicId: topicId,
			pageNo: pageNo,
		}, function(data) {
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['detail'] = pageDataStorage['detail'].concat(data);
			} else {
				pageDataStorage['detail'] = data;
			}
			handleDetail(data, isLoadMore);
		});
	}

	/**
	 * 处理考核信息 
	 */
	function handleDetail(data, isLoadMore) {
		if(data) {
			if(tpId) {
				if(isLoadMore) {
					$$('.demandAssessList ul').append(paperTemplate(data));
				} else {
					$$('.demandAssessList ul').html(paperTemplate(data));
				}
				$$('.demandAssessList .item-content').on('click', function() {
					var _topicId = $$(this).data('id');
					var title = $$(this).data('name');
					app.myApp.getCurrentView().loadPage('assessDemandListDetail.html?&deptId=' + deptId +
						'&begin=' + begin + '&end=' + end + '&tpId=' + tpId +
						'&topicId=' + _topicId + '&title=' + title + '&isUser=0' + '&userId=0');
					});
			} else {
				$$.each(data, function(_, item) {
					if(isCount) {
						item.countDetail = 1;
					} else {
						item.pointDetail = 1;
					}
				});
				if(isLoadMore) {
					$$('.demandAssessList ul').append(detailTemplate(data));
				} else {
					$$('.demandAssessList ul').html(detailTemplate(data));
				}
				$$('.demandAssessList .item-content').on('click', function() {
					var title = $$(this).data('name');
					var _tpId = $$(this).data('id');
					app.myApp.getCurrentView().loadPage('assessDemandListDetail.html?&deptId=' + deptId +
						'&begin=' + begin + '&end=' + end + '&tpId=' + _tpId +
						'&topicId=' + topicId + '&title=' + title + '&isUser=0' + '&userId=0');
				});
			}
			if(data.length == 10) {
				loading = false;
			}
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