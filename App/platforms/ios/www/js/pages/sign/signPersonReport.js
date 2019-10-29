define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//个人统计
	var getSignTotalPath = app.basePath + 'extApplicationPage/getSignTotal';
	var userId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
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
		userId = parseInt(pageData.userId);
		if(!userId) {
			userId = app.userId;
		}
		getSignTotal();
	}

	/**
	 * 查询个人考勤统计 
	 */
	function getSignTotal() {
		console.log(userId);
		app.ajaxLoadPageContent(getSignTotalPath, {
			userId: userId,
		}, function(result) {
			var data = result;
			console.log(data);
			var report = ['day', 'week', 'month'];
			$$.each(report, function(_, item1) {
				$$.each($$('.' + item1).find('.item-title'), function(index, item2) {
					var arr = data[item1];
					$(item2).append(arr[index] + '次');
				});
			});
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