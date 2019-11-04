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
		cache: true,
		modalTitle: '党建E网通',
		modalButtonOk: '确定',
		modalButtonCancel: '取消',
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
				type: 'GET',
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
				type: 'GET',
			},
			_options);
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			success: function(data) {
				if(_callback) _callback(data);
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};


	/*
	 * ajax请求
	 */
	var ajaxWithHeader = function(_url, _data,headers, _callback,_callbackError, _options) {
		var options = $.extend({
				async: true,
				type: 'POST',
			},
			_options);
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			headers:headers,
			success: function(data) {
				if(_callback) _callback(data);
			},
			error: function(data) {
				if(_callbackError) _callbackError(data);
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
	/**
	 * 返回首页(日志)
	 */
	function back3Home() {
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
	//判断时候本周的时间
	function getTime(n){
		//'Mon Dec 31 2018 11:44:07 GMT+0800 (中国标准时间)'
		//'Sun Jul 01 2018 11:44:07 GMT+0800 (中国标准时间)'
		var now=new Date();
		var year=now.getFullYear();
		//因为月份是从0开始的,所以获取这个月的月份数要加1才行
		var month=now.getMonth()+1;	
		var date=now.getDate();
		var day=now.getDay();
		//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
		if(day!==0){
			n=n+(day-1);
		}
		else{
			n=n+day;
		}
		if(day){
			//这个判断是为了解决跨年的问题
			if(month>1){
				month=month;
			}
			//这个判断是为了解决跨年的问题,月份是从0开始的
			else{
				year=year-1;
				month=12;
			}
		}
		now.setDate(now.getDate()-n);	
		year=now.getFullYear();
		month=now.getMonth()+1;
		date=now.getDate();
		s=year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
		return s;
	}	
	//判断该时间是否符合本周
	function isWeek(startDay,endDay,today){
		var startDay0 = parseInt(startDay.split('-')[0]);
		var startDay1 = parseInt(startDay.split('-')[1]);
		var startDay2 = parseInt(startDay.split('-')[2]);
		var endDay0 = parseInt(endDay.split('-')[0]);
		var endDay1 = parseInt(endDay.split('-')[1]);
		var endDay2 = parseInt(endDay.split('-')[2]);
		var today0 = parseInt(today.split('-')[0]);
		var today1 = parseInt(today.split('-')[1]);
		var today2 = parseInt(today.split('-')[2]);
		//第一种情况本年（例如都在2018年）
		if(startDay0 == today0 && endDay0 == today0){
			//开始月份和结束月份相同 （例如都在2018年6月）
			if(startDay1 == today1 && endDay1 == today1){
				//判断今天在本周的开始时间和结束时间内就可以了
				if(startDay2 <= today2 && endDay2 >= today2){
					return true;
				}
			}
			//开始月份相同，结束月份不相同（例如在2018年6月和2018年7月）
			if(startDay1 == today1 && endDay1 > today1){
				//只需判断今天的时候大于等于开始时间
				if(startDay2 <= today2){
					return true;
				}
			}
			//开始月份不相同，结束月份相同 （例如在2018年6月和2018年7月）
			if(startDay1 < today1 && endDay1 == today1){
				//只需判断今天的时候大于等于开始时间
				if(endDay2 >= today2){
					return true;
				}
			}
		}
		//今天是2019-1-1 本周的时间是2018-2019之间的情况 
		else if(startDay0 < today0 && endDay0 == today0){
			if(endDay2 >= today2){
				return true;
			}
		}
		//今天是2018-12-31 本周的时间是2018-2019之间的情况 
		else if(startDay0 == today0 && endDay0 > today0){
			if(startDay2 <= today2){
				return true;
			}
		}
		return false;	
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

			// console.log('types'+types)
			// console.log('currentdate'+currentdate)
			return currentdate;
			
		}

	function isJSON (str, pass_object) {
		if (pass_object && isObject(str)) return true;
	  
		// if (!isString(str)) return false;
	  
		str = str.replace(/\s/g, '').replace(/\n|\r/, '');
	  
		if (/^\{(.*?)\}$/.test(str))
		  return /"(.*?)":(.*?)/g.test(str);
	  
		if (/^\[(.*?)\]$/.test(str)) {
		  return str.replace(/^\[/, '')
			.replace(/\]$/, '')
			.replace(/},{/g, '}\n{')
			.split(/\n/)
			.map(function (s) { return isJSON(s); })
			.reduce(function (prev, curr) { return !!curr; });
		}
	  
		return false;
	  }

	// 发送网络请求之前, 如果没有token就跳到登录
	$$(document).on('ajaxStart', function(e) {
		var xhr = e.detail.xhr;
		// console.log(xhr);
		var params = xhr.requestParameters;
		var user = localStorage.getItem('user');
		// console.log(user);
		if(user == -1 || user ==''|| user == null || user == undefined){
			if(params.url.indexOf('/oauth/token')  && params.url.indexOf('/political/content/columnArticles')== -1  && params.url.indexOf('/political/catalog/icon') == -1 && params.url.indexOf('/political/content/info') == -1 && params.url.indexOf('/content/loadMobileFacebook') == -1 && params.url.indexOf('/political/content/findAll') == -1 && params.url.indexOf('/apkEdition/check/update') == -1 && params.url.indexOf('/worklog/page/recommend/list') == -1 && params.url.indexOf('mobile/worklog/detailNoVillage/') == -1 && params.url.indexOf('/worklog/comments/') == -1 && params.url.indexOf('/worklog/photos/') == -1 && params.url.indexOf('mobile/worklog/likes/') == -1 == -1  ){
			
				var access_token = this.access_token;
				if(access_token == null || access_token == ''){
					access_token = localStorage.getItem('access_token');
					if(access_token == null || access_token == ''){
						isLog = false;
						console.log('返回');
					 //    var nowView = myApp.getCurrentView();
					 //    nowView.router.loadPage('login.html')
						myApp.getCurrentView().loadPage('login.html');
						
	 
					 
					}
					
				}
			 //    console.log(access_token);
				xhr.setRequestHeader("Authorization", "bearer "+ access_token);
			 }
		}else{
			if(params.url.indexOf('/oauth/token')  == -1  ){
			
				var access_token = this.access_token;
				if(access_token == null || access_token == ''){
					access_token = localStorage.getItem('access_token');
					if(access_token == null || access_token == ''){
						isLog = false;
						console.log('返回');
					 //    var nowView = myApp.getCurrentView();
					 //    nowView.router.loadPage('login.html')
						myApp.getCurrentView().loadPage('login.html');
						
	 
					 
					}
					
				}
			 //    console.log(access_token);
				xhr.setRequestHeader("Authorization", "bearer "+ access_token);
			 }
		}
		
		
   });


   $$(document).on('ajaxComplete', function(e) {
	var xhr = e.detail.xhr
	// console.log(xhr)

	var isjson = isJSON(xhr.responseText)
	
	if(isjson){
		var code = JSON.parse(xhr.responseText)
		if(code.code && code.code == 401){
			isLog = false;
			console.log('返回2')
			
			userId = -1;
			user = '';
			userDetail = '';
			roleId = -1;
			headPic = 'img/icon/icon-user_d.png';
			$$('.user-header img').attr('src', headPic);

			localStorage.setItem('headPic', 0);
			localStorage.setItem('userId', -1);
			localStorage.setItem('user', '-1');
			localStorage.setItem('userDetail', '-1');
			localStorage.setItem('password', null);
			localStorage.setItem('verify', '1');
			localStorage.setItem('roleId', -1);
			localStorage.setItem('access_token', null);
			//把主题设置为默认的，移除css
			removejscssfile('blue.css','css');
			removejscssfile('green.css','css');
			// myApp.getCurrentView().loadPage('login.html');

			//新闻速递只给管理员，党组织管理员和乡镇管理员（3，4，5）
			// if(roleId == 4 || roleId == 5 || roleId ==6){
			// 	$$('.homeCamera').css('display','block');
			// }else{
			// 	$$('.homeCamera').css('display','none');
			// }
			$$('.homeCamera').css('display','none');
			myApp.toast('账号已过期,请重新登录', 'error').show(true);
			
			// var nowView = myApp.getCurrentView();
			// nowView.router.loadPage('login.html')
			myApp.getCurrentView().loadPage('login.html');
			
			
		}
	}
	myApp.hidePreloader();
	return;
});


	

	$$(document).on('ajaxError', function(e) {
		myApp.hidePreloader();
	});
	// 合浦(正式库)
	// var loginPath = 'http://180.142.130.246:9010';
	// var basePath = 'http://180.142.130.246:9010/admin';
	// var filePath = 'http://180.142.130.246:8020/group1/';

	// 测试库
	var loginPath = 'http://120.24.51.37:9010';
	var basePath = 'http://120.24.51.37:9010/admin';
	var filePath = 'http://120.24.51.37/group1/';

	//  测试库(一期)
	// 	var basePath = 'http://192.168.11.80:8080/';
	// var basePath = 'http://120.24.51.37:91/';
	//  合浦(正式库一期)
	// 	var basePath =  'http://219.159.197.209:8099/';

	// 测试		
	// var loginPath = 'http://127.0.0.1:9010';		
	// var basePath = 'http://127.0.0.1:9010/admin';
		
	//	建辉电脑ip
	//		 var basePath = 'http://192.168.11.90:8081/';
	//	经理电脑ip
	//		var basePath = 'http://192.168.11.10:80/';
	
	var userId = parseInt(localStorage.getItem('userId')) || -1;
	var user = localStorage.getItem('user');
	var userDetail = localStorage.getItem('userDetail');
	var roleId = parseInt(localStorage.getItem('roleId'));
	var access_token = localStorage.getItem('access_token');
	var userType = localStorage.getItem('userType');
	// var userArr = localStorage.getItem('userArr')||{};
	var isLog = false;
	var userArr={};
	var departDetail={};

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
		isLog = true;
	}
	console.log(user);
	if(userDetail) {
		userDetail = JSON.parse(userDetail);
	}

	document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			if(window.StatusBar){
				
				StatusBar.overlaysWebView(true);
				StatusBar.backgroundColorByHexString('#E32519');
				StatusBar.styleBlackTranslucent();
			}
			
		}

	
	if(user){
		var tenantId = user.tenantId;
	}else{
		var tenantId = 'cddkjfdkdeeeiruei8888';
	}
	
	
	return {
		version: '4.4',
		myApp: myApp,
		basePath: basePath,
		mainView: mainView,
		userId: userId,
		roleId: roleId,
		user: user,
		userDetail:userDetail,
		headPic: headPic,
		userType:userType,
		access_token: access_token,
		router: Router,
		utils: Utils,
		loginPath:loginPath,
		ajaxLoadPageContent: ajaxLoadPageContent,
		ajaxLoadPageContent1:ajaxLoadPageContent1,
		ajaxWithHeader:ajaxWithHeader,
		pageStorageClear: pageStorageClear,
		back2Home: back2Home,
		back3Home: back3Home,
		removejscssfile:removejscssfile,
		getTime:getTime,
		isWeek:isWeek,
		filePath:filePath,
		getnowdata:getnowdata,
		isLog: isLog,
		userArr:userArr,
		departDetail:departDetail,
		tenantId: tenantId

		// currentdate:currentdate
		//		appKey: '1138161114178609#qsdj1114kwan',
		//		org_name: '1138161114178609',
		//		app_name: 'qsdj1114kwan',
		//		client_id: 'YXA6-C15oKoPEeaZwntwI1gMow',
		//		client_secret: 'YXA678tTjHSozZdRcn8QrGe-tscbVc8'
	};
});