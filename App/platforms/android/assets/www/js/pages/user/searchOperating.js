define(['app','hbs!js/hbs/partyListOperaQuest'], function(app,template) {
	var $$ = Dom7;
	var firstIn = 1;
	//模糊事项
	var findSearchNewsPath = app.basePath + '/mobile/operating/event/query';
	var pageNo = 1;
	var loading = true;
	var newsKey = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.myApp.showPreloader('加载中...');
		attrDefine(page);
		
		clickEvent(page);
		pushAndPull(page);
		findSearchNews(false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		pageNo = 1;
		loading = true;
		newsKey = '';
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#ShowNewsSearch').on('focus',searchRecord);
		$$('.ShowNewsSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewsSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo = 1;
		loading = true;
		newsKey='';
		$$(this).css('text-align', 'left');
		//$$('.searchNews').html('');
		$$('.newsNotFound').css('display', 'none');
		$$('.ShowNewsSearchBar .searchCancelBtn').css('display', 'block');
	}
	function hideSearchList(){
		pageNo = 1;
		loading = true;
		newsKey='';
		$$('#ShowNewsSearch').val('');
		$$('.newsNotFound').css('display', 'none');
		$$('.newsList').html('');
		$$('#ShowNewsSearch').css('text-align', 'center');
		$$('.ShowNewsSearchBar .searchCancelBtn').css('display', 'none');
		findSearchNews(false);
	}
	function keyupContent(){
		//$$('.searchNews').html('');
		$$('.newsList').html('');
		newsKey = $$('#ShowNewsSearch').val();
		console.log(newsKey);
		if(!newsKey) {
			return;
		}
		findSearchNews(false);
	}
	
	
	//模糊查询事项
	function findSearchNews(isLoadMore){
		app.ajaxLoadPageContent1(findSearchNewsPath, {
			query: newsKey,
			current: pageNo,
			size: 20,
			
			// winId: app.qId,
			// tenantId: app.tenantId,
		}, function(result) {
			app.myApp.hidePreloader();
			var data = result.data.records;
			console.log(data);
			//确定没有信息并且是第一页的时候
			console.log(data.length == 0);
			if(data.length == 0 && pageNo == 1){
				$$('.newsNotFound').css('display','block');
				
				$$('.newsList').html();
			}else if(data.length == 0 && pageNo != 1){
				app.myApp.alert('已没有更多内容', '系统提示');
			}else{
				$$('.newsNotFound').css('display','none');
				handlePartyGetList(data, isLoadMore);
			}
		},function(error){
			app.myApp.hidePreloader();
			var text = JSON.parse(error.responseText)
			// app.myApp.toast(text.msg, 'error').show(true);
			app.myApp.toast('获取数据失败', 'error').show(true);

		});
		// app.myApp.hidePreloader();
	}
	
		/**
	 * 加载事项列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$('.headerTitle2').html(data[0].winName);
			if(isLoadMore == true) {
				$$('.newsList').append(template(partyData));
			} else {
				$$('.newsList').html(template(partyData));
			}
			//点击事项事件
			$$('.memoContent').on('click', partyContentHandle);

			loading = false;
		} else {

		}
	}
	
	//事项列表的点击事件
	function partyContentHandle() {

		app.eventName = $$(this).data('eventName');
		app.eventId = $$(this).data('eventId');
		app.applyCompany = $$(this).data('applyCompany');
		console.log(app.eventId)
		console.log(app.eventName)
		$$('#operatingName').html(app.eventName);
		
		app.selectOperating = true;
		app.myApp.getCurrentView().back();
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
				findSearchNews(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			findSearchNews(true);
		});
	}


	return {
		init: init
	}
});