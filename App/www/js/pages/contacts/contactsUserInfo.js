define(['app',
		'hbs!js/hbs/contactsUserInfo'
	],
	function(app, userInfoTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		var pageNo = 1;
		var loading = true;
		//查找人员信息
		var fingUserInfoPath = app.basePath + '/mobile/user/getUserInfo/';
		// var fingUserInfoPath = app.basePath + '/mobile/user/searchDeptPeople';
		//查询用户最新四张日志图片url：
		var ownDailyPicPath = app.basePath + '/mobile/worklog/findLatestPicOfWorkLog/';
		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
//			if(firstIn) {
				initData(page.query);
//			} else {
//				loadStorage();
//			}
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
			userId = pageData.userId;
			userName = pageData.userName.split('(')[0];
			console.log(userName);
			ajaxLoadContent(userId);
		}

		/**
		 * 读取缓存数据 
		 */
		function loadStorage() {
			handleEvent(pageDataStorage['content']);
		}

		/**
		 * 点击事件
		 */
		function clickEvent() {
			$$('.userInfoList .item-content').on('click', clickContent);
		}
		
		/**
		 * 点击内容 
		 */
		function clickContent() {
			if($$($$(this).find('.item-title')[0]).html() == '用户头像') {
				if($$('.userInfoList img').attr('src') == 'img/icon/icon-user_d.png') {
					app.myApp.alert('该用户还未设置头像');
					return;
				}
				var photoBrowserPopup = app.myApp.photoBrowser({
					photos: [$$('.userInfoList img').attr('src')],
					theme: 'dark',
					backLinkText: '关闭',
					type: 'popup'
				});
				photoBrowserPopup.open();
				return;
			} else if($$($$(this).find('.item-title')[0]).html() == '手机号码') {
				var telephoneNumber = $('.item-label').html();
				console.log(telephoneNumber);
				//$$($$(this).find('.item-label')[0]).html()
				window.plugins.CallNumber.callNumber(null, null,telephoneNumber, true);
			} else if($$($$(this).find('.item-title')[0]).html() == '个人日志') {
				console.log('个人日志')
				console.log(userId);
				console.log(userName);
				var vilId = $$('.vilId').val();
				console.log(vilId);
				app.myApp.getCurrentView().loadPage('firstSecretaryOwnDaily.html?vilId=' + vilId + '&userId=' + userId + '&userName=' + userName);
			} else {
				app.myApp.alert($$($$(this).find('.item-title')[0]).html() + '：' + $$($$(this).find('.item-label')[0]).html());
			}
		}

		/**
		 * 属性定义（不传参，使用模块变量）
		 */
		function attrDefine(data) {
			if(data.headPic) {
				data.headPic =  data.headPic;
				$$('.userInfoList img').attr('src', data.headPic);
			}
			$$('.userInfoList ul').append(userInfoTemplate(data));
			ajaxLoadContent2(userId);
		}
		
		function ajaxLoadContent2(userId) {
			app.ajaxLoadPageContent(ownDailyPicPath+userId, {
				// userId: userId,
			}, function(data1) {
				console.log(data1);
				newFourDailyPic(data1);
			});
		}
		/**
		 *加载用户最新四张日志图片
		 */
		function newFourDailyPic(data1){
			var str = '';
			str += '<li class="ownDaily" style="height:100px;list-style-type:none;background-color:#fff">'
			str +=		'<a href="#" class="item-link item-content">'
			str +=			'<div class="item-inner">'
			str +=				'<div class="item-title"  style="line-height:85px;overflow:hidden;">个人日志</div>'
			str +=					'<div class="item-after item-label">'
			if(data1.data != ''){
				for(var i=0;i<data1.data.length;i++){
					str +='<img src="'+app.filePath+data1.data[i].attPath+'" style="border-radius:0%;"/>'
				}
			}
			str +=					'</div>'
			str +=			'</div>'
			str +=		'</a>'
			str += '</li>'
			str += '<input type="hidden" class="vilId" value="'+data1.code+'"/>'
			$$(".userInfoList").append(str);
			clickEvent();
		}
		
		
		/**
		 * 异步请求页面数据 
		 */
		function ajaxLoadContent(userId) {
			app.ajaxLoadPageContent(fingUserInfoPath+userId, {
				// userId: userId,
				// name: userName,
			}, function(result) {

				if(result.code == 0 && result.data.partyUser != null){
				
					var data = result.data.partyUser;
					if(result.data.avatar){
						data.headPic = app.filePath + result.data.avatar;
					}else{
						data.headPic = 'img/icon/icon-user_d.png';
					}
	
					if(data.partyTime){
						data.partyTime = data.partyTime.split(' ')[0];
					}
				
				
					console.log('contactsUserInfo');
					console.log(data);
					pageDataStorage['content'] = data;
					handleContent(data);
				}else{
					var data = result.data;
					if(data.avatar){
						data.headPic = app.filePath + data.avatar;
					}else{
						data.headPic = 'img/icon/icon-user_d.png';
					}
	
					pageDataStorage['content'] = data;
					handleContent(data);
				}
			});
		}

		/*
		 * 加载数据
		 */
		function handleContent(data) {
			console.log(data)
			if(data.userName){
				$$('.contactsName').html(data.userName);
			}else{
				$$('.contactsName').html(data.name);
			}
			
			attrDefine(data);
			clickEvent();
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