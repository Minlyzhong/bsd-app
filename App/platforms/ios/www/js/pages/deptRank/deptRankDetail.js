define(['app',
	'hbs!js/hbs/rankDetail'
], function(app, empDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//支部考核接口
	var deptRankInfoPath = app.basePath + '/mobile/partyAm/loadDeptDetial';
	var deptId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('deptRank/deptRankDetail', [
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
		deptId = pageData.deptId;
		loadRankInfo(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleRankInfo(pageDataStorage['rankInfo'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.deptRD .pageTitle').html(page.query.title);
	}

	/**
	 * 获取人员考核信息
	 */
	function loadRankInfo(isLoadMore) {
		app.ajaxLoadPageContent(deptRankInfoPath, {
			deptId: deptId,
			current: pageNo
		}, function(data) {
			var data = data.data.records;
			$$.each(data, function(index, item){
				item.reportTime = item.reportTime.split(' ')[0];
			})
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['rankInfo'] = pageDataStorage['rankInfo'].concat(data);
			} else {
				pageDataStorage['rankInfo'] = data;
			}
			handleRankInfo(data, isLoadMore);
		});
	}

	/**
	 * 加载人员考核信息 
	 * @param {Object} data
	 */
	function handleRankInfo(data, isLoadMore) {
		if(data.length > 0) {
			if(isLoadMore) {
				$$('.deptRankDetailList ul').append(empDetailTemplate(data));	
			} else {
				$$('.deptRankDetailList ul').html(empDetailTemplate(data));
			}
			$$('.deptRankDetailList .rankDetail-content').off('click', rankInfoClick);
			$$('.deptRankDetailList .rankDetail-content').on('click', rankInfoClick);
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	function rankInfoClick() {
		var id = $$(this).data('id');
		var userName = $$(this).data('userName');
		var score = $$(this).find('.rankDetailScore').html();
		var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
		var name = $$(this).find('.rankDetailName').html().split("：")[1];
		var khType = $$(this).data('khType');
		app.myApp.getCurrentView().loadPage('rankAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&reportState=0&userName=' + userName+'&khType=' + khType);
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
			loadRankInfo(true);
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