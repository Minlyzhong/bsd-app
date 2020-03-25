define(['app','hbs!js/hbs/meetingList'], function(app, meetingListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//获取项目列表
	var checkSignPath = app.basePath + '/mobile/specialDeclare/list';

	var NewRecordKey = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		NewRecordKey = '';
		initData(page.query);
		app.back2Home();
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
		pageDataStorage = {};
		checkList(false, pageNo);
		
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.addMeeting').on('click', function() {
			app.myApp.getCurrentView().loadPage('processAdd.html');
		});

		$$('#ShowNewRecordSearch').on('focus',searchRecord);
		$$('.ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewRecordSearch').on('keyup', keyupContent);


		};
		function searchRecord(){
			pageNo1 = 1;
			loading1 = true;
			NewRecordKey='';
			$$(this).css('text-align', 'left');
			$$('.meetingListSearch ul').html('');
			$$('.firstPeopleNotFound').css('display', 'none');
			$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
			$$('.infinite-scroll.searchRecord').css('display', 'block');
			$$('.infinite-scroll.contentRecord').css('display', 'none');
		}
		function hideSearchList(){
			pageNo1 = 1;
			loading1 = true;
			NewRecordKey='';
			$$('#ShowNewRecordSearch').val('');
			$$('.firstPeopleNotFound').css('display', 'none');
			$$('.meetingListSearch ul').html('');
			$$('#ShowNewRecordSearch').css('text-align', 'center');
			$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
			$$('.infinite-scroll.searchRecord').css('display', 'none');
			$$('.infinite-scroll.contentRecord').css('display', 'block');
		}
		function keyupContent(){
			$$('.meetingListSearch ul').html('');
			NewRecordKey = $$('#ShowNewRecordSearch').val();
			console.log(NewRecordKey);
			if(!NewRecordKey) {
				return;
			}
			checkList1(false,pageNo1);
		}

	//获取会议列表
	function checkList(isLoadMore,pageNo) {
		app.ajaxLoadPageContent(checkSignPath, {
			userId: app.userId,
			size:10,
			current:pageNo
		}, function(data) {
			console.log(data);
			if(data.code == 0 && data.data !=null) {
				var meetingDate = data.data.records;
				$$.each(meetingDate,function(index, item){
					item.createdTime = item.createdTime.split(' ')[0];
					item.projectEndDate = item.projectEndDate.split(' ')[0];
					item.projectStartDate = item.projectStartDate.split(' ')[0];
					if(item.step < 6){
						
						item.step = parseInt(item.step) + 1;
					}else{
						item.status = 1;
					}

					
				})


				if(isLoadMore){
					console.log(meetingDate)
					$$('.meetingList ul').append(meetingListTemplate(meetingDate));
					loading = false;
				}else{
					console.log(meetingDate)
					$$('.meetingList ul').html(meetingListTemplate(meetingDate));
					loading = true;
				}
			}else{
				loading = true;
				$$('.meetingList ul').html("");
			}
			$$('.meetingList .card').click(function(){
				var id = $$(this).data('id');
				var pTitle = $$(this).data('title');
				var step = $$(this).data('step');
				app.myApp.getCurrentView().loadPage('processDetail.html?pId='+id+'&pTitle='+pTitle+'&step='+step);
			})
		});
	
	}


	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.addMeeting').on('click', function() {
			app.myApp.getCurrentView().loadPage('processAdd.html');
		});

		$$('#ShowNewRecordSearch').on('focus',searchRecord);
		$$('.ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewRecordSearch').on('keyup', keyupContent);


		};
		function searchRecord(){
			pageNo1 = 1;
			loading1 = true;
			NewRecordKey='';
			$$(this).css('text-align', 'left');
			$$('.meetingListSearch ul').html('');
			$$('.firstPeopleNotFound').css('display', 'none');
			$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
			$$('.infinite-scroll.searchRecord').css('display', 'block');
			$$('.infinite-scroll.contentRecord').css('display', 'none');
		}
		function hideSearchList(){
			pageNo1 = 1;
			loading1 = true;
			NewRecordKey='';
			$$('#ShowNewRecordSearch').val('');
			$$('.firstPeopleNotFound').css('display', 'none');
			$$('.meetingListSearch ul').html('');
			$$('#ShowNewRecordSearch').css('text-align', 'center');
			$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
			$$('.infinite-scroll.searchRecord').css('display', 'none');
			$$('.infinite-scroll.contentRecord').css('display', 'block');
		}
		function keyupContent(){
			$$('.meetingListSearch ul').html('');
			NewRecordKey = $$('#ShowNewRecordSearch').val();
			console.log(NewRecordKey);
			if(!NewRecordKey) {
				return;
			}
			checkList1(false,pageNo1);
		}

	//收搜获取会议列表
	function checkList1(isLoadMore,pageNo1) {
		app.ajaxLoadPageContent(checkSignPath, {
			userId: app.userId,
			size:10,
			current:pageNo1,
			query: NewRecordKey,
		}, function(data) {
			console.log(data);
			if(data.code == 0 && data.data !=null) {
				var meetingDate = data.data.records;
				$$.each(meetingDate,function(index, item){
					item.createdTime = item.createdTime.split(' ')[0];
					item.projectEndDate = item.projectEndDate.split(' ')[0];
					item.projectStartDate = item.projectStartDate.split(' ')[0];
					if(item.step < 6){
						
						item.step = parseInt(item.step) + 1;
					}else{
						item.status = 1;
					}

					
				})


				if(isLoadMore){
					console.log(meetingDate)
					$$('.meetingListSearch ul').append(meetingListTemplate(meetingDate));
					loading = false;
				}else{
					console.log(meetingDate)
					$$('.meetingListSearch ul').html(meetingListTemplate(meetingDate));
					loading = true;
				}
			}else{
				loading = true;
				$$('.meetingListSearch ul').html("");
			}
			$$('.meetingListSearch .card').click(function(){
				var id = $$(this).data('id');
				var pTitle = $$(this).data('title');
				var step = $$(this).data('step');
				app.myApp.getCurrentView().loadPage('processDetail.html?pId='+id+'&pTitle='+pTitle+'&step='+step);
			})
		});
	
	}

	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			checkList(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
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
				checkList(false,pageNo);
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
				checkList(true,pageNo);
			}else{
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				checkList1(true,pageNo1);
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
		resetFirstIn: resetFirstIn,
		refresh: refresh
	}
});