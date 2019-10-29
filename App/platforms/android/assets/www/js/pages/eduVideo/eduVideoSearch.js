define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('eduVideo/eduVideoSearch', [

		]);
		if(firstIn) {
			initData(page.query);
		} else {
			loadStorage();
		}
		attrDefine(page);
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
		ajaxLoadContent();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.pageTitle').html(page.query.appName);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.videoSearchCancel').on('click', backPage);
		$$('#videoSearch').on('focus', searchFocus);
		$$('.videoSearchBar .clear').on('click', clearSearch);
		$("#videoSearch").keydown(function(event) {
			event.preventDefault();
			if(event.which == 13) {
				
			}
		});
	}

	/**
	 * 页面返回 
	 */
	function backPage() {
		app.myApp.getCurrentView().back();
	}

	/**
	 * 输入监听
	 */
	function searchFocus() {
		$$('.videoSearchBar .clear').css({
			opacity: '1',
			pointerEvents: 'auto'
		});
	}

	/**
	 * 清空搜索 
	 */
	function clearSearch() {
		$$('#videoSearch').val('').focus();
	}

	/**
	 * 异步请求页面数据
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent('UrlPath', {

		}, function(data) {
			console.log(data);
		});
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