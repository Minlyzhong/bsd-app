define(['app',
	'hbs!js/hbs/comment'
], function(app, commentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载文章接口
	var newsPath = app.basePath + 'extContent/loadContentById';
	//加载评论接口
	var commentPath = app.basePath + 'extComment/loadCommentByArtId';
	//发送评论接口
	var savePath = app.basePath + 'extComment/saveComment';
	//收藏接口
	var favoritePath = app.basePath + 'extFavorite/saveFavotite';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';
	var contentId = 0;
	var cId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
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
		cId = pageData.cId
		ajaxLoadContent();
		console.log(cId);
		console.log(contentId);
		console.log(pageData.isGood);
		if(pageData.isGood === 'true'){
			$$('.partyLike1').find('i').removeClass('icon-noCollect2');
			$$('.partyLike1').find('i').addClass('icon-collect2');
		}
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent() {
		//点击收藏按钮
		$$('.content-forward').on('click', favoriteArticle);

		//点击发送按钮
		$$('.comment-send').on('click', sendComment);
		
		$$('.partyLike1').on('click', function(e) {
			partyLike(contentId);
			e.stopPropagation();
		});
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
		app.ajaxLoadPageContent(newsPath, {
			userId: app.userId,
			contentId: contentId
		}, function(result) {
			var data = result;
			console.log(data);
			if(data) {
				$$('.news_title').html(data.data.title);
				if(data.data.isFavorite) {
					$$('.content-forward i').addClass('icon-collectionDone');
				} else {
					$$('.content-forward i').addClass('icon-collection');
				}
				if(data.data.isGood) {
					$$('.partyLike1').find('i').removeClass('icon-noCollect2');
					$$('.partyLike1').find('i').addClass('icon-collect2');
				}
				if(data.data.titlePic) {
					var picType = data.data.titlePic.split('.')[1];
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
						$$('.news_img').html(
							'<video width="100%"  controls="controls" id="video2" class="homeVideo">' +
							'<source src="' + app.basePath + data.data.titlePic + '" type="video/' + picType + '">' +
							'<video>'
						);
					} else {
						$$('.news_img').html('<img class="lazy lazy-fadeIn" src="' + app.basePath + data.data.titlePic + '"/>');
						var images = {
							url: app.basePath + data.data.titlePic,
							caption: data.data.title
						};
						var photoBrowserPopup = app.myApp.photoBrowser({
							photos: [images],
							theme: 'dark',
							backLinkText: '关闭',
							type: 'popup'
						});
						$$('.news_img').on('click', function() {
							photoBrowserPopup.open();
						});
					}
				}
				$$('.news_time').html(data.data.creatTs);
				$$('.new-content').html(data.data.content);
				
				getNewsComment(contentId, false);
				loading = false;
				
			} else {

			}	
			clickVideo();
		});
	}
	
	function clickVideo(){
		var video1 = document.getElementById('video2');		
		if(video1 != null){
			$$('.news_img').on('click',function(){
				if(video1.paused)
				video1.play();
				else
				video1.pause();
				//video1.controls=true;
			});
		}
		
	}
	/**
	 * 获取评论
	 * @param {Object} isLoadMore
	 */
	function getNewsComment(isLoadMore) {
		app.ajaxLoadPageContent(commentPath, {
			artId: contentId,
			pageNo: pageNo,
			pageSize: 20
		}, function(data) {
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