define(['app',
	'hbs!js/hbs/userScoreInfo'
], function(app, infoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//每日各规则累计积分统计
	var userScoreInfoPath = app.basePath + '/mobile/political/score/detail/getDailyRuleCumulative/';
	//用户积分排名接口
	var userPath = app.basePath + '/mobile/political/score/board/';
	//每日累计积分
	var userDailyPath = app.basePath + '/mobile/political/score/detail/getDailyCumulative/';
	var hasScore = false;
	var scoreArr = 0;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		pushAndPull(page);
		app.back2Home();
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		hasScore = false;
		scoreArr = 0;
		getUserInfo();
		getUserDailyInfo()
		scoreInfo(false);

	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {

		$$('.scoreRule').on('click', transTo);
		$$('.peopleScore').on('click', function(){
			app.myApp.getCurrentView().loadPage('peoplePointDes.html');
		});
	
	}

	function transTo(){
		console.log('transTo')
		app.myApp.getCurrentView().loadPage('pointDes.html');
	}

	//用户信息
	function getUserInfo() {
		app.ajaxLoadPageContent(userPath+app.userId, {
			
		}, function(data) {
			infoData = data.data;
//			if(infoData && infoData.length > 0) {
//				var userInfo = {};
//				$$.each(infoData, function(index, item) {
//					if(item.userId == app.userId) {
//						userInfo = item;
//						console.log(userInfo);
//					}
//				});
				userInfo = infoData;
				if(userInfo.totalScore && userInfo.totalScore != undefined) {
					totalScore = userInfo.totalScore;
					hasScore = true;
				}else{
					hasScore = false;
				}
//			}
			$$('#userTotel').html(totalScore);
		}, {
			async: false,
			type:'GET'
		});
	}

		//用户每日累计积分
		function getUserDailyInfo() {
			app.ajaxLoadPageContent(userDailyPath+app.userId, {
				
			}, function(data) {
				if(data.data == 0){
					$$('.scorePoint').html(data.data+'分');
				}
				
			});
		}
	//积分明细
	function scoreInfo(isLoadmore) {
		app.ajaxLoadPageContent(userScoreInfoPath + app.userId, {
			// userId: app.userId,
			// current: pageNo,
			// size: 20,
		}, function(data) {
			console.log(data);
			if(data.data && data.data.length > 0) {
				
				$$.each(data.data, function(index, item) {
					console.log(item.frequency)
					if(item.frequency == 0) {
						item.frequencyType = '日';
					} else if(item.frequency == 1) {
						item.frequencyType = '周';
					}else if(item.frequency == 2) {
						item.frequencyType = '月';
					} if(item.frequency == 3) {
						item.frequencyType = '季度';
					} if(item.frequency == 4) {
						item.frequencyType = '年度';
					}
					console.log(item.frequencyType)
				})
				// 	scoreArr += item.score
					
				// });
				// if(hasScore == false){
				// 	totalScore = scoreArr;
				// 	// $$('.scoreInfoTitle').html('你的积分：' + totalScore + '分');
				// }
				// console.log(totalScore);
				if(isLoadmore) {
					$$('.userScoreInfoList ul').append(infoTemplate(data.data));
				} else {
					var li = $$('.userScoreInfoList ul li');
					console.log(li);
					for(var i=0; i<li.length; i++){
						if(i != 0){
							li[i].remove();
						}
					}
					$$('.userScoreInfoList ul').append(infoTemplate(data.data));
				}
				loading = false;
			} else {
				if(isLoadmore == false) {
					app.myApp.alert('暂时没有积分规则');
				}
			}
		});
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			// Emulate 2s loading
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				scoreInfo(false);
				app.myApp.pullToRefreshDone();
			}, 1000);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			// pageNo += 1;
			// scoreInfo(true);
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