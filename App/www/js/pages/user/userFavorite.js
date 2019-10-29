define(['app',
	'hbs!js/hbs/userFavorite'
], function(app, favoriteTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取用户收藏文章
	var userFavoritePath = app.basePath + '/mobile/political/content/userCollection';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('user/userFavorite', [
//			'home/newsDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		loadFavorite();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleFavorite(pageDataStorage['favorite']);
	}

	/**
	 * 读取用户收藏 
	 */
	function loadFavorite() {
		app.ajaxLoadPageContent(userFavoritePath, {
			userId: app.userId
		}, function(data) {
			console.log('loadFavorite-user')
			console.log(data);
			pageDataStorage['favorite'] = data;
			handleFavorite(data);
		});
	}

	/**
	 * 加载用户收藏 
	 */
	function handleFavorite(data) {
		if(data.data.records && data.data.records.length > 0) {
			
			$$('.userFavorite-not-found').hide();
			$$.each(data.data.records,function(index, item){
				if(item.commentVolume == null){
					item.commentVolume = 0;
				}
			})
			$$('.userFavorite-List ul').html(favoriteTemplate(data.data.records));
			$$('.userFavorite-content').on('click', function() {
				var artId = $$(this).data('id');
				var type = $$(this).data('type')|| 1;
				console.log(artId)
				loadArticle(artId, type);
			});
		} else {
			
			$$('.userFavorite-List ul').html("");
			$$('.userFavorite-not-found').show();
		}
	}

	//打开文章
	function loadArticle(artId, type) {
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + artId+'&type=' + type+'&userFavorite = 1');
	}

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		loadFavorite: loadFavorite,
		resetFirstIn: resetFirstIn,
	}
});