define(['app',
	'hbs!js/hbs/discuss'
], function(app, discussTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载所有聊天室接口
	var chatListPath = app.basePath + '/mobile/blog/topic/all';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('discuss/discuss', [
//			'discuss/discussChatRoom',
//			'discuss/discussAdd',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		clickEvent(page);
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
		loadChatList();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleChatList(pageDataStorage['chatList']);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.chatRoom-add').on('click', chatRoomAdd);
	}

	/**
	 * 获取所有聊天室
	 */
	function loadChatList() {
		app.ajaxLoadPageContent(chatListPath, {

		}, function(data) {
			$$('.discuss-not-found').hide();
			console.log(data.data);
			pageDataStorage['chatList'] = data.data;
			handleChatList(data.data);
		});
	}

	/**
	 * 加载所有聊天室
	 */
	function handleChatList(data) {
		if(data && data.length > 0) {
			
			for(var i=0; i<data.length;i++){
				data[i].createdDate = app.getnowdata(data[i].createdDate);
			}
			console.log(data)
			$$('.chatRoom-list ul').html(discussTemplate(data));
			loading = false;
			$$('.discuss-content').on('click', function(e) {
				var roomId = $$(this).data('id');
				var roomTitle = $$(this).data('title');
				loadChatRoom(roomId, roomTitle);
			});
		} else {
			$$('.chatRoom-list ul').html('');
			$$('.discuss-not-found').show();
		}
	}

	//点击聊天室
	function loadChatRoom(roomId, roomTitle) {
		app.myApp.getCurrentView().loadPage('discussChatRoom.html?roomId=' + roomId + '&roomTitle=' + roomTitle);
	}

	//新增聊天室
	function chatRoomAdd() {
		app.myApp.getCurrentView().loadPage('discussAdd.html');
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
				loadChatList();
				app.myApp.pullToRefreshDone();
			}, 1000);
		});
		/*
		// 加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			_page += 1;
			loadServices(_page, true);
		});
		*/
	}

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		loadChatList: loadChatList,
		resetFirstIn: resetFirstIn,
	}
});