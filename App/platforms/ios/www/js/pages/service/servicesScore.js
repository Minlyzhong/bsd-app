define(['app',
	'hbs!js/hbs/takeScore'
], function(app, takeScoreTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取服务参与人
	var actorPath = app.basePath + '/mobile/volunteer/joins/';
	//保存分数
	var scoreSavePath = app.basePath + '/mobile/volunteer/score/';
	var sid = 0;
	var ruleId = 0;
	var users = 0.0;

	var max = 10;
	var min = 0;

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
		var userScore = [];
		var flag = true;
		$$.each(scores, function(index, item) {
			var tem = {score:0,userId:0 }
			users[index].score = parseFloat($$(item).val());
			tem.score = parseFloat($$(item).val());
			tem.userId = users[index].userId;
			userScore.push(tem);

			if(!tem.score) {
				app.myApp.alert('请输入分数');
				flag = false;
				return;
			} else if(tem.score > max || tem.score < min) {
				app.myApp.alert('请输入正确的分数');
				flag = false;
				return;
			}
		});
		console.log(users);
		console.log(userScore);
		if(flag == false){
			return;
		}
		
		//		return;
		// if(!score) {
		// 	app.myApp.alert('请输入分数');
		// 	return;
		// } else if(score > 10 || score < 0) {
		// 	app.myApp.alert('请输入正确的分数');
		// 	return;
		// }

		$$.ajax({
            url:scoreSavePath + sid ,
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: JSON.stringify(userScore),
            cache: false,
            success:function (data) {
				if(data.code == 0 ){
					app.myApp.toast('完成打分', 'success').show(true);
					app.myApp.getCurrentView().back(2);
					require(['js/pages/service/service'], function(service) {	
						service.servicesRefresh();
					});
				}else{
					app.myApp.toast('打分失败，请稍后再试', 'error').show(true);
				}
            	
            	
            },
            error:function () {
				app.myApp.alert('打分失败，请稍后再试');
            }
        });

		// app.ajaxLoadPageContent(scoreSavePath, {
		// 	actorId: JSON.stringify(users),
		// 	voluntaryId: sid,
		// 	ruleId: ruleId,
		// }, function(data) {
		// 	console.log(data);
		// 	if(data.data.success) {
				
		// 	} else {
				
		// 	}
		// });
	}

	function takeScore() {
		app.ajaxLoadPageContent(actorPath+sid, {
			// serviceId: sid
		}, function(data) {
			console.log(data);
			var data = data.data;
			if(data.actors) {
				ruleId = data.id;
				users = data.actors;
				max = data.max == undefined ? 10 : data.max;
				min = data.min == undefined ? 0 : data.min;
				$$('.takeScoretitle').html('当前打分规则:分数在' + min + '～' + max + '之间 不能超过这个分数区间');

				var html = takeScoreTemplate(data.actors);
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