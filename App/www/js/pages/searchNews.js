define(['app','hbs!js/hbs/partyList3'], function(app,template) {
	var $$ = Dom7;
	var firstIn = 1;
	//模糊查询新闻
	var findSearchNewsPath = app.basePath + '/mobile/political/content/findAll';
	var pageNo = 1;
	var loading = true;
	var newsKey = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		if(app.tenantId == null || app.tenantId == undefined ||app.tenantId == '' ){
			app.tenantId = 'cddkjfdkdeeeiruei8888'
		}
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
		
		//$$('.searchNews').html('');
		
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#ShowNewsSearch').on('focus',searchRecord);
		$$('.ShowNewsSearchBar .searchNewsBtn').on('click', keyupContent);
		// $$('#ShowNewsSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo = 1;
		loading = true;
		newsKey='';
		$$(this).css('text-align', 'left');
		//$$('.searchNews').html('');
		$$('.newsNotFound').css('display', 'none');
		$$('.ShowNewsSearchBar .searchNewsBtn').css('display', 'block');
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
		app.myApp.showPreloader('加载中...');
		app.ajaxLoadPageContent1(findSearchNewsPath, {
			query:newsKey,
			current:pageNo,
			size:10,
			tenantId:app.tenantId
			// pageNo:pageNo
		}, function(result) {
			app.myApp.hidePreloader();
			var data = result.data.records;
			
			//确定没有信息并且是第一页的时候
			console.log(data);
			console.log(data.length == 0 && pageNo == 1);
			if(data.length == 0 && pageNo == 1){
				$$('.newsNotFound').css('display','block');
				
				$$('.newsList').html(template());
			}
			else{
				handlePartyGetList(data, isLoadMore);
			}
		});
	}
	
		/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		console.log(data && data.length > 0);
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.filePath = app.filePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				item.creatTs = item.creatTs.split(' ')[0];

				if(item.titlePic){
					var picArr = item.titlePic.split('.');
					var picType = picArr[picArr.length - 1];
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
						// item.titlePic = '';
						item.picType = 0;
						console.log(item.picType);
					}
				}else{
					item.titlePic = '';
					item.picType = 0;
				}
				
			});
			if(isLoadMore == true) {
				$$('.newsList').append(template(partyData));
			} else {
				console.log(partyData);
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
		var type = $$(this).data('type')
		if(isGood == undefined){
			isGood = false;
		}
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId +'&isGood='+isGood+'&cId='+cId+'&type='+type);
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