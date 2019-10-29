define(['app',
	'hbs!js/hbs/partyList'
], function(app, template) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载栏目的文章列表
	var listPath = app.basePath + '/mobile/political/content/columnArticles';
	//获取所有推荐日志或微动态
	var recommendlistPath = app.basePath + '/mobile/worklog/page/recommend/list';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';
	var listTitle = '';
	var catId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('home/partyList', [
//			'home/newsDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		if(app.tenantId == null || app.tenantId == undefined ||app.tenantId == '' ){
			app.tenantId = 'cddkjfdkdeeeiruei8888'
		}
		app.back2Home();
		clickEvent();
		
		attrDefine(page.query.title);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {

		console.log('pageData');
		console.log(pageData);
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		catId = pageData.id;
		listTitle = pageData.title;
		console.log('catId');
		console.log(catId);
		
		//console.log(pageData.List);
		ajaxLoadContent();
	}


	//点赞刷新
	function refreshHome(cId){
		console.log(cId);
		catId = cId;
		console.log(catId);
		pageNo = 1;
		loading = true;
		partyGetList(false);
		app.myApp.pullToRefreshDone();
	}
	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handlePartyGetList(pageDataStorage['partyGetList'], false);
	}

	/**
	 *  保存缓存数据 
	 */
	function saveStorage() {
		pageDataStorage = {

		};
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(title) {
		$$('.party-title').html(title);

	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		partyGetList(false);
	}

	//获取文章列表
	function partyGetList(isLoadMore) {
		console.log(listTitle)
		if(listTitle == '日志推送'){
			
			app.ajaxLoadPageContent1(recommendlistPath, {
				pageNo: pageNo,
				pageSize: 10,
				tenantId: app.tenantId,
				// catalogId: 17,
				// catalogId: catId,
				// userId: app.userId
			}, function(result) {
				var data = result;
				console.log(data.data.records);
				pageDataStorage['partyGetList'] = data.data.records;
				handlerecommendList(data.data.records, isLoadMore);
			});
		}else{
			app.ajaxLoadPageContent1(listPath, {
				current: pageNo,
				tenantId: app.tenantId,
				// catalogId: 17,
				catalogId: catId,
				userId: app.userId
			}, function(result) {
				var data = result;
				console.log(data.data);
				pageDataStorage['partyGetList'] = data.data;
				handlePartyGetList(data.data, isLoadMore);
			});
		}
		
	}/**
	 * 加载推荐工作日志列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlerecommendList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				// item.basePath = app.basePath;
				
				item.title = item.logTitle;
				item.creatorId = item.userId;
				item.creatorId = item.userId;
				
				if(item.images !=null && item.images.length > 0 ){
					item.titlePic = app.filePath + item.images[0].attPath;
					var picArr = item.titlePic.split('.');
					var picType = picArr[picArr.length - 1];
					
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
						item.picType = 1;
						item.videoType = picType;
					} else {
	
						item.picType = 0;
					}
				}else{
					item.picType = 0;
					item.titlePic = '';
				}
				
			});
			if(isLoadMore == true) {
				console.log(partyData)
				$$('.party-list-type').append(template(partyData));
			} else {
				console.log(partyData)
				$$('.party-list-type').html(template(partyData));
				$$('.partyPage').scrollTop(5, 0, null);
			}
			//点击日志事件
			$$('.qs-party-card').on('click', partyContentHandle2);

		

			loading = false;
		} else {

		}
	}

	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			console.log(partyData);
			$$.each(partyData, function(index, item) {
				// item.basePath = app.basePath;
				// item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentVolume || 0;
				// item.goodTotal = item.goodTotal || 0;
				if(item.titlePic){
					item.titlePic = app.filePath + item.titlePic;
					var picArr = item.titlePic.split('.');
					var picType = picArr[picArr.length - 1];
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
						item.picType = 1;
						item.videoType = picType;
					} else {
						item.picType = 0;
					}
				} else {
					item.picType = 0;
					item.titlePic = '';
				}
				
				
			});
			if(isLoadMore == true) {
				console.log(partyData);
				$$('.party-list-type').append(template(partyData));
			} else {
				console.log(partyData);
				$$('.party-list-type').html(template(partyData));
				$$('.partyPage').scrollTop(5, 0, null);
			}
			//点击文章事件
			$$('.qs-party-card').on('click', partyContentHandle);

			//点击点赞
			$$('.partyLike').on('click', function(e) {
				var likeTotal = parseInt($$(this).find('.likeTotal').html());
				var articleId = $$(this).parent().data('id');
				var thisContent = this;
				partyLike(articleId, likeTotal, thisContent);
				e.stopPropagation();
			});

			loading = false;
		} else {

		}
	}
	//日志列表的点击事件
	function partyContentHandle2() {
		
			var recordId = $$(this).data('id');
			var logTypeId = $$(this).data('logTypeId');
			var userId = $$(this).data('creatorId');
			var reviewName = $$(this).data('userName');
			console.log(logTypeId);
			
			app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId+ '&userId=' + userId + '&logTypeId=' + logTypeId  + '&state=-1&reviewName=' + reviewName+'&push=true');
		
	}


	//文章列表的点击事件
	function partyContentHandle() {
		if($$(this).data('isPush') == 'true'){
			var recordId = $$(this).data('id');
			var userId = $$(this).data('creatorId');
			var reviewName = $$(this).data('userName');
			app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId + '&userId=' + userId + '&workType=工作日志&state=-1&reviewName=' + reviewName);
		}else{
			var Id = $$(this).data('id');
			var catalogId = $$(this).data('cid');
			var type = $$(this).data('type');
			app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + Id+'&cid='+catalogId+'&type='+type);
		}	
	}

	//文章点赞
	function partyLike(articleId, forwardTotal, thisContent) {
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			app.ajaxLoadPageContent(goodPath, {
				userId: app.userId,
				articleId: articleId
			}, function(data) {
				console.log(data);
				if(data.data.goodType == true) {
					app.myApp.toast('已点赞！', 'success').show(true);
					$$(thisContent).find('i').removeClass('icon-noCollect');
					$$(thisContent).find('i').addClass('icon-collect');
					$$(thisContent).find('.likeTotal').html(forwardTotal + 1);

				} else {
					app.myApp.toast('取消点赞！', 'none').show(true);
					$$(thisContent).find('i').removeClass('icon-collect');
					$$(thisContent).find('i').addClass('icon-noCollect');
					$$(thisContent).find('.likeTotal').html(forwardTotal - 1);
				}
			});
		}
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
				partyGetList(false);
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
			partyGetList(true);
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
		refreshHome:refreshHome,
		resetFirstIn: resetFirstIn,
	}
});