define(['app','hbs!js/hbs/partyList3'], function(app,template) {
	var $$ = Dom7;
	var firstIn = 1;
	//模糊查询新闻
	var findSearchNewsPath = app.basePath + 'extContent/searchNews';
	var pageNo = 1;
	var loading = true;
	var newsKey = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		attrDefine(page);
		app.back2Home();
		clickEvent(page);
		pushAndPull(page);
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
	
	
	//模糊查询新闻
	function findSearchNews(isLoadMore){
		app.ajaxLoadPageContent1(findSearchNewsPath, {
			query:newsKey,
			pageNo:pageNo
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			console.log(data.data.length == 0);
			if(data.data.length == 0 && pageNo == 1){
				$$('.newsNotFound').css('display','block');
				
				$$('.newsList').html(template());
			}
			else{
				handlePartyGetList(data.data, isLoadMore);
			}
		});
	}
	
		/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.newsList').append(template(partyData));
			} else {
				$$('.newsList').html(template(partyData));
			}
			//点击文章事件
			$$('.qs-party-card1').on('click', partyContentHandle);

			loading = false;
		} else {

		}
	}
	
	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		var cId = $$(this).data('catalogId');
		var isGood = $$(this).data('isgood');
		if(isGood == undefined){
			isGood = false;
		}
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId +'&isGood='+isGood+'&cId='+cId);
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