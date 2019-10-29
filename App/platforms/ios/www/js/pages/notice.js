define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	//通知接口
	var findMeetingNoticePath = app.basePath + 'meetingNotice/findMeetingNotice';
	var meetingId = 0;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		attrDefine(page);
		showNotice();
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		meetingId = page.query.meetingId;
	}
	
	function showNotice(){
		app.ajaxLoadPageContent(findMeetingNoticePath, {
			mtId:meetingId
		}, function(data) {
			console.log(data);
			$$('.news_title').html(data.meetingTitle);
			$('.new-content').html(data.meetingContent);
			$('.mettingTime').html('开始时间 : '+data.meetingTime);
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