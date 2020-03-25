define(['app',
	'hbs!js/hbs/service'
], function(app, template) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取志愿服务接口
	var servicesPath = app.basePath + '/mobile/volunteer/list';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		clickEvent(page);
		pushAndPull(page);
		// if(app.roleId == 5 || app.roleId == 6){
			$$('.service-add').css('display','block');
		// }
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		loadServices();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleServices(pageDataStorage['services'], false);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.service-add').on('click', servicesAdd);
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
	 * 获取服务列表
	 */
	function loadServices(isLoadMore) {
		app.ajaxLoadPageContent(servicesPath, {
			pageNo: pageNo
		}, function(data) {
			$$('.services-not-found').hide();
			console.log(data);
			var data = data.data.records;
			$$.each(data, function(index, item){
				item.registEndtime = app.getnowdata(item.registEndtime);
			})
			pageDataStorage['services'] = data ;
			handleServices(data, isLoadMore);
		});
	}

	/**
	 * 加载服务列表
	 */
	function handleServices(data, isLoadMore) {
		if(data && data.length > 0) {
			if(isLoadMore == true) {
				$$('.services-list').append(template(data));
			} else {
				$$('.services-list').html(template(data));
			}
			$$('.qs-card').on('click', servicesHanlde);
			loading = false;
		} else {
			if(!isLoadMore) {
				$$('.services-list').html('');
				$$('.services-not-found').show();
			}
		}
	}

	//点击事件
	function servicesHanlde(e) {
		var sid = $$(this).data('id');
		app.myApp.getCurrentView().loadPage('servicesDetail.html?sid=' + sid);
	}

	//添加服务
	function servicesAdd() {
		app.myApp.getCurrentView().loadPage('servicesAdd.html');
	}

	function servicesRefresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			$$('.services-list').html('');
			loadServices(pageNo, false);
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
			// Emulate 2s loading
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				$$('.services-list').html('');
				loadServices(pageNo, false);
				app.myApp.pullToRefreshDone();
			}, 1000);
		});

		// 加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadServices(pageNo, true);
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
		servicesRefresh:servicesRefresh,
		resetFirstIn: resetFirstIn,
	}
});