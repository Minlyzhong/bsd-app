define(['app',
	'hbs!js/hbs/discussChatRoom'
], function(app, roomTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//聊天记录接口
	var chatRecordPath = app.basePath + '/mobile/blog/topic/detail/';
	//发送接口
	var chatSendPath = app.basePath + '/mobile/blog/topic/';
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

	var createdDate = 0;

	// 定时器
	var timer;
	
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
		createdDate = 0;
		loadChatRecords(1, pageNo);
		setTimer();
		timer=0;
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
		app.ajaxLoadPageContent(chatSendPath+roomId+'/save', {
			// lastTime: lastTime,
			// userId: app.userId,
			// roomId: roomId,
			content: msg,
			// userName: app.user.userName,
		}, function(data) {
			if(data.code == 0){
				console.log(data);
				$$('#chatArea').val('');
				$$('.webim-send-btn').removeAttr('disabled');
	
				if(!isBack) {
					console.log(timer)
					if(timer){
						window.clearInterval(timer);
					}
					setTimer();
				}
			}else{
				app.myApp.toast('发送失败','error').show(true);
			}
			
		},{
			type:'POST'
		});
	}

	/**
	 * 加载聊天记录
	 */
	function loadChatRecords(type, pageNo) {
		console.log('加载聊天记录')
		console.log('type'+type)
		
		//根据类型判断回传的时间类型
		var typeTime = '';
		if(type == 3) {
			//3代表查询新记录
			typeTime = lastTime;
		} else {
			//1.2代表查询历史记录
			typeTime = firstTime;
		}
		app.ajaxLoadPageContent(chatRecordPath+roomId, {
			// roomId: roomId,
			pageNo: pageNo,
			// type: type,
			// lastTime: typeTime
		}, function(data) {
			
			// var result = data.data
			if(data.data && data.data.length > 0) {
				$$.each(data.data, function(index, item) {
					item.owner = parseInt(app.userId);
				});

				
				//reverse() 颠倒数组顺序
				// console.log('倒序')
				// result.reverse();
				
			}else{
				
					if(!isBack) {
						if(timer){
							window.clearInterval(timer);
						}
						
						setTimer();
					}
				
			}
			// console.log(result);
			var resultData = data.data.reverse();
			var resLength = data.data.length-1;
			var nowTime = getnowdata();
			//1 代表第一次进入聊天室
			if(type == 1) {
				console.log('11---代表第一次进入聊天室')
				lastTime = nowTime
				firstTime = nowTime
				
				console.log('createdDate')
				console.log(createdDate)
				console.log(resLength)
				
				createdDate = resultData[resLength].createdDate;
				console.log(createdDate)
				if(resultData && resultData.length > 0) {
					$$.each(resultData, function(index, item) {
						
						var postTimes = getnowdata(item.createdDate, 1)
						console.log('postTimes==='+postTimes)
						var result = adjustShowTime(currentTs, postTimes);
						console.log('result--'+result)
						
						if(result == 1) {
							currentTs = postTimes;
							var time = getnowdata(item.createdDate, 3);
							console.log(time)
							console.log(postTimes.split(" ")[0] < firstTime.split(" ")[0])
							if(postTimes.split(" ")[0] < firstTime.split(" ")[0]) {
								time = postTimes.split(" ")[0] + ' ' + time;
							}

							console.log('postTimes.split(" ")[0]==='+postTimes)
							console.log('firstTime.split(" ")[0]==='+firstTime)
							console.log('item.time1==='+time)
							item.time = time;
							item.strWidth = time.getCurrentWidth() + 12;
						} else {
							item.time = '';
						}
						
					});
					
					// loadChatRecords(0, 0)
					console.log(resultData);
					$$('.discussChatList ul').html(roomTemplate(resultData));
					$$('.discussPage').scrollTop($$('.discussChatList').height(), 0, null);
				}

				
				//2代表查询历史记录
			} else if(type == 2) {
				console.log('22---代表查询历史记录')
				currentHisTs = '';
				if(resultData && resultData.length > 0) {
					$$.each(resultData, function(index, item) {
						//adjustShowTime判定时间间隔大于三分钟
						var postTimes = getnowdata(item.createdDate, 1);
						var result = adjustShowTime(currentHisTs, postTimes);
						if(result == 1) {
							currentHisTs = postTimes;
							var time = getnowdata(item.createdDate, 3);
							if(postTimes.split(" ")[0] < firstTime.split(" ")[0]) {
								time = postTimes.split(" ")[0] + ' ' + time;
							}
							console.log('item.time2==='+time)
							item.time = time;
							item.strWidth = time.getCurrentWidth() + 12;
						} else {
							item.time = '';
						}
					});
					var height = $$('.discussChatList').height();
					$$('.discussChatList ul').prepend(roomTemplate(resultData));
					$$('.discussPage').scrollTop($$('.discussChatList').height() - height, 0, null);
				}
				//3代表刷新列表 （获取一次新纪录）
			} else {
				//记录刷新时间
				console.log('33---记录刷新时间- 刷新是空的')
				// createdDate = result[resLength-1].createdDate;
				// console.log(result);
				// console.log(resLength);

				var dataLength = resultData.length;
				lastTime = nowTime;
				console.log('createdDate');
				console.log(createdDate);
				console.log(resultData);
				console.log(resultData[dataLength-1]);

				if(resultData[dataLength-1].createdDate == createdDate) {
					if(!isBack) {
						if(timer){
							window.clearInterval(timer);
						}
						setTimer();
					}
					return false;

				}else if(resultData[dataLength-1].createdDate !== createdDate ){
						// $$.each(data.data[data.data.length-1], function(index, item) {
						createdDate = resultData[dataLength-1].createdDate;
						
						var lastData = resultData[dataLength-1];
						var postTimes = getnowdata(lastData.createdDate, 1)
						var result = adjustShowTime(currentTs, postTimes);
						console.log(result);
						if(result == 1) {
							
							currentTs = postTimes;
							var time = getnowdata(lastData.createdDate, 3);
							console.log('item.time3=='+time)
							if(postTimes.split(" ")[0] < firstTime.split(" ")[0]) {
								time = postTimes.split(" ")[0] + ' ' + time;
							}
							
							lastData.time = time;
							lastData.strWidth = time.getCurrentWidth() + 12;
						} else {
							lastData.time = '';
						}
					// });
					//roomTemplate()是导入hbs文件的
				
					// $$('.discussChatList ul').html('')
					
					$$('.discussChatList ul').append(roomTemplate(lastData));
					$$('.discussPage').scrollTop($$('.discussChatList').height(), 500, null);
					if(!isBack) {
						if(timer){
							window.clearInterval(timer);
						}
						setTimer();
					}
				}
				
					
				
				console.log('isBack'+isBack)
				
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
		timer = window.setTimeout(function() {
			loadChatRecords(3, 1);
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

		// 获取现在时间
		function getnowdata(time, type){
			
			if(time){
				var date = new Date(time); 
			}else{
				var date =  new Date();
			}
			
			var types = type || 1; 
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
			var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
			var strHour = date.getHours()<10? "0" + date.getHours():date.getHours();
			var strMinutes = date.getMinutes()<10? "0" + date.getMinutes():date.getMinutes();
			var strSecondes = date.getSeconds()<10? "0" + date.getSeconds():date.getSeconds();
			if(types == 1){
				currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
					+ " "  + strHour  + seperator2  + strMinutes
					+ seperator2 + strSecondes;
					
			}else if(types == 2){
				currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
					+ " "  + strHour  + seperator2  + strMinutes;
				
			}else if(types == 3){
				currentdate = strHour  + seperator2  + strMinutes;
					
			}

			console.log('types'+types)
			console.log('currentdate'+currentdate)
			return currentdate;
			
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