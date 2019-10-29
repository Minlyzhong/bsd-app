define(['app',
	'hbs!js/hbs/partyList'
], function(app, template) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载栏目的文章列表
	var listPath = app.basePath + 'extContent/loadPagerByCatId';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';

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
		app.back2Home();
		clickEvent();
		attrDefine(page.query.title);
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
		catId = pageData.id;
		ajaxLoadContent();
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
		app.ajaxLoadPageContent(listPath, {
			page: pageNo,
			catalogId: catId,
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			pageDataStorage['partyGetList'] = data.data;
			handlePartyGetList(data.data, isLoadMore);
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
				$$('.party-list-type').append(template(partyData));
			} else {
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

	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId);
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
		resetFirstIn: resetFirstIn,
	}
});