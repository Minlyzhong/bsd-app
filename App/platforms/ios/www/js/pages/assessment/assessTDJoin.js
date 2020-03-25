define(['app',
	'hbs!js/hbs/assessmentTDJoin'
], function(app, tdjTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取已参与的党支部名单
	var findCompletionOfPartyPath = app.basePath + '/mobile/partyAm/findCompletionOfParty';
	var topicId = 0;
	var deptId = 0;
	var startDate = '';
	var endDate = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessTDJoin', [
//			'assessment/assessTDJDetail'
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
		topicId = pageData.topicId;
		deptId = pageData.deptId;
		startDate = pageData.startDate;
		endDate = pageData.endDate;
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleParty(pageDataStorage['party'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		var head = page.query.head;
		var rege = new RegExp("equal", "g"); //g,表示全部替换。
		$$('.atdjHead').html(head.replace(rege, '='));
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(findCompletionOfPartyPath, {
			deptId: deptId,
			knowledgePaperId: topicId,
			type: 1,
			current: pageNo,
			size: 20,
		}, function(data) {
			var result = data.data.records;
			console.log(result);
			if(isLoadMore) {
				pageDataStorage['party'] = pageDataStorage['party'].concat(result);
			} else {
				pageDataStorage['party'] = result;
			}
			handleParty(result, isLoadMore);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleParty(result, isLoadMore) {
		if(result) {
			if(isLoadMore) {
				$$('.atdjList ul').append(tdjTemplate(result));
			} else {
				$$('.atdjList ul').html(tdjTemplate(result));
			}
			loading = false;
			$$('.atdjList .item-content').off('click', loadPage);
			$$('.atdjList .item-content').on('click', loadPage);
			// console.log(result.length)
			// if(result.length == 10) {
				
			// }
		}
		console.log(loading)
	}
	
	/**
	 * 页面跳转 
	 * @param {Object} type
	 */
	function loadPage() {
		var regn = new RegExp("\n", "g"); //g,表示全部替换。
		var regt = new RegExp("\t", "g"); //g,表示全部替换。
		var rege = new RegExp("=", "g"); //g,表示全部替换。
		var head = $$('.atdjHead').html();
		head = head.replace(regn, '').replace(regt, '').replace(rege, 'equal');
		var name = $$(this).data('name');
		var id = $$(this).data('id');
		app.myApp.getCurrentView().loadPage('assessTDJDetail.html?head=' + head + '&id=' + id + '&name=' + name + '&deptId=' + deptId + '&topicId=' + topicId+'&startDate='+startDate+'&endDate='+endDate);
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			console.log(loading);
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