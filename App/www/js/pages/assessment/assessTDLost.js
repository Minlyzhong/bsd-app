define(['app',
	'hbs!js/hbs/assessmentTDLost'
], function(app, tdjTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取未参与的党支部名单
	var findCompletionOfPartyPath = app.basePath + '/mobile/partyAm/findCompletionOfParty';
	var topicId = 0;
	var deptId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessTDLost', [
//
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
		$$('.atdlHead').html(head.replace(rege, '='));
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(findCompletionOfPartyPath, {
			deptId: deptId,
			knowledgePaperId: topicId,
			type: 0,
			current: pageNo,
			size: 20,
		}, function(data) {
			var result = data.data.records;
			console.log(result);
			pageDataStorage['party'] = result;
			handleParty(result, isLoadMore);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleParty(result, isLoadMore) {
		if(result) {
			// if(result.length == 10) {
				loading = false;
			// }
			if(isLoadMore) {
				$$('.atdlList ul').append(tdjTemplate(result));
			} else {
				$$('.atdlList ul').html(tdjTemplate(result));
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