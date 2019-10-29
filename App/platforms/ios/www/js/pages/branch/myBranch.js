define(['app',
	'hbs!js/hbs/party2',
	'hbs!js/hbs/partyList2'
], function(app, template ,template1) {
	var $$ = Dom7;
	//滚动图接口
	var swiperPath = app.basePath + 'extHomePage/loadMobileFacebook';
	//首页列表接口
	var partyPath = app.basePath + 'extHomePage/loadMobileHomeList';
	//检查更新接口
	var findVersionPath = app.basePath + 'extUserPage/findNewAppVersion';
	//查询用户自定义皮肤
	var find = app.basePath + 'userSetting/find';
	//退出请求接口
	var exitPath = app.basePath + 'auth/exit';
	//登陆接口
	var loginPath = app.basePath + 'auth/authLogin';
	//点赞接口
	var goodPath = app.basePath + 'extGood/saveGood';
	//加载栏目的文章列表
	var listPath = app.basePath + 'extContent/loadPagerByCatId';
	var firstIn = 1;
	var pageDataStorage = {};
	
	var pageNo={};
	var loading={};
	var loadingCount = {};
	
	var tabPosition = 0;
	
	var photoBrowserPhotos = [];
	var timeOutID;
	
	var myScroll;
	var left1 = 0;
	var left2 = 0;
	var left3 = 0;
	var count = 1;
	
	var phoneWidth = 0;
	
	var str = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		ajaxLoadContent(page);		
		app.back2Home();
		attrDefine();
		
		//点击搜索
		$$('.searchNews').on('click',function(){
			app.myApp.getCurrentView().loadPage('searchNews.html');
		})
		
		//新增文章
		$$('.icon-camera1').on('click',function(){
			app.myApp.getCurrentView().loadPage('newsAdd.html');
//			app.myApp.getCurrentView().loadPage('newsAddEditor.html');
		})
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		//用户验证
		verifyTheUser();
		//确定当前用户的皮肤
		colorConfirm();
		console.log('图片：'+app.headPic);
		$$('.user-header1 img').attr('src', app.headPic);
		
		$$('.user-header1').on('click',function(){
			setTimeout(function(){
				$$('.userXiabiao').click();
			},100)
			
		});
		
		phoneWidth = window.screen.width;
		firstIn = 0;
		pageDataStorage = {};
		
		photoBrowserPhotos = [];
		timeOutID = null;
		
		str += '<div style="color:#9E9E9E;font-size:20px;margin-left:30%">--&nbsp;已经到底啦！--</div>'
	}	
	
	//点赞刷新
	function refreshHome(cId){
		//console.log(cId);
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			if(cId == pageDataStorage['catId'+i] && cId != 2){
				pageNo[i] = 1;
				loading[i] = true;
				partyGetList(false,i);
			}	
		}
		app.myApp.pullToRefreshDone();
	}
	
	/*
	 * 标题栏滚动
	 */
	function iscrollTitle(){
		//一个li的长度为102px
		//var partyListLength = parseInt(pageDataStorage['partyListLength'] * 102);
		var partyListLength = parseInt(pageDataStorage['partyListLength'] * 87);
    	$$(".wrapper ul").css('width',partyListLength+'px');
	    myScroll = new IScroll('.wrapper', {scrollX: true, scrollY: false});
	    if(myScroll.maxScrollX != 0){
	    	localStorage.setItem('maxScrollX', myScroll.maxScrollX);
	    }
	    myScroll.hasHorizontalScroll = true;
	    //再次调用让他等于他自己
		if(myScroll.maxScrollX == 0){
			myScroll.maxScrollX = parseInt(localStorage.getItem('maxScrollX'));
			myScroll.isInTransition = false;
		}
	   	//myScroll.crollerWidth = 815;
	   	myScroll.crollerWidth = 612;
	   	myScroll.wrapperHeight = 52;
	   	myScroll.wrapperWidth = 360;
//	   	setTimeout(function(){
//	   		console.log(myScroll);
//	   	},1000);
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
						localStorage.setItem('user', '-1');
						localStorage.setItem('roleId', -1);
						localStorage.setItem('password', null);
						//把主题设置为默认的，移除css
						app.removejscssfile('blue.css','css');
						app.removejscssfile('green.css','css');
						app.myApp.toast('密码错误！', 'error').show(true);
						app.myApp.getCurrentView().loadPage('login.html');
						$$('.user-header1 img').attr('src', app.headPic);
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
		

	}

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent(page) {
		//注册android的返回键事件
		document.addEventListener("backbutton", onBackKeyDown, false);
		getWiper();
		getPatryList(page);
		checkUpdate();
	}

	/**
	 * 获取滚动页
	 */
	function getWiper() {
		app.ajaxLoadPageContent(swiperPath, {
			userId:app.userId,
		}, function(data) {
			pageDataStorage['wiper'] = data.data[0].data;
			pageDataStorage['partyFirstId'] = data.data[0].id;
			console.log(data.data[0].id);
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
					html:'<span class="photo-browser-zoom-container"><img src="'+app.basePath + item.imgUrl+'"></span><input type="hidden" class="homeId" value="'+item.id+'"/>'
				};
				photoBrowserPhotos.push(images);
				$$('.homeSwiper .swiper-wrapper').append(
					'<div class="swiper-slide homeSlider" data-id="'+item.id+'"data-isgood="'+item.isGood+'">' +
					'<img data-src="' + app.basePath + item.imgUrl + '" src="' + app.basePath + item.imgUrl + '" class="swiper-lazy">' +
					'<div class="slider-view">' + item.title + '</div>' +
					'</div>');
			});
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
					app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + $$(this).next('.homeId').val() +'&cId='+pageDataStorage['partyFirstId']);
				})
			});
		}
	}

	/**
	 * 获取标题栏 
	 */
	function getPatryList(page) {
		app.ajaxLoadPageContent(partyPath, {

		}, function(data) {
			pageDataStorage['partyListLength'] = data.data.length
			//console.log(pageDataStorage['partyListLength']);
			pageDataStorage['partyList'] = data.data;
			handlePartyList(data.data,page);
			
		});
	}

	/**
	 * 加载标题栏
	 * @param {Object} data 数据
	 */
	function handlePartyList(data,page) {
		var _data = data;
		console.log(_data);
		//获取catId
		$$.each(_data,function(index,item){
			pageDataStorage['catId'+index] = _data[index].id;
			//console.log(pageDataStorage['catId'+index]);
		})
		for(var i=0;i<=pageDataStorage['partyListLength']-1;i++){
			var str ='';
			str += '<div class="swiper-slide homeSlider1"  data-number="'+i+'" style=" padding-top: 0px;width: 100%;height: 1000px;">';
			str += '<div class="page">';
			str += '<div class="party-list-type'+i+' page-content infinite-scroll pull-to-refresh-content" style="height: 1000px;padding-top: 0px;">';
			str += '<div class="pull-to-refresh-layer" style="margin-top:0px">';
			str += '<div class="preloader">';
			str += '</div>';
			str += '<div class="pull-to-refresh-arrow">';
			str += '</div>';
			str += '</div>';
			str += '<div class="partyHome'+i+'" style="padding-bottom:570px;">';
			str += '</div>';
			str += '</div>';
			str += '</div>';
			str += '</div>'; 
			$$('.partyPage .homeSwiper1 .swiper-wrapper').append(str);
		}
		//触发绑定事件
		app.myApp.initPullToRefresh($('.page'));
		app.myApp.initFastClicks($('.page'));
		app.myApp.initPageInfiniteScroll($('.page'));
		//定义参数
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			pageNo[i]=1;
		}
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			loading[i]=true;
		}
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			loadingCount[i]=true;
		}
		//向上刷新和下拉加载
		pushAndPull(page);
		
		//让其适应手机屏幕phoneWidth
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			$$('.party-list-type'+i).css('width',phoneWidth+'px');
		}
				
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
			$(".wrapper li:first").addClass("active1");
		} else {
			app.myApp.alert('暂无数据');
		}
		
		//标题栏滚动
		iscrollTitle();
		
		//加载第一个，其第二个参数为0
		partyGetList(false,0);
		//初始化滑动
		homeSwiper1 = app.myApp.swiper('.homeSwiper1', {
			pagination: '.homePager',
			speed: 800,
			onSlideChangeStart: function(swiper){
				console.log(swiper.slidesGrid.length);
				for(var i=0;i<=swiper.slidesGrid.length;i++){
					if(swiper.activeIndex != 0){
						console.log($$('.homeSwiper'));
						$$('.homeSwiper').css('display','none');
						$('.homeSwiper').slideUp(400);
					}else{
						if($('.party-list-type0')[0].scrollTop != 0){
							$('.homeSwiper').slideUp(400);
						}
						if($('.party-list-type0')[0].scrollTop == 0){
							$$('.homeSwiper').css('display','block');
						}
					}
					if(swiper.activeIndex == i){
						$$($$(".wrapper li").children())[i].click();
					}
				}
			}
		});
		//点击标题栏
		$$($$(".wrapper li").children()).on('click',showPartyView);
		
		//当滑动的时候触发
		scroll(function(direction) {
			if(direction == 'up') {
				$('.homeSwiper').slideDown(400);
			} else {
				$('.homeSwiper').slideUp(400);
			} 
		});
		function scroll(fn) {
//			for(var i=0;i<=pageDataStorage['partyListLength'];i++){
//				$(".party-list-type"+i).on("touchstart", function(e) {
//		　　　　		startX = e.originalEvent.changedTouches[0].pageX,
//	　　　　			startY = e.originalEvent.changedTouches[0].pageY;
//				});
//			　　$(".party-list-type"+i).on("touchmove", function(e) {
//			　　　　moveEndX = e.originalEvent.changedTouches[0].pageX,
//			　　　　moveEndY = e.originalEvent.changedTouches[0].pageY,
//			　　　　X = moveEndX - startX,
//			　　　　Y = moveEndY - startY;
//					var beforeScrollTop = $(this)[0].scrollTop;
//					if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
//						if(beforeScrollTop == 0){
//							fn("up");
//						}else{
//							fn("down");
//						}
//					}else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
//			　　　　　　if(beforeScrollTop > 0){
//							fn("down");
//						}
//			　　　　}
//			　　});
//			}
			$(".party-list-type0").on("touchstart", function(e) {
	　　　　		startX = e.originalEvent.changedTouches[0].pageX,
　　　　			startY = e.originalEvent.changedTouches[0].pageY;
			});
		　　$(".party-list-type0").on("touchmove", function(e) {
		　　　　moveEndX = e.originalEvent.changedTouches[0].pageX,
		　　　　moveEndY = e.originalEvent.changedTouches[0].pageY,
		　　　　X = moveEndX - startX,
		　　　　Y = moveEndY - startY;
				var beforeScrollTop = $(this)[0].scrollTop;
				if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
					if(beforeScrollTop == 0){
						fn("up");
					}else{
						fn("down");
					}
				}else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
		　　　　　　if(beforeScrollTop > 0){
						fn("down");
					}
		　　　　}
		　　});
		}
	}

	/**
	 * 跳转到详情页面 
	 * @param {Object} e
	 */
	function showPartyView(e) {
		//stop() 方法停止当前正在运行的动画。
		$(".sideline").stop(true);
		//position() 方法返回匹配元素相对于父元素的位置
//		scrollToElement(el, time, offsetX, offsetY, easing)
		tabPosition = $$(this).parent().data('index');
		$$('.partyPage .swiper-wrapper').css('transition-duration','800ms');
		$$('.partyPage .swiper-wrapper').css('-webkit-transition-duration','800ms');
		$$('.partyPage .swiper-wrapper').css('-moz-transition-duration','800ms');
		$$('.partyPage .swiper-wrapper').css('-o-transition-duration','800ms');
		$$('.partyPage .swiper-wrapper').css('-ms-transition-duration','800ms');
		//console.log(tabPosition);
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			if(tabPosition != 0){
				$$('.homeSwiper').css('display','none');
				$('.homeSwiper').slideUp(400);
			}else{
				if($('.party-list-type0')[0].scrollTop != 0){
					$('.homeSwiper').slideUp(400);
				}
				if($('.party-list-type0')[0].scrollTop == 0){
					$$('.homeSwiper').css('display','block');
				}
			}
			if(tabPosition == i){
				//left1 = 100*i;
				left1 = 85*i;
				left2 = 10;
				if(tabPosition != 0){
					//left2 = (-125)*i/2;
					left2 = (-95)*i/2;
				}
				left3 = phoneWidth*i;
				myScroll.scrollTo(left2,0,800);
				//console.log(left3);
				if(loadingCount[i] == 1 && i != 0){
					partyGetList(false,i);
					loadingCount[i] += 1;
				}			
			}
		}
		
		$$('.partyPage .swiper-wrapper').css('transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.partyPage .swiper-wrapper').css('-webkit-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.partyPage .swiper-wrapper').css('-moz-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.partyPage .swiper-wrapper').css('-o-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.partyPage .swiper-wrapper').css('-ms-transform','translate3d(-'+left3+'px, 0px, 0px)');
		
     	$(".sideline").animate({left:left1},300);
     	
		if($(".wrapper li").hasClass('active1')){
			$(".wrapper li").removeClass('active1');
		}
		$$(this).parent().addClass("active1");
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
				data: {
					curVersion: app.version,
				},
				success: function(data) {
					console.log(data);
					if(timeOutID) {
						window.clearTimeout(timeOutID);
					}
					timeOutID = null;
					if(data.data.success) {
						localStorage.setItem('updateTime', today);
						if(app.version != data.data.appVersion) {
							if(app.myApp.device.ios) {
								setTimeout(function(){
								 	app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + data.data.appSize + 'M<br />请留意App Store提醒</div>');
								},1500);
							} else {
								setTimeout(function(){
									app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + data.data.appSize + 'M，是否进行下载?</div>', function() {
									open(app.basePath + data.data.appPath, '_system');
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
		app.ajaxLoadPageContent(find, {
			userId:app.userId,
		}, function(data) {
			if(data.appSkin==2){
				link.href = 'css/skin/blue.css';  
			}else if(data.appSkin==3){
				link.href = 'css/skin/green.css';  
			}
			document.getElementsByTagName( "head" )[0].appendChild( link );
		});
	}
	
	
	//获取文章列表
	function partyGetList(isLoadMore,i) {
//		console.log(pageDataStorage['catId'+i]);
//		console.log(pageNo[i]);
//		console.log(i);
		app.ajaxLoadPageContent1(listPath, {
			page: pageNo[i],
			catalogId: pageDataStorage['catId'+i],
			userId: app.userId
		}, function(result) {
			var data = result;
			console.log(data.data);
			//确定没有信息并且是第一页的时候
			if(data.data.length == 0 && pageNo[i] == 1){
				$$('.partyHome'+i).html(template1());
				$$('.infinite-scroll-preloader').remove();
			}
			else if(data.data.length == 0){
				$$('.infinite-scroll-preloader').remove();
				$$('.partyHome'+i).append(str);
			}
			else{
				$$('.infinite-scroll-preloader').remove();
				pageDataStorage['partyGetList'+i] = data.data;
				handlePartyGetList(data.data, isLoadMore,i);
			}
		});
	}
	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore,i) {
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
				$$('.infinite-scroll-preloader').remove();
				$$('.partyHome'+i).append(template1(partyData));
			} else{
				$$('.partyHome'+i).html(template1(partyData));
				//$$('.party-list-type').scrollTop(5, 0, null);
			}
			if(data.length < 10 && pageNo[i] == 1){
					$$('.infinite-scroll-preloader').remove();
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
			loading[i] = false;
		} else {

		}
	}

	
	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		var cId = $$(this).data('catalogId');
		var isGood = $$(this).data('isgood');
		if(isGood == undefined){
			isGood = false;
		}
		console.log(cId)
		app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + catalogId +'&isGood='+isGood+'&cId='+cId);
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent={};
		//$("tbody").on('click',"[name='submitbutton']",function(){....});
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			ptrContent[i] = $$(page.container).find('.pull-to-refresh-content.party-list-type'+i);
			//console.log(ptrContent[i]);
		}
		$$.each(ptrContent, function(index, item) {
			ptrContent[index].on('refresh', function(e) {
				setTimeout(function() {
					pageNo[index] = 1;
					loading[index] = true;
					//这里写请求
					partyGetList(false,index);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
		});

		//滚动加载
		var loadMoreContent={};
		for(var i=0;i<=pageDataStorage['partyListLength'];i++){
			loadMoreContent[i] = $$(page.container).find('.party-list-type'+i);
		}
		$$.each(loadMoreContent, function(index, item) {
			loadMoreContent[index].on('infinite', function() {
				if(loading[index]) return;
				loading[index] = true;
				pageNo[index] += 1;
				partyGetList(true,index);
			});
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
		iscrollTitle: iscrollTitle,
		resetFirstIn: resetFirstIn,
	}
});