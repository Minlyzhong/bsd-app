define(['app',
	'hbs!js/hbs/party2',
	'hbs!js/hbs/partyList2'
], function(app, template ,template1) {
	var $$ = Dom7;
	//滚动图接口
	var swiperPath = app.basePath + '/mobile/political/content/loadMobileFacebook';
	//首页列表接口
	var partyPath = app.basePath + '/mobile/political/catalog/icon';
	//检查更新接口
	var findVersionPath = app.basePath + '/mobile/apkEdition/check/update';
	//查询用户自定义皮肤
	var find = app.basePath + '/mobile/userSetting/';
	//退出请求接口
	var exitPath = app.basePath + 'auth/exit';
	//登陆接口
	var loginPath = app.basePath + 'auth/authLogin';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';
	//加载栏目的文章列表
	var listPath = app.basePath + '/mobile/political/content/columnArticles';
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var pageNo1 = 1;
	var pageNo2 = 1;
	var pageNo3 = 1;
	var pageNo4 = 1;
	var pageNo5 = 1;
	var pageNo6 = 1;
	var loading = true;
	var loading1 = true;
	var loading2 = true;
	var loading3 = true;
	var loading4 = true;
	var loading5 = true;
	var loading6 = true;
	var loadingCount1 = 1
	var loadingCount2 = 1
	var loadingCount3 = 1
	var loadingCount4 = 1
	var loadingCount5 = 1
	var loadingCount6 = 1
	
	var tabPosition = 0;
	
	var photoBrowserPhotos = [];
	var timeOutID;
	var catId = 2;
	
	var myScroll;
	var left1 = 0;
	var count = 1;
	
	
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		
		initData(page.query);
		ajaxLoadContent();
		app.back2Home();
		attrDefine();
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		//用户验证
		//verifyTheUser();
		
		//确定当前用户的皮肤
		colorConfirm();
		
		//ZSrC9ZDCwrLOhh0rXLQjq3wZ
		//zQxFGN5M4AyZjU3yjQ8uVmH5
//		window.baidupush.startWork("zQxFGN5M4AyZjU3yjQ8uVmH5", function(info){
//				setTimeout(function(){
//					console.log(info.data.channelId);
//				},1000);
//		});
//		window.baidupush.listenNotificationClicked(function(info){
//			setTimeout(function(){
//				app.myApp.getCurrentView().loadPage('login.html');
//				app.myApp.alert(info.mid);
//			},1000);
//			
//		});

		firstIn = 0;
		pageDataStorage = {};
		catId = 2;
		pageNo = 1;
		pageNo1 = 1;
		pageNo2 = 1;
		pageNo3 = 1;
		pageNo4 = 1;
		pageNo5 = 1;
		pageNo6 = 1;
		loading = true;
		loading1 = true;
		loading2 = true;
		loading3 = true;
		loading4 = true;
		loading5 = true;
		loading6 = true;
		loadingCount1 = 1;
		loadingCount2 = 1;
		loadingCount3 = 1;
		loadingCount4 = 1;
		loadingCount5 = 1;
		loadingCount6 = 1;
		
		photoBrowserPhotos = [];
		timeOutID = null;
	}	
	
	/*
	 * 标题栏滚动
	 */
	function iscrollTitle(){
		//一个li的长度为102px
		var partyListLength = parseInt(pageDataStorage['partyListLength'] * 102);
    	$$(".wrapper ul").css('width',partyListLength+'px');
	    myScroll = new IScroll('.wrapper', {scrollX: true, scrollY: false});
	    if(myScroll.maxScrollX != 0){
	    	localStorage.setItem('maxScrollX', myScroll.maxScrollX);
	    }
	    myScroll.hasHorizontalScroll = true;
	    //再次调用让他等于他自己
		if(myScroll.maxScrollX == 0){
			console.log(myScroll.maxScrollX == 0);
			myScroll.maxScrollX = parseInt(localStorage.getItem('maxScrollX'));
			myScroll.isInTransition = false;
		}
	   	myScroll.crollerWidth = 815;
	    myScroll.scrollToElement('.active',true,true);
	}
	/*
	 * 验证用户
	 */
	function verifyTheUser(){
		if(localStorage.getItem('verify') != '1'){
			localStorage.setItem('verify','-1');
		}
		var loginName = localStorage.getItem('loginName');
		var password = localStorage.getItem('password');
		//没有登录不去检测
		if(password != 'null' && localStorage.getItem('verify') != '-1'){
				app.ajaxLoadPageContent(loginPath, {
						loginName: loginName,
						loginPwd: password
				}, function(data) {
					//console.log(data);
					if(data.success) {
						console.log('登陆了');
					}else{
						app.userId = -1;
						app.user = '';
						app.roleId = -1;
						app.headPic = 'img/icon/icon-user_d.png';
						$$('.user-header img').attr('src', app.headPic);
						localStorage.setItem('headPic', 0);
						localStorage.setItem('userId', -1);
						localStorage.setItem('user', ' ');
						localStorage.setItem('roleId', -1);
						localStorage.setItem('password', null);
						//把主题设置为默认的，移除css
						app.removejscssfile('blue.css','css');
						app.removejscssfile('green.css','css');
						app.myApp.toast('密码错误！', 'error').show(true);
						app.myApp.getCurrentView().loadPage('login.html');
					}
				});
		}else{
			
		}
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
		
		//当滑动的时候触发
		scroll(function(direction) {
			if(direction == 'up') {
				$('.homeSwiper').slideDown(400);
			} else {
				$('.homeSwiper').slideUp(400);
			} 
		});

		function scroll(fn) {
//			var beforeScrollTop = $('.partyPage')[0].scrollTop;
//				fn = fn || function() {};
//			$('.partyPage')[0].addEventListener("scroll", function() {
//				var afterScrollTop = $('.partyPage')[0].scrollTop,
//					delta = afterScrollTop - beforeScrollTop,
//					height = $('.partyPage').height();
//				if(afterScrollTop >= 0 && afterScrollTop <= height) {
//					beforeScrollTop = afterScrollTop;
//				} else {
//					delta = 0;
//				}
//				if(delta === 0) return false;
//				fn(delta > 0 ? "down" : "up");
//			}, false);
			var beforeScrollTop = $('.party-list-type')[0].scrollTop;
				fn = fn || function() {};
			$('.party-list-type')[0].addEventListener("scroll", function() {
				var afterScrollTop = $('.party-list-type')[0].scrollTop;	
				delta = afterScrollTop - beforeScrollTop;
				height = $('.party-list-type').height();
				if(afterScrollTop >= 0 && afterScrollTop <= height) {
					beforeScrollTop = afterScrollTop;
				} else{
					delta = 0;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
			var beforeScrollTop1 = $('.party-list-type1')[0].scrollTop;
				fn = fn || function() {};
			$('.party-list-type1')[0].addEventListener("scroll", function() {
				var afterScrollTop1 = $('.party-list-type1')[0].scrollTop;	
				delta = afterScrollTop1 - beforeScrollTop1;
				height1 = $('.party-list-type1').height();
				if(afterScrollTop1 >= 0 && afterScrollTop1 <= height1) {
					beforeScrollTop1 = afterScrollTop1;
				} else{
					delta = 0;
				}

				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
		}
	}

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent() {
		//注册android的返回键事件
		document.addEventListener("backbutton", onBackKeyDown, false);
		getWiper();
		getPatryList();
		// checkUpdate();
	}

	/**
	 * 获取滚动页
	 */
	function getWiper() {
		app.ajaxLoadPageContent(swiperPath, {
			size: 5,
			tenantId: app.tenantId
		}, function(data) {
			pageDataStorage['wiper'] = data.data[0].data;
			console.log(data.data[0].data);
			handleWiper(data.data[0].data);
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
			
			$$.each(datas, function(index, item) {
				var images = {
					url: app.basePath + item.imgUrl,
					caption: item.title,
					html:'<span class="photo-browser-zoom-container"><img src="'+app.basePath + item.imgUrl+'"></span><input type="hidden" class="homeId" value="'+item.id+'">'
				};
				photoBrowserPhotos.push(images);
				$$('.homeSwiper .swiper-wrapper').append(
					'<div class="swiper-slide homeSlider" data-id="'+item.id+'">' +
					'<img data-src="' + app.basePath + item.imgUrl + '" src="' + app.basePath + item.imgUrl + '" class="swiper-lazy">' +
					'<div class="slider-view">' + item.title + '</div>' +
					'</div>');
			});
			homeSwiper = app.myApp.swiper('.homeSwiper', {
				pagination: '.homePager',
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
				if(index>4){
					//跳回第一张index设置为0
					index=0;
				}else if(index == -1){
					//从第一张跳回最后一张index设置为4
					index = 4;
				}
				console.log(index);
				photoBrowserPopup.open(index);
				$$('.photo-browser-zoom-container').on('click',function(){
					//需要点击两次
					$$('.photo-browser-close-link').click();
					$$('.photo-browser-close-link').click();
					app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + $$(this).next('.homeId').val()+'&type=1');
				})

			});
		}
	}

	/**
	 * 获取标题栏 
	 */
	function getPatryList() {

		app.ajaxLoadPageContent(partyPath, {
			tenantId:app.tenantId
		}, function(data) {
			
			pageDataStorage['partyListLength'] = data.data.length
			console.log(pageDataStorage['partyListLength']);
			pageDataStorage['partyList'] = data.data;
			handlePartyList(data.data);
			
		});
	}

	/**
	 * 加载标题栏
	 * @param {Object} data 数据
	 */
	function handlePartyList(data) {
		var _data = data;
		console.log(_data);
		//获取catId
		$$.each(_data,function(index,item){
			pageDataStorage['catId'+index] = _data[index].id;
			console.log(pageDataStorage['catId'+index]);
		})
		console.log(pageDataStorage['catId0'])
		var patryList = [];
		if(_data) {
			$$.each(_data, function(index, item) {
				var party = {
					numbers:index,
					id: 0,
					catalogIcon: '',
					catalogName: '',
					creatTs: '',
					basePath: app.basePath,
					title: ''
				};
				party.id = item.id;
				party.catalogName = item.catalogName;
				party.catalogIcon = item.catalogIcon;
				if(item.data) {
					party.creatTs = item.data[0].creatTs;
					party.title = item.data[0].title;
				}
				patryList.push(party);
			});
			$$('.wrapper ul').html(template(patryList));
			$(".wrapper li:first").addClass("active");
			$$('.party-content').on('click',showPartyView);
		} else {
			app.myApp.alert('暂无数据');
		}
		
		//标题栏滚动
		iscrollTitle();
		//加载第一个
		partyGetList(false);
		//滑动
		homeSwiper1 = app.myApp.swiper('.homeSwiper1', {
				pagination: '.homePager',
				speed: 800,
				onSlideChangeStart: function(swiper){
					//console.log(swiper.activeIndex);
				      if(swiper.activeIndex == 0){
				      	$$($$(".wrapper li").children())[0].click();
				      }else if(swiper.activeIndex == 1){
				      	$$($$(".wrapper li").children())[1].click();
				      	if(loadingCount1 == 1){
				      		partyGetList1(false);
				      		loadingCount1 += 1;
				      	}
				      }else if(swiper.activeIndex == 2){
				      	$$($$(".wrapper li").children())[2].click();
				      	if(loadingCount2 == 1){
				      		partyGetList2(false);
				      		loadingCount2 += 1;
				      	}
				      }else if(swiper.activeIndex == 3){
				      	$$($$(".wrapper li").children())[3].click();
				      	if(loadingCount3 == 1){
				      		partyGetList3(false);
				      		loadingCount3 += 1;
				      	}
				      }else if(swiper.activeIndex == 4){
				      	$$($$(".wrapper li").children())[4].click();
				      	if(loadingCount4 == 1){
				      		partyGetList4(false);
				      		loadingCount4 += 1;
				      	}
				      }else if(swiper.activeIndex == 5){
				      	$$($$(".wrapper li").children())[5].click();
				      	if(loadingCount5 == 1){
				      		partyGetList5(false);
				      		loadingCount5 += 1;
				      	}
				      }else if(swiper.activeIndex == 6){
				      	$$($$(".wrapper li").children())[6].click();
				      	if(loadingCount6 == 1){
				      		partyGetList6(false);
				      		loadingCount6 += 1;
				      	}
				      }
				}
		});
	}

	/**
	 * 跳转到详情页面 
	 * @param {Object} e
	 */
	function showPartyView(e) {
		//stop() 方法停止当前正在运行的动画。
		$(".sideline").stop(true);
//		//nav_w=$(this).width();
//		//position() 方法返回匹配元素相对于父元素的位置
		tabPosition = $$(this).parent().data('index');
		console.log(tabPosition)
		$$('.partyPage .swiper-wrapper').css('transition-duration','800ms');
		$$('.a123').css('transition-duration','800ms');
		if(tabPosition == 0){
			left1 = 0;
			$$('.a123').css('transform','translate(0px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)');
			
		}else if(tabPosition == 1){
			left1 = 100;
			$$('.a123').css('transform','translate(0px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-360px, 0px, 0px)');
			if(loadingCount1 == 1){
	      		partyGetList1(false);
	      		loadingCount1 += 1;
	      	}
		}else if(tabPosition == 2){
			left1 = 200;
			$$('.a123').css('transform','translate(-65px, 0px)');		
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-720px, 0px, 0px)');
			if(loadingCount2 == 1){
	      		partyGetList2(false);
	      		loadingCount2 += 1;
	      	}
		}else if(tabPosition == 3){
			left1 = 300;
			$$('.a123').css('transform','translate(-165px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-1080px, 0px, 0px)');
			if(loadingCount3 == 1){
	      		partyGetList3(false);
	      		loadingCount3 += 1;
	      	}
		}else if(tabPosition == 4){
			left1 = 400;
			$$('.a123').css('transform','translate(-265px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-1440px, 0px, 0px)');
			if(loadingCount4 == 1){
	      		partyGetList4(false);
	      		loadingCount4 += 1;
	      	}
		}else if(tabPosition == 5){
			left1 = 500;
			$$('.a123').css('transform','translate(-310px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-1800px, 0px, 0px)');
			if(loadingCount5 == 1){
	      		partyGetList5(false);
	      		loadingCount5 += 1;
	      	}
		}else if(tabPosition == 6){
			left1 = 600;
			$$('.a123').css('transform','translate(-360px, 0px)');
			$$('.partyPage .swiper-wrapper').css('transform','translate3d(-2160px, 0px, 0px)');
			if(loadingCount6 == 1){
	      		partyGetList6(false);
	      		loadingCount6 += 1;
	      	}
		}
     	$(".sideline").animate({left:left1},300);
        
		//console.log(tabPosition);
		catId = $$(this).data('id');
		if($(".wrapper li").hasClass('active')){
			$(".wrapper li").removeClass('active');
		}
		$$(this).parent().addClass("active");
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
			document.addEventListener("backbutton", exitApp, false); //绑定退出事件  
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
		var today = app.utils.getCurTime().split(" ")[0];
//		if(today == localStorage.getItem('updateTime')) {
//			console.log('今天已经检查完毕');
//			return;
//		}
		var updateAjax;
		setTimeout(function() {
			updateAjax = $$.ajax({
				url: findVersionPath,
				dataType: 'json',
				method: 'GET',
				data: {
					// curVersion: app.version,
				},
				success: function(data) {
					console.log(data);
					if(timeOutID) {
						window.clearTimeout(timeOutID);
					}
					timeOutID = null;
					if(data.msg=='success') {
						localStorage.setItem('updateTime', today);
						if(app.version != data.data.appVersion) {
							if(app.myApp.device.ios) {
								setTimeout(function(){
								 	app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + data.data.appSize + 'M<br />请留意App Store提醒</div>');
								},1500);
							} else {
								setTimeout(function(){
									app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + data.data.appSize + 'M，是否进行下载?</div>', function() {
									open(app.filePath + data.data.appUrl, '_system');
								});
								},1500);
							}
						}
					} else {
						console.log('已经是最新版本');
					}
				},
				error: function() {
					console.log('更新失败');
					if(timeOutID) {
						window.clearTimeout(timeOutID);
					}
					timeOutID = null;
				}
			});

			ajaxTimeOut(updateAjax);
		}, 1000);
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
		var link = document.createElement( "link" ); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		app.ajaxLoadPageContent(find+app.userId, {
			// userId:app.userId,
		}, function(data) {
			if(data.appSkin==2){
				link.href = 'css/skin/blue.css';  
			}else if(data.appSkin==3){
				link.href = 'css/skin/green.css';  
			}
			document.getElementsByTagName( "head" )[0].appendChild( link );
			//console.log(data);
		});
	}
	
	
	//获取文章列表
	function partyGetList(isLoadMore) {
		console.log(pageDataStorage['catId0']);
		console.log(pageNo);
		app.ajaxLoadPageContent1(listPath, {
			current: pageNo,
			catalogId: pageDataStorage['catId0'],
			tenantId: app.tenantId
			// userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo == 1){
				$$('.party-list-type').html(template1());
			}else{
				pageDataStorage['partyGetList'] = data.data;
				handlePartyGetList(data.data, isLoadMore);
			}
		});
	}
	function partyGetList1(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo1,
			catalogId: pageDataStorage['catId1'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo1 == 1){
				$$('.party-list-type1').html(template1());
			}else{
				pageDataStorage['partyGetList1'] = data.data;
				handlePartyGetList1(data.data, isLoadMore);
			}
		});
	}
	function partyGetList2(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo2,
			catalogId: pageDataStorage['catId2'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo2 == 1){
				$$('.party-list-type2').html(template1());
			}else{
				pageDataStorage['partyGetList2'] = data.data;
				handlePartyGetList2(data.data, isLoadMore);
			}
		});
	}
	function partyGetList3(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo3,
			catalogId: pageDataStorage['catId3'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo3 == 1){
				$$('.party-list-type3').html(template1());
			}else{
				pageDataStorage['partyGetList3'] = data.data;
				handlePartyGetList3(data.data, isLoadMore);
			}
		});
	}
	function partyGetList4(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo4,
			catalogId: pageDataStorage['catId4'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo4 == 1){
				$$('.party-list-type4').html(template1());
			}else{
				pageDataStorage['partyGetList4'] = data.data;
				handlePartyGetList4(data.data, isLoadMore);
			}
		});
	}
	function partyGetList5(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo5,
			catalogId: pageDataStorage['catId5'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo5 == 1){
				$$('.party-list-type5').html(template1());
			}else{
				pageDataStorage['partyGetList5'] = data.data;
				handlePartyGetList5(data.data, isLoadMore);
			}
		});
	}
	function partyGetList6(isLoadMore){
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo6,
			catalogId: pageDataStorage['catId6'],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo6 == 1){
				$$('.party-list-type6').html(template1());
			}else{
				pageDataStorage['partyGetList6'] = data.data;
				handlePartyGetList6(data.data, isLoadMore);
			}
		});
	}
	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type').append(template1(partyData));
			} else {
				$$('.party-list-type').html(template1(partyData));
				//$$('.party-list-type').scrollTop(5, 0, null);
			}
			//点击文章事件
			$$('.qs-party-card1').on('click', partyContentHandle);

			//点击点赞
