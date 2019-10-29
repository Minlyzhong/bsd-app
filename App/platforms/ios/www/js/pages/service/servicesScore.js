define(['app',
	'hbs!js/hbs/takeScore'
], function(app, takeScoreTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载加分页面
	var actorPath = app.basePath + 'extVoluntaryService/findVoluntaryActor';
	//保存分数
	var scoreSavePath = app.basePath + 'extVoluntaryService/saveVolScore';
	var sid = 0;
	var ruleId = 0;
	var users = 0.0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
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
		sid = pageData.sid;
		takeScore();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.scoreSave').on('click', saveScore);
	}

	/**
	 * 保存服务打分
	 */
	function saveScore() {
		var scores = $$('.Scores');
		$$.each(scores, function(index, item) {
			users[index].score = parseFloat($$(item).val());
		});
		console.log(users);
		//		return;
		if(!score) {
			app.myApp.alert('请输入分数');
			return;
		} else if(score > 10 || score < 0) {
			app.myApp.alert('请输入正确的分数');
			return;
		}
		app.ajaxLoadPageContent(scoreSavePath, {
			actorId: JSON.stringify(users),
			voluntaryId: sid,
			ruleId: ruleId,
		}, function(data) {
			console.log(data);
			if(data.data.success) {
				app.myApp.toast('完成打分', 'success').show(true);
				app.myApp.getCurrentView().back();
			} else {
				app.myApp.alert('打分失败，请稍后再试');
			}
		});
	}

	function takeScore() {
		app.ajaxLoadPageContent(actorPath, {
			serviceId: sid
		}, function(data) {
			console.log(data);
			if(data.users) {
				ruleId = data.id;
				users = data.users;
				var max = data.max == undefined ? 10 : data.max;
				var min = data.min == undefined ? 0 : data.min;
				$$('.takeScoretitle').html('当前打分规则:分数在' + min + '～' + max + '之间 不能超过这个分数区间');

				var html = takeScoreTemplate(users);
				$$('.takeScorelist').html(html);
			} else {
				$$('.takeScorelist').html('<span style="color:red">还未有人报名该服务</span>');
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