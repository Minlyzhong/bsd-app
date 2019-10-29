define(['app',
	'hbs!js/hbs/peopleScoreInfo'
], function(app, infoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//积分明细接口
	var userScoreInfoPath = app.basePath + '/mobile/political/score/detail/list';
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
		
		scoreInfo(false);

	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {

	
	}


	//积分明细
	function scoreInfo(isLoadmore) {
		app.ajaxLoadPageContent(userScoreInfoPath, {
			userId: app.userId,
			current: pageNo,
			size: 20,
		}, function(data) {
			console.log(data);
			if(data.data.records && data.data.records.length > 0) {
				
				// $$.each(data.data.records, function(index, item) {
				// 	if(item.typeKey == "ARTICLE") {
				// 		item.typeKey = '文章';
				// 	} else if(item.typeKey == "FORUM") {
				// 		item.typeKey = '论坛';
				// 	}
				// 	scoreArr += item.score
					
				// });
				// if(hasScore == false){
				// 	totalScore = scoreArr;
				// 	// $$('.scoreInfoTitle').html('你的积分：' + totalScore + '分');
				// }
				// console.log(totalScore);
				if(isLoadmore) {
					$$('.peopleScoreInfoList ul').append(infoTemplate(data.data.records));
				} else {
					$$('.peopleScoreInfoList ul').append(infoTemplate(data.data.records));
				}
				loading = false;
			} else {
				if(isLoadmore == false && pageNo == 1) {
					console.log('无');
					$$('.peopleScoreInfoList ul').append('<div style="text-align: center;">暂无积分</div>');
					app.myApp.alert('您还没积分哦，积极参与活动吧！');
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