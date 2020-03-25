define(['app',
	'hbs!js/hbs/branchList',
	'hbs!js/hbs/branchList2'
], function(app, template ,template1) {
	var $$ = Dom7;
	//滚动图接口
	var swiperPath = app.basePath + 'extHomePage/loadMobileFacebook';
	//支部风采标题接口
	var findClassifyTreePath = app.basePath + '/mobile/political/branch/template/list';
	//加载栏目的文章列表
	//var listPath = app.basePath + 'partyContent/findBranchIntroduction';
	var listPath = app.basePath + '/mobile/political/branch/content/';
	//保存支部位置信息
	var saveOrUpdatePath = app.basePath + '/mobile/political/branch/save/addr/';
	//查找单个支部位置信息
	var findInfPath = app.basePath + '/mobile/political/branch/';
	//
	var findSysCityPath = app.basePath + '/mobile/village/map/center';
	var firstIn = 1;
	var pageDataStorage = {};
	
	var pageNo={};
	var loading={};
	var loadingCount = {};
	
	var tabPosition = 0;
	
	var photoBrowserPhotos = [];
	
	var myScrollBranch;
	var left1 = 0;
	var left2 = 0;
	var left3 = 0;
	var count = 1;
	//屏幕宽度参数
	var phoneWidth = 0;
	
	var str = '';
	var str1 = '';
	
	var lat = 0.0;
	var lng = 0.0;
	var addr = '';
	
	var paramCount = 1;
	var sysCity = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("branch/myBranch", function(page){
			page.view.params.swipeBackPage = true;
		});
		initData(page.query);
		ajaxLoadContent(page);		
		app.back2Home();
		attrDefine();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {		
		phoneWidth = window.screen.width;
		 sysCity = '';
		paramCount = 1;
		firstIn = 1;
		pageDataStorage = {};
		photoBrowserPhotos = [];
		lat = 0.0;
		lng = 0.0;
		addr = '';
		str += '<div style="color:#9E9E9E;font-size:20px;margin-left:30%">--&nbsp;已经到底啦！--</div>';
		//地图
		str1 = '';
		str1 +=	'<div style="height: 450px;" id="gpsBranch">';
		str1 +=		'<div class="item-content">';
		str1 +=			'<div class="item-inner">';
		str1 +=				'<div class="item-title kp-label GPSPostion">';
		str1 +=					'<i class="icon icon-position1"></i>&nbsp;&nbsp;支部位置';
		str1 +=				'</div>';
		str1 +=				'<div style="display: block;margin-right:5px;" class="branchGPSUpload">';
		str1 +=					'<button id="baiduSearch"></button><input type="text" id="branchGPS" name="branchGPS" readonly="true"/>';
		str1 +=				'</div>';
		str1 +=			'</div>';
		str1 +=		'</div>';
		str1 +=		'<div id="allmap" style="width: 100%;height: 100%;overflow: hidden;font-family:"微软雅黑";"></div>';
		str1 += '</div>';
	}	

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.branchGPSUpload').on('click',function(){
			app.myApp.confirm('确定要保存地理位置吗？', function() {
				savaOrUploadLoc();
			});
		});
	}
	
	function findLoc(){
		app.ajaxLoadPageContent(findInfPath+app.user.deptId, {
		
		}, function(data) {
			console.log(data);
			if(data.data == '{}'){
				//getPosition()
			}else{
				lng = data.data.lng;
				lat = data.data.lat;
				$$('#branchGPS').val(data.data.addr);
			}
		});
	}
	
	function savaOrUploadLoc(){
		app.ajaxLoadPageContent(saveOrUpdatePath+app.user.deptId, {
			// deptId:,
			lat:lat,
			lng:lng,
			address:addr,
		}, function(data) {
			
			if(data.msg == 'success'){
				setTimeout(function(){
					app.myApp.alert('成功');
				},100);
			}else{
				setTimeout(function(){
					app.myApp.alert('失败');
				},100);
			}
		},{
			type:'POST'
		});
	}
	/*
	 * 标题栏滚动
	 */
	function iscrollTitle(){
		//一个li的长度为102px
		var branchListLength = parseInt(pageDataStorage['branchListLength'] * 87);
		console.log(branchListLength);
    	$$(".wrapperBranch ul").css('width',branchListLength+'px');
    	console.log(branchListLength<=phoneWidth);
    	if(branchListLength<=phoneWidth){
    		 myScrollBranch = new IScroll('.wrapperBranch', {scrollX: false, scrollY: false});
    		 myScrollBranch.hasHorizontalScroll = false;
    	}else{
    		 myScrollBranch = new IScroll('.wrapperBranch', {scrollX: true, scrollY: false});
    		 myScrollBranch.hasHorizontalScroll = true;
    	}
	   
	    if(myScrollBranch.maxScrollX != 0){
	    	localStorage.setItem('maxScrollXBranch', myScrollBranch.maxScrollX);
	    }
	    //再次调用让他等于他自己
		if(myScrollBranch.maxScrollX == 0){
			myScrollBranch.maxScrollX = parseInt(localStorage.getItem('maxScrollXBranch'));
			myScrollBranch.isInTransition = false;
		}
	   	myScrollBranch.crollerWidth = 612;
	   	myScrollBranch.wrapperHeight = 52;
	   	myScrollBranch.wrapperWidth = 360;
	    myScrollBranch.scrollToElement('.active',true,true);
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine() {

	}

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent(page) {
		//getWiper();
		getPatryList1(page);
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
				$$('.branchSwiper .swiper-wrapper').append(
					'<div class="swiper-slide homeSlider" data-id="'+item.id+'"data-isgood="'+item.isGood+'">' +
					'<img data-src="' + app.basePath + item.imgUrl + '" src="' + app.basePath + item.imgUrl + '" class="swiper-lazy">' +
					'<div class="slider-view">' + item.title + '</div>' +
					'</div>');
			});
			branchSwiper = app.myApp.swiper('.branchSwiper', {
				pagination: '.homePager2',
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
	 * type:模板类型，1为党支部模板、2为村社区模板
	 */
	function getPatryList1(page) {
		app.ajaxLoadPageContent(findClassifyTreePath, {
			deptId: app.user.deptId,
			type: 1
		}, function(data) {
			var data = data.data;
			console.log(data);
			pageDataStorage['branchListLength'] = data.length;
			pageDataStorage['partyList'] = data;
			handlePartyList1(data,page);	
		});
	}

	/**
	 * 加载标题栏
	 * @param {Object} data 数据
	 */
	function handlePartyList1(data,page) {
		var _data = data;
		console.log(_data);
		//获取catId
		$$.each(_data,function(index,item){
			//console.log(index);
			//console.log(_data[index].id);
			if(_data[index].hasSecondPage == false){
				_data[index].hasSecondPage = 0;
			}else{
				_data[index].hasSecondPage = 1;
			}
			pageDataStorage['hasSecondPage'+index] = _data[index].hasSecondPage;
			pageDataStorage['catId'+index] = _data[index].id;
		})
		for(var i=0;i<=pageDataStorage['branchListLength']-1;i++){
			var str ='';
			str += '<div class="swiper-slide homeSlider2"  data-number="'+i+'" style=" padding-top: 0px;width: 100%;height: 1000px;">';
			str += '<div class="page123">';
			str += '<div class="branch-list-type'+i+' page-content infinite-scroll pull-to-refresh-content" style="height: 1000px;padding-top: 0px;margin-top:-44px;background:">';
			str += '<div class="pull-to-refresh-layer" style="margin-top:0px">';
			str += '<div class="preloader">';
			str += '</div>';
			str += '<div class="pull-to-refresh-arrow">';
			str += '</div>';
			str += '</div>';
			str += '<div class="branchHome'+i+'" style="padding-bottom:500px;">';
			str += '</div>';
			str += '</div>';
			str += '</div>';
			str += '</div>'; 
			$$('.branchPage .homeSwiper2 .swiper-wrapper').append(str);
		}
		//触发绑定事件
		app.myApp.initPullToRefresh($('.page123'));
		app.myApp.initFastClicks($('.page123'));
		app.myApp.initPageInfiniteScroll($('.page123'));
		//定义参数
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			pageNo[i]=1;
		}
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			loading[i]=true;
		}
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			loadingCount[i]=true;
		}
		//向上刷新和下拉加载
		pushAndPull(page);
		
		//让其适应手机屏幕phoneWidth
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			$$('.branch-list-type'+i).css('width',phoneWidth+'px');
		}
				
		var patryList = [];
		if(_data) {
			$$.each(_data, function(index, item) {
				var party = {
					numbers:index,
					id:0,
					name:'',
					hasSecondPage:true
				}
				party.name = item.name;
				party.id = item.id;
				
				party.hasSecondPage = item.hasSecondPage;
				patryList.push(party);
			});

			console.log(patryList)
			$$('.wrapperBranch ul').html(template(patryList));
			$(".wrapperBranch li:first").addClass("active1");
		} else {
			app.myApp.alert('暂无数据');
		}
		//标题栏滚动
		iscrollTitle();
		//加载第一个，其第二个参数为0
		partyGetList1(false, 0, 1);
		//初始化滑动
		homeSwiper2 = app.myApp.swiper('.homeSwiper2', {
			pagination: '.homePager',
			speed: 800,
			onSlideChangeStart: function(swiper){
				//console.log(swiper.slidesGrid.length);
				for(var i=0;i<=swiper.slidesGrid.length;i++){
					if(swiper.activeIndex != 0){
						//console.log($$('.branchSwiper'));
						$$('.branchSwiper').css('display','none');
						$('.branchSwiper').slideUp(400);
					}else{
						if($('.branch-list-type0')[0].scrollTop != 0){
							$('.branchSwiper').slideUp(400);
						}
						if($('.branch-list-type0')[0].scrollTop == 0){
							$$('.branchSwiper').css('display','block');
						}
					}
					if(swiper.activeIndex == i){
						$$($$(".wrapperBranch li").children())[i].click();
					}
				}
			}
		});
		//点击标题栏
		$$($$(".wrapperBranch li").children()).on('click',showPartyView);
		
		//当滑动的时候触发
		scroll(function(direction) {
			if(direction == 'up') {
				$('.branchSwiper').slideDown(400);
			} else {
				$('.branchSwiper').slideUp(400);
			} 
		});
		function scroll(fn) {
			$(".branch-list-type0").on("touchstart", function(e) {
	　　　　		startX = e.originalEvent.changedTouches[0].pageX,
　　　　			startY = e.originalEvent.changedTouches[0].pageY;
			});
		　　$(".branch-list-type0").on("touchmove", function(e) {
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
		$(".sidelineBranch").stop(true);
		tabPosition = $$(this).parent().data('index');
		$$('.branchPage .swiper-wrapper').css('transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-webkit-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-moz-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-o-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-ms-transition-duration','800ms');
		console.log(tabPosition);
		for(var i=0;i<=pageDataStorage['branchListLength']-1;i++){
			if(tabPosition != 0){
				$$('.gpsBranch').css('display','none');
			}else{
				$$('.gpsBranch').css('display','block');
			}
			if(tabPosition == i){
				left1 = 85*i;
				left2 = 10;
				if(tabPosition != 0){
					left2 = (-45)*i/2;
				}
				left3 = phoneWidth*i;
				myScrollBranch.scrollTo(left2,0,800);
				if(loadingCount[i] == 1 && i != 0){
					partyGetList1(false,i);
					loadingCount[i] += 1;
				}			
			}
		}
		$$('.branchPage .swiper-wrapper').css('transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.branchPage .swiper-wrapper').css('-webkit-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.branchPage .swiper-wrapper').css('-moz-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.branchPage .swiper-wrapper').css('-o-transform','translate3d(-'+left3+'px, 0px, 0px)');
		$$('.branchPage .swiper-wrapper').css('-ms-transform','translate3d(-'+left3+'px, 0px, 0px)');
		
     	$(".sidelineBranch").animate({left:left1},300);
     	
		if($(".wrapperBranch li").hasClass('active1')){
			$(".wrapperBranch li").removeClass('active1');
		}
		$$(this).parent().addClass("active1");
	}
		
	//获取文章列表 模板类型，1为党支部模板、2为村社区模板
	function partyGetList1(isLoadMore,i) {
		console.log(i)
		console.log(typeof i)
		i = parseInt(i);
		temId = parseInt(i+1)
		app.ajaxLoadPageContent1(listPath + temId, {
			// type:1
			pageNo: pageNo[i],
			deptId:app.user.deptId,
			villageId:pageDataStorage['catId'+i],
			hasSecondPage:pageDataStorage['hasSecondPage'+i]
		}, function(result) {
			var data = result.data;
			console.log(data);
			//确定没有信息并且是第一页的时候
			if(data.content.length == 0 && pageNo[i] == 1){
				$$('.branchHome'+i).html(template1());
			}
			else{
				pageDataStorage['partyGetList'+i] = data.content;
				handlePartyGetList1(data, isLoadMore,i);
			}
		});
	}
	/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList1(data, isLoadMore,i) {
		console.log(data)
		if(data.content) {
			if(isLoadMore == true) {
				if(data.hasSecondLevel == false){
					console.log(data)
					$$('.branchHome'+i).append(data.content.content);
				}else{
					console.log(data)
					$$('.branchHome'+i).append(template1(data.content.content));
				}
			} else{
				if(data.hasSecondLevel == false){
					console.log(paramCount);
					if(i != 2 ){
						
						var divImg = "";
						if(data.content.coverImg != null && data.content.coverImg != ""){
							var coverImg = data.content.coverImg;
							divImg = '<img src="'+  coverImg + '" alt="" style="max-width:100%" width="100%" height="100%"/>';
						}
						console.log(data)
						$$('.branchHome'+i).html(divImg + data.content.content);
					}else{
						console.log(data)
						$$('.branchHome'+i).html(data.content.content);
					}
					if(paramCount == 1){
						console.log(paramCount)
						var token = localStorage.getItem('access_token');
						console.log(token)
						// var headers = {
						// 	Authorization: bearer+' ' +token
						// };
						// console.log(headers)
						setTimeout(function(){
							$$('.branchHome'+i).append(str1);
							$.ajax({
								url : findSysCityPath,
								headers: {
									Authorization: "bearer "+token
								},
								data : {
									// level : 2,
									// level : queryStr,
									tenantId : app.tenantId
								},
								success : function(data) {
									var data = data;

									// var json = $.parseJSON(data);
									if (data.msg=='success' && data.data != null) {
										sysCity = data.data.sysCity;
										mapBranch();
									}else{
										sysCity = '合浦县';
										mapBranch();
									}
								},
								error : function() {
								}
							});
							clickEvent();
						},500);
						paramCount += 1;
					}	
				}else{
					
					$$.each(data.content,function(index, item){
						item.createDate = app.getnowdata(item.createDate);
						item.coverImg = app.filePath + item.coverImg;
					})
					console.log(data.content)
					$$('.branchHome'+i).html(template1(data.content));
				}
			}
			//点击文章事件
			$$('.branchCard').on('click', partyContentHandle);
			loading[i] = false;
		} else {

		}
	}

	
	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		var title = $$(this).data('title');
		var content = $$(this).data('content');
		var createDate = $$(this).data('createDate');
		
		app.myApp.getCurrentView().loadPage('branchDetail.html?id=' + catalogId + '&content='+content+'&title='+title+'&createDate='+createDate);
	}
	
	/*
	 * 地图
	 */
	function mapBranch(){
		// 百度地图API功能
		var map = new BMap.Map("allmap");    // 创建Map实例
		//map.centerAndZoom("合浦",15); // 设置地图显示的城市 
		console.log(sysCity);
		map.centerAndZoom(sysCity, 15); // 显示地图中心城市和地图等级
		map.enableScrollWheelZoom(true);     // 开启鼠标滚轮缩放
		var top_left_navigation = new BMap.NavigationControl();  //右下角，添加默认缩放平移控件
		map.addControl(top_left_navigation); 
		// 添加定位控件
		var geolocationControl = new BMap.GeolocationControl({anchor: BMAP_ANCHOR_TOP_RIGHT});
		geolocationControl.addEventListener("locationSuccess", function(e){
		    // 移动至地图中心点
		    getPosition();
		    setTimeout(function(){
		    	 map.centerAndZoom(new BMap.Point(lng, lat), 15);
		    },500)
		});
		geolocationControl.addEventListener("locationError",function(e){
		    // 定位失败事件
		    //app.myapp.alert(e.message);
		});
		map.addControl(geolocationControl);    
		var point, marker, label;
		map.addEventListener("tilesloaded",function(){
			map.clearOverlays();
			if(firstIn == 1){
				//单个支部位置信息
				findLoc();
				firstIn += 1;
				setTimeout(function(){
					point = new BMap.Point(lng,lat);
					marker = new BMap.Marker(point);  // 创建标注
//					console.log(lng);
//					console.log(lat);
					map.addOverlay(marker);              // 将标注添加到地图中
					label = new BMap.Label(app.user.deptName,{offset:new BMap.Size(20,-10)});
					marker.setLabel(label);
				},200);
			}else{
				point = new BMap.Point(map.getCenter().lng, map.getCenter().lat);
				lng = map.getCenter().lng;
				lat = map.getCenter().lat;
				marker = new BMap.Marker(point);  // 创建标注
				map.addOverlay(marker);              // 将标注添加到地图中
				label = new BMap.Label(app.user.deptName,{offset:new BMap.Size(20,-10)});
				marker.setLabel(label);
			}
			GetAddress();
		});
	}
	
	
	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
//				timeout: 2000,
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true
			});
		}
	}
	function onErrorPosition(e) {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			app.myApp.showPreloader('定位中...');
			if(e.code == '3'){
				signStatus = 2;
				var map = new BMap.Map();
				var point = new BMap.Point(116.331398,39.897445);
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
						onSuccessPosition(r);
					}
					else {
						app.myApp.alert('failed:'+this.getStatus());
					}        
			    },{enableHighAccuracy: true})
			}else{
				app.myApp.alert('请打开GPS定位');
			}
		}
	}
	function onSuccessPosition(position) {
		app.myApp.hidePreloader();
		if(signStatus == 1){
			var _lng = position.coords.longitude;
			var _lat = position.coords.latitude;
		}else if(signStatus == 2){
			var _lng = position.point.lng;
			var _lat = position.point.lat ;
		}
		//拿到GPS坐标转换成百度坐标
		app.ajaxLoadPageContent('https://api.map.baidu.com/ag/coord/convert', {
			from: 0,
			to: 4,
			x: _lng,
			y: _lat
		}, function(data) {
			lng = app.utils.base64decode(data.x);
			lat = app.utils.base64decode(data.y);
			GetAddress();
		}, {
			type: 'GET',
		});
	}
	/*
	 * 根据坐标获取中心点地址
	 */
	function GetAddress() {
		var _SAMPLE_ADDRESS_POST = app.utils.getAddressPost();
		_SAMPLE_ADDRESS_POST += "&location=" + lat + "," + lng;
		app.ajaxLoadPageContent(_SAMPLE_ADDRESS_POST, {
			
		}, function(data) {
			renderReverse(data);
		}, {
			type: 'GET',
		});
//		app.myApp.hidePreloader();
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			addr = userPosition;
			$$('#branchGPS').val(userPosition);
		}
	}	
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent={};
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			ptrContent[i] = $$(page.container).find('.pull-to-refresh-content.branch-list-type'+i);
		}
		$$.each(ptrContent, function(index, item) {
			ptrContent[index].on('refresh', function(e) {
				setTimeout(function() {
					pageNo[index] = 1;
					loading[index] = true;
					//这里写请求
					partyGetList1(false,index);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
		});

		//滚动加载
		var loadMoreContent={};
		for(var i=0;i<=pageDataStorage['branchListLength'];i++){
			loadMoreContent[i] = $$(page.container).find('.branch-list-type'+i);
		}
		$$.each(loadMoreContent, function(index, item) {
			loadMoreContent[index].on('infinite', function() {
				if(loading[index]) return;
				loading[index] = true;
				pageNo[index] += 1;
				partyGetList1(true,index);
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
		resetFirstIn: resetFirstIn,
	}
});