define(['app',
	'hbs!js/hbs/comment'
], function(app, commentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载文章接口 每日一学
	var newsStudyPath = app.basePath + '/mobile/course/content/loadContent/';

	var newsPath = app.basePath + '/mobile/political/content/info';

	// var newsPath = app.basePath + '/mobile/course/content/loadContent/';
	//加载评论接口
	var commentPath = app.basePath + '/mobile/political/content/comment/list';
	//发送评论接口
	var savePath1 = app.basePath + '/mobile/political/content/comment';
	//收藏接口
	var favoritePath = app.basePath + '/mobile/user/favorite/addOrDelete';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';
	//该用户学习完了接口
	var savePushReceiverPath = app.basePath + 'extPushReceiver/savePushReceiver';
	//添加学习记录接口
	var savePath = app.basePath + '/mobile/course/content/addStudy/';
	
	var contentId = 0;
	var cId = 0;
	var photoBrowserPhotos = [];
	
	var video1Count = 1;
	var userFavorite = 0;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		console.log('newsDetail-page.query')
		console.log(page)
		initData(page.query);
		app.back2Home();
		clickEvent();
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		
		video1Count = 1;
		firstIn = 0;
		pageDataStorage = {};
		photoBrowserPhotos = [];
		pageNo = 1;
		loading = true;
		contentId = pageData.id;
		cId = pageData.cid;
		type = parseInt(pageData.type) || 1;
		ajaxLoadContent();		
		console.log(pageData.isLearning);
		//判断时候是学习任务
		if(pageData.isLearning == 'false'){
			//userIsLearned();
			getLearnScore();
			//$$('.commentNews').css('display','none');
			setTimeout(function(){
				require(['js/pages/dailyLearning/dailyLearning'], function(dailyLearning) {
					dailyLearning.refresh();
				});
			},200)
		}
		// if(page.){

		// }
	}	
	
	/*
	 * 该用户是否学习完
	 */
	function userIsLearned(){
		app.ajaxLoadPageContent1(savePushReceiverPath,{
			pushServiceId:contentId,
			receiverUserId:app.userId,
			receiverState:1
		},function(data){
			console.log(data);
		});
	}
	/*
	 * 添加学习记录
	 */
	function getLearnScore(){
		app.ajaxLoadPageContent1(savePath+app.userId+'/'+contentId,{
			// userId:app.userId,
			// catalogId:cId,
			// articleId:contentId,
			// typeKey:'DAILYLEARNING',
			// action:7,
			// score:1
		},function(data){
			console.log(data);
			setTimeout(function(){
				//及时更新用户积分
				require(['js/pages/user/user'], function(user) {
					user.getUserInfo();
				});
				//及时更新未读条数
				require(['js/pages/appList/appList'], function(appList) {
					appList.reSetDlNum();
				});
			},1000);
		},{
			type:'POST'
		});
	}	
	/**
	 * 点击事件
	 */
	function clickEvent() {
		//点击收藏按钮
		// $$('.content-forward').on('click', favoriteArticle);
		$$('.collect').on('click', favoriteArticle);
		//点击发送按钮
		$$('.comment-send').on('click', sendComment);
		
		$$('.partyLike1').on('click', function(e) {
			partyLike(contentId);
			e.stopPropagation();
		});
		//点击分享图标
		$$('.shareNews').on('click', function() {
			var clickedLink = this;
			var popoverHTML = '<div class="popover" style="width: 49%;height:40px">' +
				'<div class="popover-inner">' +
				'<div class="list-block shareNewsPopover">' +
				'<ul style="padding:0 3px">' +
				'<li style="float:left;margin:5px;"><a href="#" class="shareQQ"><i class="icon icon-QQ" style="margin-right: 5%;"></i></a></li>' +
				'<li style="float:left;margin:5px;"><a href="#" class="shareQQZone"><i class="icon icon-QQZone" style="margin-right: 5%;"></i></a></li>' +
				'<li style="float:left;margin:5px;"><a href="#" class="wechatFriend"><i class="icon icon-wechatFriend"  style="margin-right: 5%;"></i></a></li>' +
				'<li style="float:left;margin:5px;"><a href="#" class="shareWechatTimeline"><i class="icon icon-wechatTimeline" style="margin-right: 5%;"></i></a></li>' +
				'<li style="float:left;margin:5px;"><a href="#" class="shareWeibo"><i class="icon icon-weibo"  style="margin-right: 5%;"></i></a></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>'
			var popover = app.myApp.popover(popoverHTML, clickedLink);
			$$('.shareNewsPopover li a').on('click', function() {
				app.myApp.closeModal(popover);
			});
			//点击QQ图标
			$$('.shareQQ').on('click',function(){
				console.log('QQ分享');
			});
			//点击微信图标
			$$('.wechatFriend').on('click',function(){
				console.log('微信分享');		
			});
			//点击微博图标
			$$('.shareWeibo').on('click',function(){
				console.log('微博分享');
			});
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
				// console.log('data');
				// console.log(data);
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
				require(['js/pages/home/partyList'], function(partyList) {
					console.log(cId);
					partyList.refreshHome(cId);
				});
				require(['js/pages/home/home'], function(home) {
					console.log(cId);
					home.refreshHome(cId);
				});
			}, 2000);
		}
	}
	/**
	 * 获取新闻 
	 */
	function getNews() {
		if(type == 3){
			var url = newsStudyPath + app.userId +'/'+ contentId;
			var params = {}
		}else{
			if(app.user == -1 || app.user ==''|| app.user == null|| app.user == undefined){
				var url = newsPath;
				var params = {
					articleId: contentId,
					tenantId: 'cddkjfdkdeeeiruei8888'
				}
			}else{
				var url = newsPath;
				var params = {
					userId: app.userId,
					articleId: contentId,
					tenantId: app.tenantId
				}
			}
			
		}
		app.ajaxLoadPageContent(url, params, function(result) {
			var data = result;
			console.log('获取新闻');
			console.log(data.data);
			if(data) {
				$$('.news_title').html(data.data.title);
				if(data.data.visitorVolume == null){
					data.data.visitorVolume = 0;
				}
				$$('.news_visitorVolume').html('阅读量：'+data.data.visitorVolume);
				// if(data.data.isFavorite) {
				// 	$$('.content-forward i').addClass('icon-collectionDone');
				// } else {
				// 	$$('.content-forward i').addClass('icon-collection');
				// }
				// if(data.data.isGood) {
				// 	$$('.partyLike1').find('i').removeClass('icon-noCollect2');
				// 	$$('.partyLike1').find('i').addClass('icon-collect2');
				// }
				if(data.data.isFavorite){
					console.log('已收藏')
					$$('.collect i').removeClass('icon-noCollect3');
					$$('.collect i').addClass('icon-collect3');
				}else{
					console.log('未收藏')
				}
				if(data.data.titlePic) {
					var picType = data.data.titlePic.split('.')[1];
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
						$$('.news_img').html(
//							'<video width="100%"  controls="controls" id="video2" class="homeVideo">' +
//							'<source src="' + app.basePath + data.data.titlePic + '" type="video/' + picType + '">' +
//							'<video>'

//							'<video id="video2" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="none" width="100%" height="250px" poster="' + app.basePath + data.data.titlePic + '" data-setup="{}" style="width:100%;height:250px;" preload="none">'+
//						    '<source src="' + app.basePath + data.data.titlePic + '" type="video/' + picType + '">' +
//							'</video>'
						'<video id="video2" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:250px;" preload="none" controls="controls" src="'+app.filePath+data.data.titlePic+'" poster="'+app.filePath+data.data.titlePic+'" type="video/' + picType + '"></video>'
//						'<video id="video2" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:250px;" preload="none" controls="controls" type="video/mp4" src="img/test.mp4"></video>'
//						'<object data="http://player.youku.com/player.php/sid/XMzU4MjQ5NzEwMA==/v.swf" type="application/x-shockwave-flash">'+
//						'<param name="movie" value="http://player.youku.com/player.php/sid/XMzU4MjQ5NzEwMA==/v.swf"/>'+
//						'<embed src="http://player.youku.com/player.php/sid/XMzU4MjQ5NzEwMA==/v.swf"/>'+
//						'</object>'
						);
					} else {
//						$$('.news_img').html('<img class="lazy lazy-fadeIn" src="' + app.basePath + data.data.titlePic + '"/>');
//						var images = {
//							url: app.basePath + data.data.titlePic,
//							caption: data.data.title
//						};
//						var photoBrowserPopup = app.myApp.photoBrowser({
//							photos: [images],
//							theme: 'dark',
//							backLinkText: '关闭',
//							type: 'popup'
//						});
//						$$('.news_img').on('click', function() {
//							photoBrowserPopup.open();
//						});
					}
				}
				$$('.news_time').html(data.data.creatTs);
				$$('.new-content').html(data.data.content);			
//				$$('.new-content').html('<embed src="http://player.youku.com/player.php/sid/XMzU4MTk4NzI4NA==/v.swf" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
				getNewsComment(contentId, false);
				loading = false;
				//点击.new-content a标签触发的事件
				$$('.new-content a').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					var downLoadUrl = $$(this).attr('href');
					app.myApp.confirm('确定要打开吗？', function(e) {
						open(downLoadUrl, '_system');
					});
				});
				//让.new-content的img放进photoBrowserPhotos
				$.each($$('.new-content img'), function(index,item) {
					console.log($$(item).prop('src'));
					var images = {
						url: $$(item).prop('src'),
					}
					photoBrowserPhotos.push(images);
				});
				//设置photoBrowserPopup的属性
				var photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					type: 'popup',
					maxZoom:10,
//					zoom: 500, 
					swipeToClose:false,
				});
				//0代表开始
				$$('.new-content img').on('click', function(e) {
//					e.preventDefault();
//					e.stopPropagation();
					//初始化imgindex
					var imgIndex = 0;
					//获取点击当前img的src
					var imgUrl = $$(this).prop('src');
					$.each(photoBrowserPhotos, function(index,item) {
						if(imgUrl == item.url){
							imgIndex = index;
						}
					});
					photoBrowserPopup.open(imgIndex);
				});
			} else {

			}	
			
			//点击视频触发时间
			clickVideo();
		});
	}
	
	function clickVideo(){
		var video1 = document.getElementById('video2');
//		video1.addEventListener("canplaythrough",function(){
//		   app.myApp.alert("加载完成！");
//		},false);
//		video1.addEventListener("error",function(e){
//		    app.myApp.alert(JSON.stringify(e));
//		},false);
		if(video1 != null){
			$$('.news_img').on('click',function(){
				if(video1.paused)
				video1.play();
				else
				video1.pause();			
			});
		}
	}
	/**
	 * 获取评论
	 * @param {Object} isLoadMore
	 */
	function getNewsComment(isLoadMore) {
		if(app.user == -1 || app.user ==''|| app.user == null){
			return;
		}else{
			app.ajaxLoadPageContent(commentPath, {
				articleId: contentId,
				current: pageNo,
				type:type,
				size: 20
			}, function(data) {
				console.log('data.data newsDetail');
				console.log(data.data.records);
				var dataDetail = data.data.records
				$$.each(dataDetail, function(index, item){
					item.ts = app.getnowdata(item.createdDate, 1)
				})
				console.log(dataDetail)
				if(data.data && data.data.records.length > 0) {
					var html = commentTemplate(data.data.records);
					if(isLoadMore == true) {
						$$('.comment-list ul').append(html);
					} else {
						$$('.comment-list ul').html(html);
					}
					loading = false;
				}
			});
		}
		
	}

	/**
	 * 发送评论 
	 */
	function sendComment() {
		var comments = $$('.input-comment').val().toString().trim();
		var currentTime = app.getnowdata();
		if(comments == '' || comments == null) {
			app.myApp.alert('请输入评论！');
			return;
		}
		if(comments.length < 10){
			app.myApp.alert('评论内容少于10字！');
			return;
		}
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			

			var formData={
				articleId: contentId,
				content: comments,
				// createdDate: 0,
				// id: 0,
				// tenantId: "",
				type:type,
				userId: app.userId,
				userName: app.user.userName
			}
			console.log('formData')
			
			var formDatas= JSON.stringify(formData)
			console.log(formDatas)
			//提交到后台审核
			$$.ajax({
				url:savePath1,
				method: 'POST',
				dataType: 'json',
				// processData: false, // 告诉jQuery不要去处理发送的数据
				// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (data) {
					app.myApp.alert('评论成功！');
							
							$$('.input-comment').val('');
							$$('.comment-list ul').html();
							// getNewsComment(false);
							data.userName = app.user.nickName;
							data.content = comments;
							data.ts = currentTime;
							var newHtml = commentTemplate(data);
							var html = $$('.comment-list ul').html();
							$$('.comment-list ul').html(newHtml);
							$$('.comment-list ul').append(html);

							
								setTimeout(function() {
								
									require(['js/pages/home/home'], function(partyList) {
									
										if(cId != undefined || cId !=''){
											partyList.refreshHome(cId);
										}else{
											partyList.refreshHome(contentId);
										}
								
									
									
									});
									}, 2000);
									

							
							
				},
				error:function () {
					app.myApp.alert('评论失败！');
					
				}
			});
			
			
		}
	}
	/**
	 * 收藏文章
	 */
	function favoriteArticle() {
		console.log('收藏')
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			app.ajaxLoadPageContent(favoritePath, {
				userId: app.userId,
				articleId: contentId,
				type:type
			}, function(data) {
				console.log(data);
				if(data.data == true) {
					app.myApp.toast('已收藏！', 'success').show(true);
					$$('.collect i').removeClass('icon-noCollect3');
					$$('.collect i').addClass('icon-collect3');
				} else {
					app.myApp.toast('取消收藏！', 'none').show(true);
					$$('.collect i').removeClass('icon-collect3');
					$$('.collect i').addClass('icon-noCollect3');
				}
				setTimeout(function() {
					require(['js/pages/user/userFavorite'], function(favorite) {
						favorite.loadFavorite();
					});
				}, 2000);
			},
			{
				type:'POST'
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