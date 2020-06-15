define(['app',
	'hbs!js/hbs/jobFairList'
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//获取自己投递的历史记录
	var findLatestWorkLogPath = app.basePath + '/mobile/recruit/jobWanted/releaseList';

	// 检查用户是否已经创建简历
	var checkedCV = app.basePath + '/mobile/recruit/jobWanted/checked';

	var pageDataStorage = {}; 
	
	var NewRecordKey = '';
	var hasCV = false;
	
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
		hasCV = false;
		getCheckedCV();
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
		$$('.jobFairHistoryPage .jobApplyEdit').on('click',publibMove);
		//$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//$$('.saveRecord').on('click',publicR);
		
		$$('.jobFairHistoryPage #ShowNewRecordSearch').on('focus',searchRecord);
		$$('.jobFairHistoryPage .ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('.jobFairHistoryPage #ShowNewRecordSearch').on('keyup', keyupContent);
	}
	
	/**
	 * 检查是否已提交简历
	 */
	function getCheckedCV() {
		$$.ajax({
            url:checkedCV,
            method: 'PUT',
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: {userId: app.userDetail.userId},
            cache: false,
            success:function (data) {
            	console.log(data);
				if(data.code == 0){
					hasCV = data.data || false;
				}	
				
					
            },
            error:function () {
				app.myApp.toast("获取数据失败，请稍后再试！", 'none').show(true);
            }
        });
	}
	function searchRecord(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$(this).css('text-align', 'left');
		$$('.jobFairHistoryPage .firstShowPeopleList ul').html('');
		$$('.jobFairHistoryPage .firstPeopleNotFound').css('display', 'none');
		$$('.jobFairHistoryPage .ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
		$$('.jobFairHistoryPage .infinite-scroll.searchRecord').css('display', 'block');
		$$('.jobFairHistoryPage .infinite-scroll.contentRecord').css('display', 'none');
	}
	function hideSearchList(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$('.jobFairHistoryPage #ShowNewRecordSearch').val('');
		$$('.jobFairHistoryPage .firstPeopleNotFound').css('display', 'none');
		$$('.jobFairHistoryPage .firstShowPeopleList ul').html('');
		$$('.jobFairHistoryPage #ShowNewRecordSearch').css('text-align', 'center');
		$$('.jobFairHistoryPage .ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
		$$('.jobFairHistoryPage .infinite-scroll.searchRecord').css('display', 'none');
		$$('.jobFairHistoryPage .infinite-scroll.contentRecord').css('display', 'block');
	}
	function keyupContent(){
		$$('.jobFairHistoryPage .firstShowPeopleList ul').html('');
		NewRecordKey = $$('.jobFairHistoryPage #ShowNewRecordSearch').val();
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
		console.log(hasCV);
		if(hasCV){
			app.myApp.getCurrentView().loadPage('jobApplyHistory.html');
		}else{
			app.myApp.confirm('还未提交过简历, 是否创建简历？', function() {
				app.myApp.getCurrentView().loadPage('jobApply.html');
			});
		}
		
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

	
	function addCallback(){
		// 刷新检查是否已提交简历
		getCheckedCV();
	}

	
	
	/**
	 * 异步请求页面数据 
	 */
	function loadRecord(isLoadMore,pageNo) {
		// console.log(pageNo);
		// console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			userId: app.user.userId,
			current: pageNo,
			size: 10,
			// releaseId: 
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
			userId: app.user.userId,
			size: 10,
			current: pageNo1,
			query: NewRecordKey,
			
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item) {
				
			});
		
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 加载历史职位
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		if(data.length) {
			
			$$('.jobFairHistoryPage  .applyHistoryNotFount').css('display', 'none');
			if(isLoadMore) {
				$$('.jobFairHistoryPage .fsdList').append(vilDailyTemplate(data));
			} else {
				$$('.jobFairHistoryPage .fsdList').html(vilDailyTemplate(data));
			}
			$$('.jobFairHistoryPage .fsdList .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}
		} else if(data.length == 0 && pageNo == 1){
			
			$$('.jobFairHistoryPage  .applyHistoryNotFount').css('display', 'block');
		}else{
			if(!isLoadMore) {
				$$('.jobFairHistoryPage .recordList').html('');
			}
		}
	}
	
	/**
	 * 加载搜索工作日志
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			$$.each(data, function(index, item){
				$$('.jobFairHistoryPage  .firstPeopleNotFound').css('display', 'none');
				if(item.groupLeaderSign == null && item.personChargeSign == null && item.villagePersonCharge == null){
					item.isSign = 0;
				}else{
					item.isSign = 1;
				}
			})
			if(isLoadMore) {
				$$('.jobFairHistoryPage  .firstShowPeopleList ul').append(vilDailyTemplate(data));
			} else {
				$$('.jobFairHistoryPage  .firstShowPeopleList ul').html(vilDailyTemplate(data));
			}
			$$('.jobFairHistoryPage  .firstShowPeopleList ul .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading1 = false;
			}
		} else if(data.length == 0 && pageNo1 != 1){
			$$('.jobFairHistoryPage  .firstPeopleNotFound').css('display', 'none');
		}else{
			$$('.jobFairHistoryPage  .firstPeopleNotFound').css('display', 'block');
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var signId = $$(this).data('id');
		var userId = $$(this).data('userId');

		app.myApp.getCurrentView().loadPage('jobFairDetail.html?id=' + signId + '&userId=' + userId+'&type=1');
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
		addCallback: addCallback
	}
});