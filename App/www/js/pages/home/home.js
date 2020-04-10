define(['app',
	'hbs!js/hbs/party2',
	'hbs!js/hbs/partyList2',
	'hbs!js/hbs/homeApplication'
], function(app, template ,template1,appList) {
	var $$ = Dom7;
	//轮播图接口
	var swiperPath = app.basePath + '/mobile/political/content/loadMobileFacebook';
	//首页列表接口
	var partyPath = app.basePath + '/mobile/political/catalog/icon';
	//检查更新接口
	var findVersionPath = app.basePath + '/mobile/apkEdition/check/update';
	//查询用户自定义皮肤
	var find = app.basePath + '/mobile/userSetting/';
	//退出请求接口
	var exitPath = app.basePath + '/auth/exit';
	//登陆接口
	// var loginPath = app.basePath + '/auth/authLogin';
	var loginPath = 'http://219.159.197.209:8099/auth/authLogin';
	//点赞接口
	var goodPath = app.basePath + '/extGood/saveGood';
	//加载主栏目的文章列表
	var listPath = app.basePath + '/mobile/political/content/columnArticles';
	//每日一学s
	var studyEveryDayPath = app.basePath + '/mobile/course/content/push/';
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo=1;
	var loading=true;
	var patryList = [];
	var photoBrowserPhotos = [];
	var timeOutID;
	var phoneWidth = 0;
	var str = '';
	var alreadyCheckVersionFlag = false;
	var alreadyLoginFlag = false;
	var alreadyShowStudyDialogFlag = false;
	var alreadyGetStudyData = false;
	var alreadyGetNewList = false;
	var studyTimeCount = 0;
	var studyData;
	// var homeSwiper = null;
	// var tenantId = 'cddkjfdkdeeeiruei8888';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		// app.tenantId = tenantId;
		if(app.tenantId == null || app.tenantId == undefined ||app.tenantId == '' ){
			app.tenantId = 'cddkjfdkdeeeiruei8888'
		}
		// console.log('page')
		// console.log(page)
		initData(page.query);
		ajaxLoadContent(page);		
		app.back2Home();
		attrDefine();
		//点击搜索
		$$('.searchNews').on('click',function(){
			app.myApp.getCurrentView().loadPage('searchNews.html');
		});
		//新闻速递只给管理员，党组织管理员和乡镇管理员（3，4，5）
		// if(app.roleId == 4 || app.roleId == 5 || app.roleId ==6){
		// 	$$('.homeCamera').css('display','block');
		// }else{
		// 	$$('.homeCamera').css('display','none');
		// }
		// $$('.homeCamera').css('display','block');
		//新增文章
		$$('.icon-camera1').on('click',function(){
			app.myApp.getCurrentView().loadPage('newsAdd.html');
		})
		
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		//用户验证
		verifyTheUser();
		//确定当前用户的皮肤
		colorConfirm();
		// $$('.user-header1 img').attr('src','../../../img/newIcon/home_title.png');
		// $$('.user-header1 img').attr('alt', 'home.js');
		
		$$('.user-header1').on('click',function(){
			setTimeout(function(){
				$$('.userXiabiao').click();
			},100)
			
		});
		
		phoneWidth = window.screen.width;
		firstIn = 0;
		pageDataStorage = {};
		patryList = [];
		photoBrowserPhotos = [];
		timeOutID = null;
		
		str += '<div style="color:#9E9E9E;font-size:20px;margin-left:30%">--&nbsp;已经到底啦！--</div>'
	}
	
	// 登录后刷新
	function refreshLogin(){

		// console.log($$('#homeTopSwiper'));
		// 	console.log($$('#homeTopSwiper')[0].children);
		// 	console.log($$('#homeTopSwiper')[0].children.length);

		// if($$('#homeTopSwiper')[0].children.length < 5){
		// 	getWiper();
		// }

		
		console.log('登录后刷新');
		partyGetList(false);
		// getPatryList();
	}
	
	//点赞刷新
	function refreshHome(cId){
		pageNo = 1;
		loading = true;
		console.log('点赞刷新')
		partyGetList(false);
		app.myApp.pullToRefreshDone();
	}
	
	/*
	 * 验证用户
	 */
	function verifyTheUser(){
		var userstr = localStorage.getItem('user');
		var userDetailStr = localStorage.getItem('userDetail');

		var user = JSON.parse(userstr);
		var userDetail = JSON.parse(userDetailStr);
		if(userDetail ){
			if(userDetail.avatar && userDetail.avatar != null ){
				app.headPic = app.filePath + userDetail.avatar;
				$$('.user-header img').attr('src', app.headPic);
				localStorage.setItem('headPic', app.headPic);
			}
		}
		
		// app.tenantId = user.tenantId;
		app.userType = localStorage.getItem('userType');
		app.userId = localStorage.getItem('userId');
		if(localStorage.getItem('verify') != '1'){
				localStorage.setItem('verify','-1');
			}
			$$('.homeCamera').css('display','none');
		if(user == -1 || user ==''|| user == null){
			app.isLog = false;
			// console.log('1--')
			alreadyLoginFlag = false;
			app.userId = -1;
			app.user = '';
			app.userDetail = '';
			app.roleId = -1;
			app.headPic = 'img/icon/icon-user_d.png';
			
			localStorage.setItem('headPic', app.headPic);
			localStorage.setItem('userId', -1);
			localStorage.setItem('user', '-1');
			localStorage.setItem('userDetail', '-1');
			localStorage.setItem('access_token', null);
			localStorage.setItem('roleId', -1);
			localStorage.setItem('password', null);
			localStorage.setItem('lastStudyDay', 0);
			//把主题设置为默认的，移除css
			app.removejscssfile('blue.css','css');
			app.removejscssfile('green.css','css');
			// app.myApp.toast('密码错误！', 'error').show(true);
			// app.myApp.getCurrentView().loadPage('login.html');
			// $$('.user-header1 img').attr('src', app.headPic);
			// $$('.user-header1 img').attr('src', '../../../img/newIcon/home_title.png');
			// $$('.user-header1 img').attr('alt', 'home.js');
			// if(app.roleId == 4 || app.roleId == 5 || app.roleId == 6){
			// 	$$('.homeCamera').css('display','block');
			// }else{
			// 	$$('.homeCamera').css('display','none');
			// }
			
			// app.myApp.getCurrentView().loadPage('login.html');
			// app.myApp.toast('请登录', 'error').show(true);

		}else{
			// console.log('2--')
			
			app.user = user;
			app.userDetail = userDetail;
			// app.userId = userDetail.userId;
			app.access_token=user.access_token;
			// app.roleId = user.roles;
			app.roleId = app.user.roleId;
			alreadyLoginFlag = true;
			app.isLog = true;
			// app.roleId = 1;
			// app.headPic = 'img/icon/icon-user_d.png';
		}



		
	}
	
	function getStudyEveryDayData(){
		// console.log(app.user)
		if(app.user == -1 || app.user ==''|| app.user == null|| app.user == undefined){
			return;
		}else{
			
		app.ajaxLoadPageContent(studyEveryDayPath+app.userId, {
				// userId:app.userId
				}, function(data) {
					
					if(data.code == 0){
						// console.log(data);
						studyData = data.data;
						alreadyGetStudyData = true;
						var curDay = app.utils.getCurTime().split(" ")[0];
						if(app.isLog == true){
							alreadyLoginFlag = true;
						}	
						var today = app.utils.getCurTime().split(" ")[0];
						if(today == localStorage.getItem('updateTime')) {
							// console.log('今天已经检查完毕');
							alreadyCheckVersionFlag = true;
						}
									
						showStudyEveryDayDialog();
						// setTimeout(showStudyEveryDayDialog(),1000);
					}
					
				});
	}
		}
		
	
	/**
	 * 展示每日一学弹出框
	 */
	function showStudyEveryDayDialog(){

		
		// // console.log(alreadyGetNewList)
		var curDay = app.utils.getCurTime().split(" ")[0];
		if(curDay == localStorage.getItem('lastStudyDay')){
			return;
		}else if(app.isLog && alreadyLoginFlag && alreadyGetStudyData && alreadyGetNewList && alreadyCheckVersionFlag ){
			// console.log('弹出框')
			setTimeout(function(){
				if(studyData != null && studyData != undefined && JSON.stringify(studyData) != "{}"){
					localStorage.setItem('lastStudyDay',curDay);
					app.myApp.alert(studyData.contentTitle, '每日一学',function () {
				    	app.myApp.getCurrentView().loadPage('dailyLearning.html');
					});
				}
			},1000);
		}
		// else {
		// 	setTimeout(showStudyEveryDayDialog(),1000);
		// }
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine() {
		if(app.myApp.device.ipad) {
			$$('.homeSwiper').css('height', '50%');
		} else if(app.myApp.device.android) {
			//让手机的顶部变色
			//StatusBar.backgroundColorByHexString("#ED4C3C");
		}
		

	}

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent(page) {
		//注册android的返回键事件
		document.addEventListener("backbutton", onBackKeyDown, false);
		
		getWiper();
		// 待定partyGetList
		// // console.log('待定partyGetList')
		// partyGetList(false)
		//先检查更新
		// 暂时注释
		
		checkUpdate();
		
		

		getPatryList(page);
		
		//获取每日一学数据
		// getStudyEveryDayData();
//		showStudyEveryDayDialog();
		
	}

	/**
	 * 获取滚动页
	 */
	function getWiper() {
	// console.log(pageDataStorage['wiper'])

	if(pageDataStorage['wiper']){
		// $$('.homeSwiper .swiper-wrapper').html('');
		// $$('.homeSwiper .swiper-pagination').html('');
		
	}
	app.ajaxLoadPageContent(swiperPath, {
			catalogId:2,
			size:5,
			// tenantId: app.tenantId
			tenantId: app.tenantId
		}, function(data) {
			// console.log(data);
			pageDataStorage['wiper'] = data.data;
			pageDataStorage['partyFirstId'] = data.id;
			handleWiper(data.data);
		},{
			type:'GET',
			dataType:'json'
	});
	
	}

	/**
	 *  加载滚动页
	 * @param {Object} data 滚动页数据
	 */
	function handleWiper(data) {
		if(data) {
			photoBrowserPhotos = [];
			var datas = data;
			// patryList = [];
			// for(var i= 0;i< datas.length;i++){
			// 	if(datas[i].titlePic==null||datas[i].titlePic=='after-title'){
			// 		datas.splice(i,1);
			// 	}
				
			// }

			// // console.log(datas);
			$$.each(datas, function(index, item) {
				// // console.log('item')
				// // console.log(item)
				
				var images = {
					url: app.filePath + item.titlePic,
					caption: item.title,
					html:'<span class="photo-browser-zoom-container"><img src="'+app.filePath + item.titlePic+'"></span><input type="hidden" class="homeId" value="'+item.id+'"/>'
				};
				photoBrowserPhotos.push(images);

				

				$$('.homeSwiper .swiper-wrapper').append(
					'<div class="swiper-slide homeSlider" data-id="'+item.id+'"data-isgood="'+item.isGood+' data-type= 1">' +
					'<img data-src="' + app.filePath + item.titlePic + '" src="' + app.filePath + item.titlePic + '" class="swiper-lazy">'
					 +
					'<div class="slider-view" style="padding:5px 5px 5px 5px;">' + item.title + '</div>' +
					'</div>'
					);
			});

			// console.log($$('#homeTopSwiper'));
			// console.log($$('#homeTopSwiper')[0].children);
			// console.log($$('#homeTopSwiper')[0].children.length);
			

			homeSwiper = app.myApp.swiper('.homeSwiper', {
				pagination: '.homePager1',
				speed: 800,
				autoplay: 3000,
				autoplayDisableOnInteraction: false,
				loop: true,
			});
			
			//photoBrowser图片浏览器
			var photoBrowserPopup = app.myApp.photoBrowser({
				photos: photoBrowserPhotos,
				theme: 'dark',
				backLinkText: '关闭',
				type: 'popup',
			});

			$$('.homeSlider').on('click', function() {
				var index = $$(this).index() - 1;
				if(index > 4){
					//跳回第一张index设置为0
					index = 0;
				}else if(index == -1){
					//从第一张跳回最后一张index设置为4
					index = 4;
				}
				var type = 1;
				app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + $$($$(this)[0]).data('id') +'&cid='+pageDataStorage['partyFirstId']+'&type='+type);
				//photoBrowserPopup.open(index);
				$$('.photo-browser-zoom-container').on('click',function(){
					//需要点击两次
					$$('.photo-browser-close-link').click();
					$$('.photo-browser-close-link').click();
					
					app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + $$(this).next('.homeId').val() +'&cid='+pageDataStorage['partyFirstId']+'&type='+type);
				})
			});
		}
	}

	/**
	 * 获取标题栏 
	 */
	function getPatryList(page) {
		// console.log(app.tenantId);
		app.ajaxLoadPageContent(partyPath, {
			tenantId:app.tenantId
			// tenantId: 'cddkjfdkdeeeiruei8888'
		}, function(data) {
			// console.log('获取标题栏')
			// console.log(data)
			pageDataStorage['partyList'] = data.data;
			handlePartyList(data.data);
			
		},{
			
			dataType:'json'
		});
	}

	/**
	 * 加载标题栏
	 * @param {Object} data 数据
	 */
	function handlePartyList(data) {
		var _data = data;
		if(_data) {
			$$.each(_data, function(index, item) {
				var party = {
					numbers:index,
					id: 0,
					catalogIcon: '',
					catalogName: '',
					catalogUrl:'',
					basePath: app.basePath,
					hasChilds:false,
					childs:[],
				};
				party.id = item.id;
				party.catalogName = item.catalogName;
				if(item.catalogIcon){
					party.catalogIcon = app.filePath+item.catalogIcon;
				}
				
				party.hasChilds = item.haschild;
				if(item.haschild){
					party.childs = item.children;
				}
				party.catalogUrl = item.catalogUrl;
				// party.hasChilds = item.children!=null;
				// if(item.childs != null){
					// party.childs = item.children;
				// 	party.hasChilds = true;
				// }else{
				// 	party.hasChilds = false;
				// }
				patryList.push(party);
			});
		}
		// console.log('patryList-----')
		// console.log(patryList)
		if(patryList.length>8){
			
			// var n=Math.ceil(patryList.length/8)
			// $$.each(n,(index,item)=>{
			// 	var patryList''+''item = patryList.slice(0,item*8);
			// })
			
			var patryList1=patryList.slice(0,8);
			var patryList2=patryList.slice(8,16);
			
		$$('.homeListmin1').html(appList(patryList1));
		$$('.homeListmin2').html(appList(patryList2));
		
		}else{
			$$('.homeListmin1').html(appList(patryList))
		}
		
		// $$('.homeList').html(appList(patryList))
//		showStudyEveryDayDialog();
		$$('.homeListApp').on('click',showDetail);
		// console.log('加载标题栏')
		partyGetList(false);

	}

	function showDetail(){
		// console.log('$$(this)')
		// console.log($$(this))
		// console.log($$(this).data('title'))
		// console.log($$(this).data('cChild'))
		var id = $$(this).data('id');
		var title = $$(this).data('title');
		var curl = $$(this).data('cUrl');
		var cChild = $$(this).data('cChild');

		// 跳转方式不同看cChild,就是hasChilds
		if(cChild){
			// console.log('2')
			var list=[];
			// console.log('patryList')
			// console.log(patryList)
			$.each(patryList,function(index,item){

				if(item.id == id){
					// console.log(item.id == id)
					$.each(item.childs,function(index,item1){
						
						var party1 = {
							id: 0,
							catalogName: '',
							catalogUrl:'',
							catalogIcon:'',
							basePath: app.basePath,
							dataFirst:'',
						};
						party1.id = item1.id;
						party1.catalogName = item1.catalogName;
						party1.catalogUrl = item1.catalogUrl;
						if(party1.catalogIcon){
							party1.catalogIcon = item1.catalogIcon;
						}else{
							party1.catalogIcon = 'img/newIcon/background3.png'
						}
						
						// 标题
						if(item1.data){
							// console.log(item1.data)
							if(JSON.parse(JSON.stringify(item1.data))[0]){
								// console.log('3')
								party1.dataFirst = JSON.parse(JSON.stringify(item1.data))[0].title;
							}
						}
						

						
						list.push(party1);
					});
					// console.log('list===')
					// console.log(list)
					
					var result = [];
				 	var obj = {};
				   for(var i =0; i<list.length; i++){
				      if(!obj[list[i].id]){
				         result.push(list[i]);
				         obj[list[i].id] = true;
				      }
					}
					list = result;
					// console.log('list2===')
					// console.log(result)
					// $$.each(list, function(index, item){
					// 	if(item.indexOf(arr[i])==-1){
					// 		hash.push(arr[i]);
					// 	   }
					// })
				}
			});
			app.myApp.getCurrentView().loadPage('partyList2.html?id='+id+'&title='+title+'&List='+JSON.stringify(list));
		}
		if(curl != '' && curl != undefined){
			app.myApp.getCurrentView().loadPage(curl+'?appName='+title);
		}
		if(curl == undefined && curl != ''){
			// console.log("curl == undefined && curl != ''--远程教育，通知公告，组工动态，不忘初心牢记使命")
			app.myApp.getCurrentView().loadPage('partyList.html?id='+id+'&title='+title);
		}
		
	}


	/**
	 * android返回，退出APP
	 */
	function onBackKeyDown() {
		if($$('body').find('.modal')[0]) {
			$$('body').find('.modal .modal-button').click();
		} else if($$('body').find('.popup')[0]) {
			$$('body').find('.popup .close-popup').click();
		} else if($$('body').find('.popover')[0]) {

		} else if($$('body').find('.back')[0]) {
			if($(app.myApp.getCurrentView().container).find('.page').last().find('.back').length) {
				$$(app.myApp.getCurrentView().container).find('.back').click();
			}
		} else {
			app.myApp.toast('再按一次<br />退出系统', 'none').show(true);
			document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键  
			// 暂时注释 退出登录
			// document.addEventListener("backbutton", exitApp, false); //绑定退出事件  
			// 3秒后重新注册  
			var intervalID = window.setInterval(function() {
				window.clearInterval(intervalID);
				document.removeEventListener("backbutton", exitApp, false); // 注销返回键  
				document.addEventListener("backbutton", onBackKeyDown, false); // 返回键  
			}, 3000);
		}
	}
		
	/**
	 * 检查更新(一天一次)
	 */
	function checkUpdate() {
		// console.log('checkUpdate')
		var today = app.utils.getCurTime().split(" ")[0];
		if(today == localStorage.getItem('updateTime')) {
			// console.log('今天已经检查完毕');
			alreadyCheckVersionFlag = true;
			return;
		}

		
			var updateAjax;
			setTimeout(function() {
				updateAjax = $$.ajax({
					url: findVersionPath,
					dataType: 'json',
					method: 'GET',
					data: {
						tenantId: app.tenantId,
					},
					success: function(data) {
						// console.log('checkUpdate')
						// console.log(data)
						if(timeOutID) {
							window.clearTimeout(timeOutID);
						}
						timeOutID = null;
						
						if(data.msg == 'success') {
							localStorage.setItem('updateTime', today);
							// console.log(app.version);
							// console.log(data.data.appVersion);
							var size = data.data.appSize/1024/1024;
							if(app.version != data.data.appVersion) {
								if(app.myApp.device.ios) {
									setTimeout(function(){
										 app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + size.toFixed(2) + 'M<br />请留意App Store提醒</div>');
									},1200);
								} else {
									setTimeout(function(){
										app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + size.toFixed(2) + 'M，是否进行下载?</div>', function() {
										open(app.filePath + data.data.appUrl, '_system');
									});
									},1200);
								}
							}else{
								alreadyCheckVersionFlag = true;
									getStudyEveryDayData();
							}
							
							

						}
					},
					error: function() {
						alreadyCheckVersionFlag = true;
						// console.log('更新失败');
						if(timeOutID) {
							window.clearTimeout(timeOutID);
						}
						timeOutID = null;
					}
				});
	
				ajaxTimeOut(updateAjax);
			}, 4000);
		}
	
		//操作超时
		function ajaxTimeOut(ajaxVar) {
			timeOutID = setTimeout(function() {
				ajaxVar.abort();
				//app.myApp.alert('检查更新超时，请检查网络状态！');
			}, 5000);
	
		
		
	}

	function exitApp() {
		app.ajaxLoadPageContent(exitPath, {
			userId: app.userId,
		}, function(data) {
			navigator.app.exitApp();
		});
	}

	
	/*
	 * 确认当前用户的皮肤
	 */
	function colorConfirm(){
		if(app.user == ''||app.user==null){
			return;
		}
		var link = document.createElement( "link" ); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		app.ajaxLoadPageContent(find+app.userId, {
			
		}, function(data) {
			if(data.data){
				// console.log('更换肤色')
				// console.log(data)
				if(data.data.appSkin == 2){
					link.href = 'css/skin/blue.css';  
				}else if(data.data.appSkin == 3){
					link.href = 'css/skin/green.css';  
				}
			}
		
			document.getElementsByTagName( "head" )[0].appendChild( link );
		},{
			type:'GET'
		}
		);
	}
	
	
	//获取文章列表
	function partyGetList(isLoadMore) {
		app.ajaxLoadPageContent1(listPath, {
			// page: pageNo,
			// catalogId: 17,
			tenantId: app.tenantId,
			// tenantId: 'cddkjfdkdeeeiruei8888',
			current:pageNo
		}, function(result) {
			// console.log('获取文章列表')
			// console.log(result)
			var data = result;
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo == 1){
				$$('.homeList1').html(template1());
				$$('.infinite-scroll-preloader').remove();
			}else if(data.data.length == 0){
				$$('.infinite-scroll-preloader').remove();
				//$$('.homeList1').append(str);
			}else{
				$$('.infinite-scroll-preloader').remove();
				handlePartyGetList(data.data, isLoadMore);
			}
			alreadyGetNewList = true;
			// console.log('获取文章列表-每日一学');
			getStudyEveryDayData();
		},
		);
	}
	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			// console.log('partyData')
			// console.log(partyData)
			
			$$.each(partyData, function(index, item) {
				item.basePath = app.filePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentVolume || 0;
				item.goodTotal = item.goodTotal || 0;
				if(item.titlePic){
					item.titlePic = app.filePath+item.titlePic;
				}else{
					item.titlePic ='';
				}
				
				if(item.titlePic){
					var picArr = item.titlePic.split('.');
					var picType = picArr[picArr.length - 1];
					if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
						item.picType = 1;
						item.videoType = picType;
					} else {
						item.picType = 0;
					}
				}	
			});
			if(isLoadMore == true) {
				$$('.infinite-scroll-preloader').remove();
				$$('.homeList1').append(template1(partyData));
			} else{
				$$('.homeList1').html(template1(partyData));
			}
			if(data.length < 10 && pageNo == 1){
					$$('.infinite-scroll-preloader').remove();
			}
			//点击文章事件
			$$('.qs-party-card1').on('click', partyContentHandle);

			loading = false;
		} else {

		}
	}


	
	//文章列表的点击事件
	function partyContentHandle() {	
		var catalogId = $$(this).data('id');
		var cId = $$(this).data('catalogId');
		var isGood = $$(this).data('isgood');
		var type = $$(this).data('type');
		if(isGood == undefined){
			isGood = false;
		}	
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId +'&isGood='+isGood+'&cid='+cId+'&type='+type);
	}
	
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent = $$(page.container).find('.pull-to-refresh-content.homePage');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				// console.log('上下拉操作')
				partyGetList(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//滚动加载
		var loadMoreContent = $$(page.container).find('.homePage');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			// console.log('滚动加载')
			partyGetList(true);
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
		colorConfirm: colorConfirm,
		refreshHome: refreshHome,
		resetFirstIn: resetFirstIn,
		ajaxLoadContent: ajaxLoadContent,
		refreshLogin:refreshLogin
	}
});