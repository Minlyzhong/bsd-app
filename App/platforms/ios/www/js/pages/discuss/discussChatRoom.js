define(['app',
	'hbs!js/hbs/discussChatRoom'
], function(app, roomTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//聊天记录接口
	var chatRecordPath = app.basePath + 'extChatPage/loadChatRoom';
	//发送接口
	var chatSendPath = app.basePath + 'extChatPage/sendContent';
	//首次进入的时间 用于查询历史记录
	var firstTime = '';
	//最后的刷新时间，用于查找新纪录
	var lastTime = '';
	//定时器
	var isBack = 0;
	//聊天的总时间
	var currentTs = '';
	//聊天的历史时间
	var currentHisTs = '';
	var roomId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		$$(document).on('ajaxStart', function(e) {
			//hidePreloader()预加载提示模态框
			app.myApp.hidePreloader();
		});
		var discussChatRoomCB = app.myApp.onPageBeforeRemove('discuss/discussChatRoom', function(e) {
			$$(document).on('ajaxStart', function(e) {
				app.myApp.showPreloader('加载中...');
			});
			isBack = 1;
			discussChatRoomCB.remove();
		});
		initData(page.query);
		app.back2Home();
		attrDefine(page);
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
		currentTs = '';
		currentHisTs = '';
		pageNo = 1;
		isBack = 0;
		roomId = pageData.roomId;
		loadChatRecords(1, pageNo);
		setTimer();
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		//page.query 是获取a标签传来的参数
		$$('.chatRoomName').html(page.query.roomTitle);

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.webim-send-btn').on('click', function() {
			sendContent();
		});
	}

	//发送消息
	function sendContent() {
		var msg = $$('#chatArea').val();
		if(!msg) {
			return;
		}
		$$('.webim-send-btn').attr('disabled', 'true');
		$$('#chatArea').focus();
		app.ajaxLoadPageContent(chatSendPath, {
			lastTime: lastTime,
			userId: app.userId,
			roomId: roomId,
			msg: msg,
			userName: app.user.userName,
		}, function(data) {
			console.log(data);
			$$('#chatArea').val('');
			$$('.webim-send-btn').removeAttr('disabled');
		});
	}

	/**
	 * 加载聊天记录
	 */
	function loadChatRecords(type, pageNo) {
		//根据类型判断回传的时间类型
		var typeTime = '';
		if(type == 3) {
			//3代表查询新记录
			typeTime = lastTime;
		} else {
			//1.2代表查询历史记录
			typeTime = firstTime;
		}
		app.ajaxLoadPageContent(chatRecordPath, {
			roomId: roomId,
			pageNo: pageNo,
			type: type,
			lastTime: typeTime
		}, function(data) {
			if(data.data[1] && data.data[1].length > 0) {
				$$.each(data.data[1], function(index, item) {
					item.owner = parseInt(app.userId);
				});
				//reverse() 颠倒数组顺序
				data.data[1].reverse();
			}
			console.log(data);
			//1 代表第一次进入聊天室
			if(type == 1) {
				lastTime = data.data[0].now;
				firstTime = data.data[0].now;
				if(data.data[1] && data.data[1].length > 0) {
					$$.each(data.data[1], function(index, item) {
						var result = adjustShowTime(currentTs, item.postTime);
						if(result == 1) {
							currentTs = item.postTime;
							var time = item.showTime;
							if(item.postTime.split(" ")[0] < firstTime.split(" ")[0]) {
								time = item.postTime.split(" ")[0] + ' ' + time;
							}
							item.time = time;
							item.strWidth = time.getCurrentWidth() + 12;
						} else {
							item.time = '';
						}
					});
					$$('.discussChatList ul').html(roomTemplate(data.data[1]));
					$$('.discussPage').scrollTop($$('.discussChatList').height(), 0, null);
				}
				//2代表查询历史记录
			} else if(type == 2) {
				currentHisTs = '';
				if(data.data[1] && data.data[1].length > 0) {
					$$.each(data.data[1], function(index, item) {
						//adjustShowTime判定时间间隔大于三分钟
						var result = adjustShowTime(currentHisTs, item.postTime);
						if(result == 1) {
							currentHisTs = item.postTime;
							var time = item.showTime;
							if(item.postTime.split(" ")[0] < firstTime.split(" ")[0]) {
								time = item.postTime.split(" ")[0] + ' ' + time;
							}
							item.time = time;
							item.strWidth = time.getCurrentWidth() + 12;
						} else {
							item.time = '';
						}
					});
					var height = $$('.discussChatList').height();
					$$('.discussChatList ul').prepend(roomTemplate(data.data[1]));
					$$('.discussPage').scrollTop($$('.discussChatList').height() - height, 0, null);
				}
				//3代表刷新列表 （获取一次新纪录）
			} else {
				//记录刷新时间
				lastTime = data.data[0].now;
				if(data.data[1] && data.data[1].length > 0) {
					$$.each(data.data[1], function(index, item) {
						var result = adjustShowTime(currentTs, item.postTime);
						if(result == 1) {
							currentTs = item.postTime;
							var time = item.showTime;
							if(item.postTime.split(" ")[0] < firstTime.split(" ")[0]) {
								time = item.postTime.split(" ")[0] + ' ' + time;
							}
							item.time = time;
							item.strWidth = time.getCurrentWidth() + 12;
						} else {
							item.time = '';
						}
					});
					//roomTemplate()是导入hbs文件的
					$$('.discussChatList ul').append(roomTemplate(data.data[1]));
					$$('.discussPage').scrollTop($$('.discussChatList').height(), 500, null);
				}
				if(!isBack) {
					setTimer();
				}
			}
		});
	}

	//判定时间间隔大于三分钟
	function adjustShowTime(time1, time2) {
		if(time1 == '') {
			return 1;
		}
		var d1 = Date.parse(time1);
		var d2 = Date.parse(time2);
		var differ = (d2 - d1) / 60000;
		if(differ >= 3) {
			return 1;
		}
		return 0;
	}

	//刷新定时器，隔一段时间获取新纪录
	function setTimer() {
		if(isBack) {
			return;
		}
		window.setTimeout(function() {
			loadChatRecords(3, pageNo);
		}, 1000);
	}

	String.prototype.getCurrentWidth = function(font) {
		var f = font || '13px arial',
			o = $('<div>' + this + '</div>')
			.css({
				'position': 'absolute',
				'float': 'left',
				'white-space': 'nowrap',
				'visibility': 'hidden',
				'font': f
			})
			.appendTo($('body')),
			w = o.width();

		o.remove();
		return w;
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
				pageNo += 1;
				loading = true;
				loadChatRecords(2, pageNo);
				app.myApp.pullToRefreshDone();
			}, 2000);
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