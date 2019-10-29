define(['app','hbs!js/hbs/personalHonorList'], function(app,personalHonorListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageNo = 1;
	var loading = true;
	//查询个人荣誉列表
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
		$$('.publicHonor').click(function(){
			app.myApp.getCurrentView().loadPage('personalHonor.html');
		});
	}
	/*
	 * 读取数据
	 */
	function loadHonorList(isLoadMore){
		app.ajaxLoadPageContent(showHonorListPath, {
			// userId: app.userId,
			pageNo: pageNo,
			size: 2
		}, function(result) {
			var result = result.data.records.reverse();
			if(result.length > 0){
				var honorDate = [];
				$$.each(result, function(index, item) {
					var honor = {
						grantOrganization:"",
						honorDescription:"",
						honorLevel:0,
						honorName:"",
						honorPic:"",
						honorTime:"",
						id:0,
						score:0,
						userName:"",
						verify:0,
						memo:"",
					};
					
					honor.grantOrganization = item.grantOrganization;
					honor.honorDescription = item.honorDescription;
					honor.honorLevel = item.honorLevel;
					honor.honorName = item.honorName;

					honor.honorPic = app.filePath+item.images[0].attPath;
					honor.honorTime = app.getnowdata(item.honorTime);
					honor.id = item.id;
					honor.score = item.score;
					honor.userName = item.userName;
					honor.verify = item.verify;
					honor.memo = item.memo;
					honorDate.push(honor);
				});
				if(isLoadMore){
					$$('.honorList ul').append(personalHonorListTemplate(honorDate));
					loading = false;
				}else{
					console.log(honorDate);
					$$('.honorList ul').html(personalHonorListTemplate(honorDate));
					loading = true;
				}
			}else{
				loading = true;
				$$('.honorList ul').html("");
			}
			$$('.honorCard').click(function(){
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('personalHonorDetails.html?honorId='+id);
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