define(['app',
	'hbs!js/hbs/FirstHanddeptRank'
], function(app, infoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//积分明细接口
	var userScoreInfoPath = app.basePath + '/mobile/partyAm/aLeadertRankingStatisticList';
	//用户积分排名接口
	var userPath = app.basePath + '/mobile/partyAm/aLeadertRankingStatistics';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		pushAndPull(page);
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
		getUserInfo();
		scoreInfo(false);
	}

	//用户信息
	function getUserInfo() {
		app.ajaxLoadPageContent(userPath, {
			
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
					// totalScore = userInfo.totalScore;
					$$('.scoreInfoTitle').html('您的积分：' + userInfo.totalScore + '分');
				}
				if(userInfo.branchRank && userInfo.branchRank != undefined) {
					branchRank = userInfo.branchRank;
					$$('.scoreInfoTitle').html('您的积分：' + userInfo.totalScore + '分   您的排名: '+ userInfo.branchRank);
				}
//			}
			// $$('.scoreInfoTitle').html('你的积分：' + totalScore + '分');
		}, {
			async: false,
			type:'GET'
		});
	}

	//积分明细
	function scoreInfo(isLoadmore) {
		app.ajaxLoadPageContent(userScoreInfoPath, {
			userId: app.userId,
			current: pageNo,
			pageSize: 20,
		}, function(data) {
			console.log(data);
			if(data.data.records && data.data.records.length > 0) {
				$$.each(data.data.records, function(index, item) {
					if(item.typeKey == "ARTICLE") {
						item.typeKey = '文章';
					} else if(item.typeKey == "FORUM") {
						item.typeKey = '论坛';
					}
				});
				if(isLoadmore) {
					$$('.userScoreInfoList ul').append(infoTemplate(data.data.records));
				} else {
					console.log(data.data.records)
					$$('.userScoreInfoList ul').html(infoTemplate(data.data.records));
				}
				loading = false;
			} else {
				if(isLoadmore == false) {
					console.log('您还没积分哦，积极参与活动吧！');
					app.myApp.toast('暂时没有排名信息', 'none').show(true);
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
			pageNo += 1;
			scoreInfo(true);
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