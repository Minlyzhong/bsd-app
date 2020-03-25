define(['app',
	'hbs!js/hbs/thereAndNineTitleList',
	'hbs!js/hbs/thereAndNineList2'
], function(app, template ,template1) {
	var $$ = Dom7;
	
	//三员九有标题接口
	var findClassifyTreePath = app.basePath + '/mobile/honor/grade';
	//三员九有列表
	var listPath = app.basePath + '/mobile/threeAndNine/list';
	//通过ID查询支部信息,获取villageId
	var departmentPath = app.basePath + '/mobile/political/department/';

	
	var firstIn = 1;
	var pageDataStorage = {};
	
	var pageNo={};
	var loading={};
	var loadingCount = {};
	
	var tabPosition = 0;
	var myScrollBranch;
	var left1 = 0;
	var left2 = 0;
	var left3 = 0;
	var count = 1;
	//屏幕宽度参数
	var phoneWidth = 0;
	
	var str = '';
	var str1 = '';
	
	var photoBrowserPhotoslist = {};
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var readonlyPicCount = 0;
	var photoDatas = [];
	var reWork = 0;
	var villageId = 0;
	
	var paramCount = 1;
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
		paramCount = 1;
		firstIn = 1;
		pageDataStorage = {};
		photoBrowserPhotos = [];
		reWork = 0;
		photoBrowserPopup = '';
		readonlyPicCount = 0;
		photoBrowserPhotoslist={};
		

		
		// str += '<div style="color:#9E9E9E;font-size:20px;margin-left:30%">--&nbsp;已经到底啦！--</div>';
		
	}	

	/**
	 * 点击事件
	 */
	function clickEvent() {
		
	}
	
	
	

	/*
	 * 标题栏滚动
	 */
	function iscrollTitle(){
		//一个li的长度为102px
		var branchListLength = parseInt(pageDataStorage['branchListLength'] * 86);
		console.log(branchListLength);
    	$$(".wrapperThere ul").css('width',branchListLength+'px');
    	console.log(branchListLength<=phoneWidth);
    	if(branchListLength<=phoneWidth){
    		 myScrollBranch = new IScroll('.wrapperThere', {scrollX: false, scrollY: false});
    		 myScrollBranch.hasHorizontalScroll = false;
    	}else{
    		 myScrollBranch = new IScroll('.wrapperThere', {scrollX: true, scrollY: false});
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

		getVillageId(page);
		// getPatryList1(page);
	}

	

	/**
	 * 获取村(社区)id
	 */

	function getVillageId(page){
		app.myApp.showPreloader('加载中...');
		app.ajaxLoadPageContent(departmentPath + app.user.deptId, {
			
		}, function(data) {
			if(data.code == 0 && data.data != null){
				console.log(data.villageId);
				villageId = data.data.villageId;
				getPatryList1(page);
				
			}
		});
		
	 }

	/**
	 * 获取标题栏 
	 * type:模板类型，1为党支部模板、2为村社区模板
	 */
	function getPatryList1(page) {
		app.myApp.showPreloader('加载中...');
		app.ajaxLoadPageContent(findClassifyTreePath, {
			code: 'SYJY',
		}, function(data) {
			var data = data.data;
			console.log(data);
			pageDataStorage['branchListLength'] = data.length;
			pageDataStorage['partyList'] = data;
			handlePartyList1(data,page);
			app.myApp.hidePreloader();	
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
			// if(_data[index].hasSecondPage == false){
			// 	_data[index].hasSecondPage = 0;
			// }else{
			// 	_data[index].hasSecondPage = 1;
			// }
			// pageDataStorage['hasSecondPage'+index] = _data[index].hasSecondPage;
			pageDataStorage['catId'+index] = _data[index].id;
		})
		for(var i=0;i<=pageDataStorage['branchListLength']-1;i++){
			var str ='';
			str += '<div class="swiper-slide homeSlider2"  data-number="'+i+'" style=" padding-top: 0px;width: 100%;height: 1000px;">';
			str += '<div class="page123">';
			str += '<div class="branch-list-type'+i+' page-content infinite-scroll pull-to-refresh-content" style="height: 1000px;padding-top: 0px;margin-top:-44px;background:rgba(241, 241, 241, 1);">';
			str += '<div class="pull-to-refresh-layer" style="margin-top:0px">';
			str += '<div class="preloader">';
			str += '</div>';
			str += '<div class="pull-to-refresh-arrow">';
			str += '</div>';
			str += '</div>';
			str += '<div class="branchHome'+i+'" style="padding-bottom:500px;background: rgba(241, 241, 241, 1);">';
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
					
				}
				party.name = item.subVal;
				party.id = item.subKey;
				
				// party.hasSecondPage = item.hasSecondPage;
				patryList.push(party);
			});

			console.log(patryList)
			$$('.wrapperThere ul').html(template(patryList));
			$(".wrapperThere li:first").addClass("active1");
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
						$$($$(".wrapperThere li").children())[i].click();
					}
				}
			}
		});
		//点击标题栏
		$$($$(".wrapperThere li").children()).on('click',showPartyView);
		
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
		$(".thereAndNineBranch").stop(true);
		tabPosition = $$(this).parent().data('index');
		$$('.branchPage .swiper-wrapper').css('transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-webkit-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-moz-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-o-transition-duration','800ms');
		$$('.branchPage .swiper-wrapper').css('-ms-transition-duration','800ms');
		console.log(tabPosition);
		for(var i=0;i<=pageDataStorage['branchListLength']-1;i++){
			
			if(tabPosition == i){
				left1 = 80*i;
				left2 = 2;
				if(tabPosition != 0 && tabPosition != 1){
					left2 = (-120)*i/2;
				}
				
				console.log('left2----'+left2)
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
		
     	$(".thereAndNineBranch").animate({left:left1},300);
     	
		if($(".wrapperThere li").hasClass('active1')){
			$(".wrapperThere li").removeClass('active1');
		}
		$$(this).parent().addClass("active1");
	}
		
	//获取文章列表 模板类型，1为党支部模板、2为村社区模板
	function partyGetList1(isLoadMore,i) {
		
		console.log(i)
		i = parseInt(i);
		temId = parseInt(i+1)
		app.ajaxLoadPageContent1(listPath, {
			
			pageNo: pageNo[i],
			type:temId,
			villageId:villageId
			
			// hasSecondPage:pageDataStorage['hasSecondPage'+i]
		}, function(result) {
			var data = result.data;
			console.log(data);
			//确定没有信息并且是第一页的时候
			if(data.length == 0 && pageNo[i] == 1){
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
		
		
		
		if(data) {

			if(isLoadMore == true) {
			
				
				$$('.branchHome'+i).append(template1(data));
				
			} else{
	
				$$('.branchHome'+i).html(template1(data));
				loading[i] = true
				}
			}

			$$.each(data, function(index , item){
				console.log(item.enclosures)
				console.log(item)
				if(item.enclosures.length>0){
					showReadonlyPhotos(item.enclosures,item.id);
					
				}else{
					$$('.thereAndNineCardPic_'+item.id).css('display','none');
				}
			})
			//点击文章事件
			// $$('.thereAndNineCard').on('click', partyContentHandle);
			loading[i] = false;
		
	}

	
	//文章列表的点击事件
	function partyContentHandle() {
		var catalogId = $$(this).data('id');
		var title = $$(this).data('title');
		var content = $$(this).data('content');
		var createDate = $$(this).data('createDate');
		
		app.myApp.getCurrentView().loadPage('branchDetail.html?id=' + catalogId + '&content='+content+'&title='+title+'&createDate='+createDate);
	}
	/**
	 * 显示相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList ,id) {
		console.log(picUrlList)
		console.log(id)
		console.log('.thereAndNicePic_'+id)
		photoBrowserPhotos=[];
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos.push(app.filePath + item.filePath);
			photoBrowserPhotoslist[id] = photoBrowserPhotos;
			var random = app.utils.generateGUID();
			console.log($$('.thereAndNicePic_'+id))
			var pic = $$('.thereAndNicePic_'+id);
			
			pic.append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item.filePath + '" class="picSize" />' +
				'</div>' +
				'</div>');
			
		
			$$('#img_' + random).on('click', function(e) {
				var picIndex = $$(this).parent().index();
				console.log(picIndex)
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotoslist[id],
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex);
			});
		});
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
				// pageNo[index] += 1;
				// partyGetList1(true,index);
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