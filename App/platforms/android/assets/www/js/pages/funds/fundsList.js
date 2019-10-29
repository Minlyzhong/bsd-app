define(['app','hbs!js/hbs/fundsList'], function(app,fundsListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageNo = 1;
	var loading = true;
	//查询申报历史
	var showHonorListPath = app.basePath + '/mobile/honor/list';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
		loadHonorList(false);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		count = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
		$$('.personalHonorTitle').html(pageData.appName);
	}
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.addFunds').click(function(){
			app.myApp.getCurrentView().loadPage('fundsAdd.html');
		});
	}
	/*
	 * 读取数据
	 */
	function loadHonorList(isLoadMore){
		app.ajaxLoadPageContent(showHonorListPath, {
			// userId: app.userId,
			pageNo: pageNo,
		}, function(result) {
			// var result = result.data.records.reverse();
			var honorDate = [{time:'2019-10-01', fundsName:'集体清洁', fee:'100'},{time:'2019-10-02', fundsName:'集体游玩', fee:'200'}];
			if(honorDate.length > 0){
				
			
				if(isLoadMore){
					$$('.fundsList ul').append(fundsListTemplate(honorDate));
					loading = false;
				}else{
					$$('.fundsList ul').html(fundsListTemplate(honorDate));
					loading = true;
				}
			}else{
				loading = true;
				$$('.fundsList ul').html("");
			}
			$$('.fundsList .card-content').click(function(){

				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('fundsDetails.html?honorId='+id);
			})
		});
	}
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			loadHonorList(false);
			app.myApp.pullToRefreshDone();
		}, 1000);
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
				loadHonorList(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadHonorList(true);
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
		refresh:refresh,
		resetFirstIn: resetFirstIn,
	}
});