//			$$('.partyLike').on('click', function(e) {
//				var likeTotal = parseInt($$(this).find('.likeTotal').html());
//				var articleId = $$(this).parent().data('id');
//				var thisContent = this;
//				partyLike(articleId, likeTotal, thisContent);
//				e.stopPropagation();
//			});

			loading = false;
		} else {

		}
	}
	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList1(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type1').append(template1(partyData));
			} else {
				$$('.party-list-type1').html(template1(partyData));
				//$$('.party-list-type1').scrollTop(5, 0, null);
			}
			$$('.qs-party-card1').on('click', partyContentHandle);

			loading1 = false;
		} else {

		}
	}
	function handlePartyGetList2(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type2').append(template1(partyData));
			} else {
				$$('.party-list-type2').html(template1(partyData));
				//$$('.party-list-type2').scrollTop(5, 0, null);
			}
			$$('.qs-party-card1').on('click', partyContentHandle);

			loading2 = false;
		} else {

		}
	}
	function handlePartyGetList3(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type3').append(template1(partyData));
			} else {
				$$('.party-list-type3').html(template1(partyData));
				//$$('.party-list-type3').scrollTop(5, 0, null);
			}

			$$('.qs-party-card1').on('click', partyContentHandle);
			loading3 = false;
		} else {

		}
	}
	function handlePartyGetList4(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type4').append(template1(partyData));
			} else {
				$$('.party-list-type4').html(template1(partyData));
				//$$('.party-list-type4').scrollTop(5, 0, null);
			}

			$$('.qs-party-card1').on('click', partyContentHandle);
			loading4 = false;
		} else {

		}
	}
	function handlePartyGetList5(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type5').append(template1(partyData));
			} else {
				$$('.party-list-type5').html(template1(partyData));
				//$$('.party-list-type5').scrollTop(5, 0, null);
			}

			$$('.qs-party-card1').on('click', partyContentHandle);
			loading5 = false;
		} else {

		}
	}
	function handlePartyGetList6(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$.each(partyData, function(index, item) {
				item.basePath = app.basePath;
				item.forwardTotal = item.forwardTotal || 0;
				item.commentTotal = item.commentTotal || 0;
				item.goodTotal = item.goodTotal || 0;
				var picArr = item.titlePic.split('.');
				var picType = picArr[picArr.length - 1];
				if(picType == 'mp4' || picType == 'avi' || picType == 'ogg' || picType == 'webm') {
					item.picType = 1;
					item.videoType = picType;
				} else {
					item.picType = 0;
				}
			});
			if(isLoadMore == true) {
				$$('.party-list-type6').append(template1(partyData));
			} else {
				$$('.party-list-type6').html(template1(partyData));
				//$$('.party-list-type6').scrollTop(5, 0, null);
			}

			$$('.qs-party-card1').on('click', partyContentHandle);
			loading6 = false;
		} else {

		}
	}
	
	
	
	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		var isGood = $$(this).data('isgood');
		var type = $$(this).data('type')
		if(isGood == undefined){
			isGood = false;
		}
		console.log(catalogId);
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId +'&isGood='+isGood+'&type='+type);
	}

	//文章点赞
