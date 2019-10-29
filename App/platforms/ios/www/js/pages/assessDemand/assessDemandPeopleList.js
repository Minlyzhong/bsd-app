define(['app',
	'hbs!js/hbs/assessDemandPeople'
], function(app, peopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//参与考核人数
	var loadPeopleDetialPath = app.basePath + 'queryKnowledge/loadPeopleDetial';
	var deptId = 0;
	var tpId = 0;
	var topicId = 0;
	var begin = '';
	var end = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessDemand/assessDemandPeopleList', [
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
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handlePeople(pageDataStorage['people'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.asssessDP .pageTitle').html(page.query.deptName);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(loadPeopleDetialPath, {
			startTime: begin,
			endTime: end,
			deptId: deptId,
			testpaperId: tpId,
			topicId: topicId,
			pageNo: pageNo,
		}, function(data) {
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['people'] = pageDataStorage['people'].concat(data);
			} else {
				pageDataStorage['people'] = data;
			}
			handlePeople(data, isLoadMore);
		});
	}

	/**
	 * 处理人员信息 
	 */
	function handlePeople(data, isLoadMore) {
		if(data) {
			$$.each(data, function(_, item) {
				item.basePath = app.basePath;
			});
			if(isLoadMore) {
				$$('.demandPeopleList ul').append(peopleTemplate(data));
			} else {
				$$('.demandPeopleList ul').html(peopleTemplate(data));
			}
			$$('.demandPeopleList .item-content').on('click', function() {
				var title = $$(this).data('name');
				var userId = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('assessDemandListDetail.html?&deptId=' + deptId +
					'&begin=' + begin + '&end=' + end + '&tpId=' + tpId +
					'&topicId=' + topicId + '&title=' + title + '&userId=' + userId + '&isUser=1');
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