define(['app',
	'hbs!js/hbs/contactsUserInfo'
], function(app, userInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查找人员信息
	var fingUserInfoPath = app.basePath + 'extContact/findUserInfo';
	var userId = 0;
	var userName = '';
	var vilId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('firstSecretary/firstSecretaryDetail', [
//			'firstSecretary/firstSecretaryRecord',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
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
		vilId = parseInt(pageData.isVil);
		userId = pageData.userId;
		userName = '';
		ajaxLoadContent(userId);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleContent(pageDataStorage['content']);
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		console.log(vilId);
		if(vilId) {
			$$('.fSignReport').css('display', 'block');
			$$('.fSignReport').on('click', fSignReport);
			$$('.firstRecord').on('click', firstVilRecord);
		} else {
			$$('.firstRecord').on('click', firstRecord);
		}
		$$('.firstInfoList .item-content').on('click', clickContent);
	}
	
	/**
	 * 查看考勤统计
	 */
	function fSignReport() {
		app.myApp.getCurrentView().loadPage('signPersonReport.html?userId=' + userId);
	}
	
	/**
	 * 查看日志 
	 */
	function firstRecord() {
		app.myApp.getCurrentView().loadPage('firstSecretaryRecord.html?userId=' + userId + '&userName=' + userName);
	}
	
	/**
	 * 查看贫困村书记个人日志 
	 */
	function firstVilRecord() {
		app.myApp.getCurrentView().loadPage('firstSecretaryOwnDaily.html?vilId=' + vilId + '&userId=' + userId + '&userName=' + userName);
	}

	/**
	 * 点击内容 
	 */
	function clickContent() {
		if($$($$(this).find('.item-title')[0]).html() == '用户头像') {
			if($$('.firstInfoList img').attr('src') == 'img/icon/icon-user_d.png') {
				app.myApp.alert('该用户还未设置头像');
				return;
			}
			var photoBrowserPopup = app.myApp.photoBrowser({
				photos: [$$('.firstInfoList img').attr('src')],
				theme: 'dark',
				backLinkText: '关闭',
				type: 'popup'
			});
			photoBrowserPopup.open();
			return;
		} else if($$($$(this).find('.item-title')[0]).html() == '个人日志') {
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
			$$('.firstInfoList img').attr('src', data.headPic);
		}
		$$('.firstInfoList ul').append(userInfoTemplate(data));
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(userId) {
		app.ajaxLoadPageContent(fingUserInfoPath, {
			userId: userId,
		}, function(data) {
			console.log(data);
			data.headPic = app.basePath + data.headPic;
			pageDataStorage['content'] = data;
			handleContent(data);
		});
	}

	/*
	 * 加载数据
	 */
	function handleContent(data) {
		userName = data.userName;
		$$('.firstName').html(data.userName);
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