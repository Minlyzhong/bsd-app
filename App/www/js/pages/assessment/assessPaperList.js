define(['app',
	'hbs!js/hbs/assessmentPaperList'
], function(app, listTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载考核项对应的考核清单
	var loadPaperPath = app.basePath + '/mobile/partyAm/loadPaperByTopicId';
	var deptId = 0;
	var topicId = 0;
	var startDate = '';
	var endDate = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessPaperList', [
//			'rank/rankAssessDetail',
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
		topicId = pageData.topicId;
		startDate = pageData.startDate;
		endDate = pageData.endDate;
		console.log(startDate);
		console.log(endDate);
		loadPaper(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handlePaper(pageDataStorage['paper'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.paperListTitle').html(page.query.name);
	}

	/**
	 *  个人考核明细
	 */
	function loadPaper(isLoadMore) {
		console.log(startDate);
		console.log(endDate);
		app.ajaxLoadPageContent(loadPaperPath, {
			deptId: deptId,
			testPaperId: topicId,
			current: pageNo,
			startDate:startDate,
			endDate:endDate,
		}, function(result) {
			var data = result.data.records;
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['paper'] = pageDataStorage['paper'].concat(data);
			} else {
				pageDataStorage['paper'] = data;
			}
			handlePaper(data, isLoadMore);
		});
	}

	/**
	 *  加载个人考核明细
	 * @param {Object} data
	 */
	function handlePaper(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.assessPaperList ul').append(listTemplate(data));
			} else {
				$$('.assessPaperList ul').html(listTemplate(data));
			}
			$$('.assessPaperListContent').on('click', function() {
				var id = $$(this).data("id");
				var userName = $$(this).data('userName');
				var title = $$('.rankDetailTitle').html().split("：")[1];
				var name = $$('.rankDetailName').html().split("：")[1];
				var score = $$('.rankDetailScore').html();
				app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&reportState=0&userName=' + userName);
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
			loadPaper(true);
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