define(['app',
	'hbs!js/hbs/examRank'
], function(app, examTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载排名
	var findSubjectRankPath = app.basePath + 'exam/findSubjectRank';
	var id = 0;
	var name = '';
	var count = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('exam/examRank', [
//
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		$$('.examR .pageTitle').html(page.query.name);
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
		id = parseInt(pageData.id);
		name = pageData.name;
		count = parseInt(pageData.count);
		ajaxLoadContent();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleExamRank(pageDataStorage['examRank'], false);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent(findSubjectRankPath, {
			subjectId: id,
			userId: app.userId,
		}, function(data) {
			pageDataStorage['examRank'] = data;
			//console.log(data.length - 1);
			console.log(data);
			$$.each(data, function(index, item) {
				item.basePath = app.basePath;
				item.own = 0;
				if(index == data.length - 1) {
					item.own = 1;
				}
//				console.log(index);
//				console.log(item);
			});
			if(data.length < 2) {
				app.myApp.alert('暂无排名', function() {
					app.myApp.getCurrentView().back();
				});
			} else {
				ownData = data.splice(data.length - 1, 1);
				console.log(ownData);
				handleExamRank(data);
				handleExamOwnRank(ownData);
			}
		});
	}

	/**
	 * 处理得分明细
	 * @param {Object} data 得分数据
	 */
	function handleExamRank(data) {
		if(data.length > 0) {
			$$('.examRankList ul').html(examTemplate(data));
			$$('.examRankList .item-content').on('click', examRankClick);
		}
	}

	/**
	 * 处理得分明细
	 * @param {Object} data 得分数据
	 */
	function handleExamOwnRank(data) {
		if(data.length > 0) {
			$$('.examRankPerson ul').html(examTemplate(data));
			if(data[0].rank) {
				$$('.examRankPerson .item-content').on('click', examRankClick);
			}
		}
	}

	/**
	 * 点击事件
	 */
	function examRankClick() {
		var time = $$(this).data('useTime'),
			userName = $$(this).data('userName'),
			yes = parseInt($$(this).data('yes')),
			no = count - yes;
		app.myApp.alert('<div style="text-align:left; margin-left: 10%;">试卷标题: ' + name + '<br/ >答题者: ' + userName + '<br />考试用时: ' + time + '<br />试题数量: ' + count + '道<br />答对: ' + yes + '道<br />答错: ' + no + '道</div>');
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
				ajaxLoadContent();
				app.myApp.pullToRefreshDone();
			}, 500);
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