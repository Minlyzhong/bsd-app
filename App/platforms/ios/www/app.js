require.config({
	paths: {
		handlebars: "lib/handlebars",
		text: "lib/text",
		hbs: "lib/hbs",
		home: "js/pages/home",
		contacts: "js/pages/contacts",
		appList: "js/pages/appList",
		user: "js/pages/user",
		assessment: "js/pages/assessment",
		assessWork: "js/pages/assessWork",
		assessDemand: "js/pages/assessDemand",
		deptRank: "js/pages/deptRank",
		discuss: "js/pages/discuss",
		firstSecretary: "js/pages/firstSecretary",
		partyDynamic: "js/pages/partyDynamic",
		payment: "js/pages/payment",
		rank: "js/pages/rank",
		record: "js/pages/record",
		service: "js/pages/service",
		signReport: "js/pages/signReport",
		sign: "js/pages/sign",
		exam: "js/pages/exam",
		eduVideo: 'js/pages/eduVideo',
	},
	shim: {
		handlebars: {
			exports: "Handlebars"
		}
	}
});

define('app', ['lib/router', 'lib/utils'], function(Router, Utils) {
	Router.init();
	var myApp = new Framework7({
		swipePanel: true,
		tapHold: true,
//		smartSelect初始化
//		smartSelectBackText: '返回',
//	    smartSelectPickerCloseText: '完成',
//	    smartSelectPopupCloseText: '关闭',
//	    swipePanelOnlyClose: true,
		//		pushState: true,
		cache: true,
		//				preloadPreviousPage:false,
		modalTitle: '党建E网通',
		modalButtonOk: '确定',
		modalButtonCancel: '取消',
		//		modalCloseByOutside:true,
		//		popupCloseByOutside:true,
	});
	var mainView = myApp.addView('#home', {
		domCache: true,
	});
	var conView = myApp.addView('#contacts', {
		domCache: true,
	});
	var appView = myApp.addView('#appList', {
		domCache: true,
	});
	var userView = myApp.addView('#user', {
		domCache: true,
	});

	var $$ = Dom7;

	/**
	 * ajax请求
	 * @param {Object} _url url
	 * @param {Object} _data 参数对象
	 * @param {Object} _callback 成功回调
	 */
	var ajaxLoadPageContent = function(_url, _data, _callback, _options) {
		var options = $.extend({
				async: true,
				type: 'POST',
			},
			_options);
		myApp.showPreloader('加载中...');
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			success: function(data) {
				if(_callback) _callback(data);
				//后来加的
				myApp.hidePreloader();
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};
	/*
	 * ajax请求
	 */
	var ajaxLoadPageContent1 = function(_url, _data, _callback, _options) {
		var options = $.extend({
				async: true,
				type: 'POST',
			},
			_options);
		//myApp.showPreloader('加载中...');
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			success: function(data) {
				if(_callback) _callback(data);
				//后来加的
				//myApp.hidePreloader();
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};

	/**
	 * 销毁子页面缓存
	 * @param {Object} parentPage 父页面
	 * @param {Object} pages 需要销毁的页面
	 */
	var pageStorageClear = function(parentPage, pages) {
		if(pages.length) {
			var pageArr = [];
			$$.each(pages, function(index, item) {
				if((typeof item == 'string') && item.constructor == String) {
					pageArr[index] = myApp.onPageBack(item, function(e) {
						require('js/pages/' + item).resetFirstIn();
					});
				} else {
					pageArr.push(item);
				}
			});
			var parent = myApp.onPageBeforeRemove(parentPage, function(e) {
				$$.each(pageArr, function(index, item) {
					item.remove();
				});
				parent.remove();
			});
		}
	}

	/**
	 * 返回首页
	 */
	function back2Home() {
		$$('.icon-home').on('click', function() {
			var specialView = '';
			var id = $$('.views .active').attr('id');
			if(id == 'home') {
				specialView = mainView;
			} else if(id == 'contacts') {
				specialView = conView;
			} else if(id == 'appList') {
				specialView = appView;
			} else if(id == 'user') {
				specialView = userView;
			}
			specialView.router.back({
				pageName: id + '/' + id,
				force: true,
			});
		});
	}
	
	//移除css文件和js文件
	function removejscssfile(filename, filetype){ 
		//判断文件类型 
		var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; 
		//判断文件名 
		var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; 
		var allsuspects=document.getElementsByTagName(targetelement); 
		//遍历元素， 并删除匹配的元素 
		for (var i=allsuspects.length; i>=0; i--){ 
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
				allsuspects[i].parentNode.removeChild(allsuspects[i]); 
			}
			
		} 
	} 
	/*
	var preprocess = function(content, url, next) {
		var kpiType = localStorage.getItem('kpiType');
		console.log(kpiType);
		if(kpiType && kpiType == 1){
			if(url == 'pages/kpi.html'){
				url = 'pages/kpi2.html';
			}
			
			if(url == 'pages/users.html'){
				url = 'pages/users1.html';
			}
		}else if(kpiType && kpiType == 2){
			if(url == 'pages/kpi.html'){
				url = 'pages/kpi1.html';
			}
			
			if(url == 'pages/users.html'){
				url = 'pages/users2.html';
			}
		}
		ajaxLoadPageContent(url,function(data){
			next(data);
		});
	};

	function addView(viewId) {
		var viewSelector = '#' + viewId;
		console.log(viewSelector);
		$$('.views').find('.view').removeClass('view-main active');
		$$(viewSelector).addClass('view-main active');

		var toolbarItem = $$(viewSelector).parent().find('a[href="' + viewSelector + '"]');
		toolbarItem.parent().children().removeClass('active');
		toolbarItem.addClass('active');

		var defaultOptions = {
			preprocess: function(content, url, next) {
				return preprocess(content, url, next);
			}
		};
		var view = myApp.addView(viewSelector, defaultOptions);
		view.router.refreshPage();
	}

	$$('div.view.tab').on('show', function(e) {
		var viewId = e.target.id;
		addView(viewId);
	});
	
*/
	//	$$(document).on('ajaxStart', function(e) {
	//		//		myApp.showIndicator();
	//		myApp.showPreloader('加载中...');
	//	});
	$$(document).on('ajaxComplete', function(e) {
		//		myApp.hideIndicator();
		myApp.hidePreloader();
	});

	$$(document).on('ajaxError', function(e) {
		//		myApp.hideIndicator();
		myApp.hidePreloader();
	});
	// 测试库
	//	var basePath = 'http://192.168.11.13:80/';
	//	var basePath = 'http://192.168.11.80:80/';
	//	var basePath = 'http://120.24.51.37:91/';
	//  var basePath = 'http://120.24.51.37:91/';
	
	
		var basePath = 'http://120.24.51.37:89/';
	
	
	//	var basePath = 'http://192.168.11.9:8080/';
		
	//	var basePath = 'http://120.24.51.37:90/';
	
	// 藤县党建(内测)
	//	var basePath = 'http://120.24.51.37:91/';
	//	var basePath = 'http://120.24.51.37:91/'
	
	//	建辉电脑ip
	//	var basePath = 'http://192.168.11.13:8080/';
	//	var basePath = 'http://123.160.220.35:15101/';
	//	var basePath = 'http://192.168.11.9/';
	// 	经理ip
	//	var basePath = 'http://192.168.11.15:80/';
	//	智慧党建
	//	var basePath = 'http://120.24.51.37:8080/';
	//	var basePath = 'http://120.24.51.37:90/';
	
	//	 正式库
	//	var basePath = 'http://117.141.245.7:8089/';
	//	后台开发人员测试库
	//  var basePath = 'http://192.168.11.3/';
	//  后台开发人员花生壳服务器                  
	//	var basePath = 'http://167l4l4522.51mypc.cn:14824/';

	var userId = parseInt(localStorage.getItem('userId')) || -1;
	var user = localStorage.getItem('user');
	var roleId = parseInt(localStorage.getItem('roleId'));
	if(isNaN(roleId)) {
		roleId = -1;
	}
	var headPic = localStorage.getItem('headPic') || 0;
	if(headPic == 0) {
		headPic = 'img/icon/icon-user_d.png';
	}
	if(userId == -1) {
		userId = -1;
		headPic = 'img/icon/icon-user_d.png';
	}
	if(roleId == -1) {
		roleId = -1;
	}
	if(user) {
		user = JSON.parse(user);
	}

	return {
		version: '1.0.10',
		myApp: myApp,
		basePath: basePath,
		mainView: mainView,
		userId: userId,
		roleId: roleId,
		user: user,
		headPic: headPic,
		router: Router,
		utils: Utils,
		ajaxLoadPageContent: ajaxLoadPageContent,
		ajaxLoadPageContent1:ajaxLoadPageContent1,
		pageStorageClear: pageStorageClear,
		back2Home: back2Home,
		removejscssfile:removejscssfile,
		//		appKey: '1138161114178609#qsdj1114kwan',
		//		org_name: '1138161114178609',
		//		app_name: 'qsdj1114kwan',
		//		client_id: 'YXA6-C15oKoPEeaZwntwI1gMow',
		//		client_secret: 'YXA678tTjHSozZdRcn8QrGe-tscbVc8'
	};
});