define(['app','hbs!js/hbs/meetingList'], function(app, meetingListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取会议列表
	var checkSignPath = app.basePath + '/mobile/sign/check';
	

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		clickEvent(page);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		checkList(false);
		
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#cardDown').on('click', function() {
		
		});
		};

		
	

	//获取会议列表
	function checkList(isLoadMore) {
		app.ajaxLoadPageContent(checkSignPath, {
			// userId: app.userId
		}, function(data) {
			console.log(data);
			if(data.code == 0) {
				var meetingDate =[{meetingName:'项目1',part:'阶段'},{meetingName:'项目2',part:'阶段'}]
				if(isLoadMore){
					console.log(meetingDate)
					$$('.meetingList ul').append(meetingListTemplate(meetingDate));
					loading = false;
				}else{
					console.log(meetingDate)
					$$('.meetingList ul').html(meetingListTemplate(meetingDate));
					loading = true;
				}
			}else{
				loading = true;
				$$('.meetingList ul').html("");
			}
			$$('.meetingList .card').click(function(){
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('processDetail.html?honorId=1');
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
			checkList(false);
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
				checkList(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			checkList(true);
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
		refresh: refresh
	}
});