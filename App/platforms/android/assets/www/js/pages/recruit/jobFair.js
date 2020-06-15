define(['app',
	'hbs!js/hbs/jobFairList'
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//企业招聘信息发布列表
	var findLatestWorkLogPath = app.basePath + '/mobile/recruit/recruitList';
	// var findLatestWorkLogPath = app.basePath + '/mobile/worklog/page/list/';

	var pageDataStorage = {}; 
	
	var NewRecordKey = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		NewRecordKey = '';
		count = 0;
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
		pageNo1 = 1;
		loading1 = true;
		
		if(pageData.reloadOk != 1){
			loadRecord(false,pageNo);
		}
		
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.pageTitle').html(page.query.appName);	
	}

	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		
		//$$('.checkUpdate').on('click', checkUpdate);
		//showPhotos(pageDataStorage['recordContent'].photos);
		$$('.jobFairPage .applyHistory').on('click',publibMove);
		//$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//$$('.saveRecord').on('click',publicR);
		
		$$('.jobFairPage #ShowNewRecordSearch').on('focus',searchRecord);
		$$('.jobFairPage .ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('.jobFairPage #ShowNewRecordSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$(this).css('text-align', 'left');
		$$('.jobFairPage .firstShowPeopleList ul').html('');
		$$('.jobFairPage .firstPeopleNotFound').css('display', 'none');
		$$('.jobFairPage .ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
		$$('.jobFairPage .infinite-scroll.searchRecord').css('display', 'block');
		$$('.jobFairPage .infinite-scroll.contentRecord').css('display', 'none');
	}
	function hideSearchList(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$('#ShowNewRecordSearch').val('');
		$$('.jobFairPage .firstPeopleNotFound').css('display', 'none');
		$$('.jobFairPage .firstShowPeopleList ul').html('');
		$$('.jobFairPage #ShowNewRecordSearch').css('text-align', 'center');
		$$('.jobFairPage .ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
		$$('.jobFairPage .infinite-scroll.searchRecord').css('display', 'none');
		$$('.jobFairPage .infinite-scroll.contentRecord').css('display', 'block');
	}
	function keyupContent(){
		$$('.jobFairPage .firstShowPeopleList ul').html('');
		NewRecordKey = $$('#ShowNewRecordSearch').val();
		// console.log(NewRecordKey);
		if(!NewRecordKey) {
			return;
		}
		loadRecord1(false,pageNo1);
	}
	/**
	 *页面跳转 
	 */
	function publibMove(){
		app.myApp.getCurrentView().loadPage('jobFairHistory.html');
	}
	
	
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			loadRecord(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
	}

	
	
	
	
	/**
	 * 异步请求页面数据 
	 */
	function loadRecord(isLoadMore,pageNo) {
		// console.log(pageNo);
		// console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			// userId: app.user.userId,
			current: pageNo,
			size: 10,
			// tenantId: app.user.tenantId,			
//			query: NewRecordKey,
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item) {
				item.createTime = app.getnowdata(item.createTime);
			});
			// console.log(data);
			handleRecord(data, isLoadMore);			
		});
	}
	function loadRecord1(isLoadMore,pageNo1) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		// console.log(pageNo);
		// console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			// userId: app.user.userId,
			size: 10,
			current: pageNo1,
			query: NewRecordKey,
			
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item) {
				
			});
			// console.log(data);
			// if(data == ''){
			// 	$$('.jobFairPage .firstPeopleNotFound').css('display','none');
			// }
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 加载可申请的职位
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		if(data.length) {
			$$('.jobFairPage  .applyHistoryNotFount').css('display', 'none');
			$$.each(data, function(index, item){

				
			})


			if(isLoadMore) {
				$$('.jobFairPage .fsdList').append(vilDailyTemplate(data));
			} else {
				$$('.jobFairPage .fsdList').html(vilDailyTemplate(data));
			}
			$$('.jobFairPage .fsdList .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}
		} else if(data.length == 0 && pageNo == 1){
			$$('.jobFairPage  .applyHistoryNotFount').css('display', 'block');
		}else {
			if(!isLoadMore) {
				$$('.jobFairPage .recordList').html('');
			}
		}
	}
	
	/**
	 * 加载搜索
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			$$('.jobFairPage .firstPeopleNotFound').css('display', 'none');
			$$.each(data, function(index, item){

				
			})
			if(isLoadMore) {
				$$('.jobFairPage .firstShowPeopleList ul').append(vilDailyTemplate(data));
			} else {
				$$('.jobFairPage .firstShowPeopleList ul').html(vilDailyTemplate(data));
			}
			$$('.jobFairPage .firstShowPeopleList ul .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading1 = false;
			}
		} else if(data.length == 0 && pageNo1 != 1){
			$$('.jobFairPage .firstPeopleNotFound').css('display', 'none');
		}else{
			$$('.jobFairPage .firstPeopleNotFound').css('display', 'block');
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var jobId = $$(this).data('id');

		app.myApp.getCurrentView().loadPage('jobFairDetail.html?id=' + jobId);
	}

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
				loadRecord(false,pageNo);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(NewRecordKey==''){
				if(loading) return;
				loading = true;
				pageNo += 1;
				//这里写请求
				loadRecord(true,pageNo);
			}else{
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				loadRecord1(true,pageNo1);
			}
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
		refresh: refresh,
		resetFirstIn: resetFirstIn,
	}
});