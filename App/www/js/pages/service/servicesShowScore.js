define(['app',
	'hbs!js/hbs/showScore'
], function(app, showScoreTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	// 获取服务参与人
	var actorPath = app.basePath + '/mobile/volunteer/joins/';
	var sid = 0;

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
		sid = pageData.sid;
		showScore();
	}

	function showScore() {
		app.ajaxLoadPageContent(actorPath + sid, {
			// serviceId: sid
		}, function(data) {
			console.log(data);
			if(data.data.actors) {
				var users = data.data.actors;
				var max = data.data.max == undefined ? 10 : data.data.max;
				var min = data.data.min == undefined ? 0 : data.data.min;
				$$('.showScoretitle').html('当前打分规则:分数在' + min + '～' + max + '之间 不能超过这个分数区间');
				for(var i = 0; i < users.length; i++) {
					if(users[i].score == undefined) {
						users[i].score = 0;
					}
				}

				var html = showScoreTemplate(users);
				$$('.showScorelist').html(html);
			} else {
				$$('.showScorelist').html('<span style="color:red">未找到对应的评分结果</span>');
			}
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