//	function partyLike(articleId, forwardTotal, thisContent) {
//		if(app.userId <= 0) {
//			app.myApp.getCurrentView().loadPage('login.html');
//			return;
//		} else {
//			app.ajaxLoadPageContent(goodPath, {
//				userId: app.userId,
//				articleId: articleId
//			}, function(data) {
//				console.log(data);
//				if(data.data.goodType == true) {
//					app.myApp.toast('已点赞！', 'success').show(true);
//					$$(thisContent).find('i').removeClass('icon-noCollect');
//					$$(thisContent).find('i').addClass('icon-collect');
//					$$(thisContent).find('.likeTotal').html(forwardTotal + 1);
//
//				} else {
//					app.myApp.toast('取消点赞！', 'none').show(true);
//					$$(thisContent).find('i').removeClass('icon-collect');
//					$$(thisContent).find('i').addClass('icon-noCollect');
//					$$(thisContent).find('.likeTotal').html(forwardTotal - 1);
//				}
//			});
//		}
//	}

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
				partyGetList(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.party-list-type');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			partyGetList(true);
		});
		var loadMoreContent1 = $$(page.container).find('.party-list-type1');
		loadMoreContent1.on('infinite', function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			partyGetList1(true);
		});
		var loadMoreContent2 = $$(page.container).find('.party-list-type2');
		loadMoreContent2.on('infinite', function() {
			if(loading2) return;
			loading2 = true;
			pageNo2 += 1;
			partyGetList2(true);
		});
		var loadMoreContent3 = $$(page.container).find('.party-list-type3');
		loadMoreContent3.on('infinite', function() {
			if(loading3) return;
			loading3 = true;
			pageNo3 += 1;
			partyGetList3(true);
		});
		var loadMoreContent4 = $$(page.container).find('.party-list-type4');
		loadMoreContent4.on('infinite', function() {
			if(loading4) return;
			loading4 = true;
			pageNo4 += 1;
			partyGetList4(true);
		});
		var loadMoreContent5 = $$(page.container).find('.party-list-type5');
		loadMoreContent5.on('infinite', function() {
			if(loading5) return;
			loading5 = true;
			pageNo5 += 1;
			partyGetList5(true);
		});
		var loadMoreContent6 = $$(page.container).find('.party-list-type6');
		loadMoreContent6.on('infinite', function() {
			if(loading6) return;
			loading6 = true;
			pageNo6 += 1;
			partyGetList6(true);
		});
	}

	/**
	 * 上下拉操作 
	 */
//	function pushAndPull(page) {
//		//下拉刷新
//		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
//		ptrContent.on('refresh', function(e) {
//			setTimeout(function() {
//				pageNo = 1;
//				loading = true;
//				//这里写请求
//				getPatryList();
//				app.myApp.pullToRefreshDone();
//			}, 500);
//		});
//	}
	
	
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		colorConfirm: colorConfirm,
		iscrollTitle: iscrollTitle,
		resetFirstIn: resetFirstIn,
	}
});