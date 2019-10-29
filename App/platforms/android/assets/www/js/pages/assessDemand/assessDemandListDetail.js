define(['app',
	'hbs!js/hbs/assessDemandPaperDetail'
], function(app, listDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//考核查询部门明细
	var loadListDetailPath = app.basePath + 'queryKnowledge/findDeptDetial';
	//考核查询考核项/考核清单明细
	var loadUserDetailPath = app.basePath + 'queryKnowledge/findUserDetial';
	var deptId = 0;
	var tpId = 0;
	var topicId = 0;
	var begin = '';
	var end = '';
	var userId = '';
	var isUser = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessDemand/assessDemandListDetail', [
//			'rank/rankAssessDetail'
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
		userId = parseInt(pageData.userId);
		isUser = parseInt(pageData.isUser);
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleList(pageDataStorage['listDetail'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.assessDLD .pageTitle').html(page.query.title);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		var loadPath = '';
		if(isUser) {
			loadPath = loadUserDetailPath;
		} else {
			loadPath = loadListDetailPath;
		}
		console.log(deptId);
		app.ajaxLoadPageContent(loadPath, {
			startTime: begin,
			endTime: end,
			deptId: deptId,
			testpaperId: tpId,
			topicId: topicId,
			pageNo: pageNo,
			userId: userId,
		}, function(data) {
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['listDetail'] = pageDataStorage['listDetail'].concat(data);
			} else {
				pageDataStorage['listDetail'] = data;
			}
			handleList(data, isLoadMore);
		});
	}

	function handleList(data, isLoadMore) {
		if(data) {
			if(isLoadMore) {
				$$('.demandListDetail ul').append(listDetailTemplate(data));
			} else {
				$$('.demandListDetail ul').html(listDetailTemplate(data));
			}
			$$('.demandListDetail .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				var memo = "";
				var reportState = 0;
				app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title +
					'&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState +
					'&userName=' + userName);
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