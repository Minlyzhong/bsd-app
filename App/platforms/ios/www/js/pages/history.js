define(['app','hbs!js/hbs/history'], function(app,historyTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	//查找用户所参加的会议列表接口
	var findMeetingNoticePath = app.basePath + 'meetingNotice/findMeetingNoticeByUserId';
	
	//修改信息状态接口：
	var modifyMeetingActorStatePath = app.basePath + 'meetingNotice/modifyMeetingActorState';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		attrDefine(page);
		app.back2Home();
		findMeetingNotice();
		pushAndPull(page)
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		//meetingId = page.query.meetingId;
	}
	//查找用户所参加的会议列表接口
	function findMeetingNotice(){
		app.ajaxLoadPageContent(findMeetingNoticePath, {
			userId:app.userId,
		}, function(data) {
			console.log(data);
			$$('.historyList').append(historyTemplate(data));
			$$('.hL').on('click',function(){
				var meetingId = $$(this).data('mid');
				app.myApp.getCurrentView().loadPage('notice.html?meetingId='+meetingId);
			});
			$$('.swipeout-delete').on('click',function(){
				var meetingId = $$(this).data('mid');
				modifyMeetingActorState(meetingId);
			})
		});
	}
	//修改信息状态接口
	function modifyMeetingActorState(meetingId){
		app.ajaxLoadPageContent(modifyMeetingActorStatePath, {
			userId:app.userId,
			meetingId:meetingId
		}, function(data) {
			console.log(data);
			findMeetingNotice();
		});
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent1 = $$(page.container).find('.pull-to-refresh-content');
		ptrContent1.on('refresh', function(e) {
//				pageNo = 1;
//				loading = true;
				//这里写请求
		$$('.historyList ul').html("");
		findMeetingNotice();
		app.myApp.pullToRefreshDone();
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