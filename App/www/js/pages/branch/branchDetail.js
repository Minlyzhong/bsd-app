define(['app',
	'hbs!js/hbs/comment'
], function(app, commentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载文章接口
	// var searchContentPath = app.basePath + 'partyContent/searchContentById';
	//加载评论接口
	//var commentPath = app.basePath + '/mobile/political/content/comment/list';
	//发送评论接口
	//var savePath = app.basePath + 'extComment/saveComment';
	//收藏接口
	//var favoritePath = app.basePath + '/mobile/user/favorite/addOrDelete';
	//点赞接口
	//var goodPath = app.basePath + 'extGood/saveGood';
	var contentId = 0;
	var cId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
	console.log(page)
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		clickEvent();
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
		contentId = pageData.id;
		console.log(pageData)
		if(pageData){
			$$('.branch_title').html(pageData.title);
			$$('.branch_time').html(pageData.createdate);
			$$('.branch-content').html(pageData.content);
		}

//		cId = pageData.cId
		// ajaxLoadContent();
//		console.log(cId);
//		console.log(contentId);
//		console.log(pageData.isGood);
//		if(pageData.isGood === 'true'){
//			$$('.partyLike1').find('i').removeClass('icon-noCollect2');
//			$$('.partyLike1').find('i').addClass('icon-collect2');
//		}
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent() {
		//点击收藏按钮
		// $$('.content-forward').on('click', favoriteArticle);

		//点击发送按钮
		//$$('.comment-send').on('click', sendComment);
		
		//$$('.partyLike1').on('click', function(e) {
			//partyLike(contentId);
			//e.stopPropagation();
		//});
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		getNews();
	}
	
		//文章点赞
	function partyLike(articleId) {
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
					$$('.partyLike1').find('i').removeClass('icon-noCollect2');
					$$('.partyLike1').find('i').addClass('icon-collect2');
				} else {
					app.myApp.toast('取消点赞！', 'none').show(true);
					$$('.partyLike1').find('i').removeClass('icon-collect2');
					$$('.partyLike1').find('i').addClass('icon-noCollect2');
				}
			});
			setTimeout(function() {
				require(['js/pages/home/home'], function(home) {
					home.refreshHome(cId);
				});
			}, 2000);
		}
	}
	/**
	 * 获取新闻 
	 */
	function getNews() {
		app.ajaxLoadPageContent(searchContentPath, {
			//userId: app.userId,
			contentId: contentId
		}, function(result) {
			var data = result;
			console.log(data);
			if(data){
				$$('.branch_title').html(data.data.title);
				$$('.branch_time').html(data.data.ts);
				$$('.branch-content').html(data.data.content);
			}else{
				
			}
		});
	}

	/**
	 * 获取评论
	 * @param {Object} isLoadMore
	 */
	function getNewsComment(isLoadMore) {
		app.ajaxLoadPageContent(commentPath, {
			articleId: contentId,
			current: pageNo,
			type:1,
			size: 20
		}, function(data) {
			console.log('data.data branchDetail');
			console.log(data.data);
			if(data.data && data.data.length > 0) {
				var html = commentTemplate(data.data);
				if(isLoadMore == true) {
					$$('.comment-list ul').append(html);
				} else {
					$$('.comment-list ul').html(html);
				}
				loading = false;
			}
		});
	}

	/**
	 * 发送评论 
	 */
	function sendComment() {
		var comments = $$('.input-comment').val();
		if(comments == '' || comments == null) {
			app.myApp.alert('请输入评论！');
			return;
		}
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			app.ajaxLoadPageContent(savePath, {
				userId: app.userId,
				articleId: contentId,
				comments: comments
			}, function(data) {
				console.log(data.data);
				console.log(app.user);
				if(data.data.success == true) {
					app.myApp.alert('评论成功！');
					$$('.input-comment').val('');
					data.data.userName = app.user.userName;
					var newHtml = commentTemplate(data.data);
					var html = $$('.comment-list ul').html();
					$$('.comment-list ul').html(newHtml);
					$$('.comment-list ul').append(html);
				} else {
					app.myApp.alert('评论失败！');
				}

			});
		}
	}
	/**
	 * 收藏文章
	 */
	function favoriteArticle() {
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			app.ajaxLoadPageContent(favoritePath, {
				userId: app.userId,
				articleId: contentId
			}, function(data) {
				console.log(data);
				if(data.data.FavoriteType == true) {
					app.myApp.toast('已收藏！', 'success').show(true);
					$$('.content-forward i').removeClass('icon-collection');
					$$('.content-forward i').addClass('icon-collectionDone');
				} else {
					app.myApp.toast('取消收藏！', 'none').show(true);
					$$('.content-forward i').removeClass('icon-collectionDone');
					$$('.content-forward i').addClass('icon-collection');
				}
				setTimeout(function() {
					require(['js/pages/user/userFavorite'], function(favorite) {
						favorite.loadFavorite();
					});
				}, 2000);
			});
		}
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			getNewsComment(true);
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