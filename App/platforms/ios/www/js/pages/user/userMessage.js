define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//留言
	var messagePath = app.basePath + 'extUserPage/sendMessageByUserId';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		clickEvent(page);
		app.back2Home();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.webim-send-btn').on('click', function() {
			sendMsg($$('#chatArea').val());
		});
	}

	function sendMsg(msg) {
		if(!msg) {
			app.myApp.toast('请留言', 'none').show(true);
		} else {
			app.ajaxLoadPageContent(messagePath, {
				message: msg,
				name: app.user.userName
			}, function(data) {
				console.log(data.data);
				if(data.data.success) {
					$$('#chatArea').val('');
					app.myApp.alert('您的留言已成功发送，感谢您的支持！<br />我们会第一时间把回复反馈给您！');
				} else {
					app.myApp.toast('发送失败！', 'error').show(true);
				}
			});
		}
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent('UrlPath', {

		}, function(data) {
			console.log(data);
		});
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
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
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