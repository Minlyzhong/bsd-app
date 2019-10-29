define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//添加聊天室接口
	var servicesAddPath = app.basePath + 'extChatPage/addChatRoom';

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
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.savediscuss').on('click', saveDiscussAdd);
	}

	/**
	 * 新建话题
	 */
	function saveDiscussAdd() {
		var dName = $$('#discussName').val();
		if(!dName) {
			app.myApp.alert('请确认话题名称！');
			return;
		}
		var dContent = $$('#discussContent').val();
		app.ajaxLoadPageContent(servicesAddPath, {
			userId: app.userId,
			roomCreater: app.user.userName,
			roomTitle: dName,
			description: dContent
		}, function(data) {
			console.log(data);
			if(data.success) {
				require(['js/pages/discuss/discuss'], function(discuss) {
					discuss.loadChatList();
				});
				setTimeout(function() {
					app.myApp.getCurrentView().back();
				}, 1000);
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